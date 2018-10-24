export function FormatTime(seconds: number, format?: string) {
    let hours: any, mins: any, secs: any;
    format = format || 'hh:mm:ss';

    hours = Math.floor(seconds / 3600);
    mins = Math.floor((seconds % 3600) / 60);
    secs = Math.floor((seconds % 3600) % 60);

    hours = hours < 10 ? ("0" + hours) : hours;
    mins = mins < 10 ? ("0" + mins) : mins;
    secs = secs < 10 ? ("0" + secs) : secs;
    return format.replace('hh', hours).replace('mm', mins).replace('ss', secs);
}