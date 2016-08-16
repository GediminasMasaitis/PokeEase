interface IProfileInfoController {
    setProfileData(profile: IProfileEvent):void;
    setPlayerStats(playerStats: IPlayerStatsEvent): void;
    addExp(totalExp: number, expAdded?:number);
}