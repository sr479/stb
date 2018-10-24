export class Json {
    static serializ(content: (string | object)): string {
        return JSON.stringify(content);
    }
    static deSerializ(content: string) {
        let result = null;
        if (content) {
            result = JSON.parse(content);
        }
        return result;
    }
}
