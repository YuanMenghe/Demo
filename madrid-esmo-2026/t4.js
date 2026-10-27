(function () {
  const THEME_KEY = "madrid-esmo-2026-theme";
  const FONT_KEY = "madrid-esmo-2026-font";
  const CHECK_KEY = "madrid-esmo-2026-t4-checks-v1";
  const NOTE_KEY = "madrid-esmo-2026-t4-notes-v1";
  const FONTS = ["sm", "md", "lg", "xl"];
  const FONT_LABEL = { sm: "小", md: "标准", lg: "大", xl: "特大" };
  const NAV = [
    { id: "line", label: "今晚", children: [
      { id: "line-thread", label: "一条线" },
      { id: "sleep", label: "睡觉时间" },
      { id: "sleep-spot", label: "躺椅" }
    ]},
    { id: "tax", label: "退税", children: [
      { id: "tax-where", label: "四步" },
      { id: "tax-cash", label: "拿钱" },
      { id: "tax-big", label: "用不上" }
    ]},
    { id: "main", label: "主楼", children: [
      { id: "main-shop", label: "J 区店铺" },
      { id: "main-eat", label: "吃和坐" },
      { id: "t4s", label: "卫星楼" }
    ]},
    { id: "dxb", label: "第二段", children: [
      { id: "dxb-pass", label: "登机牌" },
      { id: "dxb-bag", label: "行李" },
      { id: "pek", label: "肉类" }
    ]}
  ];
  const CHECKS = [
    { id: "vat-forms", t: "单笔都不超过 50 欧。有退税单才扫，没有就直接安检。" },
    { id: "vat-goods", t: "要退税的东西放在随身袋外层。三人都不托运。" },
    { id: "ek308", t: "没有 EK308 登机牌，先在网上或出发大厅自助机补。" }
  ];
  let checks = new Set();
  let notes = {};
  let findAt = 0;
  let sectionObserver = null;
  let navLockUntil = 0;

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
    const h = (hash || location.hash || "#line").replace("#", "");
    let found = "";
    NAV.forEach(function (n) {
      if (n.id === h) found = n.id;
      (n.children || []).forEach(function (c) { if (c.id === h) found = n.id; });
    });
    return found || "line";
  }
  function loadLocal() {
    try { checks = new Set(JSON.parse(localStorage.getItem(CHECK_KEY) || "[]")); }
    catch (e) { checks = new Set(); }
    try { notes = JSON.parse(localStorage.getItem(NOTE_KEY) || "{}"); }
    catch (e) { notes = {}; }
  }
  function saveChecks() {
    localStorage.setItem(CHECK_KEY, JSON.stringify(Array.from(checks)));
    paintLocal();
  }
  function saveNotes() {
    localStorage.setItem(NOTE_KEY, JSON.stringify(notes));
    paintLocal();
  }
  function localDirty() {
    return checks.size > 0 || Object.keys(notes).some(function (k) { return notes[k]; });
  }
  function paintLocal() {
    const node = document.getElementById("local-flag");
    if (node) node.textContent = localDirty() ? "本机有勾选或备注" : "勾选和备注只在这台设备";
  }
  function pager(id) {
    const i = NAV.findIndex(function (n) { return n.id === id; });
    const box = el("div", { class: "rowbtns" });
    if (i > 0) box.append(el("a", { class: "go", href: "#" + NAV[i - 1].id }, "上一段"));
    if (i < NAV.length - 1) box.append(el("a", { class: "go", href: "#" + NAV[i + 1].id }, "下一段 · " + NAV[i + 1].label));
    return box;
  }
  function noteBox(id) {
    const area = el("textarea", { "data-note": id, placeholder: "写给自己的备注，只存在这台设备" });
    area.value = notes[id] || "";
    return el("div", { class: "card" }, el("p", { class: "when" }, "本机备注"), area);
  }

  function renderLine() {
    const s = el("section", { id: "line" });
    s.append(
      el("p", { class: "kicker" }, "10月27日 · 17:50 出发"),
      el("h1", null, "先退税，再安检，进卫星楼就睡"),
      el("p", null, el("mark", null, "17:50 从同事那里出发，约 18:21 到 T4。")),
      el("h2", { id: "line-thread" }, "一条线"),
      el("article", { class: "stop" },
        el("p", { class: "when" }, "1 · 出发大厅"),
        el("h2", null, "有退税单就先办"),
        el("p", null, "单笔都不超过 50 欧。机器只签注，不给钱。绿灯后，按退税单上的公司去旁边柜台拿现金。"),
        el("a", { class: "go", href: "#tax-where" }, "打开这四步")
      ),
      el("article", { class: "stop" },
        el("p", { class: "when" }, "2 · 安检"),
        el("h2", null, "没有托运行李"),
        el("p", null, "三人只有随身行李。EK144 登机牌已经有了，直接安检。EK308 还没有的，先用出发大厅自助机，不用去托运柜台。"),
        el("a", { class: "go", href: "#dxb" }, "第二段在哪办")
      ),
      el("article", { class: "stop" },
        el("p", { class: "when" }, "3 · T4S"),
        el("h2", null, "安检后坐小火车"),
        el("p", null, "迪拜是非申根。坐小火车进 T4S，躺椅在 15 号和 35 号登机口附近。"),
        el("a", { class: "go", href: "#sleep-spot" }, "躺椅在哪")
      ),
      el("h2", { id: "sleep" }, "睡觉时间"),
      el("p", null, el("mark", null, "从到机场到起飞，是北京时间 28 日 01:21–04:45，可以睡。")),
      el("article", { class: "stop" },
        el("p", { class: "when" }, "马德里 27 日约 18:21"),
        el("p", null, "北京 28 日 01:21。到 T4，可以睡。")
      ),
      el("article", { class: "stop" },
        el("p", { class: "when" }, "马德里 21:45"),
        el("p", null, "北京 04:45。EK144 起飞。")
      ),
      el("article", { class: "stop" },
        el("p", { class: "when" }, "马德里 28 日 03:00"),
        el("p", null, "北京 10:00。第一程睡到这里。")
      ),
      el("article", { class: "stop" },
        el("p", { class: "when" }, "迪拜 11:00"),
        el("p", null, "北京 15:00。EK308 整段不睡。")
      ),
      el("h2", { id: "sleep-spot" }, "躺椅在 T4S"),
      el("p", null, el("mark", null, "安检后坐小火车进 T4S。躺椅在 15 号和 35 号登机口附近，白色长柜后面。")),
      el("p", null, el("span", { class: "flag" }, "访客经验"), "五子登科两次转机都在南北两侧、15 号和 35 号口附近找到休息区。家有黄金小鸡小绿鱼小猴子写躺椅一共大约 10 个，旁边有免税店、充电、厕所和饮用水。没位子就去儿童区躺。晚上偏冷，外套留在身上。没招了建议带耳塞和眼罩。"),
      el("p", null, "这是座椅，不是床。EK144 的登机口还没分配，先去 15 号口附近躺，登机口出来再走过去。"),
      el("div", { class: "links" },
        ext("https://www.xiaohongshu.com/explore/6a39703b0000000008003b79?xsec_token=ABmfoYYyrLjhkuLj1C8s_s0jEPQGPf1o314QCqwTaI36Y=&xsec_source=pc_feed", "五子登科：15 和 35 号口"),
        ext("https://www.xiaohongshu.com/explore/6addaa930000000032016183?xsec_token=ABmXM3SkSUKVprBGItbed9JKt2Mwu39wwdxCC8wjM8W7c=&xsec_source=pc_feed", "睡眠指南：大约 10 个躺椅"),
        ext("https://www.xiaohongshu.com/explore/699ebf2d000000002603f7bb?xsec_token=ABX97z8bM9SGEZURtRVpvAICrAfr_297GX1hlpxIYJJ-I=&xsec_source=pc_feed", "没招了：耳塞眼罩")
      ),
      el("p", null, "落地北京是 22:30，已经是夜里，到家再睡。"),
      noteBox("line"),
      pager("line")
    );
    return s;
  }

  function renderTax() {
    const s = el("section", { id: "tax" });
    s.append(
      el("p", { class: "kicker" }, "出发大厅 · 安检之前"),
      el("h1", null, "退税就这四步"),
      el("p", null, el("mark", null, "三人每单都不超过 50 欧。有退税单才扫；没有单就直接安检。")),
      el("h2", { id: "tax-where" }, "四步"),
      el("article", { class: "stop" },
        el("p", { class: "when" }, "1 · 进 7 号门"),
        el("h2", null, "找到 DIVA 机器"),
        el("p", null, "出发大厅 ", el("strong", null, "7 号门"), " 进去，走到值机柜台 ", el("strong", null, "960 右边"), "，或 ", el("strong", null, "859 对面"), "。960 旁边队更短。"),
        el("p", null, "手上要有护照、退税单、登机牌，以及要退的东西。没有东西，机器不能签。"),
        el("p", null, el("span", { class: "flag ok" }, "官方"), "Aena：西班牙买的、从西班牙离开欧盟，在值机区的 DIVA 屏幕上电子签注。第三方机场页还把机器写在柜台 ", el("strong", null, "840、850"), " 附近和安检口附近。960 找不到，就沿值机柜台找。"),
        el("p", null, el("span", { class: "flag" }, "访客经验"), "Janice lee 标了 7 号门和机器的照片。噜噜大王写 859 对面、960 旁边都有机器。")
      ),
      el("article", { class: "stop" },
        el("p", { class: "when" }, "2 · 一张一张扫"),
        el("h2", null, "看屏幕是绿还是红"),
        el("p", null, "选中文。每张单单独扫，不要合并。扫完没有纸质章。"),
        el("p", null, el("strong", null, "绿："), "这张办完。50 欧以内通常就是绿。接着第 3 步。"),
        el("p", null, el("strong", null, "红："), "先把这张收好。小额很少走到这一步；真出现了，再看页尾。先不要拿钱。"),
        el("p", null, el("span", { class: "flag ok" }, "官方"), "税务局说明：绿就是已经签注，然后向商店或退税公司要钱。红就要去最近的海关或退税签注处，东西必须带着。")
      ),
      el("h2", { id: "tax-cash" }, "3 · 钱在旁边柜台拿"),
      el("article", { class: "stop" },
        el("p", { class: "when" }, "机器不给钱"),
        el("h2", null, "看退税单上的公司名"),
        el("p", null, el("mark", null, "绿灯只表示海关签过了。欧元现金在出发大厅、安检前的退税柜台拿。")),
        el("p", null, el("strong", null, "单子写 Planet："), "就在 7 号门、扫码机器旁边的柜台拿。"),
        el("p", null, el("strong", null, "单子写 Global Blue："), "从 Planet 那个柜台再往右走几十米，到 Global Blue 柜台拿。"),
        el("p", null, el("span", { class: "flag ok" }, "官方"), "Aena 写这两家都由值机区的 Global Exchange 柜台付款。800 区开到 ", el("strong", null, "22:25"), "，900 区开到 ", el("strong", null, "21:25"), "。大约 18:21 到，都还开着。"),
        el("p", null, el("strong", null, "单子写退回信用卡："), "没有现金可拿。钱之后打回买东西时留的那张卡，这一步跳过。"),
        el("p", null, "认不出公司名，就在机器旁边问 devolución 或 tax free cash。J 区柜台在申根登机口，今晚走不到。")
      ),
      el("article", { class: "stop" },
        el("p", { class: "when" }, "4 · 安检"),
        el("h2", null, "办完就去 T4S"),
        el("p", null, "三人没有托运行李。EK144 登机牌已经有了，直接安检，坐小火车，然后睡。"),
        el("p", null, el("strong", null, "20:15"), " 前要过完安检。队还很长就先走，不要把起飞时间耗在退税上。")
      ),
      el("h2", { id: "tax-big" }, "下面两段今晚用不上"),
      el("p", null, "你们每单都不超过 ", el("strong", null, "50 欧"), "。不用去人工柜台，不用下到到达层。税务局这份问答没有写最低金额。店家可以不给小额开退税单。没有单就直接安检。"),
      el("article", { class: "stop" },
        el("p", { class: "when" }, "不是在西班牙买的"),
        el("h2", null, "不要扫机器，直接去人工柜台"),
        el("p", null, "960 旁边的签注处。护照和退税单给他们，东西也带着。盖完把信封投进旁边的邮筒。这种通常退到卡上，不发现金。"),
        el("p", null, el("span", { class: "flag ok" }, "官方"), "别的欧盟国家买的，西班牙机器签不了，要去发票签注处。T4 出发层签注处 ", el("strong", null, "7:00–22:00"), "。"),
        el("p", null, el("span", { class: "flag" }, "访客经验"), "噜噜大王盖完后，Global Blue 仍显示待验证。她写这是正常的。")
      ),
      el("article", { class: "stop" },
        el("p", { class: "when" }, "屏幕是红的"),
        el("h2", null, "先去同一层柜台，柜台让下楼才下楼"),
        el("p", null, "从 7 号门直走再左转，就是人工柜台。把东西拿出来。签完回到第 3 步拿钱。"),
        el("p", null, "柜台如果让你下楼：电梯到到达层 ", el("strong", null, "0"), "，", el("strong", null, "10 号出口"), "，逆着出站的人走，说 custom tax refund。进去右转。"),
        el("p", null, el("span", { class: "flag ok" }, "官方"), "红灯的下一步是自助机旁边的海关或签注处，不是先去到达层。"),
        el("p", null, el("span", { class: "flag" }, "访客经验"), "Janice lee 写普通单据在出发大厅能办完，不用去到达层。噜噜大王和小南瓜的南写，单件超过 5000 欧时她们被送到 10 号口。税务局没有把 5000 欧写成固定门槛，以屏幕和柜台为准。你们 17:50 出发。")
      ),
      el("div", { class: "links" },
        ext("https://www.aena.es/es/pasajeros/equipajes-controles/aduanas-devolucion-iva/devolucion-iva.html", "Aena：绿和红怎么处理"),
        ext("https://sede.agenciatributaria.gob.es/static_files/Sede/Tema/Viajeros_Desplazados/DIVA/info_general/FAQsDIVA_oct23.pdf", "税务局问答"),
        ext("https://www.aena.es/es/adolfo-suarez-madrid-barajas/servicios-del-aeropuerto/categorias-y-terminales/devolucion-de-iva.html", "Aena：柜台时间"),
        ext("https://www.xiaohongshu.com/explore/69f37b2b000000003501ec50?xsec_token=ABdRK_uOW5tRxQbWzyTMgz-ZpmPEjuKrQYjwXtyyXJBsk=&xsec_source=pc_feed", "Janice lee：照片"),
        ext("https://www.xiaohongshu.com/explore/6ac4d31300000000180067b1?xsec_token=ABAtP8B4Vc7v4gTgmb9VpqvTfpSVX0P9jfnzmrnOPnHfw=&xsec_source=pc_feed", "噜噜大王"),
        ext("https://www.xiaohongshu.com/explore/6ac652ac000000001203ca7d?xsec_token=ABvGnXinptAc7nSUYWHDkguhFCR9Dw9xsBPPL4t-wonYo=&xsec_source=pc_feed", "小南瓜的南")
      ),
      noteBox("tax"),
      pager("tax")
    );
    return s;
  }

  function renderMain() {
    const s = el("section", { id: "main" });
    s.append(
      el("p", { class: "kicker" }, "不插进今晚的时间"),
      el("h1", null, "T4 主楼"),
      el("p", null, el("mark", null, "这些店在主楼 J 登机口。你们安检后去 T4S，进不去。")),
      el("h2", { id: "main-shop" }, "J 区店铺"),
      el("p", null, el("span", { class: "flag" }, "访客经验"), "Aena 西班牙机场的购物指南把这些店写在 T4 一层、出发区、登机口 J：BOSS、Campos de Ibiza、Citees、Desigual、El Ganso、JD Sports、Jimmy Lion、Kausi、Lacoste、Majorica。图片在原笔记里。"),
      el("div", { class: "links" },
        ext("https://www.xiaohongshu.com/explore/6888105f000000002001900e?xsec_token=ABdlxtYYbcQHMY9MIE1H3tOnBnNQf_SERbCPlXeMhAjoQ=&xsec_source=pc_feed", "Aena：T4 购物指南图片")
      ),
      el("h2", { id: "main-eat" }, "吃和坐"),
      el("p", null, "美人鱼快跑写的是安检后 H30 一带：长椅、充电、饮水、麦当劳，以及 J 区二楼付费休息室 Sala VIP Retiro，她写的营业到 24:00。Wayne Gao 转机时看到卖吃的店都摆着火腿。阿途的旅行日记建议留 2 小时逛吃，并把主楼和卫星楼写在一起。"),
      el("p", null, "2 小时逛街不放进今晚。H、J 区也不是去迪拜的登机口。"),
      el("div", { class: "links" },
        ext("https://www.xiaohongshu.com/explore/695b0145000000001e02da48?xsec_token=ABz_PseSO19RvDrAWERrui9N4PFH7KcDxajMu5gSYet_g=&xsec_source=pc_feed", "美人鱼快跑：H30 和麦当劳"),
        ext("https://www.xiaohongshu.com/explore/6a4cc7c9000000001702fbd3?xsec_token=AB0YEH_s5w1-Kafm37uN6DTo0HmADqJ7TVf8Rpp0dCxew=&xsec_source=pc_feed", "Wayne Gao：火腿和航站楼"),
        ext("https://www.xiaohongshu.com/explore/6926fde0000000001e003c78?xsec_token=ABjSf9XZvQ6x_2NdMNiV19DWRXueqymCdIAjLWNpI-nrg=&xsec_source=pc_feed", "阿途的旅行日记：四个航站楼")
      ),
      el("h2", { id: "t4s" }, "你们会到的卫星楼"),
      el("p", null, "sylvia在伦敦写 T4 和 T4S 都有化妆品、彩妆和吃的，她看到的 Loewe 只有香水和蜡烛。CC 在 T4S 的 La Jamoneria 吃过五年风干火腿三明治，", el("strong", null, "14 欧多"), "，萨拉米三明治 ", el("strong", null, "8 欧多"), "。想吃就买一份，然后去座位睡。"),
      el("div", { class: "links" },
        ext("https://www.xiaohongshu.com/explore/6991265f000000001b016322?xsec_token=ABa2iQ6hStsyUXNuht3iLcnPuxk3mGEMNWl2KCLTmXL50=&xsec_source=pc_feed", "CC：T4S La Jamoneria")
      ),
      noteBox("main"),
      pager("main")
    );
    return s;
  }

  function renderDxb() {
    const s = el("section", { id: "dxb" });
    s.append(
      el("p", { class: "kicker" }, "EK144 已值机 · EK308 还没有"),
      el("h1", null, "第二段登机牌"),
      el("p", null, el("mark", null, "回程没有托运行李，迪拜不用取，也不用再称。")),
      el("h2", { id: "dxb-pass" }, "三个地方可以拿到"),
      el("ul", null,
        el("li", null, el("strong", null, "网上。"), "同一订单有时还能补办后一段，以页面显示为准。"),
        el("li", null, el("strong", null, "今晚 T4 出发大厅。"), "自助机或值机柜台都能补第二段登机牌。不用去托运。柜台在二层 720–729。"),
        el("li", null, el("strong", null, "迪拜 T3 转机柜台。"), "两段都是阿联酋，都在 3 号航站楼。落地后跟着 Connections 标志走，不出境。登机牌如果出发时没给全，在转机柜台领。")
      ),
      el("div", { class: "links" },
        ext("https://www.emirates.com/cn/english/manage-booking/online-check-in/", "在线值机"),
        ext("https://www.emirates.com/english/before-you-fly/dubai-international-airport/transferring-between-terminals/", "阿联酋：迪拜转机和行李"),
        ext("https://www.aena.es/en/madrid-barajas-adolfo-suarez/airlines/emirates.html", "Aena：柜台 720–729")
      ),
      el("h2", { id: "dxb-bag" }, "不用再称"),
      el("p", null, el("span", { class: "flag ok" }, "官方"), "阿联酋写：只有随身行李、登机牌已经在手，可以直接去登机口。托运行李直挂是给交运行李的。你们三人回程都没有托运。"),
      el("div", { class: "links" },
        ext("https://www.emirates.com/english/help/faq-topics/preparing-to-travel/faq/how-can-i-receive-my-boarding-pass/", "阿联酋：只有随身行李")
      ),
      el("h2", { id: "pek" }, "熟食和香肠"),
      el("p", null, el("span", { class: "flag ok" }, "官方"), "农业农村部、海关总署公告第 470 号：", el("strong", null, "（生或熟）肉类及其制品"), "禁止携带、寄递进境。密封包装不在例外里。托运和手提都算携带。"),
      el("p", null, el("span", { class: "flag" }, "访客经验"), "淡定姐写浦东取行李时，检疫犬把肉类罐头、奶酪、香肠闻出来，开箱后没收。她写随身和托运都会查。你们没有托运行李，北京入境查的就是随身包。"),
      el("p", null, "评论里也有人说量少可以过。那不是规定，这一页不把它当成办法。已经放进随身包的，到北京向海关申报。"),
      el("div", { class: "links" },
        ext("https://www.moa.gov.cn/nybgb/2022/202202/202203/t20220324_6393815.htm", "公告第 470 号"),
        ext("https://www.xiaohongshu.com/explore/6ac250c1000000001301bc66?xsec_token=ABAPVHhe_E0uDMv8cNL2KOM4baoVfsI2zlaxjoRWVjqNA=&xsec_source=pc_feed", "淡定姐：检疫犬和没收")
      ),
      noteBox("dxb"),
      pager("dxb")
    );
    return s;
  }

  function renderTail() {
    const box = el("section", { id: "pack" });
    const left = CHECKS.filter(function (c) { return !checks.has(c.id); }).length;
    box.append(el("h2", null, "出发前"), el("p", { class: "local", id: "local-flag" }, ""));
    CHECKS.forEach(function (c) {
      const b = el("button", { type: "button", class: "check", "data-check": c.id, "aria-pressed": checks.has(c.id) ? "true" : "false" }, el("span", null, c.t));
      box.append(b);
    });
    box.append(
      el("p", { class: "foot" }, "还剩 " + left + " 项。"),
      el("button", { type: "button", class: "go", id: "clear-local" }, "清除本页勾选和备注"),
      el("p", { class: "foot" }, "清除不影响全站的深色和字号。")
    );
    return box;
  }

  const BUILD = { line: renderLine, tax: renderTax, main: renderMain, dxb: renderDxb };

  function renderNav() {
    const current = (location.hash || "#line").replace("#", "");
    const parent = parentOf(current);
    function fill(nav) {
      nav.replaceChildren();
      const find = el("input", { class: "find", type: "search", enterkeyhint: "search", placeholder: "在本页查找", "aria-label": "在本页查找" });
      find.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); findNext(find.value); }
      });
      nav.append(find);
      NAV.forEach(function (n) {
        const a = el("a", { class: "chip", href: "#" + n.id }, n.label);
        if (n.id === parent) a.setAttribute("aria-current", "true");
        nav.append(a);
        (n.children || []).forEach(function (c) {
          const sub = el("a", { class: "chip sub", href: "#" + c.id }, c.label);
          if (c.id === current) sub.setAttribute("aria-current", "true");
          nav.append(sub);
        });
      });
    }
    fill(document.getElementById("nav"));
    fill(document.getElementById("sheet-nav"));
    paintLocal();
  }

  function scrollToHash() {
    const id = (location.hash || "#line").replace("#", "");
    const node = document.getElementById(id);
    if (node) node.scrollIntoView();
  }

  function watchSections() {
    if (!("IntersectionObserver" in window)) return;
    if (sectionObserver) sectionObserver.disconnect();
    sectionObserver = new IntersectionObserver(function (entries) {
      if (Date.now() < navLockUntil) return;
      const hit = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
      if (!hit || !hit.target.id) return;
      const id = hit.target.id;
      if ((location.hash || "").replace("#", "") === id) return;
      history.replaceState(null, "", "#" + id);
      renderNav();
    }, { rootMargin: "-20% 0px -60% 0px", threshold: [0.25, 0.6] });
    document.querySelectorAll("section[id], h2[id]").forEach(function (n) { sectionObserver.observe(n); });
  }

  function findNext(raw) {
    const q = (raw || "").trim().toLowerCase();
    if (!q) return;
    const hits = [];
    const walker = document.createTreeWalker(document.getElementById("stage"), NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (node.nodeValue.toLowerCase().indexOf(q) >= 0 && node.parentElement) hits.push(node.parentElement);
      node = walker.nextNode();
    }
    if (!hits.length) return;
    findAt = findAt % hits.length;
    const hit = hits[findAt];
    navLockUntil = Date.now() + 800;
    hit.scrollIntoView({ block: "center" });
    findAt += 1;
  }

  function render() {
    const stage = document.getElementById("stage");
    const nodes = NAV.map(function (n) { return BUILD[n.id](); });
    nodes.push(renderTail());
    stage.replaceChildren.apply(stage, nodes);
    renderNav();
    paintChrome();
    watchSections();
  }

  function closeSheet() {
    const sheet = document.getElementById("sheet");
    sheet.hidden = true;
    document.getElementById("toc-btn").setAttribute("aria-expanded", "false");
  }

  document.body.addEventListener("click", function (e) {
    if (e.target.id === "sheet") { closeSheet(); return; }
    const t = e.target.closest("[data-check], #font-btn, #theme-btn, #clear-local, #toc-btn, #sheet-close, #sheet a, a[href^='#']");
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
    if (t.hasAttribute("data-check")) {
      const id = t.getAttribute("data-check");
      if (checks.has(id)) checks.delete(id); else checks.add(id);
      saveChecks();
      t.setAttribute("aria-pressed", checks.has(id) ? "true" : "false");
      const left = document.querySelector("#pack .foot");
      if (left) left.textContent = "还剩 " + CHECKS.filter(function (c) { return !checks.has(c.id); }).length + " 项。";
      return;
    }
    if (t.id === "toc-btn") {
      const sheet = document.getElementById("sheet");
      const open = sheet.hidden;
      sheet.hidden = !open;
      t.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        const input = document.querySelector("#sheet .find");
        if (input) input.focus();
      }
      return;
    }
    if (t.id === "sheet-close" || t.closest("#sheet a")) {
      closeSheet();
      if (t.id === "sheet-close") return;
    }
    if (t.id === "clear-local") {
      checks = new Set();
      notes = {};
      localStorage.removeItem(CHECK_KEY);
      localStorage.removeItem(NOTE_KEY);
      render();
      return;
    }
    if (t.getAttribute("href") && t.getAttribute("href").indexOf("#") === 0) {
      navLockUntil = Date.now() + 700;
    }
  });

  document.body.addEventListener("input", function (e) {
    const t = e.target;
    if (!t.hasAttribute("data-note")) return;
    const id = t.getAttribute("data-note");
    const value = t.value.trim();
    if (value) notes[id] = t.value;
    else delete notes[id];
    saveNotes();
  });

  window.addEventListener("hashchange", function () {
    renderNav();
    scrollToHash();
  });

  loadLocal();
  render();
  const mobileFind = document.getElementById("find-mobile");
  if (mobileFind) {
    mobileFind.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); findNext(mobileFind.value); }
    });
  }
  if (location.hash) scrollToHash();
})();
