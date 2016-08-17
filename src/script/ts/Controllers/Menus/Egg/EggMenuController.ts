class EggMenuController implements IEggMenuController {
    private config: IEggMenuControllerConfig;
    private previousProgress: number[];
    constructor(config: IEggMenuControllerConfig) {
        this.config = config;
        this.previousProgress = [];
    }

    public eggListRequested = (request: IRequest): void => {
        this.config.eggLoadingSpinner.show();
    }

    public updateEggList = (eggList: IEggListEvent): void => {
        this.config.eggMenuElement.find(".egg").remove();
        for (let i = 0; i < eggList.Incubators.length; i++) {
            const incubator = eggList.Incubators[i];
            if (!incubator.PokemonId || incubator.PokemonId === "0") {
                continue;
            }
            const eggKm = Math.round(incubator.TargetKmWalked - incubator.StartKmWalked);
            const eggKmRounded = eggKm.toFixed(1);
            const kmWalked = eggList.PlayerKmWalked - incubator.StartKmWalked;
            const kmWalkedRounded = (Math.round(kmWalked * 10) / 10).toFixed(1);
            const progress = kmWalked / eggKm;
            const html = `
<div class="egg incubated-egg">
    <div class="incubator"><img src="images/items/${incubator.ItemId}.png"/></div>
    <p> <b> ${kmWalkedRounded} </b> / <i> ${eggKmRounded} </i> km</p>
    <div class="circle"></div>
</div>`;
            const incubatorElement = $(html);
            this.config.eggMenuElement.append(incubatorElement);

            const previous = this.previousProgress[incubator.PokemonId];
            const hasPrevious = typeof previous === "number";
            const options: ICircleProgressOptions = {
                value: hasPrevious ? previous : progress,
                size: 180,
                thickness: 5,
                startAngle: -Math.PI / 2,
                /*animation: {
                     duration: 1200
                },*/
                fill: {
                    gradient: ["#b1ffaa", "#64f0d0"]
                },
                emptyFill: "rgba(0, 0, 0, 0)"
            };
            if (hasPrevious) {
                options.animation = { duration: 0 };
            }
            incubatorElement.find(".circle").circleProgress(options);
            if (hasPrevious) {
                delete options.animation;
                options.value = progress;
                incubatorElement.find(".circle").circleProgress(options);
            }
            this.previousProgress[incubator.PokemonId] = progress;
        }
        for (let i = 0; i < eggList.UnusedEggs.length; i++) {
            const egg = eggList.UnusedEggs[i];
            const eggKmRounded = egg.EggKmWalkedTarget.toFixed(1);
            const html = `
<div class="egg">
    <div class="incubator"><img src="images/items/0.png"/></div>
    <p> <i> ${eggKmRounded} </i> km</p>
    <div class="circle"></div>
</div>`;
            const eggElement = $(html);
            this.config.eggMenuElement.append(eggElement);
        }
        this.config.eggLoadingSpinner.fadeOut(150);
    }
}

