interface IInventoryMenuManager {
    inventoryListRequested(request: IRequest): void;
    updateInventoryList(inventoryList: IInventoryListEvent): void;
}