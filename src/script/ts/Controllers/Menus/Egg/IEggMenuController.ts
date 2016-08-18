interface IEggMenuController {
    eggListRequested(request: IRequest): void;
    updateEggList(eggList: IEggListEvent): void;
}