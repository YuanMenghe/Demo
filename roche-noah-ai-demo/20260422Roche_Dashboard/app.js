const state = {
  raw: null,
  charts: {},
  controls: {},
  userIndex: [],
  selectedUserId: null,
  trendGranularity: "day",
  hotspotWindow: 30,
  sortMode: {
    category: "value-desc",
    department: "value-desc",
    province: "value-desc",
  },
  filters: {
    startDate: "",
    endDate: "",
    role: [],
    accountType: [],
    department: [],
    province: [],
    region: [],
    owner: [],
    category: [],
    detail: [],
    topic: [],
    themeCluster: [],
    diseaseArea: [],
  },
};

const palette = {
  primary: "#7dc78f",
  primaryDeep: "#4f9a69",
  primarySoft: "#dff3e5",
  accent: "#e7bb72",
  accentSoft: "#f6dfb3",
  ink: "#203329",
  muted: "#6f8578",
  grid: "rgba(92, 132, 103, 0.14)",
};

const dom = {
  heroSummary: document.getElementById("heroSummary"),
  heroInsight: document.getElementById("heroInsight"),
  kpiGrid: document.getElementById("kpiGrid"),
  selectedChips: document.getElementById("selectedChips"),
  startDate: document.getElementById("startDate"),
  endDate: document.getElementById("endDate"),
  resetFilters: document.getElementById("resetFilters"),
  clearUserFocus: document.getElementById("clearUserFocus"),
  topUsersTable: document.getElementById("topUsersTable"),
  recentActionsTable: document.getElementById("recentActionsTable"),
  functionRankTable: document.getElementById("functionRankTable"),
  activityTags: document.getElementById("activityTags"),
  userFocusSummary: document.getElementById("userFocusSummary"),
  userSignalBadges: document.getElementById("userSignalBadges"),
  userMetaList: document.getElementById("userMetaList"),
  userNarrative: document.getElementById("userNarrative"),
  userTimeline: document.getElementById("userTimeline"),
  similarUsers: document.getElementById("similarUsers"),
  userTotalActions: document.getElementById("userTotalActions"),
  userActiveDays: document.getElementById("userActiveDays"),
  userPeakCategory: document.getElementById("userPeakCategory"),
  userLastSeen: document.getElementById("userLastSeen"),
  userSearchInput: document.getElementById("userSearchInput"),
  userSearchSuggestions: document.getElementById("userSearchSuggestions"),
  categorySort: document.getElementById("categorySort"),
  departmentSort: document.getElementById("departmentSort"),
  provinceSort: document.getElementById("provinceSort"),
  granularityButtons: Array.from(document.querySelectorAll("[data-granularity]")),
  hotspotButtons: Array.from(document.querySelectorAll("[data-hotspot-window]")),
  generateReport: document.getElementById("generateReport"),
  downloadReport: document.getElementById("downloadReport"),
  printReport: document.getElementById("printReport"),
  reportScope: document.getElementById("reportScope"),
  reportPreview: document.getElementById("reportPreview"),
  hotspotNarratives: document.getElementById("hotspotNarratives"),
  hotspotAudienceTable: document.getElementById("hotspotAudienceTable"),
  presetButtons: Array.from(document.querySelectorAll("[data-preset]")),
  analysisContextText: document.getElementById("analysisContextText"),
  backToOverview: document.getElementById("backToOverview"),
};

const chartIds = [
  "trendChart",
  "hourChart",
  "identityChart",
  "segmentChart",
  "categoryChart",
  "detailChart",
  "hotspotTrendChart",
  "diseaseHotspotChart",
  "topicClusterChart",
  "departmentChart",
  "provinceChart",
  "userCategoryChart",
  "userTrendChart",
];

const fieldLabels = {
  role: "用户身份",
  accountType: "账号类型",
  department: "所在部门",
  province: "省份",
  region: "销售大区",
  owner: "负责同事",
  category: "功能分类",
  detail: "操作详情",
  topic: "科研主题",
  themeCluster: "主题簇",
  diseaseArea: "疾病方向",
};

const multiselectConfigs = [
  { key: "role", label: "用户身份", mountId: "roleFilterWrap", optionsKey: "roles", searchable: false },
  { key: "accountType", label: "账号类型", mountId: "accountFilterWrap", optionsKey: "accountTypes", searchable: false },
  { key: "department", label: "所在部门", mountId: "departmentFilterWrap", optionsKey: "departments", searchable: true },
  { key: "province", label: "省份", mountId: "provinceFilterWrap", optionsKey: "provinces", searchable: true },
  { key: "region", label: "销售大区", mountId: "regionFilterWrap", optionsKey: "regions", searchable: true },
  { key: "owner", label: "负责同事", mountId: "ownerFilterWrap", optionsKey: "owners", searchable: true },
  { key: "category", label: "功能分类", mountId: "categoryFilterWrap", optionsKey: "categories", searchable: true },
];

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function sortSeries(series, mode, total = 1) {
  const cloned = [...series];
  if (mode === "name-asc") {
    cloned.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
  } else {
    cloned.sort((a, b) => b.value - a.value);
  }
  return cloned.map((item) => ({ ...item, share: total ? item.value / total : 0 }));
}

function groupCount(records, keyGetter) {
  const map = new Map();
  records.forEach((record) => {
    const key = keyGetter(record);
    map.set(key, (map.get(key) || 0) + 1);
  });
  return map;
}

function toSeries(map, limit = null) {
  const sorted = [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
  return limit ? sorted.slice(0, limit) : sorted;
}

function uniqueUsers(records) {
  return new Set(records.map((record) => record.userId)).size;
}

function getWeekKey(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}

function defaultFilters() {
  const { summary } = state.raw;
  return {
    startDate: summary.startDate,
    endDate: summary.endDate,
    role: [],
    accountType: [],
    department: [],
    province: [],
    region: [],
    owner: [],
    category: [],
    detail: [],
    topic: [],
    themeCluster: [],
    diseaseArea: [],
  };
}

function applyPreset(name) {
  state.filters = defaultFilters();
  state.selectedUserId = null;
  if (name === "customer") state.filters.role = ["客户"];
  if (name === "employee") state.filters.role = ["员工"];
  if (name === "plus") state.filters.accountType = ["PLUS账号"];
  if (name === "shared") state.filters.accountType = ["共享账号"];
  if (name === "literature") state.filters.category = ["PubMed检索", "文献解读", "智能检索"];
  if (name === "generation") state.filters.category = ["论文写作", "全文润色", "AI申请书", "智文妙画"];
  syncControlsFromState();
  dom.presetButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.preset === name && name !== "all"));
  if (name === "all") dom.presetButtons.forEach((button) => button.classList.remove("is-active"));
  rerender();
}

function getAllUsersIndex() {
  const map = new Map();
  state.raw.records.forEach((record) => {
    if (!map.has(record.userId)) {
      map.set(record.userId, {
        userId: record.userId,
        name: record.name,
        department: record.department,
        role: record.role,
        province: record.province,
        region: record.region,
        owner: record.owner,
      });
    }
  });
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
}

function createMultiSelect(config) {
  const mount = document.getElementById(config.mountId);
  const container = document.createElement("div");
  container.className = "multiselect";
  container.innerHTML = `
    <span class="multiselect-label">${config.label}</span>
    <button type="button" class="multiselect-toggle">全部</button>
    <div class="multiselect-panel">
      ${config.searchable ? '<input type="text" class="multiselect-search" placeholder="搜索选项" />' : ""}
      <div class="multiselect-options"></div>
    </div>
  `;
  mount.appendChild(container);

  const control = {
    config,
    container,
    toggle: container.querySelector(".multiselect-toggle"),
    panel: container.querySelector(".multiselect-panel"),
    search: container.querySelector(".multiselect-search"),
    optionsWrap: container.querySelector(".multiselect-options"),
    options: state.raw.filters[config.optionsKey],
    renderOptions(keyword = "") {
      const selected = state.filters[config.key];
      const filtered = this.options.filter((item) => item.toLowerCase().includes(keyword.toLowerCase()));
      if (!filtered.length) {
        this.optionsWrap.innerHTML = '<div class="multiselect-empty">没有匹配项</div>';
        return;
      }
      this.optionsWrap.innerHTML = filtered
        .map(
          (option) => `
            <label class="multiselect-option">
              <input type="checkbox" value="${option}" ${selected.includes(option) ? "checked" : ""} />
              <span>${option}</span>
            </label>
          `,
        )
        .join("");
    },
    updateLabel() {
      const selected = state.filters[config.key];
      if (!selected.length) {
        this.toggle.textContent = "全部";
      } else if (selected.length === 1) {
        [this.toggle.textContent] = selected;
      } else {
        this.toggle.textContent = `已选 ${selected.length} 项`;
      }
    },
  };

  control.renderOptions();
  control.updateLabel();

  control.toggle.addEventListener("click", () => {
    const isOpen = control.container.classList.contains("is-open");
    closeAllMultiSelects();
    if (!isOpen) {
      control.container.classList.add("is-open");
      if (control.search) {
        control.search.focus();
      }
    }
  });

  if (control.search) {
    control.search.addEventListener("input", (event) => {
      control.renderOptions(event.target.value);
    });
  }

  control.optionsWrap.addEventListener("change", (event) => {
    const checkbox = event.target;
    if (!(checkbox instanceof HTMLInputElement)) return;
    const selected = new Set(state.filters[config.key]);
    if (checkbox.checked) {
      selected.add(checkbox.value);
    } else {
      selected.delete(checkbox.value);
    }
    state.filters[config.key] = [...selected];
    control.updateLabel();
    rerender();
  });

  state.controls[config.key] = control;
}

function closeAllMultiSelects() {
  Object.values(state.controls).forEach((control) => control.container.classList.remove("is-open"));
}

function syncControlsFromState() {
  dom.startDate.value = state.filters.startDate;
  dom.endDate.value = state.filters.endDate;
  Object.values(state.controls).forEach((control) => {
    control.updateLabel();
    control.renderOptions(control.search ? control.search.value : "");
  });
}

function filterRecords() {
  return state.raw.records.filter((record) => {
    if (state.filters.startDate && record.date < state.filters.startDate) return false;
    if (state.filters.endDate && record.date > state.filters.endDate) return false;
    if (state.filters.role.length && !state.filters.role.includes(record.role)) return false;
    if (state.filters.accountType.length && !state.filters.accountType.includes(record.accountType)) return false;
    if (state.filters.department.length && !state.filters.department.includes(record.department)) return false;
    if (state.filters.province.length && !state.filters.province.includes(record.province)) return false;
    if (state.filters.region.length && !state.filters.region.includes(record.region)) return false;
    if (state.filters.owner.length && !state.filters.owner.includes(record.owner)) return false;
    if (state.filters.category.length && !state.filters.category.includes(record.category)) return false;
    if (state.filters.detail.length && !state.filters.detail.includes(record.detail)) return false;
    if (state.filters.topic.length && !state.filters.topic.includes(record.researchTopic)) return false;
    if (state.filters.themeCluster.length && !state.filters.themeCluster.includes(record.themeCluster)) return false;
    if (state.filters.diseaseArea.length && !state.filters.diseaseArea.includes(record.diseaseArea)) return false;
    return true;
  });
}

function computeTrend(records) {
  const map = new Map();
  records.forEach((record) => {
    const key =
      state.trendGranularity === "week"
        ? getWeekKey(record.date)
        : state.trendGranularity === "month"
          ? record.date.slice(0, 7)
          : record.date;
    if (!map.has(key)) {
      map.set(key, { date: key, actions: 0, users: new Set() });
    }
    const item = map.get(key);
    item.actions += 1;
    item.users.add(record.userId);
  });
  return [...map.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((item) => ({ date: item.date, actions: item.actions, users: item.users.size }));
}

function classifyUsers(records) {
  const userMap = new Map();
  records.forEach((record) => {
    if (!userMap.has(record.userId)) {
      userMap.set(record.userId, {
        userId: record.userId,
        name: record.name,
        department: record.department,
        role: record.role,
        province: record.province,
        accountType: record.accountType,
        region: record.region,
        owner: record.owner,
        count: 0,
        categories: new Map(),
        byDate: new Map(),
        lastTimestamp: record.timestamp,
      });
    }
    const user = userMap.get(record.userId);
    user.count += 1;
    user.lastTimestamp = user.lastTimestamp > record.timestamp ? user.lastTimestamp : record.timestamp;
    user.categories.set(record.category, (user.categories.get(record.category) || 0) + 1);
    user.byDate.set(record.date, (user.byDate.get(record.date) || 0) + 1);
  });

  const segments = {
    "1-5次": 0,
    "6-20次": 0,
    "21-50次": 0,
    "51-100次": 0,
    "100次以上": 0,
  };

  [...userMap.values()].forEach((user) => {
    if (user.count <= 5) segments["1-5次"] += 1;
    else if (user.count <= 20) segments["6-20次"] += 1;
    else if (user.count <= 50) segments["21-50次"] += 1;
    else if (user.count <= 100) segments["51-100次"] += 1;
    else segments["100次以上"] += 1;
  });

  return { userMap, segmentSeries: Object.entries(segments).map(([name, value]) => ({ name, value })) };
}

function getFilteredMetrics(records) {
  const totalActions = records.length;
  const totalUsers = uniqueUsers(records);
  const trend = computeTrend(records);
  const hourlyMap = new Map(Array.from({ length: 24 }, (_, hour) => [hour, 0]));
  records.forEach((record) => hourlyMap.set(record.hour, (hourlyMap.get(record.hour) || 0) + 1));

  const { userMap, segmentSeries } = classifyUsers(records);
  const users = [...userMap.values()].sort((a, b) => b.count - a.count);
  const topCategories = toSeries(groupCount(records, (record) => record.category));
  const detailSeries = toSeries(groupCount(records, (record) => record.detail));
  const departmentSeries = toSeries(groupCount(records, (record) => record.department), 12);
  const provinceSeries = toSeries(groupCount(records, (record) => record.province), 12);

  const avgActionsPerUser = totalUsers ? (totalActions / totalUsers).toFixed(1) : "0.0";
  const peakPoint = trend.reduce((best, current) => (current.actions > (best?.actions || 0) ? current : best), null);
  const peakHour = [...hourlyMap.entries()].reduce((best, current) => (current[1] > best[1] ? current : best), [0, 0]);

  return {
    totalActions,
    totalUsers,
    avgActionsPerUser,
    trend,
    peakPoint,
    peakHour,
    categorySeries: sortSeries(topCategories, state.sortMode.category, totalActions).slice(0, 10),
    detailSeries: sortSeries(detailSeries, state.sortMode.category, totalActions).slice(0, 10),
    roleSeries: toSeries(groupCount(records, (record) => record.role)),
    accountSeries: toSeries(groupCount(records, (record) => record.accountType)),
    hourlySeries: [...hourlyMap.entries()].map(([hour, value]) => ({ hour, value })),
    segmentSeries,
    departmentSeries: sortSeries(departmentSeries, state.sortMode.department, totalActions),
    provinceSeries: sortSeries(provinceSeries, state.sortMode.province, totalActions),
    topUsers: users.slice(0, 12),
    recentActions: [...records].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 12),
    userMap,
  };
}

function pickUser(metrics) {
  if (state.selectedUserId && metrics.userMap.has(state.selectedUserId)) {
    return metrics.userMap.get(state.selectedUserId);
  }
  return metrics.topUsers[0] || null;
}

function buildUserProfile(records, user) {
  if (!user) return null;
  const userRecords = records.filter((record) => record.userId === user.userId);
  const categorySeries = toSeries(groupCount(userRecords, (record) => record.category), 8);
  const trend = computeTrend(userRecords);
  const lastRecord = [...userRecords].sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
  const recentRecords = [...userRecords].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 12);
  const activeDays = new Set(userRecords.map((item) => item.date)).size;
  const activeHours = toSeries(groupCount(userRecords, (record) => `${String(record.hour).padStart(2, "0")}:00`), 3);
  const intenseDay = [...groupCount(userRecords, (record) => record.date).entries()].sort((a, b) => b[1] - a[1])[0];
  const categoryDiversity = new Set(userRecords.map((item) => item.category)).size;
  const diseaseSeries = toSeries(groupCount(userRecords, (record) => record.diseaseArea), 5);
  const topicSeries = toSeries(groupCount(userRecords, (record) => record.researchTopic), 5);
  const studySeries = toSeries(groupCount(userRecords, (record) => record.studyType), 5);
  const outputSeries = toSeries(groupCount(userRecords, (record) => record.outputType), 5);
  const keywordSeries = toSeries(groupCount(userRecords, (record) => record.keywordCluster), 5);
  return {
    user,
    records: userRecords,
    categorySeries,
    trend,
    lastRecord,
    recentRecords,
    activeDays,
    activeHours,
    intenseDay,
    categoryDiversity,
    diseaseSeries,
    topicSeries,
    studySeries,
    outputSeries,
    keywordSeries,
  };
}

function computeActivityInsights(records, metrics) {
  if (!metrics.topUsers.length) return [];
  const heavy = metrics.topUsers[0];
  const users = [...metrics.userMap.values()];
  const sortedByLast = [...users].sort((a, b) => a.lastTimestamp.localeCompare(b.lastTimestamp));
  const silent = sortedByLast[0];

  let burst = users[0];
  let burstValue = 0;
  users.forEach((user) => {
    const maxDay = Math.max(...user.byDate.values());
    if (maxDay > burstValue) {
      burstValue = maxDay;
      burst = user;
    }
  });

  return [
    {
      title: "重度用户",
      text: `${heavy.name} 使用 ${formatNumber(heavy.count)} 次，当前筛选范围内最活跃，适合重点跟踪其高频功能偏好。`,
      userId: heavy.userId,
    },
    {
      title: "沉默用户",
      text: `${silent.name} 最近一次行为停留在 ${silent.lastTimestamp.slice(0, 10)}，可结合负责同事或所在部门做回访。`,
      userId: silent.userId,
    },
    {
      title: "短期爆发用户",
      text: `${burst.name} 单日最高使用 ${formatNumber(burstValue)} 次，存在集中场景或活动触发的可能。`,
      userId: burst.userId,
    },
  ];
}

function computeHotspots(records) {
  const endDate = new Date(`${state.filters.endDate}T23:59:59`);
  const start = new Date(endDate);
  start.setDate(start.getDate() - state.hotspotWindow + 1);

  const windowRecords = records.filter((record) => new Date(`${record.date}T00:00:00`) >= start);
  const topicSeries = toSeries(groupCount(windowRecords, (record) => record.researchTopic), 8);
  const diseaseSeries = toSeries(groupCount(windowRecords, (record) => record.diseaseArea), 8);
  const clusterSeries = toSeries(groupCount(windowRecords, (record) => record.themeCluster), 8);
  const outputSeries = toSeries(groupCount(windowRecords, (record) => record.outputType), 8);

  const trendBuckets = new Map();
  windowRecords.forEach((record) => {
    const key = getWeekKey(record.date);
    if (!trendBuckets.has(key)) trendBuckets.set(key, new Map());
    const bucket = trendBuckets.get(key);
    bucket.set(record.researchTopic, (bucket.get(record.researchTopic) || 0) + 1);
  });
  const topTopics = topicSeries.slice(0, 4).map((item) => item.name);
  const trendSeries = [...trendBuckets.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, bucket]) => ({ date, ...Object.fromEntries(topTopics.map((topic) => [topic, bucket.get(topic) || 0])) }));

  const audience = topicSeries.slice(0, 5).map((topic) => {
    const related = windowRecords.filter((record) => record.researchTopic === topic.name);
    const majorRole = toSeries(groupCount(related, (record) => record.role), 1)[0];
    const majorRegion = toSeries(groupCount(related, (record) => record.region), 1)[0];
    return {
      topic: topic.name,
      audience: `${majorRole ? majorRole.name : "未识别"} / ${majorRegion ? majorRegion.name : "未识别大区"}`,
      users: new Set(related.map((item) => item.userId)).size,
    };
  });

  const narratives = topicSeries.slice(0, 3).map((topic) => {
    const related = windowRecords.filter((record) => record.researchTopic === topic.name);
    const majorDept = toSeries(groupCount(related, (record) => record.department), 1)[0];
    const majorOutput = toSeries(groupCount(related, (record) => record.outputType), 1)[0];
    return `${topic.name} 在近 ${state.hotspotWindow} 天内出现 ${formatNumber(topic.value)} 次，主要集中在 ${majorDept ? majorDept.name : "未识别部门"}，常见输出方向为 ${majorOutput ? majorOutput.name : "未识别"}。`;
  });

  return { topicSeries, diseaseSeries, clusterSeries, outputSeries, trendSeries, topTopics, audience, narratives };
}

function buildReportMarkdown(metrics, profile, hotspots) {
  const selectedScopes = [...dom.reportScope.querySelectorAll("input:checked")].map((input) => input.value);
  const filterSummary = Object.entries(state.filters)
    .filter(([, value]) => (Array.isArray(value) ? value.length : value))
    .map(([key, value]) => `${fieldLabels[key] || key}: ${Array.isArray(value) ? value.join("、") : value}`)
    .join("\n");

  let output = `# Insight 分析报告\n\n`;
  output += `生成时间: ${new Date().toLocaleString("zh-CN")}\n\n`;
  output += `## 筛选条件\n${filterSummary || "当前为默认全量筛选"}\n\n`;

  if (selectedScopes.includes("overview")) {
    output += `## 平台总览\n`;
    output += `- 活跃用户: ${formatNumber(metrics.totalUsers)}\n`;
    output += `- 总使用次数: ${formatNumber(metrics.totalActions)}\n`;
    output += `- 人均使用次数: ${metrics.avgActionsPerUser}\n`;
    output += `- 峰值时间: ${metrics.peakPoint ? metrics.peakPoint.date : "-"}\n`;
    output += `- 高峰时段: ${String(metrics.peakHour[0]).padStart(2, "0")}:00\n\n`;
  }

  if (selectedScopes.includes("persona") && profile) {
    output += `## 用户画像\n`;
    output += `- 用户: ${profile.user.name} (${profile.user.userId})\n`;
    output += `- 核心功能: ${profile.categorySeries[0] ? profile.categorySeries[0].name : "暂无"}\n`;
    output += `- 最近活跃: ${profile.lastRecord.timestamp}\n`;
    output += `- 画像摘要: ${dom.userNarrative.textContent.replace(/\s+/g, " ").trim()}\n\n`;
  }

  if (selectedScopes.includes("hotspot")) {
    output += `## 科研热点\n`;
    hotspots.narratives.forEach((line) => {
      output += `- ${line}\n`;
    });
    output += "\n";
  }

  return output;
}

function renderUserSuggestions(keyword) {
  const q = keyword.trim().toLowerCase();
  if (!q) {
    dom.userSearchSuggestions.classList.remove("is-open");
    dom.userSearchSuggestions.innerHTML = "";
    return;
  }

  const suggestions = state.userIndex
    .filter((user) => user.name.toLowerCase().includes(q) || user.userId.toLowerCase().includes(q))
    .slice(0, 8);

  if (!suggestions.length) {
    dom.userSearchSuggestions.innerHTML = '<div class="user-search-empty">没有匹配到用户</div>';
    dom.userSearchSuggestions.classList.add("is-open");
    return;
  }

  dom.userSearchSuggestions.innerHTML = suggestions
    .map(
      (user) => `
        <button type="button" class="user-search-item" data-user-id="${user.userId}">
          <strong>${user.name}</strong>
          <span>${user.userId} · ${user.department} · ${user.role}</span>
        </button>
      `,
    )
    .join("");
  dom.userSearchSuggestions.classList.add("is-open");
}

function renderHero(metrics) {
  const { summary } = state.raw;
  dom.heroSummary.textContent = `当前看板覆盖 ${summary.startDate} 至 ${summary.endDate} 的使用行为。支持多选搜索筛选、图表点击联动和单用户下钻，适合快速回答“谁在用、什么时候用、最常用什么功能、哪里更活跃”。`;
  const topCategory = metrics.categorySeries[0];
  if (!topCategory) {
    dom.heroInsight.textContent = "当前筛选条件下暂无数据";
    return;
  }
  dom.heroInsight.textContent = `${topCategory.name} 当前贡献 ${formatNumber(topCategory.value)} 次，占 ${formatPercent(topCategory.share)}，是当前视角下的最强需求。`;
}

function renderKpis(metrics) {
  const peakLabel = state.trendGranularity === "week" ? "峰值周" : "峰值日期";
  const cards = [
    { label: "使用次数", value: formatNumber(metrics.totalActions), note: "当前筛选结果下的总行为量" },
    { label: "活跃用户", value: formatNumber(metrics.totalUsers), note: `人均 ${metrics.avgActionsPerUser} 次` },
    {
      label: peakLabel,
      value: metrics.peakPoint ? metrics.peakPoint.date : "-",
      note: metrics.peakPoint ? `${formatNumber(metrics.peakPoint.actions)} 次行为` : "暂无数据",
    },
    {
      label: "高峰时段",
      value: `${String(metrics.peakHour[0]).padStart(2, "0")}:00`,
      note: `${formatNumber(metrics.peakHour[1])} 次行为`,
    },
  ];

  dom.kpiGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="kpi-card">
          <div class="kpi-label">${card.label}</div>
          <div class="kpi-value">${card.value}</div>
          <div class="kpi-note">${card.note}</div>
        </article>
      `,
    )
    .join("");
}

function renderSelectedChips() {
  const chips = [];
  Object.entries(fieldLabels).forEach(([key, label]) => {
    state.filters[key].forEach((value) => chips.push({ key, label, value }));
  });
  if (state.selectedUserId) {
    const record = state.raw.records.find((item) => item.userId === state.selectedUserId);
    if (record) {
      chips.push({ key: "userFocus", label: "聚焦用户", value: `${record.name} (${record.userId})` });
    }
  }

  dom.selectedChips.innerHTML = chips
    .map(
      (chip) => `
        <span class="chip">
          ${chip.label}: ${chip.value}
          <button type="button" class="chip-remove" data-key="${chip.key}" data-value="${chip.value}">×</button>
        </span>
      `,
    )
    .join("");
}

function renderAnalysisContext(metrics, profile) {
  const fragments = [];
  if (state.filters.role.length) fragments.push(`聚焦 ${state.filters.role.join(" / ")}`);
  if (state.filters.accountType.length) fragments.push(`账号类型为 ${state.filters.accountType.join(" / ")}`);
  if (state.filters.department.length) fragments.push(`部门 ${state.filters.department.join(" / ")}`);
  if (state.filters.province.length) fragments.push(`省份 ${state.filters.province.join(" / ")}`);
  if (state.filters.region.length) fragments.push(`销售大区 ${state.filters.region.join(" / ")}`);
  if (state.filters.category.length) fragments.push(`功能 ${state.filters.category.join(" / ")}`);
  if (state.filters.topic.length) fragments.push(`科研主题 ${state.filters.topic.join(" / ")}`);
  if (state.filters.diseaseArea.length) fragments.push(`疾病方向 ${state.filters.diseaseArea.join(" / ")}`);
  if (profile?.user) fragments.push(`当前已下钻到用户 ${profile.user.name}`);

  if (!fragments.length) {
    dom.analysisContextText.textContent = `当前是默认全量平台视角，覆盖 ${formatNumber(metrics.totalUsers)} 位活跃用户与 ${formatNumber(metrics.totalActions)} 次行为。`;
    return;
  }
  dom.analysisContextText.textContent = `${fragments.join("；")}。当前结果覆盖 ${formatNumber(metrics.totalUsers)} 位活跃用户与 ${formatNumber(metrics.totalActions)} 次行为。`;
}

function renderActivityTags(insights) {
  dom.activityTags.innerHTML = insights
    .map(
      (item) => `
        <button type="button" class="activity-tag" data-user-id="${item.userId}">
          <h4>${item.title}</h4>
          <p>${item.text}</p>
        </button>
      `,
    )
    .join("");
}

function renderTable(target, rows, mapper, emptyText) {
  if (!rows.length) {
    target.innerHTML = `<tr><td colspan="4" class="empty-state">${emptyText}</td></tr>`;
    return;
  }
  target.innerHTML = rows.map(mapper).join("");
}

function renderTables(metrics) {
  renderTable(
    dom.topUsersTable,
    metrics.topUsers,
    (item) => `
      <tr data-user-id="${item.userId}" class="${state.selectedUserId === item.userId ? "is-selected" : ""}">
        <td>${item.name}</td>
        <td>${item.userId}</td>
        <td>${formatNumber(item.count)}</td>
        <td>${item.department}</td>
      </tr>
    `,
    "当前筛选条件下暂无高频用户",
  );

  renderTable(
    dom.recentActionsTable,
    metrics.recentActions,
    (item) => `
      <tr data-user-id="${item.userId}" class="${state.selectedUserId === item.userId ? "is-selected" : ""}">
        <td>${item.timestamp}</td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.detail}</td>
      </tr>
    `,
    "当前筛选条件下暂无行为记录",
  );

  renderTable(
    dom.functionRankTable,
    metrics.categorySeries,
    (item) => `
      <tr data-filter-key="category" data-filter-value="${item.name}">
        <td>${item.name}</td>
        <td>${formatNumber(item.value)}</td>
        <td>${formatPercent(item.share)}</td>
      </tr>
    `,
    "当前筛选条件下暂无功能排行",
  );
}

function renderUserProfile(profile) {
  if (!profile) {
    dom.userFocusSummary.innerHTML = "<h4>暂无用户</h4><p>当前筛选结果下没有可聚焦的用户。</p>";
    dom.userSignalBadges.innerHTML = "";
    dom.userMetaList.innerHTML = "";
    dom.userNarrative.innerHTML = "";
    dom.userTimeline.innerHTML = "";
    dom.similarUsers.innerHTML = "";
    dom.userTotalActions.textContent = "-";
    dom.userActiveDays.textContent = "-";
    dom.userPeakCategory.textContent = "-";
    dom.userLastSeen.textContent = "-";
    return;
  }

  const { user, records, lastRecord } = profile;
  const topCategory = profile.categorySeries[0];
  const dominantShare = topCategory ? topCategory.value / records.length : 0;
  const signalBadges = [];
  if (records.length >= 80) signalBadges.push("重度活跃");
  if (dominantShare >= 0.45 && topCategory) signalBadges.push(`${topCategory.name}偏好明显`);
  if (profile.categoryDiversity >= 5) signalBadges.push("功能探索较广");
  if (profile.activeDays >= 10) signalBadges.push("持续活跃");
  if (!signalBadges.length) signalBadges.push("行为相对均衡");

  dom.userFocusSummary.innerHTML = `
    <h4>${user.name}</h4>
    <p>${user.userId}</p>
    <p>当前视角下共 ${formatNumber(user.count)} 次行为，最近一次使用发生在 ${lastRecord.timestamp}。这一模块用于判断这个用户的使用深度、功能偏好和近期动作节奏。</p>
  `;
  dom.userSearchInput.value = `${user.name} (${user.userId})`;
  dom.userSearchSuggestions.classList.remove("is-open");
  dom.userSignalBadges.innerHTML = signalBadges.map((item) => `<span class="user-signal">${item}</span>`).join("");

  dom.userTotalActions.textContent = formatNumber(user.count);
  dom.userActiveDays.textContent = formatNumber(profile.activeDays);
  dom.userPeakCategory.textContent = topCategory ? topCategory.name : "暂无";
  dom.userLastSeen.textContent = lastRecord.timestamp.slice(5, 16);

  dom.userMetaList.innerHTML = `
    <div class="user-meta-item"><strong>用户身份</strong>${user.role}</div>
    <div class="user-meta-item"><strong>账号类型</strong>${user.accountType}</div>
    <div class="user-meta-item"><strong>所在部门</strong>${user.department}</div>
    <div class="user-meta-item"><strong>所在省份</strong>${user.province}</div>
    <div class="user-meta-item"><strong>销售大区</strong>${user.region}</div>
    <div class="user-meta-item"><strong>负责同事</strong>${user.owner}</div>
    <div class="user-meta-item"><strong>偏好功能</strong>${topCategory ? `${topCategory.name} (${formatNumber(topCategory.value)}次)` : "暂无"}</div>
    <div class="user-meta-item"><strong>重点疾病方向</strong>${profile.diseaseSeries[0] ? profile.diseaseSeries[0].name : "暂无"}</div>
    <div class="user-meta-item"><strong>高频研究主题</strong>${profile.topicSeries[0] ? profile.topicSeries[0].name : "暂无"}</div>
    <div class="user-meta-item"><strong>偏好研究类型</strong>${profile.studySeries[0] ? profile.studySeries[0].name : "暂无"}</div>
    <div class="user-meta-item"><strong>偏好输出内容</strong>${profile.outputSeries[0] ? profile.outputSeries[0].name : "暂无"}</div>
    <div class="user-meta-item"><strong>行为天数</strong>${formatNumber(new Set(records.map((item) => item.date)).size)} 天</div>
  `;

  const narrative = [];
  if (topCategory) {
    narrative.push(`最偏好的功能是 ${topCategory.name}，占个人总行为的 ${formatPercent(dominantShare)}。`);
  }
  if (profile.diseaseSeries[0] && profile.topicSeries[0]) {
    narrative.push(`近阶段主要关注 ${profile.diseaseSeries[0].name} 相关的 ${profile.topicSeries[0].name}。`);
  }
  if (profile.outputSeries[0] && profile.studySeries[0]) {
    narrative.push(`内容生成上更偏向 ${profile.outputSeries[0].name}，研究视角以 ${profile.studySeries[0].name} 为主。`);
  }
  if (profile.activeHours.length) {
    narrative.push(`更常出现的使用时段集中在 ${profile.activeHours.map((item) => item.name).join(" / ")}。`);
  }
  if (profile.intenseDay) {
    narrative.push(`行为最集中的一天是 ${profile.intenseDay[0]}，当天共产生 ${formatNumber(profile.intenseDay[1])} 次操作。`);
  }
  narrative.push(`当前筛选范围内涉及 ${formatNumber(profile.categoryDiversity)} 个功能分类，可用于判断是单场景深用还是多场景探索。`);
  dom.userNarrative.innerHTML = narrative.map((item) => `<div class="user-narrative-item">${item}</div>`).join("");

  dom.userTimeline.innerHTML = profile.recentRecords
    .map(
      (item) => `
        <div class="user-timeline-item" data-category="${item.category}" data-detail="${item.detail}">
          <span class="timeline-time">${item.timestamp}</span>
          <span class="timeline-title">${item.category} · ${item.detail}</span>
          <span class="timeline-meta">${item.searchQuery} · ${item.outputType} · ${item.keywordCluster}</span>
        </div>
      `,
    )
    .join("");

  const similar = state.userIndex
    .filter((item) => item.userId !== user.userId)
    .filter((item) => item.department === user.department || item.province === user.province || item.owner === user.owner)
    .slice(0, 6);
  dom.similarUsers.innerHTML = similar
    .map(
      (item) => `
        <button type="button" class="similar-user" data-user-id="${item.userId}">
          <div>
            <strong>${item.name}</strong>
            <span>${item.userId}</span>
          </div>
          <div>
            <span>${item.department}</span>
            <span>${item.province}</span>
          </div>
        </button>
      `,
    )
    .join("");
}

function renderHotspots(hotspots) {
  state.charts.diseaseHotspotChart.setOption(
    {
      ...baseChartOption(),
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          radius: ["40%", "68%"],
          center: ["50%", "50%"],
          label: { formatter: "{b}\n{d}%" },
          data: hotspots.diseaseSeries.map((item, index) => ({
            ...item,
            itemStyle: { color: [palette.primaryDeep, palette.primary, palette.accent, "#9ed6ae", "#e1c892", "#aad7b0"][index % 6] },
          })),
        },
      ],
    },
    true,
  );

  state.charts.topicClusterChart.setOption(
    {
      ...baseChartOption(),
      grid: { left: 130, right: 20, top: 20, bottom: 28 },
      xAxis: { type: "value", splitLine: { lineStyle: { color: palette.grid } }, axisLabel: { color: palette.muted } },
      yAxis: { type: "category", data: hotspots.clusterSeries.map((item) => item.name).reverse(), axisLabel: { color: palette.muted }, axisLine: { show: false }, axisTick: { show: false } },
      series: [
        {
          type: "bar",
          data: hotspots.clusterSeries.map((item, index) => ({ value: item.value, name: item.name, itemStyle: { color: index % 2 === 0 ? palette.primarySoft : palette.accentSoft, borderRadius: [0, 10, 10, 0] } })).reverse(),
          label: { show: true, position: "right", color: palette.ink },
        },
      ],
    },
    true,
  );

  state.charts.hotspotTrendChart.setOption(
    {
      ...baseChartOption(),
      legend: { top: 0, textStyle: { color: palette.muted } },
      xAxis: { type: "category", data: hotspots.trendSeries.map((item) => item.date), axisLabel: { color: palette.muted }, axisLine: { lineStyle: { color: palette.grid } } },
      yAxis: { type: "value", splitLine: { lineStyle: { color: palette.grid } }, axisLabel: { color: palette.muted } },
      series: hotspots.topTopics.map((topic, index) => ({
        name: topic,
        type: "line",
        smooth: true,
        data: hotspots.trendSeries.map((item) => item[topic]),
        symbolSize: 7,
        lineStyle: { width: 3 },
        itemStyle: { color: [palette.primaryDeep, palette.primary, palette.accent, "#8fb9a0"][index % 4] },
      })),
    },
    true,
  );

  dom.hotspotNarratives.innerHTML = hotspots.narratives.map((item) => `<div class="user-narrative-item">${item}</div>`).join("");
  renderTable(
    dom.hotspotAudienceTable,
    hotspots.audience,
    (item) => `
      <tr data-filter-key="topic" data-filter-value="${item.topic}">
        <td>${item.topic}</td>
        <td>${item.audience}</td>
        <td>${formatNumber(item.users)}</td>
      </tr>
    `,
    "当前筛选条件下暂无热点用户",
  );
}

function renderReport(metrics, profile, hotspots) {
  const markdown = buildReportMarkdown(metrics, profile, hotspots);
  dom.reportPreview.textContent = markdown;
}

function ensureCharts() {
  if (Object.keys(state.charts).length) return;
  chartIds.forEach((id) => {
    state.charts[id] = echarts.init(document.getElementById(id), null, { renderer: "canvas" });
  });
}

function baseChartOption() {
  return {
    textStyle: { color: palette.ink, fontFamily: "Segoe UI, PingFang SC, Microsoft YaHei, sans-serif" },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(32, 51, 41, 0.92)",
      borderWidth: 0,
      textStyle: { color: "#f4fff7" },
    },
    grid: { left: 52, right: 28, top: 30, bottom: 42, containLabel: false },
  };
}

function updateCharts(metrics, profile) {
  const trend = baseChartOption();
  trend.legend = { top: 0, textStyle: { color: palette.muted } };
  trend.xAxis = {
    type: "category",
    data: metrics.trend.map((item) => item.date),
    axisLine: { lineStyle: { color: palette.grid } },
    axisLabel: { color: palette.muted, rotate: 35 },
  };
  trend.yAxis = [
    {
      type: "value",
      name: "使用次数",
      splitLine: { lineStyle: { color: palette.grid } },
      axisLabel: { color: palette.muted },
    },
    {
      type: "value",
      name: "活跃用户",
      splitLine: { show: false },
      axisLabel: { color: palette.muted },
    },
  ];
  trend.series = [
    {
      name: "使用次数",
      type: "bar",
      data: metrics.trend.map((item) => item.actions),
      itemStyle: { color: palette.primarySoft, borderRadius: [8, 8, 0, 0] },
    },
    {
      name: "活跃用户",
      type: "line",
      yAxisIndex: 1,
      smooth: true,
      data: metrics.trend.map((item) => item.users),
      symbolSize: 8,
      lineStyle: { width: 3, color: palette.primaryDeep },
      itemStyle: { color: palette.primaryDeep },
      areaStyle: { color: "rgba(79, 154, 105, 0.12)" },
    },
  ];
  state.charts.trendChart.setOption(trend, true);

  state.charts.hourChart.setOption(
    {
      ...baseChartOption(),
      xAxis: {
        type: "category",
        data: metrics.hourlySeries.map((item) => `${item.hour}:00`),
        axisLabel: { color: palette.muted, interval: 1 },
        axisLine: { lineStyle: { color: palette.grid } },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: palette.grid } },
        axisLabel: { color: palette.muted },
      },
      visualMap: {
        show: false,
        min: 0,
        max: Math.max(...metrics.hourlySeries.map((item) => item.value), 1),
        inRange: { color: ["#edf7ef", "#b5dfbf", palette.primaryDeep] },
      },
      series: [{ type: "bar", barWidth: "62%", data: metrics.hourlySeries.map((item) => item.value), itemStyle: { borderRadius: [10, 10, 0, 0] } }],
    },
    true,
  );

  state.charts.identityChart.setOption(
    {
      ...baseChartOption(),
      legend: { bottom: 0, textStyle: { color: palette.muted } },
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          radius: ["38%", "58%"],
          center: ["30%", "46%"],
          label: { formatter: "{b}\n{d}%" },
          data: metrics.roleSeries.map((item, index) => ({ ...item, itemStyle: { color: index === 0 ? palette.primaryDeep : "#aacfb5" } })),
        },
        {
          type: "pie",
          radius: ["38%", "58%"],
          center: ["74%", "46%"],
          label: { formatter: "{b}\n{d}%" },
          data: metrics.accountSeries.map((item, index) => ({ ...item, itemStyle: { color: index === 0 ? palette.accent : palette.primary } })),
        },
      ],
      graphic: [
        { type: "text", left: "22%", top: "86%", style: { text: "用户身份", fill: palette.muted, fontSize: 13 } },
        { type: "text", left: "66%", top: "86%", style: { text: "账号类型", fill: palette.muted, fontSize: 13 } },
      ],
    },
    true,
  );

  state.charts.segmentChart.setOption(
    {
      ...baseChartOption(),
      xAxis: {
        type: "category",
        data: metrics.segmentSeries.map((item) => item.name),
        axisLabel: { color: palette.muted },
        axisLine: { lineStyle: { color: palette.grid } },
      },
      yAxis: { type: "value", splitLine: { lineStyle: { color: palette.grid } }, axisLabel: { color: palette.muted } },
      series: [
        {
          type: "bar",
          barWidth: "48%",
          data: metrics.segmentSeries.map((item, index) => ({
            value: item.value,
            itemStyle: {
              color: index >= 3 ? palette.primaryDeep : ["#d8ecd7", "#c3e1c6", "#aad7b0"][index] || palette.primary,
              borderRadius: [10, 10, 0, 0],
            },
          })),
          label: { show: true, position: "top", color: palette.ink },
        },
      ],
    },
    true,
  );

  state.charts.categoryChart.setOption(
    {
      ...baseChartOption(),
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          radius: ["42%", "72%"],
          center: ["50%", "55%"],
          label: { color: palette.ink, formatter: "{b}\n{d}%" },
          itemStyle: { borderRadius: 10, borderColor: "#fff", borderWidth: 3 },
          data: metrics.categorySeries.map((item, index) => ({
            ...item,
            itemStyle: {
              color: [palette.primary, "#9ed6ae", "#bedf9b", "#e7bb72", "#b0d8cb", "#8db0a5", "#9bd0bf", "#d8e8a0", "#e7d59c", "#7ebf91"][index % 10],
            },
          })),
        },
      ],
    },
    true,
  );

  state.charts.detailChart.setOption(
    {
      ...baseChartOption(),
      grid: { left: 110, right: 20, top: 16, bottom: 24 },
      xAxis: { type: "value", splitLine: { lineStyle: { color: palette.grid } }, axisLabel: { color: palette.muted } },
      yAxis: {
        type: "category",
        data: metrics.detailSeries.map((item) => item.name).reverse(),
        axisLabel: { color: palette.muted },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: "bar",
          data: metrics.detailSeries
            .map((item, index) => ({
              value: item.value,
              name: item.name,
              itemStyle: { color: index % 2 === 0 ? palette.accent : palette.accentSoft, borderRadius: [0, 10, 10, 0] },
            }))
            .reverse(),
          label: { show: true, position: "right", color: palette.ink },
        },
      ],
    },
    true,
  );

  const horizontalBar = (series, colorA, colorB) => ({
    ...baseChartOption(),
    grid: { left: 110, right: 20, top: 16, bottom: 24 },
    xAxis: { type: "value", splitLine: { lineStyle: { color: palette.grid } }, axisLabel: { color: palette.muted } },
    yAxis: {
      type: "category",
      data: series.map((item) => item.name).reverse(),
      axisLabel: { color: palette.muted },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: "bar",
        data: series
          .map((item, index) => ({
            value: item.value,
            name: item.name,
            itemStyle: { color: index % 2 === 0 ? colorA : colorB, borderRadius: [0, 10, 10, 0] },
          }))
          .reverse(),
        label: { show: true, position: "right", color: palette.ink },
      },
    ],
  });

  state.charts.departmentChart.setOption(horizontalBar(metrics.departmentSeries, palette.primaryDeep, palette.primarySoft), true);
  state.charts.provinceChart.setOption(horizontalBar(metrics.provinceSeries, palette.accent, palette.accentSoft), true);

  if (!profile) {
    state.charts.userCategoryChart.clear();
    state.charts.userTrendChart.clear();
    return;
  }

  state.charts.userCategoryChart.setOption(
    {
      ...baseChartOption(),
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          radius: ["38%", "64%"],
          center: ["50%", "50%"],
          label: { formatter: "{b}\n{d}%" },
          data: profile.categorySeries.map((item, index) => ({
            ...item,
            itemStyle: { color: [palette.primaryDeep, palette.primary, palette.accent, "#9ed6ae", "#b5d7bf", "#e8d49f"][index % 6] },
          })),
        },
      ],
    },
    true,
  );

  state.charts.userTrendChart.setOption(
    {
      ...baseChartOption(),
      xAxis: {
        type: "category",
        data: profile.trend.map((item) => item.date),
        axisLabel: { color: palette.muted, rotate: 35 },
        axisLine: { lineStyle: { color: palette.grid } },
      },
      yAxis: { type: "value", splitLine: { lineStyle: { color: palette.grid } }, axisLabel: { color: palette.muted } },
      series: [
        {
          type: "line",
          smooth: true,
          data: profile.trend.map((item) => item.actions),
          symbolSize: 8,
          lineStyle: { width: 3, color: palette.primaryDeep },
          itemStyle: { color: palette.primaryDeep },
          areaStyle: { color: "rgba(79, 154, 105, 0.12)" },
        },
      ],
    },
    true,
  );
}

function addFilterValue(key, value) {
  if (!value) return;
  const selected = new Set(state.filters[key]);
  selected.add(value);
  state.filters[key] = [...selected];
  rerender();
}

function selectUser(userId) {
  state.selectedUserId = userId;
  rerender();
}

function bindChartEvents() {
  state.charts.categoryChart.on("click", (params) => addFilterValue("category", params.name));
  state.charts.detailChart.on("click", (params) => addFilterValue("detail", params.name));
  state.charts.departmentChart.on("click", (params) => addFilterValue("department", params.name));
  state.charts.provinceChart.on("click", (params) => addFilterValue("province", params.name));
  state.charts.diseaseHotspotChart.on("click", (params) => addFilterValue("diseaseArea", params.name));
  state.charts.topicClusterChart.on("click", (params) => addFilterValue("themeCluster", params.name));
  state.charts.identityChart.on("click", (params) => {
    const roleNames = state.raw.filters.roles;
    if (roleNames.includes(params.name)) addFilterValue("role", params.name);
    const accountNames = state.raw.filters.accountTypes;
    if (accountNames.includes(params.name)) addFilterValue("accountType", params.name);
  });
  state.charts.userCategoryChart.on("click", (params) => addFilterValue("category", params.name));
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.closest(".multiselect")) {
      closeAllMultiSelects();
    }
    if (!target.closest(".user-search-box")) {
      dom.userSearchSuggestions.classList.remove("is-open");
    }
  });

  dom.startDate.addEventListener("change", (event) => {
    state.filters.startDate = event.target.value;
    rerender();
  });
  dom.endDate.addEventListener("change", (event) => {
    state.filters.endDate = event.target.value;
    rerender();
  });

  dom.resetFilters.addEventListener("click", () => {
    state.filters = defaultFilters();
    syncControlsFromState();
    dom.presetButtons.forEach((button) => button.classList.remove("is-active"));
    rerender();
  });

  dom.clearUserFocus.addEventListener("click", () => {
    state.selectedUserId = null;
    rerender();
  });

  dom.categorySort.addEventListener("change", (event) => {
    state.sortMode.category = event.target.value;
    rerender();
  });
  dom.departmentSort.addEventListener("change", (event) => {
    state.sortMode.department = event.target.value;
    rerender();
  });
  dom.provinceSort.addEventListener("change", (event) => {
    state.sortMode.province = event.target.value;
    rerender();
  });

  dom.granularityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.trendGranularity = button.dataset.granularity;
      dom.granularityButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      rerender();
    });
  });

  dom.presetButtons.forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.preset));
  });

  dom.selectedChips.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest(".chip-remove");
    if (!button) return;
    const key = button.dataset.key;
    const value = button.dataset.value;
    if (key === "userFocus") {
      state.selectedUserId = null;
    } else {
      state.filters[key] = state.filters[key].filter((item) => item !== value);
    }
    rerender();
  });

  dom.topUsersTable.addEventListener("click", (event) => {
    const row = event.target.closest("tr[data-user-id]");
    if (!row) return;
    selectUser(row.dataset.userId);
  });

  dom.recentActionsTable.addEventListener("click", (event) => {
    const row = event.target.closest("tr[data-user-id]");
    if (!row) return;
    selectUser(row.dataset.userId);
  });

  dom.activityTags.addEventListener("click", (event) => {
    const card = event.target.closest("[data-user-id]");
    if (!card) return;
    selectUser(card.dataset.userId);
  });

  dom.userSearchInput.addEventListener("input", (event) => {
    renderUserSuggestions(event.target.value);
  });

  dom.userSearchInput.addEventListener("focus", (event) => {
    renderUserSuggestions(event.target.value);
  });

  dom.userSearchSuggestions.addEventListener("click", (event) => {
    const item = event.target.closest("[data-user-id]");
    if (!item) return;
    selectUser(item.dataset.userId);
  });

  dom.userTimeline.addEventListener("click", (event) => {
    const item = event.target.closest(".user-timeline-item");
    if (!item) return;
    addFilterValue("category", item.dataset.category);
    addFilterValue("detail", item.dataset.detail);
  });

  dom.functionRankTable.addEventListener("click", (event) => {
    const row = event.target.closest("tr[data-filter-key]");
    if (!row) return;
    addFilterValue(row.dataset.filterKey, row.dataset.filterValue);
  });

  dom.hotspotAudienceTable.addEventListener("click", (event) => {
    const row = event.target.closest("tr[data-filter-key]");
    if (!row) return;
    addFilterValue(row.dataset.filterKey, row.dataset.filterValue);
  });

  dom.similarUsers.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-user-id]");
    if (!btn) return;
    selectUser(btn.dataset.userId);
  });

  dom.hotspotButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.hotspotWindow = Number(button.dataset.hotspotWindow);
      dom.hotspotButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      rerender();
    });
  });

  dom.generateReport.addEventListener("click", () => rerender());
  dom.downloadReport.addEventListener("click", () => {
    const blob = new Blob([dom.reportPreview.textContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `insight-report-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  });
  dom.printReport.addEventListener("click", () => window.print());
  dom.backToOverview.addEventListener("click", () => {
    document.getElementById("overviewSection").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  window.addEventListener("resize", () => {
    Object.values(state.charts).forEach((chart) => chart.resize());
  });
}

function rerender() {
  syncControlsFromState();
  const records = filterRecords();
  const metrics = getFilteredMetrics(records);
  const profile = buildUserProfile(records, pickUser(metrics));
  const hotspots = computeHotspots(records);
  state.selectedUserId = profile?.user.userId || null;

  renderHero(metrics);
  renderKpis(metrics);
  renderSelectedChips();
  renderAnalysisContext(metrics, profile);
  renderActivityTags(computeActivityInsights(records, metrics));
  renderTables(metrics);
  renderUserProfile(profile);
  updateCharts(metrics, profile);
  renderHotspots(hotspots);
  renderReport(metrics, profile, hotspots);
}

function init() {
  state.raw = window.DASHBOARD_DATA;
  state.userIndex = getAllUsersIndex();
  state.filters = defaultFilters();
  dom.startDate.min = state.raw.summary.startDate;
  dom.startDate.max = state.raw.summary.endDate;
  dom.endDate.min = state.raw.summary.startDate;
  dom.endDate.max = state.raw.summary.endDate;

  multiselectConfigs.forEach(createMultiSelect);
  ensureCharts();
  bindEvents();
  bindChartEvents();
  rerender();
}

init();
