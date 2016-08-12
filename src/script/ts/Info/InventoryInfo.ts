class InventoryInfo {
    public static itemNames: string[];
    public static __ctor = (() => {
        const itemNames: string[] = [];
        itemNames[1] = "ItemPokeBall";
        itemNames[2] = "ItemGreatBall";
        itemNames[3] = "ItemUltraBall";
        itemNames[4] = "ItemMasterBall";
        itemNames[101] = "ItemPotion";
        itemNames[102] = "ItemSuperPotion";
        itemNames[103] = "ItemHyperPotion";
        itemNames[104] = "ItemMaxPotion";
        itemNames[201] = "ItemRevive";
        itemNames[202] = "ItemMaxRevive";
        itemNames[701] = "ItemRazzBerry";
        InventoryInfo.itemNames = itemNames;
    })();
}