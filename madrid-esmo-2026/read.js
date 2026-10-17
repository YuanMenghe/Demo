(function () {
  const THEME_KEY = "madrid-esmo-2026-theme";
  const FONT_KEY = "madrid-esmo-2026-font";
  const FONTS = ["sm", "md", "lg", "xl"];
  const FONT_LABEL = { sm: "小", md: "标准", lg: "大", xl: "特大" };
  const NAV = [
    { id: "how", label: "怎么读", children: [
      { id: "how-order", label: "四步" }
    ]},
    { id: "artist-greco", label: "格列柯", children: [
      { id: "work-greco", label: "手按胸口的贵族" }
    ]},
    { id: "artist-bosch", label: "博斯", children: [
      { id: "work-bosch", label: "人间乐园" }
    ]},
    { id: "artist-velazquez", label: "委拉斯开兹", children: [
      { id: "work-meninas", label: "宫娥" }
    ]},
    { id: "artist-goya", label: "戈雅", children: [
      { id: "work-family", label: "卡洛斯四世一家" },
      { id: "work-may3", label: "5月3日" },
      { id: "work-saturn", label: "农神" }
    ]},
    { id: "tiepolo", label: "提埃波罗", children: [
      { id: "tiepolo-ceiling", label: "王座厅天顶" }
    ]}
  ];

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
  function S(t) { return el("strong", null, t); }
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
    const h = hash == null ? (location.hash || "#how").replace("#", "") : hash;
    let found = "";
    NAV.forEach(function (n) {
      if (n.id === h) found = n.id;
      (n.children || []).forEach(function (c) { if (c.id === h) found = n.id; });
    });
    return found || "how";
  }
  function sourceOf(id) {
    if (id === "tiepolo" || id === "tiepolo-ceiling") return "guide.html#palace-rooms";
    if (id === "how" || id === "how-order") return "guide.html#line";
    if (id.indexOf("work-") === 0) return "guide.html#prado-" + id.slice(5);
    return "guide.html#prado-works";
  }
  function pager(id) {
    const i = NAV.findIndex(function (n) { return n.id === id; });
    const box = el("div", { class: "rowbtns" });
    if (i > 0) box.append(el("a", { class: "go", href: "#" + NAV[i - 1].id }, "上一位"));
    if (i < NAV.length - 1) box.append(el("a", { class: "go", href: "#" + NAV[i + 1].id }, "下一位 · " + NAV[i + 1].label));
    box.append(el("a", { class: "go", href: sourceOf(id) }, "回到游览里的这一段"));
    return box;
  }
  function links() {
    const box = el("div", { class: "links" });
    for (let i = 0; i < arguments.length; i += 2) box.append(ext(arguments[i], arguments[i + 1]));
    return box;
  }

  function renderHow() {
    const s = el("section", { id: "how" });
    s.append(
      el("p", { class: "kicker" }, "只服务 10 月 26 日这条线"),
      el("h1", null, "先有问题，再看画"),
      el("p", null, el("mark", null, "画家回答他是谁、和今天有什么关系；画回答一个问题，并告诉你先看哪里。")),
      el("p", null, "顺序不是出生年。格列柯在前，是因为用他认 16 世纪的贵族肖像。博斯更早，但放在第二，是因为要看北方绘画怎样在 1591 年进入西班牙王室。委拉斯开兹接着看宫廷里的观看。戈雅一个人占三幅，从宫廷走到战争，再走到自己家的墙。提埃波罗不在普拉多，他在上午的王座厅，用来对照《宫娥》。"),
      el("h2", { id: "how-order" }, "每幅画都按这四步"),
      el("ol", null,
        el("li", null, S("它在回答什么。"), "先有这一句，再进细节。"),
        el("li", null, S("画面上先看哪里。"), "按这个顺序看，不要一上来找掌故。"),
        el("li", null, S("哪种说法先不要采信。"), "网传身份、讽刺、国王亲笔，没有馆方定论的都不当成事实。"),
        el("li", null, S("官方页在哪。"), "年代、尺寸、收藏路径以普拉多作品页为准。展厅号入馆后再对地图。")
      ),
      pager("how")
    );
    return s;
  }

  function renderGreco() {
    const s = el("section", { id: "artist-greco" });
    s.append(
      el("p", { class: "kicker" }, "1541–1614 · 克里特到托莱多"),
      el("h1", null, "埃尔·格列柯"),
      el("p", null, "Doménikos Theotokópoulos。西班牙人叫他 El Greco，就是「希腊人」。", el("mark", null, "他不是西班牙本土出身的画家。")),
      el("p", null, "1541 年生于克里特的干地亚，先受圣像画训练，再到威尼斯和罗马。1577 年前后到西班牙，此后主要在托莱多作画，1614 年死在那里。今天只靠他认一件事：16 世纪贵族肖像怎样用黑衣、白领、佩剑和直视表示身份。"),
      el("p", null, "拉长的人体和很冲的颜色，是他宗教画里更出名的部分。这一幅肖像还比较克制，不要拿「格列柯的人都很飘」来套。"),
      el("h2", { id: "work-greco" }, "《手按胸口的贵族》"),
      el("p", { class: "when" }, "约 1580 · 布面油画 · 81.8 × 66.1 厘米 · Room 008B"),
      el("p", null, S("它在回答："), "一个 16 世纪的西班牙贵族，怎样让别人一眼看出身份。"),
      el("p", null, S("先看："), "灰背景和黑衣，再看白手、金剑柄和白领，最后看他是否直视你。手按胸口在他的宗教画里更常见。馆方认为目前最有说服力的辨认，是托莱多城堡军事长官、王国首席公证人胡安·德·席尔瓦（Juan de Silva y de Ribera）。若是他，这个手势可以读成宣誓。这仍是一种辨认，不是定案。"),
      el("div", { class: "note" }, el("p", null, "先不要采信：他就是塞万提斯，或就是格列柯自己。1996 年修复前那种发黑、发白的样子，是后来的改绘和氧化光油，不是原画。")),
      el("p", null, "馆藏编号 P000809。它从王室收藏来，1834 年入馆。停留 10–12 分钟。时间紧可以放到 18:45 之后。"),
      links(
        "https://www.museodelprado.es/en/the-collection/art-work/the-nobleman-with-his-hand-on-his-chest/9cb73bdf-66e8-4826-a79c-5de2b15a1da6", "普拉多作品页",
        "https://www.museodelprado.es/en/easy-to-read/the-gentleman-with-his-hand-on-his-chest-greco/8e210337-42d4-2e5f-600e-3b213119be48", "普拉多易读版"
      ),
      pager("artist-greco")
    );
    return s;
  }

  function renderBosch() {
    const s = el("section", { id: "artist-bosch" });
    s.append(
      el("p", { class: "kicker" }, "约 1450–1516 · 人没来过西班牙"),
      el("h1", null, "希罗尼穆斯·博斯"),
      el("p", null, el("mark", null, "看他，是看一幅北方的画怎样进入西班牙王室，不是看一位在马德里工作的画家。")),
      el("p", null, "他一生主要在今天荷兰的斯海尔托亨博斯。腓力二世是他后来最重要的收藏者之一。画比人先到西班牙。"),
      el("p", null, "《人间乐园》约 1490–1500 年完成，早先在拿骚家族手里。1568 年 5 月 28 日，阿尔巴公爵在布鲁塞尔把它没收。画后来到公爵的私生子费尔南多·德·托莱多处。", S("1591 年"), "腓力二世在他的身后拍卖里买下，", S("1593 年 7 月 8 日"), "作为第六批作品送进埃斯科里亚尔。1933 年从修道院移到普拉多，1943 年定为长期出借，产权仍属国家遗产名下的埃斯科里亚尔。"),
      el("h2", { id: "work-bosch" }, "《人间乐园》"),
      el("p", { class: "when" }, "约 1490–1500 · 橡木板油画 · 中板 185.8 × 172.5 厘米 · Room 056A"),
      el("p", null, S("它在回答："), "人的行为、欲望和惩罚，怎样被放进一幅从创造走到地狱的图里。"),
      el("p", null, S("先看："), "合上的外侧，灰笔里的世界和角落的上帝。打开以后从左翼伊甸园走到中板，再看右翼地狱。走完一遍，再决定要不要凑近找细节。两翼各宽 76.5 厘米。"),
      el("div", { class: "note" }, el("p", null, "先不要采信：某一只怪物等于今天的某个政治寓意。订件人仍有讨论，参观时记住上面这条收藏路径就够。")),
      el("p", null, "馆藏编号 P002823。停留 15–20 分钟。时间紧也尽量看。它和馆里其他博斯放在一起，今天不追加。"),
      links(
        "https://www.museodelprado.es/en/the-collection/art-work/the-garden-of-earthly-delights-triptych/02388242-6d6a-4e9e-a992-e1311eab3609", "普拉多作品页"
      ),
      pager("artist-bosch")
    );
    return s;
  }

  function renderVelazquez() {
    const s = el("section", { id: "artist-velazquez" });
    s.append(
      el("p", { class: "kicker" }, "1599–1660 · 塞维利亚到马德里宫廷"),
      el("h1", null, "迭戈·委拉斯开兹"),
      el("p", null, el("mark", null, "他在宫廷里不只是画画的人。"), "《宫娥》把这件事画进了房间。"),
      el("p", null, "1599 年生于塞维利亚，师从帕切科。1623 年成为腓力四世的宫廷画师，其间两次去意大利，1660 年死于马德里。腰间的钥匙是内廷职务，不是画具。"),
      el("p", null, "用他对照上午的王座厅。提埃波罗的天顶宣布这套统治有天命；《宫娥》把国王、王后、公主、侍从和画家放在同一间屋子里，问谁在看谁。两幅隔着大约一百年，也隔着 1734 年烧掉旧王宫的那场火。这幅画当时就在旧宫里，火灾中被救出来，所以上午的新宫和下午的这幅画，是同一件事的两端。"),
      el("h2", { id: "work-meninas" }, "《宫娥》"),
      el("p", { class: "when" }, "1656 · 布面油画 · 约 320.3 × 279.1 厘米 · Room 012"),
      el("p", null, S("它在回答："), "国王和王后是在画里、在画外，还是只在镜子里？画家在这间屋子里站在什么位置？"),
      el("p", null, S("先看："), "镜子里的腓力四世和王后玛丽安娜。再看画家自己，和他面前那块我们看不见正面的画布。再看后方门口的何塞·涅托。最后才认公主玛格丽塔、两位宫女、两名矮人和狗。"),
      el("p", null, "标题是后起的。1666 年的王宫清单称它为皇后娘娘与宫女、一名矮人之像。1734 年火灾之后的记录改称腓力四世一家。", S("1843 年"), "普拉多目录才第一次写成 Las meninas。menina 来自葡萄牙语，指进宫侍奉的小侍从。"),
      el("div", { class: "note" }, el("p", null, "胸口的圣雅各红十字是后来加上的。他 1659 年才成为骑士，画完成于 1656 年。18 世纪的帕洛米诺写过「有人说是国王亲笔」，没有证据能定是谁加的。不要讲成已经证实的故事。")),
      el("p", null, "停留 20–25 分钟。时间紧也尽量看。厅内不能拍照。"),
      links(
        "https://www.museodelprado.es/en/the-collection/art-work/las-meninas/9fdc7800-9ade-48b0-ab8b-edee94ea877f", "普拉多作品页",
        "https://www.museodelprado.es/en/aprende/enciclopedia/voz/meninas-las-velazquez/296ac38f-8bf6-439d-b13c-ed22de8c39de", "普拉多百科：标题怎么来的"
      ),
      pager("artist-velazquez")
    );
    return s;
  }

  function renderGoya() {
    const s = el("section", { id: "artist-goya" });
    s.append(
      el("p", { class: "kicker" }, "1746–1828 · 三幅画是三段人生"),
      el("h1", null, "弗朗西斯科·戈雅"),
      el("p", null, el("mark", null, "按这个顺序看，不要打乱：宫廷、战争、自己家的墙。")),
      el("p", null, "1746 年生于阿拉贡的富恩德托多斯，1828 年死于波尔多。1789 年前后成为宫廷画师，1799 年任第一宫廷画师。1819 年他生过一场重病。1824 年离开西班牙。"),
      el("ul", null,
        el("li", null, S("1800，《卡洛斯四世一家》。"), "他还在画宫廷，并且明显在回应《宫娥》。"),
        el("li", null, S("1814，《1808年5月3日》。"), "他回看法军占领期间的马德里，不再画胜利者。"),
        el("li", null, S("约 1820–1823，《农神》。"), "画在马德里郊外自家的墙上，不是为王宫，也不是为公众。")
      ),
      el("h2", { id: "work-family" }, "《卡洛斯四世一家》"),
      el("p", { class: "when" }, "1800 · Room 032 · 12–15 分钟"),
      el("p", null, S("它在回答："), "同一屋里的王室成员，各自怎样被看成一个具体的人。"),
      el("p", null, S("先看："), "每个人的脸、站位、衣服和勋章。戈雅把自己放在后景的画架前，这是在向《宫娥》里的委拉斯开兹致意。差别也很清楚：那一幅制造「谁在看谁」，这一幅让各人的性格浮出来。"),
      el("div", { class: "note" }, el("p", null, "先不要采信：「他把王室画丑，所以这是讽刺」。性格刻得很强，是画面上看得到的。讽刺是后来的读者加上的。")),
      links(
        "https://www.museodelprado.es/en/the-collection/art-work/the-family-of-carlos-iv/f47898fc-aa1c-48f6-a779-71759e417e74", "普拉多作品页"
      ),
      el("h2", { id: "work-may3" }, "《1808年5月3日》"),
      el("p", { class: "when" }, "1814 年完成 · Room 064 · 15–20 分钟"),
      el("p", null, S("它在回答："), "一场已经过去的处决，怎样被画成两组人，而不是一幅胜利者的肖像。"),
      el("p", null, S("先看："), "灯。它照亮白衣和举手的人，把射击的人收成几乎没有脸的一排。个人在这边，执行在那边。"),
      el("p", null, "它和《1808年5月2日》是一对，都是事后委托，画的是 1808 年马德里起义和法国占领。5 月 2 日那幅是骑兵冲击人群。两幅都不是当天的新闻画。常见讲解会指出前排有祈祷的人、仰头的人、举手的市民；先相信光和两组人，不必背这个故事。"),
      el("div", { class: "note" }, el("p", null, "先不要把它当成 1808 年的现场速写。完成年是 1814。")),
      links(
        "https://www.museodelprado.es/en/the-collection/art-work/the-3rd-of-may-1808-in-madrid-or-the-executions/5e177409-2993-4240-97fb-847a02c6496c", "普拉多作品页"
      ),
      el("h2", { id: "work-saturn" }, "《农神吞噬其子》"),
      el("p", { class: "when" }, "约 1820–1823 · 墙上的画，后揭到布上 · Room 067 · 10–12 分钟"),
      el("p", null, S("它在回答："), "戈雅离开宫廷订件之后，一幅只画给自己房子的画是什么样。"),
      el("p", null, S("先看："), "身体怎样被黑吞掉。从前面那些被灯光照亮的历史画走到这里，就是今天戈雅这一段的收束。"),
      el("p", null, "画在曼萨纳雷斯河边的住宅 Quinta del Sordo 的楼下墙上，对面是莱奥卡迪娅的肖像。1819 年他买下这所房子，1823 年留给孙子。1873 年银行家埃尔朗热男爵买下房子，1874 年让普拉多修复师萨尔瓦多·马丁内斯·库韦利斯把十四幅黑色绘画揭到布上，过程中掉了很多颜色。1878 年在巴黎世博会没卖成。", S("1881 年 12 月 20 日"), "捐给西班牙国家，1882 年 1 月入普拉多。"),
      el("div", { class: "note" }, el("p", null, "画面上没有标题。「农神吞噬其子」是后来按罗马神话里萨图恩害怕被子女取代、因而吃掉孩子来认的。馆方也说，它可以读成对失去权力的恐惧。两种读法都不要讲成戈雅留下的说明。")),
      links(
        "https://www.museodelprado.es/en/the-collection/art-work/saturn/18110a75-b0e7-430c-bc73-2a4d55893bd6", "普拉多作品页",
        "https://www.museodelprado.es/aprende/enciclopedia/voz/pinturas-negras-goya/3ac8fe0b-3dd9-4dcd-b1e1-a21877cc8163", "普拉多百科：黑色绘画",
        "https://www.museodelprado.es/aprende/enciclopedia/voz/erlanger-baron-frederic-emile-d/27f24b8e-d9f1-4d4b-a210-5142e353bbe8", "普拉多百科：埃尔朗热捐赠"
      ),
      pager("artist-goya")
    );
    return s;
  }

  function renderTiepolo() {
    const s = el("section", { id: "tiepolo" });
    s.append(
      el("p", { class: "kicker" }, "1696–1770 · 人在王宫，不在普拉多"),
      el("h1", null, "提埃波罗"),
      el("p", null, "乔瓦尼·巴蒂斯塔·提埃波罗，威尼斯人。1762 年到马德里，为卡洛斯三世的新王宫画天顶，1770 年死在马德里。"),
      el("h2", { id: "tiepolo-ceiling" }, "王座厅天顶"),
      el("p", { class: "when" }, "约 1764–1766 · 儿子詹多梅尼科协助 · 只在王宫看"),
      el("p", null, S("它在回答："), "走进王座厅的人，为什么应该抬头就接受这套统治。"),
      el("p", null, S("先看："), "天顶，再看红色织物、镜子和金饰怎样一起把屋子变成典礼。天顶通常称为西班牙君主国的荣耀：西班牙、王座、赫拉克勒斯和各大洲被安排在一片天上。现场若没有说明牌，不必强记英文标题。"),
      el("div", { class: "note" }, el("p", null, "宫里只停留 8–10 分钟。故事放在这里。下午用《宫娥》对照：一幅是正式的王权图像，一幅是同一座宫廷传统里更复杂的观看。")),
      links(
        "https://www.esmadrid.com/en/tourist-information/royal-palace", "马德里旅游局：王宫"
      ),
      pager("tiepolo")
    );
    return s;
  }

  const BUILD = {
    how: renderHow,
    "artist-greco": renderGreco,
    "artist-bosch": renderBosch,
    "artist-velazquez": renderVelazquez,
    "artist-goya": renderGoya,
    tiepolo: renderTiepolo
  };

  let findAt = 0;
  let sectionObserver = null;
  let navLockUntil = 0;

  function fillNav(container, nested) {
    const cur = (location.hash || "#how").replace("#", "");
    const parent = parentOf(cur);
    container.replaceChildren();
    if (nested && container.id === "nav") {
      container.append(el("input", { class: "find", id: "find-desk", type: "search", enterkeyhint: "search", placeholder: "在本页查找", "aria-label": "在本页查找" }));
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
    const cur = (location.hash || "#how").replace("#", "");
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
    const id = (location.hash || "#how").replace("#", "");
    const back = document.getElementById("back");
    back.setAttribute("href", sourceOf(id));
    back.textContent = id.indexOf("work-") === 0 ? "回到这幅画" : "回到游览";
  }
  function scrollToHash() {
    navLockUntil = Date.now() + 900;
    const id = (location.hash || "#how").replace("#", "");
    const node = document.getElementById(id) || document.getElementById(parentOf(id));
    if (node) node.scrollIntoView({ block: "start" });
  }
  function closeSheet() {
    document.getElementById("sheet").hidden = true;
    document.getElementById("toc-btn").setAttribute("aria-expanded", "false");
  }
  function watchSections() {
    if (!("IntersectionObserver" in window)) return;
    if (sectionObserver) sectionObserver.disconnect();
    sectionObserver = new IntersectionObserver(function (entries) {
      const hit = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
      if (Date.now() < navLockUntil || !hit || !hit.target.id) return;
      const id = hit.target.id;
      if ((location.hash || "").replace("#", "") === id) return;
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

  document.body.addEventListener("click", function (e) {
    if (e.target.id === "sheet") { closeSheet(); return; }
    const t = e.target.closest("#font-btn, #theme-btn, #toc-btn, #sheet-close, #sheet a");
    if (!t) return;
    if (t.id === "font-btn") {
      const f = FONTS[(FONTS.indexOf(fontNow()) + 1) % FONTS.length];
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
    if (t.id === "toc-btn") {
      const sheet = document.getElementById("sheet");
      const open = sheet.hidden;
      sheet.hidden = !open;
      t.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) document.getElementById("find-mobile").focus();
      return;
    }
    if (t.id === "sheet-close" || t.closest("#sheet a")) closeSheet();
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
  });
  window.addEventListener("hashchange", function () {
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
  render();
})();
