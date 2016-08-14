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
        const exp = playerStats.Experience - playerStats.PrevLevelXp;
        const expNeeded = playerStats.NextLevelXp - playerStats.PrevLevelXp;
        const expPercent = 100 * exp / expNeeded;
        this.config.profileInfoElement.find(".profile-lvl").text(` lvl ${playerStats.Level} `);
        this.config.profileInfoElement.find(".profile-exp").text(` ${exp} / ${expNeeded} `);
        this.config.profileInfoElement.find(".current-xp").css("width", expPercent + "%");
    }
}