class ToastController implements IToastController {
    private config: IToastControllerConfig;

    constructor(config: IToastControllerConfig) {
        this.config = config;
    }

    public addToast = (title: string, body: string, bgColor:string, textColor:string, delay:number):void => {
        this.config.toastElement.text(title);
        this.config.toastElement.append("<div class='countdown'></div>");
        this.config.toastElement.css({
            "background-color": bgColor,
            "color": textColor
        });
        if (body.length > 0) {
            this.config.toastElement.append(`<div class='description'>${body}</div>`);
        }
        this.config.toastElement.finish().animate({"top": "25px"}, 500, "easeOutBack");
        const countdownElement = this.config.toastElement.find(".countdown");
        countdownElement.finish().animate({"width": "0"}, delay, "linear");
        const animateTopTo = -(this.config.toastElement.outerHeight() + 2);
        this.config.toastElement.delay(delay-500).animate({"top": animateTopTo}, 500, "easeInOutQuart");
    }
}
