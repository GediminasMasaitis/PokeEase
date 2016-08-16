interface IInventoryMenuController {
    inventoryListRequested(request: IRequest): void;
    updateInventoryList(inventoryList: IInventoryListEvent): void;
}