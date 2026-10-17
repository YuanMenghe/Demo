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
    { id: "line", label: "一天", back: "d26", backLabel: "回到 10月26日" },
    { id: "palace", label: "王宫", back: "b26-palace", backLabel: "回到王宫这段" },
    { id: "oldtown", label: "老城", back: "b26-town", backLabel: "回到老城这段" },
    { id: "posada", label: "午饭", back: "b26-lunch", backLabel: "回到午饭这段" },
    { id: "retiro", label: "丽池", back: "b26-gate", backLabel: "回到丽池这段" },
    { id: "prado", label: "普拉多", back: "b26-prado", backLabel: "回到普拉多这段" },
    { id: "backup", label: "备选", back: "d26", backLabel: "回到 10月26日" }
  ];
  const WORKS = [
    { id: "greco", name: "埃尔·格列柯《手按胸口的贵族》", room: "Room 008B", mins: "10–12 分钟", must: false, look: "先看黑衣和灰背景，再看白手、金剑柄和直视观众的眼神。身份仍有不同解释，不必当成已经确定的肖像。", history: "约 1580 年。他从克里特来到西班牙，在托莱多形成个人画风。姿态、衣料和佩剑在表达贵族身份。", href: "https://www.museodelprado.es/en/the-collection/art-work/the-nobleman-with-his-hand-on-his-chest/9cb73bdf-66e8-4826-a79c-5de2b15a1da6" },
    { id: "bosch", name: "博斯《人间乐园》", room: "Room 056A", mins: "15–20 分钟", must: true, look: "先看闭合画板外侧，再从左翼伊甸园走到中央，最后看右翼地狱。不要只放大找怪物。", history: "腓力二世 1591 年购入，后送往埃斯科里亚尔。北方绘画就这样进入西班牙王室和宗教收藏。", href: "https://www.museodelprado.es/en/the-collection/art-work/the-garden-of-earthly-delights-triptych/02388242-6d6a-4e9e-a992-e1311eab3609" },
    { id: "meninas", name: "委拉斯开兹《宫娥》", room: "Room 012", mins: "20–25 分钟", must: true, look: "先找镜中的腓力四世和王后，再找画家本人、后方门口的人，以及画布背面。问的是：谁在看谁？", history: "1656 年，为宫廷空间而作。它把观看本身变成主题，也把画家放进宫廷。", href: "https://www.museodelprado.es/en/the-collection/art-work/las-meninas/9fdc7800-9ade-48b0-ab8b-edee94ea877f", img: IMG.meninas, alt: "普拉多宫娥展厅" },
    { id: "family", name: "戈雅《卡洛斯四世一家》", room: "Room 032", mins: "12–15 分钟", must: false, look: "看每个人的脸、站位、衣饰和勋章。不要只套用「戈雅在讽刺王室」这种网传说法。", history: "1800 年，戈雅任第一宫廷画师后绘制。和《宫娥》对照：一幅制造谜题，一幅让各人的性格浮出来。", href: "https://www.museodelprado.es/en/the-collection/art-work/the-family-of-carlos-iv/f47898fc-aa1c-48f6-a779-71759e417e74" },
    { id: "may3", name: "戈雅《1808年5月3日》", room: "Room 064", mins: "15–20 分钟", must: true, look: "灯光把受刑者和枪队分成两组。枪手几乎没有脸，白衣和手势让个人命运站到画面中央。", history: "1814 年完成，回看 1808 年马德里起义。可以和《1808年5月2日》一起看。这不是当时的新闻插画。", href: "https://www.museodelprado.es/en/the-collection/art-work/the-3rd-of-may-1808-in-madrid-or-the-executions/5e177409-2993-4240-97fb-847a02c6496c" },
    { id: "saturn", name: "戈雅《农神吞噬其子》", room: "Room 067", mins: "10–12 分钟", must: false, look: "从明亮的历史画转到近乎封闭的黑。看身体怎样被背景吞没。", history: "约 1820–1823 年的黑色绘画，原在私人住宅墙上，后来转移到画布。用它收束戈雅从宫廷画师到晚年的转变。", href: "https://www.museodelprado.es/en/the-collection/art-work/saturn/18110a75-b0e7-430c-bc73-2a4d55893bd6" }
  ];
  const PACK = [
    { id: "g-palace", t: "王宫票：10月26日 10:00。再看一次游客入口和有没有临时关闭。" },
    { id: "g-prado", t: "普拉多票：10月26日 16:00。保存二维码，预先下载官方地图。" },
    { id: "g-posada", t: "Posada：12:45，最终人数 3 或 4。再确认烤乳羊和菜量。" },
    { id: "g-rooms", t: "核对《宫娥》、博斯《人间乐园》、戈雅是否在展、在哪一厅。" },
    { id: "g-weather", t: "看丽池会不会因天气封园。天气差或不想走，就跳过园林。" },
    { id: "g-offline", t: "离线保存票、路线和住址。普拉多厅内不拍照，王宫按每厅标识。" }
  ];
  const PLANS = {
    good: "照主表走。中午老城步行，午饭后约 2 公里走到丽池，Parterre 停留约 30 分钟，然后去普拉多。",
    tired: "王宫后只留阿穆德纳外观、Plaza de la Villa 和 Plaza Mayor。午饭后从 Posada 打车直接去普拉多。丽池留到下次。",
    rain: "跳过丽池，直接去普拉多。丽池可能因暴雨、强风封园或局部围挡，以市政府当天通知为准。王宫和普拉多仍要留预约缓冲。",
    ride: "不想走约 2 公里：从 Posada 打车到 Felipe IV 门，只走 Parterre，再到普拉多约 0.4 公里。行动不便就直接送到普拉多适合进馆的入口。"
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
  function sectionId() {
    const h = (location.hash || "#line").replace("#", "");
    if (h.indexOf("prado") === 0) return "prado";
    if (NAV.some(function (n) { return n.id === h; })) return h;
    return "line";
  }
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
    box.append(el("a", { class: "go", href: document.getElementById("back").getAttribute("href") }, "返回日程"));
    return box;
  }

  function renderLine() {
    const s = el("section", { id: "line" });
    s.append(
      el("p", { class: "kicker" }, "10月26日 · 周一 · 3 人 · 马德里时间"),
      el("h1", null, "一天怎么串起来"),
      el("p", null, "主线是：", el("mark", null, "王权怎样塑造城市，王室收藏怎样进入博物馆。")),
      el("p", null, "王宫高地接着伊斯兰时期的堡垒和后来的哈布斯堡宫殿。普拉多的核心来自王室收藏。丽池和普拉多大道同属 UNESCO 的「艺术与科学景观」。展陈会变，出发前再核对房间和临时闭馆。"),
      ext("https://whc.unesco.org/en/list/1618", "UNESCO 说明"),
      el("h2", null, "时间只记取舍"),
      el("div", { class: "card" },
        el("p", { class: "when" }, "10:00 和 16:00 先保住"),
        el("p", null, "王宫和普拉多都买带时间的官方票。丽池只走 Parterre，大约 30 分钟。Plaza Mayor 放在午饭前，午后不折回老城。")
      ),
      el("div", { class: "card" },
        el("p", null, el("strong", null, "08:45"), " 出门。", el("strong", null, "10:00–11:30"), " 王宫。", el("strong", null, "11:30–12:30"), " 老城。", el("strong", null, "12:45"), " Posada。"),
        el("p", null, el("strong", null, "14:15"), " 去 Felipe IV 门。", el("strong", null, "14:45–15:15"), " 园林短线。", el("strong", null, "16:00–19:30"), " 普拉多。晚上不再加景点。")
      ),
      pager("line")
    );
    return s;
  }

  function renderPalace() {
    const rooms = [
      ["主楼梯", "5 分钟", "来访者进入宫廷秩序的第一幕。官方介绍称楼梯由 Sabatini 设计，有 70 余级。"],
      ["王座厅", "8–10 分钟", "先看 Tiepolo 天顶，再看红色织物、镜子和金饰。稍后用它对照《宫娥》：这里是正式的王权图像。"],
      ["Gasparini 厅", "8–10 分钟", "植物纹样是 18 世纪宫廷趣味。卡洛斯三世办公室则是处理政务的地方，2025 年纳入参观线路，当天是否开放以现场为准。"],
      ["礼拜堂 / 圣器室", "5–8 分钟", "宫廷也靠宗教和王朝礼仪。留意礼仪用品和 Stradivari 弦乐器。圣器室近年才增加进入，以当天为准。"],
      ["皇家药房", "5 分钟", "药柜、陶罐和处方把宫廷拉回身体和供应。对医疗同行会比较具体。"],
      ["皇家军械馆", "可选 20–30 分钟", "更关心战争史时，压缩一个装饰厅再来。留意查理五世的盔甲。官方估计大约 30 分钟，常要另留时间。"]
    ];
    const s = el("section", { id: "palace" });
    s.append(
      el("p", { class: "kicker" }, "10:00–11:30 · 约 90 分钟"),
      el("h1", null, "王宫"),
      figure(IMG.palace, "马德里王宫外观", "王宫外观。图片来源：马德里旅游局。"),
      el("p", null, el("mark", null, "现在看到的波旁王宫，不是这座城最早的一层。")),
      el("ul", null,
        el("li", null, el("strong", null, "9 世纪 Magerit。"), "穆罕默德一世在此建防御据点，保护当时的托莱多。"),
        el("li", null, el("strong", null, "哈布斯堡旧 Alcázar。"), "卡洛斯一世、腓力二世把它变成常住宫殿。腓力二世时期马德里成为王都。"),
        el("li", null, el("strong", null, "1734 年火灾之后。"), "腓力五世下令建新宫。方案从 Filippo Juvarra 开始，学生 Juan Bautista Sachetti 完成。卡洛斯三世是第一位住进来的君主。")
      ),
      ext("https://www.esmadrid.com/en/tourist-information/royal-palace", "王宫历史")
    );
    rooms.forEach(function (r) {
      s.append(el("article", { class: "stop" },
        el("p", { class: "when" }, r[1]),
        el("h2", null, r[0]),
        el("p", null, r[2])
      ));
    });
    s.append(
      figure(IMG.gasparini, "Gasparini 厅内部", "Gasparini 厅。图片来源：马德里旅游局。"),
      el("p", null, "超过 3000 个房间，旅游线路只开放一部分。优先楼梯、王座厅、Gasparini、礼拜堂和药房；动线允许再加军械馆。"),
      el("h2", null, "出宫后的轴线"),
      el("div", { class: "card" },
        el("p", null, el("strong", null, "Plaza de la Armería："), "回看主立面，再向城里走。入口按官方指示从这里进，不要按旧攻略排别的门。"),
        el("p", null, el("strong", null, "Plaza de Oriente："), "王宫和 Teatro Real 之间，看宫殿、歌剧院和广场怎样被组织成首都展示。"),
        el("p", null, el("strong", null, "Mirador de la Cornisa："), "免费看 Campo del Moro。开门、不排队再停几分钟，不为观景排长队。")
      ),
      el("h2", null, "进门前"),
      el("p", null, el("span", { class: "flag" }, "没有可靠室内 Wi-Fi"), "官方参观页没有承诺游客能用宫内 Wi-Fi。票、地图和翻译提前下好。"),
      el("p", null, "个人用途、不用闪光灯可以拍照，但有明确禁止区域。自拍杆和三脚架不能带。手机里留门票二维码，背包尽量小，入馆前先上洗手间。"),
      el("div", { class: "links" },
        ext("https://tickets.patrimonionacional.es/en/tickets/palacio-real-de-madrid?city=ZMM", "官方票务和拍照规则"),
        ext("https://www.patrimonionacional.es/en/visita/royal-palace-madrid", "开放信息")
      ),
      pager("palace")
    );
    return s;
  }

  function renderOld() {
    const stops = [
      ["阿穆德纳外观 → 东方广场", "10–15 分钟", "看宫殿、大教堂、歌剧院的仪式轴线。大教堂主体晚至 19–20 世纪，不要当成中世纪古迹。旁边的旧城墙更接近早期城市。"],
      ["Plaza de la Villa", "约 10 分钟", "三层市政建筑叠在一起：15 世纪 Lujanes 塔楼和宅邸、16 世纪 Cisneros 宅邸、17 世纪旧市政厅 Casa de la Villa。"],
      ["Plaza Mayor", "10–15 分钟", "腓力三世 1617 年委托 Juan Gómez de Mora 改造。抬头看连排阳台：广场当时是节庆和仪式的露天剧场。中央骑马像是腓力三世，不是腓力四世。"],
      ["走到 Posada", "5–10 分钟", "Cava Baja 延续着旧城旅店和酒馆。Posada de la Villa 创办于 1642 年，所以这顿饭接在城市史里。"]
    ];
    const s = el("section", { id: "oldtown" });
    s.append(
      el("p", { class: "kicker" }, "11:30–12:30"),
      el("h1", null, "老城"),
      el("p", null, el("mark", null, "王宫高地是权力中心，Villa 是市政核心，Mayor 是公共仪式剧场。")),
      el("p", null, "这一小时是户外的城市史，不是路过拍照。午饭后不再折回。")
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
        ext("https://www.esmadrid.com/en/48-hours-madrid", "Plaza Mayor 建造史")
      ),
      pager("oldtown")
    );
    return s;
  }

  function renderPosada() {
    const s = el("section", { id: "posada" });
    s.append(
      el("p", { class: "kicker" }, "12:45–14:15"),
      el("h1", null, "Posada de la Villa"),
      el("p", null, el("mark", null, "1642 年的旅店，接在老城商路的尽头，不是单独找的一家名店。")),
      el("p", null, "点菜、人数和预算仍以行程手册为准。订的是 ", el("strong", null, "12:45"), "，3 或 4 人，并确认当天烤乳羊。"),
      el("p", null, "时间紧就不要在 Plaza Mayor 再排队买小吃。如果想尝鱿鱼三明治，只在午餐前分食一份，而且队伍不能影响订位。"),
      el("div", { class: "links" },
        ext("https://www.esmadrid.com/en/illustrated-map-centuries-old-restaurants-and-tabernas", "百年酒馆介绍"),
        el("a", { class: "go", href: "index.html#book" }, "回手册看点菜"),
        ext("https://www.google.com/maps/dir/?api=1&origin=Posada+de+la+Villa%2C+Cava+Baja+9%2C+Madrid&destination=Puerta+de+Felipe+IV%2C+Calle+de+Alfonso+XII+3%2C+Madrid&travelmode=walking", "饭后步行去丽池")
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
      el("p", { class: "kicker" }, "14:45–15:15 · 只走历史核心"),
      el("h1", null, "丽池"),
      figure(IMG.gate, "丽池 Felipe IV 门", "Felipe IV 门。图片来源：马德里旅游局。"),
      el("p", null, el("mark", null, "看的是王家园林怎样变成公共文化景观，不是环湖拍照。")),
      figure(IMG.crystal, "丽池水晶宫外观", "水晶宫外观。2026 年 10 月预计仍在修缮，只能看外部装置，不能列入入内。图片来源：马德里旅游局。"),
      el("p", null, el("span", { class: "flag" }, "水晶宫闭馆至 2027"), "1887 年由 Ricardo Velázquez Bosco 为菲律宾群岛植物展览设计，曾是铁与玻璃的温室。")
    );
    rows.forEach(function (r) {
      s.append(el("article", { class: "stop" }, el("h2", null, r[0]), el("p", null, r[1])));
    });
    s.append(
      el("div", { class: "note" }, el("p", null, "精神很好可以继续去大湖和阿方索十二世纪念碑，但必须在普拉多 16:00 前离园。更想看画，就不要为湖景挤时间。")),
      el("p", null, "公园 10 月至次年 3 月官方开放 ", el("strong", null, "06:00–22:00"), "。暴雨、强风可能封闭。免费 Wi-Fi 在 Cecilio Rodríguez Gardens，不在这条短线上，也不能覆盖全园。进园前截好出口和普拉多入口。"),
      el("div", { class: "links" },
        ext("https://www.esmadrid.com/informacion-turistica/parque-del-retiro", "公园官方页"),
        ext("https://www.esmadrid.com/en/tourist-information/felipe-iv-gate", "Felipe IV 门"),
        ext("https://www.esmadrid.com/informacion-turistica/palacio-de-cristal", "水晶宫维修说明"),
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
      ext(w.href, "普拉多作品页")
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
      el("p", { class: "kicker" }, "16:00–19:30 · 不求看遍"),
      el("h1", null, "普拉多"),
      el("p", null, el("mark", null, "把它看成权力怎样挑选艺术，不是找几幅名作拍照。")),
      el("p", null, "1819 年以皇家绘画博物馆对公众开放。建筑最初由 Juan de Villanueva 设计为科学用途，后来才成为博物馆。下表是主题锚点，不是保证一路相连的导航。入馆后以官方数字地图和墙面为准。"),
      el("p", null, el("span", { class: "flag" }, "厅内禁止摄影和录像"), "免费 Wi-Fi 只确认在 ", el("strong", null, "Café Prado"), "，不要假设展厅有网。中文语音导览当场再确认，自带耳机并充好电。")
    );
    s.append(renderWork());
    s.append(
      el("h2", null, "3.5 小时怎么切"),
      el("div", { class: "card" },
        el("p", null, el("strong", null, "16:00–16:15"), " 存包，打开地图，先确认《宫娥》、博斯和戈雅当天在不在展。"),
        el("p", null, el("strong", null, "16:15–17:05"), " 先看最想看的。拥挤就先看《宫娥》和博斯。"),
        el("p", null, el("strong", null, "17:05–17:15"), " 坐下喝水。"),
        el("p", null, el("strong", null, "17:15–18:45"), " 戈雅一组。动线不顺就跟地图，不要为了年代顺序来回折返。"),
        el("p", null, el("strong", null, "18:45–19:15"), " 补埃尔·格列柯，或一位更喜欢的意大利 / 弗拉芒画家。不再追加十几件。"),
        el("p", null, el("strong", null, "19:15–19:30"), " 洗手间、商店、离馆。")
      ),
      el("div", { class: "links" },
        ext("https://www.museodelprado.es/en/visit-the-museum", "官方参观和地图"),
        ext("https://www.museodelprado.es/en/visit/opening-times-and-prices", "开放时间与票价"),
        ext("https://content3.cdnprado.net/doclinks/pdf/visita/preguntas-frecuentes-07julio2022.pdf", "FAQ：中文讲解与 Wi-Fi")
      ),
      pager("prado")
    );
    return s;
  }

  function renderBackup() {
    const s = el("section", { id: "backup" });
    s.append(
      el("h1", null, "走不动时"),
      el("p", { class: "local" }, "选中的方案只留在这台设备上。"),
      el("div", { class: "seg", id: "plans", role: "group", "aria-label": "当天状态" })
    );
    const seg = s.querySelector("#plans");
    [["good", "状态很好"], ["tired", "有点累"], ["rain", "下雨或超时"], ["ride", "不想走 2 公里"]].forEach(function (p) {
      const b = el("button", { type: "button", "data-plan": p[0], "aria-pressed": p[0] === planId ? "true" : "false" }, p[1]);
      seg.append(b);
    });
    s.append(el("div", { class: "card", id: "plan-text" }, el("p", null, PLANS[planId])));
    s.append(el("h2", null, "Wi-Fi"));
    const table = el("table", null,
      el("tr", null, el("th", null, "地点"), el("th", null, "怎么准备")),
      el("tr", null, el("td", null, "王宫"), el("td", null, "官方页没确认游客 Wi-Fi。票和入口离线保存。")),
      el("tr", null, el("td", null, "老城"), el("td", null, "个别旅游点有免费 Wi-Fi，不能靠它导航。")),
      el("tr", null, el("td", null, "丽池"), el("td", null, "短线范围内不要指望 Wi-Fi。截图出口。")),
      el("tr", null, el("td", null, "普拉多"), el("td", null, "只确认 Café Prado。展厅用离线地图。"))
    );
    s.append(table);
    s.append(
      el("p", null, "出门前三人各自把四个地点存进地图，下载马德里离线地图，截好王宫票、普拉多票、住址和 Posada 预约。自动时区打开。带充电宝。"),
      el("h2", null, "出发前再核一次"),
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

  function renderNav() {
    const nav = document.getElementById("nav");
    const cur = sectionId();
    nav.replaceChildren();
    NAV.forEach(function (n) {
      const a = el("a", { class: "chip", href: "#" + n.id }, n.label);
      if (n.id === cur) a.setAttribute("aria-current", "true");
      nav.append(a);
    });
    const meta = NAV.filter(function (n) { return n.id === cur; })[0];
    document.getElementById("back").setAttribute("href", "index.html#" + meta.back);
    document.getElementById("back").textContent = meta.backLabel;
  }

  function render() {
    renderNav();
    const id = sectionId();
    const stage = document.getElementById("stage");
    const nodes = NAV.map(function (n) {
      const node = BUILD[n.id]();
      node.hidden = n.id !== id;
      return node;
    });
    stage.replaceChildren.apply(stage, nodes);
    paintChrome();
  }

  function stepWork(dir) {
    const i = WORKS.findIndex(function (w) { return w.id === workId; });
    workId = WORKS[(i + dir + WORKS.length) % WORKS.length].id;
    history.replaceState(null, "", "#prado-" + workId);
    const viewer = document.getElementById("viewer");
    if (!viewer) return;
    const fresh = renderWork();
    viewer.replaceWith(fresh);
  }

  document.body.addEventListener("click", function (e) {
    const t = e.target.closest("[data-work], [data-step], [data-plan], [data-check], #font-btn, #theme-btn, #clear-local");
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

  document.body.addEventListener("input", function (e) {
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
      if (WORKS.some(function (w) { return w.id === id; })) workId = id;
    }
    render();
    window.scrollTo(0, 0);
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
