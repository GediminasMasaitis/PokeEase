interface JQuery {
    circleProgress(options: ICircleProgressOptions);
}

interface ICircleProgressOptions {
    value: number;
    size?: number;
    startAngle?: number;
    reverse?: boolean;
    thickness?: number | "auto";
    lineCap?: "butt" | "round" | "square";
    fill?: ICircleProgressFillOptions;
    emptyFill?: string;
    animation?: ICircleProgressAnimationOptions;
    animationValue?: number;
}

interface ICircleProgressFillOptions {
    color?: string;
    gradient?: string[];
    gradientAngle?: number;
    gradientDirection?: number[];
    image?: string | HTMLImageElement;
}

interface ICircleProgressAnimationOptions {
    duration?: number;
    easing?: string;
}