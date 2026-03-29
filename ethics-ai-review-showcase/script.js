const projectData = {
  "project-a": {
    title: "多中心前瞻性干预研究",
    stage: "持续审查",
    risk: "需补充说明后再议",
    issues: "4 项",
    time: "2026-03-25 10:42"
  },
  "project-b": {
    title: "回顾性病例数据库研究",
    stage: "初始审查",
    risk: "低风险，可进入委员审阅",
    issues: "2 项",
    time: "2026-03-25 09:14"
  },
  "project-c": {
    title: "器械可行性临床试验",
    stage: "修改稿复审",
    risk: "可接受，需跟踪知情同意更新",
    issues: "3 项",
    time: "2026-03-24 18:40"
  }
};

const issueDetails = {
  "issue-1": {
    overview: "新增采血频次可能提高受试者身体负担，但方案中对频次提升必要性、替代路径和补偿安排说明不足。",
    basis: "对照院内伦理审查清单“受试者额外负担需有必要性说明”以及最新政策库中临床研究受试者保护相关条款。",
    suggestion: "补充采血必要性论证、说明替代方案评估过程，并在知情同意书中同步更新负担与补偿说明。"
  },
  "issue-2": {
    overview: "知情同意书写明了补偿原则，但未明确补偿触发条件、标准区间和发生不良事件时的处理路径。",
    basis: "历史审查意见曾要求受试者权益条款使用明确表述，当前更新稿未完全响应。",
    suggestion: "补充补偿金额或规则范围，明确责任主体、联系渠道和退出后的数据处理方式。"
  },
  "issue-3": {
    overview: "随机分组和退出机制已按上轮意见补充，目前文本已可被非专业受试者基本理解。",
    basis: "与 2026-03-22 修改稿相比，该问题已完成关闭并留痕。",
    suggestion: "无需新增动作，保留记录供后续持续审查引用。"
  },
  "issue-4": {
    overview: "招募广告中出现暗示受益的表达，可能对潜在受试者形成不当诱导。",
    basis: "招募材料需避免夸大潜在获益，当前措辞与院内审核要点不一致。",
    suggestion: "移除“显著改善”“优先获益”等表述，改为客观介绍研究目的、流程和参与条件。"
  }
};

const projectItems = document.querySelectorAll(".project-item");
const fileTabs = document.querySelectorAll(".file-tab");
const filePanes = document.querySelectorAll(".file-pane");
const issueCards = document.querySelectorAll(".issue-card");
const segments = document.querySelectorAll(".segment");
const modal = document.querySelector(".review-modal");
const modalBackdrop = document.querySelector(".modal-backdrop");

const titleNode = document.querySelector("#project-title");
const stageNode = document.querySelector("#summary-stage");
const riskNode = document.querySelector("#summary-risk");
const issuesNode = document.querySelector("#summary-issues");
const timeNode = document.querySelector("#summary-time");
const detailNode = document.querySelector("#issue-detail");

projectItems.forEach((item) => {
  item.addEventListener("click", () => {
    projectItems.forEach((node) => node.classList.remove("active"));
    item.classList.add("active");

    const project = projectData[item.dataset.project];
    titleNode.textContent = project.title;
    stageNode.textContent = project.stage;
    riskNode.textContent = project.risk;
    issuesNode.textContent = project.issues;
    timeNode.textContent = project.time;
  });
});

fileTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    fileTabs.forEach((node) => node.classList.remove("active"));
    filePanes.forEach((node) => node.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.file)?.classList.add("active");
  });
});

issueCards.forEach((card) => {
  card.addEventListener("click", () => {
    issueCards.forEach((node) => node.classList.remove("active"));
    card.classList.add("active");

    const issue = issueDetails[card.dataset.issue];
    detailNode.innerHTML = `
      <div class="detail-block">
        <span class="detail-label">问题概述</span>
        <p>${issue.overview}</p>
      </div>
      <div class="detail-block">
        <span class="detail-label">判断依据</span>
        <p>${issue.basis}</p>
      </div>
      <div class="detail-block">
        <span class="detail-label">建议动作</span>
        <p>${issue.suggestion}</p>
      </div>
    `;
  });
});

segments.forEach((segment) => {
  segment.addEventListener("click", () => {
    segments.forEach((node) => node.classList.remove("active"));
    segment.classList.add("active");

    const filter = segment.dataset.filter;
    issueCards.forEach((card) => {
      const matchRisk = filter === "all" || card.dataset.risk === filter;
      const matchState = filter === "open" ? card.dataset.state === "open" : true;
      const visible = filter === "open" ? matchState : matchRisk;
      card.hidden = !visible;
    });
  });
});

function openModal() {
  modal?.classList.add("open");
  modal?.setAttribute("aria-hidden", "false");
  if (modalBackdrop) {
    modalBackdrop.hidden = false;
  }
}

function closeModal() {
  modal?.classList.remove("open");
  modal?.setAttribute("aria-hidden", "true");
  if (modalBackdrop) {
    modalBackdrop.hidden = true;
  }
}

document.querySelector("[data-open-modal]")?.addEventListener("click", openModal);
document.querySelectorAll("[data-close-modal]").forEach((node) => {
  node.addEventListener("click", closeModal);
});
modalBackdrop?.addEventListener("click", closeModal);
