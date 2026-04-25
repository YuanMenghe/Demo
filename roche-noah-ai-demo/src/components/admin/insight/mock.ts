export type InsightTab = "overview" | "users" | "hotspots" | "reports";

export type UserRecord = {
  id: string;
  name: string;
  userName: string;
  role: "客户" | "员工" | "其他";
  accountType: "PLUS账号" | "共享账号";
  department: string;
  province: string;
  salesRegion: string;
  hospitalLevel: string;
  isT100: string;
  owner: string;
  lastActive: string;
  actionCount: number;
  activeDays: number;
  topFeature: string;
};

export type TrendPoint = {
  date: string;
  usage: number;
  activeUsers: number;
};

export type NamedValue = {
  name: string;
  value: number;
};

export type Hotspot = {
  name: string;
  value: number;
  trend: "up" | "flat" | "down";
  phase: "Phase 1" | "Phase 2";
};

export type TimelineItem = {
  time: string;
  feature: string;
  detail: string;
};

export const users: UserRecord[] = [
  { id: "u001", name: "蒋妮", userName: "jiangni-lanzhoudaxuediyiyiyuan", role: "客户", accountType: "PLUS账号", department: "肝癌 GI", province: "甘肃省", salesRegion: "西区", hospitalLevel: "三甲", isT100: "是", owner: "周楠", lastActive: "2026-03-24 16:04", actionCount: 182, activeDays: 19, topFeature: "PubMed检索" },
  { id: "u002", name: "中山大学附属第三医院", userName: "zhongshandaxuefushudisanyiyuan", role: "客户", accountType: "共享账号", department: "肝癌 GI", province: "广东省", salesRegion: "南区", hospitalLevel: "三甲", isT100: "不确定", owner: "罗晓婷", lastActive: "2026-03-24 16:03", actionCount: 241, activeDays: 22, topFeature: "文献解读" },
  { id: "u003", name: "新疆医科大学附属肿瘤医院", userName: "xinjiangyikedaxuefushuzhongliuyiyuan", role: "客户", accountType: "共享账号", department: "多渠道MCE", province: "新疆维吾尔自治区", salesRegion: "西区", hospitalLevel: "三甲", isT100: "是", owner: "庞文姣", lastActive: "2026-03-24 16:04", actionCount: 156, activeDays: 16, topFeature: "大模型问答" },
  { id: "u004", name: "姚春霞", userName: "yaochunxia", role: "员工", accountType: "共享账号", department: "CE体验", province: "上海市", salesRegion: "总部", hospitalLevel: "-", isT100: "-", owner: "-", lastActive: "2026-03-24 16:03", actionCount: 129, activeDays: 20, topFeature: "医学专业问答" },
  { id: "u005", name: "北京协和医院", userName: "beijingxieheyiyuan", role: "客户", accountType: "PLUS账号", department: "血液肿瘤 HEMA", province: "北京市", salesRegion: "北区", hospitalLevel: "三甲", isT100: "是", owner: "李敏", lastActive: "2026-03-23 21:16", actionCount: 117, activeDays: 14, topFeature: "智能检索" },
  { id: "u006", name: "四川大学华西医院", userName: "huaxiyiyuan", role: "客户", accountType: "共享账号", department: "肺癌 LC", province: "四川省", salesRegion: "西区", hospitalLevel: "三甲", isT100: "是", owner: "王也", lastActive: "2026-03-22 19:48", actionCount: 103, activeDays: 13, topFeature: "文献解读" },
  { id: "u007", name: "复旦大学附属肿瘤医院", userName: "fudanzhongliuyiyuan", role: "客户", accountType: "PLUS账号", department: "乳腺癌 BC", province: "上海市", salesRegion: "东区", hospitalLevel: "三甲", isT100: "是", owner: "沈洁", lastActive: "2026-03-21 11:36", actionCount: 97, activeDays: 11, topFeature: "论文写作" },
  { id: "u008", name: "浙江大学医学院附属第一医院", userName: "zhedafuyiyuan", role: "客户", accountType: "共享账号", department: "肾病免疫 Renal&Immu", province: "浙江省", salesRegion: "东区", hospitalLevel: "三甲", isT100: "是", owner: "赵宁", lastActive: "2026-03-20 15:32", actionCount: 88, activeDays: 12, topFeature: "全文翻译" },
];

export const trend: TrendPoint[] = [
  { date: "02-22", usage: 920, activeUsers: 62 },
  { date: "02-26", usage: 1180, activeUsers: 74 },
  { date: "03-02", usage: 1410, activeUsers: 86 },
  { date: "03-06", usage: 1640, activeUsers: 98 },
  { date: "03-10", usage: 1980, activeUsers: 113 },
  { date: "03-14", usage: 1740, activeUsers: 101 },
  { date: "03-18", usage: 1880, activeUsers: 108 },
  { date: "03-22", usage: 1550, activeUsers: 91 },
  { date: "03-24", usage: 1320, activeUsers: 79 },
];

export const featureRank: NamedValue[] = [
  { name: "文献解读", value: 11420 },
  { name: "大模型问答", value: 10795 },
  { name: "PubMed检索", value: 7490 },
  { name: "医学专业问答", value: 7340 },
  { name: "智能检索", value: 5540 },
  { name: "智文妙画", value: 1650 },
  { name: "智能选题", value: 1050 },
  { name: "全文翻译", value: 850 },
];

export const departmentRank: NamedValue[] = [
  { name: "肝癌 GI", value: 10860 },
  { name: "血液肿瘤 HEMA", value: 6125 },
  { name: "肺癌 LC", value: 5300 },
  { name: "CE体验", value: 4675 },
  { name: "神经科学 NS&RD", value: 4475 },
  { name: "大客户HSA", value: 4450 },
  { name: "乳腺癌 BC", value: 4300 },
];

export const provinceRank: NamedValue[] = [
  { name: "广东省", value: 6420 },
  { name: "上海市", value: 5910 },
  { name: "北京市", value: 5480 },
  { name: "四川省", value: 4210 },
  { name: "浙江省", value: 3920 },
  { name: "甘肃省", value: 3180 },
  { name: "新疆维吾尔自治区", value: 2720 },
];

export const hourlyPreference = [
  { hour: "08", value: 260 }, { hour: "09", value: 540 }, { hour: "10", value: 780 }, { hour: "11", value: 710 },
  { hour: "12", value: 390 }, { hour: "13", value: 620 }, { hour: "14", value: 920 }, { hour: "15", value: 1040 },
  { hour: "16", value: 980 }, { hour: "17", value: 760 }, { hour: "18", value: 420 }, { hour: "19", value: 360 },
  { hour: "20", value: 510 }, { hour: "21", value: 680 }, { hour: "22", value: 470 }, { hour: "23", value: 220 },
];

export const hotspots: Hotspot[] = [
  { name: "肺癌免疫治疗", value: 1820, trend: "up", phase: "Phase 2" },
  { name: "肝癌一线治疗", value: 1560, trend: "up", phase: "Phase 2" },
  { name: "血液肿瘤靶向", value: 1210, trend: "flat", phase: "Phase 2" },
  { name: "乳腺癌HER2", value: 980, trend: "up", phase: "Phase 2" },
  { name: "真实世界研究", value: 920, trend: "flat", phase: "Phase 2" },
  { name: "Meta分析", value: 770, trend: "down", phase: "Phase 2" },
  { name: "综述写作", value: 650, trend: "flat", phase: "Phase 2" },
];

export const researchTypes: NamedValue[] = [
  { name: "临床研究", value: 36 },
  { name: "真实世界研究", value: 24 },
  { name: "Meta分析", value: 18 },
  { name: "病例报告", value: 12 },
  { name: "基础研究", value: 10 },
];

export const outputTypes: NamedValue[] = [
  { name: "综述大纲", value: 38 },
  { name: "文献摘要", value: 31 },
  { name: "研究方案", value: 18 },
  { name: "会议海报", value: 13 },
];

export const topicTrend = [
  { date: "W1", 肺癌免疫治疗: 220, 肝癌一线治疗: 180, 真实世界研究: 95 },
  { date: "W2", 肺癌免疫治疗: 260, 肝癌一线治疗: 205, 真实世界研究: 120 },
  { date: "W3", 肺癌免疫治疗: 310, 肝癌一线治疗: 260, 真实世界研究: 150 },
  { date: "W4", 肺癌免疫治疗: 360, 肝癌一线治疗: 310, 真实世界研究: 168 },
  { date: "W5", 肺癌免疫治疗: 410, 肝癌一线治疗: 330, 真实世界研究: 210 },
];

export const timeline: TimelineItem[] = [
  { time: "2026-03-24 16:04", feature: "PubMed检索", detail: "检索内容" },
  { time: "2026-03-24 16:03", feature: "文献解读", detail: "PDF上传" },
  { time: "2026-03-23 21:16", feature: "大模型问答", detail: "点击问答" },
  { time: "2026-03-22 19:48", feature: "论文写作", detail: "生成综述段落" },
  { time: "2026-03-20 15:32", feature: "智能检索", detail: "医学搜索" },
];

export const reportModules = ["平台总览", "用户画像摘要", "科研热点分析", "排行榜与行为明细"];
