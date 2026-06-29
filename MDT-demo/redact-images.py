#!/usr/bin/env python3
"""批量打码原始病历/检查报告图片，保证隐私信息不可还原。

打码策略（每一步都不可逆地丢失信息）：
  1. 缩小到 1/8 再放回原尺寸（永久信息损失）
  2. GaussianBlur(radius=24) 整图重模糊
  3. 上部 22% 区域绘制纯黑矩形（病历表头通常含姓名/住院号/床号）
  4. 中段额外画 3 条横向黑条覆盖姓名/身份证号常出现的行
  5. 右下叠加"已脱敏（不可还原）"水印
  6. JPEG quality=55 重新压缩 + 二次模糊

用法：
  python redact-images.py <input_dir> <output_dir>
  python redact-images.py "D:/对外/proposal/Roche/MDT/zht-case" "MDT-demo/redacted-images"
"""
from __future__ import annotations

import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SUPPORTED = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}


def redact(src: Path, dst: Path) -> None:
    """对单张图片做不可还原打码并保存到 dst。"""
    img = Image.open(src).convert("RGB")
    w, h = img.size

    # 1. 缩小到 1/8 后放回（永久损失高频细节）
    small = img.resize((max(1, w // 8), max(1, h // 8)), Image.BILINEAR)
    img = small.resize((w, h), Image.BILINEAR)

    # 2. 高斯模糊 radius=24
    img = img.filter(ImageFilter.GaussianBlur(radius=24))

    # 3-4. 黑条覆盖隐私区域
    draw = ImageDraw.Draw(img)
    # 上部 22% 整块黑（病历表头：医院 / 姓名 / 性别 / 年龄 / 住院号 / 床号）
    draw.rectangle([0, 0, w, int(h * 0.22)], fill=(0, 0, 0))
    # 中段额外 3 条黑条，覆盖常见的姓名 / 身份证号 / 联系方式行
    for ratio in (0.30, 0.42, 0.55):
        y = int(h * ratio)
        bar_h = max(18, int(h * 0.025))
        draw.rectangle([0, y, w, y + bar_h], fill=(0, 0, 0))

    # 5. 右下水印
    watermark = "已脱敏 · 不可还原"
    font_size = max(16, int(h * 0.022))
    try:
        font = ImageFont.truetype("msyh.ttc", font_size)
    except Exception:
        try:
            font = ImageFont.truetype("simsun.ttc", font_size)
        except Exception:
            font = ImageFont.load_default()
    # 测量文本框
    bbox = draw.textbbox((0, 0), watermark, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pad = max(8, int(h * 0.01))
    box_x0 = w - tw - pad * 3
    box_y0 = h - th - pad * 3
    draw.rectangle([box_x0, box_y0, w - pad, h - pad], fill=(220, 38, 38))
    draw.text((box_x0 + pad, box_y0 + pad), watermark, fill=(255, 255, 255), font=font)

    # 6. 二次模糊 + 低质量 JPEG 重压缩
    img = img.filter(ImageFilter.GaussianBlur(radius=6))
    dst.parent.mkdir(parents=True, exist_ok=True)
    # 强制 jpg 输出，体积小且二次压缩进一步丢信息
    out_path = dst.with_suffix(".jpg")
    img.save(out_path, "JPEG", quality=55, optimize=True)


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print(__doc__)
        return 2
    src_dir = Path(argv[1])
    dst_dir = Path(argv[2])
    if not src_dir.is_dir():
        print(f"[error] not a directory: {src_dir}", file=sys.stderr)
        return 1
    dst_dir.mkdir(parents=True, exist_ok=True)

    images = [p for p in src_dir.iterdir() if p.is_file() and p.suffix.lower() in SUPPORTED]
    if not images:
        print(f"[warn] no images found under: {src_dir}")
        return 0
    print(f"[info] processing {len(images)} image(s) from {src_dir}")
    print(f"[info] output to {dst_dir}")

    for i, src in enumerate(sorted(images), 1):
        dst = dst_dir / src.name
        try:
            redact(src, dst)
            print(f"  [{i:>3}/{len(images)}] {src.name} -> {dst.with_suffix('.jpg').name}")
        except Exception as e:
            print(f"  [{i:>3}/{len(images)}] FAILED {src.name}: {e}", file=sys.stderr)
            return 1
    print(f"[done] {len(images)} image(s) redacted")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
