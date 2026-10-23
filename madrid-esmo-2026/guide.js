(function () {
  const THEME_KEY = "madrid-esmo-2026-theme";
  const FONT_KEY = "madrid-esmo-2026-font";
  const CHECK_KEY = "madrid-esmo-2026-guide-checks-v1";
  const NOTE_KEY = "madrid-esmo-2026-notes-v1";
  const PLAN_KEY = "madrid-esmo-2026-planb";
  const FONTS = ["sm", "md", "lg", "xl"];
  const FONT_LABEL = { sm: "小", md: "标准", lg: "大", xl: "特大" };
  const IMG = {
    palace: "https://estaticos.esmadrid.com/cdn/farfuture/6qo9FyNjZUzNCzjxl3zUATiGX6nXbIzj5Y4h4CFPp-Y/mtime%3A1646729445/sites/default/files/styles/content_type_full/public/recursosturisticos/infoturistica/palacio_real.jpg?itok=dWNT8u0V",
    gasparini: "https://estaticos.esmadrid.com/cdn/farfuture/vilkZ5QpqEO1dK9tMXlnSaPc5fqV6Q1VWwZJclF7tZ0/mtime%3A1646729444/sites/default/files/styles/content_type_full/public/recursosturisticos/infoturistica/salon_gasparini_palacio_real.jpg?itok=COiH05T4",
    crystal: "https://estaticos.esmadrid.com/cdn/farfuture/hRe6nNiadvrXCzZ1Iazl2sM7hcv438nxQVrUaDUi6bE/mtime%3A1646729680/sites/default/files/styles/content_type_full/public/recursosturisticos/infoturistica/palacio.jpg?itok=6ozfGGu_",
    gate: "https://estaticos.esmadrid.com/cdn/farfuture/7faksRMsjG19Ae6cMJnc0lFuBb8HOgD_X7oG02vxEMk/mtime%3A1646735070/sites/default/files/styles/content_type_full/public/recursosturisticos/infoturistica/puerta_de_felipe_iv_0.jpg?itok=xy2rRI2a",
    meninas: "https://estaticos.esmadrid.com/cdn/farfuture/qyYAavC2V2_rP00MwgDPGfHHF6OOmvdS6w4u3yUyd-Y/mtime%3A1646729415/sites/default/files/styles/content_type_full/public/recursosturisticos/infoturistica/LASMENINAS663x335_1406286167.91.jpg?itok=qNfXECRG"
  };
  const NAV = [
    { id: "line", label: "一天", children: [
      { id: "line-thread", label: "一条历史线" },
      { id: "line-order", label: "时间取舍" }
    ]},
    { id: "palace", label: "王宫", children: [
      { id: "palace-story", label: "三层历史" },
      { id: "palace-rooms", label: "90 分钟厅室" },
      { id: "palace-axis", label: "出宫轴线" },
      { id: "palace-rules", label: "寄存、拍照、厕所" }
    ]},
    { id: "oldtown", label: "老城", children: [
      { id: "oldtown-order", label: "不走回头路" }
    ]},
    { id: "posada", label: "午饭", children: [
      { id: "posada-time", label: "14:15 必须起身" }
    ]},
    { id: "retiro", label: "丽池", children: [
      { id: "retiro-line", label: "30 分钟四步" },
      { id: "retiro-skip", label: "什么时候跳过" }
    ]},
    { id: "prado", label: "普拉多", children: [
      { id: "prado-works", label: "六幅锚点" },
      { id: "prado-more", label: "有余力再加" },
      { id: "prado-pace", label: "2 小时 20 分" },
      { id: "prado-rules", label: "包、拍照、网络" }
    ]},
    { id: "backup", label: "备选", children: [
      { id: "backup-plan", label: "四种走法" },
      { id: "backup-wifi", label: "Wi-Fi" },
      { id: "backup-pack", label: "出发前核对" }
    ]}
  ];
  const WORKS = [
    { id: "greco", artist: "artist-greco", artistName: "埃尔·格列柯", name: "埃尔·格列柯《手按胸口的贵族》", room: "Room 008B", mins: "10–12 分钟", must: false, look: "先看黑衣和灰背景，再看白手、金剑柄和直视观众的眼神。身份仍有不同解释，不必当成已经确定的肖像。", history: "约 1580 年。他从克里特来到西班牙，在托莱多形成个人画风。姿态、衣料和佩剑在表达贵族身份。", href: "https://www.museodelprado.es/en/the-collection/art-work/the-nobleman-with-his-hand-on-his-chest/9cb73bdf-66e8-4826-a79c-5de2b15a1da6" },
    { id: "bosch", artist: "artist-bosch", artistName: "博斯", name: "博斯《人间乐园》", room: "Room 056A", mins: "15–20 分钟", must: true, look: "先看闭合画板外侧，再从左翼伊甸园走到中央，最后看右翼地狱。不要只放大找怪物。", history: "腓力二世 1591 年购入，1593 年送往埃斯科里亚尔。北方绘画就这样进入西班牙王室收藏。", href: "https://www.museodelprado.es/en/the-collection/art-work/the-garden-of-earthly-delights-triptych/02388242-6d6a-4e9e-a992-e1311eab3609" },
    { id: "meninas", artist: "artist-velazquez", artistName: "委拉斯开兹", name: "委拉斯开兹《宫娥》", room: "Room 012", mins: "20–25 分钟", must: true, look: "先找镜中的腓力四世和王后，再找画家本人、后方门口的人，以及画布背面。问的是：谁在看谁？", history: "1656 年，为宫廷空间而作。它把观看本身变成主题，也把画家放进宫廷。胸口的红十字是后来加上的。", href: "https://www.museodelprado.es/en/the-collection/art-work/las-meninas/9fdc7800-9ade-48b0-ab8b-edee94ea877f", img: IMG.meninas, alt: "普拉多宫娥展厅" },
    { id: "family", artist: "artist-goya", artistName: "戈雅", name: "戈雅《卡洛斯四世一家》", room: "Room 032", mins: "12–15 分钟", must: false, look: "看每个人的脸、站位、衣饰和勋章。不要只套用「戈雅在讽刺王室」这种网传说法。", history: "1800 年，戈雅任第一宫廷画师后绘制。和《宫娥》对照：一幅制造谜题，一幅让各人的性格浮出来。", href: "https://www.museodelprado.es/en/the-collection/art-work/the-family-of-carlos-iv/f47898fc-aa1c-48f6-a779-71759e417e74" },
    { id: "may3", artist: "artist-goya", artistName: "戈雅", name: "戈雅《1808年5月3日》", room: "Room 064", mins: "15–20 分钟", must: true, look: "灯光把受刑者和枪队分成两组。枪手几乎没有脸，白衣和手势让个人命运站到画面中央。", history: "1814 年完成，回看 1808 年马德里起义。可以和《1808年5月2日》一起看。这不是当时的新闻插画。", href: "https://www.museodelprado.es/en/the-collection/art-work/the-3rd-of-may-1808-in-madrid-or-the-executions/5e177409-2993-4240-97fb-847a02c6496c" },
    { id: "saturn", artist: "artist-goya", artistName: "戈雅", name: "戈雅《农神吞噬其子》", room: "Room 067", mins: "10–12 分钟", must: false, look: "从明亮的历史画转到近乎封闭的黑。看身体怎样被背景吞没。", history: "约 1820–1823 年的黑色绘画，原在私人住宅墙上，后来转移到画布。用它收束戈雅从宫廷画师到晚年的转变。", href: "https://www.museodelprado.es/en/the-collection/art-work/saturn/18110a75-b0e7-430c-bc73-2a4d55893bd6" }
  ];
  const PACK = [
    { id: "g-palace", t: "王宫票：10月26日 15:00 西班牙语讲解。14:45 到优先入口。" },
    { id: "g-prado", t: "普拉多票：10月26日 10:00。点名字打开，预先下载官方地图。" },
    { id: "g-posada", t: "Posada：12:45，3 人。14:25 离开，步行去王宫。" },
    { id: "g-rooms", t: "核对《宫娥》、博斯《人间乐园》、戈雅是否在展、在哪一厅。" },
    { id: "g-weather", t: "丽池今天不走。雨只影响讲解后要不要看宫外。" },
    { id: "g-offline", t: "离线保存票、路线和住址。普拉多厅内不拍照，王宫按每厅标识。" }
  ];
  const PLANS = {
    good: "照主表走。09:30 打车去普拉多，10:00–12:20。12:45 Posada，14:25 离开，14:45 到王宫，15:00 讲解。丽池今天不走。",
    tired: "讲解结束后直接回公寓，不看阿穆德纳外观。",
    rain: "普拉多和王宫都在室内。雨大就跳过讲解后的宫外停留。",
    ride: "从 Posada 打车到王宫。步行大约 18 分钟，车程大约 14 分钟。走不动或下雨，14:30 前上车。"
  };

  let workId = "meninas";
  let planId = "good";
  let checks = new Set();

  function el(tag, attrs) {
    const n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      const v = attrs[k];
      if (v == null || v === false) return;
      if (k === "class") n.className = v;
      else n.setAttribute(k, v === true ? "" : String(v));
    });
    for (let i = 2; i < arguments.length; i++) {
      const kid = arguments[i];
      if (kid == null || kid === false) continue;
      n.append(typeof kid === "string" ? document.createTextNode(kid) : kid);
    }
    return n;
  }
  function ext(href, label) {
    const a = el("a", { href: href, class: "go" }, label);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }
  function figure(src, alt, caption) {
    const img = el("img", { src: src, alt: alt, loading: "lazy" });
    img.addEventListener("error", function () {
      img.alt = alt + "（图片暂时打不开，说明仍有效）";
    });
    return el("figure", null, img, el("figcaption", null, caption));
  }
  function fontNow() {
    const f = document.documentElement.getAttribute("data-font");
    return FONTS.indexOf(f) >= 0 ? f : "md";
  }
  function themeNow() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }
  function paintChrome() {
    const f = fontNow();
    const fontBtn = document.getElementById("font-btn");
    fontBtn.textContent = FONT_LABEL[f];
    fontBtn.setAttribute("aria-label", "字号" + FONT_LABEL[f] + "，点按切换");
    const dark = themeNow() === "dark";
    const themeBtn = document.getElementById("theme-btn");
    themeBtn.textContent = dark ? "浅色" : "深色";
    themeBtn.setAttribute("aria-label", dark ? "切换到浅色" : "切换到深色");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#14110e" : "#efe6d6");
  }
  function parentOf(hash) {
    const h = hash == null ? (location.hash || "#line").replace("#", "") : hash;
    if (h.indexOf("prado-") === 0) return "prado";
    let found = "";
    NAV.forEach(function (n) {
      if (n.id === h) found = n.id;
      (n.children || []).forEach(function (c) { if (c.id === h) found = n.id; });
    });
    if (found) return found;
    if (h.indexOf("prado") === 0) return "prado";
    return "line";
  }
  function sectionId() { return parentOf(); }
  function loadLocal() {
    try {
      const raw = localStorage.getItem(CHECK_KEY);
      checks = new Set(raw ? JSON.parse(raw) : []);
    } catch (e) { checks = new Set(); }
    try {
      const p = localStorage.getItem(PLAN_KEY);
      if (PLANS[p]) planId = p;
    } catch (e) {}
    const h = (location.hash || "").replace("#", "");
    if (h.indexOf("prado-") === 0) {
      const id = h.slice(6);
      if (WORKS.some(function (w) { return w.id === id; })) workId = id;
    }
  }
  function saveChecks() {
    localStorage.setItem(CHECK_KEY, JSON.stringify(Array.from(checks)));
  }

  function pager(id) {
    const i = NAV.findIndex(function (n) { return n.id === id; });
    const box = el("div", { class: "rowbtns" });
    if (i > 0) box.append(el("a", { class: "go", href: "#" + NAV[i - 1].id }, "上一段"));
    if (i < NAV.length - 1) box.append(el("a", { class: "go", href: "#" + NAV[i + 1].id }, "下一段 · " + NAV[i + 1].label));
    return box;
  }

  function renderLine() {
    const thread = [
      ["王宫", "权力先有一座舞台", "同一块高地叠着三层：9 世纪的堡垒、哈布斯堡的旧宫、1734 年火灾之后的波旁新宫。宫里看礼仪，不看家具清单。", "#palace"],
      ["老城", "舞台旁边长出城市", "今天讲解后只看阿穆德纳外观和东方广场。不进教堂，不折回 Plaza Mayor。", "#oldtown"],
      ["丽池", "王家园林变成公共景观", "今天不走。Felipe IV 门、法式花坛和古柏仍是宫廷花园变成城市公园的那一段，留到下次。", "#retiro"],
      ["普拉多", "收藏变成可以走进去的绘画史", "1819 年王室收藏对公众开放。四位画家按今天的问题往下排：格列柯看贵族肖像，博斯看北方绘画怎样进入王室，委拉斯开兹看宫廷里的观看，戈雅从宫廷走到战争和晚年。", "#prado"]
    ];
    const s = el("section", { id: "line" });
    s.append(
      el("p", { class: "kicker" }, "10月26日 · 周一 · 3 人 · 马德里时间"),
      el("h1", null, "一天怎么串起来"),
      el("p", null, el("mark", null, "先看权力怎样占住一座城，再看这座城怎样把收藏变成博物馆。")),
      el("p", null, "四处不是四个景点。旧王宫在 ", el("strong", null, "1734 年"), " 烧掉。今天上午先在普拉多看那场火里救出来的《宫娥》，下午进火灾之后的新宫。丽池今天不走。"),
      el("h2", { id: "line-thread" }, "一条历史线")
    );
    thread.forEach(function (row, i) {
      s.append(el("article", { class: "stop" },
        el("p", { class: "when" }, (i + 1) + " · " + row[0]),
        el("h2", null, row[1]),
        el("p", null, row[2]),
        el("a", { class: "go", href: row[3] }, "进入这一段")
      ));
    });
    s.append(
      el("p", null, "画和画家不在这段里展开。六幅锚点和四位作者各自有阅读页，游览时只记怎么看，想弄清再点开。"),
      el("a", { class: "go", href: "read.html#how" }, "先读画家和画作"),
      el("h2", { id: "line-order" }, "时间只记取舍"),
      el("p", null, "票价、开放、寄存、拍照和网络以馆方为准。知乎只补现场会遇到什么，和官方或上面这条线冲突时，不改行程。展陈会变，出发前再核对房间。"),
      ext("https://whc.unesco.org/en/list/1618", "UNESCO：艺术与科学景观"),
      el("div", { class: "card" },
        el("p", { class: "when" }, "10:00 普拉多，15:00 王宫"),
        el("p", null, "上午普拉多，12:45 Posada，15:00 王宫西班牙语讲解。丽池今天不走。讲解后只看阿穆德纳外观，不折回 Plaza Mayor。")
      ),
      el("div", { class: "card" },
        el("p", null, el("strong", null, "09:30"), " 打车出门。", el("strong", null, "10:00–12:20"), " 普拉多。", el("strong", null, "12:45"), " Posada。"),
        el("p", null, el("strong", null, "14:45"), " 到王宫优先入口。", el("strong", null, "15:00"), " 西班牙语讲解。晚上不再加景点。")
      ),
      pager("line")
    );
    return s;
  }

  function renderPalace() {
    const rooms = [
      ["主楼梯", "5 分钟", "来访者进入宫廷秩序的第一幕。官方介绍称楼梯由 Sabatini 设计，有 70 余级。"],
      ["王座厅", "8–10 分钟", "先看提埃波罗的天顶，再看红色织物、镜子和金饰。这是正式的王权图像，下午用《宫娥》对照。"],
      ["Gasparini 厅", "8–10 分钟", "植物纹样是 18 世纪宫廷趣味。卡洛斯三世办公室则是处理政务的地方，2025 年纳入参观线路，当天是否开放以现场为准。"],
      ["礼拜堂 / 圣器室", "5–8 分钟", "宫廷也靠宗教和王朝礼仪。留意礼仪用品和 Stradivari 弦乐器。圣器室近年才增加进入，以当天为准。"],
      ["皇家药房", "5 分钟", "药柜、陶罐和处方把宫廷拉回身体和供应。对医疗同行会比较具体。"],
      ["皇家军械馆", "可选 20–30 分钟", "更关心战争史时，压缩一个装饰厅再来。留意查理五世的盔甲。官方估计大约 30 分钟，常要另留时间。"]
    ];
    const s = el("section", { id: "palace" });
    s.append(
      el("p", { class: "kicker" }, "15:00 讲解 · 14:45 到优先入口"),
      el("h1", null, "王宫"),
      figure(IMG.palace, "马德里王宫外观", "王宫外观。图片来源：马德里旅游局。"),
      el("p", null, el("mark", null, "现在看到的波旁王宫，不是这座城最早的一层。")),
      el("h2", { id: "palace-story" }, "三层历史"),
      el("ul", null,
        el("li", null, el("strong", null, "9 世纪 Magerit。"), "穆罕默德一世在此建防御据点，保护当时的托莱多。"),
        el("li", null, el("strong", null, "哈布斯堡旧 Alcázar。"), "卡洛斯一世、腓力二世把它变成常住宫殿。腓力二世时期马德里成为王都。"),
        el("li", null, el("strong", null, "1734 年火灾之后。"), "腓力五世下令建新宫。方案从 Filippo Juvarra 开始，学生 Juan Bautista Sachetti 完成。卡洛斯三世是第一位住进来的君主。")
      ),
      ext("https://www.esmadrid.com/en/tourist-information/royal-palace", "王宫历史"),
      el("h2", { id: "palace-rooms" }, "90 分钟先看这些")
    );
    rooms.forEach(function (r) {
      s.append(el("article", { class: "stop" },
        el("p", { class: "when" }, r[1]),
        el("h2", null, r[0]),
        el("p", null, r[2])
      ));
    });
    s.append(
      el("p", null, "王座厅天顶可以展开读 ", el("a", { href: "read.html#tiepolo" }, "提埃波罗"), "。宫里只抬头看一眼，故事留到阅读页。"),
      figure(IMG.gasparini, "Gasparini 厅内部", "Gasparini 厅。图片来源：马德里旅游局。"),
      el("p", null, "超过 3000 个房间，旅游线路只开放一部分。优先楼梯、王座厅、Gasparini、礼拜堂和药房；动线允许再加军械馆。"),
      el("h2", { id: "palace-axis" }, "出宫后的轴线"),
      el("div", { class: "card" },
        el("p", null, el("strong", null, "Plaza de la Armería："), "回看主立面，再向城里走。入口按官方指示从这里进，不要按旧攻略排别的门。"),
        el("p", null, el("strong", null, "Plaza de Oriente："), "王宫和 Teatro Real 之间，看宫殿、歌剧院和广场怎样被组织成首都展示。"),
        el("p", null, el("strong", null, "Mirador de la Cornisa："), "免费看 Campo del Moro。开门、不排队再停几分钟，不为观景排长队。")
      ),
      el("h2", { id: "palace-rules" }, "寄存、拍照、厕所"),
      el("p", null, el("span", { class: "flag" }, "官方"), "2025 年 12 月的参观办法写明：王宫寄存", el("strong", null, "免费"), "。大背包、边长达到 ", el("strong", null, "40×40 厘米"), " 的箱子和不能折叠的伞不能带进去。票务页还建议改善工程期间尽量别带大包。冬季（10 月至 3 月）周一至周六 ", el("strong", null, "10:00–18:00"), "，售票和入场在闭馆前 1 小时停止，所以周一最晚大约 ", el("strong", null, "17:00"), " 进门。当前基础票页面标价 ", el("strong", null, "€18"), "，另有每张手续费，以订单为准。官方导览另加约 €8。多媒体讲解有 16 种语言，也可以用他们的 App。"),
      el("p", null, el("span", { class: "flag" }, "知乎访客经验"), "一位常在王宫带团的导游说，参观通常 1 到 1.5 小时，大包要寄存，还建议带 1 欧元硬币。", el("mark", null, "1 欧元投币对不上王宫现行规定。"), "国家遗产写的是王宫寄存免费。投 1 欧元退币的，是旁边皇家收藏馆的自助柜，今天不进那里。同一篇还说多数厅不让拍照、宫内没有厕所、路线是单线。无障碍说明里写了游客厕所。两边一致的只有一句：进门前先上厕所，中途折返会吃掉这 90 分钟。拍照仍按房间标识，不开闪光灯，不带自拍杆和三脚架，不触摸展品。"),
      el("p", null, "这次用知乎搜索又对过几篇，票价互相打架，不改已经买的票。游子吟写全票 ", el("strong", null, "€18"), "、冬季周一至周六 10:00–18:00、闭馆前 1 小时停止入场、讲解约 €8、语音约 €5，和现行票务页一致。小斑的旅行手账写成人票 €14，并说周一至周四 17:00–19:00 可以碰免费资格。舒 lin 也写过 14 欧和 9:30 开始排队。", el("strong", null, "€14 和「碰碰运气」都不采用。"), "票是 15:00 西班牙语讲解，14:45 到优先入口。"),
      el("p", null, "大懒熊 W 记下兵器广场夹在王宫和阿穆德纳之间，并说屋顶两面旗都挂着表示国王在宫里。当天若看到两面旗，以现场是否停开为准。Aires 行记写现在可以拍照、票价 20 欧、周三和周六有换岗。拍照仍按每厅标识，票价以订单为准，换岗不插进 26 日。"),
      el("p", null, el("span", { class: "flag" }, "没有可靠室内 Wi-Fi"), "票、地图和翻译提前下好。手机里留门票二维码。"),
      el("div", { class: "links" },
        ext("https://www.patrimonionacional.es/sites/default/files/documents/20251216_resolucion_regimen_visita_firmada_0_26.pdf", "2025 年参观办法"),
        ext("https://tickets.patrimonionacional.es/en/tickets/palacio-real-de-madrid?city=ZMM", "官方票务"),
        ext("https://www.zhihu.com/answer/820968481", "知乎：董微微，王宫带团"),
        ext("https://zhuanlan.zhihu.com/p/1996866963973091521", "知乎：游子吟，票价与开放"),
        ext("https://www.zhihu.com/question/1938902054006399764/answer/1939628721070913451", "知乎：小斑的旅行手账"),
        ext("https://zhuanlan.zhihu.com/p/1888744490287756244", "知乎：大懒熊 W，兵器广场")
      ),
      pager("palace")
    );
    return s;
  }

  function renderOld() {
    const stops = [
      ["阿穆德纳外观", "讲解后", "看宫殿、大教堂的仪式轴线。大教堂主体晚至 19–20 世纪，不要当成中世纪古迹。不进教堂。"],
      ["东方广场", "接着看", "回看王宫正立面。看完回公寓，不再往城里走。"]
    ];
    const s = el("section", { id: "oldtown" });
    s.append(
      el("p", { class: "kicker" }, "讲解后 · 只看宫外"),
      el("h1", null, "老城"),
      el("p", null, el("mark", null, "王宫高地是权力中心，Villa 是市政核心，Mayor 是公共仪式剧场。")),
      el("p", null, "这一段在王宫讲解之后，只看宫外。午饭已经在 Posada 吃过，不再沿 Cava Baja 走回去。"),
      el("h2", { id: "oldtown-order" }, "今天只到这里"),
      el("div", { class: "card" },
        el("p", null, "讲解结束，在 ", el("strong", null, "Plaza de la Armería"), " 回看正立面，接着看 ", el("strong", null, "阿穆德纳"), " 外观和 ", el("strong", null, "东方广场"), "。不进教堂，不往 ", el("strong", null, "Plaza Mayor"), " 走。"),
        el("p", null, "Plaza Mayor 中央骑马像是腓力三世，不是腓力四世。今天不进这个广场，也不在这里吃东西。")
      ),
      el("p", null, el("span", { class: "flag" }, "知乎访客经验"), "世界客和游子吟都把太阳门写成西班牙公路 ", el("strong", null, "0 公里"), "，广场上有熊抱草莓树。它在 Plaza Mayor 东边，今天不绕太阳门，也不进 Plaza Mayor。")
    );
    stops.forEach(function (st, i) {
      s.append(el("article", { class: "stop" },
        el("p", { class: "when" }, (i + 1) + " · " + st[1]),
        el("h2", null, st[0]),
        el("p", null, st[2])
      ));
    });
    s.append(
      el("div", { class: "links" },
        ext("https://www.esmadrid.com/informacion-turistica/plaza-de-la-villa", "Plaza de la Villa"),
        ext("https://www.esmadrid.com/en/madrid-neighbourhoods/austrias", "哈布斯堡街区"),
        ext("https://www.esmadrid.com/en/48-hours-madrid", "Plaza Mayor 建造史"),
        ext("https://zhuanlan.zhihu.com/p/1945461347274958821", "知乎：世界客，太阳门与市徽"),
        ext("https://zhuanlan.zhihu.com/p/2022264518743532736", "知乎：游子吟，马约尔广场"),
        ext("https://www.zhihu.com/question/266819821/answer/3220793797", "知乎：无忧行，老城加站")
      ),
      pager("oldtown")
    );
    return s;
  }

  function renderPosada() {
    const s = el("section", { id: "posada" });
    s.append(
      el("p", { class: "kicker" }, "12:45–14:25"),
      el("h1", null, "Posada de la Villa"),
      el("p", null, el("mark", null, "1642 年的旅店，夹在普拉多和 15:00 王宫讲解中间。")),
      el("p", null, "点菜、人数和预算仍以行程手册为准。订的是 ", el("strong", null, "12:45"), "，3 人，并确认当天烤乳羊。"),
      el("h2", { id: "posada-time" }, "14:25 必须起身"),
      el("p", null, el("strong", null, "14:25"), " 离开。步行到王宫大约 1.4 公里、18 分钟，14:45 到优先入口。坐过点就改打车，不要耽误 15:00 的讲解。"),
      el("div", { class: "links" },
        ext("https://www.esmadrid.com/en/illustrated-map-centuries-old-restaurants-and-tabernas", "百年酒馆介绍"),
        ext("https://www.google.com/maps/dir/?api=1&origin=Posada+de+la+Villa%2C+Cava+Baja+9%2C+Madrid&destination=Palacio+Real+de+Madrid&travelmode=walking", "饭后步行去王宫")
      ),
      pager("posada")
    );
    return s;
  }

  function renderRetiro() {
    const rows = [
      ["Felipe IV 门", "花岗岩门，正对 Casón del Buen Retiro。1690 年为卡洛斯二世婚礼而建，1880 年迁到今天的位置。"],
      ["Parterre 花坛", "对称轴线、树篱、喷泉。这是宫廷花园的秩序，不是自然式散步林。"],
      ["古柏", "旅游局说它可能约有 400 年，是估算，不要当成精确树龄。"],
      ["Casón 外观", "曾是 Buen Retiro 的舞厅，今天属于普拉多的研究与图书馆体系。"]
    ];
    const s = el("section", { id: "retiro" });
    s.append(
      el("p", { class: "kicker" }, "今天不走"),
      el("h1", null, "丽池"),
      figure(IMG.gate, "丽池 Felipe IV 门", "Felipe IV 门。图片来源：马德里旅游局。"),
      el("p", null, el("mark", null, "看的是王家园林怎样变成公共文化景观，不是环湖拍照。")),
      figure(IMG.crystal, "丽池水晶宫外观", "水晶宫外观。2026 年 10 月预计仍在修缮，只能看外部装置，不能列入入内。图片来源：马德里旅游局。"),
      el("p", null, el("span", { class: "flag" }, "水晶宫闭馆至 2027"), "1887 年由 Ricardo Velázquez Bosco 为菲律宾群岛植物展览设计，曾是铁与玻璃的温室。2026 年 10 月只看外面的覆盖装置，不把入内写进行程。"),
      el("h2", { id: "retiro-line" }, "30 分钟只走这四步")
    );
    rows.forEach(function (r) {
      s.append(el("article", { class: "stop" }, el("h2", null, r[0]), el("p", null, r[1])));
    });
    s.append(
      el("h2", { id: "retiro-skip" }, "什么时候不要进园"),
      el("div", { class: "note" }, el("p", null, "26 日不进丽池。上午在普拉多，午饭在 Posada，下午是王宫。")),
      el("p", null, "公园 10 月至次年 3 月官方开放 ", el("strong", null, "06:00–22:00"), "。暴雨、强风可能封闭。免费 Wi-Fi 在 Cecilio Rodríguez Gardens，不在这条短线上，也不能覆盖全园。进园前截好出口和普拉多入口。"),
      el("p", null, el("span", { class: "flag" }, "知乎访客经验"), "游子吟写水晶宫从 2023 年起大修、预计 2027 年再开放，和市政府说明一致。同一篇把阿尔卡拉门、阿方索十二世、水晶宫、玫瑰园排成 1 到 2 小时，还写湖上划船大约 €6、45 分钟。", el("strong", null, "今天不进园，不划船，也不绕大湖。")),
      el("div", { class: "links" },
        ext("https://www.esmadrid.com/informacion-turistica/parque-del-retiro", "公园官方页"),
        ext("https://www.esmadrid.com/en/tourist-information/felipe-iv-gate", "Felipe IV 门"),
        ext("https://www.esmadrid.com/informacion-turistica/palacio-de-cristal", "水晶宫维修说明"),
        ext("https://zhuanlan.zhihu.com/p/1996866963973091521", "知乎：游子吟，丽池长路线"),
        ext("https://zhuanlan.zhihu.com/p/28306698096", "知乎：舒 lin，风雨封园"),
        ext("https://www.google.com/maps/dir/?api=1&origin=Puerta+de+Felipe+IV%2C+Calle+de+Alfonso+XII+3%2C+Madrid&destination=Museo+del+Prado%2C+Madrid&travelmode=walking", "步行去普拉多")
      ),
      pager("retiro")
    );
    return s;
  }

  function renderWork() {
    const w = WORKS.filter(function (x) { return x.id === workId; })[0] || WORKS[2];
    const box = el("article", { class: "work", id: "work" });
    if (w.must) box.append(el("span", { class: "flag" }, "时间紧也尽量看"));
    box.append(el("p", { class: "when" }, w.room + " · " + w.mins), el("h2", null, w.name));
    if (w.img) box.append(figure(w.img, w.alt, "《宫娥》展厅。厅内不能拍照，这张是旅游局资料图。"));
    box.append(
      el("p", null, el("strong", null, "当场看："), w.look),
      el("details", null, el("summary", null, "它在历史上的位置"), el("p", null, w.history)),
      el("div", { class: "links" },
        el("a", { class: "go", href: "read.html#" + w.artist }, w.artistName),
        el("a", { class: "go", href: "read.html#work-" + w.id }, "展开这幅画"),
        ext(w.href, "普拉多作品页")
      )
    );
    const nav = el("div", { class: "hscroll", id: "works", "aria-label": "六幅作品" });
    WORKS.forEach(function (item) {
      const b = el("button", { type: "button", class: "chip", "data-work": item.id }, item.must ? item.name.slice(0, 8) : item.name.slice(0, 6));
      if (item.id === w.id) b.setAttribute("aria-pressed", "true");
      b.textContent = item.name.replace(/^.*?《/, "《").replace(/》.*/, "》");
      nav.append(b);
    });
    const step = el("div", { class: "rowbtns" });
    const prev = el("button", { type: "button", class: "go", "data-step": "-1" }, "上一幅");
    const next = el("button", { type: "button", class: "go", "data-step": "1" }, "下一幅");
    step.append(prev, next);
    return el("div", { id: "viewer" }, nav, box, step);
  }

  function renderPrado() {
    const s = el("section", { id: "prado" });
    s.append(
      el("p", { class: "kicker" }, "10:00–12:20 · 不求看遍"),
      el("h1", null, "普拉多"),
      el("p", null, el("mark", null, "把它看成权力怎样挑选艺术，不是找几幅名作拍照。")),
      el("p", null, "1819 年以皇家绘画博物馆对公众开放。建筑最初由 Juan de Villanueva 设计为科学用途，后来才成为博物馆。西班牙绘画是世界上收得最全的一批，委拉斯开兹和戈雅的作品多数在这里。"),
      el("p", null, "六幅不是一条保证相连的路线，入馆后以官方地图为准。每幅下面可以展开作者和这幅画；四位画家按今天的问题排列，不是按出生年。"),
      el("h2", { id: "prado-works" }, "六幅锚点")
    );
    s.append(renderWork());
    s.append(
      el("h2", { id: "prado-more" }, "有余力再加，不列入今天的必看"),
      el("p", null, "知乎一篇藏品介绍还提到：范德魏登《下十字架》、安吉利科《圣母领报》、丢勒《亚当与夏娃》、老彼得·勃鲁盖尔《死亡的胜利》、委拉斯开兹《布雷达的投降》，以及戈雅的玛哈。这些能说明普拉多不止西班牙绘画，但和六幅主线不在同一条直线上。", el("strong", null, "12:00 之后如果还有余力，只加一幅"), "，优先《布雷达的投降》或玛哈。12:20 离开。其余留给下次。"),
      el("p", null, "《1808年5月3日》有一种常见读法：前排是祈祷的僧侣、抬头的农民，和举起双手的市民，刑场在马德里郊外。普拉多官方更谨慎，说它不是当时的街头新闻。看的时候先相信画面上的光和两组人，不必背这个故事。"),
      ext("https://www.zhihu.com/tardis/bd/ans/2556884594", "知乎：馆藏里还被提到的作品"),
      ext("https://zhuanlan.zhihu.com/p/30780368", "知乎：《5月3日》的一种读法"),
      el("h2", { id: "prado-pace" }, "2 小时 20 分怎么切"),
      el("div", { class: "card" },
        el("p", null, el("strong", null, "10:00–10:10"), " 入馆，打开地图，先确认《宫娥》、博斯和戈雅当天在不在展。"),
        el("p", null, el("strong", null, "10:10–11:00"), " 先看最想看的。拥挤就先看《宫娥》和博斯。"),
        el("p", null, el("strong", null, "11:00–11:10"), " 坐下喝水。"),
        el("p", null, el("strong", null, "11:10–12:00"), " 戈雅一组。动线不顺就跟地图，不要为了年代顺序来回折返。"),
        el("p", null, el("strong", null, "12:00–12:15"), " 有余力再看一幅。不再追加十几件。"),
        el("p", null, el("strong", null, "12:15–12:20"), " 离馆。商店顺路就看，不要耽误去 Posada。")
      ),
      el("h2", { id: "prado-rules" }, "包、拍照、网络"),
      el("p", null, el("span", { class: "flag" }, "官方 2024 年 FAQ"), "边长达到 ", el("strong", null, "40×40 厘米"), " 的行李不能带进展厅，可放寄存，贵重物品自己拿着。展厅", el("strong", null, "不能拍照、不能录像"), "。允许拍照的是 Jerónimos 门厅、缪斯厅和回廊。"),
      el("p", null, "Wi-Fi 以较新的说明为准：", el("mark", null, "不是整座馆，也不是只在 Café Prado。"), "2022 年 FAQ 写过 Café Prado；2024 年 9 月 FAQ 改成只在临时展厅和 Jerónimos 门厅。展厅里用提前下好的地图。喝水放在 11:00，12:20 离馆。"),
      el("p", null, "语音导览可以加在门票上，馆方标价大约 ", el("strong", null, "€5"), "，也能用自己的手机，自带耳机。西班牙语或英语的 90 分钟导览另加约 €10。长椅在爱奥尼亚画廊和 Jerónimos 门厅。14 岁以下要有成人同行。票是 ", el("strong", null, "10:00"), " 入馆，", el("strong", null, "12:20"), " 离馆。不必改去闭馆前两小时的免费时段。"),
      el("p", null, el("span", { class: "flag" }, "知乎访客经验"), "wstcbh 在馆里走了大约 15 小时，写正门委拉斯开兹门平时不开，免费夜场才从那里排队；常用入口是北侧 0 层圣赫罗尼莫门，进门左手问询处可领中文地图。他遇到的是背包都要存、挎包可以带、水可以带但不能在展厅喝。官方界限仍是 ", el("strong", null, "40×40"), "，以当天安检为准。展厅号不按顺序连通，今天只有 2 小时 20 分，不要跟着他的三十集走完。"),
      el("p", null, "komorebi 从《宫娥》起步，不按年代从祭坛画走起，和上面的切分一致。爱琴海的珍珠写前台有 1 小时、2 小时、3 小时手册。你们 10:00 进、12:20 离馆，按六幅走，不换手册。她写的 15 欧票价以你们已购票为准。wstcbh 把戈雅《阳伞》放在 2 层一带：12:00 后六幅如果已经看完，才按当天地图找它，找不到就停。"),
      el("div", { class: "links" },
        ext("https://www.museodelprado.es/en/visit-the-museum", "官方参观和地图"),
        ext("https://www.museodelprado.es/en/visit/regulations", "参观规则"),
        ext("https://content3.cdnprado.net/doclinks/pdf/visita/preguntas-frecuentes-sep2024_v2.pdf?v=2", "2024 年 FAQ"),
        ext("https://zhuanlan.zhihu.com/p/702661672", "知乎：wstcbh，入口和地图"),
        ext("https://zhuanlan.zhihu.com/p/2061136701569888431", "知乎：komorebi，从《宫娥》看起"),
        ext("https://www.zhihu.com/question/637744025/answer/2071269025863226265", "知乎：爱琴海的珍珠，时长路线"),
        ext("https://zhuanlan.zhihu.com/p/19377361790", "知乎：wstcbh，《阳伞》在哪一层")
      ),
      pager("prado")
    );
    return s;
  }

  function renderBackup() {
    const s = el("section", { id: "backup" });
    s.append(
      el("h1", null, "走不动时"),
      el("h2", { id: "backup-plan" }, "按状态改路线"),
      el("p", { class: "local" }, "选中的方案只留在这台设备上。"),
      el("div", { class: "seg", id: "plans", role: "group", "aria-label": "当天状态" })
    );
    const seg = s.querySelector("#plans");
    [["good", "状态很好"], ["tired", "有点累"], ["rain", "下雨或超时"], ["ride", "不想走 2 公里"]].forEach(function (p) {
      const b = el("button", { type: "button", "data-plan": p[0], "aria-pressed": p[0] === planId ? "true" : "false" }, p[1]);
      seg.append(b);
    });
    s.append(el("div", { class: "card", id: "plan-text" }, el("p", null, PLANS[planId])));
    s.append(el("h2", { id: "backup-wifi" }, "Wi-Fi"));
    const table = el("table", null,
      el("tr", null, el("th", null, "地点"), el("th", null, "怎么准备")),
      el("tr", null, el("td", null, "王宫"), el("td", null, "没有可依赖的室内 Wi-Fi。票和入口离线保存。寄存免费，大包不要带进去。")),
      el("tr", null, el("td", null, "老城"), el("td", null, "个别旅游点有免费 Wi-Fi，不能靠它导航。")),
      el("tr", null, el("td", null, "丽池"), el("td", null, "短线范围内不要指望 Wi-Fi。截图出口。")),
      el("tr", null, el("td", null, "普拉多"), el("td", null, "2024 年 FAQ：只在临时展厅和 Jerónimos 门厅。展厅用离线地图。"))
    );
    s.append(table);
    s.append(
      el("p", null, "出门前三人各自把四个地点存进地图，下载马德里离线地图，截好王宫票、普拉多票、住址和 Posada 预约。自动时区打开。带充电宝。"),
      el("h2", { id: "backup-pack" }, "出发前再核一次"),
      el("p", { class: "local" }, "勾选只在这个浏览器里，不会同步给别人。")
    );
    PACK.forEach(function (item) {
      const on = checks.has(item.id);
      s.append(el("button", {
        type: "button",
        class: "check",
        "data-check": item.id,
        "aria-pressed": on ? "true" : "false"
      }, el("span", null, item.t)));
    });
    let note = "";
    try {
      const all = JSON.parse(localStorage.getItem(NOTE_KEY) || "{}");
      note = all.guide || "";
    } catch (e) {}
    const area = el("textarea", { id: "note", placeholder: "写给自己的备注，只存在这台设备" });
    area.value = note;
    s.append(
      el("h2", null, "本机备注"),
      area,
      el("p", { class: "local" }, "已发布的攻略不会被改写。"),
      el("button", { type: "button", class: "go", id: "clear-local" }, "清除本页勾选和备注"),
      el("h2", null, "笔记只用节奏，不用房间号"),
      el("p", null, "毛手手 2025-09-20 的普拉多笔记提醒：3 小时先按楼层看几组代表作，不要走完全馆。西葡行者小迪把王宫、老城、丽池、普拉多放进城市建筑史，但那是长步行，不能照搬到这一天。票务、闭馆、拍照和网络以官方为准。"),
      pager("backup")
    );
    return s;
  }

  const BUILD = {
    line: renderLine,
    palace: renderPalace,
    oldtown: renderOld,
    posada: renderPosada,
    retiro: renderRetiro,
    prado: renderPrado,
    backup: renderBackup
  };

  let findAt = 0;
  let sectionObserver = null;
  let navLockUntil = 0;

  function fillNav(container, nested) {
    const cur = (location.hash || "#line").replace("#", "");
    const parent = parentOf(cur);
    container.replaceChildren();
    if (nested && container.id === "nav") {
      const box = el("input", { class: "find", id: "find-desk", type: "search", enterkeyhint: "search", placeholder: "在本页查找", "aria-label": "在本页查找" });
      container.append(box);
    }
    NAV.forEach(function (n) {
      const a = el("a", { class: "chip", href: "#" + n.id }, n.label);
      if (n.id === parent || n.id === cur) a.setAttribute("aria-current", "true");
      container.append(a);
      if (!nested) return;
      (n.children || []).forEach(function (c) {
        const s = el("a", { class: "chip sub", href: "#" + c.id }, c.label);
        if (c.id === cur) s.setAttribute("aria-current", "true");
        container.append(s);
      });
    });
  }

  function markCurrent(container) {
    const cur = (location.hash || "#line").replace("#", "");
    const parent = parentOf(cur);
    container.querySelectorAll("a").forEach(function (a) {
      const id = (a.getAttribute("href") || "").replace("#", "");
      const on = id === cur || (!a.classList.contains("sub") && id === parent);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  function renderNav() {
    const nav = document.getElementById("nav");
    if (!nav.querySelector("a")) {
      fillNav(nav, true);
      fillNav(document.getElementById("sheet-nav"), true);
    } else {
      markCurrent(nav);
      markCurrent(document.getElementById("sheet-nav"));
    }
  }

  function scrollToHash() {
    navLockUntil = Date.now() + 900;
    const id = (location.hash || "#line").replace("#", "");
    const node = document.getElementById(id) || document.getElementById(parentOf(id));
    if (node) node.scrollIntoView({ block: "start" });
  }

  function closeSheet() {
    const sheet = document.getElementById("sheet");
    sheet.hidden = true;
    document.getElementById("toc-btn").setAttribute("aria-expanded", "false");
  }

  function watchSections() {
    if (!("IntersectionObserver" in window)) return;
    if (sectionObserver) sectionObserver.disconnect();
    sectionObserver = new IntersectionObserver(function (entries) {
      const hit = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
      if (Date.now() < navLockUntil) return;
      if (!hit || !hit.target.id) return;
      const id = hit.target.id;
      const cur = (location.hash || "").replace("#", "");
      if (cur.indexOf("prado-") === 0 && parentOf(id) === "prado") return;
      if (cur === id) return;
      history.replaceState(null, "", "#" + id);
      renderNav();
    }, { rootMargin: "-15% 0px -65% 0px", threshold: [0.2, 0.6] });
    document.querySelectorAll("section[id], h2[id]").forEach(function (n) { sectionObserver.observe(n); });
  }

  function findNext(raw) {
    const q = (raw || "").trim().toLowerCase();
    if (q.length < 1) return;
    const hits = [];
    const walker = document.createTreeWalker(document.getElementById("stage"), NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (node.nodeValue.toLowerCase().indexOf(q) >= 0 && node.parentElement) hits.push(node.parentElement);
      node = walker.nextNode();
    }
    if (!hits.length) return;
    findAt = findAt % hits.length;
    hits[findAt].scrollIntoView({ block: "center" });
    findAt += 1;
  }

  function render() {
    const stage = document.getElementById("stage");
    const nodes = NAV.map(function (n) { return BUILD[n.id](); });
    stage.replaceChildren.apply(stage, nodes);
    renderNav();
    paintChrome();
    if (location.hash) scrollToHash();
    watchSections();
  }

  function stepWork(dir) {
    const i = WORKS.findIndex(function (w) { return w.id === workId; });
    workId = WORKS[(i + dir + WORKS.length) % WORKS.length].id;
    history.replaceState(null, "", "#prado-" + workId);
    const viewer = document.getElementById("viewer");
    if (!viewer) return;
    const fresh = renderWork();
    viewer.replaceWith(fresh);
    renderNav();
  }

  document.body.addEventListener("click", function (e) {
    if (e.target.id === "sheet") { closeSheet(); return; }
    const t = e.target.closest("[data-work], [data-step], [data-plan], [data-check], #font-btn, #theme-btn, #clear-local, #toc-btn, #sheet-close, #sheet a");
    if (!t) return;
    if (t.id === "font-btn") {
      const i = FONTS.indexOf(fontNow());
      const f = FONTS[(i + 1) % FONTS.length];
      document.documentElement.setAttribute("data-font", f);
      localStorage.setItem(FONT_KEY, f);
      paintChrome();
      return;
    }
    if (t.id === "theme-btn") {
      const next = themeNow() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
      paintChrome();
      return;
    }
    if (t.hasAttribute("data-work")) {
      workId = t.getAttribute("data-work");
      history.replaceState(null, "", "#prado-" + workId);
      stepWork(0);
      return;
    }
    if (t.hasAttribute("data-step")) {
      stepWork(Number(t.getAttribute("data-step")));
      return;
    }
    if (t.hasAttribute("data-plan")) {
      planId = t.getAttribute("data-plan");
      localStorage.setItem(PLAN_KEY, planId);
      document.querySelectorAll("[data-plan]").forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-plan") === planId ? "true" : "false");
      });
      const box = document.getElementById("plan-text");
      if (box) box.replaceChildren(el("p", null, PLANS[planId]));
      return;
    }
    if (t.hasAttribute("data-check")) {
      const id = t.getAttribute("data-check");
      if (checks.has(id)) checks.delete(id);
      else checks.add(id);
      saveChecks();
      t.setAttribute("aria-pressed", checks.has(id) ? "true" : "false");
      return;
    }
    if (t.id === "toc-btn") {
      const sheet = document.getElementById("sheet");
      const open = sheet.hidden;
      sheet.hidden = !open;
      t.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) document.getElementById("find-mobile").focus();
      return;
    }
    if (t.id === "sheet-close" || t.closest("#sheet a")) {
      closeSheet();
      if (t.id === "sheet-close") return;
    }
    if (t.id === "clear-local") {
      localStorage.removeItem(CHECK_KEY);
      localStorage.removeItem(PLAN_KEY);
      try {
        const all = JSON.parse(localStorage.getItem(NOTE_KEY) || "{}");
        delete all.guide;
        localStorage.setItem(NOTE_KEY, JSON.stringify(all));
      } catch (err) {}
      checks = new Set();
      planId = "good";
      render();
    }
  });

  document.body.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSheet();
    if (e.key !== "Enter") return;
    if (e.target.id !== "find-desk" && e.target.id !== "find-mobile") return;
    e.preventDefault();
    findNext(e.target.value);
  });

  document.body.addEventListener("input", function (e) {
    if (e.target.id === "find-desk" || e.target.id === "find-mobile") findAt = 0;
    if (e.target.id !== "note") return;
    let all = {};
    try { all = JSON.parse(localStorage.getItem(NOTE_KEY) || "{}"); } catch (err) {}
    const v = e.target.value.trim();
    if (v) all.guide = e.target.value;
    else delete all.guide;
    localStorage.setItem(NOTE_KEY, JSON.stringify(all));
  });

  window.addEventListener("hashchange", function () {
    const h = (location.hash || "").replace("#", "");
    if (h.indexOf("prado-") === 0) {
      const id = h.slice(6);
      if (WORKS.some(function (w) { return w.id === id; })) {
        workId = id;
        const viewer = document.getElementById("viewer");
        if (viewer) viewer.replaceWith(renderWork());
      }
    }
    renderNav();
    scrollToHash();
    closeSheet();
  });

  if (!localStorage.getItem(THEME_KEY)) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = function () {
      if (!localStorage.getItem(THEME_KEY)) {
        document.documentElement.setAttribute("data-theme", mq.matches ? "dark" : "light");
        paintChrome();
      }
    };
    if (mq.addEventListener) mq.addEventListener("change", follow);
  }

  loadLocal();
  render();
})();
