class NotificationManager implements INotificationManager {
    private config: INotificationManagerConfig;
    private notifications: INotification[];
    private timeUpdaterInterval: number;

    constructor(config: INotificationManagerConfig) {
        this.config = config;
        this.notifications = [];
        this.timeUpdaterInterval = setInterval(this.onUpdateTimerElapsed, 1000);
        this.config.clearAllButton.click(this.clearAll);
    }

    private clearAll = (ev: JQueryEventObject): void => {
        const allNotificationElements = this.config.container.children(".event").get().reverse();
        var delay = 0;
        allNotificationElements.forEach(notification => {
            const notificationElement = $(notification);
            notificationElement.delay(delay).slideUp(300), () => {
                notificationElement.remove();
            };
            delay += 50;
        });
        this.notifications = [];
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

    public addNotificationPokeStopUsed = (fortUsed: IFortUsedEvent): void => {
        let itemsHtml = "";
        _.each(fortUsed.ItemsList, item => {
            itemsHtml += `<div class="item"><img src="images/items/${item.Name}.png"/>x${item.Count}</div>`;
        });

        const html = `<div class="event pokestop">
                        <i class="fa fa-times dismiss"></i>
                        <div class="info">
                            ${itemsHtml}
                            <div class="stats">+${fortUsed.Exp}XP</div>
                        </div>
                        <span class="event-type">pokestop</span>
                        <span class="timestamp">0 seconds ago</span>
                        <div class="category"></div>
                    </div>`;

        const element = $(html);
        this.addNotificationFinal({
            element: element,
            event: fortUsed
        });
    }

    public addNotificationPokemonCapture = (pokemonCatch: IPokemonCaptureEvent): void => {
        const pokemonName = this.config.translationManager.translation.pokemonNames[pokemonCatch.Id];
        const snipestr = pokemonCatch.IsSnipe ? "snipe" : "catch";
        const html = `<div class="event ${snipestr}">
                        <i class="fa fa-times dismiss"></i>
                        <div class="image">
                            <img src="images/pokemon/${pokemonCatch.Id}.png"/>
                        </div>
                        <div class="info">
                            ${pokemonName}
                            <div class="stats">CP ${pokemonCatch.Cp} | IV ${pokemonCatch.Perfection}%</div>
                        </div>
                        <span class="event-type">${snipestr}</span>
                        <span class="timestamp">0 seconds ago</span>
                        <div class="category"></div>
                    </div>`;

        const element = $(html);
        this.addNotificationFinal({
            element: element,
            event: pokemonCatch
        });
    }

    public addNotificationPokemonEvolved = (pokemonEvolve: IPokemonEvolveEvent): void => {
        const pokemonName = this.config.translationManager.translation.pokemonNames[pokemonEvolve.Id];
        const html = `<div class="event evolve">
                        <i class="fa fa-times dismiss"></i>
                        <div class="image">
                            <img src="images/pokemon/${pokemonEvolve.Id}.png"/>
                        </div>
                        <div class="info">
                            ${pokemonName}
                            <div class="stats">+${pokemonEvolve.Exp}XP</div>
                        </div>
                        <span class="event-type">evolve</span>
                        <span class="timestamp">0 seconds ago</span>
                        <div class="category"></div>
                    </div>`;

        const element = $(html);
        this.addNotificationFinal({
            element: element,
            event: pokemonEvolve
        });
    }

    public addNotificationItemRecycle = (itemRecycle: IItemRecycleEvent): void => {
        const itemName = InventoryInfo.itemNames[itemRecycle.Id];
        const html = `<div class="event recycle">
                        <i class="fa fa-times dismiss"></i>
                        <div class="info">
                            <div class="item"><img src="images/items/${itemName}.png"/>x${itemRecycle.Count}</div>
                            <div class="stats">+${itemRecycle.Count} free space</div>
                        </div>
                        <span class="event-type">recycle</span>
                        <span class="timestamp">0 seconds ago</span>
                        <div class="category"></div>
                    </div>`;

        const element = $(html);
        this.addNotificationFinal({
            element: element,
            event: itemRecycle
        });
    }

    public addNotificationPokemonTransfer = (pokemonTransfer: IPokemonTransferEvent): void => {
        const pokemonName = this.config.translationManager.translation.pokemonNames[pokemonTransfer.Id];
        const roundedPerfection = Math.round(pokemonTransfer.Perfection * 100) / 100;
        const html = `<div class="event transfer">
                        <i class="fa fa-times dismiss"></i>
                        <div class="image">
                            <img src="images/pokemon/${pokemonTransfer.Id}.png"/>
                        </div>
                        <div class="info">
                            ${pokemonName}
                            <div class="stats">CP ${pokemonTransfer.Cp} | IV ${roundedPerfection}%</div>
                        </div>
                        <span class="event-type">transfer</span>
                        <span class="timestamp">0 seconds ago</span>
                        <div class="category"></div>
                    </div>`;

        const element = $(html);
        this.addNotificationFinal({
            element: element,
            event: pokemonTransfer
        });
    }

    private addNotificationFinal = (notification: INotification): void => {
        notification.element.wrapInner('<div class="item-container"></div>');
        notification.element.click(this.closeNotification);
        this.config.container.append(notification.element);
        this.notifications.push(notification);
        this.config.container.animate({
            scrollTop: this.config.container.prop("scrollHeight") - this.config.container.height()
        }, 100);
    }

    private closeNotification = (ev: JQueryEventObject): void => {
        const element = $(ev.target);
        element.closest(".event").slideUp(300, () => {
            element.remove();
            _.remove(this.notifications, n => n.element.is(element));
        });
    }
}

interface INotificationManager {
    addNotificationPokeStopUsed(fortUsed: IFortUsedEvent);
    addNotificationPokemonCapture(pokemonCatch: IPokemonCaptureEvent);
    addNotificationPokemonEvolved(pokemonEvolve: IPokemonEvolveEvent);
    addNotificationPokemonTransfer(pokemonTransfer: IPokemonTransferEvent);
    addNotificationItemRecycle(itemRecycle: IItemRecycleEvent);
}