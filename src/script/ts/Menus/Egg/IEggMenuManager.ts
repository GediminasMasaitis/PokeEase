interface IEggMenuManager {
    eggListRequested(request: IRequest): void;
    updateEggList(eggList: IEggListEvent): void;
}