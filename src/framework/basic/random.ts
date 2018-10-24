export var Random = {
    /**
     * startAt-maxItem的随机整数，包含startAt但不包含maxItem
     */
    scope(startAt: any, maxItem: any) {
        let differ = maxItem - startAt;
        Math.random() * differ;
        let num = Math.random() * differ + startAt;
        return parseInt(num, 10);
    },
    /**
     * 几率获取函数
     * @param percent 1 - 10 对应几率百分比
     */
    raffle(percent: any): boolean {
        let retu = false;
        percent = Math.round(percent);

        let num = Random.scope(1, 10);

        if (num <= percent) {
            retu = true;
        }

        return retu;
    }
}