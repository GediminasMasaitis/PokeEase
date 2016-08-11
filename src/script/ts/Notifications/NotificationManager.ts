class NotificationManager implements INotificationManager {
    private config: INotificationManagerConfig;

    private notifications: INotification[];

    private timeUpdaterInterval: number;

    constructor(config: INotificationManagerConfig) {
        this.config = config;
        this.notifications = [];
        this.timeUpdaterInterval = setInterval(this.onUpdateTimerElapsed, 1000);
    }

    private onUpdateTimerElapsed = () => {
        const currentTime = Date.now();
        _.each(this.notifications, notification => {
            const diff = currentTime - notification.event.Timestamp;
            const diffStr = TimeUtils.timestampToDateStr(diff);
            const timestampElement = notification.element.find(".timestamp");
            timestampElement.text(diffStr + " ago");
        });
    }

    public addNotificationCapture = (pokemonCatch: IPokemonCapture): void => {
        const pokemonName = this.config.translationManager.translation.pokemonNames[pokemonCatch.Id];
        const html = `<div class="event catch">
                        <i class="fa fa-times dismiss"></i>
                        <div class="image">
                            <img src="images/pokemon/${pokemonCatch.Id}.png"/>
                        </div>
                        <div class="info">
                            ${pokemonName}
                            <div class="stats">CP ${pokemonCatch.Cp} | IV ${pokemonCatch.Perfection}%</div>
                        </div>
                        <span class="event-type">catch</span>
                        <span class="timestamp">0 seconds ago</span>
                        <div class="category"></div>
                    </div>`;

        const element = $(html);
        this.addNotificationFinal({
            element: element,
            event: pokemonCatch
        });
    }

    private addNotificationFinal(notification: INotification) {
        notification.element.wrapInner('<div class="item-container"></div>');
        this.config.container.append(notification.element);
        this.notifications.push(notification);
    }
}

interface INotificationManager {
    addNotificationCapture(pokemonCatch: IPokemonCapture);
}