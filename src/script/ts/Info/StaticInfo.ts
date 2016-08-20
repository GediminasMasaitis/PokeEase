enum PokeElement {
    Bug = 0,
    Grass = 1,
    Dark = 2,
    Ground = 3,
    Dragon = 4,
    Ice = 5,
    Electric = 6,
    Normal = 7,
    Fairy = 8,
    Poison = 9,
    Fighting = 10,
    Psychic = 11,
    Fire = 12,
    Rock = 13,
    Flying = 14,
    Steel = 15,
    Ghost = 16,
    Water = 17
}

enum MoveType {
    QuickMove,
    ChargeMove
}

interface IMoveInfo {
    moveId: number;
    name: string;
    type: MoveType;
    availableToPokemon: IAvailableToPokemonInfo[];
    element: PokeElement;
    damage: number;
    damageWithStab: number;
    damagePerSecond: number;
    damagePerSecondWithStab: number;
    damagePerSecondDefensive?: number;
    energyPerSecond: number;
    chargeEnergy?: number;
    dodgeWindow?: number;
    cooldown: number;
};

interface IAvailableToPokemonInfo {
    pokemonId: number;
    baseAttack: number;
}

interface IPokemonInfo {
    pokemonId: number;
    elements: PokeElement[];
    evolvesInto: number[];
    possibleMoves: IMoveInfo[];
}

class StaticInfo {
    public static itemCodes: string[];
    public static itemIds: number[];
    public static totalExpForLevel: number[];
    public static expForLevel: number[];
    public static totalExpForGymLevel: number[];
    public static berryIds: number[];
    public static pokemonInfo: IPokemonInfo[];
    public static moveInfo: IMoveInfo[];

    public static calculateCurrentLevel = (totalExp: number) => {
        for (let i = 0; i < StaticInfo.totalExpForLevel.length; i++) {
            if (StaticInfo.totalExpForLevel[i + 1] >= totalExp) {
                return i;
            }
        }
        throw "Unable to determine level";
    }

    public static calculateCurrentGymLevel = (totalExp: number) => {
        for (let i = 0; i < StaticInfo.totalExpForGymLevel.length; i++) {
            if (StaticInfo.totalExpForGymLevel[i + 1] >= totalExp) {
                return i;
            }
        }
        throw "Unable to determine gym level";
    }

    public static init = () => {
        //#region Items
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
        StaticInfo.itemCodes = itemCodes;

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
        StaticInfo.itemIds = itemIds;

        StaticInfo.berryIds = [701];
        //#endregion

        //#region Exp
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
        StaticInfo.totalExpForLevel = totalExpForLevel;

        StaticInfo.expForLevel = [];
        for (let i = 1; i < totalExpForLevel.length; i++) {
            StaticInfo.expForLevel[i] = StaticInfo.totalExpForLevel[i] - StaticInfo.totalExpForLevel[i - 1];
        }
        //#endregion

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
        StaticInfo.totalExpForGymLevel = totalExpForGymLevel;
        //#region Move info

        const moveInfo: IMoveInfo[] = [];
        moveInfo[13] = {
            moveId: 13,
            name: "Wrap",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 6.25,
            damagePerSecondWithStab: 7.81,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.6,
            cooldown: 4.00
        };
        moveInfo[13].availableToPokemon[23] = {
            pokemonId: 23, // Ekans
            baseAttack: 112
        };
        moveInfo[13].availableToPokemon[69] = {
            pokemonId: 69, // Bellsprout
            baseAttack: 158
        };
        moveInfo[13].availableToPokemon[72] = {
            pokemonId: 72, // Tentacool
            baseAttack: 106
        };
        moveInfo[13].availableToPokemon[147] = {
            pokemonId: 147, // Dratini
            baseAttack: 128
        };
        moveInfo[13].availableToPokemon[148] = {
            pokemonId: 148, // Dragonair
            baseAttack: 170
        };
        moveInfo[14] = {
            moveId: 14,
            name: "Hyper Beam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 120,
            damageWithStab: 120,
            damagePerSecond: 24.00,
            damagePerSecondWithStab: 30.00,
            damagePerSecondDefensive: 17.14,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.8,
            cooldown: 5.00
        };
        moveInfo[14].availableToPokemon[20] = {
            pokemonId: 20, // Raticate
            baseAttack: 146
        };
        moveInfo[14].availableToPokemon[40] = {
            pokemonId: 40, // Wigglytuff
            baseAttack: 168
        };
        moveInfo[14].availableToPokemon[101] = {
            pokemonId: 101, // Electrode
            baseAttack: 150
        };
        moveInfo[14].availableToPokemon[108] = {
            pokemonId: 108, // Lickitung
            baseAttack: 126
        };
        moveInfo[14].availableToPokemon[142] = {
            pokemonId: 142, // Aerodactyl
            baseAttack: 182
        };
        moveInfo[14].availableToPokemon[143] = {
            pokemonId: 143, // Snorlax
            baseAttack: 180
        };
        moveInfo[14].availableToPokemon[149] = {
            pokemonId: 149, // Dragonite
            baseAttack: 250
        };
        moveInfo[14].availableToPokemon[150] = {
            pokemonId: 150, // Mewtwo
            baseAttack: 284
        };
        moveInfo[14].availableToPokemon[151] = {
            pokemonId: 151, // Mew
            baseAttack: 220
        };
        moveInfo[16] = {
            moveId: 16,
            name: "Dark Pulse",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Dark,
            damage: 45,
            damageWithStab: 45,
            damagePerSecond: 12.86,
            damagePerSecondWithStab: 16.07,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 1.1,
            cooldown: 3.50
        };
        moveInfo[16].availableToPokemon[24] = {
            pokemonId: 24, // Arbok
            baseAttack: 166
        };
        moveInfo[16].availableToPokemon[52] = {
            pokemonId: 52, // Meowth
            baseAttack: 104
        };
        moveInfo[16].availableToPokemon[89] = {
            pokemonId: 89, // Muk
            baseAttack: 180
        };
        moveInfo[16].availableToPokemon[92] = {
            pokemonId: 92, // Gastly
            baseAttack: 136
        };
        moveInfo[16].availableToPokemon[93] = {
            pokemonId: 93, // Haunter
            baseAttack: 172
        };
        moveInfo[16].availableToPokemon[94] = {
            pokemonId: 94, // Gengar
            baseAttack: 204
        };
        moveInfo[16].availableToPokemon[109] = {
            pokemonId: 109, // Koffing
            baseAttack: 136
        };
        moveInfo[16].availableToPokemon[110] = {
            pokemonId: 110, // Weezing
            baseAttack: 190
        };
        moveInfo[18] = {
            moveId: 18,
            name: "Sludge",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 11.54,
            damagePerSecondWithStab: 14.42,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.5,
            cooldown: 2.60
        };
        moveInfo[18].availableToPokemon[88] = {
            pokemonId: 88, // Grimer
            baseAttack: 124
        };
        moveInfo[18].availableToPokemon[109] = {
            pokemonId: 109, // Koffing
            baseAttack: 136
        };
        moveInfo[20] = {
            moveId: 20,
            name: "Vice Grip",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 11.90,
            damagePerSecondWithStab: 14.88,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.25,
            cooldown: 2.10
        };
        moveInfo[20].availableToPokemon[98] = {
            pokemonId: 98, // Krabby
            baseAttack: 116
        };
        moveInfo[20].availableToPokemon[99] = {
            pokemonId: 99, // Kingler
            baseAttack: 178
        };
        moveInfo[20].availableToPokemon[127] = {
            pokemonId: 127, // Pinsir
            baseAttack: 184
        };
        moveInfo[21] = {
            moveId: 21,
            name: "Flame Wheel",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 8.70,
            damagePerSecondWithStab: 10.87,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.5,
            cooldown: 4.60
        };
        moveInfo[21].availableToPokemon[58] = {
            pokemonId: 58, // Growlithe
            baseAttack: 156
        };
        moveInfo[21].availableToPokemon[77] = {
            pokemonId: 77, // Ponyta
            baseAttack: 168
        };
        moveInfo[22] = {
            moveId: 22,
            name: "Megahorn",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Bug,
            damage: 80,
            damageWithStab: 80,
            damagePerSecond: 25.00,
            damagePerSecondWithStab: 31.25,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.3,
            cooldown: 3.20
        };
        moveInfo[22].availableToPokemon[34] = {
            pokemonId: 34, // Nidoking
            baseAttack: 204
        };
        moveInfo[22].availableToPokemon[112] = {
            pokemonId: 112, // Rhydon
            baseAttack: 166
        };
        moveInfo[22].availableToPokemon[119] = {
            pokemonId: 119, // Seaking
            baseAttack: 172
        };
        moveInfo[24] = {
            moveId: 24,
            name: "Flamethrower",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 55,
            damageWithStab: 55,
            damagePerSecond: 18.97,
            damagePerSecondWithStab: 23.71,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 0.9,
            cooldown: 2.90
        };
        moveInfo[24].availableToPokemon[4] = {
            pokemonId: 4, // Charmander
            baseAttack: 128
        };
        moveInfo[24].availableToPokemon[5] = {
            pokemonId: 5, // Charmeleon
            baseAttack: 160
        };
        moveInfo[24].availableToPokemon[6] = {
            pokemonId: 6, // Charizard
            baseAttack: 212
        };
        moveInfo[24].availableToPokemon[37] = {
            pokemonId: 37, // Vulpix
            baseAttack: 106
        };
        moveInfo[24].availableToPokemon[38] = {
            pokemonId: 38, // Ninetales
            baseAttack: 176
        };
        moveInfo[24].availableToPokemon[58] = {
            pokemonId: 58, // Growlithe
            baseAttack: 156
        };
        moveInfo[24].availableToPokemon[59] = {
            pokemonId: 59, // Arcanine
            baseAttack: 230
        };
        moveInfo[24].availableToPokemon[126] = {
            pokemonId: 126, // Magmar
            baseAttack: 214
        };
        moveInfo[24].availableToPokemon[136] = {
            pokemonId: 136, // Flareon
            baseAttack: 238
        };
        moveInfo[26] = {
            moveId: 26,
            name: "Dig",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 70,
            damageWithStab: 70,
            damagePerSecond: 12.07,
            damagePerSecondWithStab: 15.09,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.4,
            cooldown: 5.80
        };
        moveInfo[26].availableToPokemon[19] = {
            pokemonId: 19, // Rattata
            baseAttack: 92
        };
        moveInfo[26].availableToPokemon[20] = {
            pokemonId: 20, // Raticate
            baseAttack: 146
        };
        moveInfo[26].availableToPokemon[27] = {
            pokemonId: 27, // Sandshrew
            baseAttack: 90
        };
        moveInfo[26].availableToPokemon[30] = {
            pokemonId: 30, // Nidorina
            baseAttack: 132
        };
        moveInfo[26].availableToPokemon[33] = {
            pokemonId: 33, // Nidorino
            baseAttack: 142
        };
        moveInfo[26].availableToPokemon[50] = {
            pokemonId: 50, // Diglett
            baseAttack: 108
        };
        moveInfo[26].availableToPokemon[74] = {
            pokemonId: 74, // Geodude
            baseAttack: 106
        };
        moveInfo[26].availableToPokemon[75] = {
            pokemonId: 75, // Graveler
            baseAttack: 142
        };
        moveInfo[26].availableToPokemon[104] = {
            pokemonId: 104, // Cubone
            baseAttack: 102
        };
        moveInfo[26].availableToPokemon[105] = {
            pokemonId: 105, // Marowak
            baseAttack: 140
        };
        moveInfo[26].availableToPokemon[133] = {
            pokemonId: 133, // Eevee
            baseAttack: 114
        };
        moveInfo[28] = {
            moveId: 28,
            name: "Cross Chop",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fighting,
            damage: 60,
            damageWithStab: 60,
            damagePerSecond: 30.00,
            damagePerSecondWithStab: 37.50,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.3,
            cooldown: 2.00
        };
        moveInfo[28].availableToPokemon[54] = {
            pokemonId: 54, // Psyduck
            baseAttack: 132
        };
        moveInfo[28].availableToPokemon[56] = {
            pokemonId: 56, // Mankey
            baseAttack: 122
        };
        moveInfo[28].availableToPokemon[57] = {
            pokemonId: 57, // Primeape
            baseAttack: 178
        };
        moveInfo[28].availableToPokemon[66] = {
            pokemonId: 66, // Machop
            baseAttack: 118
        };
        moveInfo[28].availableToPokemon[67] = {
            pokemonId: 67, // Machoke
            baseAttack: 154
        };
        moveInfo[28].availableToPokemon[68] = {
            pokemonId: 68, // Machamp
            baseAttack: 198
        };
        moveInfo[30] = {
            moveId: 30,
            name: "Psybeam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Psychic,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 10.53,
            damagePerSecondWithStab: 13.16,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 1.3,
            cooldown: 3.80
        };
        moveInfo[30].availableToPokemon[48] = {
            pokemonId: 48, // Venonat
            baseAttack: 108
        };
        moveInfo[30].availableToPokemon[54] = {
            pokemonId: 54, // Psyduck
            baseAttack: 132
        };
        moveInfo[30].availableToPokemon[64] = {
            pokemonId: 64, // Kadabra
            baseAttack: 150
        };
        moveInfo[30].availableToPokemon[96] = {
            pokemonId: 96, // Drowzee
            baseAttack: 104
        };
        moveInfo[30].availableToPokemon[113] = {
            pokemonId: 113, // Chansey
            baseAttack: 40
        };
        moveInfo[30].availableToPokemon[121] = {
            pokemonId: 121, // Starmie
            baseAttack: 194
        };
        moveInfo[30].availableToPokemon[122] = {
            pokemonId: 122, // Mr. Mime
            baseAttack: 154
        };
        moveInfo[30].availableToPokemon[137] = {
            pokemonId: 137, // Porygon
            baseAttack: 156
        };
        moveInfo[31] = {
            moveId: 31,
            name: "Earthquake",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 100,
            damageWithStab: 100,
            damagePerSecond: 23.81,
            damagePerSecondWithStab: 29.76,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 1.95,
            cooldown: 4.20
        };
        moveInfo[31].availableToPokemon[28] = {
            pokemonId: 28, // Sandslash
            baseAttack: 150
        };
        moveInfo[31].availableToPokemon[31] = {
            pokemonId: 31, // Nidoqueen
            baseAttack: 184
        };
        moveInfo[31].availableToPokemon[34] = {
            pokemonId: 34, // Nidoking
            baseAttack: 204
        };
        moveInfo[31].availableToPokemon[51] = {
            pokemonId: 51, // Dugtrio
            baseAttack: 148
        };
        moveInfo[31].availableToPokemon[76] = {
            pokemonId: 76, // Golem
            baseAttack: 176
        };
        moveInfo[31].availableToPokemon[105] = {
            pokemonId: 105, // Marowak
            baseAttack: 140
        };
        moveInfo[31].availableToPokemon[112] = {
            pokemonId: 112, // Rhydon
            baseAttack: 166
        };
        moveInfo[31].availableToPokemon[115] = {
            pokemonId: 115, // Kangaskhan
            baseAttack: 142
        };
        moveInfo[31].availableToPokemon[128] = {
            pokemonId: 128, // Tauros
            baseAttack: 148
        };
        moveInfo[31].availableToPokemon[143] = {
            pokemonId: 143, // Snorlax
            baseAttack: 180
        };
        moveInfo[31].availableToPokemon[151] = {
            pokemonId: 151, // Mew
            baseAttack: 220
        };
        moveInfo[32] = {
            moveId: 32,
            name: "Stone Edge",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Rock,
            damage: 80,
            damageWithStab: 80,
            damagePerSecond: 25.81,
            damagePerSecondWithStab: 32.26,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.4,
            cooldown: 3.10
        };
        moveInfo[32].availableToPokemon[31] = {
            pokemonId: 31, // Nidoqueen
            baseAttack: 184
        };
        moveInfo[32].availableToPokemon[51] = {
            pokemonId: 51, // Dugtrio
            baseAttack: 148
        };
        moveInfo[32].availableToPokemon[68] = {
            pokemonId: 68, // Machamp
            baseAttack: 198
        };
        moveInfo[32].availableToPokemon[75] = {
            pokemonId: 75, // Graveler
            baseAttack: 142
        };
        moveInfo[32].availableToPokemon[76] = {
            pokemonId: 76, // Golem
            baseAttack: 176
        };
        moveInfo[32].availableToPokemon[95] = {
            pokemonId: 95, // Onix
            baseAttack: 90
        };
        moveInfo[32].availableToPokemon[106] = {
            pokemonId: 106, // Hitmonlee
            baseAttack: 148
        };
        moveInfo[32].availableToPokemon[112] = {
            pokemonId: 112, // Rhydon
            baseAttack: 166
        };
        moveInfo[32].availableToPokemon[141] = {
            pokemonId: 141, // Kabutops
            baseAttack: 190
        };
        moveInfo[33] = {
            moveId: 33,
            name: "Ice Punch",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ice,
            damage: 45,
            damageWithStab: 45,
            damagePerSecond: 12.86,
            damagePerSecondWithStab: 16.07,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 1.1,
            cooldown: 3.50
        };
        moveInfo[33].availableToPokemon[62] = {
            pokemonId: 62, // Poliwrath
            baseAttack: 180
        };
        moveInfo[33].availableToPokemon[107] = {
            pokemonId: 107, // Hitmonchan
            baseAttack: 138
        };
        moveInfo[33].availableToPokemon[124] = {
            pokemonId: 124, // Jynx
            baseAttack: 172
        };
        moveInfo[35] = {
            moveId: 35,
            name: "Discharge",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Electric,
            damage: 35,
            damageWithStab: 35,
            damagePerSecond: 14.00,
            damagePerSecondWithStab: 17.50,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.7,
            cooldown: 2.50
        };
        moveInfo[35].availableToPokemon[25] = {
            pokemonId: 25, // Pikachu
            baseAttack: 124
        };
        moveInfo[35].availableToPokemon[81] = {
            pokemonId: 81, // Magnemite
            baseAttack: 128
        };
        moveInfo[35].availableToPokemon[82] = {
            pokemonId: 82, // Magneton
            baseAttack: 186
        };
        moveInfo[35].availableToPokemon[100] = {
            pokemonId: 100, // Voltorb
            baseAttack: 102
        };
        moveInfo[35].availableToPokemon[101] = {
            pokemonId: 101, // Electrode
            baseAttack: 150
        };
        moveInfo[35].availableToPokemon[135] = {
            pokemonId: 135, // Jolteon
            baseAttack: 192
        };
        moveInfo[35].availableToPokemon[137] = {
            pokemonId: 137, // Porygon
            baseAttack: 156
        };
        moveInfo[35].availableToPokemon[145] = {
            pokemonId: 145, // Zapdos
            baseAttack: 232
        };
        moveInfo[36] = {
            moveId: 36,
            name: "Flash Cannon",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Steel,
            damage: 60,
            damageWithStab: 60,
            damagePerSecond: 15.38,
            damagePerSecondWithStab: 19.23,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 1.1,
            cooldown: 3.90
        };
        moveInfo[36].availableToPokemon[9] = {
            pokemonId: 9, // Blastoise
            baseAttack: 186
        };
        moveInfo[36].availableToPokemon[82] = {
            pokemonId: 82, // Magneton
            baseAttack: 186
        };
        moveInfo[36].availableToPokemon[116] = {
            pokemonId: 116, // Horsea
            baseAttack: 122
        };
        moveInfo[38] = {
            moveId: 38,
            name: "Drill Peck",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Flying,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 14.81,
            damagePerSecondWithStab: 18.52,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.9,
            cooldown: 2.70
        };
        moveInfo[38].availableToPokemon[21] = {
            pokemonId: 21, // Spearow
            baseAttack: 102
        };
        moveInfo[38].availableToPokemon[84] = {
            pokemonId: 84, // Doduo
            baseAttack: 126
        };
        moveInfo[38].availableToPokemon[85] = {
            pokemonId: 85, // Dodrio
            baseAttack: 182
        };
        moveInfo[39] = {
            moveId: 39,
            name: "Ice Beam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ice,
            damage: 65,
            damageWithStab: 65,
            damagePerSecond: 17.81,
            damagePerSecondWithStab: 22.26,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 1.35,
            cooldown: 3.65
        };
        moveInfo[39].availableToPokemon[8] = {
            pokemonId: 8, // Wartortle
            baseAttack: 144
        };
        moveInfo[39].availableToPokemon[9] = {
            pokemonId: 9, // Blastoise
            baseAttack: 186
        };
        moveInfo[39].availableToPokemon[55] = {
            pokemonId: 55, // Golduck
            baseAttack: 194
        };
        moveInfo[39].availableToPokemon[80] = {
            pokemonId: 80, // Slowbro
            baseAttack: 184
        };
        moveInfo[39].availableToPokemon[131] = {
            pokemonId: 131, // Lapras
            baseAttack: 186
        };
        moveInfo[39].availableToPokemon[144] = {
            pokemonId: 144, // Articuno
            baseAttack: 198
        };
        moveInfo[40] = {
            moveId: 40,
            name: "Blizzard",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ice,
            damage: 100,
            damageWithStab: 100,
            damagePerSecond: 25.64,
            damagePerSecondWithStab: 32.05,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0,
            cooldown: 3.90
        };
        moveInfo[40].availableToPokemon[73] = {
            pokemonId: 73, // Tentacruel
            baseAttack: 170
        };
        moveInfo[40].availableToPokemon[87] = {
            pokemonId: 87, // Dewgong
            baseAttack: 156
        };
        moveInfo[40].availableToPokemon[91] = {
            pokemonId: 91, // Cloyster
            baseAttack: 196
        };
        moveInfo[40].availableToPokemon[117] = {
            pokemonId: 117, // Seadra
            baseAttack: 176
        };
        moveInfo[40].availableToPokemon[131] = {
            pokemonId: 131, // Lapras
            baseAttack: 186
        };
        moveInfo[40].availableToPokemon[144] = {
            pokemonId: 144, // Articuno
            baseAttack: 198
        };
        moveInfo[42] = {
            moveId: 42,
            name: "Heat Wave",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 80,
            damageWithStab: 80,
            damagePerSecond: 21.05,
            damagePerSecondWithStab: 26.32,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.4,
            cooldown: 3.80
        };
        moveInfo[42].availableToPokemon[38] = {
            pokemonId: 38, // Ninetales
            baseAttack: 176
        };
        moveInfo[42].availableToPokemon[78] = {
            pokemonId: 78, // Rapidash
            baseAttack: 200
        };
        moveInfo[42].availableToPokemon[136] = {
            pokemonId: 136, // Flareon
            baseAttack: 238
        };
        moveInfo[45] = {
            moveId: 45,
            name: "Aerial Ace",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Flying,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 10.34,
            damagePerSecondWithStab: 12.93,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.6,
            cooldown: 2.90
        };
        moveInfo[45].availableToPokemon[15] = {
            pokemonId: 15, // Beedrill
            baseAttack: 144
        };
        moveInfo[45].availableToPokemon[16] = {
            pokemonId: 16, // Pidgey
            baseAttack: 94
        };
        moveInfo[45].availableToPokemon[17] = {
            pokemonId: 17, // Pidgeotto
            baseAttack: 126
        };
        moveInfo[45].availableToPokemon[18] = {
            pokemonId: 18, // Pidgeot
            baseAttack: 170
        };
        moveInfo[45].availableToPokemon[21] = {
            pokemonId: 21, // Spearow
            baseAttack: 102
        };
        moveInfo[45].availableToPokemon[22] = {
            pokemonId: 22, // Fearow
            baseAttack: 168
        };
        moveInfo[45].availableToPokemon[83] = {
            pokemonId: 83, // Farfetch'd
            baseAttack: 138
        };
        moveInfo[45].availableToPokemon[84] = {
            pokemonId: 84, // Doduo
            baseAttack: 126
        };
        moveInfo[45].availableToPokemon[85] = {
            pokemonId: 85, // Dodrio
            baseAttack: 182
        };
        moveInfo[46] = {
            moveId: 46,
            name: "Drill Run",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 50,
            damageWithStab: 50,
            damagePerSecond: 14.71,
            damagePerSecondWithStab: 18.38,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.7,
            cooldown: 3.40
        };
        moveInfo[46].availableToPokemon[22] = {
            pokemonId: 22, // Fearow
            baseAttack: 168
        };
        moveInfo[46].availableToPokemon[78] = {
            pokemonId: 78, // Rapidash
            baseAttack: 200
        };
        moveInfo[46].availableToPokemon[119] = {
            pokemonId: 119, // Seaking
            baseAttack: 172
        };
        moveInfo[47] = {
            moveId: 47,
            name: "Petal Blizzard",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Grass,
            damage: 65,
            damageWithStab: 65,
            damagePerSecond: 20.31,
            damagePerSecondWithStab: 25.39,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 1,
            cooldown: 3.20
        };
        moveInfo[47].availableToPokemon[3] = {
            pokemonId: 3, // Venusaur
            baseAttack: 198
        };
        moveInfo[47].availableToPokemon[44] = {
            pokemonId: 44, // Gloom
            baseAttack: 162
        };
        moveInfo[47].availableToPokemon[45] = {
            pokemonId: 45, // Vileplume
            baseAttack: 202
        };
        moveInfo[49] = {
            moveId: 49,
            name: "Bug Buzz",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Bug,
            damage: 75,
            damageWithStab: 75,
            damagePerSecond: 17.65,
            damagePerSecondWithStab: 22.06,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 1.5,
            cooldown: 4.25
        };
        moveInfo[49].availableToPokemon[12] = {
            pokemonId: 12, // Butterfree
            baseAttack: 144
        };
        moveInfo[49].availableToPokemon[49] = {
            pokemonId: 49, // Venomoth
            baseAttack: 172
        };
        moveInfo[49].availableToPokemon[123] = {
            pokemonId: 123, // Scyther
            baseAttack: 176
        };
        moveInfo[50] = {
            moveId: 50,
            name: "Poison Fang",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 10.42,
            damagePerSecondWithStab: 13.02,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.2,
            cooldown: 2.40
        };
        moveInfo[50].availableToPokemon[29] = {
            pokemonId: 29, // Nidoran F
            baseAttack: 100
        };
        moveInfo[50].availableToPokemon[30] = {
            pokemonId: 30, // Nidorina
            baseAttack: 132
        };
        moveInfo[50].availableToPokemon[41] = {
            pokemonId: 41, // Zubat
            baseAttack: 88
        };
        moveInfo[50].availableToPokemon[42] = {
            pokemonId: 42, // Golbat
            baseAttack: 164
        };
        moveInfo[50].availableToPokemon[48] = {
            pokemonId: 48, // Venonat
            baseAttack: 108
        };
        moveInfo[50].availableToPokemon[49] = {
            pokemonId: 49, // Venomoth
            baseAttack: 172
        };
        moveInfo[51] = {
            moveId: 51,
            name: "Night Slash",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Dark,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 11.11,
            damagePerSecondWithStab: 13.89,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.2,
            cooldown: 2.70
        };
        moveInfo[51].availableToPokemon[52] = {
            pokemonId: 52, // Meowth
            baseAttack: 104
        };
        moveInfo[51].availableToPokemon[53] = {
            pokemonId: 53, // Persian
            baseAttack: 156
        };
        moveInfo[51].availableToPokemon[57] = {
            pokemonId: 57, // Primeape
            baseAttack: 178
        };
        moveInfo[51].availableToPokemon[123] = {
            pokemonId: 123, // Scyther
            baseAttack: 176
        };
        moveInfo[53] = {
            moveId: 53,
            name: "Bubble Beam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 10.34,
            damagePerSecondWithStab: 12.93,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.2,
            cooldown: 2.90
        };
        moveInfo[53].availableToPokemon[60] = {
            pokemonId: 60, // Poliwag
            baseAttack: 108
        };
        moveInfo[53].availableToPokemon[61] = {
            pokemonId: 61, // Poliwhirl
            baseAttack: 132
        };
        moveInfo[53].availableToPokemon[72] = {
            pokemonId: 72, // Tentacool
            baseAttack: 106
        };
        moveInfo[53].availableToPokemon[90] = {
            pokemonId: 90, // Shellder
            baseAttack: 120
        };
        moveInfo[53].availableToPokemon[98] = {
            pokemonId: 98, // Krabby
            baseAttack: 116
        };
        moveInfo[53].availableToPokemon[116] = {
            pokemonId: 116, // Horsea
            baseAttack: 122
        };
        moveInfo[53].availableToPokemon[120] = {
            pokemonId: 120, // Staryu
            baseAttack: 130
        };
        moveInfo[54] = {
            moveId: 54,
            name: "Submission",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fighting,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 14.29,
            damagePerSecondWithStab: 17.86,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.15,
            cooldown: 2.10
        };
        moveInfo[54].availableToPokemon[62] = {
            pokemonId: 62, // Poliwrath
            baseAttack: 180
        };
        moveInfo[54].availableToPokemon[67] = {
            pokemonId: 67, // Machoke
            baseAttack: 154
        };
        moveInfo[54].availableToPokemon[68] = {
            pokemonId: 68, // Machamp
            baseAttack: 198
        };
        moveInfo[54].availableToPokemon[127] = {
            pokemonId: 127, // Pinsir
            baseAttack: 184
        };
        moveInfo[56] = {
            moveId: 56,
            name: "Low Sweep",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fighting,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 13.33,
            damagePerSecondWithStab: 16.67,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.15,
            cooldown: 2.25
        };
        moveInfo[56].availableToPokemon[56] = {
            pokemonId: 56, // Mankey
            baseAttack: 122
        };
        moveInfo[56].availableToPokemon[57] = {
            pokemonId: 57, // Primeape
            baseAttack: 178
        };
        moveInfo[56].availableToPokemon[66] = {
            pokemonId: 66, // Machop
            baseAttack: 118
        };
        moveInfo[56].availableToPokemon[106] = {
            pokemonId: 106, // Hitmonlee
            baseAttack: 148
        };
        moveInfo[57] = {
            moveId: 57,
            name: "Aqua Jet",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 10.64,
            damagePerSecondWithStab: 13.30,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.4,
            cooldown: 2.35
        };
        moveInfo[57].availableToPokemon[7] = {
            pokemonId: 7, // Squirtle
            baseAttack: 112
        };
        moveInfo[57].availableToPokemon[8] = {
            pokemonId: 8, // Wartortle
            baseAttack: 144
        };
        moveInfo[57].availableToPokemon[86] = {
            pokemonId: 86, // Seel
            baseAttack: 104
        };
        moveInfo[57].availableToPokemon[87] = {
            pokemonId: 87, // Dewgong
            baseAttack: 156
        };
        moveInfo[57].availableToPokemon[140] = {
            pokemonId: 140, // Kabuto
            baseAttack: 148
        };
        moveInfo[58] = {
            moveId: 58,
            name: "Aqua Tail",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 45,
            damageWithStab: 45,
            damagePerSecond: 19.15,
            damagePerSecondWithStab: 23.94,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 0.2,
            cooldown: 2.35
        };
        moveInfo[58].availableToPokemon[7] = {
            pokemonId: 7, // Squirtle
            baseAttack: 112
        };
        moveInfo[58].availableToPokemon[54] = {
            pokemonId: 54, // Psyduck
            baseAttack: 132
        };
        moveInfo[58].availableToPokemon[86] = {
            pokemonId: 86, // Seel
            baseAttack: 104
        };
        moveInfo[58].availableToPokemon[118] = {
            pokemonId: 118, // Goldeen
            baseAttack: 112
        };
        moveInfo[58].availableToPokemon[134] = {
            pokemonId: 134, // Vaporeon
            baseAttack: 186
        };
        moveInfo[58].availableToPokemon[147] = {
            pokemonId: 147, // Dratini
            baseAttack: 128
        };
        moveInfo[58].availableToPokemon[148] = {
            pokemonId: 148, // Dragonair
            baseAttack: 170
        };
        moveInfo[59] = {
            moveId: 59,
            name: "Seed Bomb",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Grass,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 16.67,
            damagePerSecondWithStab: 20.83,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.5,
            cooldown: 2.40
        };
        moveInfo[59].availableToPokemon[1] = {
            pokemonId: 1, // Bulbasaur
            baseAttack: 126
        };
        moveInfo[59].availableToPokemon[43] = {
            pokemonId: 43, // Oddish
            baseAttack: 134
        };
        moveInfo[59].availableToPokemon[46] = {
            pokemonId: 46, // Paras
            baseAttack: 122
        };
        moveInfo[59].availableToPokemon[70] = {
            pokemonId: 70, // Weepinbell
            baseAttack: 190
        };
        moveInfo[59].availableToPokemon[102] = {
            pokemonId: 102, // Exeggcute
            baseAttack: 110
        };
        moveInfo[59].availableToPokemon[103] = {
            pokemonId: 103, // Exeggutor
            baseAttack: 232
        };
        moveInfo[60] = {
            moveId: 60,
            name: "Psyshock",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Psychic,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 14.81,
            damagePerSecondWithStab: 18.52,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.5,
            cooldown: 2.70
        };
        moveInfo[60].availableToPokemon[63] = {
            pokemonId: 63, // Abra
            baseAttack: 110
        };
        moveInfo[60].availableToPokemon[79] = {
            pokemonId: 79, // Slowpoke
            baseAttack: 110
        };
        moveInfo[60].availableToPokemon[96] = {
            pokemonId: 96, // Drowzee
            baseAttack: 104
        };
        moveInfo[60].availableToPokemon[97] = {
            pokemonId: 97, // Hypno
            baseAttack: 162
        };
        moveInfo[60].availableToPokemon[124] = {
            pokemonId: 124, // Jynx
            baseAttack: 172
        };
        moveInfo[62] = {
            moveId: 62,
            name: "Ancient Power",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Rock,
            damage: 35,
            damageWithStab: 35,
            damagePerSecond: 9.72,
            damagePerSecondWithStab: 12.15,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.35,
            cooldown: 3.60
        };
        moveInfo[62].availableToPokemon[76] = {
            pokemonId: 76, // Golem
            baseAttack: 176
        };
        moveInfo[62].availableToPokemon[102] = {
            pokemonId: 102, // Exeggcute
            baseAttack: 110
        };
        moveInfo[62].availableToPokemon[138] = {
            pokemonId: 138, // Omanyte
            baseAttack: 132
        };
        moveInfo[62].availableToPokemon[139] = {
            pokemonId: 139, // Omastar
            baseAttack: 180
        };
        moveInfo[62].availableToPokemon[140] = {
            pokemonId: 140, // Kabuto
            baseAttack: 148
        };
        moveInfo[62].availableToPokemon[141] = {
            pokemonId: 141, // Kabutops
            baseAttack: 190
        };
        moveInfo[62].availableToPokemon[142] = {
            pokemonId: 142, // Aerodactyl
            baseAttack: 182
        };
        moveInfo[63] = {
            moveId: 63,
            name: "Rock Tomb",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Rock,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 8.82,
            damagePerSecondWithStab: 11.03,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.9,
            cooldown: 3.40
        };
        moveInfo[63].availableToPokemon[27] = {
            pokemonId: 27, // Sandshrew
            baseAttack: 90
        };
        moveInfo[63].availableToPokemon[28] = {
            pokemonId: 28, // Sandslash
            baseAttack: 150
        };
        moveInfo[63].availableToPokemon[50] = {
            pokemonId: 50, // Diglett
            baseAttack: 108
        };
        moveInfo[63].availableToPokemon[74] = {
            pokemonId: 74, // Geodude
            baseAttack: 106
        };
        moveInfo[63].availableToPokemon[138] = {
            pokemonId: 138, // Omanyte
            baseAttack: 132
        };
        moveInfo[63].availableToPokemon[140] = {
            pokemonId: 140, // Kabuto
            baseAttack: 148
        };
        moveInfo[64] = {
            moveId: 64,
            name: "Rock Slide",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Rock,
            damage: 50,
            damageWithStab: 50,
            damagePerSecond: 15.63,
            damagePerSecondWithStab: 19.53,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 1.4,
            cooldown: 3.20
        };
        moveInfo[64].availableToPokemon[27] = {
            pokemonId: 27, // Sandshrew
            baseAttack: 90
        };
        moveInfo[64].availableToPokemon[74] = {
            pokemonId: 74, // Geodude
            baseAttack: 106
        };
        moveInfo[64].availableToPokemon[75] = {
            pokemonId: 75, // Graveler
            baseAttack: 142
        };
        moveInfo[64].availableToPokemon[95] = {
            pokemonId: 95, // Onix
            baseAttack: 90
        };
        moveInfo[64].availableToPokemon[139] = {
            pokemonId: 139, // Omastar
            baseAttack: 180
        };
        moveInfo[65] = {
            moveId: 65,
            name: "Power Gem",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Rock,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 13.79,
            damagePerSecondWithStab: 17.24,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.8,
            cooldown: 2.90
        };
        moveInfo[65].availableToPokemon[53] = {
            pokemonId: 53, // Persian
            baseAttack: 156
        };
        moveInfo[65].availableToPokemon[120] = {
            pokemonId: 120, // Staryu
            baseAttack: 130
        };
        moveInfo[65].availableToPokemon[121] = {
            pokemonId: 121, // Starmie
            baseAttack: 194
        };
        moveInfo[69] = {
            moveId: 69,
            name: "Ominous Wind",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ghost,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 9.68,
            damagePerSecondWithStab: 12.10,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.25,
            cooldown: 3.10
        };
        moveInfo[69].availableToPokemon[42] = {
            pokemonId: 42, // Golbat
            baseAttack: 164
        };
        moveInfo[69].availableToPokemon[92] = {
            pokemonId: 92, // Gastly
            baseAttack: 136
        };
        moveInfo[70] = {
            moveId: 70,
            name: "Shadow Ball",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ghost,
            damage: 45,
            damageWithStab: 45,
            damagePerSecond: 14.61,
            damagePerSecondWithStab: 18.26,
            damagePerSecondDefensive: 8.86,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.3,
            cooldown: 3.08
        };
        moveInfo[70].availableToPokemon[63] = {
            pokemonId: 63, // Abra
            baseAttack: 110
        };
        moveInfo[70].availableToPokemon[64] = {
            pokemonId: 64, // Kadabra
            baseAttack: 150
        };
        moveInfo[70].availableToPokemon[65] = {
            pokemonId: 65, // Alakazam
            baseAttack: 186
        };
        moveInfo[70].availableToPokemon[93] = {
            pokemonId: 93, // Haunter
            baseAttack: 172
        };
        moveInfo[70].availableToPokemon[94] = {
            pokemonId: 94, // Gengar
            baseAttack: 204
        };
        moveInfo[70].availableToPokemon[97] = {
            pokemonId: 97, // Hypno
            baseAttack: 162
        };
        moveInfo[70].availableToPokemon[110] = {
            pokemonId: 110, // Weezing
            baseAttack: 190
        };
        moveInfo[70].availableToPokemon[122] = {
            pokemonId: 122, // Mr. Mime
            baseAttack: 154
        };
        moveInfo[70].availableToPokemon[150] = {
            pokemonId: 150, // Mewtwo
            baseAttack: 284
        };
        moveInfo[72] = {
            moveId: 72,
            name: "Magnet Bomb",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Steel,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 10.71,
            damagePerSecondWithStab: 13.39,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.55,
            cooldown: 2.80
        };
        moveInfo[72].availableToPokemon[81] = {
            pokemonId: 81, // Magnemite
            baseAttack: 128
        };
        moveInfo[72].availableToPokemon[82] = {
            pokemonId: 82, // Magneton
            baseAttack: 186
        };
        moveInfo[74] = {
            moveId: 74,
            name: "Iron Head",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Steel,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 15.00,
            damagePerSecondWithStab: 18.75,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.25,
            cooldown: 2.00
        };
        moveInfo[74].availableToPokemon[95] = {
            pokemonId: 95, // Onix
            baseAttack: 90
        };
        moveInfo[74].availableToPokemon[128] = {
            pokemonId: 128, // Tauros
            baseAttack: 148
        };
        moveInfo[74].availableToPokemon[142] = {
            pokemonId: 142, // Aerodactyl
            baseAttack: 182
        };
        moveInfo[77] = {
            moveId: 77,
            name: "Thunder Punch",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Electric,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 16.67,
            damagePerSecondWithStab: 20.83,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.25,
            cooldown: 2.40
        };
        moveInfo[77].availableToPokemon[26] = {
            pokemonId: 26, // Raichu
            baseAttack: 200
        };
        moveInfo[77].availableToPokemon[107] = {
            pokemonId: 107, // Hitmonchan
            baseAttack: 138
        };
        moveInfo[77].availableToPokemon[125] = {
            pokemonId: 125, // Electabuzz
            baseAttack: 198
        };
        moveInfo[79] = {
            moveId: 79,
            name: "Thunderbolt",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Electric,
            damage: 55,
            damageWithStab: 55,
            damagePerSecond: 20.37,
            damagePerSecondWithStab: 25.46,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 0.8,
            cooldown: 2.70
        };
        moveInfo[79].availableToPokemon[25] = {
            pokemonId: 25, // Pikachu
            baseAttack: 124
        };
        moveInfo[79].availableToPokemon[81] = {
            pokemonId: 81, // Magnemite
            baseAttack: 128
        };
        moveInfo[79].availableToPokemon[100] = {
            pokemonId: 100, // Voltorb
            baseAttack: 102
        };
        moveInfo[79].availableToPokemon[101] = {
            pokemonId: 101, // Electrode
            baseAttack: 150
        };
        moveInfo[79].availableToPokemon[125] = {
            pokemonId: 125, // Electabuzz
            baseAttack: 198
        };
        moveInfo[79].availableToPokemon[135] = {
            pokemonId: 135, // Jolteon
            baseAttack: 192
        };
        moveInfo[79].availableToPokemon[145] = {
            pokemonId: 145, // Zapdos
            baseAttack: 232
        };
        moveInfo[80] = {
            moveId: 80,
            name: "Twister",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Dragon,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 9.26,
            damagePerSecondWithStab: 11.57,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 1.75,
            cooldown: 2.70
        };
        moveInfo[80].availableToPokemon[16] = {
            pokemonId: 16, // Pidgey
            baseAttack: 94
        };
        moveInfo[80].availableToPokemon[17] = {
            pokemonId: 17, // Pidgeotto
            baseAttack: 126
        };
        moveInfo[80].availableToPokemon[21] = {
            pokemonId: 21, // Spearow
            baseAttack: 102
        };
        moveInfo[80].availableToPokemon[22] = {
            pokemonId: 22, // Fearow
            baseAttack: 168
        };
        moveInfo[80].availableToPokemon[130] = {
            pokemonId: 130, // Gyarados
            baseAttack: 192
        };
        moveInfo[80].availableToPokemon[147] = {
            pokemonId: 147, // Dratini
            baseAttack: 128
        };
        moveInfo[82] = {
            moveId: 82,
            name: "Dragon Pulse",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Dragon,
            damage: 65,
            damageWithStab: 65,
            damagePerSecond: 18.06,
            damagePerSecondWithStab: 22.57,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 1.2,
            cooldown: 3.60
        };
        moveInfo[82].availableToPokemon[116] = {
            pokemonId: 116, // Horsea
            baseAttack: 122
        };
        moveInfo[82].availableToPokemon[117] = {
            pokemonId: 117, // Seadra
            baseAttack: 176
        };
        moveInfo[82].availableToPokemon[130] = {
            pokemonId: 130, // Gyarados
            baseAttack: 192
        };
        moveInfo[82].availableToPokemon[131] = {
            pokemonId: 131, // Lapras
            baseAttack: 186
        };
        moveInfo[82].availableToPokemon[148] = {
            pokemonId: 148, // Dragonair
            baseAttack: 170
        };
        moveInfo[82].availableToPokemon[149] = {
            pokemonId: 149, // Dragonite
            baseAttack: 250
        };
        moveInfo[82].availableToPokemon[151] = {
            pokemonId: 151, // Mew
            baseAttack: 220
        };
        moveInfo[83] = {
            moveId: 83,
            name: "Dragon Claw",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Dragon,
            damage: 35,
            damageWithStab: 35,
            damagePerSecond: 21.88,
            damagePerSecondWithStab: 27.34,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 0.2,
            cooldown: 1.60
        };
        moveInfo[83].availableToPokemon[6] = {
            pokemonId: 6, // Charizard
            baseAttack: 212
        };
        moveInfo[83].availableToPokemon[149] = {
            pokemonId: 149, // Dragonite
            baseAttack: 250
        };
        moveInfo[84] = {
            moveId: 84,
            name: "Disarming Voice",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fairy,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 6.41,
            damagePerSecondWithStab: 8.01,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 1.8,
            cooldown: 3.90
        };
        moveInfo[84].availableToPokemon[35] = {
            pokemonId: 35, // Clefairy
            baseAttack: 116
        };
        moveInfo[84].availableToPokemon[39] = {
            pokemonId: 39, // Jigglypuff
            baseAttack: 98
        };
        moveInfo[85] = {
            moveId: 85,
            name: "Draining Kiss",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fairy,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 8.93,
            damagePerSecondWithStab: 11.16,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.1,
            cooldown: 2.80
        };
        moveInfo[85].availableToPokemon[124] = {
            pokemonId: 124, // Jynx
            baseAttack: 172
        };
        moveInfo[86] = {
            moveId: 86,
            name: "Dazzling Gleam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fairy,
            damage: 55,
            damageWithStab: 55,
            damagePerSecond: 13.10,
            damagePerSecondWithStab: 16.37,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.8,
            cooldown: 4.20
        };
        moveInfo[86].availableToPokemon[36] = {
            pokemonId: 36, // Clefable
            baseAttack: 178
        };
        moveInfo[86].availableToPokemon[40] = {
            pokemonId: 40, // Wigglytuff
            baseAttack: 168
        };
        moveInfo[86].availableToPokemon[64] = {
            pokemonId: 64, // Kadabra
            baseAttack: 150
        };
        moveInfo[86].availableToPokemon[65] = {
            pokemonId: 65, // Alakazam
            baseAttack: 186
        };
        moveInfo[86].availableToPokemon[113] = {
            pokemonId: 113, // Chansey
            baseAttack: 40
        };
        moveInfo[87] = {
            moveId: 87,
            name: "Moonblast",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fairy,
            damage: 85,
            damageWithStab: 85,
            damagePerSecond: 20.73,
            damagePerSecondWithStab: 25.91,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.6,
            cooldown: 4.10
        };
        moveInfo[87].availableToPokemon[35] = {
            pokemonId: 35, // Clefairy
            baseAttack: 116
        };
        moveInfo[87].availableToPokemon[36] = {
            pokemonId: 36, // Clefable
            baseAttack: 178
        };
        moveInfo[87].availableToPokemon[43] = {
            pokemonId: 43, // Oddish
            baseAttack: 134
        };
        moveInfo[87].availableToPokemon[44] = {
            pokemonId: 44, // Gloom
            baseAttack: 162
        };
        moveInfo[87].availableToPokemon[45] = {
            pokemonId: 45, // Vileplume
            baseAttack: 202
        };
        moveInfo[87].availableToPokemon[151] = {
            pokemonId: 151, // Mew
            baseAttack: 220
        };
        moveInfo[88] = {
            moveId: 88,
            name: "Play Rough",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fairy,
            damage: 55,
            damageWithStab: 55,
            damagePerSecond: 18.97,
            damagePerSecondWithStab: 23.71,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 1.3,
            cooldown: 2.90
        };
        moveInfo[88].availableToPokemon[39] = {
            pokemonId: 39, // Jigglypuff
            baseAttack: 98
        };
        moveInfo[88].availableToPokemon[40] = {
            pokemonId: 40, // Wigglytuff
            baseAttack: 168
        };
        moveInfo[88].availableToPokemon[53] = {
            pokemonId: 53, // Persian
            baseAttack: 156
        };
        moveInfo[89] = {
            moveId: 89,
            name: "Cross Poison",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 16.67,
            damagePerSecondWithStab: 20.83,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.3,
            cooldown: 1.50
        };
        moveInfo[89].availableToPokemon[46] = {
            pokemonId: 46, // Paras
            baseAttack: 122
        };
        moveInfo[89].availableToPokemon[47] = {
            pokemonId: 47, // Parasect
            baseAttack: 162
        };
        moveInfo[90] = {
            moveId: 90,
            name: "Sludge Bomb",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 55,
            damageWithStab: 55,
            damagePerSecond: 21.15,
            damagePerSecondWithStab: 26.44,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 0.5,
            cooldown: 2.60
        };
        moveInfo[90].availableToPokemon[1] = {
            pokemonId: 1, // Bulbasaur
            baseAttack: 126
        };
        moveInfo[90].availableToPokemon[2] = {
            pokemonId: 2, // Ivysaur
            baseAttack: 156
        };
        moveInfo[90].availableToPokemon[3] = {
            pokemonId: 3, // Venusaur
            baseAttack: 198
        };
        moveInfo[90].availableToPokemon[15] = {
            pokemonId: 15, // Beedrill
            baseAttack: 144
        };
        moveInfo[90].availableToPokemon[23] = {
            pokemonId: 23, // Ekans
            baseAttack: 112
        };
        moveInfo[90].availableToPokemon[29] = {
            pokemonId: 29, // Nidoran F
            baseAttack: 100
        };
        moveInfo[90].availableToPokemon[30] = {
            pokemonId: 30, // Nidorina
            baseAttack: 132
        };
        moveInfo[90].availableToPokemon[32] = {
            pokemonId: 32, // Nidoran M
            baseAttack: 110
        };
        moveInfo[90].availableToPokemon[33] = {
            pokemonId: 33, // Nidorino
            baseAttack: 142
        };
        moveInfo[90].availableToPokemon[41] = {
            pokemonId: 41, // Zubat
            baseAttack: 88
        };
        moveInfo[90].availableToPokemon[43] = {
            pokemonId: 43, // Oddish
            baseAttack: 134
        };
        moveInfo[90].availableToPokemon[44] = {
            pokemonId: 44, // Gloom
            baseAttack: 162
        };
        moveInfo[90].availableToPokemon[69] = {
            pokemonId: 69, // Bellsprout
            baseAttack: 158
        };
        moveInfo[90].availableToPokemon[70] = {
            pokemonId: 70, // Weepinbell
            baseAttack: 190
        };
        moveInfo[90].availableToPokemon[71] = {
            pokemonId: 71, // Victreebel
            baseAttack: 222
        };
        moveInfo[90].availableToPokemon[88] = {
            pokemonId: 88, // Grimer
            baseAttack: 124
        };
        moveInfo[90].availableToPokemon[92] = {
            pokemonId: 92, // Gastly
            baseAttack: 136
        };
        moveInfo[90].availableToPokemon[93] = {
            pokemonId: 93, // Haunter
            baseAttack: 172
        };
        moveInfo[90].availableToPokemon[109] = {
            pokemonId: 109, // Koffing
            baseAttack: 136
        };
        moveInfo[90].availableToPokemon[110] = {
            pokemonId: 110, // Weezing
            baseAttack: 190
        };
        moveInfo[90].availableToPokemon[114] = {
            pokemonId: 114, // Tangela
            baseAttack: 164
        };
        moveInfo[91] = {
            moveId: 91,
            name: "Sludge Wave",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 70,
            damageWithStab: 70,
            damagePerSecond: 20.59,
            damagePerSecondWithStab: 25.74,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.9,
            cooldown: 3.40
        };
        moveInfo[91].availableToPokemon[24] = {
            pokemonId: 24, // Arbok
            baseAttack: 166
        };
        moveInfo[91].availableToPokemon[31] = {
            pokemonId: 31, // Nidoqueen
            baseAttack: 184
        };
        moveInfo[91].availableToPokemon[34] = {
            pokemonId: 34, // Nidoking
            baseAttack: 204
        };
        moveInfo[91].availableToPokemon[73] = {
            pokemonId: 73, // Tentacruel
            baseAttack: 170
        };
        moveInfo[91].availableToPokemon[89] = {
            pokemonId: 89, // Muk
            baseAttack: 180
        };
        moveInfo[91].availableToPokemon[94] = {
            pokemonId: 94, // Gengar
            baseAttack: 204
        };
        moveInfo[92] = {
            moveId: 92,
            name: "Gunk Shot",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 65,
            damageWithStab: 65,
            damagePerSecond: 21.67,
            damagePerSecondWithStab: 27.08,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.4,
            cooldown: 3.00
        };
        moveInfo[92].availableToPokemon[23] = {
            pokemonId: 23, // Ekans
            baseAttack: 112
        };
        moveInfo[92].availableToPokemon[24] = {
            pokemonId: 24, // Arbok
            baseAttack: 166
        };
        moveInfo[92].availableToPokemon[89] = {
            pokemonId: 89, // Muk
            baseAttack: 180
        };
        moveInfo[94] = {
            moveId: 94,
            name: "Bone Club",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 15.63,
            damagePerSecondWithStab: 19.53,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.25,
            cooldown: 1.60
        };
        moveInfo[94].availableToPokemon[104] = {
            pokemonId: 104, // Cubone
            baseAttack: 102
        };
        moveInfo[94].availableToPokemon[105] = {
            pokemonId: 105, // Marowak
            baseAttack: 140
        };
        moveInfo[95] = {
            moveId: 95,
            name: "Bulldoze",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 35,
            damageWithStab: 35,
            damagePerSecond: 10.29,
            damagePerSecondWithStab: 12.87,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 1.1,
            cooldown: 3.40
        };
        moveInfo[95].availableToPokemon[28] = {
            pokemonId: 28, // Sandslash
            baseAttack: 150
        };
        moveInfo[95].availableToPokemon[59] = {
            pokemonId: 59, // Arcanine
            baseAttack: 230
        };
        moveInfo[95].availableToPokemon[104] = {
            pokemonId: 104, // Cubone
            baseAttack: 102
        };
        moveInfo[95].availableToPokemon[111] = {
            pokemonId: 111, // Rhyhorn
            baseAttack: 110
        };
        moveInfo[96] = {
            moveId: 96,
            name: "Mud Bomb",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 11.54,
            damagePerSecondWithStab: 14.42,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.45,
            cooldown: 2.60
        };
        moveInfo[96].availableToPokemon[50] = {
            pokemonId: 50, // Diglett
            baseAttack: 108
        };
        moveInfo[96].availableToPokemon[51] = {
            pokemonId: 51, // Dugtrio
            baseAttack: 148
        };
        moveInfo[96].availableToPokemon[60] = {
            pokemonId: 60, // Poliwag
            baseAttack: 108
        };
        moveInfo[96].availableToPokemon[61] = {
            pokemonId: 61, // Poliwhirl
            baseAttack: 132
        };
        moveInfo[96].availableToPokemon[88] = {
            pokemonId: 88, // Grimer
            baseAttack: 124
        };
        moveInfo[99] = {
            moveId: 99,
            name: "Signal Beam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Bug,
            damage: 45,
            damageWithStab: 45,
            damagePerSecond: 14.52,
            damagePerSecondWithStab: 18.15,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 1,
            cooldown: 3.10
        };
        moveInfo[99].availableToPokemon[12] = {
            pokemonId: 12, // Butterfree
            baseAttack: 144
        };
        moveInfo[99].availableToPokemon[48] = {
            pokemonId: 48, // Venonat
            baseAttack: 108
        };
        moveInfo[99].availableToPokemon[63] = {
            pokemonId: 63, // Abra
            baseAttack: 110
        };
        moveInfo[99].availableToPokemon[100] = {
            pokemonId: 100, // Voltorb
            baseAttack: 102
        };
        moveInfo[99].availableToPokemon[137] = {
            pokemonId: 137, // Porygon
            baseAttack: 156
        };
        moveInfo[100] = {
            moveId: 100,
            name: "X-Scissor",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Bug,
            damage: 35,
            damageWithStab: 35,
            damagePerSecond: 16.67,
            damagePerSecondWithStab: 20.83,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.25,
            cooldown: 2.10
        };
        moveInfo[100].availableToPokemon[15] = {
            pokemonId: 15, // Beedrill
            baseAttack: 144
        };
        moveInfo[100].availableToPokemon[46] = {
            pokemonId: 46, // Paras
            baseAttack: 122
        };
        moveInfo[100].availableToPokemon[47] = {
            pokemonId: 47, // Parasect
            baseAttack: 162
        };
        moveInfo[100].availableToPokemon[99] = {
            pokemonId: 99, // Kingler
            baseAttack: 178
        };
        moveInfo[100].availableToPokemon[123] = {
            pokemonId: 123, // Scyther
            baseAttack: 176
        };
        moveInfo[100].availableToPokemon[127] = {
            pokemonId: 127, // Pinsir
            baseAttack: 184
        };
        moveInfo[101] = {
            moveId: 101,
            name: "Flame Charge",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 8.06,
            damagePerSecondWithStab: 10.08,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.2,
            cooldown: 3.10
        };
        moveInfo[101].availableToPokemon[4] = {
            pokemonId: 4, // Charmander
            baseAttack: 128
        };
        moveInfo[101].availableToPokemon[37] = {
            pokemonId: 37, // Vulpix
            baseAttack: 106
        };
        moveInfo[101].availableToPokemon[77] = {
            pokemonId: 77, // Ponyta
            baseAttack: 168
        };
        moveInfo[102] = {
            moveId: 102,
            name: "Flame Burst",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 14.29,
            damagePerSecondWithStab: 17.86,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.2,
            cooldown: 2.10
        };
        moveInfo[102].availableToPokemon[4] = {
            pokemonId: 4, // Charmander
            baseAttack: 128
        };
        moveInfo[102].availableToPokemon[5] = {
            pokemonId: 5, // Charmeleon
            baseAttack: 160
        };
        moveInfo[103] = {
            moveId: 103,
            name: "Fire Blast",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 100,
            damageWithStab: 100,
            damagePerSecond: 24.39,
            damagePerSecondWithStab: 30.49,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.4,
            cooldown: 4.10
        };
        moveInfo[103].availableToPokemon[6] = {
            pokemonId: 6, // Charizard
            baseAttack: 212
        };
        moveInfo[103].availableToPokemon[38] = {
            pokemonId: 38, // Ninetales
            baseAttack: 176
        };
        moveInfo[103].availableToPokemon[59] = {
            pokemonId: 59, // Arcanine
            baseAttack: 230
        };
        moveInfo[103].availableToPokemon[77] = {
            pokemonId: 77, // Ponyta
            baseAttack: 168
        };
        moveInfo[103].availableToPokemon[78] = {
            pokemonId: 78, // Rapidash
            baseAttack: 200
        };
        moveInfo[103].availableToPokemon[126] = {
            pokemonId: 126, // Magmar
            baseAttack: 214
        };
        moveInfo[103].availableToPokemon[136] = {
            pokemonId: 136, // Flareon
            baseAttack: 238
        };
        moveInfo[103].availableToPokemon[151] = {
            pokemonId: 151, // Mew
            baseAttack: 220
        };
        moveInfo[104] = {
            moveId: 104,
            name: "Brine",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 10.42,
            damagePerSecondWithStab: 13.02,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.35,
            cooldown: 2.40
        };
        moveInfo[104].availableToPokemon[138] = {
            pokemonId: 138, // Omanyte
            baseAttack: 132
        };
        moveInfo[105] = {
            moveId: 105,
            name: "Water Pulse",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 35,
            damageWithStab: 35,
            damagePerSecond: 10.61,
            damagePerSecondWithStab: 13.26,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 1,
            cooldown: 3.30
        };
        moveInfo[105].availableToPokemon[7] = {
            pokemonId: 7, // Squirtle
            baseAttack: 112
        };
        moveInfo[105].availableToPokemon[72] = {
            pokemonId: 72, // Tentacool
            baseAttack: 106
        };
        moveInfo[105].availableToPokemon[79] = {
            pokemonId: 79, // Slowpoke
            baseAttack: 110
        };
        moveInfo[105].availableToPokemon[80] = {
            pokemonId: 80, // Slowbro
            baseAttack: 184
        };
        moveInfo[105].availableToPokemon[90] = {
            pokemonId: 90, // Shellder
            baseAttack: 120
        };
        moveInfo[105].availableToPokemon[98] = {
            pokemonId: 98, // Krabby
            baseAttack: 116
        };
        moveInfo[105].availableToPokemon[99] = {
            pokemonId: 99, // Kingler
            baseAttack: 178
        };
        moveInfo[105].availableToPokemon[118] = {
            pokemonId: 118, // Goldeen
            baseAttack: 112
        };
        moveInfo[105].availableToPokemon[134] = {
            pokemonId: 134, // Vaporeon
            baseAttack: 186
        };
        moveInfo[105].availableToPokemon[141] = {
            pokemonId: 141, // Kabutops
            baseAttack: 190
        };
        moveInfo[106] = {
            moveId: 106,
            name: "Scald",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 55,
            damageWithStab: 55,
            damagePerSecond: 13.75,
            damagePerSecondWithStab: 17.19,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 2.1,
            cooldown: 4.00
        };
        moveInfo[106].availableToPokemon[61] = {
            pokemonId: 61, // Poliwhirl
            baseAttack: 132
        };
        moveInfo[107] = {
            moveId: 107,
            name: "Hydro Pump",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 90,
            damageWithStab: 90,
            damagePerSecond: 23.68,
            damagePerSecondWithStab: 29.61,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 2.1,
            cooldown: 3.80
        };
        moveInfo[107].availableToPokemon[8] = {
            pokemonId: 8, // Wartortle
            baseAttack: 144
        };
        moveInfo[107].availableToPokemon[9] = {
            pokemonId: 9, // Blastoise
            baseAttack: 186
        };
        moveInfo[107].availableToPokemon[55] = {
            pokemonId: 55, // Golduck
            baseAttack: 194
        };
        moveInfo[107].availableToPokemon[62] = {
            pokemonId: 62, // Poliwrath
            baseAttack: 180
        };
        moveInfo[107].availableToPokemon[73] = {
            pokemonId: 73, // Tentacruel
            baseAttack: 170
        };
        moveInfo[107].availableToPokemon[91] = {
            pokemonId: 91, // Cloyster
            baseAttack: 196
        };
        moveInfo[107].availableToPokemon[117] = {
            pokemonId: 117, // Seadra
            baseAttack: 176
        };
        moveInfo[107].availableToPokemon[121] = {
            pokemonId: 121, // Starmie
            baseAttack: 194
        };
        moveInfo[107].availableToPokemon[130] = {
            pokemonId: 130, // Gyarados
            baseAttack: 192
        };
        moveInfo[107].availableToPokemon[134] = {
            pokemonId: 134, // Vaporeon
            baseAttack: 186
        };
        moveInfo[107].availableToPokemon[139] = {
            pokemonId: 139, // Omastar
            baseAttack: 180
        };
        moveInfo[111] = {
            moveId: 111,
            name: "Icy Wind",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ice,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 6.58,
            damagePerSecondWithStab: 8.22,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.7,
            cooldown: 3.80
        };
        moveInfo[111].availableToPokemon[86] = {
            pokemonId: 86, // Seel
            baseAttack: 104
        };
        moveInfo[111].availableToPokemon[87] = {
            pokemonId: 87, // Dewgong
            baseAttack: 156
        };
        moveInfo[111].availableToPokemon[90] = {
            pokemonId: 90, // Shellder
            baseAttack: 120
        };
        moveInfo[111].availableToPokemon[91] = {
            pokemonId: 91, // Cloyster
            baseAttack: 196
        };
        moveInfo[111].availableToPokemon[119] = {
            pokemonId: 119, // Seaking
            baseAttack: 172
        };
        moveInfo[111].availableToPokemon[144] = {
            pokemonId: 144, // Articuno
            baseAttack: 198
        };
        moveInfo[115] = {
            moveId: 115,
            name: "Fire Punch",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 14.29,
            damagePerSecondWithStab: 17.86,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.51,
            cooldown: 2.80
        };
        moveInfo[115].availableToPokemon[5] = {
            pokemonId: 5, // Charmeleon
            baseAttack: 160
        };
        moveInfo[115].availableToPokemon[107] = {
            pokemonId: 107, // Hitmonchan
            baseAttack: 138
        };
        moveInfo[115].availableToPokemon[126] = {
            pokemonId: 126, // Magmar
            baseAttack: 214
        };
        moveInfo[116] = {
            moveId: 116,
            name: "Solar Beam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Grass,
            damage: 120,
            damageWithStab: 120,
            damagePerSecond: 24.49,
            damagePerSecondWithStab: 30.61,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 1.7,
            cooldown: 4.90
        };
        moveInfo[116].availableToPokemon[2] = {
            pokemonId: 2, // Ivysaur
            baseAttack: 156
        };
        moveInfo[116].availableToPokemon[3] = {
            pokemonId: 3, // Venusaur
            baseAttack: 198
        };
        moveInfo[116].availableToPokemon[45] = {
            pokemonId: 45, // Vileplume
            baseAttack: 202
        };
        moveInfo[116].availableToPokemon[47] = {
            pokemonId: 47, // Parasect
            baseAttack: 162
        };
        moveInfo[116].availableToPokemon[71] = {
            pokemonId: 71, // Victreebel
            baseAttack: 222
        };
        moveInfo[116].availableToPokemon[103] = {
            pokemonId: 103, // Exeggutor
            baseAttack: 232
        };
        moveInfo[116].availableToPokemon[114] = {
            pokemonId: 114, // Tangela
            baseAttack: 164
        };
        moveInfo[116].availableToPokemon[151] = {
            pokemonId: 151, // Mew
            baseAttack: 220
        };
        moveInfo[117] = {
            moveId: 117,
            name: "Leaf Blade",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Grass,
            damage: 55,
            damageWithStab: 55,
            damagePerSecond: 19.64,
            damagePerSecondWithStab: 24.55,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 1,
            cooldown: 2.80
        };
        moveInfo[117].availableToPokemon[71] = {
            pokemonId: 71, // Victreebel
            baseAttack: 222
        };
        moveInfo[117].availableToPokemon[83] = {
            pokemonId: 83, // Farfetch'd
            baseAttack: 138
        };
        moveInfo[118] = {
            moveId: 118,
            name: "Power Whip",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Grass,
            damage: 70,
            damageWithStab: 70,
            damagePerSecond: 25.00,
            damagePerSecondWithStab: 31.25,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 1.3,
            cooldown: 2.80
        };
        moveInfo[118].availableToPokemon[1] = {
            pokemonId: 1, // Bulbasaur
            baseAttack: 126
        };
        moveInfo[118].availableToPokemon[2] = {
            pokemonId: 2, // Ivysaur
            baseAttack: 156
        };
        moveInfo[118].availableToPokemon[69] = {
            pokemonId: 69, // Bellsprout
            baseAttack: 158
        };
        moveInfo[118].availableToPokemon[70] = {
            pokemonId: 70, // Weepinbell
            baseAttack: 190
        };
        moveInfo[118].availableToPokemon[108] = {
            pokemonId: 108, // Lickitung
            baseAttack: 126
        };
        moveInfo[118].availableToPokemon[114] = {
            pokemonId: 114, // Tangela
            baseAttack: 164
        };
        moveInfo[121] = {
            moveId: 121,
            name: "Air Cutter",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Flying,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 9.09,
            damagePerSecondWithStab: 11.36,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.9,
            cooldown: 3.30
        };
        moveInfo[121].availableToPokemon[16] = {
            pokemonId: 16, // Pidgey
            baseAttack: 94
        };
        moveInfo[121].availableToPokemon[17] = {
            pokemonId: 17, // Pidgeotto
            baseAttack: 126
        };
        moveInfo[121].availableToPokemon[18] = {
            pokemonId: 18, // Pidgeot
            baseAttack: 170
        };
        moveInfo[121].availableToPokemon[41] = {
            pokemonId: 41, // Zubat
            baseAttack: 88
        };
        moveInfo[121].availableToPokemon[42] = {
            pokemonId: 42, // Golbat
            baseAttack: 164
        };
        moveInfo[121].availableToPokemon[83] = {
            pokemonId: 83, // Farfetch'd
            baseAttack: 138
        };
        moveInfo[121].availableToPokemon[84] = {
            pokemonId: 84, // Doduo
            baseAttack: 126
        };
        moveInfo[122] = {
            moveId: 122,
            name: "Hurricane",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Flying,
            damage: 80,
            damageWithStab: 80,
            damagePerSecond: 25.00,
            damagePerSecondWithStab: 31.25,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 1.77,
            cooldown: 3.20
        };
        moveInfo[122].availableToPokemon[18] = {
            pokemonId: 18, // Pidgeot
            baseAttack: 170
        };
        moveInfo[122].availableToPokemon[151] = {
            pokemonId: 151, // Mew
            baseAttack: 220
        };
        moveInfo[123] = {
            moveId: 123,
            name: "Brick Break",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fighting,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 18.75,
            damagePerSecondWithStab: 23.44,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.4,
            cooldown: 1.60
        };
        moveInfo[123].availableToPokemon[26] = {
            pokemonId: 26, // Raichu
            baseAttack: 200
        };
        moveInfo[123].availableToPokemon[56] = {
            pokemonId: 56, // Mankey
            baseAttack: 122
        };
        moveInfo[123].availableToPokemon[66] = {
            pokemonId: 66, // Machop
            baseAttack: 118
        };
        moveInfo[123].availableToPokemon[67] = {
            pokemonId: 67, // Machoke
            baseAttack: 154
        };
        moveInfo[123].availableToPokemon[115] = {
            pokemonId: 115, // Kangaskhan
            baseAttack: 142
        };
        moveInfo[125] = {
            moveId: 125,
            name: "Swift",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 10.00,
            damagePerSecondWithStab: 12.50,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.5,
            cooldown: 3.00
        };
        moveInfo[125].availableToPokemon[84] = {
            pokemonId: 84, // Doduo
            baseAttack: 126
        };
        moveInfo[125].availableToPokemon[120] = {
            pokemonId: 120, // Staryu
            baseAttack: 130
        };
        moveInfo[125].availableToPokemon[133] = {
            pokemonId: 133, // Eevee
            baseAttack: 114
        };
        moveInfo[126] = {
            moveId: 126,
            name: "Horn Attack",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 11.36,
            damagePerSecondWithStab: 14.20,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.3,
            cooldown: 2.20
        };
        moveInfo[126].availableToPokemon[32] = {
            pokemonId: 32, // Nidoran M
            baseAttack: 110
        };
        moveInfo[126].availableToPokemon[33] = {
            pokemonId: 33, // Nidorino
            baseAttack: 142
        };
        moveInfo[126].availableToPokemon[111] = {
            pokemonId: 111, // Rhyhorn
            baseAttack: 110
        };
        moveInfo[126].availableToPokemon[118] = {
            pokemonId: 118, // Goldeen
            baseAttack: 112
        };
        moveInfo[126].availableToPokemon[128] = {
            pokemonId: 128, // Tauros
            baseAttack: 148
        };
        moveInfo[127] = {
            moveId: 127,
            name: "Stomp",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 14.29,
            damagePerSecondWithStab: 17.86,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.7,
            cooldown: 2.10
        };
        moveInfo[127].availableToPokemon[106] = {
            pokemonId: 106, // Hitmonlee
            baseAttack: 148
        };
        moveInfo[127].availableToPokemon[108] = {
            pokemonId: 108, // Lickitung
            baseAttack: 126
        };
        moveInfo[127].availableToPokemon[111] = {
            pokemonId: 111, // Rhyhorn
            baseAttack: 110
        };
        moveInfo[127].availableToPokemon[115] = {
            pokemonId: 115, // Kangaskhan
            baseAttack: 142
        };
        moveInfo[129] = {
            moveId: 129,
            name: "Hyper Fang",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 35,
            damageWithStab: 35,
            damagePerSecond: 16.67,
            damagePerSecondWithStab: 20.83,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.3,
            cooldown: 2.10
        };
        moveInfo[129].availableToPokemon[19] = {
            pokemonId: 19, // Rattata
            baseAttack: 92
        };
        moveInfo[129].availableToPokemon[20] = {
            pokemonId: 20, // Raticate
            baseAttack: 146
        };
        moveInfo[131] = {
            moveId: 131,
            name: "Body Slam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 25.64,
            damagePerSecondWithStab: 32.05,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 0.2,
            cooldown: 1.56
        };
        moveInfo[131].availableToPokemon[19] = {
            pokemonId: 19, // Rattata
            baseAttack: 92
        };
        moveInfo[131].availableToPokemon[29] = {
            pokemonId: 29, // Nidoran F
            baseAttack: 100
        };
        moveInfo[131].availableToPokemon[32] = {
            pokemonId: 32, // Nidoran M
            baseAttack: 110
        };
        moveInfo[131].availableToPokemon[35] = {
            pokemonId: 35, // Clefairy
            baseAttack: 116
        };
        moveInfo[131].availableToPokemon[37] = {
            pokemonId: 37, // Vulpix
            baseAttack: 106
        };
        moveInfo[131].availableToPokemon[39] = {
            pokemonId: 39, // Jigglypuff
            baseAttack: 98
        };
        moveInfo[131].availableToPokemon[52] = {
            pokemonId: 52, // Meowth
            baseAttack: 104
        };
        moveInfo[131].availableToPokemon[58] = {
            pokemonId: 58, // Growlithe
            baseAttack: 156
        };
        moveInfo[131].availableToPokemon[60] = {
            pokemonId: 60, // Poliwag
            baseAttack: 108
        };
        moveInfo[131].availableToPokemon[133] = {
            pokemonId: 133, // Eevee
            baseAttack: 114
        };
        moveInfo[131].availableToPokemon[143] = {
            pokemonId: 143, // Snorlax
            baseAttack: 180
        };
        moveInfo[133] = {
            moveId: 133,
            name: "Struggle",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 15,
            damageWithStab: 15,
            damagePerSecond: 8.85,
            damagePerSecondWithStab: 11.06,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.7,
            cooldown: 1.70
        };
        moveInfo[133].availableToPokemon[10] = {
            pokemonId: 10, // Caterpie
            baseAttack: 62
        };
        moveInfo[133].availableToPokemon[11] = {
            pokemonId: 11, // Metapod
            baseAttack: 56
        };
        moveInfo[133].availableToPokemon[13] = {
            pokemonId: 13, // Weedle
            baseAttack: 68
        };
        moveInfo[133].availableToPokemon[14] = {
            pokemonId: 14, // Kakuna
            baseAttack: 62
        };
        moveInfo[133].availableToPokemon[129] = {
            pokemonId: 129, // Magikarp
            baseAttack: 42
        };
        moveInfo[133].availableToPokemon[132] = {
            pokemonId: 132, // Ditto
            baseAttack: 110
        };
        moveInfo[200] = {
            moveId: 200,
            name: "Fury Cutter",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Bug,
            damage: 3,
            damageWithStab: 3,
            damagePerSecond: 7.50,
            damagePerSecondWithStab: 9.38,
            damagePerSecondDefensive: 1.25,
            energyPerSecond: 15.00,
            cooldown: 0.40
        };
        moveInfo[200].availableToPokemon[34] = {
            pokemonId: 34, // Nidoking
            baseAttack: 204
        };
        moveInfo[200].availableToPokemon[47] = {
            pokemonId: 47, // Parasect
            baseAttack: 162
        };
        moveInfo[200].availableToPokemon[83] = {
            pokemonId: 83, // Farfetch'd
            baseAttack: 138
        };
        moveInfo[200].availableToPokemon[123] = {
            pokemonId: 123, // Scyther
            baseAttack: 176
        };
        moveInfo[200].availableToPokemon[127] = {
            pokemonId: 127, // Pinsir
            baseAttack: 184
        };
        moveInfo[200].availableToPokemon[141] = {
            pokemonId: 141, // Kabutops
            baseAttack: 190
        };
        moveInfo[201] = {
            moveId: 201,
            name: "Bug Bite",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Bug,
            damage: 5,
            damageWithStab: 5,
            damagePerSecond: 11.11,
            damagePerSecondWithStab: 13.89,
            damagePerSecondDefensive: 2.04,
            energyPerSecond: 15.56,
            cooldown: 0.45
        };
        moveInfo[201].availableToPokemon[10] = {
            pokemonId: 10, // Caterpie
            baseAttack: 62
        };
        moveInfo[201].availableToPokemon[11] = {
            pokemonId: 11, // Metapod
            baseAttack: 56
        };
        moveInfo[201].availableToPokemon[12] = {
            pokemonId: 12, // Butterfree
            baseAttack: 144
        };
        moveInfo[201].availableToPokemon[13] = {
            pokemonId: 13, // Weedle
            baseAttack: 68
        };
        moveInfo[201].availableToPokemon[14] = {
            pokemonId: 14, // Kakuna
            baseAttack: 62
        };
        moveInfo[201].availableToPokemon[15] = {
            pokemonId: 15, // Beedrill
            baseAttack: 144
        };
        moveInfo[201].availableToPokemon[46] = {
            pokemonId: 46, // Paras
            baseAttack: 122
        };
        moveInfo[201].availableToPokemon[47] = {
            pokemonId: 47, // Parasect
            baseAttack: 162
        };
        moveInfo[201].availableToPokemon[48] = {
            pokemonId: 48, // Venonat
            baseAttack: 108
        };
        moveInfo[201].availableToPokemon[49] = {
            pokemonId: 49, // Venomoth
            baseAttack: 172
        };
        moveInfo[203] = {
            moveId: 203,
            name: "Sucker Punch",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Dark,
            damage: 7,
            damageWithStab: 7,
            damagePerSecond: 10.00,
            damagePerSecondWithStab: 12.50,
            damagePerSecondDefensive: 2.59,
            energyPerSecond: 12.86,
            cooldown: 0.70
        };
        moveInfo[203].availableToPokemon[51] = {
            pokemonId: 51, // Dugtrio
            baseAttack: 148
        };
        moveInfo[203].availableToPokemon[92] = {
            pokemonId: 92, // Gastly
            baseAttack: 136
        };
        moveInfo[203].availableToPokemon[94] = {
            pokemonId: 94, // Gengar
            baseAttack: 204
        };
        moveInfo[204] = {
            moveId: 204,
            name: "Dragon Breath",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Dragon,
            damage: 6,
            damageWithStab: 6,
            damagePerSecond: 12.00,
            damagePerSecondWithStab: 15.00,
            damagePerSecondDefensive: 2.40,
            energyPerSecond: 14.00,
            cooldown: 0.50
        };
        moveInfo[204].availableToPokemon[117] = {
            pokemonId: 117, // Seadra
            baseAttack: 176
        };
        moveInfo[204].availableToPokemon[130] = {
            pokemonId: 130, // Gyarados
            baseAttack: 192
        };
        moveInfo[204].availableToPokemon[147] = {
            pokemonId: 147, // Dratini
            baseAttack: 128
        };
        moveInfo[204].availableToPokemon[148] = {
            pokemonId: 148, // Dragonair
            baseAttack: 170
        };
        moveInfo[204].availableToPokemon[149] = {
            pokemonId: 149, // Dragonite
            baseAttack: 250
        };
        moveInfo[205] = {
            moveId: 205,
            name: "Thunder Shock",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Electric,
            damage: 5,
            damageWithStab: 5,
            damagePerSecond: 8.33,
            damagePerSecondWithStab: 10.42,
            damagePerSecondDefensive: 1.92,
            energyPerSecond: 13.33,
            cooldown: 0.60
        };
        moveInfo[205].availableToPokemon[25] = {
            pokemonId: 25, // Pikachu
            baseAttack: 124
        };
        moveInfo[205].availableToPokemon[26] = {
            pokemonId: 26, // Raichu
            baseAttack: 200
        };
        moveInfo[205].availableToPokemon[81] = {
            pokemonId: 81, // Magnemite
            baseAttack: 128
        };
        moveInfo[205].availableToPokemon[82] = {
            pokemonId: 82, // Magneton
            baseAttack: 186
        };
        moveInfo[205].availableToPokemon[125] = {
            pokemonId: 125, // Electabuzz
            baseAttack: 198
        };
        moveInfo[205].availableToPokemon[135] = {
            pokemonId: 135, // Jolteon
            baseAttack: 192
        };
        moveInfo[205].availableToPokemon[145] = {
            pokemonId: 145, // Zapdos
            baseAttack: 232
        };
        moveInfo[206] = {
            moveId: 206,
            name: "Spark",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Electric,
            damage: 7,
            damageWithStab: 7,
            damagePerSecond: 10.00,
            damagePerSecondWithStab: 12.50,
            damagePerSecondDefensive: 2.59,
            energyPerSecond: 11.43,
            cooldown: 0.70
        };
        moveInfo[206].availableToPokemon[26] = {
            pokemonId: 26, // Raichu
            baseAttack: 200
        };
        moveInfo[206].availableToPokemon[81] = {
            pokemonId: 81, // Magnemite
            baseAttack: 128
        };
        moveInfo[206].availableToPokemon[82] = {
            pokemonId: 82, // Magneton
            baseAttack: 186
        };
        moveInfo[206].availableToPokemon[100] = {
            pokemonId: 100, // Voltorb
            baseAttack: 102
        };
        moveInfo[206].availableToPokemon[101] = {
            pokemonId: 101, // Electrode
            baseAttack: 150
        };
        moveInfo[207] = {
            moveId: 207,
            name: "Low Kick",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Fighting,
            damage: 5,
            damageWithStab: 5,
            damagePerSecond: 8.33,
            damagePerSecondWithStab: 10.42,
            damagePerSecondDefensive: 1.92,
            energyPerSecond: 11.67,
            cooldown: 0.60
        };
        moveInfo[207].availableToPokemon[57] = {
            pokemonId: 57, // Primeape
            baseAttack: 178
        };
        moveInfo[207].availableToPokemon[66] = {
            pokemonId: 66, // Machop
            baseAttack: 118
        };
        moveInfo[207].availableToPokemon[67] = {
            pokemonId: 67, // Machoke
            baseAttack: 154
        };
        moveInfo[207].availableToPokemon[78] = {
            pokemonId: 78, // Rapidash
            baseAttack: 200
        };
        moveInfo[207].availableToPokemon[106] = {
            pokemonId: 106, // Hitmonlee
            baseAttack: 148
        };
        moveInfo[207].availableToPokemon[115] = {
            pokemonId: 115, // Kangaskhan
            baseAttack: 142
        };
        moveInfo[207].availableToPokemon[125] = {
            pokemonId: 125, // Electabuzz
            baseAttack: 198
        };
        moveInfo[208] = {
            moveId: 208,
            name: "Karate Chop",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Fighting,
            damage: 6,
            damageWithStab: 6,
            damagePerSecond: 7.50,
            damagePerSecondWithStab: 9.38,
            damagePerSecondDefensive: 2.14,
            energyPerSecond: 10.00,
            cooldown: 0.80
        };
        moveInfo[208].availableToPokemon[56] = {
            pokemonId: 56, // Mankey
            baseAttack: 122
        };
        moveInfo[208].availableToPokemon[57] = {
            pokemonId: 57, // Primeape
            baseAttack: 178
        };
        moveInfo[208].availableToPokemon[66] = {
            pokemonId: 66, // Machop
            baseAttack: 118
        };
        moveInfo[208].availableToPokemon[67] = {
            pokemonId: 67, // Machoke
            baseAttack: 154
        };
        moveInfo[208].availableToPokemon[68] = {
            pokemonId: 68, // Machamp
            baseAttack: 198
        };
        moveInfo[208].availableToPokemon[126] = {
            pokemonId: 126, // Magmar
            baseAttack: 214
        };
        moveInfo[209] = {
            moveId: 209,
            name: "Ember",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 10,
            damageWithStab: 10,
            damagePerSecond: 9.52,
            damagePerSecondWithStab: 11.90,
            damagePerSecondDefensive: 3.28,
            energyPerSecond: 9.52,
            cooldown: 1.05
        };
        moveInfo[209].availableToPokemon[4] = {
            pokemonId: 4, // Charmander
            baseAttack: 128
        };
        moveInfo[209].availableToPokemon[5] = {
            pokemonId: 5, // Charmeleon
            baseAttack: 160
        };
        moveInfo[209].availableToPokemon[6] = {
            pokemonId: 6, // Charizard
            baseAttack: 212
        };
        moveInfo[209].availableToPokemon[37] = {
            pokemonId: 37, // Vulpix
            baseAttack: 106
        };
        moveInfo[209].availableToPokemon[38] = {
            pokemonId: 38, // Ninetales
            baseAttack: 176
        };
        moveInfo[209].availableToPokemon[58] = {
            pokemonId: 58, // Growlithe
            baseAttack: 156
        };
        moveInfo[209].availableToPokemon[77] = {
            pokemonId: 77, // Ponyta
            baseAttack: 168
        };
        moveInfo[209].availableToPokemon[78] = {
            pokemonId: 78, // Rapidash
            baseAttack: 200
        };
        moveInfo[209].availableToPokemon[126] = {
            pokemonId: 126, // Magmar
            baseAttack: 214
        };
        moveInfo[209].availableToPokemon[136] = {
            pokemonId: 136, // Flareon
            baseAttack: 238
        };
        moveInfo[209].availableToPokemon[146] = {
            pokemonId: 146, // Moltres
            baseAttack: 242
        };
        moveInfo[210] = {
            moveId: 210,
            name: "Wing Attack",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Flying,
            damage: 9,
            damageWithStab: 9,
            damagePerSecond: 12.00,
            damagePerSecondWithStab: 15.00,
            damagePerSecondDefensive: 3.27,
            energyPerSecond: 9.33,
            cooldown: 0.75
        };
        moveInfo[210].availableToPokemon[6] = {
            pokemonId: 6, // Charizard
            baseAttack: 212
        };
        moveInfo[210].availableToPokemon[17] = {
            pokemonId: 17, // Pidgeotto
            baseAttack: 126
        };
        moveInfo[210].availableToPokemon[18] = {
            pokemonId: 18, // Pidgeot
            baseAttack: 170
        };
        moveInfo[210].availableToPokemon[42] = {
            pokemonId: 42, // Golbat
            baseAttack: 164
        };
        moveInfo[211] = {
            moveId: 211,
            name: "Peck",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Flying,
            damage: 10,
            damageWithStab: 10,
            damagePerSecond: 8.70,
            damagePerSecondWithStab: 10.87,
            damagePerSecondDefensive: 3.17,
            energyPerSecond: 8.70,
            cooldown: 1.15
        };
        moveInfo[211].availableToPokemon[21] = {
            pokemonId: 21, // Spearow
            baseAttack: 102
        };
        moveInfo[211].availableToPokemon[22] = {
            pokemonId: 22, // Fearow
            baseAttack: 168
        };
        moveInfo[211].availableToPokemon[32] = {
            pokemonId: 32, // Nidoran M
            baseAttack: 110
        };
        moveInfo[211].availableToPokemon[84] = {
            pokemonId: 84, // Doduo
            baseAttack: 126
        };
        moveInfo[211].availableToPokemon[118] = {
            pokemonId: 118, // Goldeen
            baseAttack: 112
        };
        moveInfo[211].availableToPokemon[119] = {
            pokemonId: 119, // Seaking
            baseAttack: 172
        };
        moveInfo[212] = {
            moveId: 212,
            name: "Lick",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Ghost,
            damage: 5,
            damageWithStab: 5,
            damagePerSecond: 10.00,
            damagePerSecondWithStab: 12.50,
            damagePerSecondDefensive: 2.00,
            energyPerSecond: 12.00,
            cooldown: 0.50
        };
        moveInfo[212].availableToPokemon[92] = {
            pokemonId: 92, // Gastly
            baseAttack: 136
        };
        moveInfo[212].availableToPokemon[93] = {
            pokemonId: 93, // Haunter
            baseAttack: 172
        };
        moveInfo[212].availableToPokemon[108] = {
            pokemonId: 108, // Lickitung
            baseAttack: 126
        };
        moveInfo[212].availableToPokemon[143] = {
            pokemonId: 143, // Snorlax
            baseAttack: 180
        };
        moveInfo[213] = {
            moveId: 213,
            name: "Shadow Claw",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Ghost,
            damage: 11,
            damageWithStab: 11,
            damagePerSecond: 11.58,
            damagePerSecondWithStab: 14.47,
            damagePerSecondDefensive: 3.73,
            energyPerSecond: 8.42,
            cooldown: 0.95
        };
        moveInfo[213].availableToPokemon[92] = {
            pokemonId: 92, // Gastly
            baseAttack: 136
        };
        moveInfo[213].availableToPokemon[93] = {
            pokemonId: 93, // Haunter
            baseAttack: 172
        };
        moveInfo[213].availableToPokemon[94] = {
            pokemonId: 94, // Gengar
            baseAttack: 204
        };
        moveInfo[214] = {
            moveId: 214,
            name: "Vine Whip",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Grass,
            damage: 7,
            damageWithStab: 7,
            damagePerSecond: 10.77,
            damagePerSecondWithStab: 13.46,
            damagePerSecondDefensive: 2.64,
            energyPerSecond: 10.77,
            cooldown: 0.65
        };
        moveInfo[214].availableToPokemon[1] = {
            pokemonId: 1, // Bulbasaur
            baseAttack: 126
        };
        moveInfo[214].availableToPokemon[2] = {
            pokemonId: 2, // Ivysaur
            baseAttack: 156
        };
        moveInfo[214].availableToPokemon[3] = {
            pokemonId: 3, // Venusaur
            baseAttack: 198
        };
        moveInfo[214].availableToPokemon[69] = {
            pokemonId: 69, // Bellsprout
            baseAttack: 158
        };
        moveInfo[214].availableToPokemon[114] = {
            pokemonId: 114, // Tangela
            baseAttack: 164
        };
        moveInfo[215] = {
            moveId: 215,
            name: "Razor Leaf",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Grass,
            damage: 15,
            damageWithStab: 15,
            damagePerSecond: 10.34,
            damagePerSecondWithStab: 12.93,
            damagePerSecondDefensive: 4.35,
            energyPerSecond: 8.28,
            cooldown: 1.45
        };
        moveInfo[215].availableToPokemon[2] = {
            pokemonId: 2, // Ivysaur
            baseAttack: 156
        };
        moveInfo[215].availableToPokemon[3] = {
            pokemonId: 3, // Venusaur
            baseAttack: 198
        };
        moveInfo[215].availableToPokemon[43] = {
            pokemonId: 43, // Oddish
            baseAttack: 134
        };
        moveInfo[215].availableToPokemon[44] = {
            pokemonId: 44, // Gloom
            baseAttack: 162
        };
        moveInfo[215].availableToPokemon[45] = {
            pokemonId: 45, // Vileplume
            baseAttack: 202
        };
        moveInfo[215].availableToPokemon[70] = {
            pokemonId: 70, // Weepinbell
            baseAttack: 190
        };
        moveInfo[215].availableToPokemon[71] = {
            pokemonId: 71, // Victreebel
            baseAttack: 222
        };
        moveInfo[216] = {
            moveId: 216,
            name: "Mud Shot",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 6,
            damageWithStab: 6,
            damagePerSecond: 10.91,
            damagePerSecondWithStab: 13.64,
            damagePerSecondDefensive: 2.35,
            energyPerSecond: 12.73,
            cooldown: 0.55
        };
        moveInfo[216].availableToPokemon[27] = {
            pokemonId: 27, // Sandshrew
            baseAttack: 90
        };
        moveInfo[216].availableToPokemon[28] = {
            pokemonId: 28, // Sandslash
            baseAttack: 150
        };
        moveInfo[216].availableToPokemon[50] = {
            pokemonId: 50, // Diglett
            baseAttack: 108
        };
        moveInfo[216].availableToPokemon[51] = {
            pokemonId: 51, // Dugtrio
            baseAttack: 148
        };
        moveInfo[216].availableToPokemon[60] = {
            pokemonId: 60, // Poliwag
            baseAttack: 108
        };
        moveInfo[216].availableToPokemon[61] = {
            pokemonId: 61, // Poliwhirl
            baseAttack: 132
        };
        moveInfo[216].availableToPokemon[62] = {
            pokemonId: 62, // Poliwrath
            baseAttack: 180
        };
        moveInfo[216].availableToPokemon[75] = {
            pokemonId: 75, // Graveler
            baseAttack: 142
        };
        moveInfo[216].availableToPokemon[76] = {
            pokemonId: 76, // Golem
            baseAttack: 176
        };
        moveInfo[216].availableToPokemon[98] = {
            pokemonId: 98, // Krabby
            baseAttack: 116
        };
        moveInfo[216].availableToPokemon[99] = {
            pokemonId: 99, // Kingler
            baseAttack: 178
        };
        moveInfo[216].availableToPokemon[118] = {
            pokemonId: 118, // Goldeen
            baseAttack: 112
        };
        moveInfo[216].availableToPokemon[138] = {
            pokemonId: 138, // Omanyte
            baseAttack: 132
        };
        moveInfo[216].availableToPokemon[140] = {
            pokemonId: 140, // Kabuto
            baseAttack: 148
        };
        moveInfo[216].availableToPokemon[141] = {
            pokemonId: 141, // Kabutops
            baseAttack: 190
        };
        moveInfo[217] = {
            moveId: 217,
            name: "Ice Shard",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Ice,
            damage: 15,
            damageWithStab: 15,
            damagePerSecond: 10.71,
            damagePerSecondWithStab: 13.39,
            damagePerSecondDefensive: 4.41,
            energyPerSecond: 8.57,
            cooldown: 1.40
        };
        moveInfo[217].availableToPokemon[86] = {
            pokemonId: 86, // Seel
            baseAttack: 104
        };
        moveInfo[217].availableToPokemon[87] = {
            pokemonId: 87, // Dewgong
            baseAttack: 156
        };
        moveInfo[217].availableToPokemon[90] = {
            pokemonId: 90, // Shellder
            baseAttack: 120
        };
        moveInfo[217].availableToPokemon[91] = {
            pokemonId: 91, // Cloyster
            baseAttack: 196
        };
        moveInfo[217].availableToPokemon[131] = {
            pokemonId: 131, // Lapras
            baseAttack: 186
        };
        moveInfo[218] = {
            moveId: 218,
            name: "Frost Breath",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Ice,
            damage: 9,
            damageWithStab: 9,
            damagePerSecond: 11.11,
            damagePerSecondWithStab: 13.89,
            damagePerSecondDefensive: 3.20,
            energyPerSecond: 8.64,
            cooldown: 0.81
        };
        moveInfo[218].availableToPokemon[87] = {
            pokemonId: 87, // Dewgong
            baseAttack: 156
        };
        moveInfo[218].availableToPokemon[91] = {
            pokemonId: 91, // Cloyster
            baseAttack: 196
        };
        moveInfo[218].availableToPokemon[124] = {
            pokemonId: 124, // Jynx
            baseAttack: 172
        };
        moveInfo[218].availableToPokemon[131] = {
            pokemonId: 131, // Lapras
            baseAttack: 186
        };
        moveInfo[218].availableToPokemon[144] = {
            pokemonId: 144, // Articuno
            baseAttack: 198
        };
        moveInfo[219] = {
            moveId: 219,
            name: "Quick Attack",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 10,
            damageWithStab: 10,
            damagePerSecond: 7.52,
            damagePerSecondWithStab: 9.40,
            damagePerSecondDefensive: 3.00,
            energyPerSecond: 9.02,
            cooldown: 1.33
        };
        moveInfo[219].availableToPokemon[16] = {
            pokemonId: 16, // Pidgey
            baseAttack: 94
        };
        moveInfo[219].availableToPokemon[19] = {
            pokemonId: 19, // Rattata
            baseAttack: 92
        };
        moveInfo[219].availableToPokemon[20] = {
            pokemonId: 20, // Raticate
            baseAttack: 146
        };
        moveInfo[219].availableToPokemon[21] = {
            pokemonId: 21, // Spearow
            baseAttack: 102
        };
        moveInfo[219].availableToPokemon[25] = {
            pokemonId: 25, // Pikachu
            baseAttack: 124
        };
        moveInfo[219].availableToPokemon[37] = {
            pokemonId: 37, // Vulpix
            baseAttack: 106
        };
        moveInfo[219].availableToPokemon[41] = {
            pokemonId: 41, // Zubat
            baseAttack: 88
        };
        moveInfo[219].availableToPokemon[84] = {
            pokemonId: 84, // Doduo
            baseAttack: 126
        };
        moveInfo[219].availableToPokemon[120] = {
            pokemonId: 120, // Staryu
            baseAttack: 130
        };
        moveInfo[219].availableToPokemon[121] = {
            pokemonId: 121, // Starmie
            baseAttack: 194
        };
        moveInfo[219].availableToPokemon[133] = {
            pokemonId: 133, // Eevee
            baseAttack: 114
        };
        moveInfo[219].availableToPokemon[137] = {
            pokemonId: 137, // Porygon
            baseAttack: 156
        };
        moveInfo[220] = {
            moveId: 220,
            name: "Scratch",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 6,
            damageWithStab: 6,
            damagePerSecond: 12.00,
            damagePerSecondWithStab: 15.00,
            damagePerSecondDefensive: 2.40,
            energyPerSecond: 14.00,
            cooldown: 0.50
        };
        moveInfo[220].availableToPokemon[4] = {
            pokemonId: 4, // Charmander
            baseAttack: 128
        };
        moveInfo[220].availableToPokemon[5] = {
            pokemonId: 5, // Charmeleon
            baseAttack: 160
        };
        moveInfo[220].availableToPokemon[27] = {
            pokemonId: 27, // Sandshrew
            baseAttack: 90
        };
        moveInfo[220].availableToPokemon[46] = {
            pokemonId: 46, // Paras
            baseAttack: 122
        };
        moveInfo[220].availableToPokemon[50] = {
            pokemonId: 50, // Diglett
            baseAttack: 108
        };
        moveInfo[220].availableToPokemon[52] = {
            pokemonId: 52, // Meowth
            baseAttack: 104
        };
        moveInfo[220].availableToPokemon[53] = {
            pokemonId: 53, // Persian
            baseAttack: 156
        };
        moveInfo[220].availableToPokemon[56] = {
            pokemonId: 56, // Mankey
            baseAttack: 122
        };
        moveInfo[220].availableToPokemon[140] = {
            pokemonId: 140, // Kabuto
            baseAttack: 148
        };
        moveInfo[221] = {
            moveId: 221,
            name: "Tackle",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 12,
            damageWithStab: 12,
            damagePerSecond: 10.91,
            damagePerSecondWithStab: 13.64,
            damagePerSecondDefensive: 3.87,
            energyPerSecond: 9.09,
            cooldown: 1.10
        };
        moveInfo[221].availableToPokemon[1] = {
            pokemonId: 1, // Bulbasaur
            baseAttack: 126
        };
        moveInfo[221].availableToPokemon[7] = {
            pokemonId: 7, // Squirtle
            baseAttack: 112
        };
        moveInfo[221].availableToPokemon[10] = {
            pokemonId: 10, // Caterpie
            baseAttack: 62
        };
        moveInfo[221].availableToPokemon[11] = {
            pokemonId: 11, // Metapod
            baseAttack: 56
        };
        moveInfo[221].availableToPokemon[16] = {
            pokemonId: 16, // Pidgey
            baseAttack: 94
        };
        moveInfo[221].availableToPokemon[19] = {
            pokemonId: 19, // Rattata
            baseAttack: 92
        };
        moveInfo[221].availableToPokemon[74] = {
            pokemonId: 74, // Geodude
            baseAttack: 106
        };
        moveInfo[221].availableToPokemon[77] = {
            pokemonId: 77, // Ponyta
            baseAttack: 168
        };
        moveInfo[221].availableToPokemon[90] = {
            pokemonId: 90, // Shellder
            baseAttack: 120
        };
        moveInfo[221].availableToPokemon[95] = {
            pokemonId: 95, // Onix
            baseAttack: 90
        };
        moveInfo[221].availableToPokemon[100] = {
            pokemonId: 100, // Voltorb
            baseAttack: 102
        };
        moveInfo[221].availableToPokemon[101] = {
            pokemonId: 101, // Electrode
            baseAttack: 150
        };
        moveInfo[221].availableToPokemon[109] = {
            pokemonId: 109, // Koffing
            baseAttack: 136
        };
        moveInfo[221].availableToPokemon[110] = {
            pokemonId: 110, // Weezing
            baseAttack: 190
        };
        moveInfo[221].availableToPokemon[128] = {
            pokemonId: 128, // Tauros
            baseAttack: 148
        };
        moveInfo[221].availableToPokemon[133] = {
            pokemonId: 133, // Eevee
            baseAttack: 114
        };
        moveInfo[221].availableToPokemon[137] = {
            pokemonId: 137, // Porygon
            baseAttack: 156
        };
        moveInfo[222] = {
            moveId: 222,
            name: "Pound",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 7,
            damageWithStab: 7,
            damagePerSecond: 12.96,
            damagePerSecondWithStab: 16.20,
            damagePerSecondDefensive: 2.76,
            energyPerSecond: 12.96,
            cooldown: 0.54
        };
        moveInfo[222].availableToPokemon[35] = {
            pokemonId: 35, // Clefairy
            baseAttack: 116
        };
        moveInfo[222].availableToPokemon[36] = {
            pokemonId: 36, // Clefable
            baseAttack: 178
        };
        moveInfo[222].availableToPokemon[39] = {
            pokemonId: 39, // Jigglypuff
            baseAttack: 98
        };
        moveInfo[222].availableToPokemon[40] = {
            pokemonId: 40, // Wigglytuff
            baseAttack: 168
        };
        moveInfo[222].availableToPokemon[96] = {
            pokemonId: 96, // Drowzee
            baseAttack: 104
        };
        moveInfo[222].availableToPokemon[113] = {
            pokemonId: 113, // Chansey
            baseAttack: 40
        };
        moveInfo[222].availableToPokemon[124] = {
            pokemonId: 124, // Jynx
            baseAttack: 172
        };
        moveInfo[222].availableToPokemon[132] = {
            pokemonId: 132, // Ditto
            baseAttack: 110
        };
        moveInfo[222].availableToPokemon[151] = {
            pokemonId: 151, // Mew
            baseAttack: 220
        };
        moveInfo[224] = {
            moveId: 224,
            name: "Poison Jab",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 12,
            damageWithStab: 12,
            damagePerSecond: 11.43,
            damagePerSecondWithStab: 14.29,
            damagePerSecondDefensive: 3.93,
            energyPerSecond: 9.52,
            cooldown: 1.05
        };
        moveInfo[224].availableToPokemon[14] = {
            pokemonId: 14, // Kakuna
            baseAttack: 62
        };
        moveInfo[224].availableToPokemon[15] = {
            pokemonId: 15, // Beedrill
            baseAttack: 144
        };
        moveInfo[224].availableToPokemon[31] = {
            pokemonId: 31, // Nidoqueen
            baseAttack: 184
        };
        moveInfo[224].availableToPokemon[33] = {
            pokemonId: 33, // Nidorino
            baseAttack: 142
        };
        moveInfo[224].availableToPokemon[34] = {
            pokemonId: 34, // Nidoking
            baseAttack: 204
        };
        moveInfo[224].availableToPokemon[73] = {
            pokemonId: 73, // Tentacruel
            baseAttack: 170
        };
        moveInfo[224].availableToPokemon[89] = {
            pokemonId: 89, // Muk
            baseAttack: 180
        };
        moveInfo[224].availableToPokemon[119] = {
            pokemonId: 119, // Seaking
            baseAttack: 172
        };
        moveInfo[225] = {
            moveId: 225,
            name: "Acid",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 10,
            damageWithStab: 10,
            damagePerSecond: 9.52,
            damagePerSecondWithStab: 11.90,
            damagePerSecondDefensive: 3.28,
            energyPerSecond: 9.52,
            cooldown: 1.05
        };
        moveInfo[225].availableToPokemon[23] = {
            pokemonId: 23, // Ekans
            baseAttack: 112
        };
        moveInfo[225].availableToPokemon[24] = {
            pokemonId: 24, // Arbok
            baseAttack: 166
        };
        moveInfo[225].availableToPokemon[43] = {
            pokemonId: 43, // Oddish
            baseAttack: 134
        };
        moveInfo[225].availableToPokemon[44] = {
            pokemonId: 44, // Gloom
            baseAttack: 162
        };
        moveInfo[225].availableToPokemon[45] = {
            pokemonId: 45, // Vileplume
            baseAttack: 202
        };
        moveInfo[225].availableToPokemon[69] = {
            pokemonId: 69, // Bellsprout
            baseAttack: 158
        };
        moveInfo[225].availableToPokemon[70] = {
            pokemonId: 70, // Weepinbell
            baseAttack: 190
        };
        moveInfo[225].availableToPokemon[71] = {
            pokemonId: 71, // Victreebel
            baseAttack: 222
        };
        moveInfo[225].availableToPokemon[73] = {
            pokemonId: 73, // Tentacruel
            baseAttack: 170
        };
        moveInfo[225].availableToPokemon[88] = {
            pokemonId: 88, // Grimer
            baseAttack: 124
        };
        moveInfo[225].availableToPokemon[89] = {
            pokemonId: 89, // Muk
            baseAttack: 180
        };
        moveInfo[225].availableToPokemon[109] = {
            pokemonId: 109, // Koffing
            baseAttack: 136
        };
        moveInfo[225].availableToPokemon[110] = {
            pokemonId: 110, // Weezing
            baseAttack: 190
        };
        moveInfo[226] = {
            moveId: 226,
            name: "Psycho Cut",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Psychic,
            damage: 7,
            damageWithStab: 7,
            damagePerSecond: 12.28,
            damagePerSecondWithStab: 15.35,
            damagePerSecondDefensive: 2.72,
            energyPerSecond: 12.28,
            cooldown: 0.57
        };
        moveInfo[226].availableToPokemon[64] = {
            pokemonId: 64, // Kadabra
            baseAttack: 150
        };
        moveInfo[226].availableToPokemon[65] = {
            pokemonId: 65, // Alakazam
            baseAttack: 186
        };
        moveInfo[226].availableToPokemon[150] = {
            pokemonId: 150, // Mewtwo
            baseAttack: 284
        };
        moveInfo[227] = {
            moveId: 227,
            name: "Rock Throw",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Rock,
            damage: 12,
            damageWithStab: 12,
            damagePerSecond: 8.82,
            damagePerSecondWithStab: 11.03,
            damagePerSecondDefensive: 3.57,
            energyPerSecond: 11.03,
            cooldown: 1.36
        };
        moveInfo[227].availableToPokemon[74] = {
            pokemonId: 74, // Geodude
            baseAttack: 106
        };
        moveInfo[227].availableToPokemon[75] = {
            pokemonId: 75, // Graveler
            baseAttack: 142
        };
        moveInfo[227].availableToPokemon[76] = {
            pokemonId: 76, // Golem
            baseAttack: 176
        };
        moveInfo[227].availableToPokemon[95] = {
            pokemonId: 95, // Onix
            baseAttack: 90
        };
        moveInfo[227].availableToPokemon[139] = {
            pokemonId: 139, // Omastar
            baseAttack: 180
        };
        moveInfo[228] = {
            moveId: 228,
            name: "Metal Claw",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Steel,
            damage: 8,
            damageWithStab: 8,
            damagePerSecond: 12.70,
            damagePerSecondWithStab: 15.87,
            damagePerSecondDefensive: 3.04,
            energyPerSecond: 11.11,
            cooldown: 0.63
        };
        moveInfo[228].availableToPokemon[28] = {
            pokemonId: 28, // Sandslash
            baseAttack: 150
        };
        moveInfo[228].availableToPokemon[99] = {
            pokemonId: 99, // Kingler
            baseAttack: 178
        };
        moveInfo[229] = {
            moveId: 229,
            name: "Bullet Punch",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Steel,
            damage: 10,
            damageWithStab: 10,
            damagePerSecond: 8.33,
            damagePerSecondWithStab: 10.42,
            damagePerSecondDefensive: 3.13,
            energyPerSecond: 8.33,
            cooldown: 1.20
        };
        moveInfo[229].availableToPokemon[68] = {
            pokemonId: 68, // Machamp
            baseAttack: 198
        };
        moveInfo[229].availableToPokemon[107] = {
            pokemonId: 107, // Hitmonchan
            baseAttack: 138
        };
        moveInfo[230] = {
            moveId: 230,
            name: "Water Gun",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 6,
            damageWithStab: 6,
            damagePerSecond: 12.00,
            damagePerSecondWithStab: 15.00,
            damagePerSecondDefensive: 2.40,
            energyPerSecond: 14.00,
            cooldown: 0.50
        };
        moveInfo[230].availableToPokemon[8] = {
            pokemonId: 8, // Wartortle
            baseAttack: 144
        };
        moveInfo[230].availableToPokemon[9] = {
            pokemonId: 9, // Blastoise
            baseAttack: 186
        };
        moveInfo[230].availableToPokemon[54] = {
            pokemonId: 54, // Psyduck
            baseAttack: 132
        };
        moveInfo[230].availableToPokemon[55] = {
            pokemonId: 55, // Golduck
            baseAttack: 194
        };
        moveInfo[230].availableToPokemon[79] = {
            pokemonId: 79, // Slowpoke
            baseAttack: 110
        };
        moveInfo[230].availableToPokemon[80] = {
            pokemonId: 80, // Slowbro
            baseAttack: 184
        };
        moveInfo[230].availableToPokemon[86] = {
            pokemonId: 86, // Seel
            baseAttack: 104
        };
        moveInfo[230].availableToPokemon[116] = {
            pokemonId: 116, // Horsea
            baseAttack: 122
        };
        moveInfo[230].availableToPokemon[117] = {
            pokemonId: 117, // Seadra
            baseAttack: 176
        };
        moveInfo[230].availableToPokemon[120] = {
            pokemonId: 120, // Staryu
            baseAttack: 130
        };
        moveInfo[230].availableToPokemon[121] = {
            pokemonId: 121, // Starmie
            baseAttack: 194
        };
        moveInfo[230].availableToPokemon[134] = {
            pokemonId: 134, // Vaporeon
            baseAttack: 186
        };
        moveInfo[230].availableToPokemon[138] = {
            pokemonId: 138, // Omanyte
            baseAttack: 132
        };
        moveInfo[230].availableToPokemon[139] = {
            pokemonId: 139, // Omastar
            baseAttack: 180
        };
        moveInfo[231] = {
            moveId: 231,
            name: "Splash",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 0,
            damageWithStab: 0,
            damagePerSecond: 0.00,
            damagePerSecondWithStab: 0.00,
            damagePerSecondDefensive: 0.00,
            energyPerSecond: 0.00,
            cooldown: 1.23
        };
        moveInfo[231].availableToPokemon[129] = {
            pokemonId: 129, // Magikarp
            baseAttack: 42
        };
        moveInfo[233] = {
            moveId: 233,
            name: "Mud Slap",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 15,
            damageWithStab: 15,
            damagePerSecond: 11.11,
            damagePerSecondWithStab: 13.89,
            damagePerSecondDefensive: 4.48,
            energyPerSecond: 8.89,
            cooldown: 1.35
        };
        moveInfo[233].availableToPokemon[88] = {
            pokemonId: 88, // Grimer
            baseAttack: 124
        };
        moveInfo[233].availableToPokemon[104] = {
            pokemonId: 104, // Cubone
            baseAttack: 102
        };
        moveInfo[233].availableToPokemon[105] = {
            pokemonId: 105, // Marowak
            baseAttack: 140
        };
        moveInfo[233].availableToPokemon[111] = {
            pokemonId: 111, // Rhyhorn
            baseAttack: 110
        };
        moveInfo[233].availableToPokemon[112] = {
            pokemonId: 112, // Rhydon
            baseAttack: 166
        };
        moveInfo[233].availableToPokemon[115] = {
            pokemonId: 115, // Kangaskhan
            baseAttack: 142
        };
        moveInfo[234] = {
            moveId: 234,
            name: "Zen Headbutt",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Psychic,
            damage: 12,
            damageWithStab: 12,
            damagePerSecond: 11.43,
            damagePerSecondWithStab: 14.29,
            damagePerSecondDefensive: 3.93,
            energyPerSecond: 8.57,
            cooldown: 1.05
        };
        moveInfo[234].availableToPokemon[35] = {
            pokemonId: 35, // Clefairy
            baseAttack: 116
        };
        moveInfo[234].availableToPokemon[36] = {
            pokemonId: 36, // Clefable
            baseAttack: 178
        };
        moveInfo[234].availableToPokemon[54] = {
            pokemonId: 54, // Psyduck
            baseAttack: 132
        };
        moveInfo[234].availableToPokemon[63] = {
            pokemonId: 63, // Abra
            baseAttack: 110
        };
        moveInfo[234].availableToPokemon[97] = {
            pokemonId: 97, // Hypno
            baseAttack: 162
        };
        moveInfo[234].availableToPokemon[103] = {
            pokemonId: 103, // Exeggutor
            baseAttack: 232
        };
        moveInfo[234].availableToPokemon[108] = {
            pokemonId: 108, // Lickitung
            baseAttack: 126
        };
        moveInfo[234].availableToPokemon[113] = {
            pokemonId: 113, // Chansey
            baseAttack: 40
        };
        moveInfo[234].availableToPokemon[122] = {
            pokemonId: 122, // Mr. Mime
            baseAttack: 154
        };
        moveInfo[234].availableToPokemon[128] = {
            pokemonId: 128, // Tauros
            baseAttack: 148
        };
        moveInfo[234].availableToPokemon[143] = {
            pokemonId: 143, // Snorlax
            baseAttack: 180
        };
        moveInfo[235] = {
            moveId: 235,
            name: "Confusion",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Psychic,
            damage: 15,
            damageWithStab: 15,
            damagePerSecond: 9.93,
            damagePerSecondWithStab: 12.42,
            damagePerSecondDefensive: 4.27,
            energyPerSecond: 9.27,
            cooldown: 1.51
        };
        moveInfo[235].availableToPokemon[12] = {
            pokemonId: 12, // Butterfree
            baseAttack: 144
        };
        moveInfo[235].availableToPokemon[48] = {
            pokemonId: 48, // Venonat
            baseAttack: 108
        };
        moveInfo[235].availableToPokemon[49] = {
            pokemonId: 49, // Venomoth
            baseAttack: 172
        };
        moveInfo[235].availableToPokemon[55] = {
            pokemonId: 55, // Golduck
            baseAttack: 194
        };
        moveInfo[235].availableToPokemon[64] = {
            pokemonId: 64, // Kadabra
            baseAttack: 150
        };
        moveInfo[235].availableToPokemon[65] = {
            pokemonId: 65, // Alakazam
            baseAttack: 186
        };
        moveInfo[235].availableToPokemon[79] = {
            pokemonId: 79, // Slowpoke
            baseAttack: 110
        };
        moveInfo[235].availableToPokemon[80] = {
            pokemonId: 80, // Slowbro
            baseAttack: 184
        };
        moveInfo[235].availableToPokemon[96] = {
            pokemonId: 96, // Drowzee
            baseAttack: 104
        };
        moveInfo[235].availableToPokemon[97] = {
            pokemonId: 97, // Hypno
            baseAttack: 162
        };
        moveInfo[235].availableToPokemon[102] = {
            pokemonId: 102, // Exeggcute
            baseAttack: 110
        };
        moveInfo[235].availableToPokemon[103] = {
            pokemonId: 103, // Exeggutor
            baseAttack: 232
        };
        moveInfo[235].availableToPokemon[122] = {
            pokemonId: 122, // Mr. Mime
            baseAttack: 154
        };
        moveInfo[235].availableToPokemon[150] = {
            pokemonId: 150, // Mewtwo
            baseAttack: 284
        };
        moveInfo[236] = {
            moveId: 236,
            name: "Poison Sting",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 6,
            damageWithStab: 6,
            damagePerSecond: 10.43,
            damagePerSecondWithStab: 13.04,
            damagePerSecondDefensive: 2.33,
            energyPerSecond: 13.91,
            cooldown: 0.58
        };
        moveInfo[236].availableToPokemon[13] = {
            pokemonId: 13, // Weedle
            baseAttack: 68
        };
        moveInfo[236].availableToPokemon[23] = {
            pokemonId: 23, // Ekans
            baseAttack: 112
        };
        moveInfo[236].availableToPokemon[29] = {
            pokemonId: 29, // Nidoran F
            baseAttack: 100
        };
        moveInfo[236].availableToPokemon[30] = {
            pokemonId: 30, // Nidorina
            baseAttack: 132
        };
        moveInfo[236].availableToPokemon[32] = {
            pokemonId: 32, // Nidoran M
            baseAttack: 110
        };
        moveInfo[236].availableToPokemon[33] = {
            pokemonId: 33, // Nidorino
            baseAttack: 142
        };
        moveInfo[236].availableToPokemon[72] = {
            pokemonId: 72, // Tentacool
            baseAttack: 106
        };
        moveInfo[237] = {
            moveId: 237,
            name: "Bubble",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 10.87,
            damagePerSecondWithStab: 13.59,
            damagePerSecondDefensive: 5.81,
            energyPerSecond: 10.87,
            cooldown: 2.30
        };
        moveInfo[237].availableToPokemon[7] = {
            pokemonId: 7, // Squirtle
            baseAttack: 112
        };
        moveInfo[237].availableToPokemon[60] = {
            pokemonId: 60, // Poliwag
            baseAttack: 108
        };
        moveInfo[237].availableToPokemon[61] = {
            pokemonId: 61, // Poliwhirl
            baseAttack: 132
        };
        moveInfo[237].availableToPokemon[62] = {
            pokemonId: 62, // Poliwrath
            baseAttack: 180
        };
        moveInfo[237].availableToPokemon[72] = {
            pokemonId: 72, // Tentacool
            baseAttack: 106
        };
        moveInfo[237].availableToPokemon[98] = {
            pokemonId: 98, // Krabby
            baseAttack: 116
        };
        moveInfo[237].availableToPokemon[116] = {
            pokemonId: 116, // Horsea
            baseAttack: 122
        };
        moveInfo[238] = {
            moveId: 238,
            name: "Feint Attack",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Dark,
            damage: 12,
            damageWithStab: 12,
            damagePerSecond: 11.54,
            damagePerSecondWithStab: 14.42,
            damagePerSecondDefensive: 3.95,
            energyPerSecond: 9.62,
            cooldown: 1.04
        };
        moveInfo[238].availableToPokemon[38] = {
            pokemonId: 38, // Ninetales
            baseAttack: 176
        };
        moveInfo[238].availableToPokemon[39] = {
            pokemonId: 39, // Jigglypuff
            baseAttack: 98
        };
        moveInfo[238].availableToPokemon[40] = {
            pokemonId: 40, // Wigglytuff
            baseAttack: 168
        };
        moveInfo[238].availableToPokemon[53] = {
            pokemonId: 53, // Persian
            baseAttack: 156
        };
        moveInfo[238].availableToPokemon[85] = {
            pokemonId: 85, // Dodrio
            baseAttack: 182
        };
        moveInfo[239] = {
            moveId: 239,
            name: "Steel Wing",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Steel,
            damage: 15,
            damageWithStab: 15,
            damagePerSecond: 11.28,
            damagePerSecondWithStab: 14.10,
            damagePerSecondDefensive: 4.50,
            energyPerSecond: 9.02,
            cooldown: 1.33
        };
        moveInfo[239].availableToPokemon[17] = {
            pokemonId: 17, // Pidgeotto
            baseAttack: 126
        };
        moveInfo[239].availableToPokemon[18] = {
            pokemonId: 18, // Pidgeot
            baseAttack: 170
        };
        moveInfo[239].availableToPokemon[22] = {
            pokemonId: 22, // Fearow
            baseAttack: 168
        };
        moveInfo[239].availableToPokemon[85] = {
            pokemonId: 85, // Dodrio
            baseAttack: 182
        };
        moveInfo[239].availableToPokemon[123] = {
            pokemonId: 123, // Scyther
            baseAttack: 176
        };
        moveInfo[239].availableToPokemon[142] = {
            pokemonId: 142, // Aerodactyl
            baseAttack: 182
        };
        moveInfo[239].availableToPokemon[149] = {
            pokemonId: 149, // Dragonite
            baseAttack: 250
        };
        moveInfo[240] = {
            moveId: 240,
            name: "Fire Fang",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 10,
            damageWithStab: 10,
            damagePerSecond: 11.90,
            damagePerSecondWithStab: 14.88,
            damagePerSecondDefensive: 3.52,
            energyPerSecond: 9.52,
            cooldown: 0.84
        };
        moveInfo[240].availableToPokemon[59] = {
            pokemonId: 59, // Arcanine
            baseAttack: 230
        };
        moveInfo[241] = {
            moveId: 241,
            name: "Rock Smash",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Fighting,
            damage: 15,
            damageWithStab: 15,
            damagePerSecond: 10.64,
            damagePerSecondWithStab: 13.30,
            damagePerSecondDefensive: 4.40,
            energyPerSecond: 8.51,
            cooldown: 1.41
        };
        moveInfo[241].availableToPokemon[104] = {
            pokemonId: 104, // Cubone
            baseAttack: 102
        };
        moveInfo[241].availableToPokemon[105] = {
            pokemonId: 105, // Marowak
            baseAttack: 140
        };
        moveInfo[241].availableToPokemon[106] = {
            pokemonId: 106, // Hitmonlee
            baseAttack: 148
        };
        moveInfo[241].availableToPokemon[107] = {
            pokemonId: 107, // Hitmonchan
            baseAttack: 138
        };
        moveInfo[241].availableToPokemon[111] = {
            pokemonId: 111, // Rhyhorn
            baseAttack: 110
        };
        moveInfo[241].availableToPokemon[112] = {
            pokemonId: 112, // Rhydon
            baseAttack: 166
        };
        moveInfo[241].availableToPokemon[127] = {
            pokemonId: 127, // Pinsir
            baseAttack: 184
        };
        StaticInfo.moveInfo = moveInfo;
        //#endregion Move info

        //#region Pokemon info
        const pokemonInfo = [];
        pokemonInfo[0] = 
        {
            // MissingNo
            elements: [],
            evolvesInto: []
        }
        pokemonInfo[1] = {
            // Bulbasaur
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: [2] // Ivysaur
        };
        pokemonInfo[2] = {
            // Ivysaur
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: [3] // Venusaur
        };
        pokemonInfo[3] = {
            // Venusaur
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[4] = {
            // Charmander
            elements: [PokeElement.Fire],
            evolvesInto: [5] // Charmeleon
        };
        pokemonInfo[5] = {
            // Charmeleon
            elements: [PokeElement.Fire],
            evolvesInto: [6] // Charizard
        };
        pokemonInfo[6] = {
            // Charizard
            elements: [PokeElement.Fire, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[7] = {
            // Squirtle
            elements: [PokeElement.Water],
            evolvesInto: [8] // Wartortle
        };
        pokemonInfo[8] = {
            // Wartortle
            elements: [PokeElement.Water],
            evolvesInto: [9] // Blastoise
        };
        pokemonInfo[9] = {
            // Blastoise
            elements: [PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[10] = {
            // Caterpie
            elements: [PokeElement.Bug],
            evolvesInto: [11] // Metapod
        };
        pokemonInfo[11] = {
            // Metapod
            elements: [PokeElement.Bug],
            evolvesInto: [12] // Butterfree
        };
        pokemonInfo[12] = {
            // Butterfree
            elements: [PokeElement.Bug, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[13] = {
            // Weedle
            elements: [PokeElement.Bug, PokeElement.Poison],
            evolvesInto: [14] // Kakuna
        };
        pokemonInfo[14] = {
            // Kakuna
            elements: [PokeElement.Bug, PokeElement.Poison],
            evolvesInto: [15] // Beedrill
        };
        pokemonInfo[15] = {
            // Beedrill
            elements: [PokeElement.Bug, PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[16] = {
            // Pidgey
            elements: [PokeElement.Normal],
            evolvesInto: [17] // Pidgeotto
        };
        pokemonInfo[17] = {
            // Pidgeotto
            elements: [PokeElement.Normal, PokeElement.Flying],
            evolvesInto: [18] // Pidgeot
        };
        pokemonInfo[18] = {
            // Pidgeot
            elements: [PokeElement.Normal, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[19] = {
            // Rattata
            elements: [PokeElement.Normal],
            evolvesInto: [20] // Raticate
        };
        pokemonInfo[20] = {
            // Raticate
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[21] = {
            // Spearow
            elements: [PokeElement.Normal, PokeElement.Flying],
            evolvesInto: [22] // Fearow
        };
        pokemonInfo[22] = {
            // Fearow
            elements: [PokeElement.Normal, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[23] = {
            // Ekans
            elements: [PokeElement.Poison],
            evolvesInto: [24] // Arbok
        };
        pokemonInfo[24] = {
            // Arbok
            elements: [PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[25] = {
            // Pikachu
            elements: [PokeElement.Electric],
            evolvesInto: [26] // Raichu
        };
        pokemonInfo[26] = {
            // Raichu
            elements: [PokeElement.Electric],
            evolvesInto: []
        };
        pokemonInfo[27] = {
            // Sandshrew
            elements: [PokeElement.Ground],
            evolvesInto: [28] // Sandslash
        };
        pokemonInfo[28] = {
            // Sandslash
            elements: [PokeElement.Ground],
            evolvesInto: []
        };
        pokemonInfo[29] = {
            // Nidoran F
            elements: [PokeElement.Poison],
            evolvesInto: [30] // Nidorina
        };
        pokemonInfo[30] = {
            // Nidorina
            elements: [PokeElement.Poison],
            evolvesInto: [31] // Nidoqueen
        };
        pokemonInfo[31] = {
            // Nidoqueen
            elements: [PokeElement.Poison, PokeElement.Ground],
            evolvesInto: []
        };
        pokemonInfo[32] = {
            // Nidoran M
            elements: [PokeElement.Poison],
            evolvesInto: [33] // Nidorino
        };
        pokemonInfo[33] = {
            // Nidorino
            elements: [PokeElement.Poison],
            evolvesInto: [34] // Nidoking
        };
        pokemonInfo[34] = {
            // Nidoking
            elements: [PokeElement.Poison, PokeElement.Ground],
            evolvesInto: []
        };
        pokemonInfo[35] = {
            // Clefairy
            elements: [PokeElement.Fairy],
            evolvesInto: [36] // Clefable
        };
        pokemonInfo[36] = {
            // Clefable
            elements: [PokeElement.Fairy],
            evolvesInto: []
        };
        pokemonInfo[37] = {
            // Vulpix
            elements: [PokeElement.Fire],
            evolvesInto: [38] // Ninetales
        };
        pokemonInfo[38] = {
            // Ninetales
            elements: [PokeElement.Fire],
            evolvesInto: []
        };
        pokemonInfo[39] = {
            // Jigglypuff
            elements: [PokeElement.Normal, PokeElement.Fairy],
            evolvesInto: [40] // Wigglytuff
        };
        pokemonInfo[40] = {
            // Wigglytuff
            elements: [PokeElement.Normal, PokeElement.Fairy],
            evolvesInto: []
        };
        pokemonInfo[41] = {
            // Zubat
            elements: [PokeElement.Poison, PokeElement.Flying],
            evolvesInto: [42] // Golbat
        };
        pokemonInfo[42] = {
            // Golbat
            elements: [PokeElement.Poison, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[43] = {
            // Oddish
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: [44] // Gloom
        };
        pokemonInfo[44] = {
            // Gloom
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: [45] // Vileplume
        };
        pokemonInfo[45] = {
            // Vileplume
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[46] = {
            // Paras
            elements: [PokeElement.Bug, PokeElement.Grass],
            evolvesInto: [47] // Parasect
        };
        pokemonInfo[47] = {
            // Parasect
            elements: [PokeElement.Bug, PokeElement.Grass],
            evolvesInto: []
        };
        pokemonInfo[48] = {
            // Venonat
            elements: [PokeElement.Bug, PokeElement.Poison],
            evolvesInto: [49] // Venomoth
        };
        pokemonInfo[49] = {
            // Venomoth
            elements: [PokeElement.Bug, PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[50] = {
            // Diglett
            elements: [PokeElement.Ground],
            evolvesInto: [51] // Dugtrio
        };
        pokemonInfo[51] = {
            // Dugtrio
            elements: [PokeElement.Ground],
            evolvesInto: []
        };
        pokemonInfo[52] = {
            // Meowth
            elements: [PokeElement.Normal],
            evolvesInto: [53] // Persian
        };
        pokemonInfo[53] = {
            // Persian
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[54] = {
            // Psyduck
            elements: [PokeElement.Water],
            evolvesInto: [55] // Golduck
        };
        pokemonInfo[55] = {
            // Golduck
            elements: [PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[56] = {
            // Mankey
            elements: [PokeElement.Fighting],
            evolvesInto: [57] // Primeape
        };
        pokemonInfo[57] = {
            // Primeape
            elements: [PokeElement.Fighting],
            evolvesInto: []
        };
        pokemonInfo[58] = {
            // Growlithe
            elements: [PokeElement.Fire],
            evolvesInto: [59] // Arcanine
        };
        pokemonInfo[59] = {
            // Arcanine
            elements: [PokeElement.Fire],
            evolvesInto: []
        };
        pokemonInfo[60] = {
            // Poliwag
            elements: [PokeElement.Water],
            evolvesInto: [61] // Poliwhirl
        };
        pokemonInfo[61] = {
            // Poliwhirl
            elements: [PokeElement.Water],
            evolvesInto: [62] // Poliwrath
        };
        pokemonInfo[62] = {
            // Poliwrath
            elements: [PokeElement.Water, PokeElement.Fighting],
            evolvesInto: []
        };
        pokemonInfo[63] = {
            // Abra
            elements: [PokeElement.Psychic],
            evolvesInto: [64] // Kadabra
        };
        pokemonInfo[64] = {
            // Kadabra
            elements: [PokeElement.Psychic],
            evolvesInto: [65] // Alakazam
        };
        pokemonInfo[65] = {
            // Alakazam
            elements: [PokeElement.Psychic],
            evolvesInto: []
        };
        pokemonInfo[66] = {
            // Machop
            elements: [PokeElement.Fighting],
            evolvesInto: [67] // Machoke
        };
        pokemonInfo[67] = {
            // Machoke
            elements: [PokeElement.Fighting],
            evolvesInto: [68] // Machamp
        };
        pokemonInfo[68] = {
            // Machamp
            elements: [PokeElement.Fighting],
            evolvesInto: []
        };
        pokemonInfo[69] = {
            // Bellsprout
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: [70] // Weepinbell
        };
        pokemonInfo[70] = {
            // Weepinbell
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: [71] // Victreebel
        };
        pokemonInfo[71] = {
            // Victreebel
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[72] = {
            // Tentacool
            elements: [PokeElement.Water, PokeElement.Poison],
            evolvesInto: [73] // Tentacruel
        };
        pokemonInfo[73] = {
            // Tentacruel
            elements: [PokeElement.Water, PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[74] = {
            // Geodude
            elements: [PokeElement.Rock, PokeElement.Ground],
            evolvesInto: [75] // Graveler
        };
        pokemonInfo[75] = {
            // Graveler
            elements: [PokeElement.Rock, PokeElement.Ground],
            evolvesInto: [76] // Golem
        };
        pokemonInfo[76] = {
            // Golem
            elements: [PokeElement.Rock, PokeElement.Ground],
            evolvesInto: []
        };
        pokemonInfo[77] = {
            // Ponyta
            elements: [PokeElement.Fire],
            evolvesInto: [78] // Rapidash
        };
        pokemonInfo[78] = {
            // Rapidash
            elements: [PokeElement.Fire],
            evolvesInto: []
        };
        pokemonInfo[79] = {
            // Slowpoke
            elements: [PokeElement.Water, PokeElement.Psychic],
            evolvesInto: [80] // Slowbro
        };
        pokemonInfo[80] = {
            // Slowbro
            elements: [PokeElement.Water, PokeElement.Psychic],
            evolvesInto: []
        };
        pokemonInfo[81] = {
            // Magnemite
            elements: [PokeElement.Electric, PokeElement.Steel],
            evolvesInto: [82] // Magneton
        };
        pokemonInfo[82] = {
            // Magneton
            elements: [PokeElement.Electric, PokeElement.Steel],
            evolvesInto: []
        };
        pokemonInfo[83] = {
            // Farfetch'd
            elements: [PokeElement.Normal, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[84] = {
            // Doduo
            elements: [PokeElement.Normal, PokeElement.Flying],
            evolvesInto: [85] // Dodrio
        };
        pokemonInfo[85] = {
            // Dodrio
            elements: [PokeElement.Normal, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[86] = {
            // Seel
            elements: [PokeElement.Water],
            evolvesInto: [87] // Dewgong
        };
        pokemonInfo[87] = {
            // Dewgong
            elements: [PokeElement.Water, PokeElement.Ice],
            evolvesInto: []
        };
        pokemonInfo[88] = {
            // Grimer
            elements: [PokeElement.Poison],
            evolvesInto: [89] // Muk
        };
        pokemonInfo[89] = {
            // Muk
            elements: [PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[90] = {
            // Shellder
            elements: [PokeElement.Water],
            evolvesInto: [91] // Cloyster
        };
        pokemonInfo[91] = {
            // Cloyster
            elements: [PokeElement.Water, PokeElement.Ice],
            evolvesInto: []
        };
        pokemonInfo[92] = {
            // Gastly
            elements: [PokeElement.Ghost, PokeElement.Poison],
            evolvesInto: [93] // Haunter
        };
        pokemonInfo[93] = {
            // Haunter
            elements: [PokeElement.Ghost, PokeElement.Poison],
            evolvesInto: [94] // Gengar
        };
        pokemonInfo[94] = {
            // Gengar
            elements: [PokeElement.Ghost, PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[95] = {
            // Onix
            elements: [PokeElement.Rock, PokeElement.Ground],
            evolvesInto: []
        };
        pokemonInfo[96] = {
            // Drowzee
            elements: [PokeElement.Psychic],
            evolvesInto: [97] // Hypno
        };
        pokemonInfo[97] = {
            // Hypno
            elements: [PokeElement.Psychic],
            evolvesInto: []
        };
        pokemonInfo[98] = {
            // Krabby
            elements: [PokeElement.Water],
            evolvesInto: [99] // Kingler
        };
        pokemonInfo[99] = {
            // Kingler
            elements: [PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[100] = {
            // Voltorb
            elements: [PokeElement.Electric],
            evolvesInto: [101] // Electrode
        };
        pokemonInfo[101] = {
            // Electrode
            elements: [PokeElement.Electric],
            evolvesInto: []
        };
        pokemonInfo[102] = {
            // Exeggcute
            elements: [PokeElement.Grass, PokeElement.Psychic],
            evolvesInto: [103] // Exeggutor
        };
        pokemonInfo[103] = {
            // Exeggutor
            elements: [PokeElement.Grass, PokeElement.Psychic],
            evolvesInto: []
        };
        pokemonInfo[104] = {
            // Cubone
            elements: [PokeElement.Ground],
            evolvesInto: [105] // Marowak
        };
        pokemonInfo[105] = {
            // Marowak
            elements: [PokeElement.Ground],
            evolvesInto: []
        };
        pokemonInfo[106] = {
            // Hitmonlee
            elements: [PokeElement.Fighting],
            evolvesInto: []
        };
        pokemonInfo[107] = {
            // Hitmonchan
            elements: [PokeElement.Fighting],
            evolvesInto: []
        };
        pokemonInfo[108] = {
            // Lickitung
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[109] = {
            // Koffing
            elements: [PokeElement.Poison],
            evolvesInto: [110] // Weezing
        };
        pokemonInfo[110] = {
            // Weezing
            elements: [PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[111] = {
            // Rhyhorn
            elements: [PokeElement.Ground, PokeElement.Rock],
            evolvesInto: [112] // Rhydon
        };
        pokemonInfo[112] = {
            // Rhydon
            elements: [PokeElement.Ground, PokeElement.Rock],
            evolvesInto: []
        };
        pokemonInfo[113] = {
            // Chansey
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[114] = {
            // Tangela
            elements: [PokeElement.Grass],
            evolvesInto: []
        };
        pokemonInfo[115] = {
            // Kangaskhan
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[116] = {
            // Horsea
            elements: [PokeElement.Water],
            evolvesInto: [117] // Seadra
        };
        pokemonInfo[117] = {
            // Seadra
            elements: [PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[118] = {
            // Goldeen
            elements: [PokeElement.Water],
            evolvesInto: [119] // Seaking
        };
        pokemonInfo[119] = {
            // Seaking
            elements: [PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[120] = {
            // Staryu
            elements: [PokeElement.Water],
            evolvesInto: [121] // Starmie
        };
        pokemonInfo[121] = {
            // Starmie
            elements: [PokeElement.Water, PokeElement.Psychic],
            evolvesInto: []
        };
        pokemonInfo[122] = {
            // Mr. Mime
            elements: [PokeElement.Psychic, PokeElement.Fairy],
            evolvesInto: []
        };
        pokemonInfo[123] = {
            // Scyther
            elements: [PokeElement.Bug, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[124] = {
            // Jynx
            elements: [PokeElement.Ice, PokeElement.Psychic],
            evolvesInto: []
        };
        pokemonInfo[125] = {
            // Electabuzz
            elements: [PokeElement.Electric],
            evolvesInto: []
        };
        pokemonInfo[126] = {
            // Magmar
            elements: [PokeElement.Fire],
            evolvesInto: []
        };
        pokemonInfo[127] = {
            // Pinsir
            elements: [PokeElement.Bug],
            evolvesInto: []
        };
        pokemonInfo[128] = {
            // Tauros
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[129] = {
            // Magikarp
            elements: [PokeElement.Water],
            evolvesInto: [130] // Gyarados
        };
        pokemonInfo[130] = {
            // Gyarados
            elements: [PokeElement.Water, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[131] = {
            // Lapras
            elements: [PokeElement.Water, PokeElement.Ice],
            evolvesInto: []
        };
        pokemonInfo[132] = {
            // Ditto
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[133] = {
            // Eevee
            elements: [PokeElement.Normal],
            evolvesInto: [134, 135, 136] // Vaporeon, Jolteon, Flareon
        };
        pokemonInfo[134] = {
            // Vaporeon
            elements: [PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[135] = {
            // Jolteon
            elements: [PokeElement.Electric],
            evolvesInto: []
        };
        pokemonInfo[136] = {
            // Flareon
            elements: [PokeElement.Fire],
            evolvesInto: []
        };
        pokemonInfo[137] = {
            // Porygon
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[138] = {
            // Omanyte
            elements: [PokeElement.Rock, PokeElement.Water],
            evolvesInto: [139] // Omastar
        };
        pokemonInfo[139] = {
            // Omastar
            elements: [PokeElement.Rock, PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[140] = {
            // Kabuto
            elements: [PokeElement.Rock, PokeElement.Water],
            evolvesInto: [141] // Kabutops
        };
        pokemonInfo[141] = {
            // Kabutops
            elements: [PokeElement.Rock, PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[142] = {
            // Aerodactyl
            elements: [PokeElement.Rock, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[143] = {
            // Snorlax
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[144] = {
            // Articuno
            elements: [PokeElement.Ice, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[145] = {
            // Zapdos
            elements: [PokeElement.Electric, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[146] = {
            // Moltres
            elements: [PokeElement.Fire, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[147] = {
            // Dratini
            elements: [PokeElement.Dragon],
            evolvesInto: [148] // Dragonair
        };
        pokemonInfo[148] = {
            // Dragonair
            elements: [PokeElement.Dragon],
            evolvesInto: [149] // Dragonite
        };
        pokemonInfo[149] = {
            // Dragonite
            elements: [PokeElement.Dragon, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[150] = {
            // Mewtwo
            elements: [PokeElement.Psychic],
            evolvesInto: []
        };
        pokemonInfo[151] = {
            // Mew
            elements: [PokeElement.Psychic],
            evolvesInto: []
        };

        for (let i = 0; i < pokemonInfo.length; i++) {
            const poke = pokemonInfo[i];
            poke.pokemonId = i;
            const possibleMoves = _.filter(moveInfo, move => {
                if (!move) {
                    return false;
                }
                const found = _.find((move as IMoveInfo).availableToPokemon, av => {
                    if (!av) {
                        return false;
                    }
                    const found2 = av.pokemonId === poke.pokemonId;
                    return found2;
                });
                return found;
            });
            poke.possibleMoves = _.map(possibleMoves, move => move.moveId);
        }
        StaticInfo.pokemonInfo = pokemonInfo;
        //#endregion
    };
}