class StaticData {

    private static dictRawPokemonTypeToEasePokemonType: _.Dictionary<PokeElement>;
    private static dictEasePokemonTypeToRawPokemonType: string[];

    public static pokemonData: RawData.PokemonSettings[];
    public static moveData: RawData.MoveSettings[];

    public static itemCodes: string[];
    public static itemIds: number[];
    public static totalExpForLevel: number[];
    public static expForLevel: number[];
    public static totalExpForGymLevel: number[];
    public static berryIds: number[];

    public static calculateCurrentLevel = (totalExp: number) => {
        for (let i = 0; i < StaticData.totalExpForLevel.length; i++) {
            if (StaticData.totalExpForLevel[i + 1] >= totalExp) {
                return i;
            }
        }
        throw "Unable to determine level";
    }

    public static calculateCurrentGymLevel = (totalExp: number) => {
        for (let i = 0; i < StaticData.totalExpForGymLevel.length; i++) {
            if (StaticData.totalExpForGymLevel[i + 1] >= totalExp) {
                return i;
            }
        }
        throw "Unable to determine gym level";
    }

    public static init = (rawData: RawData.RawDataRoot): void => {
        StaticData.initTypeDictionaries();
        StaticData.initItemIds();
        StaticData.initExpData();


        StaticData.pokemonData = [];
        const pokemonData = _.filter(rawData.itemTemplates, x => x.pokemonSettings);
        for (let i = 0; i < pokemonData.length; i++) {
            const pokemonSettings = pokemonData[i].pokemonSettings;
            pokemonSettings.id = StaticData.parseId(pokemonData[i].templateId);
            pokemonSettings.elements = [];
            const element1 = StaticData.dictRawPokemonTypeToEasePokemonType[pokemonSettings.type];
            pokemonSettings.elements.push(element1);
            if (pokemonSettings.type2) {
                const element2 = StaticData.dictRawPokemonTypeToEasePokemonType[pokemonSettings.type2];
                pokemonSettings.elements.push(element2);
            }
            StaticData.pokemonData[pokemonSettings.id] = pokemonSettings;
        }

        StaticData.moveData = [];
        const moveData = _.filter(rawData.itemTemplates, x => x.moveSettings);
        for (let i = 0; i < moveData.length; i++) {
            const moveSettings = moveData[i].moveSettings;
            moveSettings.id = StaticData.parseId(moveData[i].templateId);
            moveSettings.element = StaticData.dictRawPokemonTypeToEasePokemonType[moveSettings.pokemonType];
            const availableAsQuickTo = _.filter(StaticData.pokemonData, p => {
                 return p && _.includes(p.quickMoves, moveSettings.movementId);
            }) as RawData.PokemonSettings[];
            const availableAsCinematicTo = _.filter(StaticData.pokemonData, p => {
                 return p && _.includes(p.cinematicMoves, moveSettings.movementId);
            }) as RawData.PokemonSettings[];
            moveSettings.moveType = MoveType.None;
            if (availableAsQuickTo.length > 0) {
                moveSettings.moveType |= MoveType.QuickMove;
            }
            if (availableAsCinematicTo.length > 0) {
                moveSettings.moveType |= MoveType.CinematicMove;
            }
            moveSettings.availableToPokemon = _.concat(availableAsQuickTo, availableAsCinematicTo);
            StaticData.moveData[moveSettings.id] = moveSettings;
        }

        for (let i = 1; i < StaticData.pokemonData.length; i++) {
            const pokemonSettings = StaticData.pokemonData[i];
            pokemonSettings.availableQuickMoves = _.map(pokemonSettings.quickMoves, x => _.find(StaticData.moveData, y => y && y.movementId === x));
            pokemonSettings.availableCinematicMoves = _.map(pokemonSettings.cinematicMoves, x => _.find(StaticData.moveData, y => y && y.movementId === x));
            pokemonSettings.evolvesInto = _.map(pokemonSettings.evolutionIds, x => _.find(StaticData.pokemonData, y => y && y.pokemonId === x));
        }
    }

    private static initItemIds = (): void => {
        const itemCodes: string[] = [];
        itemCodes[1] = "ItemPokeBall";
        itemCodes[2] = "ItemGreatBall";
        itemCodes[3] = "ItemUltraBall";
        itemCodes[4] = "ItemMasterBall";
        itemCodes[101] = "ItemPotion";
        itemCodes[102] = "ItemSuperPotion";
        itemCodes[103] = "ItemHyperPotion";
        itemCodes[104] = "ItemMaxPotion";
        itemCodes[201] = "ItemRevive";
        itemCodes[202] = "ItemMaxRevive";
        itemCodes[701] = "ItemRazzBerry";
        StaticData.itemCodes = itemCodes;

        const itemIds: number[] = [];
        itemIds["ItemPokeBall"] = 1;
        itemIds["ItemGreatBall"] = 2;
        itemIds["ItemUltraBall"] = 3;
        itemIds["ItemMasterBall"] = 4;
        itemIds["ItemPotion"] = 101;
        itemIds["ItemSuperPotion"] = 102;
        itemIds["ItemHyperPotion"] = 103;
        itemIds["ItemMaxPotion"] = 104;
        itemIds["ItemRevive"] = 201;
        itemIds["ItemMaxRevive"] = 202;
        itemIds["ItemRazzBerry"] = 701;
        StaticData.itemIds = itemIds;

        StaticData.berryIds = [701];
    }

    private static initExpData = (): void => {
        const totalExpForLevel: number[] = [];
        totalExpForLevel[0] = -Infinity;
        totalExpForLevel[1] = 0;
        totalExpForLevel[2] = 1000;
        totalExpForLevel[3] = 3000;
        totalExpForLevel[4] = 6000;
        totalExpForLevel[5] = 10000;
        totalExpForLevel[6] = 15000;
        totalExpForLevel[7] = 21000;
        totalExpForLevel[8] = 28000;
        totalExpForLevel[9] = 36000;
        totalExpForLevel[10] = 45000;
        totalExpForLevel[11] = 55000;
        totalExpForLevel[12] = 65000;
        totalExpForLevel[13] = 75000;
        totalExpForLevel[14] = 85000;
        totalExpForLevel[15] = 100000;
        totalExpForLevel[16] = 120000;
        totalExpForLevel[17] = 140000;
        totalExpForLevel[18] = 160000;
        totalExpForLevel[19] = 185000;
        totalExpForLevel[20] = 210000;
        totalExpForLevel[21] = 260000;
        totalExpForLevel[22] = 335000;
        totalExpForLevel[23] = 435000;
        totalExpForLevel[24] = 560000;
        totalExpForLevel[25] = 710000;
        totalExpForLevel[26] = 900000;
        totalExpForLevel[27] = 1100000;
        totalExpForLevel[28] = 1350000;
        totalExpForLevel[29] = 1650000;
        totalExpForLevel[30] = 2000000;
        totalExpForLevel[31] = 2500000;
        totalExpForLevel[32] = 3000000;
        totalExpForLevel[33] = 3750000;
        totalExpForLevel[34] = 4750000;
        totalExpForLevel[35] = 6000000;
        totalExpForLevel[36] = 7500000;
        totalExpForLevel[37] = 9500000;
        totalExpForLevel[38] = 12000000;
        totalExpForLevel[39] = 15000000;
        totalExpForLevel[40] = 20000000;
        totalExpForLevel[41] = Infinity;
        StaticData.totalExpForLevel = totalExpForLevel;

        StaticData.expForLevel = [];
        for (let i = 1; i < totalExpForLevel.length; i++) {
            StaticData.expForLevel[i] = StaticData.totalExpForLevel[i] - StaticData.totalExpForLevel[i - 1];
        }

        const totalExpForGymLevel = [];
        totalExpForGymLevel[0] = -Infinity;
        totalExpForGymLevel[1] = 0;
        totalExpForGymLevel[2] = 2000;
        totalExpForGymLevel[3] = 4000;
        totalExpForGymLevel[4] = 8000;
        totalExpForGymLevel[5] = 12000;
        totalExpForGymLevel[6] = 16000;
        totalExpForGymLevel[7] = 20000;
        totalExpForGymLevel[8] = 30000;
        totalExpForGymLevel[9] = 40000;
        totalExpForGymLevel[10] = 50000;
        totalExpForGymLevel[11] = Infinity;
        StaticData.totalExpForGymLevel = totalExpForGymLevel;
    }

    private static initTypeDictionaries = (): void => {
        StaticData.dictRawPokemonTypeToEasePokemonType = {
            "POKEMON_TYPE_GRASS": PokeElement.Grass,
            "POKEMON_TYPE_DARK": PokeElement.Dark,
            "POKEMON_TYPE_FIRE": PokeElement.Fire,
            "POKEMON_TYPE_WATER": PokeElement.Water,
            "POKEMON_TYPE_BUG": PokeElement.Bug,
            "POKEMON_TYPE_NORMAL": PokeElement.Normal,
            "POKEMON_TYPE_POISON": PokeElement.Poison,
            "POKEMON_TYPE_ELECTRIC": PokeElement.Electric,
            "POKEMON_TYPE_GROUND": PokeElement.Ground,
            "POKEMON_TYPE_FAIRY": PokeElement.Fairy,
            "POKEMON_TYPE_FIGHTING": PokeElement.Fighting,
            "POKEMON_TYPE_PSYCHIC": PokeElement.Psychic,
            "POKEMON_TYPE_ROCK": PokeElement.Rock,
            "POKEMON_TYPE_FLYING": PokeElement.Flying,
            "POKEMON_TYPE_STEEL": PokeElement.Steel,
            "POKEMON_TYPE_GHOST": PokeElement.Ghost,
            "POKEMON_TYPE_ICE": PokeElement.Ice,
            "POKEMON_TYPE_DRAGON": PokeElement.Dragon
        };

        StaticData.dictEasePokemonTypeToRawPokemonType = [];
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Grass] = "POKEMON_TYPE_GRASS";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Dark] = "POKEMON_TYPE_DARK";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Fire] = "POKEMON_TYPE_FIRE";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Water] = "POKEMON_TYPE_WATER";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Bug] = "POKEMON_TYPE_BUG";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Normal] = "POKEMON_TYPE_NORMAL";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Poison] = "POKEMON_TYPE_POISON";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Electric] = "POKEMON_TYPE_ELECTRIC";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Ground] = "POKEMON_TYPE_GROUND";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Fairy] = "POKEMON_TYPE_FAIRY";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Fighting] = "POKEMON_TYPE_FIGHTING";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Psychic] = "POKEMON_TYPE_PSYCHIC";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Rock] = "POKEMON_TYPE_ROCK";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Flying] = "POKEMON_TYPE_FLYING";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Steel] = "POKEMON_TYPE_STEEL";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Ghost] = "POKEMON_TYPE_GHOST";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Ice] = "POKEMON_TYPE_ICE";
        StaticData.dictEasePokemonTypeToRawPokemonType[PokeElement.Dragon] = "POKEMON_TYPE_DRAGON";
    }

    private static parseId = (templateId: string): number => {
        const regex = /V(\d+?)_/;
        const result = regex.exec(templateId);
        const idStr = result[1];
        const id = parseInt(idStr);
        return id;
    }

}