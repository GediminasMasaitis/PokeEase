class ProfileInfoManager implements IProfileInfoManager {
    private config: IProfileInfoManagerConfig;

    constructor(config: IProfileInfoManagerConfig) {
        this.config = config;
    }

    public setProfileData = (profile: IProfileEvent):void => {
        this.config.profileInfoElement.find(".profile-username").text(` ${profile.PlayerData.Username} `);
        this.config.profileInfoElement.find(".profile-pokecoin").text(profile.PlayerData.PokeCoin);
        this.config.profileInfoElement.find(".profile-stardust").text(profile.PlayerData.StarDust);
    }

    public setPlayerStats = (playerStats: IPlayerStatsEvent):void => {
        this.addExp(playerStats.Experience);
    }

    public addExp = (totalExp: number, expAdded?: number): void => {
        const currentLevel = this.calculateCurrentLevel(totalExp);
        const exp = totalExp - StaticInfo.totalExpForLevel[currentLevel];
        const expForNextLvl = StaticInfo.totalExpForLevel[currentLevel + 1];
        const expPercent = 100 * exp / expForNextLvl;
        this.config.profileInfoElement.find(".profile-lvl").text(` lvl ${currentLevel} `);
        this.config.profileInfoElement.find(".profile-exp").text(` ${exp} / ${expForNextLvl} `);
        this.config.profileInfoElement.find(".current-xp").css("width", expPercent + "%");
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