class InventoryMenuManager implements IInventoryMenuManager {
    private config: IInventoryMenuManagerConfig;

    constructor(config: IInventoryMenuManagerConfig) {
        this.config = config;
    }

    public inventoryListRequested = (request: IRequest): void => {
        this.config.inventoryLoadingSpinner.show();
    }

    public updateInventoryList = (inventoryList: IInventoryListEvent): void => {
        const currentItems = this.config.inventoryMenuElement.find(`.product`);
        currentItems.removeClass("brighter");
        currentItems.find(".number").text(0);
        for (let i = 0; i < inventoryList.Items.length; i++) {
            const item = inventoryList.Items[i];
            const itemElement = this.config.inventoryMenuElement.find(`.product[data-item-id="${item.ItemId}"]`);
            itemElement.addClass("brighter");
            itemElement.find(".number").text(item.Count);
        }
        this.config.inventoryLoadingSpinner.fadeOut(150);
    }
}