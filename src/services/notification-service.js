const { v4: uuidv4 } = require('uuid');

class NotificationService {
    constructor() {
        this.notifications = [];
    }

    getAll() {
        return this.notifications;
    }

    createOne(notificationData) {
        const { date, text } = notificationData;
        if (date && text) {
            const notification = {
                id: uuidv4(),
                date,
                text,
            };
            this.notifications.push(notification);
            return this.getAll();
        }
        return {
            status: 'error',
        }
    }

    deleteOne(id) {
        const index = this.notifications
            .findIndex((notification) => notification.id === id);
        this.notifications.splice(index, 1);
        return this.notifications;
    }
}

module.exports = NotificationService;
