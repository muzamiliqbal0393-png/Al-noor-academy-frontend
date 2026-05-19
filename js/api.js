const API_URL = 'http://localhost:5000/api';

class API {
    static getToken() {
        return localStorage.getItem('token');
    }

    static getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
        };
    }

    static async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (response.status === 401) {
                localStorage.clear();
                window.location.href = '/index.html';
                return;
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async get(endpoint) {
        return this.request(endpoint);
    }

    static async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    static async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    static async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Auth
    static login(email, password) { return this.post('/auth/login', { email, password }); }
    static register(data) { return this.post('/auth/register', data); }
    static getMe() { return this.get('/auth/me'); }
    static logout() { return this.get('/auth/logout'); }
    static updateProfile(data) { return this.put('/auth/update-profile', data); }

    // Children
    static getChildren() { return this.get('/children'); }
    static getChild(id) { return this.get(`/children/${id}`); }
    static addChild(data) { return this.post('/children', data); }
    static updateChild(id, data) { return this.put(`/children/${id}`, data); }
    static deleteChild(id) { return this.delete(`/children/${id}`); }
    static getChildStats(id) { return this.get(`/children/${id}/stats`); }

    // Classes
    static getClasses(params = '') { return this.get(`/classes${params}`); }
    static getTodayClasses() { return this.get('/classes/today'); }
    static scheduleClass(data) { return this.post('/classes', data); }
    static cancelClass(id, reason) { return this.put(`/classes/${id}/cancel`, { reason }); }
    static rescheduleClass(id, date) { return this.put(`/classes/${id}/reschedule`, { newScheduledAt: date }); }
    static submitFeedback(id, data) { return this.post(`/classes/${id}/feedback`, data); }
    static getAttendance(childId, month, year) { return this.get(`/classes/attendance/${childId}?month=${month}&year=${year}`); }

    // Progress
    static getProgress(childId) { return this.get(`/progress/${childId}`); }
    static getMonthlyReport(childId, month, year) { return this.get(`/progress/${childId}/report/${month}/${year}`); }
    static updateProgress(childId, data) { return this.post(`/progress/${childId}`, data); }

    // Messages
    static getConversations() { return this.get('/messages/conversations'); }
    static getMessages(userId) { return this.get(`/messages/${userId}`); }
    static sendMessage(data) { return this.post('/messages', data); }
    static getUnreadCount() { return this.get('/messages/unread/count'); }

    // Payments
    static createPayment(data) { return this.post('/payments', data); }
    static getPayments() { return this.get('/payments'); }
    static getPaymentSummary() { return this.get('/payments/summary'); }

    // Achievements
    static getAchievements(childId) { return this.get(`/achievements/${childId}`); }
    static getAllAchievements() { return this.get('/achievements/parent/all'); }

    // Notifications
    static getNotifications() { return this.get('/notifications'); }
    static markAsRead(id) { return this.put(`/notifications/${id}/read`); }
    static markAllAsRead() { return this.put('/notifications/read-all'); }
    static deleteNotification(id) { return this.delete(`/notifications/${id}`); }

    // Resources
    static getResources(params = '') { return this.get(`/resources${params}`); }
    static getResource(id) { return this.get(`/resources/${id}`); }

    // Admin
    static getAdminStats() { return this.get('/admin/stats'); }
    static getAllUsers(params = '') { return this.get(`/admin/users${params}`); }
    static sendAnnouncement(data) { return this.post('/admin/announcement', data); }
    static assignTeacher(data) { return this.post('/admin/assign-teacher', data); }
}

window.API = API;