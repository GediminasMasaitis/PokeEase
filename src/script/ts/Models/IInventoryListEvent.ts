interface IInventoryListEvent extends IEvent {
    Items: IInventoryListEntry[];
}

interface IInventoryListEntry {
    Count: number;
    ItemId: number;
    Unseen: boolean;
}