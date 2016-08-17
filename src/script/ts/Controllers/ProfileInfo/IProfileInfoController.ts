interface IProfileInfoController {
    setProfileData(profile: IProfileEvent):void;
    setPlayerStats(playerStats: IPlayerStatsEvent): void;
    addStardust(stardust: number, stardustAdded?: number): void;
    addExp(totalExp: number, expAdded?:number);
}