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
           const itemId = InventoryInfo.itemIds[item.Name];
           const itemName = this.config.translationManager.translation.itemNames[itemId];
           itemsHtml += `<div class="item" title="${itemName}"><img src="images/items/${itemId}.png"/>x${item.Count}</div>`;
        });

        const html = `<div class="info">
                          ${itemsHtml}
                          <div class="stats">+${fortUsed.Exp}XP</div>
                      </div>`;

        this.addNotification(fortUsed, html, "pokestop");
    }

    public addNotificationPokemonCapture = (pokemonCatch: IPokemonCaptureEvent): void => {
        const pokemonName = this.config.translationManager.translation.pokemonNames[pokemonCatch.Id];
        const roundedPerfection = Math.round(pokemonCatch.Perfection * 100) / 100;
        const eventType = pokemonCatch.IsSnipe ? "snipe" : "catch";

        const html = `<div class="image">
                            <img src="images/pokemon/${pokemonCatch.Id}.png"/>
                        </div>
                        <div class="info">
                            ${pokemonName}
                            <div class="stats">CP ${pokemonCatch.Cp} | IV ${roundedPerfection}%</div>
                        </div>`;

        this.addNotification(pokemonCatch, html, eventType);
    }

    public addNotificationPokemonEvolved = (pokemonEvolve: IPokemonEvolveEvent): void => {
        const pokemonName = this.config.translationManager.translation.pokemonNames[pokemonEvolve.Id];

        const html = `<div class="image">
                          <img src="images/pokemon/${pokemonEvolve.Id}.png"/>
                      </div>
                      <div class="info">
                          ${pokemonName}
                          <div class="stats">+${pokemonEvolve.Exp}XP</div>
                      </div>`;

        this.addNotification(pokemonEvolve, html, "evolve");
    }

    public addNotificationEggHatched = (eggHatched: IEggHatchedEvent): void => {
        const pokemonName = this.config.translationManager.translation.pokemonNames[eggHatched.PokemonId];
        const roundedPerfection = Math.round(eggHatched.Perfection * 100) / 100;

        const html = `<div class="image">
                          <img src="images/pokemon/${eggHatched.PokemonId}.png"/>
                      </div>
                      <div class="info">
                          ${pokemonName}
                          <div class="stats">CP ${eggHatched.Cp} | IV ${roundedPerfection}%</div>
                      </div>`;

        this.addNotification(eggHatched, html, "egg-hatched");
    }

    public addNotificationIncubatorStatus = (incubatorStatus: IIncubatorStatusEvent): void => {
        const km = Math.round((incubatorStatus.KmToWalk - incubatorStatus.KmRemaining) * 100) / 100;

        const html = `<div class="image">
                          <img src="images/items/ItemEgg.png"/>
                      </div>
                      <div class="info">Egg
                          <div class="stats">${km} of ${incubatorStatus.KmToWalk}km</div>
                      </div>`;

        this.addNotification(incubatorStatus, html, "incubator-status");
    }

    public addNotificationItemRecycle = (itemRecycle: IItemRecycleEvent): void => {
        const itemName = this.config.translationManager.translation.itemNames[itemRecycle.Id];

        const html = `<div class="info" title="${itemName}">
                          <div class="item"><img src="images/items/${itemRecycle.Id}.png"/>x${itemRecycle.Count}</div>
                          <div class="stats">+${itemRecycle.Count} free space</div>
                      </div>`;

        this.addNotification(itemRecycle, html, "recycle");
    }

    public addNotificationPokemonTransfer = (pokemonTransfer: IPokemonTransferEvent): void => {
        const pokemonName = this.config.translationManager.translation.pokemonNames[pokemonTransfer.Id];
        const roundedPerfection = Math.round(pokemonTransfer.Perfection * 100) / 100;

        const html = `<div class="image">
                          <img src="images/pokemon/${pokemonTransfer.Id}.png"/>
                      </div>
                      <div class="info">
                          ${pokemonName}
                          <div class="stats">CP ${pokemonTransfer.Cp} | IV ${roundedPerfection}%</div>
                      </div>`;

       this.addNotification(pokemonTransfer, html, "transfer");
    }

    private addNotification = (event: IEvent, innerHtml: string, eventType: string): void => {
        const eventTypeName = this.config.translationManager.translation.eventTypes[eventType];

        const html=`<div class="event ${eventType}">
                        <div class="item-container">
                            <i class="fa fa-times dismiss"></i>
                            ${innerHtml}
                            <span class="event-type">${eventTypeName}</span>
                            <span class="timestamp">0 seconds ago</span>
                            <div class="category"></div>
                        </div>
                    </div>`;

        const element = $(html);
        element.click(this.closeNotification);
        this.config.container.append(element);
        this.notifications.push({
            event: event,
            element: element
        });
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
	addNotificationEggHatched(eggHatched: IEggHatchedEvent);
	addNotificationIncubatorStatus(incubatorStatus: IIncubatorStatusEvent);
}