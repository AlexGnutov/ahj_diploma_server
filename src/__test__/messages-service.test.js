const MessagesService = require('../services/messages-service');

test('Test getSelection() over limit', () => {
    const service = new MessagesService();
    const overLimit = service.messagesContainer.length;
    const result = service.getSelection(overLimit);
    const expected = [];
    expect(result).toEqual(expected);
})

test('Test getSelection() near limit', () => {
    const service = new MessagesService();
    const nearLimit = service.messagesContainer.length - 2;
    const result = service.getSelection(nearLimit);
    const expectedLength = 2;
    expect(result.length).toBe(expectedLength);
})

test('Test getSelection() far from limit', () => {
    const service = new MessagesService();
    const farFromLimit = service.messagesContainer.length - 10;
    const result = service.getSelection(farFromLimit);
    const expectedLength = 5;
    expect(result.length).toBe(expectedLength);
})

test('Test sortByDate()', () => {
    const sample = [
        {date: 1000},
        {date: 1100},
        {date: 1002},
        {date: 1005},
        {date: 1003},
    ];
    const expected = [
        {date: 1000},
        {date: 1002},
        {date: 1003},
        {date: 1005},
        {date: 1100},
    ];
    const service = new MessagesService();
    const result = service.sortByDate(sample);
    expect(result).toEqual(expected);
})
