class JournalNotificationController implements INotificationController {
    public config: IJournalNotificationControllerConfig;
    private notifications: INotification[];
    private timeUpdaterInterval: number;

    constructor(config: IJournalNotificationControllerConfig) {
        this.config = config;
        this.notifications = [];
        this.timeUpdaterInterval = setInterval(this.onUpdateTimerElapsed, 1000);
        this.config.clearAllButton.click(this.clearAll);
        this.config.exampleButton.click(this.exampleClicked);
        this.config.settingsService.subscribe(this.onSettingsChanged);
    }

    private clearAll = (ev: JQueryEventObject): void => {
        const allNotificationElements = this.config.container.children(".event").get().reverse();
        var delay = 0;
        allNotificationElements.forEach(notification => {
            const notificationElement = $(notification);
            notificationElement.delay(delay).slideUp(300, () => {
                notificationElement.remove();
                const currentCount = this.config.container.children(".event").length;
                this.config.notificationCounter.text(currentCount);
            });
            delay += 50;
        });
        this.notifications = [];
    }

    private exampleClicked = (ev: JQueryEventObject): void => {
        this.addNotificationExample();
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

    addNotificationExample() {
        const html = `<div class="info">Click for more</div>`;
        const extendedInfoHtml = `This is an example notification.<br/>Extended information about the event will be added here.`;
        const dummyEvent: IEvent = {
            Timestamp: Date.now()
        }
        this.addNotification(dummyEvent, html, "example", extendedInfoHtml);
    }

    public addNotificationPokeStopUsed = (fortUsed: IFortUsedEvent): void => {
        if (!this.config.notificationSettings.pokestopUsed) {
            return;
        }
        let itemsHtml = "";
        _.each(fortUsed.ItemsList, item => {
            const itemId = StaticData.itemIds[item.Name];
            const itemName = this.config.translationController.translation.itemNames[itemId];
            itemsHtml += `<div class="item" title="${itemName}"><img src="images/items/${itemId}.png"/>x${item.Count}</div>`;
        });

        const html = `<div class="info">
                          ${itemsHtml}
                          <div class="stats">+${fortUsed.Exp}XP</div>
                      </div>`;
        const inventoryFullStr = fortUsed.InventoryFull ? "<span class=inv-full>inventory full</span>" : "";
        const extendedInfoHtml = `
${inventoryFullStr}
Name            <span class="name"> ${fortUsed.Name} </span><br/>
Gems            <span class="xp"> ${fortUsed.Gems} </span><br/>
`;
        this.addNotification(fortUsed, html, "pokestop", extendedInfoHtml);
    }

    public addNotificationPokemonCapture = (pokemonCatches: IPokemonCaptureEvent[], itemsUsedForCapture: number[]): void => {
        const pokemonCatch = pokemonCatches[pokemonCatches.length - 1];
        if (!pokemonCatch.IsSnipe && !this.config.notificationSettings.pokemonCapture) {
            return;
        }
        if (pokemonCatch.IsSnipe && !this.config.notificationSettings.pokemonSnipe) {
            return;
        }
        const pokemonName = this.config.translationController.translation.pokemonNames[pokemonCatch.Id];
        const roundedPerfection = Math.round(pokemonCatch.Perfection * 100) / 100;
        const eventType = pokemonCatch.IsSnipe ? "snipe" : "catch";
        const html = `<div class="image">
                            <img src="images/pokemon/${pokemonCatch.Id}.png"/>
                        </div>
                        <div class="info">
                            ${pokemonName}
                            <div class="stats">CP ${pokemonCatch.Cp} | IV ${roundedPerfection}%</div>
                        </div>`;
        let itemsHtml = "";
        _.each(itemsUsedForCapture, i => itemsHtml += `<img src="images/items/${i}.png">`);
        const extendedInfoHtml = `
Used            <span class="attempts">${itemsHtml}</span><br/>
Attempts        <span class="attempts">${pokemonCatches.length}</span><br/>
Probability     <span class="probability"> ${pokemonCatch.Probability}% </span><br/>
XP              <span class="xp"> ${pokemonCatch.Exp} </span><br/>
Candies         <span class="candies"> ${pokemonCatch.FamilyCandies} </span><br/>
Catch Type      <span class="catch-type"> ${pokemonCatch.CatchType} </span><br/>
Level           <span class="level"> ${pokemonCatch.Level} </span><br/>
IV              <span class="level"> ${roundedPerfection} </span><br/>
CP              <span class="cp"> ${pokemonCatch.Cp} </span>/<span class="max-cp"> ${pokemonCatch.MaxCp} </span><br/>
`;

        this.addNotification(pokemonCatch, html, eventType, extendedInfoHtml);
    }

    public addNotificationPokemonEvolved = (pokemonEvolve: IPokemonEvolveEvent): void => {
        if (!this.config.notificationSettings.pokemonEvolved) {
            return;
        }
        const pokemonName = this.config.translationController.translation.pokemonNames[pokemonEvolve.Id];

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
        if (!this.config.notificationSettings.eggHatched) {
            return;
        }
        const pokemonName = this.config.translationController.translation.pokemonNames[eggHatched.PokemonId];
        const roundedPerfection = Math.round(eggHatched.Perfection * 100) / 100;

        const html = `<div class="image">
                          <img src="images/pokemon/${eggHatched.PokemonId}.png"/>
                      </div>
                      <div class="info">
                          ${pokemonName}
                          <div class="stats">CP ${eggHatched.Cp} | IV ${roundedPerfection}%</div>
                      </div>`;
        const extendedInfoHtml = `
Level           <span class="level"> ${eggHatched.Level} </span><br/>
IV              <span class="level"> ${roundedPerfection} </span><br/>
CP              <span class="cp"> ${eggHatched.Cp} </span>/<span class="max-cp"> ${eggHatched.MaxCp} </span><br/>
`;
        this.addNotification(eggHatched, html, "egg-hatched", extendedInfoHtml);
    }

    public addNotificationIncubatorStatus = (incubatorStatus: IIncubatorStatusEvent): void => {
        if (!this.config.notificationSettings.incubatorStatus) {
            return;
        }
        const km = Math.round((incubatorStatus.KmToWalk - incubatorStatus.KmRemaining) * 100) / 100;

        const html = `<div class="image">
                          <img src="images/items/0.png"/>
                      </div>
                      <div class="info">Egg
                          <div class="stats">${km} of ${incubatorStatus.KmToWalk}km</div>
                      </div>`;

        this.addNotification(incubatorStatus, html, "incubator-status");
    }

    public addNotificationItemRecycle = (itemRecycle: IItemRecycleEvent): void => {
        if (!this.config.notificationSettings.itemRecycle) {
            return;
        }
        const itemName = this.config.translationController.translation.itemNames[itemRecycle.Id];

        const html = `<div class="info" title="${itemName}">
                          <div class="item"><img src="images/items/${itemRecycle.Id}.png"/>x${itemRecycle.Count}</div>
                          <div class="stats">+${itemRecycle.Count} free space</div>
                      </div>`;

        this.addNotification(itemRecycle, html, "recycle");
    }

    public addNotificationPokemonTransfer = (pokemonTransfer: IPokemonTransferEvent): void => {
        if (!this.config.notificationSettings.pokemonTransfer) {
            return;
        }
        const pokemonName = this.config.translationController.translation.pokemonNames[pokemonTransfer.Id];
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

    private addNotification = (event: IEvent, innerHtml: string, eventType: string, extendedInfoHtml?: string): void => {
        extendedInfoHtml = extendedInfoHtml || "";
        const eventTypeName = this.config.translationController.translation.eventTypes[eventType];
        const dateStr = moment().format("MMMM Do YYYY, HH:mm:ss");
        const html =
            `<div class="event ${eventType}">
    <div class="item-container">
        <i class="fa fa-times dismiss"></i>
        ${innerHtml}
        <span class="event-type">${eventTypeName}</span>
        <span class="timestamp">0 seconds ago</span>
        <div class="category"></div>
    </div>
    <div class="extended-info">
        Date <span class="extended-date">${dateStr}</span><br/>
        ${extendedInfoHtml}
    </div>
</div>`;
        const element = $(html);
        element.click(this.toggleExtendedInfo);
        element.find(".dismiss").click(this.closeNotification);

        const scroll = this.isAtBottom();

        this.config.container.append(element);
        this.notifications.push({
            event: event,
            element: element
        });

        if (scroll) {
            this.scrollToBottom();
        }

        this.config.notificationCounter.text(this.notifications.length);
    }

    private isAtBottom = (): boolean => {
        const scrollTop = this.config.container.scrollTop();
        const innerHeight = this.config.container.innerHeight();
        const scrollHeight = this.config.container[0].scrollHeight;
        const atBottom = scrollTop + innerHeight > scrollHeight - 200;
        return atBottom;
    }

    private scrollToBottom = () => {
        const animation = {
            scrollTop: this.config.container.prop("scrollHeight") - this.config.container.height()
        };
        this.config.container.finish().animate(animation, 100);
    }

    private toggleExtendedInfo = (ev: JQueryEventObject): void => {
        const notificationElement =  $(ev.target).closest(".event");
        notificationElement.find(".extended-info").slideToggle(500, "easeOutQuint");
    }

    private closeNotification = (ev: JQueryEventObject): void => {
        const closeButton = $(ev.target);
        const element = closeButton.closest(".event");
        element.slideUp(300, () => {
            element.remove();
            _.remove(this.notifications, n => n.element.is(element));
            this.config.notificationCounter.text(this.notifications.length);
        });
    }

    private onSettingsChanged = (settings: ISettings, previousSettings: ISettings): void => {
        this.config.notificationSettings = settings.notificationsJournal;
    }
}
