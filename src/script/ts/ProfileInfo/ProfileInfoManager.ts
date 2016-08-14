class ProfileInfoManager implements IProfileInfoManager {
    private config: IProfileInfoManagerConfig;

    constructor(config: IProfileInfoManagerConfig) {
        this.config = config;
    }

    public setProfileData = (profile: IProfileEvent):void => {
        this.config.profileInfoElement.find(".profile-username").text(` ${profile.PlayerData.Username} `);
    }
}