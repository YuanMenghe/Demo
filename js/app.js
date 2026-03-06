// 智汇MDT - 主应用逻辑

let currentPatient = null;
let currentView = 'grid';
let currentGroup = 'all';
let selectedIndicators = [];
let indicatorChart = null;

// 分组数据（可展开、可编辑）
let groups = [
    { id: 'liver', name: '肝癌组', expanded: true, order: 0 },
    { id: 'lymphoma', name: '淋巴瘤组', expanded: false, order: 1 },
    { id: 'lung', name: '肺癌组', expanded: false, order: 2 },
    { id: 'gastric', name: '胃癌组', expanded: false, order: 3 },
];

// 拖拽状态
let draggedItem = null;
let dragType = null; // 'patient' or 'group'

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initPatientManagement();
    initModal();
    initDepartments();
    initSettings();
    initGroupManagement();
    renderSidebar();
    renderPatients();
});

// 导航功能
function initNavigation() {
    const navItems = document.querySelectorAll('.sidebar-footer .nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            
            // 清除所有导航激活状态
            navItems.forEach(n => n.classList.remove('active'));
            document.querySelectorAll('.group-item').forEach(g => g.classList.remove('active'));
            item.classList.add('active');
            
            // 切换页面
            pages.forEach(p => p.classList.remove('active'));
            document.getElementById(`${page}Page`).classList.add('active');
            
            // 重置当前分组
            currentGroup = null;
        });
    });
}

// 分组管理初始化
function initGroupManagement() {
    const addGroupBtn = document.getElementById('addGroupBtn');
    if (addGroupBtn) {
        addGroupBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showAddGroupDialog();
        });
    }
}

// 渲染侧边栏分组
function renderSidebar() {
    const container = document.getElementById('groupsList');
    if (!container) return;
    
    // 计算各分组患者数量
    const groupCounts = {};
    groups.forEach(g => groupCounts[g.id] = 0);
    mockPatients.forEach(p => {
        if (groupCounts[p.group] !== undefined) {
            groupCounts[p.group]++;
        }
    });
    const totalCount = mockPatients.length;
    
    let html = `
        <div class="group-item ${currentGroup === 'all' ? 'active' : ''}" 
             data-group="all" 
             onclick="selectGroup('all')">
            <div class="group-header">
                <i class="fas fa-folder"></i>
                <span class="group-name">全部患者</span>
            </div>
            <span class="count">${totalCount}</span>
        </div>
    `;
    
    groups.sort((a, b) => a.order - b.order).forEach(group => {
        const patients = mockPatients.filter(p => p.group === group.id);
        const count = patients.length;
        
        html += `
            <div class="group-wrapper" data-group-id="${group.id}">
                <div class="group-item expandable ${currentGroup === group.id ? 'active' : ''} ${group.expanded ? 'expanded' : ''}" 
                     data-group="${group.id}"
                     draggable="true"
                     ondragstart="handleGroupDragStart(event, '${group.id}')"
                     ondragend="handleDragEnd(event)"
                     ondragover="handleGroupDragOver(event)"
                     ondrop="handleGroupDrop(event, '${group.id}')">
                    <div class="group-header" onclick="toggleGroupExpand('${group.id}', event)">
                        <i class="fas fa-chevron-right expand-icon"></i>
                        <i class="fas fa-folder${group.expanded ? '-open' : ''}"></i>
                        <span class="group-name" ondblclick="startRenameGroup('${group.id}', event)">${group.name}</span>
                    </div>
                    <div class="group-actions">
                        <span class="count">${count}</span>
                        <div class="group-menu">
                            <button class="btn-icon-sm" onclick="showGroupMenu(event, '${group.id}')" title="更多">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="group-patients ${group.expanded ? 'expanded' : ''}" data-group="${group.id}">
                    ${patients.map(p => `
                        <div class="sidebar-patient-item" 
                             data-patient-id="${p.id}"
                             draggable="true"
                             ondragstart="handlePatientDragStart(event, '${p.id}')"
                             ondragend="handleDragEnd(event)"
                             onclick="viewPatient('${p.id}')">
                            <div class="patient-mini-avatar">${p.name.charAt(0)}</div>
                            <div class="patient-mini-info">
                                <div class="patient-mini-name">${p.name}</div>
                                <div class="patient-mini-disease">${p.disease}</div>
                            </div>
                            <span class="patient-status-dot ${p.treatment === '初治' ? 'initial' : p.treatment === '复发' ? 'recurrent' : 'refractory'}"></span>
                        </div>
                    `).join('')}
                    ${patients.length === 0 ? '<div class="empty-group">暂无患者</div>' : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // 为分组患者列表添加拖放目标
    document.querySelectorAll('.group-patients').forEach(el => {
        el.addEventListener('dragover', handlePatientListDragOver);
        el.addEventListener('dragleave', handlePatientListDragLeave);
        el.addEventListener('drop', handlePatientListDrop);
    });
    
    // 为分组项添加拖放目标
    document.querySelectorAll('.group-item.expandable').forEach(el => {
        el.addEventListener('dragover', handleGroupItemDragOver);
        el.addEventListener('dragleave', handleGroupItemDragLeave);
        el.addEventListener('drop', handleGroupItemDrop);
    });
}

// 选择分组
function selectGroup(groupId) {
    currentGroup = groupId;
    
    // 清除底部导航的激活状态
    document.querySelectorAll('.sidebar-footer .nav-item').forEach(n => n.classList.remove('active'));
    
    // 切换到患者页面
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('patientsPage').classList.add('active');
    
    renderSidebar();
    renderPatients();
}

// 切换分组展开/折叠
function toggleGroupExpand(groupId, event) {
    event.stopPropagation();
    const group = groups.find(g => g.id === groupId);
    if (group) {
        group.expanded = !group.expanded;
        renderSidebar();
    }
    selectGroup(groupId);
}

// ==================== 拖拽功能 ====================

// 患者拖拽开始
function handlePatientDragStart(event, patientId) {
    draggedItem = patientId;
    dragType = 'patient';
    event.target.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'patient', id: patientId }));
    
    // 添加拖拽时的视觉提示
    document.querySelectorAll('.group-item.expandable, .group-patients').forEach(el => {
        el.classList.add('drop-zone-highlight');
    });
}

// 分组拖拽开始
function handleGroupDragStart(event, groupId) {
    draggedItem = groupId;
    dragType = 'group';
    event.target.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'group', id: groupId }));
}

// 拖拽结束
function handleDragEnd(event) {
    event.target.classList.remove('dragging');
    draggedItem = null;
    dragType = null;
    
    document.querySelectorAll('.drop-zone-highlight, .drop-target, .drop-above, .drop-below').forEach(el => {
        el.classList.remove('drop-zone-highlight', 'drop-target', 'drop-above', 'drop-below');
    });
}

// 分组项拖放处理
function handleGroupItemDragOver(event) {
    event.preventDefault();
    if (dragType === 'patient') {
        event.currentTarget.classList.add('drop-target');
    } else if (dragType === 'group') {
        const rect = event.currentTarget.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (event.clientY < midY) {
            event.currentTarget.classList.remove('drop-below');
            event.currentTarget.classList.add('drop-above');
        } else {
            event.currentTarget.classList.remove('drop-above');
            event.currentTarget.classList.add('drop-below');
        }
    }
}

function handleGroupItemDragLeave(event) {
    event.currentTarget.classList.remove('drop-target', 'drop-above', 'drop-below');
}

function handleGroupItemDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    const targetGroupId = event.currentTarget.dataset.group;
    
    if (dragType === 'patient' && draggedItem) {
        movePatientToGroup(draggedItem, targetGroupId);
    } else if (dragType === 'group' && draggedItem && draggedItem !== targetGroupId) {
        reorderGroups(draggedItem, targetGroupId, event);
    }
    
    event.currentTarget.classList.remove('drop-target', 'drop-above', 'drop-below');
}

// 患者列表拖放处理
function handlePatientListDragOver(event) {
    event.preventDefault();
    if (dragType === 'patient') {
        event.currentTarget.classList.add('drop-target');
    }
}

function handlePatientListDragLeave(event) {
    event.currentTarget.classList.remove('drop-target');
}

function handlePatientListDrop(event) {
    event.preventDefault();
    const targetGroupId = event.currentTarget.dataset.group;
    
    if (dragType === 'patient' && draggedItem) {
        movePatientToGroup(draggedItem, targetGroupId);
    }
    
    event.currentTarget.classList.remove('drop-target');
}

// 分组拖放处理
function handleGroupDragOver(event) {
    event.preventDefault();
}

function handleGroupDrop(event, targetGroupId) {
    event.preventDefault();
    if (dragType === 'group' && draggedItem && draggedItem !== targetGroupId) {
        reorderGroups(draggedItem, targetGroupId, event);
    }
}

// 移动患者到分组
function movePatientToGroup(patientId, groupId) {
    const patient = mockPatients.find(p => p.id === patientId);
    if (patient) {
        const oldGroup = groups.find(g => g.id === patient.group);
        const newGroup = groups.find(g => g.id === groupId);
        patient.group = groupId;
        
        // 展开目标分组
        if (newGroup) {
            newGroup.expanded = true;
        }
        
        renderSidebar();
        renderPatients();
        showToast(`已将 ${patient.name} 移至「${newGroup ? newGroup.name : groupId}」`, 'success');
    }
}

// 重新排序分组
function reorderGroups(draggedId, targetId, event) {
    const draggedIndex = groups.findIndex(g => g.id === draggedId);
    const targetIndex = groups.findIndex(g => g.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const [removed] = groups.splice(draggedIndex, 1);
    
    // 判断放置位置
    const rect = event.target.closest('.group-item').getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const insertIndex = event.clientY < midY ? targetIndex : targetIndex + 1;
    
    groups.splice(insertIndex > draggedIndex ? insertIndex - 1 : insertIndex, 0, removed);
    
    // 更新顺序
    groups.forEach((g, i) => g.order = i);
    
    renderSidebar();
    showToast('分组顺序已更新', 'success');
}

// ==================== 分组管理 ====================

// 显示新建分组对话框
function showAddGroupDialog() {
    const name = prompt('请输入分组名称：');
    if (name && name.trim()) {
        addGroup(name.trim());
    }
}

// 添加分组
function addGroup(name) {
    const id = 'group_' + Date.now();
    groups.push({
        id: id,
        name: name,
        expanded: true,
        order: groups.length
    });
    renderSidebar();
    showToast(`分组「${name}」创建成功`, 'success');
}

// 开始重命名分组
function startRenameGroup(groupId, event) {
    event.stopPropagation();
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    const nameEl = event.target;
    const currentName = group.name;
    
    nameEl.contentEditable = true;
    nameEl.classList.add('editing');
    nameEl.focus();
    
    // 选中所有文本
    const range = document.createRange();
    range.selectNodeContents(nameEl);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    
    const finishEdit = () => {
        nameEl.contentEditable = false;
        nameEl.classList.remove('editing');
        const newName = nameEl.textContent.trim();
        if (newName && newName !== currentName) {
            group.name = newName;
            showToast(`分组已重命名为「${newName}」`, 'success');
        } else {
            nameEl.textContent = currentName;
        }
        renderSidebar();
    };
    
    nameEl.addEventListener('blur', finishEdit, { once: true });
    nameEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nameEl.blur();
        } else if (e.key === 'Escape') {
            nameEl.textContent = currentName;
            nameEl.blur();
        }
    });
}

// 显示分组菜单
function showGroupMenu(event, groupId) {
    event.stopPropagation();
    
    // 移除已存在的菜单
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) existingMenu.remove();
    
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.innerHTML = `
        <div class="context-menu-item" onclick="renameGroupFromMenu('${groupId}')">
            <i class="fas fa-edit"></i> 重命名
        </div>
        <div class="context-menu-item danger" onclick="deleteGroup('${groupId}')">
            <i class="fas fa-trash"></i> 删除分组
        </div>
    `;
    
    const rect = event.target.closest('.btn-icon-sm').getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = rect.bottom + 5 + 'px';
    menu.style.left = rect.left + 'px';
    
    document.body.appendChild(menu);
    
    // 点击其他地方关闭菜单
    setTimeout(() => {
        document.addEventListener('click', () => menu.remove(), { once: true });
    }, 10);
}

// 从菜单重命名分组
function renameGroupFromMenu(groupId) {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    const newName = prompt('请输入新的分组名称：', group.name);
    if (newName && newName.trim() && newName.trim() !== group.name) {
        group.name = newName.trim();
        renderSidebar();
        showToast(`分组已重命名为「${newName}」`, 'success');
    }
}

// 删除分组
function deleteGroup(groupId) {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    const patientsInGroup = mockPatients.filter(p => p.group === groupId);
    
    if (patientsInGroup.length > 0) {
        if (!confirm(`分组「${group.name}」中有 ${patientsInGroup.length} 个患者，删除分组后患者将移至默认分组。确定删除吗？`)) {
            return;
        }
        // 移动患者到第一个分组
        const defaultGroup = groups.find(g => g.id !== groupId);
        patientsInGroup.forEach(p => {
            p.group = defaultGroup ? defaultGroup.id : 'liver';
        });
    } else {
        if (!confirm(`确定删除分组「${group.name}」吗？`)) {
            return;
        }
    }
    
    groups = groups.filter(g => g.id !== groupId);
    if (currentGroup === groupId) {
        currentGroup = 'all';
    }
    renderSidebar();
    renderPatients();
    showToast(`分组「${group.name}」已删除`, 'success');
}

// 患者管理功能
function initPatientManagement() {
    // 视图切换
    const viewBtns = document.querySelectorAll('.view-toggle .btn-icon');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentView = btn.dataset.view;
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const grid = document.getElementById('patientsGrid');
            if (currentView === 'list') {
                grid.classList.add('list-view');
            } else {
                grid.classList.remove('list-view');
            }
        });
    });

    // 搜索功能
    const searchInput = document.getElementById('globalSearch');
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        renderPatients(keyword);
    });
}

// 渲染患者列表
function renderPatients(keyword = '') {
    const grid = document.getElementById('patientsGrid');
    let patients = [...mockPatients];
    
    // 按分组过滤
    if (currentGroup && currentGroup !== 'all') {
        patients = patients.filter(p => p.group === currentGroup);
    }
    
    // 按关键词过滤
    if (keyword) {
        patients = patients.filter(p => {
            const searchStr = `${p.name}${p.disease}${p.complications.join('')}${p.treatment}`.toLowerCase();
            return searchStr.includes(keyword);
        });
    }
    
    // 判断是否在"全部患者"视图
    const showGroupSelector = currentGroup === 'all';
    
    grid.innerHTML = patients.map(patient => {
        const patientGroup = groups.find(g => g.id === patient.group);
        const groupName = patientGroup ? patientGroup.name : '未分组';
        const isUngrouped = !patientGroup;
        
        return `
        <div class="patient-card" 
             data-id="${patient.id}" 
             draggable="true"
             ondragstart="handleCardDragStart(event, '${patient.id}')"
             ondragend="handleDragEnd(event)">
            <div class="card-header">
                <div class="patient-avatar">${patient.name.charAt(0)}</div>
                <div class="card-actions">
                    <button class="btn-icon" title="查看病例" onclick="viewPatient('${patient.id}'); event.stopPropagation();">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="更多操作" onclick="event.stopPropagation();">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
            </div>
            <div class="patient-name">${patient.name}</div>
            <div class="patient-id">${patient.gender} · ${patient.age}岁 · ${patient.id}</div>
            <div class="patient-tags">
                <span class="tag disease">${patient.disease}</span>
                ${patient.stage ? `<span class="tag stage">${patient.stage}</span>` : ''}
                ${patient.complications.map(c => `<span class="tag complication">${c}</span>`).join('')}
                <span class="tag treatment">${patient.treatment}</span>
            </div>
            <div class="card-footer">
                <span class="footer-time"><i class="fas fa-clock"></i>${patient.lastUpdate}</span>
                ${showGroupSelector ? `
                <div class="patient-group-selector" onclick="event.stopPropagation();">
                    <div class="group-badge ${isUngrouped ? 'ungrouped' : ''}" onclick="toggleGroupDropdown('${patient.id}', event)">
                        <i class="fas fa-folder${isUngrouped ? '' : '-open'}"></i>
                        <span>${groupName}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="group-dropdown" id="dropdown-${patient.id}">
                        <div class="dropdown-header">选择分组</div>
                        ${groups.map(g => `
                            <div class="dropdown-item ${patient.group === g.id ? 'active' : ''}" 
                                 onclick="changePatientGroup('${patient.id}', '${g.id}')">
                                <i class="fas fa-folder"></i>
                                <span>${g.name}</span>
                                ${patient.group === g.id ? '<i class="fas fa-check"></i>' : ''}
                            </div>
                        `).join('')}
                        <div class="dropdown-divider"></div>
                        <div class="dropdown-item new-group" onclick="createGroupForPatient('${patient.id}')">
                            <i class="fas fa-plus"></i>
                            <span>新建分组...</span>
                        </div>
                    </div>
                </div>
                ` : ''}
                <span class="footer-events"><i class="fas fa-route"></i>${patient.timeline.length}个事件</span>
            </div>
        </div>
    `}).join('');

    // 添加卡片点击事件
    grid.querySelectorAll('.patient-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.btn-icon') && !e.target.closest('.patient-group-selector')) {
                viewPatient(card.dataset.id);
            }
        });
    });
    
    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', closeAllDropdowns);
}

// 切换分组下拉菜单
function toggleGroupDropdown(patientId, event) {
    event.stopPropagation();
    
    const dropdown = document.getElementById(`dropdown-${patientId}`);
    const isOpen = dropdown.classList.contains('open');
    
    // 关闭所有其他下拉菜单
    closeAllDropdowns();
    
    if (!isOpen) {
        dropdown.classList.add('open');
    }
}

// 关闭所有下拉菜单
function closeAllDropdowns() {
    document.querySelectorAll('.group-dropdown.open').forEach(d => {
        d.classList.remove('open');
    });
}

// 更改患者分组
function changePatientGroup(patientId, groupId) {
    const patient = mockPatients.find(p => p.id === patientId);
    if (patient) {
        const oldGroup = groups.find(g => g.id === patient.group);
        const newGroup = groups.find(g => g.id === groupId);
        patient.group = groupId;
        
        closeAllDropdowns();
        renderPatients();
        renderSidebar();
        
        showToast(`已将 ${patient.name} 移至「${newGroup ? newGroup.name : '未分组'}」`, 'success');
    }
}

// 为患者创建新分组
function createGroupForPatient(patientId) {
    closeAllDropdowns();
    
    const name = prompt('请输入新分组名称：');
    if (name && name.trim()) {
        const newGroupId = 'group_' + Date.now();
        groups.push({
            id: newGroupId,
            name: name.trim(),
            expanded: true,
            order: groups.length
        });
        
        // 将患者移入新分组
        const patient = mockPatients.find(p => p.id === patientId);
        if (patient) {
            patient.group = newGroupId;
        }
        
        renderPatients();
        renderSidebar();
        showToast(`已创建分组「${name}」并添加患者`, 'success');
    }
}

// 卡片拖拽开始
function handleCardDragStart(event, patientId) {
    handlePatientDragStart(event, patientId);
}

// 查看患者详情 - 进入MDT病例信息看板
function viewPatient(patientId) {
    currentPatient = mockPatients.find(p => p.id === patientId);
    if (!currentPatient) return;
    
    renderDashboard();
    
    // 切换到看板页面
    document.querySelectorAll('.sidebar-footer .nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.group-item').forEach(g => g.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('dashboardPage').classList.add('active');
}

// 渲染病例看板
function renderDashboard() {
    const page = document.getElementById('dashboardPage');
    
    page.innerHTML = `
        <div class="dashboard-header">
            <div class="patient-brief">
                <button class="btn-back" onclick="backToPatients()" title="返回患者列表">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="avatar">${currentPatient.name.charAt(0)}</div>
                <div class="info">
                    <h2>${currentPatient.name}</h2>
                    <div class="meta">
                        <span><i class="fas fa-venus-mars"></i>${currentPatient.gender}</span>
                        <span><i class="fas fa-birthday-cake"></i>${currentPatient.age}岁</span>
                        <span><i class="fas fa-disease"></i>${currentPatient.disease}</span>
                        ${currentPatient.stage ? `<span><i class="fas fa-layer-group"></i>${currentPatient.stage}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="dashboard-actions">
                <button class="btn btn-secondary" onclick="openAddMaterialModal()">
                    <i class="fas fa-plus"></i> 补充资料
                </button>
                <button class="btn btn-primary" onclick="openExportModal()">
                    <i class="fas fa-download"></i> 下载病例报告
                </button>
            </div>
        </div>

        <!-- 患者基本信息 - 放在姓名栏和时间旅程之间 -->
        <div class="info-section">
            <div class="info-card">
                <h4><i class="fas fa-user-injured"></i> 患者基本信息</h4>
                <div class="info-item">
                    <span class="label">主诉</span>
                    <span class="value">${currentPatient.basicInfo.chiefComplaint}</span>
                </div>
                <div class="info-item">
                    <span class="label">现病史</span>
                    <span class="value">${currentPatient.basicInfo.presentHistory}</span>
                </div>
                <div class="info-item">
                    <span class="label">既往史</span>
                    <span class="value">${currentPatient.basicInfo.pastHistory}</span>
                </div>
            </div>
            <div class="info-card">
                <h4><i class="fas fa-notes-medical"></i> 其他信息</h4>
                <div class="info-item">
                    <span class="label">家族史</span>
                    <span class="value">${currentPatient.basicInfo.familyHistory}</span>
                </div>
                <div class="info-item">
                    <span class="label">个人史</span>
                    <span class="value">${currentPatient.basicInfo.personalHistory}</span>
                </div>
                <div class="info-item">
                    <span class="label">合并症</span>
                    <span class="value">${currentPatient.complications.length > 0 ? currentPatient.complications.join('、') : '无'}</span>
                </div>
            </div>
        </div>

        <div class="timeline-section">
            <div class="section-title">
                <h3><i class="fas fa-route"></i> 诊疗时间旅程</h3>
                <div class="timeline-toggle">
                    <button class="btn btn-secondary active" onclick="toggleTimeline('horizontal')">横向时间轴</button>
                    <button class="btn btn-secondary" onclick="toggleTimeline('s-shape')">S型时间轴</button>
                </div>
            </div>
            
            <!-- 横向时间轴：左侧事件列表 + 右侧详情 -->
            <div class="timeline-horizontal-wrapper" id="timelineHorizontal">
                <div class="timeline-events-list">
                    <div class="events-header">
                        <i class="fas fa-calendar-alt"></i> 时间轴事件
                    </div>
                    ${currentPatient.timeline.map((event, index) => `
                        <div class="event-list-item ${index === 0 ? 'active' : ''}" 
                             data-index="${index}"
                             onclick="selectTimelineEvent(${index})">
                            <div class="event-marker ${event.type || 'default'}"></div>
                            <div class="event-info">
                                <div class="event-title">${event.title}</div>
                                <div class="event-meta">
                                    <span class="event-date">${event.date}</span>
                                    <span class="event-hospital">${event.hospital}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="timeline-event-detail" id="eventDetailPanel">
                    ${renderEventDetail(0)}
                </div>
            </div>
            
            <!-- S型时间轴 -->
            <div class="timeline-s-shape" id="timelineSShape">
                ${renderSTimeline()}
            </div>
        </div>

        <div class="indicators-section">
            <div class="section-title">
                <h3><i class="fas fa-chart-line"></i> 关键指标趋势</h3>
            </div>
            <div class="indicator-config">
                <select id="diseaseSelect" onchange="updateIndicatorTags()">
                    <option value="肝癌" ${currentPatient.disease.includes('肝') ? 'selected' : ''}>肝癌指标</option>
                    <option value="肺癌" ${currentPatient.disease.includes('肺') ? 'selected' : ''}>肺癌指标</option>
                    <option value="淋巴瘤" ${currentPatient.disease.includes('淋巴') ? 'selected' : ''}>淋巴瘤指标</option>
                    <option value="胃癌" ${currentPatient.disease.includes('胃') ? 'selected' : ''}>胃癌指标</option>
                </select>
                <div class="indicator-tags" id="indicatorTags">
                    ${renderIndicatorTags()}
                </div>
            </div>
            <div class="chart-container">
                <canvas id="indicatorChart"></canvas>
            </div>
        </div>
    `;

    initIndicatorChart();
}

// 渲染事件详情面板
function renderEventDetail(index) {
    const event = currentPatient.timeline[index];
    const date = event.date;
    
    // 获取该日期的指标数据
    const indicators = [];
    for (const [name, data] of Object.entries(currentPatient.indicators)) {
        const point = data.find(d => d.date === date);
        if (point) {
            const range = indicatorRanges[name];
            const isAbnormal = range && (point.value < range.min || point.value > range.max);
            indicators.push({ name, value: point.value, unit: indicatorUnits[name] || '', isAbnormal, range });
        }
    }
    
    // 获取异常指标
    const abnormalIndicators = indicators.filter(i => i.isAbnormal);
    
    return `
        <div class="detail-panel-header">
            <h3>${event.title}</h3>
            <div class="detail-meta">
                <span><i class="fas fa-calendar"></i> ${event.date}</span>
                <span><i class="fas fa-hospital"></i> ${event.hospital}</span>
            </div>
        </div>
        
        ${abnormalIndicators.length > 0 ? `
        <div class="detail-alert">
            <div class="alert-header">
                <i class="fas fa-exclamation-triangle"></i> 关键指标
            </div>
            <div class="alert-content">
                ${abnormalIndicators.map(i => `
                    <span class="alert-indicator">
                        ${i.name}: ${i.value} ${i.unit} <i class="fas fa-arrow-up"></i>
                    </span>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        <div class="detail-section-card">
            <div class="section-card-header">
                <i class="fas fa-stethoscope"></i> 临床诊断
            </div>
            <div class="section-card-body">
                <div class="diagnosis-tag">${currentPatient.disease}${currentPatient.stage ? ' ' + currentPatient.stage : ''}</div>
                <p class="diagnosis-desc">${event.title === '初诊确诊' || event.title === '穿刺活检确诊' ? '经病理检查确诊为' + currentPatient.disease : '持续随访观察中'}</p>
            </div>
            <div class="section-card-footer">${event.date}</div>
        </div>
        
        ${indicators.length > 0 ? `
        <div class="detail-section-card">
            <div class="section-card-header">
                <i class="fas fa-flask"></i> 实验室检查
            </div>
            <div class="section-card-body">
                <div class="lab-item-header">
                    <span>检查项目</span>
                    <span>结果</span>
                </div>
                ${indicators.map(i => `
                    <div class="lab-item ${i.isAbnormal ? 'abnormal' : ''}">
                        <span class="lab-name">${i.name}</span>
                        <span class="lab-value ${i.isAbnormal ? 'text-danger' : ''}">${i.value} ${i.unit}</span>
                    </div>
                `).join('')}
            </div>
            <div class="section-card-footer">${event.date}</div>
        </div>
        ` : `
        <div class="detail-section-card">
            <div class="section-card-header">
                <i class="fas fa-flask"></i> 实验室检查
            </div>
            <div class="section-card-body empty">
                <i class="fas fa-file-medical"></i>
                <p>该时间点暂无检查数据</p>
            </div>
        </div>
        `}
    `;
}

// 选择时间轴事件
function selectTimelineEvent(index) {
    // 更新列表选中状态
    document.querySelectorAll('.event-list-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    // 更新详情面板
    document.getElementById('eventDetailPanel').innerHTML = renderEventDetail(index);
}

// S型时间轴行颜色
const STL_ROW_COLORS = ['#9333ea', '#22c55e', '#f97316', '#3b82f6', '#ec4899'];
const STL_TYPE_COLORS = {
    'admission': '#8b5cf6', 'imaging': '#3b82f6', 'diagnosis': '#ef4444',
    'treatment': '#10b981', 'surgery': '#f59e0b', 'followup': '#6366f1',
    'mdt': '#ec4899', 'relapse': '#dc2626', 'progression': '#991b1b',
    'evaluation': '#0891b2', 'default': '#64748b'
};

// 渲染S型时间轴 (HTML部分：卡片+节点，不含连线)
function renderSTimeline() {
    const timeline = currentPatient.timeline;
    const eventsPerRow = 4;
    const rows = [];
    for (let i = 0; i < timeline.length; i += eventsPerRow) {
        rows.push(timeline.slice(i, i + eventsPerRow));
    }

    let html = `
        <div class="stl-legend">
            <span class="stl-legend-item"><span class="stl-dot" style="background:#8b5cf6"></span>入院</span>
            <span class="stl-legend-item"><span class="stl-dot" style="background:#10b981"></span>治疗</span>
            <span class="stl-legend-item"><span class="stl-dot" style="background:#3b82f6"></span>影像</span>
            <span class="stl-legend-item"><span class="stl-dot" style="background:#0891b2"></span>评估</span>
            <span class="stl-legend-item"><span class="stl-dot" style="background:#6366f1"></span>随访</span>
            <span class="stl-legend-item"><span class="stl-dot" style="background:#ec4899"></span>MDT</span>
            <span class="stl-legend-item"><span class="stl-dot" style="background:#dc2626"></span>复发</span>
        </div>
        <div class="stl-container">
    `;

    rows.forEach((rowEvents, rowIndex) => {
        const isReversed = rowIndex % 2 === 1;
        const lineColor = STL_ROW_COLORS[rowIndex % STL_ROW_COLORS.length];

        html += `<div class="stl-row ${isReversed ? 'reversed' : ''}" data-row-index="${rowIndex}" data-row-color="${lineColor}">`;

        // 上方卡片区
        html += `<div class="stl-cards-top">`;
        rowEvents.forEach((event, i) => {
            const globalIdx = rowIndex * eventsPerRow + i;
            const showOnTop = i % 2 === 0;
            const color = STL_TYPE_COLORS[event.type] || STL_TYPE_COLORS['default'];
            const desc = event.desc || event.title;
            const shortDesc = desc.length > 60 ? desc.substring(0, 60) + '...' : desc;
            html += `<div class="stl-slot">`;
            if (showOnTop) {
                html += `
                    <div class="stl-card" onclick="showNodeDetail(${globalIdx})" style="border-top: 3px solid ${color}">
                        <div class="stl-card-title">${event.title}</div>
                        <div class="stl-card-desc">${shortDesc}</div>
                        <div class="stl-card-hospital">${event.hospital}</div>
                    </div>
                    <div class="stl-vline" style="background: ${color}"></div>`;
            }
            html += `</div>`;
        });
        html += `</div>`;

        // 时间轴节点区 (不画虚线，虚线由后渲染SVG绘制)
        html += `<div class="stl-axis">`;
        rowEvents.forEach((event, i) => {
            const color = STL_TYPE_COLORS[event.type] || STL_TYPE_COLORS['default'];
            html += `
                <div class="stl-node-wrap">
                    <div class="stl-node" style="border-color: ${color}"></div>
                    <div class="stl-date">${event.date}</div>
                </div>`;
        });
        html += `</div>`;

        // 下方卡片区
        html += `<div class="stl-cards-bottom">`;
        rowEvents.forEach((event, i) => {
            const globalIdx = rowIndex * eventsPerRow + i;
            const showOnTop = i % 2 === 0;
            const color = STL_TYPE_COLORS[event.type] || STL_TYPE_COLORS['default'];
            const desc = event.desc || event.title;
            const shortDesc = desc.length > 60 ? desc.substring(0, 60) + '...' : desc;
            html += `<div class="stl-slot">`;
            if (!showOnTop) {
                html += `
                    <div class="stl-vline" style="background: ${color}"></div>
                    <div class="stl-card" onclick="showNodeDetail(${globalIdx})" style="border-top: 3px solid ${color}">
                        <div class="stl-card-title">${event.title}</div>
                        <div class="stl-card-desc">${shortDesc}</div>
                        <div class="stl-card-hospital">${event.hospital}</div>
                    </div>`;
            }
            html += `</div>`;
        });
        html += `</div>`;

        html += `</div>`; // 关闭 stl-row
    });

    html += `</div>`;
    return html;
}

// 后渲染：测量真实DOM位置，绘制全局SVG连线和转弯
function drawSTimelineLines() {
    const container = document.querySelector('.stl-container');
    if (!container) return;

    // 移除旧的SVG覆盖层
    const oldSvg = container.querySelector('.stl-lines-svg');
    if (oldSvg) oldSvg.remove();

    const stlRows = container.querySelectorAll('.stl-row');
    if (stlRows.length === 0) return;

    const containerRect = container.getBoundingClientRect();

    // 收集每行轴线的位置信息
    const rowInfos = [];
    stlRows.forEach((row) => {
        const axis = row.querySelector('.stl-axis');
        if (!axis) return;
        const axisRect = axis.getBoundingClientRect();
        const rowColor = row.dataset.rowColor;
        const isReversed = row.classList.contains('reversed');
        rowInfos.push({
            axisY: axisRect.top + axisRect.height / 2 - containerRect.top,
            axisLeft: axisRect.left - containerRect.left,
            axisRight: axisRect.right - containerRect.left,
            axisWidth: axisRect.width,
            color: rowColor,
            isReversed
        });
    });

    if (rowInfos.length === 0) return;

    // 创建SVG覆盖层
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.classList.add('stl-lines-svg');
    svg.setAttribute('width', containerRect.width);
    svg.setAttribute('height', containerRect.height);

    // 绘制每行的水平虚线 + 方向箭头
    rowInfos.forEach((info, i) => {
        const { axisY, axisLeft, axisRight, color, isReversed } = info;

        // 水平虚线
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', axisLeft);
        line.setAttribute('y1', axisY);
        line.setAttribute('x2', axisRight);
        line.setAttribute('y2', axisY);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-dasharray', '10 5');
        svg.appendChild(line);

        // 方向箭头 (沿虚线均匀分布3个)
        const lineLen = axisRight - axisLeft;
        for (let a = 1; a <= 3; a++) {
            const ratio = a / 4;
            const ax = isReversed
                ? axisRight - lineLen * ratio
                : axisLeft + lineLen * ratio;
            const dir = isReversed ? -1 : 1;
            const arrow = document.createElementNS(svgNS, 'polygon');
            const x1 = ax - 5 * dir, y1 = axisY - 5;
            const x2 = ax + 5 * dir, y2 = axisY;
            const x3 = ax - 5 * dir, y3 = axisY + 5;
            arrow.setAttribute('points', `${x1},${y1} ${x2},${y2} ${x3},${y3}`);
            arrow.setAttribute('fill', color);
            arrow.setAttribute('opacity', '0.5');
            svg.appendChild(arrow);
        }
    });

    // 绘制行间转弯弧线
    for (let i = 0; i < rowInfos.length - 1; i++) {
        const curr = rowInfos[i];
        const next = rowInfos[i + 1];
        const turnOnRight = !curr.isReversed;

        const y1 = curr.axisY;
        const y2 = next.axisY;
        const midY = (y1 + y2) / 2;
        const bulge = 35;

        let pathD;
        if (turnOnRight) {
            const x = Math.max(curr.axisRight, next.axisRight);
            pathD = `M ${x} ${y1} C ${x + bulge} ${y1}, ${x + bulge} ${midY - 10}, ${x + bulge} ${midY} C ${x + bulge} ${midY + 10}, ${x + bulge} ${y2}, ${x} ${y2}`;
        } else {
            const x = Math.min(curr.axisLeft, next.axisLeft);
            pathD = `M ${x} ${y1} C ${x - bulge} ${y1}, ${x - bulge} ${midY - 10}, ${x - bulge} ${midY} C ${x - bulge} ${midY + 10}, ${x - bulge} ${y2}, ${x} ${y2}`;
        }

        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', pathD);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', curr.color);
        path.setAttribute('stroke-width', '3');
        path.setAttribute('stroke-dasharray', '10 5');
        svg.appendChild(path);
    }

    container.appendChild(svg);
}

// 切换时间轴样式
function toggleTimeline(type) {
    const horizontal = document.getElementById('timelineHorizontal');
    const sShape = document.getElementById('timelineSShape');
    const btns = document.querySelectorAll('.timeline-toggle .btn');
    
    btns.forEach(b => b.classList.remove('active'));
    
    if (type === 'horizontal') {
        horizontal.style.display = 'flex';
        sShape.classList.remove('active');
        btns[0].classList.add('active');
    } else {
        horizontal.style.display = 'none';
        sShape.classList.add('active');
        btns[1].classList.add('active');
        // 后渲染SVG：等DOM更新后测量位置并绘制连线
        requestAnimationFrame(() => {
            requestAnimationFrame(() => drawSTimelineLines());
        });
    }
}

// 渲染指标标签
function renderIndicatorTags() {
    const disease = currentPatient.disease;
    let indicators = diseaseIndicators['默认'];
    
    for (const [key, value] of Object.entries(diseaseIndicators)) {
        if (disease.includes(key.replace('癌', ''))) {
            indicators = value;
            break;
        }
    }
    
    const availableIndicators = indicators.filter(ind => currentPatient.indicators[ind]);
    selectedIndicators = availableIndicators.slice(0, 2);
    
    return availableIndicators.map(ind => {
        const color = indicatorColors[ind] || '#64748b';
        const isActive = selectedIndicators.includes(ind);
        return `
            <div class="indicator-tag ${isActive ? 'active' : ''}" onclick="toggleIndicator('${ind}')">
                <span class="color-dot" style="background: ${color}"></span>
                <span>${ind}</span>
            </div>
        `;
    }).join('');
}

// 更新指标标签
function updateIndicatorTags() {
    document.getElementById('indicatorTags').innerHTML = renderIndicatorTags();
    updateChart();
}

// 切换指标
function toggleIndicator(indicator) {
    const index = selectedIndicators.indexOf(indicator);
    if (index > -1) {
        if (selectedIndicators.length > 1) {
            selectedIndicators.splice(index, 1);
        }
    } else {
        selectedIndicators.push(indicator);
    }
    
    document.querySelectorAll('.indicator-tag').forEach(tag => {
        const ind = tag.querySelector('span:last-child').textContent;
        tag.classList.toggle('active', selectedIndicators.includes(ind));
    });
    
    updateChart();
}

// 初始化指标图表
function initIndicatorChart() {
    const ctx = document.getElementById('indicatorChart').getContext('2d');
    
    if (indicatorChart) {
        indicatorChart.destroy();
    }
    
    indicatorChart = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            const unit = indicatorUnits[label] || '';
                            return `${label}: ${value} ${unit}`;
                        }
                    }
                }
            },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: false, grid: { color: '#e2e8f0' } }
            }
        }
    });
    
    updateChart();
}

// 更新图表
function updateChart() {
    if (!indicatorChart || !currentPatient) return;
    
    const datasets = [];
    let allDates = new Set();
    
    selectedIndicators.forEach(ind => {
        const data = currentPatient.indicators[ind];
        if (data) {
            data.forEach(d => allDates.add(d.date));
        }
    });
    
    const sortedDates = Array.from(allDates).sort();
    
    selectedIndicators.forEach(ind => {
        const data = currentPatient.indicators[ind];
        if (data) {
            const values = sortedDates.map(date => {
                const point = data.find(d => d.date === date);
                return point ? point.value : null;
            });
            
            datasets.push({
                label: ind,
                data: values,
                borderColor: indicatorColors[ind] || '#64748b',
                backgroundColor: indicatorColors[ind] ? `${indicatorColors[ind]}20` : '#64748b20',
                tension: 0.3,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8,
            });
        }
    });
    
    indicatorChart.data.labels = sortedDates;
    indicatorChart.data.datasets = datasets;
    indicatorChart.update();
}

// 显示节点详情
function showNodeDetail(index) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('detailPage').classList.add('active');
    renderDetailPage(index);
}

// 渲染详情页面
function renderDetailPage(activeIndex) {
    const page = document.getElementById('detailPage');
    const event = currentPatient.timeline[activeIndex];
    
    page.innerHTML = `
        <div class="page-header">
            <button class="btn btn-secondary" onclick="backToDashboard()">
                <i class="fas fa-arrow-left"></i> 返回看板
            </button>
            <h2>${currentPatient.name} - 病例详情</h2>
        </div>
        <div class="detail-layout">
            <div class="detail-sidebar">
                <h4>诊疗事件</h4>
                <div class="event-list">
                    ${currentPatient.timeline.map((e, i) => `
                        <div class="event-item ${i === activeIndex ? 'active' : ''}" onclick="switchEvent(${i})">
                            <div class="event-date">${e.date}</div>
                            <div class="event-title">${e.title}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="detail-content">
                <div class="detail-header">
                    <h2>${event.title} (${event.hospital})</h2>
                    <div class="key-indicators">
                        ${renderKeyIndicators(event.date)}
                    </div>
                </div>
                <div class="detail-section">
                    <h3><i class="fas fa-stethoscope"></i> 临床诊断</h3>
                    <p>${currentPatient.disease} ${currentPatient.stage || ''}</p>
                    <p>合并症：${currentPatient.complications.length > 0 ? currentPatient.complications.join('、') : '无'}</p>
                </div>
                <div class="detail-section">
                    <h3><i class="fas fa-flask"></i> 实验室检查</h3>
                    <table class="lab-table">
                        <thead>
                            <tr>
                                <th>检查项目</th>
                                <th>结果</th>
                                <th>参考范围</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${renderLabResults(event.date)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 渲染关键指标
function renderKeyIndicators(date) {
    let html = '';
    for (const [ind, data] of Object.entries(currentPatient.indicators)) {
        const point = data.find(d => d.date === date);
        if (point) {
            const range = indicatorRanges[ind];
            const isAbnormal = range && (point.value < range.min || point.value > range.max);
            html += `
                <div class="key-indicator ${isAbnormal ? 'abnormal' : 'normal'}">
                    <i class="fas ${isAbnormal ? 'fa-arrow-up' : 'fa-check'}"></i>
                    <span>${ind}: ${point.value} ${indicatorUnits[ind] || ''}</span>
                </div>
            `;
        }
    }
    return html || '<span style="color: var(--text-secondary)">暂无指标数据</span>';
}

// 渲染实验室结果
function renderLabResults(date) {
    let html = '';
    for (const [ind, data] of Object.entries(currentPatient.indicators)) {
        const point = data.find(d => d.date === date);
        if (point) {
            const range = indicatorRanges[ind];
            const isAbnormal = range && (point.value < range.min || point.value > range.max);
            const rangeStr = range ? `${range.min} - ${range.max} ${range.unit}` : '-';
            html += `
                <tr>
                    <td>${ind}</td>
                    <td class="${isAbnormal ? 'abnormal' : 'normal'}">${point.value} ${indicatorUnits[ind] || ''}</td>
                    <td>${rangeStr}</td>
                    <td>${isAbnormal ? '<span class="status error">异常</span>' : '<span class="status success">正常</span>'}</td>
                </tr>
            `;
        }
    }
    return html || '<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">暂无检查数据</td></tr>';
}

function switchEvent(index) { renderDetailPage(index); }

// 返回病例看板
function backToDashboard() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('dashboardPage').classList.add('active');
}

// 返回患者列表
function backToPatients() {
    currentPatient = null;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('patientsPage').classList.add('active');
    
    // 恢复之前选中的分组状态
    if (currentGroup) {
        selectGroup(currentGroup);
    } else {
        selectGroup('all');
    }
}

// 模态框功能
function initModal() {
    const modal = document.getElementById('addPatientModal');
    const addBtn = document.getElementById('addPatientBtn');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const generateBtn = document.getElementById('generateBtn');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    addBtn.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = '添加新患者';
        modal.classList.add('active');
    });
    
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    cancelBtn.addEventListener('click', () => modal.classList.remove('active'));
    
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
    generateBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        startAIProcessing();
    });
}

function handleFiles(files) {
    const container = document.getElementById('uploadedFiles');
    Array.from(files).forEach(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        let iconClass = 'fa-file', iconType = 'doc';
        if (ext === 'pdf') { iconClass = 'fa-file-pdf'; iconType = 'pdf'; }
        else if (['jpg', 'jpeg', 'png'].includes(ext)) { iconClass = 'fa-file-image'; iconType = 'img'; }
        else if (['doc', 'docx'].includes(ext)) { iconClass = 'fa-file-word'; iconType = 'doc'; }
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-icon ${iconType}"><i class="fas ${iconClass}"></i></div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${(file.size / 1024).toFixed(1)} KB</div>
            </div>
            <div class="file-actions">
                <button class="btn-icon" title="删除" onclick="this.closest('.file-item').remove()">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(fileItem);
    });
}

function startAIProcessing() {
    const modal = document.getElementById('processingModal');
    modal.classList.add('active');
    const steps = ['step1', 'step2', 'step3', 'step4'];
    const progress = document.getElementById('aiProgress');
    let currentStep = 0;
    
    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            const stepEl = document.getElementById(steps[currentStep]);
            stepEl.classList.remove('active');
            stepEl.classList.add('completed');
            stepEl.querySelector('i').className = 'fas fa-check-circle';
            currentStep++;
            if (currentStep < steps.length) {
                const nextStepEl = document.getElementById(steps[currentStep]);
                nextStepEl.classList.add('active');
                nextStepEl.querySelector('i').className = 'fas fa-spinner fa-spin';
            }
            progress.style.width = ((currentStep / steps.length) * 100) + '%';
        } else {
            clearInterval(interval);
            setTimeout(() => {
                modal.classList.remove('active');
                steps.forEach((step, index) => {
                    const stepEl = document.getElementById(step);
                    stepEl.classList.remove('completed', 'active');
                    stepEl.querySelector('i').className = 'fas fa-circle';
                    if (index === 0) stepEl.classList.add('active');
                });
                progress.style.width = '0%';
                viewPatient('P001');
                showToast('患者信息生成成功！', 'success');
            }, 500);
        }
    }, 800);
}

function openAddMaterialModal() {
    document.getElementById('modalTitle').textContent = '补充资料';
    document.getElementById('addPatientModal').classList.add('active');
}

function openExportModal() {
    document.getElementById('exportModal').classList.add('active');
    document.querySelectorAll('.format-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.format-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        });
    });
}

function closeExportModal() { document.getElementById('exportModal').classList.remove('active'); }

function startExport() {
    closeExportModal();
    showToast('报告导出中...', 'success');
    setTimeout(() => showToast('报告已保存至下载文件夹', 'success'), 2000);
}

function initDepartments() {
    const container = document.getElementById('departmentsList');
    container.innerHTML = mockDepartments.map(dept => `
        <div class="department-card">
            <div class="department-header">
                <span class="department-name">${dept.name}</span>
                <div class="department-status"><span class="dot"></span><span>${dept.onlineCount}人在线</span></div>
            </div>
            <div class="department-stats">
                <div class="department-stat"><span class="value">${dept.totalCases}</span><span class="label">总病例数</span></div>
                <div class="department-stat"><span class="value">${dept.remainingCases}</span><span class="label">剩余配额</span></div>
            </div>
            <div class="department-diseases">${dept.diseases.map(d => `<span class="disease-tag">${d}</span>`).join('')}</div>
        </div>
    `).join('');
}

function initSettings() {
    const timeoutRange = document.getElementById('timeoutRange');
    const timeoutValue = document.getElementById('timeoutValue');
    if (timeoutRange && timeoutValue) {
        timeoutRange.addEventListener('input', () => { timeoutValue.textContent = timeoutRange.value + '秒'; });
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toast.className = 'toast ' + type;
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
