import json
import hashlib
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "使用分析明细数据_统计范围至2026-02-22至2026-03-24.xlsx"
OUTPUT_DIR = ROOT / "data"
OUTPUT_FILE = OUTPUT_DIR / "dashboard-data.js"


def clean_text(value, fallback="未填写"):
    if pd.isna(value):
        return fallback
    text = str(value).strip()
    return text if text else fallback


PROVINCE_MAP = {
    "北京": "北京市",
    "北京市": "北京市",
    "上海": "上海市",
    "上海市": "上海市",
    "天津": "天津市",
    "天津市": "天津市",
    "重庆": "重庆市",
    "重庆市": "重庆市",
    "河北": "河北省",
    "河北省": "河北省",
    "山西": "山西省",
    "山西省": "山西省",
    "辽宁": "辽宁省",
    "辽宁省": "辽宁省",
    "吉林": "吉林省",
    "吉林省": "吉林省",
    "黑龙江": "黑龙江省",
    "黑龙江省": "黑龙江省",
    "江苏": "江苏省",
    "江苏省": "江苏省",
    "浙江": "浙江省",
    "浙江省": "浙江省",
    "安徽": "安徽省",
    "安徽省": "安徽省",
    "福建": "福建省",
    "福建省": "福建省",
    "江西": "江西省",
    "江西省": "江西省",
    "山东": "山东省",
    "山东省": "山东省",
    "河南": "河南省",
    "河南省": "河南省",
    "湖北": "湖北省",
    "湖北省": "湖北省",
    "湖南": "湖南省",
    "湖南省": "湖南省",
    "广东": "广东省",
    "广东省": "广东省",
    "海南": "海南省",
    "海南省": "海南省",
    "四川": "四川省",
    "四川省": "四川省",
    "贵州": "贵州省",
    "贵州省": "贵州省",
    "云南": "云南省",
    "云南省": "云南省",
    "陕西": "陕西省",
    "陕西省": "陕西省",
    "甘肃": "甘肃省",
    "甘肃省": "甘肃省",
    "青海": "青海省",
    "青海省": "青海省",
    "台湾": "台湾省",
    "台湾省": "台湾省",
    "内蒙": "内蒙古自治区",
    "内蒙古": "内蒙古自治区",
    "内蒙古自治区": "内蒙古自治区",
    "广西": "广西壮族自治区",
    "广西壮族自治区": "广西壮族自治区",
    "西藏": "西藏自治区",
    "西藏自治区": "西藏自治区",
    "宁夏": "宁夏回族自治区",
    "宁夏回族自治区": "宁夏回族自治区",
    "新疆": "新疆维吾尔自治区",
    "新疆维吾尔自治区": "新疆维吾尔自治区",
}


def normalize_province(value):
    text = clean_text(value)
    if text == "未填写":
        return text
    return PROVINCE_MAP.get(text, text)


MEDICAL_THEME_LIBRARY = {
    "血液肿瘤": {
        "diseases": ["多发性骨髓瘤", "弥漫大B细胞淋巴瘤", "急性髓系白血病", "CAR-T治疗"],
        "topics": ["复发难治治疗策略", "真实世界疗效评估", "生物标志物探索", "不良反应管理"],
    },
    "肝癌": {
        "diseases": ["肝细胞癌", "胆管癌", "肝癌免疫联合治疗", "围术期肝癌管理"],
        "topics": ["一线治疗优化", "术后复发风险分层", "免疫联合方案", "转化治疗路径"],
    },
    "肺癌": {
        "diseases": ["非小细胞肺癌", "小细胞肺癌", "EGFR突变肺癌", "肺癌脑转移"],
        "topics": ["耐药机制", "围术期治疗", "靶免联合", "真实世界路径管理"],
    },
    "乳腺癌": {
        "diseases": ["HER2阳性乳腺癌", "HR阳性乳腺癌", "三阴性乳腺癌", "乳腺癌辅助治疗"],
        "topics": ["精准分层", "新辅助疗效评估", "内分泌耐药", "ADC应用场景"],
    },
    "神经科学": {
        "diseases": ["阿尔茨海默病", "多发性硬化", "偏头痛", "帕金森病"],
        "topics": ["早筛与诊断", "疾病修饰治疗", "长期管理", "患者依从性"],
    },
    "肾病免疫": {
        "diseases": ["IgA肾病", "狼疮性肾炎", "ANCA相关性血管炎", "肾病综合征"],
        "topics": ["免疫治疗路径", "蛋白尿控制", "长期缓解策略", "真实世界管理"],
    },
    "呼吸": {
        "diseases": ["哮喘", "慢阻肺", "呼吸道感染", "嗜酸性粒细胞相关疾病"],
        "topics": ["分型管理", "急性加重预防", "长期控制", "吸入治疗优化"],
    },
    "眼科": {
        "diseases": ["糖网", "年龄相关性黄斑变性", "青光眼", "视网膜静脉阻塞"],
        "topics": ["长期随访", "抗VEGF方案", "视功能保护", "早期筛查"],
    },
    "流感": {
        "diseases": ["流感", "呼吸道病毒感染", "高危人群免疫保护", "院内感染防控"],
        "topics": ["疫苗保护效应", "快速诊断", "传播风险", "高危人群管理"],
    },
    "default": {
        "diseases": ["肿瘤免疫", "慢病管理", "感染防控", "精准诊疗"],
        "topics": ["真实世界研究", "临床路径优化", "高质量证据整合", "科研选题设计"],
    },
}

STUDY_TYPES = ["真实世界研究", "回顾性分析", "Meta分析", "综述研究", "病例队列研究", "机制探索研究"]
OUTPUT_TYPES = ["综述写作", "研究方案设计", "PPT汇报提纲", "基金申请框架", "病例汇报", "文献速读摘要"]
KEYWORD_CLUSTERS = ["免疫治疗", "生物标志物", "疗效评估", "安全性管理", "指南更新", "研究设计"]


def stable_pick(options, seed, salt):
    digest = hashlib.md5(f"{seed}|{salt}".encode("utf-8")).hexdigest()
    index = int(digest[:8], 16) % len(options)
    return options[index]


def infer_domain(department):
    dept = clean_text(department)
    for key in MEDICAL_THEME_LIBRARY:
        if key != "default" and dept.startswith(key):
            return key
    return "default"


def synthesize_medical_fields(row):
    domain = infer_domain(row["所在部门"])
    library = MEDICAL_THEME_LIBRARY[domain]
    seed = "|".join(
        [
            clean_text(row["用户名"]),
            clean_text(row["操作分类"]),
            clean_text(row["操作详情"]),
            clean_text(row["所在部门"]),
            str(row["操作时间"]),
        ]
    )
    disease = stable_pick(library["diseases"], seed, "disease")
    topic = stable_pick(library["topics"], seed, "topic")
    study_type = stable_pick(STUDY_TYPES, seed, "study")
    output_type = stable_pick(OUTPUT_TYPES, seed, "output")
    keyword = stable_pick(KEYWORD_CLUSTERS, seed, "keyword")
    search_query = f"{disease} {topic} {study_type}"
    theme_cluster = f"{disease} / {topic}"
    content_focus = f"{output_type} · {keyword}"
    return {
        "diseaseArea": disease,
        "researchTopic": topic,
        "studyType": study_type,
        "outputType": output_type,
        "keywordCluster": keyword,
        "searchQuery": search_query,
        "themeCluster": theme_cluster,
        "contentFocus": content_focus,
    }


def top_counts(frame, column, limit=10):
    series = frame[column].value_counts().head(limit)
    return [{"name": str(name), "value": int(value)} for name, value in series.items()]


def distribution(frame, column):
    series = frame[column].value_counts()
    return [{"name": str(name), "value": int(value)} for name, value in series.items()]


def build_payload(df):
    df = df.copy()
    df["操作时间"] = pd.to_datetime(df["操作时间"])
    df["日期"] = df["操作时间"].dt.strftime("%Y-%m-%d")
    df["小时"] = df["操作时间"].dt.hour
    df["星期"] = df["操作时间"].dt.day_name()

    text_columns = [
        "操作分类",
        "操作详情",
        "用户名",
        "姓名",
        "用户身份",
        "所在部门",
        "账号类型",
        "省份",
        "城市",
        "医院等级",
        "是否T100",
        "职称",
        "使用对象",
        "负责同事姓名",
        "销售大区",
    ]
    for column in text_columns:
        df[column] = df[column].apply(clean_text)
    df["省份"] = df["省份"].apply(normalize_province)

    records = []
    for row in df.itertuples(index=False):
        medical = synthesize_medical_fields(row._asdict())
        records.append(
            {
                "category": row.操作分类,
                "detail": row.操作详情,
                "userId": row.用户名,
                "name": row.姓名,
                "role": row.用户身份,
                "department": row.所在部门,
                "accountType": row.账号类型,
                "province": row.省份,
                "city": row.城市,
                "hospitalLevel": row.医院等级,
                "t100": row.是否T100,
                "title": row.职称,
                "target": row.使用对象,
                "owner": row.负责同事姓名,
                "region": row.销售大区,
                "timestamp": row.操作时间.strftime("%Y-%m-%d %H:%M:%S"),
                "date": row.日期,
                "hour": int(row.小时),
                "weekday": row.星期,
                "diseaseArea": medical["diseaseArea"],
                "researchTopic": medical["researchTopic"],
                "studyType": medical["studyType"],
                "outputType": medical["outputType"],
                "keywordCluster": medical["keywordCluster"],
                "searchQuery": medical["searchQuery"],
                "themeCluster": medical["themeCluster"],
                "contentFocus": medical["contentFocus"],
            }
        )

    daily_actions = df.groupby("日期").size().sort_index()
    daily_users = df.groupby("日期")["用户名"].nunique().sort_index()
    hourly_actions = df.groupby("小时").size().reindex(range(24), fill_value=0)
    category_counts = df["操作分类"].value_counts()
    user_frequency = df.groupby("用户名").size()
    segment = pd.cut(
        user_frequency,
        bins=[0, 5, 20, 50, 100, 10**9],
        labels=["1-5次", "6-20次", "21-50次", "51-100次", "100次以上"],
    ).value_counts().sort_index()

    summary = {
        "totalActions": int(len(df)),
        "activeUsers": int(df["用户名"].nunique()),
        "activeDays": int(df["日期"].nunique()),
        "avgActionsPerUser": round(float(len(df) / df["用户名"].nunique()), 1),
        "peakDate": str(daily_actions.idxmax()),
        "peakDateActions": int(daily_actions.max()),
        "peakHour": int(hourly_actions.idxmax()),
        "peakHourActions": int(hourly_actions.max()),
        "topCategory": str(category_counts.index[0]),
        "topCategoryActions": int(category_counts.iloc[0]),
        "startDate": str(df["日期"].min()),
        "endDate": str(df["日期"].max()),
    }

    weekday_order = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]
    weekday_map = {
        "Monday": "周一",
        "Tuesday": "周二",
        "Wednesday": "周三",
        "Thursday": "周四",
        "Friday": "周五",
        "Saturday": "周六",
        "Sunday": "周日",
    }

    payload = {
        "summary": summary,
        "overview": {
            "dailyTrend": [
                {
                    "date": date,
                    "actions": int(daily_actions.loc[date]),
                    "users": int(daily_users.loc[date]),
                }
                for date in daily_actions.index
            ],
            "hourlyHeat": [{"hour": int(hour), "actions": int(value)} for hour, value in hourly_actions.items()],
            "weekdayActions": [
                {
                    "weekday": weekday_map[day],
                    "actions": int(df.loc[df["星期"] == day].shape[0]),
                }
                for day in weekday_order
            ],
            "categoryShare": top_counts(df, "操作分类", 12),
            "detailShare": top_counts(df, "操作详情", 12),
            "roleShare": distribution(df, "用户身份"),
            "accountShare": distribution(df, "账号类型"),
            "targetShare": distribution(df, "使用对象"),
            "segmentShare": [{"name": str(name), "value": int(value)} for name, value in segment.items()],
            "departmentTop": top_counts(df, "所在部门", 12),
            "provinceTop": top_counts(df, "省份", 12),
            "regionTop": top_counts(df, "销售大区", 12),
            "hospitalLevelShare": distribution(df, "医院等级"),
            "t100Share": distribution(df, "是否T100"),
        },
        "filters": {
            "roles": sorted(df["用户身份"].unique().tolist()),
            "accountTypes": sorted(df["账号类型"].unique().tolist()),
            "departments": sorted(df["所在部门"].unique().tolist()),
            "provinces": sorted(df["省份"].unique().tolist()),
            "categories": sorted(df["操作分类"].unique().tolist()),
            "regions": sorted(df["销售大区"].unique().tolist()),
            "owners": sorted(df["负责同事姓名"].unique().tolist()),
        },
        "records": records,
    }
    return payload


def main():
    OUTPUT_DIR.mkdir(exist_ok=True)
    dataframe = pd.read_excel(SOURCE)
    payload = build_payload(dataframe)
    json_payload = json.dumps(payload, ensure_ascii=False)
    OUTPUT_FILE.write_text(f"window.DASHBOARD_DATA = {json_payload};", encoding="utf-8")
    print(f"Saved {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
