class TimeUtils {
    public static getCurrentTimestampMs(): string {
        const timeStamp = Date.now();
        return timeStamp.toString();
    }
}