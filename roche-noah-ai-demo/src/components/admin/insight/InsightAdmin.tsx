import { useMemo, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  BarChart3,
  ChevronRight,
  Database,
  Download,
  FileText,
  Filter,
  Flame,
  Layers3,
  Search,
  Sparkles,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  departmentRank,
  featureRank,
  hourlyPreference,
  hotspots,
  outputTypes,
  provinceRank,
  reportModules,
  researchTypes,
  timeline,
  topicTrend,
  trend,
  users,
  type FeatureDetail,
  type Hotspot,
  type InsightTab,
  type NamedValue,
  type UserRecord,
} from "./mock";

const colors = ["#14b8a6", "#22c55e", "#84cc16", "#f59e0b", "#38bdf8", "#a78bfa", "#fb7185"];

const tabs: Array<{ id: InsightTab; label: string; icon: LucideIcon; desc: string }> = [
  { id: "overview", label: "平台总览", icon: BarChart3, desc: "活跃、趋势、排行" },
  { id: "users", label: "用户画像", icon: Users, desc: "列表、详情、时间线" },
  { id: "hotspots", label: "科研热点", icon: Flame, desc: "关键词与主题下钻" },
  { id: "reports", label: "报告生成", icon: FileText, desc: "预览、导出、复盘" },
];

type Filters = {
  role: string;
  accountType: string;
  department: string;
  province: string;
};

const initialFilters: Filters = {
  role: "全部",
  accountType: "全部",
  department: "全部",
  province: "全部",
};

function unique(values: string[]) {
  return ["全部", ...Array.from(new Set(values)).filter(Boolean)];
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

export function InsightAdmin() {
  const [activeTab, setActiveTab] = useState<InsightTab>("overview");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [selectedUserId, setSelectedUserId] = useState(users[0].id);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<FeatureDetail | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<{ type: string; name: string; value: number } | null>(null);
  const [search, setSearch] = useState("");

  const filterOptions = useMemo(
    () => ({
      role: unique(users.map((user) => user.role)),
      accountType: unique(users.map((user) => user.accountType)),
      department: unique(users.map((user) => user.department)),
      province: unique(users.map((user) => user.province)),
    }),
    []
  );

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchedFilters =
        (filters.role === "全部" || user.role === filters.role) &&
        (filters.accountType === "全部" || user.accountType === filters.accountType) &&
        (filters.department === "全部" || user.department === filters.department) &&
        (filters.province === "全部" || user.province === filters.province);
      const keyword = search.trim().toLowerCase();
      const matchedSearch = !keyword || `${user.name}${user.userName}${user.department}${user.province}`.toLowerCase().includes(keyword);
      return matchedFilters && matchedSearch;
    });
  }, [filters, search]);

  const selectedUser = users.find((user) => user.id === selectedUserId) || users[0];
  const activeUsers = filteredUsers.length;
  const totalActions = filteredUsers.reduce((sum, user) => sum + user.actionCount, 0);
  const avgActions = activeUsers ? Math.round(totalActions / activeUsers) : 0;

  const selectDrilldown = (key: keyof Filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setActiveTab("overview");
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-100 text-slate-900">
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <Layers3 size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Insight Admin</div>
              <div className="text-xs text-slate-500">React-Admin 风格原型</div>
            </div>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Resources</div>
          <div className="space-y-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    isActive ? "bg-teal-50 text-teal-800 ring-1 ring-teal-100" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={18} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{tab.label}</span>
                    <span className="block truncate text-xs opacity-70">{tab.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-auto border-t border-slate-100 p-4">
          <SourceStatus />
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <TopBar />
        <div className="mx-auto max-w-7xl space-y-5 p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                管理后台 <ChevronRight size={14} /> Insight <ChevronRight size={14} /> {tabs.find((tab) => tab.id === activeTab)?.label}
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">科研洞见分析</h1>
            </div>
            <div className="flex flex-wrap gap-2 lg:hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${activeTab === tab.id ? "bg-teal-600 text-white" : "bg-white text-slate-600"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <FilterBar filters={filters} options={filterOptions} onChange={setFilters} onReset={() => setFilters(initialFilters)} />

          {activeTab === "overview" && (
            <OverviewPage
              activeUsers={activeUsers}
              totalActions={totalActions}
              avgActions={avgActions}
              filteredUsers={filteredUsers}
              onOpenUser={(id) => {
                setSelectedUserId(id);
                setActiveTab("users");
              }}
              onDrilldown={selectDrilldown}
              onSelectFeature={setSelectedFeature}
              onSelectSegment={setSelectedSegment}
            />
          )}
          {activeTab === "users" && (
            <UsersPage
              users={filteredUsers}
              selectedUser={selectedUser}
              search={search}
              setSearch={setSearch}
              onSelectUser={setSelectedUserId}
            />
          )}
          {activeTab === "hotspots" && <HotspotsPage onSelectHotspot={setSelectedHotspot} onDrilldown={selectDrilldown} onSelectSegment={setSelectedSegment} />}
          {activeTab === "reports" && <ReportsPage filters={filters} activeUsers={activeUsers} totalActions={totalActions} />}
        </div>
      </main>

      {selectedSegment && <SegmentDrawer segment={selectedSegment} onClose={() => setSelectedSegment(null)} onOpenUser={(id) => { setSelectedUserId(id); setActiveTab("users"); setSelectedSegment(null); }} />}
      {selectedFeature && <FeatureDrawer feature={selectedFeature} onClose={() => setSelectedFeature(null)} onOpenUser={(id) => { setSelectedUserId(id); setActiveTab("users"); setSelectedFeature(null); }} />}
      {selectedHotspot && <HotspotDrawer hotspot={selectedHotspot} onClose={() => setSelectedHotspot(null)} onOpenUser={(id) => { setSelectedUserId(id); setActiveTab("users"); setSelectedHotspot(null); }} />}
    </div>
  );
}

function TopBar() {
  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">Insight Service Mock</div>
          <div className="hidden text-xs text-slate-500 md:block">Phase 1 Excel样本 + Phase 2 PostHog事件模拟</div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="h-8 w-8 rounded-full bg-slate-900 text-center text-xs font-bold leading-8 text-white">A</div>
          管理员
        </div>
      </div>
    </div>
  );
}

function SourceStatus() {
  const rows = [
    { label: "Business DB", value: "Phase 1 可用", tone: "text-emerald-700 bg-emerald-50" },
    { label: "PostHog Events", value: "Phase 2 Mock", tone: "text-amber-700 bg-amber-50" },
    { label: "Insight Service", value: "聚合接口", tone: "text-sky-700 bg-sky-50" },
  ];
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800"><Database size={16} /> 数据链路</div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-500">{row.label}</span>
            <span className={`rounded-full px-2 py-0.5 font-semibold ${row.tone}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterBar({ filters, options, onChange, onReset }: { filters: Filters; options: Record<keyof Filters, string[]>; onChange: (filters: Filters) => void; onReset: () => void }) {
  const configs: Array<{ key: keyof Filters; label: string }> = [
    { key: "role", label: "用户身份" },
    { key: "accountType", label: "账号类型" },
    { key: "department", label: "部门" },
    { key: "province", label: "省份" },
  ];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Filter size={16} /> 分析范围</div>
        <button type="button" onClick={onReset} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50">重置</button>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">日期范围</label>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">2026-02-22 至 2026-03-24</div>
        </div>
        {configs.map((config) => (
          <label key={config.key} className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">{config.label}</span>
            <select
              value={filters[config.key]}
              onChange={(event) => onChange({ ...filters, [config.key]: event.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            >
              {options[config.key].map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        ))}
      </div>
    </section>
  );
}

function OverviewPage({ activeUsers, totalActions, avgActions, filteredUsers, onOpenUser, onDrilldown, onSelectFeature, onSelectSegment }: { activeUsers: number; totalActions: number; avgActions: number; filteredUsers: UserRecord[]; onOpenUser: (id: string) => void; onDrilldown: (key: keyof Filters, value: string) => void; onSelectFeature: (f: FeatureDetail) => void; onSelectSegment: (s: { type: string; name: string; value: number }) => void; }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="活跃用户" value={activeUsers} helper="当前筛选范围" icon={Users} />
        <KpiCard label="总使用次数" value={totalActions} helper="来自操作明细聚合" icon={Activity} />
        <KpiCard label="人均使用次数" value={avgActions} helper="总次数 / 活跃用户" icon={UserRound} />
        <KpiCard label="峰值日期" value="03-10" helper="使用量 1,980" icon={BarChart3} />
        <KpiCard label="高峰时段" value="15:00" helper="下午与晚间双峰" icon={Sparkles} />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <ChartCard title="使用趋势与活跃用户" subtitle="支持 day/week/month 切换的接口形态，本原型展示日粒度">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend}>
              <defs><linearGradient id="usage" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#14b8a6" stopOpacity={0.35} /><stop offset="95%" stopColor="#14b8a6" stopOpacity={0.02} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="usage" name="使用次数" stroke="#14b8a6" fill="url(#usage)" strokeWidth={2} />
              <Line type="monotone" dataKey="activeUsers" name="活跃用户" stroke="#f59e0b" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <TopUsersTable users={filteredUsers} onOpenUser={onOpenUser} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <SimpleBarChart title="功能使用排行" data={featureRank} onClick={(data) => onSelectFeature(data.payload as FeatureDetail)} />
        <ChartCard title="小时级时段偏好" subtitle="识别运营触达与内容推送时机">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hourlyPreference}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" name="使用次数" radius={[8, 8, 0, 0]} fill="#14b8a6" onClick={(data) => onSelectSegment({ type: "hour", name: data.hour + "点", value: typeof data.value === "number" ? data.value : 0 })} style={{ cursor: "pointer" }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <DistributionList title="部门分布" data={departmentRank} onClick={(item) => onSelectSegment({ type: "department", name: item.name, value: item.value })} />
        <DistributionList title="省份分布" data={provinceRank} onClick={(item) => onSelectSegment({ type: "province", name: item.name, value: item.value })} />
      </div>
    </div>
  );
}

function UsersPage({ users, selectedUser, search, setSearch, onSelectUser }: { users: UserRecord[]; selectedUser: UserRecord; search: string; setSearch: (value: string) => void; onSelectUser: (id: string) => void }) {
  const featureMix: NamedValue[] = [
    { name: selectedUser.topFeature, value: 46 },
    { name: "文献解读", value: 24 },
    { name: "大模型问答", value: 18 },
    { name: "其他", value: 12 },
  ];
  const userTrend = trend.map((point, index) => ({ date: point.date, value: Math.max(8, Math.round(selectedUser.actionCount / 12 + index * 3 - (index % 2) * 8)) }));
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.4fr)]">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="font-semibold text-slate-900">用户资源列表</h2><p className="text-xs text-slate-500">模拟 React-Admin List + Filter</p></div>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">{users.length} users</span>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索姓名、用户名、部门" className="w-full bg-transparent text-sm outline-none" />
          </div>
        </div>
        <div className="max-h-[620px] overflow-y-auto p-2">
          {users.map((user) => (
            <button key={user.id} type="button" onClick={() => onSelectUser(user.id)} className={`mb-2 w-full rounded-xl border p-3 text-left transition ${selectedUser.id === user.id ? "border-teal-200 bg-teal-50" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}>
              <div className="flex items-start justify-between gap-3"><div className="font-semibold text-slate-900">{user.name}</div><span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500">{user.actionCount}</span></div>
              <div className="mt-1 text-xs text-slate-500">{user.role} · {user.accountType} · {user.department}</div>
              <div className="mt-2 text-xs text-slate-400">最近活跃：{user.lastActive}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">{selectedUser.name.slice(0, 1)}</div>
              <div><h2 className="text-xl font-semibold text-slate-950">{selectedUser.name}</h2><p className="text-sm text-slate-500">{selectedUser.userName}</p></div>
            </div>
            <PhaseTag label="Phase 1 来自业务DB/Excel样本" />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Meta label="身份" value={selectedUser.role} /><Meta label="账号类型" value={selectedUser.accountType} /><Meta label="部门" value={selectedUser.department} />
            <Meta label="省份" value={selectedUser.province} /><Meta label="负责同事" value={selectedUser.owner} /><Meta label="最近活跃" value={selectedUser.lastActive} />
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <ChartCard title="功能使用占比" subtitle="最常用功能与模块偏好">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={featureMix} dataKey="value" nameKey="name" innerRadius={54} outerRadius={88} paddingAngle={4}>{featureMix.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}</Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="功能使用趋势" subtitle="近30天行为强度变化">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userTrend}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="date" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="value" name="使用次数" stroke="#14b8a6" strokeWidth={2} /></LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-800"><Sparkles size={16} /> 规则摘要</div>
          <p className="text-sm leading-7 text-slate-700">近30天主要关注 {selectedUser.department} 相关方向，重点使用 {selectedUser.topFeature} 与文献解读功能，活跃时间集中在下午15点前后。科研兴趣字段将在 PostHog 的 literature_search 与 content_generated 事件接入后自动补全。</p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">科研兴趣</h3><PhaseTag label="Phase 2 PostHog" /></div><div className="flex flex-wrap gap-2">{hotspots.slice(0, 5).map((item) => <span key={item.name} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{item.name}</span>)}</div></section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="mb-4 font-semibold">近期行为时间线</h3><div className="space-y-3">{timeline.map((item) => <div key={`${item.time}-${item.feature}`} className="border-l-2 border-teal-200 pl-3"><div className="text-sm font-semibold text-slate-800">{item.feature}</div><div className="text-xs text-slate-500">{item.detail} · {item.time}</div></div>)}</div></section>
        </div>
      </section>
    </div>
  );
}

function HotspotsPage({ onSelectHotspot, onDrilldown, onSelectSegment }: { onSelectHotspot: (hotspot: Hotspot) => void; onDrilldown: (key: keyof Filters, value: string) => void; onSelectSegment: (s: { type: string; name: string; value: number }) => void; }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <DistributionList title="Phase 1：部门近似疾病领域" data={departmentRank} onClick={(item) => onSelectSegment({ type: "department", name: item.name, value: item.value })} />
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold text-slate-900">Phase 2：高频关键词</h2><p className="text-xs text-slate-500">模拟 PostHog literature_search.keyword</p></div><PhaseTag label="PostHog 接入后生效" /></div>
          <div className="flex flex-wrap gap-2">
            {hotspots.map((item) => <button key={item.name} type="button" onClick={() => onSelectHotspot(item)} className="rounded-full border border-teal-100 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100">{item.name} <span className="ml-1 text-xs opacity-70">{item.value}</span></button>)}
          </div>
        </section>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <SimpleBarChart title="研究类型分布" data={researchTypes} onClick={(data) => onSelectSegment({ type: "research", name: data.payload.name, value: data.payload.value })} />
        <SimpleBarChart title="输出内容方向" data={outputTypes} onClick={(data) => onSelectSegment({ type: "output", name: data.payload.name, value: data.payload.value })} />
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-2 font-semibold text-slate-900">接口映射</h2><div className="space-y-2 text-sm text-slate-600"><CodeLine text="GET /insight/research-hotspots" /><CodeLine text="GET /insight/hotspots/trend" /><CodeLine text="GET /insight/hotspots/:topic/users" /></div></section>
      </div>
      <ChartCard title="热点变化趋势" subtitle="判断短期波动热点与持续关注方向">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={topicTrend}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="肺癌免疫治疗" stroke="#14b8a6" strokeWidth={2} /><Line type="monotone" dataKey="肝癌一线治疗" stroke="#f59e0b" strokeWidth={2} /><Line type="monotone" dataKey="真实世界研究" stroke="#38bdf8" strokeWidth={2} /></LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ReportsPage({ filters, activeUsers, totalActions }: { filters: Filters; activeUsers: number; totalActions: number }) {
  const [selectedModules, setSelectedModules] = useState(reportModules.slice(0, 3));
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");

  const toggleModule = (module: string) => {
    setSelectedModules((current) => current.includes(module) ? current.filter((item) => item !== module) : [...current, module]);
  };

  const generate = () => {
    setStatus("generating");
    window.setTimeout(() => setStatus("done"), 1200);
  };

  const downloadCsv = () => {
    const rows = [["指标", "值"], ["活跃用户", String(activeUsers)], ["总使用次数", String(totalActions)], ["报告模块", selectedModules.join(";")]];
    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "insight-report-preview.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">生成数据分析报告</h2><p className="mt-1 text-sm text-slate-500">演示“筛选范围—预览—生成—下载”的闭环。</p>
        <div className="mt-5 space-y-4">
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><div className="mb-2 font-semibold text-slate-800">当前筛选条件</div>{Object.entries(filters).map(([key, value]) => <div key={key} className="flex justify-between border-t border-slate-200 py-2"><span>{key}</span><span className="font-medium text-slate-900">{value}</span></div>)}</div>
          <div><div className="mb-2 text-sm font-semibold text-slate-800">报告范围</div><div className="space-y-2">{reportModules.map((module) => <label key={module} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"><input type="checkbox" checked={selectedModules.includes(module)} onChange={() => toggleModule(module)} />{module}</label>)}</div></div>
          <button type="button" onClick={generate} className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">生成报告预览</button>
          {status === "generating" && <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-2/3 animate-pulse rounded-full bg-teal-500" /></div>}
          <button type="button" disabled={status !== "done"} onClick={downloadCsv} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"><Download size={16} /> 下载 CSV 示例</button>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-slate-900">报告预览</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">PDF/Excel MVP</span></div>
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Insight Report</div><h3 className="mt-2 text-2xl font-semibold text-slate-950">平台科研洞见阶段性分析</h3><p className="mt-2 text-sm leading-6 text-slate-600">当前范围内共有 {activeUsers} 名活跃用户，累计 {formatNumber(totalActions)} 次行为。功能使用集中于文献解读、大模型问答和 PubMed 检索，科研热点将在 PostHog 埋点补齐后从关键词、疾病领域和内容生成方向自动归纳。</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3"><KpiMini label="活跃用户" value={activeUsers} /><KpiMini label="总使用次数" value={totalActions} /><KpiMini label="包含模块" value={selectedModules.length} /></div>
          <div className="mt-5 space-y-2">{selectedModules.map((module) => <div key={module} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">{module}</div>)}</div>
        </div>
      </section>
    </div>
  );
}

function FeatureDrawer({ feature, onClose, onOpenUser }: { feature: FeatureDetail; onClose: () => void; onOpenUser: (id: string) => void }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/20" onClick={onClose}>
      <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-teal-700">功能详情下钻</div>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">{feature.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-full border border-slate-200 px-3 py-1 text-sm">关闭</button>
        </div>
        
        <div className="mt-5 grid grid-cols-2 gap-3">
          <KpiMini label="总使用次数" value={feature.value} />
          <KpiMini label="细分操作类别" value={feature.details.length} />
        </div>

        <div className="mt-5">
          <ChartCard title="操作详情分布">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={feature.details} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2}>
                  {feature.details.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap gap-2">
               {feature.details.map((d, i) => <div key={d.name} className="text-xs text-slate-600 flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{backgroundColor: colors[i % colors.length]}}></div>{d.name}: {d.value}</div>)}
            </div>
          </ChartCard>
        </div>

        <div className="mt-5">
          <ChartCard title="该功能使用趋势">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={feature.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="usage" name="使用次数" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="mt-5">
          <h3 className="font-semibold mb-3">经常使用该功能的用户</h3>
          <div className="space-y-2">
            {users.slice(0, 4).map((user) => (
              <button key={user.id} type="button" onClick={() => onOpenUser(user.id)} className="w-full rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50">
                <div className="font-semibold text-slate-900">{user.name}</div>
                <div className="text-xs text-slate-500">{user.department} · {user.province}</div>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function HotspotDrawer({ hotspot, onClose, onOpenUser }: { hotspot: Hotspot; onClose: () => void; onOpenUser: (id: string) => void }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/20" onClick={onClose}>
      <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-3"><div><div className="text-xs font-semibold text-teal-700">主题下钻</div><h2 className="mt-1 text-xl font-semibold text-slate-950">{hotspot.name}</h2></div><button onClick={onClose} className="rounded-full border border-slate-200 px-3 py-1 text-sm">关闭</button></div>
        <div className="mt-5 rounded-2xl bg-teal-50 p-4 text-sm text-teal-900">该面板模拟 `/insight/hotspots/:topic/users`，展示关注该主题的用户、地区和部门分布。</div>
        <div className="mt-5 space-y-2">{users.slice(0, 5).map((user) => <button key={user.id} type="button" onClick={() => onOpenUser(user.id)} className="w-full rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50"><div className="font-semibold text-slate-900">{user.name}</div><div className="text-xs text-slate-500">{user.department} · {user.province} · {user.actionCount}次</div></button>)}</div>
      </aside>
    </div>
  );
}

function KpiCard({ label, value, helper, icon: Icon }: { label: string; value: number | string; helper: string; icon: LucideIcon }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><div className="text-sm font-medium text-slate-500">{label}</div><Icon size={18} className="text-teal-600" /></div><div className="mt-3 text-2xl font-semibold text-slate-950">{typeof value === "number" ? formatNumber(value) : value}</div><div className="mt-1 text-xs text-slate-400">{helper}</div></div>;
}

function KpiMini({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-xl bg-white p-3 shadow-sm"><div className="text-xs text-slate-500">{label}</div><div className="mt-1 text-lg font-semibold text-slate-950">{typeof value === "number" ? formatNumber(value) : value}</div></div>;
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4"><h2 className="font-semibold text-slate-900">{title}</h2>{subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}</div>{children}</section>;
}

function TopUsersTable({ users, onOpenUser }: { users: UserRecord[]; onOpenUser: (id: string) => void }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 font-semibold text-slate-900">活跃用户排行榜</h2><div className="space-y-2">{users.slice(0, 6).map((user, index) => <button key={user.id} type="button" onClick={() => onOpenUser(user.id)} className="flex w-full items-center gap-3 rounded-xl border border-slate-100 px-3 py-2 text-left hover:bg-slate-50"><span className="w-6 text-sm font-bold text-teal-700">{index + 1}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-800">{user.name}</span><span className="block truncate text-xs text-slate-500">{user.department} · {user.province}</span></span><span className="text-sm font-semibold text-slate-900">{user.actionCount}</span></button>)}</div></section>;
}

function SimpleBarChart({ title, data, onClick }: { title: string; data: any[]; onClick?: (data: any) => void }) {
  return <ChartCard title={title}><ResponsiveContainer width="100%" height={260}><BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis type="number" tick={{ fontSize: 12 }} /><YAxis type="category" dataKey="name" width={92} tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="value" fill="#14b8a6" radius={[0, 8, 8, 0]} onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }} /></BarChart></ResponsiveContainer></ChartCard>;
}

function DistributionList({ title, data, onClick }: { title: string; data: NamedValue[]; onClick: (item: NamedValue) => void }) {
  const max = Math.max(...data.map((item) => item.value));
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 font-semibold text-slate-900">{title}</h2><div className="space-y-3">{data.map((item) => <button key={item.name} type="button" onClick={() => onClick(item)} className="w-full text-left"><div className="mb-1 flex justify-between text-sm"><span className="font-medium text-slate-700">{item.name}</span><span className="text-slate-500">{formatNumber(item.value)}</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500" style={{ width: `${Math.max(8, (item.value / max) * 100)}%` }} /></div></button>)}</div></section>;
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">{label}</div><div className="mt-1 truncate text-sm font-semibold text-slate-900">{value}</div></div>;
}

function PhaseTag({ label }: { label: string }) {
  return <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{label}</span>;
}

function CodeLine({ text }: { text: string }) {
  return <code className="block rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-100">{text}</code>;
}

function SegmentDrawer({ segment, onClose, onOpenUser }: { segment: { type: string; name: string; value: number }; onClose: () => void; onOpenUser: (id: string) => void }) {
  let matchedUsers = users;
  if (segment.type === "department") matchedUsers = users.filter(u => u.department === segment.name);
  else if (segment.type === "province") matchedUsers = users.filter(u => u.province === segment.name);
  else matchedUsers = users.slice(0, 7); // Mock for others

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/20" onClick={onClose}>
      <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-teal-700">维度下钻：{segment.type === "department" ? "部门" : segment.type === "province" ? "省份" : segment.type === "hour" ? "活跃时段" : "特征属性"}</div>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">{segment.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-full border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50 transition-colors">关闭</button>
        </div>
        
        <div className="mt-5 grid grid-cols-2 gap-3">
          <KpiMini label="涉及事件数/活跃度" value={segment.value} />
          <KpiMini label="关联活跃用户数" value={matchedUsers.length} />
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">该维度下的具体用户</h3>
            <span className="text-xs text-slate-500">点击进入用户画像</span>
          </div>
          <div className="space-y-2">
            {matchedUsers.length > 0 ? matchedUsers.map((user) => (
              <button key={user.id} type="button" onClick={() => onOpenUser(user.id)} className="w-full rounded-xl border border-slate-200 p-3 text-left hover:border-teal-300 hover:bg-teal-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-slate-900">{user.name}</div>
                  <span className="text-xs font-medium text-teal-700 bg-white border border-teal-100 px-2 py-0.5 rounded-full">{user.actionCount}次操作</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">{user.role} · {user.department} · {user.province}</div>
              </button>
            )) : (
              <div className="text-sm text-slate-500 py-4 text-center bg-slate-50 rounded-xl">暂无完全匹配的用户（Mock数据有限）</div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
