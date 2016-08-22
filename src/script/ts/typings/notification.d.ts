declare var Notification: {
    new (title: string, options?: NotificationOptions): Notification;
    prototype: Notification;
    permission: string;
    requestPermission(): Promise<string>;
}

interface NotificationOptions {
    dir?: string;
    lang?: string;
    body?: string;
    tag?: string;
    icon?: string;
    data?: any;
    vibrate?: number[];
    renotify?: boolean;
    silent?: boolean;
    sound?: string;
    noscreen?: boolean;
    sticky?: boolean;
}

interface Notification {
    title: string;
    dir: string;
    lang: string;
    body: string;
    tag: string;
    icon: string;
    data: any;
    silent: boolean;
    timestamp: number;
    noscreen: boolean;
    renotify: boolean;
    sound: string;
    sticky: boolean;
    vibrate: number[];
    onclick: Function;
    onerror: Function;
    close(): void;
}

