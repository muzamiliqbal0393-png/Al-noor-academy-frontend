const API_URL = 'https://noor-academy-backend.vercel.app/api';

let currentUser = null;
let children = [];
let todayClasses = [];
let notifications = [];
let selectedChild = null;

// Initialize Dashboard
async function initDashboard() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    showLoadingState();

    try {
        await Promise.all([
            loadUserData(),
            loadChildren(),
            loadTodayClasses(),
            loadNotifications(),
            loadPaymentSummary(),
            loadAchievements(),
            loadResources()
        ]);

        hideLoadingState();
        window.socketManager.connect();
        startRealTimeClock();
        loadAttendanceCalendar();

    } catch (error) {
        console.error('Dashboard init error:', error);
        showError('Failed to load dashboard. Please refresh.');
    }
}

async function loadUserData() {
    const res = await API.getMe();
    if (res?.success) {
        currentUser = res.data;
        updateWelcomeBanner(currentUser);
    }
}

function updateWelcomeBanner(user) {
    const nameEl = document.getElementById('parentName');
    const avatarEl = document.getElementById('userAvatar');
    const topNameEl = document.getElementById('topbarName');

    if (nameEl) nameEl.textContent = user.name;
    if (topNameEl) topNameEl.textContent = user.name.split(' ')[0];

    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    if (avatarEl) avatarEl.textContent = initials;

    document.querySelectorAll('.user-initials').forEach(el => el.textContent = initials);
}

async function loadChildren() {
    const res = await API.getChildren();
    if (res?.success) {
        children = res.data;
        renderChildrenCards(children);
        updateStatsCard('childrenCount', children.length);
    }
}

function renderChildrenCards(childrenData) {
    const container = document.getElementById('childrenGrid');
    if (!container) return;

    if (!childrenData.length) {
        container.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:40px;color:#718096">
                <div style="font-size:50px;margin-bottom:15px">👶</div>
                <h3>No Children Enrolled Yet</h3>
                <p>Add your first child to get started!</p>
                <button onclick="showAddChildModal()" class="btn btn-primary" style="margin-top:15px">
                    <i class="fas fa-plus"></i> Add Child
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = childrenData.map(child => {
        const teacherName = child.teacher?.user?.name || 'Not Assigned';
        const teacherEmail = child.teacher?.user?.email || '';
        const progress = child.stats?.overallProgress || 0;
        const attendanceRate = child.stats?.totalClasses
            ? Math.round((child.stats.attendedClasses / child.stats.totalClasses) * 100)
            : 0;

        return `
            <div class="child-card" data-child-id="${child._id}">
                <div class="child-header">
                    <div class="child-avatar ${child.gender === 'male' ? 'boy' : 'girl'}">
                        ${child.gender === 'male' ? '👦' : '👧'}
                    </div>
                    <div style="flex:1">
                        <div class="child-name">${child.name}</div>
                        <div class="child-meta">
                            <span>Age: ${child.age}</span>
                            <span>•</span>
                            <span class="level-badge ${child.level}">${child.level}</span>
                        </div>
                    </div>
                    <div style="text-align:right">
                        <div style="font-size:22px;font-weight:700;color:var(--primary)">${progress}%</div>
                        <div style="font-size:11px;color:var(--text-light)">Overall</div>
                    </div>
                </div>

                <div class="child-info-row">
                    <i class="fas fa-book" style="color:var(--primary-light)"></i>
                    <span>Current: ${child.currentSurah?.name || 'Not Started'}</span>
                </div>
                <div class="child-info-row">
                    <i class="fas fa-chalkboard-teacher" style="color:var(--primary-light)"></i>
                    <span>Teacher: ${teacherName}</span>
                </div>
                <div class="child-info-row">
                    <i class="fas fa-calendar-check" style="color:var(--primary-light)"></i>
                    <span>Attendance: <strong>${attendanceRate}%</strong></span>
                </div>
                <div class="child-info-row">
                    <i class="fas fa-star" style="color:var(--secondary)"></i>
                    <span>Surahs Memorized: <strong>${child.stats?.surahsMemorized || 0}</strong></span>
                </div>

                <div class="progress-section">
                    <div class="progress-label">
                        <span>Overall Progress</span>
                        <span style="font-weight:700;color:var(--primary)">${progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:0%" data-width="${progress}%"></div>
                    </div>
                </div>

                <div class="child-actions">
                    <button class="btn btn-primary" onclick="joinClass('${child._id}')">
                        <i class="fas fa-video"></i> Join Class
                    </button>
                    <button class="btn btn-outline" onclick="viewChildProgress('${child._id}')">
                        <i class="fas fa-chart-bar"></i>
                    </button>
                    <button class="btn btn-outline" onclick="messageTeacher('${teacherEmail}')">
                        <i class="fas fa-comment"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    animateProgressBars();
}

async function loadTodayClasses() {
    const res = await API.getTodayClasses();
    if (res?.success) {
        todayClasses = res.data;
        renderSchedule(todayClasses);
        updateStatsCard('todayClassesCount', todayClasses.length);
    }
}

function renderSchedule(classes) {
    const container = document.getElementById('scheduleList');
    if (!container) return;

    if (!classes.length) {
        container.innerHTML = `
            <div style="text-align:center;padding:30px;color:#718096">
                <div style="font-size:40px;margin-bottom:10px">📅</div>
                <p>No classes scheduled for today</p>
            </div>
        `;
        return;
    }

    container.innerHTML = classes.map(cls => {
        const time = new Date(cls.scheduledAt);
        const hours = time.getHours();
        const mins = time.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours % 12 || 12;

        const statusColors = {
            scheduled: '#3182ce', ongoing: '#38a169',
            completed: '#718096', cancelled: '#e53e3e'
        };

        const statusIcons = { scheduled: '🔵', ongoing: '🟢', completed: '✅', cancelled: '❌' };

        return `
            <div class="class-item">
                <div class="class-time">
                    <div class="time">${displayHour}:${mins}</div>
                    <div class="ampm">${ampm}</div>
                </div>
                <div class="class-divider" style="background:linear-gradient(180deg,${statusColors[cls.status]},${statusColors[cls.status]}99)"></div>
                <div class="class-info">
                    <div class="class-child">${cls.child?.gender === 'male' ? '👦' : '👧'} ${cls.child?.name || 'Child'}</div>
                    <div class="class-subject"><i class="fas fa-book-reader"></i> ${cls.subject?.replace('_', ' ').toUpperCase()}</div>
                    <div class="class-teacher">👨‍🏫 ${cls.teacher?.user?.name || 'Teacher'}</div>
                    ${cls.homework?.assigned ? `<div style="font-size:11px;color:var(--warning);margin-top:3px">📝 HW: ${cls.homework.assigned.substring(0, 40)}...</div>` : ''}
                </div>
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
                    <span class="status-badge ${cls.status}">${statusIcons[cls.status]} ${cls.status}</span>
                    ${cls.status === 'scheduled' || cls.status === 'ongoing' ?
                `<button class="join-btn" onclick="joinClassById('${cls._id}','${cls.meetingLink}')">
                            <i class="fas fa-video"></i> Join
                        </button>` : ''
            }
                </div>
            </div>
        `;
    }).join('');
}

async function loadNotifications() {
    const res = await API.getNotifications();
    if (res?.success) {
        notifications = res.data;
        const unread = res.unreadCount || 0;
        updateNotificationBadge(unread);
        renderNotifications(notifications);
        renderActivityFeed(notifications);
    }
}

function updateNotificationBadge(count) {
    const badges = document.querySelectorAll('.notif-count');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

function renderNotifications(notifs) {
    const container = document.getElementById('notifList');
    if (!container) return;

    const icons = {
        class_reminder: '📅', payment_success: '💳',
        new_message: '💬', achievement: '🏆',
        progress_report: '📊', announcement: '📢', system: '⚙️'
    };

    container.innerHTML = notifs.slice(0, 8).map(n => `
        <div class="notif-item ${!n.isRead ? 'unread' : ''}" onclick="markNotifRead('${n._id}')">
            ${!n.isRead ? '<div class="notif-dot"></div>' : '<div style="width:8px"></div>'}
            <div>
                <div class="notif-text">${icons[n.type] || '🔔'} ${n.title}</div>
                <div class="notif-time">${n.message.substring(0, 60)}${n.message.length > 60 ? '...' : ''}</div>
                <div class="notif-time" style="margin-top:3px">${timeAgo(n.createdAt)}</div>
            </div>
        </div>
    `).join('');
}

function renderActivityFeed(notifs) {
    const container = document.getElementById('activityFeed');
    if (!container) return;

    const icons = {
        class_reminder: { icon: 'fa-calendar', color: 'info' },
        payment_success: { icon: 'fa-credit-card', color: 'success' },
        new_message: { icon: 'fa-comment', color: 'info' },
        achievement: { icon: 'fa-trophy', color: 'gold' },
        progress_report: { icon: 'fa-file-alt', color: 'success' },
        announcement: { icon: 'fa-bullhorn', color: 'warning' }
    };

    container.innerHTML = notifs.slice(0, 6).map(n => {
        const iconData = icons[n.type] || { icon: 'fa-bell', color: 'info' };
        return `
            <div class="activity-item">
                <div class="activity-icon ${iconData.color}">
                    <i class="fas ${iconData.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${n.message}</div>
                    <div class="activity-time">⏰ ${timeAgo(n.createdAt)}</div>
                </div>
            </div>
        `;
    }).join('');
}

async function loadPaymentSummary() {
    const res = await API.getPaymentSummary();
    if (res?.success) {
        const data = res.data;
        const paymentStatus = document.getElementById('paymentStatus');
        const paymentPlan = document.getElementById('paymentPlan');
        const paymentAmount = document.getElementById('paymentAmount');
        const nextDue = document.getElementById('nextDueDate');
        const historyEl = document.getElementById('paymentHistory');

        if (paymentStatus) paymentStatus.textContent = data.lastPayment ? '✅ Paid' : '⚠️ Pending';
        if (paymentPlan) paymentPlan.textContent = data.currentPlanName || 'No Plan';
        if (paymentAmount) paymentAmount.textContent = data.lastPayment ? `$${data.lastPayment.amount}` : '$0';
        if (nextDue && data.nextDueDate) {
            nextDue.textContent = new Date(data.nextDueDate).toLocaleDateString();
        }

        const payments = await API.getPayments();
        if (payments?.success && historyEl) {
            historyEl.innerHTML = payments.data.slice(0, 3).map(p => `
                <div class="payment-history-item">
                    <div>
                        <div style="font-weight:600">${new Date(p.createdAt).toLocaleDateString('en', { month: 'long', year: 'numeric' })}</div>
                        <div style="font-size:11px;color:var(--text-light)">${p.planDetails?.name || p.plan}</div>
                    </div>
                    <div style="font-weight:700">$${p.amount}</div>
                    <span class="payment-status ${p.status}">
                        ${p.status === 'paid' ? '✓' : '⚠'} ${p.status}
                    </span>
                </div>
            `).join('');
        }

        const totalPaidEl = document.getElementById('totalPaid');
        if (totalPaidEl) totalPaidEl.textContent = `$${data.totalPaid?.toFixed(2) || '0.00'}`;
    }
}

async function loadAchievements() {
    const res = await API.getAllAchievements();
    if (res?.success) {
        renderAchievements(res.data);
    }
}

function renderAchievements(achievementData) {
    const container = document.getElementById('achievementsList');
    if (!container) return;

    if (!achievementData.length) {
        container.innerHTML = '<p style="text-align:center;color:#718096;font-size:13px">No achievements yet. Keep learning!</p>';
        return;
    }

    const tierColors = {
        bronze: { bg: 'rgba(180,100,0,0.1)', color: '#b46400' },
        silver: { bg: 'rgba(113,128,150,0.1)', color: '#718096' },
        gold: { bg: 'rgba(240,165,0,0.1)', color: '#f0a500' },
        platinum: { bg: 'rgba(0,137,123,0.1)', color: '#00897b' }
    };

    container.innerHTML = achievementData.slice(0, 5).map(a => {
        const colors = tierColors[a.tier] || tierColors.bronze;
        return `
            <div class="achievement-item">
                <div class="achievement-icon">${a.icon || '🏆'}</div>
                <div class="achievement-info">
                    <h5>${a.title}</h5>
                    <p>${a.child?.name || 'Child'} — ${a.description || ''}</p>
                </div>
                <span class="achievement-badge" style="background:${colors.bg};color:${colors.color}">
                    ${a.tier}
                </span>
            </div>
        `;
    }).join('');
}

async function loadResources() {
    const res = await API.getResources();
    if (res?.success) {
        renderResources(res.data);
    }
}

function renderResources(resources) {
    const container = document.getElementById('resourcesGrid');
    if (!container) return;

    const typeIcons = { pdf: '📄', video: '📹', audio: '🎵', image: '🖼️', link: '🔗' };
    const typeColors = {
        pdf: 'rgba(26,92,56,0.1)', video: 'rgba(0,137,123,0.1)',
        audio: 'rgba(240,165,0,0.1)', image: 'rgba(49,130,206,0.1)', link: 'rgba(221,107,32,0.1)'
    };

    container.innerHTML = resources.slice(0, 4).map(r => `
        <div class="resource-card" onclick="openResource('${r._id}','${r.url}')">
            <div class="resource-icon" style="background:${typeColors[r.type] || 'rgba(26,92,56,0.1)'}">
                ${typeIcons[r.type] || '📁'}
            </div>
            <div class="resource-title">${r.title}</div>
            <div class="resource-meta">${r.category} • ${r.type.toUpperCase()}</div>
            <button class="btn btn-outline" style="width:100%;justify-content:center;margin-top:12px;font-size:12px;padding:7px">
                <i class="fas fa-${r.type === 'video' ? 'play' : r.type === 'audio' ? 'play' : 'download'}"></i>
                ${r.type === 'video' ? 'Watch' : r.type === 'audio' ? 'Listen' : 'Download'}
            </button>
        </div>
    `).join('');
}

async function loadAttendanceCalendar() {
    if (!children.length) return;

    const child = children[0];
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const res = await API.getAttendance(child._id, month, year);
    if (res?.success) {
        renderCalendar(res.data, month, year);

        const attRate = document.getElementById('attendanceRate');
        if (attRate) attRate.textContent = `${res.data.rate}%`;
    }
}

function renderCalendar(data, month, year) {
    const calDays = document.getElementById('calendarDays');
    if (!calDays) return;

    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const today = new Date().getDate();

    const presentDates = data.classes
        .filter(c => c.attendance?.studentPresent)
        .map(c => new Date(c.scheduledAt).getDate());

    const absentDates = data.classes
        .filter(c => c.status === 'missed')
        .map(c => new Date(c.scheduledAt).getDate());

    let html = '';
    for (let i = 0; i < firstDay; i++) html += '<div class="cal-day empty"></div>';

    for (let d = 1; d <= daysInMonth; d++) {
        let cls = 'cal-day';
        if (d === today) cls += ' today';
        else if (presentDates.includes(d)) cls += ' present';
        else if (absentDates.includes(d)) cls += ' absent';

        html += `<div class="${cls}">${d}</div>`;
    }

    calDays.innerHTML = html;
}

// Actions
async function markNotifRead(id) {
    const res = await API.markAsRead(id);
    if (res?.success) {
        loadNotifications();
    }
}

async function markAllRead() {
    const res = await API.markAllAsRead();
    if (res?.success) {
        loadNotifications();
        window.socketManager.showToast('✅ All notifications marked as read', 'success');
    }
}

function joinClassById(classId, meetingLink) {
    window.socketManager.joinClass(classId);
    if (meetingLink) {
        window.socketManager.showToast('🎥 Launching class... Connecting to teacher', 'success');
        setTimeout(() => { window.open(meetingLink, '_blank'); }, 1000);
    } else {
        window.socketManager.showToast('⚠️ Meeting link not available yet', 'error');
    }
}

function joinClass(childId) {
    const cls = todayClasses.find(c => c.child?._id === childId);
    if (cls) {
        joinClassById(cls._id, cls.meetingLink);
    } else {
        window.socketManager.showToast('No class scheduled for today', 'error');
    }
}

function viewChildProgress(childId) {
    selectedChild = children.find(c => c._id === childId);
    if (selectedChild) loadChildProgressDetail(childId);
}

async function loadChildProgressDetail(childId) {
    const res = await API.getProgress(childId);
    if (res?.success && res.latest) {
        const scores = res.latest.scores;
        const progressItems = [
            { name: 'Quran Reading', key: 'quranReading', color: 'var(--primary)' },
            { name: 'Tajweed', key: 'tajweed', color: 'var(--accent)' },
            { name: 'Memorization', key: 'memorization', color: 'var(--secondary)' },
            { name: 'Arabic', key: 'arabicLetters', color: 'var(--info)' }
        ];

        const progressContainer = document.getElementById('progressContainer');
        if (progressContainer) {
            progressContainer.innerHTML = progressItems.map(item => `
                <div class="progress-item">
                    <div class="progress-item-label">
                        <span class="progress-item-name">${item.name}</span>
                        <span class="progress-item-percent" style="color:${item.color}">${scores[item.key] || 0}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${scores[item.key] || 0}%; background:linear-gradient(90deg,${item.color},${item.color}99)"></div>
                    </div>
                </div>
            `).join('');
        }
    }
}

async function messageTeacher(teacherEmail) {
    if (!teacherEmail) {
        window.socketManager.showToast('Teacher contact not available', 'error');
        return;
    }
    window.socketManager.showToast('💬 Opening message...', 'info');
    document.getElementById('messageSection')?.scrollIntoView({ behavior: 'smooth' });
}

async function sendPayment(plan) {
    const res = await API.createPayment({ plan, paymentMethod: 'card' });
    if (res?.success) {
        window.socketManager.showToast('✅ Payment successful! JazakAllah Khair!', 'success');
        loadPaymentSummary();
    } else {
        window.socketManager.showToast(res?.message || 'Payment failed', 'error');
    }
}

function openResource(id, url) {
    API.request(`/resources/${id}/download`, { method: 'POST' });
    if (url) window.open(url, '_blank');
    else window.socketManager.showToast('📥 Downloading resource...', 'info');
}

// Sidebar navigation
function setActive(el) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    overlay?.classList.toggle('show');
}

function closeSidebar() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('overlay')?.classList.remove('show');
}

function toggleNotif() {
    document.getElementById('notifPanel')?.classList.toggle('show');
}

document.addEventListener('click', (e) => {
    const panel = document.getElementById('notifPanel');
    if (!e.target.closest('.notif-btn') && !e.target.closest('.notif-panel')) {
        panel?.classList.remove('show');
    }
});

// Logout
async function logout() {
    await API.logout();
    localStorage.clear();
    window.socketManager.disconnect();
    window.location.href = '/index.html';
}

// Utilities
function animateProgressBars() {
    setTimeout(() => {
        document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
        });
    }, 300);
}

function showLoadingState() {
    document.querySelectorAll('.stat-number').forEach(el => {
        el.innerHTML = '<div style="width:40px;height:20px;background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:skeleton 1.5s infinite;border-radius:4px"></div>';
    });
}

function hideLoadingState() { }

function showError(msg) {
    window.socketManager.showToast(msg, 'error');
}

function startRealTimeClock() {
    const updateTime = () => {
        const now = new Date();
        const timeEl = document.getElementById('currentTime');
        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
        }
    };
    updateTime();
    setInterval(updateTime, 1000);
}

function timeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
}

function updateStatsCard(id, value) {
    const el = document.getElementById(id);
    if (el) {
        let count = 0;
        const target = parseInt(value);
        if (isNaN(target)) { el.textContent = value; return; }
        const interval = setInterval(() => {
            count = Math.min(count + Math.ceil(target / 20), target);
            el.textContent = count;
            if (count >= target) clearInterval(interval);
        }, 60);
    }
}

// Make functions global
window.loadDashboard = initDashboard;
window.logout = logout;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.toggleNotif = toggleNotif;
window.setActive = setActive;
window.markAllRead = markAllRead;
window.markNotifRead = markNotifRead;
window.joinClassById = joinClassById;
window.joinClass = joinClass;
window.viewChildProgress = viewChildProgress;
window.sendPayment = sendPayment;
window.openResource = openResource;
window.messageTeacher = messageTeacher;

// Init
document.addEventListener('DOMContentLoaded', initDashboard);