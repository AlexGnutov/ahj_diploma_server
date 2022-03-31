class CacheService {
    constructor() {
        this.contentDataCache = '';
    }

    getContentDataCache() {
        return this.contentDataCache;
    }

    updateContentDataCache(dataArray) {
        this.contentDataCache = JSON.stringify(dataArray);
    }
}

module.exports = CacheService;
