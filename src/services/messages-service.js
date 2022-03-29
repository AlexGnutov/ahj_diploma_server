class MessagesService {
    constructor() {
        this.messages = [];
        this.fillMessages();
    }

    fillMessages() {
        for (let i = 0; i <= 15; i += 1) {
            this.messages.push({
                id: 5,
                user: 'Robot',
                date: 1643662840000 + 15000000 * i,
                content: `Hello Message ${i}`,
                attachment: [],
                fileTypes: [],
                type: 'text',
                status: 'regular',
            })
        }
    }

    sortLaterThanDate(dateString) {
        const date = parseInt('' + dateString);
        return this.messages
            .filter((message) => message.date < date);
    }

    sortNewerThanDate(dateString) {
        const date = parseInt('' + dateString);
        return this.messages
            .filter((message) => message.date < date);
    }

    sortByDate(array) {
        return array.sort((a, b) => {
            return a.date - b.date;
        })
    }

    getAll() {
        return this.messages;
    }

    getPrevious(dateS, qty = '2') {
        const previous = this.sortLaterThanDate(dateS);
        if (previous.length === 0) {
            return [];
        }
        const sorted = this.sortByDate(previous);
        const quantity = parseInt('' + qty, 10);
        if (sorted.length <= quantity) {
            return sorted;
        }
        return sorted.slice(sorted.length - quantity);
    }

    getSelection(startIndexS, qtyS = '10') {
        const startIndex = parseInt(''+ startIndexS, 10);
        const qty = parseInt(''+ qtyS, 10);
        const maxIndex = this.messages.length - 1;
        // Check start index limit
        if (startIndex > maxIndex) {
            return [];
        }
        if (startIndex === maxIndex) {
            return [this.messages[startIndex]];
        }
        // Check stop index limit
        let stopIndex = startIndex + qty - 1;
        if (stopIndex > maxIndex) {
            stopIndex = maxIndex;
        }
        const output = [];
        for (let i = startIndex; i <= stopIndex; i += 1) {
            output.push(this.messages[i]);
        }
        return output;
    };

    findByType(messageType) {
        return this.messages.filter((message) => message.type === messageType);
    }

    findByContent(searchWord) {
        return this.messages.filter((message) => message.content.includes(searchWord));
    }

    createOne(messageData) {
        const {user, date, content, attachment, fileTypes, status, type} = JSON.parse(messageData);

        if (user && date && content && status && type) {
            const newMessage = {
                user,
                date,
                content,
                attachment,
                fileTypes,
                status,
                type,
            };
            this.messages.push(newMessage);
            console.log('message added', this.messages);
            return newMessage;
        }

        return null;
    }

    getContentInformation() {
        const output = [];
        this.messages.filter((message) => message.attachment.length > 0)
            .forEach((message) => {
               message.attachment.forEach((fileName, index) => {
                   output.push({
                       date: message.date,
                       fileName: fileName,
                       fileType: message.fileTypes[index],
                   });
               })
            });
        return output;
    }
}

module.exports = MessagesService;
