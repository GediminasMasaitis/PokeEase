class TimeUtils {
    public static getCurrentTimestampMs = (): string => {
        const timeStamp = Date.now();
        return timeStamp.toString();
    }

    public static timestampToDateStr = (timestamp: number): string => {
        const totalSeconds = Math.floor(timestamp / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        let dateStr: string;
        if (totalDays > 0) {
            dateStr = `${totalDays} day`;
            if (totalDays > 1) {
                dateStr += "s";
            }
        }
        else if (totalHours > 0) {
            dateStr = `${totalHours} hour`;
            if (totalHours > 1) {
                dateStr += "s";
            }
        }
        else if (totalMinutes > 0) {
            dateStr = `${totalMinutes} minute`;
            if (totalMinutes > 1) {
                dateStr += "s";
            }
        }
        else {
            dateStr = `${totalSeconds} second`;
            if (totalSeconds > 1) {
                dateStr += "s";
            }
        }
        return dateStr;
    }
}