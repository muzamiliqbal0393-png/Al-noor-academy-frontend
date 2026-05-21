class SocketManager {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    connect() {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Connect to production backend URL for Socket.io
        this.socket = io('https://noor-academy-backend.vercel.app', {
            auth: { token }
        });

        this.socket.on('connect', () => {
            this.connected = true;
            console.log('🟢 Socket connected');
        });

        this.socket.on('disconnect', () => {
            this.connected = false;
            console.log('🔴 Socket disconnected');
        });

        this.socket.on('new_message', (message) => {
            this.onNewMessage(message);
        });

        this.socket.on('user_typing', (data) => {
            this.onUserTyping(data);
        });

        this.socket.on('user_stop_typing', (data) => {
            this.onUserStopTyping(data);
        });

        this.socket.on('class_scheduled', (classData) => {
            this.onClassScheduled(classData);
        });

        this.socket.on('progress_updated', (data) => {
            this.onProgressUpdated(data);
        });

        this.socket.on('achievement_earned', (data) => {
            this.onAchievementEarned(data);
        });

        this.socket.on('payment_success', (data) => {
            this.onPaymentSuccess(data);
        });

        this.socket.on('announcement', (data) => {
            this.onAnnouncement(data);
        });

        this.socket.on('user_online', (data) => {
            this.onUserOnline(data);
        });

        this.socket.on('user_offline', (data) => {
            this.onUserOffline(data);
        });
    }

    onNewMessage(message) {
        const msgCount = document.getElementById('msgCount');
        if (msgCount) {
            const current = parseInt(msgCount.textContent) || 0;
            msgCount.textContent = current + 1;
            msgCount.style.display = 'flex';
        }
        this.showToast(`💬 New message from ${message.sender?.name || 'Teacher'}`, 'info');
    }

    onUserTyping(data) {
        const typingEl = document.getElementById('typingIndicator');
        if (typingEl) {
            typingEl.style.display = 'block';
            typingEl.textContent = `${data.name} is typing...`;
        }
    }

    onUserStopTyping() {
        const typingEl = document.getElementById('typingIndicator');
        if (typingEl) typingEl.style.display = 'none';
    }

    onClassScheduled(classData) {
        this.showToast('📅 New class scheduled!', 'success');
    }

    onProgressUpdated(data) {
        this.showToast('📊 Progress report updated!', 'success');
        if (window.loadDashboard) window.loadDashboard();
    }

    onAchievementEarned(data) {
        this.showToast(`🏆 ${data.child} earned "${data.achievement.title}"! MashaAllah!`, 'gold');
    }

    onPaymentSuccess(data) {
        this.showToast('✅ Payment confirmed! JazakAllah Khair!', 'success');
    }

    onAnnouncement(data) {
        this.showToast(`📢 ${data.title}`, 'info');
    }

    onUserOnline(data) {
        const onlineDot = document.querySelector(`.online-dot[data-user="${data.userId}"]`);
        if (onlineDot) onlineDot.classList.replace('offline', 'online');
    }

    onUserOffline(data) {
        const onlineDot = document.querySelector(`.online-dot[data-user="${data.userId}"]`);
        if (onlineDot) onlineDot.classList.replace('online', 'offline');
    }

    sendMessage(receiverId, content) {
        if (this.socket) {
            this.socket.emit('send_message', { receiverId, content });
        }
    }

    emitTyping(receiverId) {
        if (this.socket) this.socket.emit('typing', { receiverId });
    }

    emitStopTyping(receiverId) {
        if (this.socket) this.socket.emit('stop_typing', { receiverId });
    }

    joinClass(classId) {
        if (this.socket) this.socket.emit('join_class', classId);
    }

    leaveClass(classId) {
        if (this.socket) this.socket.emit('leave_class', classId);
    }

    showToast(message, type = 'info') {
        const colors = {
            success: '#38a169', error: '#e53e3e',
            info: '#3182ce', gold: '#f0a500'
        };

        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 30px; right: 30px;
            background: ${colors[type] || colors.info};
            color: white; padding: 15px 25px;
            border-radius: 12px; font-size: 14px;
            font-weight: 600; z-index: 9999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            animation: slideUp 0.3s ease;
            max-width: 350px; line-height: 1.4;
            font-family: 'Poppins', sans-serif;
        `;
        toast.textContent = message;

        const style = document.createElement('style');
        style.textContent = `@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`;
        document.head.appendChild(style);

        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 4000);
    }

    disconnect() {
        if (this.socket) this.socket.disconnect();
    }
}

window.socketManager = new SocketManager();