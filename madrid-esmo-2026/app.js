/* 马德里 ESMO 2026 随身页。内容依据 2026-10-16 三份确认稿。 */
(function () {
  const THEME_KEY = "madrid-esmo-2026-theme";
  const FONT_KEY = "madrid-esmo-2026-font";
  const CHECK_KEY = "madrid-esmo-2026-checks-v1";
  const FONTS = ["sm", "md", "lg", "xl"];
  const FONT_LABEL = { sm: "小", md: "标准", lg: "大", xl: "特大" };
  const PRESET = ["poster-done", "dinner-done", "booth-done"];

  const LINK = {
    palace: "https://www.patrimonionacional.es/en/visita/royal-palace-madrid",
    prado: "https://www.museodelprado.es/en/visit/opening-times-and-prices",
    posada: "https://www.posadadelavilla.com/asador-en-madrid-centro/",
    posadaInfo: "https://www.esmadrid.com/restaurantes/posada-villa",
    posadaMenu: "https://pidemesa.es/restaurantes/madrid/madrid/posada-de-la-villa/carta",
    checkin: "https://www.emirates.com/cn/english/manage-booking/online-check-in/",
    poster: "https://dam.esmo.org/image/upload/v1783425264/ESMO-Congress-2026-Poster-Presenters-Instructions_j108ee.pdf",
    luggage: "https://luggagehero.com/madrid/nuevos-ministerios/",
    ifemaHow: "https://www.ifema.es/en/trafic/how-to-get-there",
    crtm: "https://www.crtm.es/billetes-sencillos-diez-viajes?lang=es&zona=B1",
    esmoReg: "https://www.esmo.org/meeting-calendar/esmo-congress-2026/registration",
    taxi: "https://www.esmadrid.com/en/getting-around-madrid-taxi",
    aenaEk: "https://www.aena.es/en/madrid-barajas-adolfo-suarez/airlines/emirates.html",
    carrefour: "https://www.carrefour.es/tiendas-carrefour/supermercados/carrefour-market/calle-orense-madrid_-_s.aspx",
    botin: "https://botin.es/en/menu-botin/",
    labola: "https://labola.es/en/cartas",
    trainera: "https://latrainera.es/",
    vodafone: "https://www.vodafone.es/c/particulares/es/productos-y-servicios/movil/prepago-y-recargas/prepaid-sim-cards/",
    vodaStore: "https://tiendas.vodafone.es/tiendas/madrid/madrid/vodafone-bravo-murillo-212",
    ifemaWifi: "https://www.ifema.es/en/services",
    aenaWifi: "https://www.aena.es/es/adolfo-suarez-madrid-barajas/servicios-del-aeropuerto/wifi.html",
    mapsOffline: "https://support.google.com/maps/answer/6291838?hl=en",
    esmoApp: "https://play.google.com/store/apps/details?id=com.esmo.esmo2014&hl=en_US",
    money: "https://www.esmadrid.com/en/money-madrid",
    gifts: "https://www.esmadrid.com/en/souvenirs-madrid",
    customs: "https://online.customs.gov.cn/ociswebserver/pages/jcjybcx/question.html",
    practical: "https://www.esmadrid.com/en/practical-information",
    tz: "https://www.timeanddate.com/time/change/spain/madrid",
    ai: "https://agendia.com/events/esmo-congress-2026-meeting/",
    aptToIfema: "https://www.google.com/maps/dir/?api=1&origin=Calle+de+Orense+22+Madrid&destination=IFEMA+MADRID&travelmode=transit",
    ifemaToDinner: "https://www.google.com/maps/dir/?api=1&origin=IFEMA+MADRID&destination=La+Maruca+Velazquez+Calle+Velazquez+54+Madrid&travelmode=transit",
    ifemaToRose: "https://www.google.com/maps/dir/?api=1&origin=IFEMA+MADRID&destination=Rosewood+Villa+Magna+Paseo+de+la+Castellana+22+Madrid&travelmode=transit",
    roseToApt: "https://www.google.com/maps/dir/?api=1&origin=Rosewood+Villa+Magna+Madrid&destination=Calle+de+Orense+22+Madrid&travelmode=transit",
    gc: "https://www.eventbrite.com/e/2026-madrid-gastric-cancer-forum-and-networking-dinner-tickets-2003121095118"
  };

  function gdir(origin, dest, mode) {
    const u = new URL("https://www.google.com/maps/dir/");
    u.searchParams.set("api", "1");
    u.searchParams.set("origin", origin);
    u.searchParams.set("destination", dest);
    u.searchParams.set("travelmode", mode || "transit");
    return u.toString();
  }
  function gsearch(q) {
    const u = new URL("https://www.google.com/maps/search/");
    u.searchParams.set("api", "1");
    u.searchParams.set("query", q);
    return u.toString();
  }

  LINK.apt = gsearch("Calle de Orense 22, 28020 Madrid");
  LINK.ifemaBack = gdir("IFEMA MADRID", "Calle de Orense 22, Madrid");
  LINK.palaceMap = gdir("Calle de Orense 22, Madrid", "Palacio Real de Madrid");
  LINK.aptToPrado = gdir("Calle de Orense 22, Madrid", "Museo del Prado, Madrid", "driving");
  LINK.pradoToPosada = gdir("Museo del Prado, Madrid", "Posada de la Villa, Cava Baja 9, Madrid", "walking");
  LINK.posadaToPalace = gdir("Posada de la Villa, Cava Baja 9, Madrid", "Palacio Real de Madrid", "walking");
  LINK.pradoMap = gdir("Plaza Mayor, Madrid", "Museo del Prado, Madrid");
  LINK.posadaMap = gsearch("Posada de la Villa Madrid");
  LINK.posadaToGate = "https://www.google.com/maps/dir/?api=1&origin=Posada+de+la+Villa%2C+Cava+Baja+9%2C+Madrid&destination=Puerta+de+Felipe+IV%2C+Calle+de+Alfonso+XII+3%2C+Madrid&travelmode=walking";
  LINK.gateToPrado = "https://www.google.com/maps/dir/?api=1&origin=Puerta+de+Felipe+IV%2C+Calle+de+Alfonso+XII+3%2C+Madrid&destination=Museo+del+Prado%2C+Madrid&travelmode=walking";
  LINK.ifemaToT4 = gdir("IFEMA MADRID", "Madrid-Barajas Terminal 4 Salidas", "driving");
  LINK.ifemaToGc = gdir("IFEMA MADRID", "Hotel Puerta America, Avenida de America 41, Madrid", "driving");
  LINK.gcToApt = gdir("Hotel Puerta America, Avenida de America 41, Madrid", "Calle de Orense 22, Madrid", "driving");
  LINK.gcMap = gsearch("Hotel Puerta America Avenida de America 41 Madrid");
  LINK.t4 = gsearch("Madrid-Barajas Terminal 4 Salidas");
  LINK.campana = gsearch("La Campana Calle Botoneras 6 Madrid");

  const CLIP = {
    apt: "Calle de Orense 22, 28020 Madrid",
    dinner: "La Maruca Velázquez, Calle Velázquez 54, Madrid",
    rose: "Rosewood Villa Magna, Villa 22, Paseo de la Castellana 22, Madrid",
    gc: "Hotel Puerta América, Avenida de América 41, Room John Pawson 1, 28002 Madrid",
    t4: "Madrid-Barajas Terminal 4, Salidas, Emirates",
    poster: "193P, Hall 5, 25 October 2026, 12:00–12:45",
    phone: "+34 91 366 18 60",
    posadaName: "MENGHE YUAN YUAN",
    email: "reservas@posadadelavilla.com",
    card: "住宿 Calle de Orense 22, 28020 Madrid；会场 IFEMA MADRID；地铁站 Feria de Madrid；海报 193P, Hall 5, 25 October, 12:00–12:45；机场 Terminal 4, Salidas, Emirates。紧急情况拨 112。"
  };

  function zoned(y, mo, d, h, mi, timeZone) {
    const utcGuess = Date.UTC(y, mo - 1, d, h, mi, 0);
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    const parts = {};
    fmt.formatToParts(new Date(utcGuess)).forEach(function (p) {
      if (p.type !== "literal") parts[p.type] = p.value;
    });
    let hour = Number(parts.hour);
    if (hour === 24) hour = 0;
    const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, hour, +parts.minute, +parts.second);
    return utcGuess - (asUTC - utcGuess);
  }

  function at(y, mo, d, h, mi, tz) {
    return zoned(y, mo, d, h, mi, tz);
  }

  const MAD = "Europe/Madrid";
  const BJ = "Asia/Shanghai";
  const DXB = "Asia/Dubai";

  const DAYS = [
    {
      id: "d22",
      num: "22",
      weekday: "周四",
      wx: "少云 18°/7°",
      kicker: "北京出发 / 晚间入住",
      dateLabel: "10月22日",
      notes: [
        { kind: "warn", text: "公寓没有 24 小时前台。22 日已按晚到入住。" },
        { kind: "skip", text: "当晚只吃轻食、休息。不安排景点。" }
      ],
      actions: [
        { label: "复制公寓地址", clip: "apt" },
        { label: "公寓地图", href: LINK.apt },
        { label: "在线值机", href: LINK.checkin }
      ],
      blocks: [
        { id: "b22-t3", time: "北京 04:25", title: "到首都机场 T3", short: "到首都机场 T3", text: "07:25 起飞。从住处出门的时间按地址和路况倒推。", at: at(2026, 10, 22, 4, 25, BJ) },
        { id: "b22-fly", time: "北京 07:25", title: "PEK T3 起飞", short: "北京起飞，飞往迪拜", text: "EK309。11:35 到迪拜 T3。行李直挂、航站楼以正式电子客票为准。", at: at(2026, 10, 22, 7, 25, BJ) },
        { id: "b22-dxb", time: "迪拜 11:35", title: "迪拜转机", short: "迪拜转机", text: "T3 转机约 2 小时 55 分，不出机场。先看 EK143 登机牌上的指廊，用已办好的选休息室二维码进同一指廊的 Ahlan。指廊之间大约 30 分钟，不要为了换休息室跨区。上网用 DXB Free Wi-Fi，不要默认漫游有阿联酋流量。", at: at(2026, 10, 22, 11, 35, DXB) },
        { id: "b22-conn", time: "迪拜 14:30", title: "转飞马德里", short: "转飞马德里", text: "EK143，飞往马德里。", at: at(2026, 10, 22, 14, 30, DXB) },
        { id: "b22-land", time: "马德里 20:20", title: "落地 T4S", short: "落地马德里 T4S", text: "入境、取行李后转到 T4 出机场。预计 21:30–22:15 能离开，排队就顺延。航站楼可连 AIRPORT FREE Wifi AENA，用法在手册。", at: at(2026, 10, 22, 20, 20, MAD) },
        { id: "b22-in", time: "马德里 22:00", title: "出租车去公寓", short: "入住公寓", text: "走正规出租车队列。按 22:00–23:00 入住准备。机上先吃好，随身留一点小食；不累且超市还开着，再补水和早餐。", at: at(2026, 10, 22, 22, 0, MAD) }
      ]
    },
    {
      id: "d23",
      num: "23",
      weekday: "周五",
      wx: "少云 19°/11°",
      kicker: "领证、展台、20:00 商务晚餐",
      dateLabel: "10月23日",
      notes: [
        { kind: "warn", text: "Rosewood 是明天的酒会酒店，不是今天的晚餐。今天只去 La Maruca Velázquez。不要套用酒会的交通时间。" },
        { kind: "skip", text: "原拟的伯纳乌夜间散步取消。第一天晚上回公寓。" }
      ],
      actions: [
        { label: "袁的参会码", href: "badge.html", same: true },
        { label: "会场 → 餐厅", href: LINK.ifemaToDinner },
        { label: "复制餐厅地址", clip: "dinner" },
        { label: "公寓 → 会场", href: LINK.aptToIfema }
      ],
      blocks: [
        { id: "b23-bf", time: "06:30–07:00", title: "公寓早餐", short: "公寓早餐", text: "在公寓吃。", at: at(2026, 10, 23, 6, 30, MAD) },
        { id: "b23-out", time: "07:20", title: "出门", short: "出门去领证", text: "目标 08:20 领到胸牌，约 09:00 到展台。第一次排队较长的话，到展台可以放到 09:10 左右。", at: at(2026, 10, 23, 7, 20, MAD) },
        { id: "b23-badge", time: "08:20", title: "领证", short: "领胸牌和交通票", text: "袁的 5 日无限卡，婷和明的十次票，都已领到。", links: [
          { href: "badge.html", label: "袁的参会码", same: true }
        ], at: at(2026, 10, 23, 8, 20, MAD) },
        { id: "b23-booth", time: "约 09:00", title: "到展台", short: "到 Hall 10", text: "展台在 Hall 10。展台号还没写上。25 日海报在 Hall 5，不是同一个厅。", at: at(2026, 10, 23, 9, 0, MAD) },
        { id: "b23-lunch", time: "12:30–13:15", title: "会场午餐", short: "会场午餐", text: "不要中午回公寓，往返将近两小时。", at: at(2026, 10, 23, 12, 30, MAD) },
        { id: "b23-work", time: "13:15–18:00", title: "展台商务", short: "展台和客户交流", text: "下午以展台和客户交流为主。展台由商务兜底，你们协助。", at: at(2026, 10, 23, 13, 15, MAD) },
        { id: "b23-leave", time: "18:45", title: "离开 IFEMA", short: "从会场出发去晚餐", text: "按导航去 La Maruca。", at: at(2026, 10, 23, 18, 45, MAD) },
        { id: "b23-dinner", time: "20:00", title: "La Maruca Velázquez", short: "商务晚餐", text: "Calle Velázquez 54。餐厅没变，时间已改为今晚。晚餐后回公寓。", at: at(2026, 10, 23, 20, 0, MAD) }
      ]
    },
    {
      id: "d24",
      num: "24",
      weekday: "周六",
      wx: "高云 19°/6°",
      kicker: "展台、可选 AI、TigerMed 酒会",
      dateLabel: "10月24日",
      notes: [
        { kind: "ok", text: "免费 Uber 的集合时间和展台，写在下面 17:00 那一栏。" },
        { kind: "warn", text: "酒会是 Seminar & Reception。这封邮件写的是分享、交谈和社交，没有菜单。还不能确认够不够一顿晚饭。带一点零食；没吃饱，结束后补简餐。次日 07:00 要出门。" },
        { kind: "warn", text: "LBA20 的 14:45–16:15、Hall 3 Bilbao Auditorium 来自第三方活动页，可能是整场时段，形式也有歧义。完整注册的人先用 ESMO Events 核对报告时间和权限。两位展商证不默认能进科学会议。" },
        { kind: "skip", text: "酒会后直接回公寓，不去 Gran Vía。" }
      ],
      actions: [
        { label: "袁的票", href: "tiger.html#yuan", same: true },
        { label: "婷的票", href: "tiger.html#ting", same: true },
        { label: "明的票", href: "tiger.html#ming", same: true },
        { label: "会场 → Rosewood", href: LINK.ifemaToRose },
        { label: "酒会 → 公寓", href: LINK.roseToApt },
        { label: "复制酒会地址", clip: "rose" },
        { label: "活动页线索", href: LINK.ai }
      ],
      blocks: [
        { id: "b24-bf", time: "06:45–07:15", title: "公寓早餐", short: "公寓早餐", text: "然后 07:50 出门。", at: at(2026, 10, 24, 6, 45, MAD) },
        { id: "b24-in", time: "约 08:50", title: "到馆", short: "到展馆", text: "09:00 起协助展台。", at: at(2026, 10, 24, 8, 50, MAD) },
        { id: "b24-lunch", time: "12:15–13:00", title: "会场午餐", short: "会场午餐", text: "下午可继续展台，或去核对过的 AI 会。", at: at(2026, 10, 24, 12, 15, MAD) },
        { id: "b24-ai", time: "14:45–16:15", title: "可选：LBA20", short: "可选 AI 会（先核实）", text: "“AI Driven Digital Pathology for the 70 Gene Recurrence Signature”。听完去 Hall 10 展台 1108，不要直接出馆。没权限或时间对不上，就留在自己的展台，17:00 再去 1108。", at: at(2026, 10, 24, 14, 45, MAD) },
        { id: "b24-leave", time: "17:00", title: "Hall 10 展台 1108", short: "坐免费 Uber 去酒会", text: "TigerMed 在这里安排免费 Uber，只送到 Rosewood。17:00 到。驾车约 21 分钟。不坐这班，16:15 走公共交通，约 45 分钟。", at: at(2026, 10, 24, 17, 0, MAD) },
        { id: "b24-party", time: "17:30–21:00", title: "TigerMed 酒会", short: "TigerMed 酒会", text: "Rosewood Villa Magna，Villa 22，Paseo de la Castellana 22。17:30 前到。结束后回公寓，回程自己走，重新导航。", links: [
          { href: "tiger.html#yuan", label: "袁", same: true },
          { href: "tiger.html#ting", label: "婷", same: true },
          { href: "tiger.html#ming", label: "明", same: true }
        ], at: at(2026, 10, 24, 17, 30, MAD) }
      ]
    },
    {
      id: "d25",
      num: "25",
      weekday: "周日",
      wx: "晴 19°/9°",
      kicker: "Poster 193P，晚间胃癌论坛",
      dateLabel: "10月25日",
      notes: [],
      actions: [
        { label: "复制 193P", clip: "poster" },
        { label: "复制论坛地址", clip: "gc" },
        { label: "袁的票", href: "ticket.html#yuan", same: true },
        { label: "婷的票", href: "ticket.html#ting", same: true },
        { label: "明的票", href: "ticket.html#ming", same: true },
        { label: "活动页", href: LINK.gc },
        { label: "会场 → 论坛", href: LINK.ifemaToGc },
        { label: "论坛 → 公寓", href: LINK.gcToApt },
        { label: "官方海报说明", href: LINK.poster },
        { label: "时区说明", href: LINK.tz },
        { label: "回程值机", href: LINK.checkin }
      ],
      blocks: [
        { id: "b25-bf", time: "06:00–06:30", title: "公寓早餐", short: "公寓早餐", text: "用前一晚准备的。", at: at(2026, 10, 25, 6, 0, MAD) },
        { id: "b25-out", time: "07:00", title: "出门", short: "出门去 Hall 5", text: "官方允许挂板的时间是 07:30–09:00。", at: at(2026, 10, 25, 7, 0, MAD) },
        { id: "b25-hang", time: "约 08:00", title: "Hall 5 挂海报", short: "挂海报", text: "08:00–08:45 在 Hall 5 挂好。然后到 Hall 10 展台，09:00–11:30 和同行交流。", at: at(2026, 10, 25, 8, 0, MAD) },
        { id: "b25-ready", time: "11:40", title: "到 193P 板前", short: "到海报板前", text: "准备 12:00 开始的讲解。", at: at(2026, 10, 25, 11, 40, MAD) },
        { id: "b25-talk", time: "12:00–12:45", title: "海报讲解", short: "讲解 193P", text: "北京时间 19:00。讲完 12:45–13:30 在会场吃午饭。", at: at(2026, 10, 25, 12, 0, MAD) },
        { id: "b25-meet", time: "13:30–17:00", title: "展台和海报交流", short: "看同类别 AI 海报", text: "优先聊 AI 临床研究、药物开发、临床工作流、诊断分型。不挤占自己的讲解。", at: at(2026, 10, 25, 13, 30, MAD) },
        { id: "b25-take", time: "17:00", title: "取回海报", short: "取回海报", text: "官方取回窗口到 18:30。取下就带着海报筒走，不先回公寓。", at: at(2026, 10, 25, 17, 0, MAD) },
        { id: "b25-leave", time: "17:05", title: "离开 IFEMA", short: "去胃癌论坛", text: "三人合乘出租车去 Hotel Puerta América。路网大约 6.1 公里，不含堵车大约 10 分钟；出馆找车另留时间，目标 17:45 前到。地铁要换乘，赶 18:00 开饭不用。当天再看导航。", at: at(2026, 10, 25, 17, 5, MAD) },
        { id: "b25-dinner", time: "18:00–19:00", title: "Networking Dinner", short: "胃癌论坛晚餐", text: "Hotel Puerta América，Avenida de América 41，房间 John Pawson 1。免费。主办方把这一小时写成晚餐，没有写菜品。入场点下面自己的名字，屏幕调亮。海报筒带着。", links: [
          { href: "ticket.html#yuan", label: "袁", same: true },
          { href: "ticket.html#ting", label: "婷", same: true },
          { href: "ticket.html#ming", label: "明", same: true }
        ], at: at(2026, 10, 25, 18, 0, MAD) },
        { id: "b25-gc", time: "19:00–20:00", title: "胃癌论坛", short: "CLDN18.2 讨论", text: "徐瑞华主持开场，随后 Kohei Shitara 讲 CLARITY-GASTRIC 01。主题是 CLDN18.2 阳性胃癌。20:00 结束。", at: at(2026, 10, 25, 19, 0, MAD) },
        { id: "b25-back", time: "20:00", title: "回公寓", short: "回公寓", text: "出租车回 Calle de Orense 22。路网大约 3.7 公里，不含堵车大约 8 分钟。到家放下海报筒，再办回程值机。", at: at(2026, 10, 25, 20, 0, MAD) },
        { id: "b25-ci", time: "21:45", title: "回程网上值机开放", short: "办理回程值机", checkId: "checkin-back", text: "人已经在公寓。对应北京时间 10月26日 04:45。EK144＋EK308。用 PNR 和姓氏，尽早选相邻座位，保存登机牌。同一联程订单通常可以接着办后面的航段，以系统显示为准。", at: at(2026, 10, 25, 21, 45, MAD) }
      ]
    },
    {
      id: "d26",
      num: "26",
      weekday: "周一",
      wx: "晴 20°/10°",
      kicker: "普拉多、Posada、王宫",
      dateLabel: "10月26日",
      notes: [
        { kind: "ok", text: "这一天不去展台。上午 10:00 普拉多，12:45 Posada，15:00 王宫西班牙语讲解。丽池今天不走。" },
        { kind: "warn", text: "15:00 西班牙语讲解，14:45 到优先入口。周一开到 18:00，17:00 停止入场。普拉多周一 10:00–20:00。" }
      ],
      actions: [
        { label: "王宫票", href: "palace.html", same: true },
        { label: "公寓 → 普拉多", href: LINK.aptToPrado },
        { label: "普拉多 → Posada", href: LINK.pradoToPosada },
        { label: "Posada → 王宫", href: LINK.posadaToPalace },
        { label: "普拉多票", href: "prado.html", same: true },
        { label: "复制订位姓名", clip: "posadaName" },
        { label: "餐厅电话", href: "tel:+34913661860", tel: true }
      ],
      blocks: [
        { id: "b26-weekly", time: "03:30–04:00", title: "周会", short: "周会", text: "北京时间 10:30–11:00。", at: at(2026, 10, 26, 3, 30, MAD) },
        { id: "b26-bf", time: "07:45", title: "公寓早餐", short: "公寓早餐", text: "简单吃完。09:30 打车去普拉多，大约 5.1 公里、16 分钟。", at: at(2026, 10, 26, 7, 45, MAD) },
        { id: "b26-prado", time: "10:00–12:20", title: "普拉多", short: "参观普拉多", text: "10:00 入馆，直接走入口。按西班牙绘画史看埃尔·格列柯、博斯、委拉斯开兹、戈雅，优先《宫娥》、博斯《人间乐园》和戈雅《1808年5月3日》。厅内不拍照。12:20 离开，步行到 Posada 约 1.7 公里、24 分钟。", links: [
          { href: "prado.html#yuan", label: "袁", same: true },
          { href: "prado.html#ting", label: "婷", same: true },
          { href: "prado.html#ming", label: "明", same: true }
        ], at: at(2026, 10, 26, 10, 0, MAD) },
        { id: "b26-lunch", time: "12:45–14:25", title: "Posada de la Villa", short: "Posada 烤乳羊", text: "已订 10月26日 12:45，3 人。到店报 MENGHE YUAN YUAN，没有二维码。点菜按 3 人，先问当天烤乳羊份量和价格。14:25 离开，步行约 1.4 公里、18 分钟，14:45 到王宫优先入口。临时改人数要先联系餐厅。", links: [
          { label: "复制订位姓名", clip: "posadaName" }
        ], at: at(2026, 10, 26, 12, 45, MAD) },
        { id: "b26-palace", time: "15:00", title: "王宫", short: "王宫讲解", text: "15:00 西班牙语讲解，只含王宫厅室。14:45 到优先入口，14:55 到入口门厅集合点。进门前用入口厕所。", links: [
          { href: "palace.html#yuan", label: "袁", same: true },
          { href: "palace.html#ting", label: "婷", same: true },
          { href: "palace.html#ming", label: "明", same: true }
        ], at: at(2026, 10, 26, 15, 0, MAD) },
        { id: "b26-town", time: "讲解后", title: "宫外", short: "阿穆德纳外观", text: "讲解结束如果还有精神，看阿穆德纳教堂外观和东方广场。不进教堂，不折回 Plaza Mayor。", at: at(2026, 10, 26, 16, 0, MAD) },
        { id: "b26-back", time: "17:30 后", title: "回公寓", short: "回公寓收拾", text: "住处附近简餐或超市补给，不再安排正式晚饭。收拾明天要退房的行李。", at: at(2026, 10, 26, 17, 30, MAD) }
      ]
    },
    {
      id: "d27",
      num: "27",
      weekday: "周二",
      wx: "晴 20°/10°",
      kicker: "退房、收尾、晚间返程",
      dateLabel: "10月27日",
      notes: [
        { kind: "warn", text: "行李带去会场交会务。17:30 取，17:45 从会场去 T4。" },
        { kind: "skip", text: "今天不再去王宫或老城，不进需要定时票的地方。午餐在会场。" }
      ],
      actions: [
        { label: "复制出租目的地", clip: "t4" },
        { label: "T4 地图", href: LINK.t4 },
        { label: "阿联酋航司页", href: LINK.aenaEk },
        { label: "会场 → T4", href: LINK.ifemaToT4 }
      ],
      blocks: [
        { id: "b27-bf", time: "06:15–06:45", title: "早餐", short: "早餐后退房", text: "07:00 退房。大箱子和海报筒随身带走，不留给房东。", at: at(2026, 10, 27, 6, 15, MAD) },
        { id: "b27-go", time: "07:35", title: "带行李去会场", short: "带行李去 Hall 10", text: "地铁去 IFEMA。约 08:50 到，先交给会务，再去 Hall 10。", at: at(2026, 10, 27, 7, 35, MAD) },
        { id: "b27-lunch", time: "12:15 后", title: "会场简餐", short: "留在会场", text: "下午留在 Hall 10。不回公寓取行李。", at: at(2026, 10, 27, 12, 15, MAD) },
        { id: "b27-bag", time: "17:30", title: "会务取行李", short: "会务取行李", text: "取完就去上车。", at: at(2026, 10, 27, 17, 30, MAD) },
        { id: "b27-taxi", time: "17:45", title: "从会场去机场", short: "出租车去 T4", text: "正规出租车。约 5.3 公里、9 分钟，约 18:00 到。目的地 Madrid-Barajas Terminal 4, Salidas, Emirates。Google Maps", at: at(2026, 10, 27, 17, 45, MAD) },
        { id: "b27-t4", time: "约 18:00", title: "到 T4", short: "到达 T4", text: "值机、托运、安检、出境后，按登机牌去 T4S。这时是北京 28 日 01:00，可以睡。21:45 起飞。", at: at(2026, 10, 27, 18, 0, MAD) },
        { id: "b27-fly", time: "21:45", title: "马德里起飞", short: "马德里起飞", text: "EK144，次日 07:40 到迪拜。候机和起飞后可以睡，到马德里时间 28 日 03:00。之后不睡。", at: at(2026, 10, 27, 21, 45, MAD) }
      ]
    },
    {
      id: "d28",
      num: "28",
      weekday: "周三",
      wx: "晴 20°/10°",
      kicker: "迪拜转机 / 回到北京",
      dateLabel: "10月28日",
      notes: [
        { kind: "ok", text: "第一程睡到马德里时间 28 日 03:00。第二程整段不睡。落地后再睡。" },
        { kind: "skip", text: "迪拜不安排出机场，也不订酒店。" }
      ],
      actions: [
        { label: "在线值机", href: LINK.checkin }
      ],
      blocks: [
        { id: "b28-rfp", time: "西班牙 04:00–05:00", title: "RFP会", short: "RFP会", text: "北京时间 11:00–12:00。迪拜 07:40 落地，会开在落地前后。", at: at(2026, 10, 28, 4, 0, MAD) },
        { id: "b28-dxb", time: "迪拜 07:40", title: "到迪拜", short: "迪拜转机", text: "北京时间 11:40。T3 转机，不出机场，不睡。看 EK308 登机牌上的指廊，用同一张选休息室二维码进同一指廊的 Ahlan。想洗澡再改同一指廊的 Marhaba，不要跨指廊。", at: at(2026, 10, 28, 7, 40, DXB) },
        { id: "b28-bei", time: "西班牙 08:00", title: "百济的会", short: "百济的会", text: "北京时间 15:00。和迪拜 11:00 起飞同一时刻。", at: at(2026, 10, 28, 8, 0, MAD) },
        { id: "b28-fly", time: "迪拜 11:00", title: "起飞回北京", short: "迪拜起飞", text: "EK308。北京时间 15:00 起飞，22:30 落地。这一程整段不睡。", at: at(2026, 10, 28, 11, 0, DXB) },
        { id: "b28-home", time: "北京 22:30", title: "到首都机场 T3", short: "抵达北京", text: "入境取行李后回家。已经是北京夜里，可以睡。", at: at(2026, 10, 28, 22, 30, BJ) }
      ]
    }
  ];

  const TRIP_END = at(2026, 10, 28, 23, 30, BJ);

  const GROUPS = [
    { id: "now", title: "现在优先" },
    { id: "during", title: "人在马德里时" },
    { id: "eve26", title: "26日晚之前" },
    { id: "done", title: "已经完成" }
  ];

  const CHECKS = [
    { id: "palace", group: "now", title: "打开 26 日王宫票", detail: "10月26日 15:00 西班牙语讲解，只含王宫。14:45 到优先入口，14:55 到入口门厅集合点。", links: [
      { href: "palace.html#yuan", label: "袁", same: true },
      { href: "palace.html#ting", label: "婷", same: true },
      { href: "palace.html#ming", label: "明", same: true }
    ] },
    { id: "prado", group: "now", title: "打开 26 日普拉多票", detail: "10月26日 10:00 入馆，直接走入口。大约留到 12:20，然后去 Posada。厅内不拍照。", links: [
      { href: "prado.html#yuan", label: "袁", same: true },
      { href: "prado.html#ting", label: "婷", same: true },
      { href: "prado.html#ming", label: "明", same: true }
    ] },
    { id: "posada", group: "now", title: "26 日 Posada 已订，报这个名字", detail: "10月26日 12:45，3 人。到店报 MENGHE YUAN YUAN，没有二维码。改人数或取消先打 +34 91 366 18 60，或写 reservas@posadadelavilla.com。", links: [{ href: LINK.posada, label: "餐厅官网" }, { href: "tel:+34913661860", label: "打电话", tel: true }] },
    { id: "pass", group: "now", title: "打开 24 日酒会入场码", detail: "17:00 到 Hall 10 展台 1108 坐免费 Uber。入场码点袁、婷、明。", links: [
      { href: "tiger.html#yuan", label: "袁", same: true },
      { href: "tiger.html#ting", label: "婷", same: true },
      { href: "tiger.html#ming", label: "明", same: true }
    ] },
    { id: "gc-pass", group: "now", title: "打开 25 日胃癌论坛入场码", detail: "10月25日 18:00–20:00，Hotel Puerta América。袁、婷、明各一张，点名字打开。", links: [
      { href: "ticket.html#yuan", label: "袁", same: true },
      { href: "ticket.html#ting", label: "婷", same: true },
      { href: "ticket.html#ming", label: "明", same: true }
    ] },
    { id: "eticket", group: "now", title: "核对正式电子客票和证件", detail: "三人姓名、航班、行李额度、直挂、护照，以及需要的签证或保险。" },
    { id: "talk", group: "during", title: "准备 2–3 分钟英文讲解", detail: "加上方法、验证、局限这类常见问题。25 日 11:40 到 193P 板前，12:00–12:45 讲。" },
    { id: "remind", group: "during", title: "设好回程值机提醒", detail: "马德里 10月25日 21:45，EK144＋EK308 开放网上值机。提醒里写上 PNR 和姓氏。" },
    { id: "checkin-back", group: "during", title: "10月25日 21:45（马德里）办理回程值机", detail: "EK144＋EK308。尽早选座，保存登机牌。", links: [{ href: LINK.checkin, label: "在线值机" }] },
    { id: "offline", group: "during", title: "这些材料离线也能打开", detail: "登机信息、入住说明、房东电话、24 日三张酒会码、25 日三张入场码、26 日三张王宫票、26 日普拉多票。酒会码在 24 日酒会那一栏，王宫票在 26 日王宫那一栏，普拉多票在 26 日普拉多那一栏。" },
    { id: "bags", group: "eve26", title: "行李、海报筒、机场证件整理好", detail: "27 日从会场去 T4。路线存进手机。", links: [{ href: LINK.ifemaToT4, label: "会场 → T4" }] },
    { id: "checkin-out", group: "done", title: "去程已经值机并起飞", detail: "EK309＋EK143。人已经在马德里。" },
    { id: "to-pek", group: "done", title: "22 日已经到过首都机场", detail: "当天目标是 04:25 到 T3。" },
    { id: "packed", group: "done", title: "随身文件和海报包装已带走", detail: "电子海报不用再做、也不用再传一次。" },
    { id: "weather", group: "done", title: "出发当天的天气已经看过", detail: "手机自动时区保持开着。" },
    { id: "data", group: "done", title: "三人的网络漫游已开通", detail: "马德里用各自的卡。迪拜不出机场，用机场 Wi-Fi。" },
    { id: "store-final", group: "done", title: "27 日行李存在会务", detail: "早上带去 IFEMA，17:30 在会务取，17:45 从会场去 T4，大约 18:00 到。" },
    { id: "tickets-fit", group: "done", title: "26 日普拉多、王宫和 Posada 已订好", detail: "普拉多 10:00，Posada 12:45，王宫 15:00 讲解。不挪到 27 日。" },
    { id: "poster-done", group: "done", title: "纸质海报已打印，电子海报已上传", detail: "现场只用 193P 找板。" },
    { id: "dinner-done", group: "done", title: "23 日 20:00 商务晚餐已确定", detail: "餐厅仍是 La Maruca Velázquez，Calle Velázquez 54。" },
    { id: "booth-done", group: "done", title: "展台由商务兜底", detail: "你们协助。展台在 Hall 10。" }
  ];

  const state = {
    tab: "plan",
    day: "d22",
    filter: "open",
    party: "3",
    move: "fair",
    query: "",
    anchor: "",
    sheet: false
  };

  let checks = loadChecks();
  let toastTimer = 0;
  let touch = null;
  let landedBlock = "";

  function loadChecks() {
    try {
      const raw = localStorage.getItem(CHECK_KEY);
      if (!raw) return new Set(PRESET);
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return new Set(PRESET);
      return new Set(arr);
    } catch (e) {
      return new Set(PRESET);
    }
  }

  function saveChecks() {
    localStorage.setItem(CHECK_KEY, JSON.stringify(Array.from(checks)));
  }

  function el(tag, attrs) {
    const n = document.createElement(tag);
    const a = attrs || {};
    Object.keys(a).forEach(function (k) {
      const v = a[k];
      if (v == null || v === false) return;
      if (k === "class") n.className = v;
      else if (k === "hidden") n.hidden = true;
      else n.setAttribute(k, v === true ? "" : String(v));
    });
    for (let i = 2; i < arguments.length; i++) append(n, arguments[i]);
    return n;
  }

  function append(n, kid) {
    if (kid == null || kid === false) return;
    if (Array.isArray(kid)) {
      kid.forEach(function (k) { append(n, k); });
      return;
    }
    n.append(typeof kid === "string" ? document.createTextNode(kid) : kid);
  }

  function ext(href, label, tel, same) {
    const a = el("a", { href: href, class: "go" }, label);
    if (!tel && !same) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  function activeDayId(now) {
    if (now >= TRIP_END) return null;
    let id = null;
    DAYS.forEach(function (day) {
      if (now >= day.blocks[0].at) id = day.id;
    });
    return id;
  }

  function currentBlock(day, now) {
    if (!day || activeDayId(now) !== day.id) return null;
    let cur = null;
    day.blocks.forEach(function (b) {
      if (now >= b.at) cur = b;
    });
    return cur;
  }

  function upcoming(now) {
    const items = [];
    if (!checks.has("checkin-out")) {
      items.push({
        at: at(2026, 10, 20, 7, 25, BJ),
        label: "去程值机 EK309＋EK143",
        tab: "list",
        anchor: "item-checkin-out"
      });
    }
    DAYS.forEach(function (day) {
      day.blocks.forEach(function (b) {
        if (b.checkId && checks.has(b.checkId)) return;
        items.push({ at: b.at, label: b.short, tab: "plan", day: day.id, anchor: b.id });
      });
    });
    const fut = items.filter(function (i) { return i.at > now; }).sort(function (a, b) { return a.at - b.at; });
    return fut[0] || null;
  }

  function remain(ms) {
    if (ms < 0) return "已经到点";
    const min = Math.round(ms / 60000);
    if (min < 1) return "不到 1 分钟";
    if (min < 60) return "还有 " + min + " 分钟";
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h < 48) return m ? "还有 " + h + " 小时 " + m + " 分" : "还有 " + h + " 小时";
    const d = Math.floor(h / 24);
    const rh = h % 24;
    return rh ? "还有 " + d + " 天 " + rh + " 小时" : "还有 " + d + " 天";
  }

  function clockParts(tz) {
    const parts = {};
    new Intl.DateTimeFormat("zh-CN", {
      timeZone: tz,
      hourCycle: "h23",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).formatToParts(new Date()).forEach(function (p) {
      if (p.type !== "literal") parts[p.type] = p.value;
    });
    let hour = parts.hour;
    if (hour === "24") hour = "00";
    return { date: parts.month + "/" + parts.day, time: hour + ":" + parts.minute };
  }

  function fmtClock(tz) {
    const c = clockParts(tz);
    return c.date + " " + c.time;
  }

  function headerRemain(ms) {
    if (ms < 0) return "到点";
    const min = Math.round(ms / 60000);
    if (min < 1) return "1分";
    if (min < 60) return min + "分";
    const h = Math.floor(min / 60);
    if (h < 48) return h + "小时";
    const d = Math.floor(h / 24);
    const rh = h % 24;
    return rh ? d + "天" + rh + "时" : d + "天";
  }

  function themeNow() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function fontNow() {
    const f = document.documentElement.getAttribute("data-font");
    return FONTS.indexOf(f) >= 0 ? f : "md";
  }

  function applyFont(f, persist) {
    if (FONTS.indexOf(f) < 0) f = "md";
    document.documentElement.setAttribute("data-font", f);
    if (persist) localStorage.setItem(FONT_KEY, f);
    const btn = document.getElementById("font-btn");
    if (btn) {
      btn.textContent = FONT_LABEL[f];
      btn.setAttribute("aria-label", "字号" + FONT_LABEL[f] + "，点按切换");
    }
  }

  function applyTheme(t, persist) {
    document.documentElement.setAttribute("data-theme", t);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#14110e" : "#efe6d6");
    if (persist) localStorage.setItem(THEME_KEY, t);
    const btn = document.getElementById("theme-btn");
    if (btn) {
      btn.textContent = t === "dark" ? "浅色" : "深色";
      btn.setAttribute("aria-label", t === "dark" ? "切换到浅色" : "切换到深色");
    }
  }

  function openCount() {
    return CHECKS.filter(function (c) { return !checks.has(c.id); }).length;
  }

  function measure() {
    const h = document.getElementById("top");
    if (h) document.documentElement.style.setProperty("--top-h", h.offsetHeight + "px");
  }

  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 1600);
  }

  function copyText(text) {
    function ok() { toast("已复制"); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok).catch(fallback);
    } else fallback();
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-999px";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); ok(); } catch (e) { toast("复制失败，请长按文字"); }
      ta.remove();
    }
  }

  function dayPlain(day) {
    const lines = [day.dateLabel + " " + day.weekday + (day.wx ? " " + day.wx : "") + "｜" + day.kicker, ""];
    day.blocks.forEach(function (b) {
      lines.push(b.time + " " + b.title + (b.text ? "：" + b.text : ""));
    });
    (day.notes || []).forEach(function (n) { lines.push(n.text); });
    return lines.join("\n");
  }

  function setHash() {
    if (landedBlock) {
      if (location.hash !== "#" + landedBlock) history.replaceState(null, "", "#" + landedBlock);
      landedBlock = "";
      return;
    }
    let h = state.tab;
    if (state.tab === "plan") h = state.day;
    if (location.hash !== "#" + h) history.replaceState(null, "", "#" + h);
  }

  function renderAll() {
    renderHeader();
    renderMain();
    renderTabs();
    setHash();
    measure();
    scrollAnchor();
  }

  function scrollAnchor() {
    if (!state.anchor) return;
    const id = state.anchor;
    state.anchor = "";
    requestAnimationFrame(function () {
      const n = document.getElementById(id);
      if (!n) return;
      const topH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--top-h"), 10) || 140;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const top = n.getBoundingClientRect().top + window.scrollY - topH - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
    });
  }

  function renderHeader() {
    const now = Date.now();
    const next = upcoming(now);
    const top = document.getElementById("top");
    top.replaceChildren();
    const row = el("div", { class: "title-row" },
      el("span", { class: "mark", "aria-hidden": "true" }),
      el("h1", null, "马德里 ESMO"),
      el("button", { type: "button", class: "icon-btn", id: "font-btn", "data-action": "font" }, FONT_LABEL[fontNow()]),
      el("button", { type: "button", class: "icon-btn", id: "place-btn", "data-action": "sheet" }, "地点"),
      el("button", { type: "button", class: "icon-btn", id: "theme-btn", "data-action": "theme" }, themeNow() === "dark" ? "浅色" : "深色")
    );
    const madNow = clockParts(MAD);
    const bjNow = clockParts(BJ);
    const sameDay = madNow.date === bjNow.date;
    const clocks = el("div", { class: "clockline" },
      el("div", { class: "clock" }, el("span", null, "马德里"), el("b", { id: "clk-mad" }, madNow.date + " " + madNow.time)),
      el("div", { class: "clock" }, el("span", null, "北京"), el("b", { id: "clk-bj" }, sameDay ? bjNow.time : bjNow.date + " " + bjNow.time))
    );
    let nextBtn;
    if (!next) {
      nextBtn = el("button", { type: "button", class: "next", "data-action": "noop" }, el("b", null, "已经回到北京"));
    } else {
      nextBtn = el("button", {
        type: "button",
        class: "next",
        "data-action": "jump-next",
        "data-tab": next.tab,
        "data-day": next.day || "",
        "data-anchor": next.anchor || ""
      }, el("small", { class: "k" }, "接下来"), el("b", null, next.label), el("small", { id: "clk-remain" }, headerRemain(next.at - now)));
    }
    top.append(row, el("div", { class: "statusline" }, clocks, nextBtn));
    applyFont(fontNow(), false);
    const themeBtn = document.getElementById("theme-btn");
    themeBtn.setAttribute("aria-label", themeNow() === "dark" ? "切换到浅色" : "切换到深色");
  }

  function renderTabs() {
    const n = openCount();
    const tabs = [
      { id: "plan", label: "行程", icon: iconCal() },
      { id: "list", label: "清单", icon: iconCheck(), badge: n },
      { id: "book", label: "手册", icon: iconBook() }
    ];
    const bar = document.getElementById("tabs");
    bar.replaceChildren();
    tabs.forEach(function (t) {
      const btn = el("button", { type: "button", "data-tab": t.id });
      if (state.tab === t.id) btn.setAttribute("aria-current", "page");
      btn.append(t.icon);
      const lab = el("span", null, t.label);
      if (t.badge) lab.append(el("span", { class: "badge" }, String(t.badge)));
      btn.append(lab);
      bar.append(btn);
    });
  }

  function svg(path) {
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("width", "22");
    s.setAttribute("height", "22");
    s.setAttribute("aria-hidden", "true");
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", path);
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", "currentColor");
    p.setAttribute("stroke-width", "1.8");
    p.setAttribute("stroke-linecap", "round");
    p.setAttribute("stroke-linejoin", "round");
    s.append(p);
    return s;
  }
  function iconCal() { return svg("M7 3v3M17 3v3M4 8h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"); }
  function iconCheck() { return svg("M8 12.5l2.5 2.5L16 9M6 4h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2z"); }
  function iconBook() { return svg("M5 4.5h9.5A3.5 3.5 0 0 1 18 8v12H8.5A3.5 3.5 0 0 0 5 16.5zM5 4.5v12"); }

  function renderMain() {
    const main = document.getElementById("main");
    main.replaceChildren();
    if (state.tab === "plan") main.append(renderPlan());
    else if (state.tab === "list") main.append(renderList());
    else {
      main.append(renderBook());
      syncPicks();
      applyQuery();
    }
  }

  function renderPlan() {
    const now = Date.now();
    const active = activeDayId(now);
    const day = DAYS.filter(function (d) { return d.id === state.day; })[0] || DAYS[0];
    const wrap = el("div");
    const chips = el("div", { class: "day-chips", role: "tablist", "aria-label": "选择日期" });
    DAYS.forEach(function (d) {
      const b = el("button", {
        type: "button",
        class: "chip" + (d.id === active ? " is-today" : ""),
        "data-day": d.id,
        "aria-pressed": d.id === day.id ? "true" : "false"
      }, el("b", null, d.num), el("span", null, d.weekday), el("small", null, d.wx || ""));
      chips.append(b);
    });
    wrap.append(el("div", { class: "sticky-bar" }, chips));

    const hero = el("div", { class: "hero" },
      el("div", null,
        el("p", { class: "kicker" }, day.dateLabel + " · " + day.weekday + (day.wx ? " · " + day.wx : "")),
        el("h2", null, day.kicker)
      ),
      el("p", { class: "day-num" }, day.num)
    );
    wrap.append(hero);

    if (active && active !== day.id) {
      wrap.append(el("button", { type: "button", class: "go back-today", "data-day": active }, "回到今天"));
    } else if (!active && now < DAYS[0].blocks[0].at) {
      wrap.append(el("div", { class: "note" }, el("p", null, "还没出发。上面的「接下来」会跳到最近一件定时的事；没勾的准备在「清单」里。")));
    } else if (!active) {
      wrap.append(el("div", { class: "note ok" }, el("p", null, "按计划已经回到北京。")));
    }

    (day.notes || []).forEach(function (n) {
      const cls = n.kind === "warn" ? "note" : n.kind === "ok" ? "note ok" : "skip";
      wrap.append(el("div", { class: cls }, el("p", null, n.text)));
    });
    const actions = el("div", { class: "actions" },
      el("button", { type: "button", class: "primary", "data-action": "copy-day", "data-day": day.id }, "复制这一天")
    );
    (day.actions || []).forEach(function (a) {
      if (a.clip) actions.append(el("button", { type: "button", "data-clip": a.clip }, a.label));
      else actions.append(ext(a.href, a.label, a.tel, a.same));
    });
    wrap.append(actions);

    const cur = currentBlock(day, now);
    day.blocks.forEach(function (b) {
      const item = el("div", { class: "tl-item" + (cur && cur.id === b.id ? " is-now" : ""), id: b.id });
      item.append(el("div", { class: "rail" }, el("i")));
      const card = el("div", { class: "tl-card" });
      const when = el("p", { class: "when" }, b.time);
      if (cur && cur.id === b.id) when.append(el("span", { class: "now-pill" }, "现在"));
      card.append(when, el("h3", null, b.title), el("p", null, b.text));
      if (b.links && b.links.length) {
        const links = el("div", { class: "actions" });
        b.links.forEach(function (l) {
          if (l.clip) links.append(el("button", { type: "button", class: "go", "data-clip": l.clip }, l.label));
          else links.append(ext(l.href, l.label, l.tel, l.same));
        });
        card.append(links);
      }
      item.append(card);
      wrap.append(item);
    });
    return wrap;
  }

  function renderList() {
    const wrap = el("div");
    const done = CHECKS.length - openCount();
    const pct = Math.round((done / CHECKS.length) * 100);
    wrap.append(el("div", { class: "progress-wrap" },
      el("div", { class: "progress", role: "meter", "aria-valuenow": String(pct), "aria-valuemin": "0", "aria-valuemax": "100" },
        el("span", { style: "width:" + pct + "%" })
      ),
      el("p", { class: "kicker" }, "已完成 " + done + " / " + CHECKS.length + "。勾选只存在这台手机的浏览器里。")
    ));
    const filters = el("div", { class: "filters", role: "group", "aria-label": "筛选清单" });
    [["open", "未完成"], ["all", "全部"], ["done", "已完成"]].forEach(function (f) {
      filters.append(el("button", { type: "button", "data-filter": f[0], "aria-pressed": state.filter === f[0] ? "true" : "false" }, f[1]));
    });
    wrap.append(filters);
    wrap.append(el("div", { class: "actions" },
      el("button", { type: "button", "data-action": "copy-open" }, "复制未完成"),
      el("button", { type: "button", "data-action": "reset-checks" }, "恢复初始勾选")
    ));

    let any = false;
    GROUPS.forEach(function (g) {
      const items = CHECKS.filter(function (c) {
        if (c.group !== g.id) return false;
        const on = checks.has(c.id);
        if (state.filter === "open") return !on;
        if (state.filter === "done") return on;
        return true;
      });
      if (!items.length) return;
      any = true;
      const box = el("section", { class: "group" }, el("h2", null, g.title));
      items.forEach(function (c) {
        const on = checks.has(c.id);
        const row = el("button", {
          type: "button",
          class: "row",
          "data-check": c.id,
          "aria-pressed": on ? "true" : "false"
        }, el("span", { class: "box", "aria-hidden": "true" }), el("span", null, el("span", { class: "t" }, c.title), el("span", { class: "d" }, c.detail)));
        const item = el("div", { class: "item", id: "item-" + c.id }, row);
        if (c.links && c.links.length) {
          const links = el("div", { class: "links" });
          c.links.forEach(function (l) { links.append(ext(l.href, l.label, l.tel, l.same)); });
          item.append(links);
        }
        box.append(item);
      });
      wrap.append(box);
    });
    if (!any) {
      wrap.append(el("p", { class: "empty" }, state.filter === "open" ? "未完成的事项都勾完了。可以切到「全部」复核。" : "这一栏是空的。"));
    }
      wrap.append(el("div", { class: "note" }, el("p", null, "26 日是上午普拉多、15:00 王宫讲解。不要把这两个景点挪到 27 日去赶飞机。")));
    return wrap;
  }

  function renderBook() {
    const wrap = el("div");
    wrap.append(el("input", {
      id: "q",
      class: "search",
      type: "search",
      placeholder: "搜索手册，例如 寄存、烤乳羊、交通票",
      "aria-label": "搜索手册",
      autocomplete: "off"
    }));
    BOOK.forEach(function (sec) {
      const d = el("details", { class: "sec", id: "sec-" + sec.id });
      if (sec.open) d.open = true;
      const body = el("div", { class: "body" });
      body.innerHTML = sec.html;
      d.append(el("summary", null, sec.title), body);
      wrap.append(d);
    });
    wrap.append(el("p", { class: "empty", id: "nohit", hidden: true }, "没有匹配的章节。"));
    const q = wrap.querySelector("#q");
    if (q) q.value = state.query;
    return wrap;
  }

  function syncPicks() {
    document.querySelectorAll("[data-party]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-party") === state.party ? "true" : "false");
    });
    document.querySelectorAll("[data-party-panel]").forEach(function (p) {
      p.hidden = p.getAttribute("data-party-panel") !== state.party;
    });
    document.querySelectorAll("[data-move]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-move") === state.move ? "true" : "false");
    });
    document.querySelectorAll("[data-move-panel]").forEach(function (p) {
      p.hidden = p.getAttribute("data-move-panel") !== state.move;
    });
  }

  function applyQuery() {
    const q = state.query.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll("details.sec").forEach(function (d) {
      const hit = !q || d.textContent.toLowerCase().indexOf(q) !== -1;
      d.hidden = !hit;
      if (hit) shown += 1;
      if (q && hit) d.open = true;
    });
    const empty = document.getElementById("nohit");
    if (empty) empty.hidden = shown !== 0;
  }

  function partyHTML() {
    return (
      '<div class="seg three" role="group" aria-label="按人数看点法">' +
      '<button type="button" data-party="3">3 人</button>' +
      '<button type="button" data-party="4all">4 人，都想吃羊</button>' +
      '<button type="button" data-party="4some">4 人，只有两人吃羊</button>' +
      "</div>" +
      '<div class="pick" data-party-panel="3"><p>1 份四分之一烤乳羊（标注供 2 人）＋ 1 份炖鸡 pepitoria de gallina。开胃菜选家常炸丸子或 Padrón 青椒各 1 份，加 1 份烤土豆。按转载菜单大约 €90–95，不含饮料和甜品。三人都想吃羊，先问餐厅要不要加量，不要自己点两份。</p></div>' +
      '<div class="pick" data-party-panel="4all"><p>2 份四分之一烤乳羊 ＋ 1 份 Padrón 青椒 ＋ 1 份家常炸丸子 ＋ 1–2 份烤土豆。大约 €120–126，不含饮料和甜品。食量小的话，先确认能否先上一份羊、再追加。</p></div>' +
      '<div class="pick" data-party-panel="4some"><p>1 份四分之一烤乳羊 ＋ 2 份其他主菜分着吃（炖鸡 pepitoria 或炖牛尾 rabo de toro）＋ 1–2 份蔬菜或炸丸子 ＋ 烤土豆。不要为了凑整份多点羊。订位时问主菜够不够分。</p></div>'
    );
  }

  function moveHTML() {
    return (
      '<div class="seg" role="group" aria-label="现在要去哪">' +
      '<button type="button" data-move="fair">去会场</button>' +
      '<button type="button" data-move="dinner">23 日晚餐</button>' +
      '<button type="button" data-move="party">24 日酒会</button>' +
      '<button type="button" data-move="gc">25 日论坛</button>' +
      '<button type="button" data-move="old">26 日</button>' +
      '<button type="button" data-move="air">机场</button>' +
      "</div>" +
      '<div class="pick" data-move-panel="fair"><p>23、24、25、27 日上午去 IFEMA，默认地铁。公寓步行到 Nuevos Ministerios，上 8 号线往 Aeropuerto T4 方向，到 Feria de Madrid，再按 ESMO 标识进馆。三段各留 15–20 分钟，门到门 55–60 分钟。不经过机场闸机，不用机场附加票。注意是地铁 8 号线，不是近郊铁路。回程坐往 Nuevos Ministerios 方向。25 日下午不走这条，17:05 带海报筒打车去论坛。</p><p><a href="' + LINK.aptToIfema + '" target="_blank" rel="noopener">公寓 → 会场</a> · <a href="' + LINK.ifemaBack + '" target="_blank" rel="noopener">会场 → 公寓</a></p></div>' +
      '<div class="pick" data-move-panel="dinner"><p>23 日 18:45 从会场直接去 La Maruca Velázquez，Calle Velázquez 54，不绕回公寓。目标 20:00 到。走公共交通还是三人合乘，看当天导航。晚餐后回 Calle de Orense 22，重新导航。</p><p><a href="' + LINK.ifemaToDinner + '" target="_blank" rel="noopener">会场 → 晚餐</a> · <a href="' + gdir("La Maruca Velazquez, Calle Velazquez 54, Madrid", "Calle de Orense 22, Madrid") + '" target="_blank" rel="noopener">晚餐 → 公寓</a></p></div>' +
      '<div class="pick" data-move-panel="party"><p>17:00 到 Hall 10 展台 1108，坐 TigerMed 的免费 Uber 去 Rosewood。驾车约 21 分钟。不坐这班，16:15 走公共交通，约 45 分钟。回公寓自己走。</p><p><a href="' + LINK.ifemaToRose + '" target="_blank" rel="noopener">会场 → 酒会</a> · <a href="' + LINK.roseToApt + '" target="_blank" rel="noopener">酒会 → 公寓</a></p></div>' +
      '<div class="pick" data-move-panel="gc"><p>25 日 17:05 从会场直接去，带着海报筒，不绕回公寓。Hotel Puerta América，Avenida de América 41。路网大约 6.1 公里，不含堵车大约 10 分钟；出馆找车另算，目标 17:45 前到。三人合乘出租车。20:00 结束再回公寓，这段路网大约 3.7 公里、不含堵车大约 8 分钟。海报筒带回公寓，不要留在会场。</p><p><a href="' + LINK.ifemaToGc + '" target="_blank" rel="noopener">会场 → 论坛</a> · <a href="' + LINK.gcToApt + '" target="_blank" rel="noopener">论坛 → 公寓</a></p></div>' +
      '<div class="pick" data-move-panel="old"><p>26 日不走丽池，也不去 Plaza Mayor。09:30 从公寓打车到普拉多约 5.1 公里、16 分钟。12:20 步行到 Posada 约 1.7 公里、24 分钟。14:25 步行到王宫约 1.4 公里、18 分钟，14:45 到优先入口。讲解后从王宫一带回公寓，三人合乘出租车，当天看导航。这一天不用地铁。</p><p><a href="' + LINK.aptToPrado + '" target="_blank" rel="noopener">公寓 → 普拉多</a> · <a href="' + LINK.pradoToPosada + '" target="_blank" rel="noopener">普拉多 → Posada</a> · <a href="' + LINK.posadaToPalace + '" target="_blank" rel="noopener">Posada → 王宫</a> · <a href="' + gdir("Palacio Real de Madrid", "Calle de Orense 22, Madrid", "driving") + '" target="_blank" rel="noopener">王宫 → 公寓</a></p></div>' +
      '<div class="pick" data-move-panel="air"><p>22 日落地打车回公寓，固定价 €33/车。27 日 17:45 从会场去 T4，约 5.3 公里、9 分钟。目的地 Madrid-Barajas Terminal 4, Salidas, Emirates。T4 办票，再去 T4S。Google Maps</p><p><a href="' + LINK.t4 + '" target="_blank" rel="noopener">T4 地图</a> · <a href="' + LINK.ifemaToT4 + '" target="_blank" rel="noopener">会场 → T4</a> · <a href="' + LINK.taxi + '" target="_blank" rel="noopener">官方出租车说明</a></p></div>'
    );
  }

  const BOOK = [
    {
      id: "remember",
      title: "先记住这几件事",
      open: true,
      html:
        "<p>同行 3 人：2 个展商证，1 个完整会议注册。袁的参会码在 23 日领证那一栏。展台由商务兜底，你们协助。除 25 日 193P 海报讲解外，参展时段可以灵活安排。</p>" +
        "<ul>" +
        "<li><b>住宿</b> Calle de Orense 22, 28020 Madrid。22 日当晚已入住。27 日早上退房，行李带去会场交给会务。</li>" +
        "<li><b>去程</b> 22 日 PEK T3 07:25 → DXB T3 11:35；14:30 → MAD T4S 20:20。</li>" +
        "<li><b>回程</b> 27 日 MAD 21:45 → 28 日 DXB 07:40；11:00 → PEK T3 22:30。</li>" +
        "<li><b>迪拜休息室</b> 两段都在 T3，都不出机场。去程 11:35–14:30 是午饭，回程 07:40–11:00 是早餐。付费休息室要吃好，选和下一程登机口同一指廊的 Ahlan。阿联酋航空写指廊之间大约 30 分钟。</li>" +
        "<li><b>值机</b> 去程 10月20日 07:25 北京时间开放（EK309＋EK143）。回程 10月26日 04:45 北京时间开放，即马德里 10月25日 21:45（EK144＋EK308）。</li>" +
        "<li><b>晚餐</b> 23 日 20:00，La Maruca Velázquez，Calle Velázquez 54。餐厅不变，只改了时间。</li>" +
        "<li><b>酒会</b> 24 日 17:30–21:00，Rosewood Villa Magna，Villa 22。展台在 Hall 10，17:00 到展台 1108 坐免费 Uber，17:30 前到。入场码在酒会那一栏，点袁、婷、明。</li>" +
        "<li><b>海报</b> 25 日 12:00–12:45，Hall 5，编号 193P。早间挂上，17:00 取回后直接去胃癌论坛。</li>" +
        "<li><b>胃癌论坛</b> 25 日 18:00–20:00，Hotel Puerta América，Avenida de América 41。18:00–19:00 是 Networking Dinner，19:00 徐瑞华开场。三张入场码在 25 日晚餐那一栏，点袁、婷、明。</li>" +
        "<li><b>26 日</b> 03:30–04:00 周会。10:00 普拉多，12:45 Posada，15:00 王宫讲解。不去展台，不走丽池。</li>" +
        "<li><b>返程底线</b> 27 日 17:30 会务取行李，17:45 从会场出发，大约 18:00 到 T4。</li>" +
        "<li><b>回程睡觉</b> 第一程到马德里时间 28 日 03:00 可以睡。第二程整段不睡。落地后再睡。</li>" +
        "<li><b>28 日</b> 西班牙时间 04:00–05:00 RFP会，08:00 百济的会。人在回程。</li>" +
        "</ul>" +
        "<p>已经完成的：纸质海报已打印，电子海报已上传，23 日晚餐已定，26 日普拉多、王宫和 Posada 已订，三人网络漫游已开通。袁已领到 5 日无限交通卡，婷和明的十次票已买。展台在 Hall 10，展台号还没写上。27 日行李存在会务。</p>" +
        '<p><button type="button" data-clip="card">复制随身联系卡</button></p>'
    },
    {
      id: "move",
      title: "交通、票和行李",
      html:
        "<p>先选你现在要去的地方。</p>" +
        moveHTML() +
        "<h3>交通票</h3>" +
        "<p>袁用 5 日无限卡。婷和明用已买的十次票。十次票不含近郊铁路，换乘公交通常再扣一次。无限卡没写机场，就不要拿它进 T4。</p>" +
        '<p><a href="' + LINK.crtm + '" target="_blank" rel="noopener">CRTM 票价</a> · <a href="' + LINK.esmoReg + '" target="_blank" rel="noopener">ESMO 注册权益</a> · <a href="' + LINK.ifemaHow + '" target="_blank" rel="noopener">IFEMA 怎么去</a></p>' +
        "<h3>哪一段用什么</h3>" +
        "<ul>" +
        "<li><b>23、24、25、27 日上午去会场</b> 地铁，55–60 分钟。</li>" +
        "<li><b>23 日 18:45 去晚餐</b> 从会场直接走，不回公寓。赶不上或下雨，三人合乘。</li>" +
        "<li><b>24 日 17:00</b> 到 Hall 10 展台 1108，坐 TigerMed 的免费 Uber 去酒会。不坐这班车，16:15 走公共交通。</li>" +
        "<li><b>25 日 17:05</b> 带海报筒打车去 Puerta América，20:00 再打车回公寓。公寓和 IFEMA 之间如果临时改打车，按大约 €20–35/车留预算，不是实时报价。</li>" +
        "<li><b>26 日</b> 09:30 打车去普拉多。普拉多到 Posada、Posada 到王宫步行。结束从王宫回公寓再打车。这一天不用地铁。</li>" +
        "<li><b>机场</b> 22 日落地 €33/车。27 日 17:45 从会场去 T4，约 5.3 公里、9 分钟。</li>" +
        "</ul>" +
        "<h3>行李按天</h3>" +
        "<ol>" +
        "<li><b>22 日</b> 在北京托运，直挂马德里。迪拜 T3 只转机，不取行李。落地 T4S 取完，出租车去公寓。</li>" +
        "<li><b>23–24 日</b> 大箱子留在公寓。只带当天要用的包。</li>" +
        "<li><b>25 日</b> 海报筒带到 Hall 5，17:00 取下后带去胃癌论坛，20:00 带回公寓。不要留在会场过夜。</li>" +
        "<li><b>26 日</b> 大箱子和海报筒留在公寓。出门只带当天的小包。</li>" +
        "<li><b>27 日</b> 07:00 退房，大箱子和海报筒带去会场交给会务。17:30 取，17:45 从会场去 T4 托运。回程直挂北京，迪拜不取。海报筒塞不进手提限额就一起托运。</li>" +
        "</ol>" +
        "<p>27 日行李交给会务。收费看现场。</p>" +
        '<p><a href="' + LINK.luggage + '" target="_blank" rel="noopener">商业寄存只作备用</a> · <a href="' + LINK.aenaEk + '" target="_blank" rel="noopener">T4 的阿联酋柜台说明</a></p>'
    },
    {
      id: "food",
      title: "吃饭、点菜和超市",
      html:
        "<p>早餐尽量在公寓解决，大约 €3–5/人。25 日前一晚备好。会场午餐留 €12–20/人，注册不默认含餐。中午不回公寓。工作日午餐可以问 menú del día，先确认饮料、面包和税是否包含。</p>" +
        "<h3>公寓附近</h3>" +
        '<div class="place"><b>Las Jarritas</b><span>约 6 分钟</span><small>Orense 39。咖啡、吐司、日常西班牙餐。早餐 €4–7，正餐 €15–25。周日 11:00 才开，不能当 25 日早饭。</small></div>' +
        '<div class="place"><b>La Tagliatella</b><span>5–8 分钟</span><small>Orense 11。意面、披萨，€18–28。累的时候用。</small></div>' +
        '<div class="place"><b>Circolo Popolare</b><span>5–10 分钟</span><small>Plaza Pablo Ruiz Picasso 1。适合一起吃，€25–40。晚餐分时段，建议预约。</small></div>' +
        '<div class="place"><b>Casa Habibi</b><span>3–6 分钟</span><small>Orense 28 后侧。中东或烤肉，€15–25。周一休息，周日晚餐未确认。</small></div>' +
        "<h3>买水和早餐</h3>" +
        '<div class="place"><b>Casa Elias</b><span>2–4 分钟</span><small>Orense 18。最近的水果、面包、水。平日 09:00–21:30，周日 10:00–14:30。</small></div>' +
        '<div class="place"><b>Carrefour Market</b><span>约 14 分钟</span><small>Orense 48。一次买几天的早餐。官网写周一至周六 07:00 到次日 01:00，周日另核。</small></div>' +
        '<div class="place"><b>Mi Alcampo</b><span>20–25 分钟</span><small>Orense 64。选择更多，少量补给不必特意去。</small></div>' +
        "<p>优先买面包、酸奶或牛奶、水果、坚果、水。做热食之前先确认公寓厨房能用。</p>" +
        '<p><a href="' + LINK.carrefour + '" target="_blank" rel="noopener">Carrefour 门店页</a> · <button type="button" data-clip="apt">复制公寓地址</button></p>' +
        "<h3>26 日烤乳羊怎么点</h3>" +
        "<p>这顿夹在上午普拉多和 15:00 王宫讲解中间。14:25 离开，步行去王宫。23 日已经有商务晚餐，24 日有酒会，25 日晚上有胃癌论坛的晚餐，所以不再加 Botín 或另一顿正式大餐。</p>" +
        "<p>马德里旅游局记载，这个地点 1642 年成为马德里第一家宫廷驿站，后来衰落，一度濒临废弃，1980 年修复后变成现在的烤肉餐厅。Botín 则以 1725 年创立、连续经营，被称为世界最古老的餐厅。两件事不是同一件事。</p>" +
        "<p>转载菜单写着四分之一烤乳羊 €46、标注 2 人份。订位时向餐厅核实供应、份量和价格。人均如果按旅游局的馆子档次，参考 €45–60。下面按人数切换，避免点多。</p>" +
        partyHTML() +
        "<p>不建议照搬某篇笔记去点烤蘑菇，那篇笔记写明性价比不好。甜品看完主菜再决定。已经订好 10月26日 12:45、3 人，姓名 MENGHE YUAN YUAN。到店报这个名字，没有二维码。临时改人数要先联系餐厅。</p>" +
        '<p><a href="' + LINK.posada + '" target="_blank" rel="noopener">餐厅官网</a> · <a href="' + LINK.posadaInfo + '" target="_blank" rel="noopener">旅游局页面</a> · <a href="' + LINK.posadaMenu + '" target="_blank" rel="noopener">菜单转载</a> · <a href="tel:+34913661860">+34 91 366 18 60</a></p>' +
        '<p><button type="button" data-clip="phone">复制电话</button> <button type="button" data-clip="email">复制邮箱</button></p>' +
        "<h3>这次不排、但可以记住的</h3>" +
        "<ul>" +
        '<li><b>Botín</b> Calle de Cuchilleros 17，招牌烤乳猪。历史有分量，但这顿烤肉和老城路线已经由 Posada 覆盖。<a href="' + LINK.botin + '" target="_blank" rel="noopener">菜单</a></li>' +
        '<li><b>La Bola</b> Calle Bola 5，招牌 cocido madrileño。想吃完整马德里炖菜可以留给下次。<a href="' + LINK.labola + '" target="_blank" rel="noopener">菜单</a></li>' +
        '<li><b>La Trainera</b> 如果商务或同行一定要海鲜，用它替换别的正式餐厅，不要再叠加一顿。点整鱼或按重量计价之前，先问单位价格。<a href="' + LINK.trainera + '" target="_blank" rel="noopener">官网</a></li>' +
        "</ul>" +
        "<p>点单前确认面包、小食、饮料和税。需要公司抬头发票，结账前说，并留下明细和刷卡凭证。</p>"
    },
    {
      id: "toilet",
      title: "找厕所",
      html:
        "<p><b>西班牙文 H 是男、M 是女</b>，和英语相反。看不清就看小人。很多厕所没有纸，包里带纸巾。密码印在小票最下面，一两周就可能换，下面的数字只作参考。</p>" +
        "<p>先用脚下这个地方的厕所。机场、会场、餐厅、酒店、博物馆都有，不为找厕所改路线。</p>" +
        "<h3>机场</h3>" +
        '<div class="place"><b>马德里 T4 / T4S</b><span>22 日、27 日</span><small>落地取行李、办票安检，都用航站楼里的。不出大厅。</small></div>' +
        '<div class="place"><b>迪拜 T3</b><span>22 日、28 日</span><small>转机和 Ahlan 里都有。不出机场。</small></div>' +
        "<h3>会场和晚上的三处</h3>" +
        '<div class="place"><b>IFEMA</b><span>23、24、25、27 日</span><small>用馆内的。白天不出去找。</small></div>' +
        '<div class="place"><b>La Maruca、Rosewood、Puerta América</b><span>23–25 日晚上</span><small>用餐厅或酒店自己的。</small></div>' +
        "<h3>26 日</h3>" +
        '<div class="place"><b>普拉多</b><span>10:00 进馆后</span><small>用馆内的。进馆前若来得及，对面汉堡王 Paseo del Prado 26，直线约 210 米，密码 1954。</small></div>' +
        '<div class="place"><b>Posada</b><span>12:45</span><small>用餐厅的。不绕太阳门。</small></div>' +
        '<div class="place"><b>王宫入口</b><span>14:45</span><small>免费。进门前用，宫里不要中途折返。</small></div>' +
        "<h3>公寓</h3>" +
        '<div class="place"><b>附近 KFC</b><span>直线约 740 米</span><small>Calle de Bravo Murillo 168，密码 1234。去会场的地铁不经过这里。四路地铁口笔记里的 1304 不是这家。</small></div>' +
        "<p>太阳门、丽池、Atocha、Gran Vía 这几天不走。找不到就进酒吧点一杯咖啡，大约 €1–2。密码以当场小票为准。</p>" +
        '<p><a href="https://www.google.com/maps/search/?api=1&query=Burger+King+Paseo+del+Prado+26+Madrid" target="_blank" rel="noopener">普拉多对面汉堡王</a> · <a href="https://www.google.com/maps/search/?api=1&query=KFC+Calle+de+Bravo+Murillo+168+Madrid" target="_blank" rel="noopener">公寓附近 KFC</a></p>'
    },
    {
      id: "phone",
      title: "上网、App、支付和随身",
      html:
        "<p>三人各自的网络漫游已经开通。马德里这几天用自己的卡，数据漫游保持开着，短信也留着。不必再买当地 SIM，也不要关掉数据漫游。</p>" +
        "<p>漫游现场不能用时，再去 Vodafone，Bravo Murillo 212，离公寓步行大约 18 分钟。周一至周六 10:00–21:00，周日休息。带护照和取卡针，激活后试地图和微信。Orense 7 那家旧店已永久关闭。Vodafone Prepago S 官方价 €10/28 天。</p>" +
        '<p><a href="' + LINK.vodafone + '" target="_blank" rel="noopener">预付费说明</a> · <a href="' + LINK.vodaStore + '" target="_blank" rel="noopener">门店页</a></p>' +
        "<p><b>会场 Wi-Fi</b> 资料上有免费网络 IFEMA FREE，连上以后可能要在浏览器里登录。ESMO 自己的账号密码还没核实，以现场为准。有网不等于展台速度快。</p>" +
        "<p><b>机场 Wi-Fi</b> 22 日落地和 27 日离开都会经过 T4。官方网络名是 Airport Free Wifi Aena。小红书「少年」写的用法：连 <b>AIRPORT FREE Wifi AENA</b>，选访客，邮箱填两次，大约能用 1 小时；点开机场发来的验证信后，可以在机场里接着用。不要连 wifi-aena。这是访客经验，现场以 AENA 页面为准。</p>" +
        "<p>市区免费 Wi-Fi 这次在小红书上没有搜到落在老城、会场或公寓旁边的新分享。王宫和普拉多展厅不要指望室内网络。会场仍用上面的 IFEMA FREE。</p>" +
        "<p><b>迪拜 T3 上网</b> 去程和回程都不出机场。连 <b>DXB Free Wi-Fi</b>，不要默认漫游有阿联酋流量。迪拜机场 2016 年说全场免费、不限时、打开页面点一下即可。2025 年 Khaleej Times 写要填姓名、电话和邮箱，大约 60 分钟。以落地弹出的页面为准。</p>" +
        "<p><span class=\"flag\">访客经验</span> 小红书「富士山下」写 du 游客卡在入境海关领取，10GB 加 3 分钟通话，24 小时，必须在柜台录入护照；作者回复不过海关就不能领，机场有 Wi-Fi，不领也行。你们两段都走 Connections，不要为了这张卡出机场。</p>" +
        "<h3>迪拜 T3 付费休息室</h3>" +
        "<p>已有选休息室的二维码。经济舱付费能进的是 Ahlan 和 Marhaba，不是阿联酋航空公务舱休息室。A、B、C 三个指廊都有。阿联酋航空写 Ahlan 在 A1（A 指廊 6 层）、B26（B 指廊，麦当劳楼上）、C13（C 指廊）。龙腾写 Marhaba 的 B 区在 4 层、靠近 B21。两家都是 24 小时，含冷热餐和 Wi-Fi。</p>" +
        "<p><mark>要吃好，用二维码选和下一程登机口同一指廊的 Ahlan。</mark> 去程 11:35 到、14:30 飞马德里，吃午饭；回程 07:40 到、11:00 飞北京，吃早餐。小红书 Orange一靓在 T3 B 区对比过：Ahlan 热食、冷盘、水果更全，适合吃饭；Marhaba 沙发多一些，笔记里看到淋浴。阿联酋航空写 Ahlan 的淋浴要走大约 10 分钟到别处。回程如果更想洗澡，再改同一指廊的 Marhaba。笔记作者说单次费用只能进一间。</p>" +
        "<p>有一次公开航班记录 EK143 从 A13 走，不代表 10 月 22 日仍是 A 指廊。EK308 只确认 T3，指廊看当天登机牌。指廊之间大约 30 分钟，2 小时 55 分和 3 小时 20 分都不够来回换区。</p>" +
        '<p><a href="' + LINK.ifemaWifi + '" target="_blank" rel="noopener">IFEMA 服务</a> · <a href="' + LINK.aenaWifi + '" target="_blank" rel="noopener">马德里机场 Wi-Fi</a> · <a href="https://www.xiaohongshu.com/explore/6ad2e206000000001802f87b" target="_blank" rel="noopener">小红书：少年，马德里机场 Wi-Fi</a> · <a href="https://media.dubaiairports.ae/passengers-enjoy-unlimited-free-high-speed-wi-fi-at-dxb-and-dwc/" target="_blank" rel="noopener">迪拜机场 Wi-Fi</a> · <a href="https://www.xiaohongshu.com/explore/6a3773040000000021008e99" target="_blank" rel="noopener">小红书：富士山下，免费电话卡</a> · <a href="https://www.emirates.com/english/before-you-fly/dubai-international-airport/transferring-between-terminals/" target="_blank" rel="noopener">阿联酋航空转机</a> · <a href="https://www.xiaohongshu.com/explore/699d8e1d000000002801c756" target="_blank" rel="noopener">小红书：Orange一靓，Ahlan 和 Marhaba</a></p>' +
        "<h3>这些 App 要能打开</h3>" +
        "<ul>" +
        "<li><b>Google Maps</b> 保存公寓、会场、餐厅、T4。下载离线地图，并给关键路线截图。离线地图没有公共交通的实时导航，不能代替流量。</li>" +
        "<li><b>Google Translate</b> 下载西班牙语、中文和要用的英语包，试一次菜单拍照。</li>" +
        "<li><b>ESMO Events</b> 收藏 193P、AI 关键词和会场地图。</li>" +
        "<li><b>Cabify 或 Uber</b> 至少一个完成验证、绑卡，并能看到报价。</li>" +
        "<li><b>Emirates</b> 加入预订，核对航班，保存登机信息。</li>" +
        "<li><b>WhatsApp</b> 房东或商务要用再装，用中国号码验证。</li>" +
        "<li><b>Mi Vodafone Prepago</b> 买了 Vodafone 之后再用来查余额。</li>" +
        "</ul>" +
        '<p><a href="' + LINK.mapsOffline + '" target="_blank" rel="noopener">离线地图的限制</a> · <a href="' + LINK.esmoApp + '" target="_blank" rel="noopener">ESMO Events</a></p>' +
        "<h3>钱、衣服、充电</h3>" +
        "<ul>" +
        "<li>支付优先带能在境外用的 Visa/Mastercard 实体主卡和备卡，出发前打开境外交易。三人准备 €50–100 小面额欧元。支付宝和微信只是补充。终端如果问用人民币还是欧元结算，选 EUR，并看清费用。</li>" +
        "<li>衣服：24 日 06:00 马德里 Retiro 站实况 8.4°C，降水 0.0 mm。外套穿在身上，另备一套商务服装。</li>" +
        "<li>充电：西班牙插座是 C/F。电脑三脚插头确认能接上。充电器看输入电压。充电宝要符合航司规定。</li>" +
        "<li>每天随身：胸牌、必要证件、手机、充电宝、卡、少量现金、水、纸巾、后备小食。25 日加上海报筒和备份 PDF。</li>" +
        "</ul>" +
        '<p><a href="' + LINK.money + '" target="_blank" rel="noopener">马德里支付说明</a></p>'
    },
    {
      id: "night",
      title: "晚上和礼物",
      html:
        "<p>23 日晚餐、24 日酒会和 25 日胃癌论坛已经占了晚上。26 日晚饭后要收拾行李。轻量夜游只在还有精力时加上，不再单排一张夜间表。</p>" +
        "<ul>" +
        "<li><b>伯纳乌外观和附近吃饭</b> 离公寓近，步行大约留 10–15 分钟。可以替换某个空出来的晚上。有比赛或大活动、人很多，就跳过。进球场要另外预约。</li>" +
        "<li><b>Gran Vía</b> 只在商务活动取消或提前结束、而且第二天不用早起的时候考虑。不要排在 24 日酒会之后。</li>" +
        "<li>这次不去托莱多、塞哥维亚。有限的半天留给马德里市内。</li>" +
        "</ul>" +
        "<h3>礼物顺路买</h3>" +
        "<p>按现在的 26 日：上午普拉多，午饭 Posada，下午王宫。Plaza Mayor 今天不走。位置用谷歌地图在 2026-10-21 核对，距离是坐标之间的直线。</p>" +
        "<ul>" +
        "<li><b>普拉多馆内商店 Tienda Prado</b> 在博物馆里，Calle de Ruiz de Alarcón。看完、12:20 离开前买书签、明信片、冰箱贴。<span class=\"flag\">访客经验</span> 小红书 aprilila 把博物馆冰箱贴写进买到的东西里。</li>" +
        "<li><b>王宫东侧 Madrid Souvenirs</b> Calle de Carlos III 1，在王宫坐标东边大约 310 米，是从 Posada 走进王宫的一侧。磁贴可以看一眼。<mark>14:45 必须到优先入口，不要在这里耗。</mark></li>" +
        "<li><b>Posada 旁边 Curiosity shop</b> Calle de Latoneros 1，离餐厅大约 110 米。午饭门口的礼品店，小红书没有专门推荐这家。</li>" +
        "<li><b>公寓楼下 Casa Elias</b> Orense 18。小食、巧克力。小红书写市区超市比机场便宜。火腿、肉肠、奶酪这次仍不列入带回，食品先对海关目录。</li>" +
        "</ul>" +
        "<p>不顺路、不为它们改路线：最近的 Mercadona 在 Calle del Pintor Juan Gris 3，离公寓大约 760 米，出租车去普拉多不经过。英国宫（El Corte Inglés）和 La Chinata 专柜也不在 26 日这条线上。只有晚上改去伯纳乌外观时，官方商店在 Calle del Padre Damián 3，离公寓大约 680 米，围巾和帽子；小红书有人在球场买围巾。</p>" +
        '<p><a href="' + gsearch("Tienda Prado Calle de Ruiz de Alarcon Madrid") + '" target="_blank" rel="noopener">普拉多商店</a> · <a href="' + gsearch("Madrid Souvenirs Calle de Carlos III 1 Madrid") + '" target="_blank" rel="noopener">王宫东侧纪念品</a> · <a href="' + gsearch("Curiosity shop Calle de Latoneros 1 Madrid") + '" target="_blank" rel="noopener">Posada 旁礼品店</a> · <a href="' + gsearch("Casa Elias Calle de Orense 18 Madrid") + '" target="_blank" rel="noopener">Casa Elias</a></p>' +
        '<p><a href="https://www.xiaohongshu.com/explore/6905a7280000000007003b1f" target="_blank" rel="noopener">小红书：aprilila，马德里伴手礼</a> · <a href="' + LINK.gifts + '" target="_blank" rel="noopener">马德里旅游局礼物指南</a> · <a href="' + LINK.customs + '" target="_blank" rel="noopener">海关进境物品</a></p>'
    },
    {
      id: "safe",
      title: "安全",
      html:
        "<ul>" +
        "<li><b>西班牙紧急电话 112</b> 警察、急救、火警。护照或手机被抢，先打这个报案。</li>" +
        "<li><b>中国驻西班牙大使馆领事保护 +34 91 543 88 77</b> 人身或财产紧急时打。证件咨询不要占这条线。使馆 2024-09-04 通知：工作日非办公时间和周末，这个电话转到外交部 12308。</li>" +
        "<li><b>领侨处</b> C/Josefa Valcárcel 40, 1ª planta, 28027 Madrid。对外办公周一至周五 09:30–13:00。护照、旅行证专线 +34 91 320 61 81（工作日 09:30–11:30）。公证等 +34 91 741 47 28（工作日 15:30–17:30）。</li>" +
        "<li><b>使馆馆址</b> C/Arturo Soria 113, 28043 Madrid。总机 +34 91 519 42 42。馆址和领侨处都不在 26 日普拉多—Posada—王宫的步行路线上。</li>" +
        "</ul>" +
        "<p>邮箱：领事保护 madrid_lb@csm.mfa.gov.cn；护照 madrid_hz@csm.mfa.gov.cn。微信公众号搜「中国驻西班牙使馆」。以上电话和地址来自使馆 2026-03-17 的领事服务页，以及外交部驻外机构名录。</p>" +
        '<p><a href="tel:112">112</a> · <a href="tel:+34915438877">领事保护</a> · <a href="tel:+34915194242">使馆总机</a> · <a href="https://es.china-embassy.gov.cn/lqsw/lingshi13/" target="_blank" rel="noopener">使馆领事联系方式</a> · <a href="https://es.china-embassy.gov.cn/lqsw/lsbhhxz/202409/t20240904_11485270.htm" target="_blank" rel="noopener">领保电话转 12308</a> · <a href="https://www.112.es/" target="_blank" rel="noopener">西班牙 112</a></p>'
    },
    {
      id: "money",
      title: "三人预算",
      html:
        "<p>不含机票、住宿和注册费。商务招待如果请客，自费会更低。基础合计不含 26 日 Posada。</p>" +
        '<div class="money"><span>两位展商十次票和卡</span><b>€19.60</b><small>婷和明已买。卡 €2.50，十次票 €7.30。</small></div>' +
        '<div class="money"><span>22 日机场出租车</span><b>€33</b><small>27 日从会场去 T4 另计。</small></div>' +
        '<div class="money"><span>当地 SIM</span><b>不买</b><small>三人漫游已开通。</small></div>' +
        '<div class="money"><span>普拉多和王宫</span><b>€99</b><small>票已买。按（€15＋€18）×3 估算，实付以订单为准。</small></div>' +
        '<div class="money"><span>普通餐饮和超市</span><b>€450–630</b><small>还没扣除商务请客，也不含 Posada 这顿。</small></div>' +
        '<div class="money"><span>27 日会务存包</span><b>另计</b><small>存在会场。</small></div>' +
        '<div class="money"><span>额外市内出租车</span><b>€50–90</b><small>按需要才用。</small></div>' +
        '<div class="total"><b>基础合计大约 €650–870</b><p>27 日会场到机场的车费和会务存包另计。购物另计。</p></div>' +
        '<div class="money"><span>26 日 Posada 烤乳羊</span><b>另计</b><small>3 人大约 €135–180，4 人大约 €180–240。这是按 €45–60/人做的保守总预算。只按公开菜单把菜加起来，可能更低。饮料、面包、甜品按实际点的算。</small></div>' +
        '<p><a href="' + LINK.practical + '" target="_blank" rel="noopener">马德里实用信息</a>。紧急电话 112。</p>'
    }
  ];

  function renderSheet() {
    const root = document.getElementById("sheet");
    const places = [
      ["公寓", CLIP.apt, LINK.apt, "apt"],
      ["会场", "IFEMA · 地铁 Feria de Madrid", LINK.aptToIfema, null],
      ["23 日晚餐", CLIP.dinner, LINK.ifemaToDinner, "dinner"],
      ["24 日酒会", CLIP.rose, LINK.ifemaToRose, "rose"],
      ["25 日论坛", CLIP.gc, LINK.ifemaToGc, "gc"],
      ["机场 T4", CLIP.t4, LINK.t4, "t4"],
      ["海报", CLIP.poster, null, "poster"],
      ["Posada", "+34 91 366 18 60", LINK.posadaMap, "phone"]
    ];
    const panel = el("div", { class: "panel", role: "dialog", "aria-modal": "true", "aria-label": "地点和路线" });
    panel.append(
      el("div", { class: "handle" }),
      el("div", { class: "sheet-head" },
        el("h2", null, "地点和路线"),
        el("button", { type: "button", class: "go", "data-action": "close-sheet" }, "关闭")
      )
    );
    places.forEach(function (p) {
      const meta = el("div", { class: "meta" }, el("b", null, p[0]), el("span", null, p[1]));
      const row = el("div", { class: "sheet-row" }, meta);
      if (p[2]) row.append(ext(p[2], "导航"));
      if (p[3]) row.append(el("button", { type: "button", class: "go", "data-clip": p[3] }, "复制"));
      panel.append(row);
    });
    panel.append(el("h2", null, "常用导航"));
    [
      ["公寓 → 会场", "55–60 分钟", LINK.aptToIfema],
      ["会场 → 公寓", "回程 8 号线", LINK.ifemaBack],
      ["会场 → 晚餐", "23 日", LINK.ifemaToDinner],
      ["会场 → 酒会", "24 日免费 Uber，17:00 从 1108", LINK.ifemaToRose],
      ["酒会 → 公寓", "结束后重开导航", LINK.roseToApt],
      ["会场 → 论坛", "25 日约 10 分钟车程", LINK.ifemaToGc],
      ["论坛 → 公寓", "20:00 后", LINK.gcToApt],
      ["公寓 → 普拉多", "26 日约 16 分钟车程", LINK.aptToPrado],
      ["普拉多 → Posada", "约 1.7 公里", LINK.pradoToPosada],
      ["Posada → 王宫", "约 1.4 公里", LINK.posadaToPalace]
    ].forEach(function (r) {
      panel.append(el("div", { class: "sheet-row" },
        el("div", { class: "meta" }, el("b", null, r[0]), el("span", null, r[1])),
        ext(r[2], "打开")
      ));
    });
    panel.append(el("p", null, el("a", { href: "tel:112" }, "紧急电话 112")));
    panel.append(el("button", { type: "button", class: "go", "data-action": "close-sheet" }, "关闭"));
    const scrim = el("button", { type: "button", class: "scrim", "data-action": "close-sheet", "aria-label": "关闭" });
    root.replaceChildren(scrim, panel);
    root.hidden = false;
    document.documentElement.classList.add("lock");
    state.sheet = true;
  }

  function closeSheet() {
    const root = document.getElementById("sheet");
    root.hidden = true;
    root.replaceChildren();
    document.documentElement.classList.remove("lock");
    state.sheet = false;
  }

  function shiftDay(dir) {
    const i = DAYS.findIndex(function (d) { return d.id === state.day; });
    const n = i + dir;
    if (n < 0 || n >= DAYS.length) return;
    state.day = DAYS[n].id;
    state.tab = "plan";
    try { sessionStorage.setItem("esmo-day", state.day); } catch (e) {}
    renderAll();
  }

  function onClick(e) {
    const t = e.target.closest("[data-action], [data-tab], [data-day], [data-check], [data-filter], [data-clip], [data-party], [data-move]");
    if (!t) return;
    if (t.closest("#sheet") && t.tagName === "A") return;

    if (t.hasAttribute("data-check")) {
      const id = t.getAttribute("data-check");
      if (checks.has(id)) checks.delete(id);
      else checks.add(id);
      saveChecks();
      const y = window.scrollY;
      renderHeader();
      renderTabs();
      renderMain();
      measure();
      window.scrollTo(0, y);
      return;
    }
    if (t.hasAttribute("data-filter")) {
      state.filter = t.getAttribute("data-filter");
      renderMain();
      return;
    }
    if (t.hasAttribute("data-party")) {
      state.party = t.getAttribute("data-party");
      syncPicks();
      return;
    }
    if (t.hasAttribute("data-move")) {
      state.move = t.getAttribute("data-move");
      syncPicks();
      return;
    }
    if (t.hasAttribute("data-clip")) {
      copyText(CLIP[t.getAttribute("data-clip")] || "");
      return;
    }
    if (t.hasAttribute("data-day") && !t.hasAttribute("data-action")) {
      state.day = t.getAttribute("data-day");
      state.tab = "plan";
      try { sessionStorage.setItem("esmo-day", state.day); } catch (err) {}
      renderAll();
      return;
    }
    if (t.hasAttribute("data-tab") && !t.hasAttribute("data-action")) {
      state.tab = t.getAttribute("data-tab");
      try { sessionStorage.setItem("esmo-tab", state.tab); } catch (err) {}
      renderAll();
      window.scrollTo(0, 0);
      return;
    }
    const action = t.getAttribute("data-action");
    if (action === "theme") {
      applyTheme(themeNow() === "dark" ? "light" : "dark", true);
      return;
    }
    if (action === "font") {
      const i = FONTS.indexOf(fontNow());
      applyFont(FONTS[(i + 1) % FONTS.length], true);
      measure();
      return;
    }
    if (action === "sheet") {
      renderSheet();
      return;
    }
    if (action === "close-sheet") {
      closeSheet();
      return;
    }
    if (action === "copy-day") {
      const day = DAYS.filter(function (d) { return d.id === t.getAttribute("data-day"); })[0];
      if (day) copyText(dayPlain(day));
      return;
    }
    if (action === "copy-open") {
      const lines = ["马德里 ESMO 未完成"];
      CHECKS.forEach(function (c) {
        if (!checks.has(c.id)) lines.push("· " + c.title);
      });
      if (lines.length === 1) lines.push("（没有了）");
      copyText(lines.join("\n"));
      return;
    }
    if (action === "reset-checks") {
      if (!window.confirm("恢复成稿子里的初始勾选？你在这台手机上勾过的会清掉。")) return;
      localStorage.removeItem(CHECK_KEY);
      checks = new Set(PRESET);
      renderAll();
      toast("已恢复");
      return;
    }
    if (action === "jump-next") {
      const tab = t.getAttribute("data-tab");
      const day = t.getAttribute("data-day");
      const anchor = t.getAttribute("data-anchor");
      if (tab) state.tab = tab;
      if (day) state.day = day;
      state.anchor = anchor || "";
      renderAll();
    }
  }

  function tick() {
    const mad = document.getElementById("clk-mad");
    const bjEl = document.getElementById("clk-bj");
    if (mad && bjEl) {
      const c = clockParts(MAD);
      const bj = clockParts(BJ);
      mad.textContent = c.date + " " + c.time;
      bjEl.textContent = c.date === bj.date ? bj.time : bj.date + " " + bj.time;
    }
    const nextBtn = document.querySelector("#top .next");
    if (!nextBtn) return;
    const now = Date.now();
    const next = upcoming(now);
    const label = next ? next.label : "已经回到北京";
    const cur = nextBtn.querySelector("b");
    if (cur && cur.textContent !== label) renderHeader();
    else if (next) {
      const remainEl = document.getElementById("clk-remain");
      if (remainEl) remainEl.textContent = headerRemain(next.at - now);
    }
    measure();
    if (state.tab === "plan") {
      const day = DAYS.filter(function (d) { return d.id === state.day; })[0];
      const block = currentBlock(day, now);
      const shown = document.querySelector(".tl-item.is-now");
      const shownId = shown ? shown.id : "";
      const nextId = block ? block.id : "";
      if (shownId !== nextId) renderMain();
    }
  }

  function todayId(now) {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: MAD,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    const parts = {};
    fmt.formatToParts(new Date(now)).forEach(function (p) {
      if (p.type !== "literal") parts[p.type] = p.value;
    });
    const y = Number(parts.year);
    const mo = Number(parts.month);
    const d = Number(parts.day);
    if (y < 2026 || (y === 2026 && mo < 10) || (y === 2026 && mo === 10 && d < 22)) return "d22";
    if (y > 2026 || (y === 2026 && mo > 10) || (y === 2026 && mo === 10 && d > 28)) return "d28";
    return "d" + d;
  }

  function readStart() {
    const h = (location.hash || "").replace("#", "");
    if (h === "list" || h === "book") {
      state.tab = h;
      return;
    }
    if (/^b2[2-8]-/.test(h)) {
      state.tab = "plan";
      state.day = "d" + h.slice(1, 3);
      state.anchor = h;
      landedBlock = h;
      return;
    }
    state.tab = "plan";
    state.day = todayId(Date.now());
  }

  function init() {
    readStart();
    if (!localStorage.getItem(THEME_KEY)) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const follow = function () {
        if (!localStorage.getItem(THEME_KEY)) applyTheme(mq.matches ? "dark" : "light", false);
      };
      if (mq.addEventListener) mq.addEventListener("change", follow);
    }
    document.body.addEventListener("click", onClick);
    document.body.addEventListener("input", function (e) {
      if (e.target.id === "q") {
        state.query = e.target.value;
        applyQuery();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.sheet) closeSheet();
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      if (state.tab !== "plan") return;
      if (e.key === "ArrowRight") shiftDay(1);
      if (e.key === "ArrowLeft") shiftDay(-1);
    });
    const main = document.getElementById("main");
    main.addEventListener("touchstart", function (e) {
      const p = e.changedTouches[0];
      touch = { x: p.clientX, y: p.clientY, target: e.target };
    }, { passive: true });
    main.addEventListener("touchend", function (e) {
      if (!touch || state.tab !== "plan" || state.sheet) return;
      const p = e.changedTouches[0];
      const dx = p.clientX - touch.x;
      const dy = p.clientY - touch.y;
      const startedOnScroll = touch.target.closest && touch.target.closest(".day-chips, a, button, input");
      touch = null;
      if (startedOnScroll) return;
      if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
      shiftDay(dx < 0 ? 1 : -1);
    }, { passive: true });
    renderAll();
    setInterval(tick, 15000);
    window.addEventListener("resize", measure);
  }

  try {
    init();
  } catch (err) {
    const main = document.getElementById("main");
    if (main) main.textContent = "页面没有载入成功：" + (err && err.message ? err.message : err);
    console.error(err);
  }
})();
