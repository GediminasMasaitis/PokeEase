class ProfileInfoController implements IProfileInfoController {
    private config: IProfileInfoControllerConfig;

    constructor(config: IProfileInfoControllerConfig) {
        this.config = config;
        if (this.config.hideUsername) {
            this.config.profileInfoElement.find(".profile-username").hide();
        }
    }

    public setProfileData = (profile: IProfileEvent):void => {
        this.config.profileInfoElement.find(".profile-username").text(` ${profile.PlayerData.Username} `);
        this.config.profileInfoElement.find(".profile-pokecoin").text(profile.PlayerData.PokeCoin);
        this.config.profileInfoElement.find(".profile-stardust").text(profile.PlayerData.StarDust);
    }

    public setPlayerStats = (playerStats: IPlayerStatsEvent):void => {
        this.addExp(playerStats.Experience);
    }

    public addStardust = (stardust: number, stardustAdded?: number): void => {
        const stardustElement = this.config.profileInfoElement.find(".profile-stardust-current");
        this.config.profileInfoElement.find(".profile-stardust-loading").remove();
        this.config.profileInfoElement.find(".profile-stardust-loaded").show();
        this.animateTo(stardustElement, stardust);
        if (stardustAdded) {
            const stardustBubbleContainer = this.config.profileInfoElement.find(".profile-stardust");
            this.bubble(stardustBubbleContainer, "stardust-bubble", stardustAdded);
        }
    }

    public addExp = (totalExp: number, expAdded?: number): void => {
        const currentLevel = this.calculateCurrentLevel(totalExp);
        const exp = totalExp - StaticInfo.totalExpForLevel[currentLevel];
        const expForNextLvl = StaticInfo.expForLevel[currentLevel + 1];
        const expPercent = 100 * exp / expForNextLvl;
        this.config.profileInfoElement.find(".profile-lvl").text(` lvl ${currentLevel} `);
        this.animateTo(this.config.profileInfoElement.find(".profile-exp-current"), exp);
        this.animateTo(this.config.profileInfoElement.find(".profile-exp-next"), expForNextLvl);
        this.config.profileInfoElement.find(".current-xp").css("width", expPercent + "%");
        this.config.profileInfoElement.find(".profile-exp-loading").remove();
        this.config.profileInfoElement.find(".profile-exp-loaded").show();
        this.config.profileInfoElement.find(".xp-progress").show();
        if (expAdded) {
            const expBubbleContainer = this.config.profileInfoElement.find(".profile-exp");
            this.bubble(expBubbleContainer, "xp-bubble", expAdded);
        }
    }

    private animateTo(element: JQuery, to: number) {
        const current = parseInt(element.text());
        element.prop("number", current);
        element.animateNumber({
            number: to
        });
    }

    private bubble = (container: JQuery, className: string, expAdded: number): void => {
        const bubbleHtml = `<div class="${className}">+${expAdded}</div>`;
        const bubble = $(bubbleHtml);
        container.append(bubble);
        setTimeout(() => { bubble.remove(); }, 1000);
    }

    private calculateCurrentLevel = (totalExp: number) => {
        for (let i = 0; i < StaticInfo.totalExpForLevel.length; i++) {
            if (StaticInfo.totalExpForLevel[i + 1] >= totalExp) {
                return i;
            }
        }
        throw "Unable to determine level";
    }
}