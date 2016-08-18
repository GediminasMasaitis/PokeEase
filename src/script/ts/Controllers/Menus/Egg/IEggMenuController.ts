interface IEggMenuController {
    eggListRequested(request: IRequest): void;
    updateEggList(eggList: IEggListEvent, currentTotalKmWalked?: number): void;
}