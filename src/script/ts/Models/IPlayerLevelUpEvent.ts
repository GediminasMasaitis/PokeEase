interface IPlayerLevelUpEvent extends IEvent {
    Level: number;
    InventoryFull: boolean;
    Items: string;

    ItemsList: IFortItem[];
}