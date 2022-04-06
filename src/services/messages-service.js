const { v4: uuidv4 } = require('uuid');

class MessagesService {
    constructor(updateRouter, cacheService) {
        this.messages = [];
        this.updateRouter = updateRouter;
        this.cacheService = cacheService;
        this.fillMessages();
        this.cacheService.updateContentDataCache(this.getContentData());
        this.fileTypeTransforms = [
            ['audio', 'Аудио'],
            ['video', 'Видео'],
            ['text', 'Тексты'],
            ['image', 'Картинки'],
            ['pdf', 'PDF'],
            ['msword', 'Тексты'],
        ];
    }

    // Prepares 15 messages for testing
    fillMessages() {
        for (let i = 0; i <= 15; i += 1) {
            this.messages.push({
                id: uuidv4(),
                user: 'Robot',
                date: 1643662840000 + 25000000 * i,
                content: `Hello Message ${i}`,
                attachment: [],
                fileTypes: [],
                type: 'text',
                status: 'regular',
            })
        }
    }

    sortOlderThanDate(dateString) {
        const date = parseInt('' + dateString);
        return this.messages
            .filter((message) => message.date < date);
    }

    sortNewerThanDate(dateString) {
        const date = parseInt('' + dateString);
        return this.messages
            .filter((message) => message.date < date);
    }

    // Sorts messages by date
    sortByDate(array) {
        return array.sort((a, b) => {
            return a.date - b.date;
        })
    }

    // Returns all messages
    getAll() {
        return this.messages;
    }

    getPrevious(dateS, qtyS = '2') {
        const previous = this.sortOlderThanDate(dateS);
        if (previous.length === 0) {
            return [];
        }
        const sorted = this.sortByDate(previous);
        const quantity = parseInt('' + qtyS, 10);
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

    // Search if message content matches search word
    findByWordInContent(searchWord) {
        return this.messages.filter((message) => message.content.includes(searchWord));
    }
    // Search in message files
    findByWordInFiles(searchWord) {
        return this.messages.filter((message) => message.attachment.toString().includes(searchWord));
    }

    // Process file type
    processContentDataTypes(array) {
        const output = [];
        array.forEach((x) => {
            let newFileType = 'Другое';
            this.fileTypeTransforms.forEach((type) => {
                if (x.includes(type[0])) {
                    [, newFileType] = type;
                }
            });
            output.push(newFileType);
        });
        console.log(output);
        return output;
    }

    // Creates one new message and initiates content update
    createOne(messageData) {
        const {user, date, content, attachment, fileTypes, status, type} = JSON.parse(messageData);
        // Message can be empty (have only files)
        if (user && date && status && type) {
            const newMessage = {
                id: uuidv4(),
                user,
                date: parseInt('' + date, 10),
                content,
                attachment,
                fileTypes: this.processContentDataTypes(fileTypes),
                status,
                type,
            };
            this.messages.push(newMessage);
            if (attachment.length > 0) {
                this.sendContentDataUpdate();
            }
            return newMessage;
        }
        return null;
    }

    // Delete one message and initiates content update
    deleteOne(messageId) {
        const index = this.messages.findIndex((message) => message.id === messageId);
        if (index >= 0) {
            this.messages.splice(index, 1);
            return true;
        }
        return false;
    }

    // Scan messages and collect attachments information
    getContentData() {
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
    // Send data to SSE event emitter - used in Content Browser
    sendContentDataUpdate() {
        this.cacheService.updateContentDataCache(this.getContentData());
        this.updateRouter.events.emit('update');
    }
}

module.exports = MessagesService;
