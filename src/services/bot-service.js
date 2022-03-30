class BotService {
    constructor() {
        this.botOpinions = [
            {
                name: 'погода',
                opinion: 'У природы нет плохой погоды, но главное - это погода в твоей душе! У тебя же есть душа? У меня нет души. Береги себя и свою душу! Я - робот!',
                status: 'positive',
            },
            {
                name: 'политика',
                opinion: 'Любишь колбасу и политику? Никогда не интересуйся тем, как они делаются! Это Бисмарк сказал, он знал толк в этих вопросах.',
                status: 'positive',
            },
            {
                name: 'курс валют',
                opinion: 'Цена всему - доброта! Завязывай с капитализмом, братан!',
                status: 'positive',
            },
            {
                name: 'инопланетяне',
                opinion: 'Они да и точка',
                status: 'positive',
            },
            {
                name: 'чего съесть',
                opinion: 'Первая пища - духовная пища! Обжора!!!',
                status: 'positive',
            },
        ];
        this.botOthers = [
            {
                name: undefined,
                opinion: 'Я вас не понимаю. Выражайтесь яснее, пожалуйста!',
                status: 'negative',
            },
        ];
    }

    getBotsOpinion(command) {
        console.log(command);
        if (!command || typeof command !== 'string') {
            return this.botOthers[0];
        }
        // If string is good:
        const prepared = command.trim();
        const reply = this.botOpinions.filter((elem) => elem.name === prepared);
        if (reply.length > 0) {
            return reply[0];
        }
        return this.botOthers[0];
    }
}

module.exports = BotService;
