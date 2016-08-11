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
        const hours = totalHours - totalDays * 24;
        const minutes = totalMinutes - totalHours * 60;
        const seconds = totalSeconds - totalMinutes * 60;

        let dateStr = "";
        if (totalDays > 0) {
            dateStr += `${totalDays} days `;
        }
        if (hours > 0) {
            dateStr += `${hours} hours `;
        }
        if (minutes > 0) {
            dateStr += `${minutes} minutes `;
        }
        if (seconds > 0) {
            dateStr += `${seconds} seconds`;
        }
        return dateStr;
    }
}