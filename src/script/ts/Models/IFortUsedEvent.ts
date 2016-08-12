interface IFortUsedEvent extends IMapLocationEvent {
    Id: string;
    Exp: number;
    Gems: number;
    InventoryFull: boolean;
    Items: string;
    Name: string;

    ItemsList?: IFortItem[];
}

interface IFortItem {
    Name: string;
    Count: number;
}