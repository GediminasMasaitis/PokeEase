class ConsoleController implements IConsoleController {
    private config: IConsoleControllerConfig;

    constructor(config: IConsoleControllerConfig) {
        this.config = config;
    }

    public log = (logEvent: ILogEvent): void => {
        const items = this.config.consoleElement.find(".items");
        const html = 
`<div class="event">
    <div class="item" style="font-family:monospace; white-space: pre-wrap; color:${logEvent.Color}">${logEvent.Message}</div>
</div>`;
        const element = $(html);
        const scroll = this.isAtBottom(items);
        items.append(element);
        if (scroll) {
            this.scrollToBottom(items);
        }
    }

    private isAtBottom = (container: JQuery): boolean => {
        const scrollTop = container.scrollTop();
        const innerHeight = container.innerHeight();
        const scrollHeight = container[0].scrollHeight;
        const atBottom = scrollTop + innerHeight > scrollHeight - 200;
        return atBottom;
    };

    private scrollToBottom(container: JQuery): void {
        container.finish().animate({
            scrollTop: container.prop("scrollHeight") - container.height()
        }, 100);
    };
}