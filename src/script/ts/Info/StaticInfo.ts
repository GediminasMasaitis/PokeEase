enum PokemonType {
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

interface IPokemonInfo {
    types: PokemonType[];
    evolvesInto: number[];
}

class StaticInfo {
    public static itemCodes: string[];
    public static itemIds: number[];
    public static totalExpForLevel: number[];
    public static expForLevel: number[];
    public static berryIds: number[];
    public static pokemonInfo: IPokemonInfo[];

    public static __ctor = (() => {
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

        const pokemonInfo: IPokemonInfo[] = [];
        pokemonInfo[1] = {
            // Bulbasaur
            types: [PokemonType.Grass, PokemonType.Poison],
            evolvesInto: [2] // Ivysaur
        };
        pokemonInfo[2] = {
            // Ivysaur
            types: [PokemonType.Grass, PokemonType.Poison],
            evolvesInto: [3] // Venusaur
        };
        pokemonInfo[3] = {
            // Venusaur
            types: [PokemonType.Grass, PokemonType.Poison],
            evolvesInto: []
        };
        pokemonInfo[4] = {
            // Charmander
            types: [PokemonType.Fire],
            evolvesInto: [5] // Charmeleon
        };
        pokemonInfo[5] = {
            // Charmeleon
            types: [PokemonType.Fire],
            evolvesInto: [6] // Charizard
        };
        pokemonInfo[6] = {
            // Charizard
            types: [PokemonType.Fire, PokemonType.Flying],
            evolvesInto: []
        };
        pokemonInfo[7] = {
            // Squirtle
            types: [PokemonType.Water],
            evolvesInto: [8] // Wartortle
        };
        pokemonInfo[8] = {
            // Wartortle
            types: [PokemonType.Water],
            evolvesInto: [9] // Blastoise
        };
        pokemonInfo[9] = {
            // Blastoise
            types: [PokemonType.Water],
            evolvesInto: []
        };
        pokemonInfo[10] = {
            // Caterpie
            types: [PokemonType.Bug],
            evolvesInto: [11] // Metapod
        };
        pokemonInfo[11] = {
            // Metapod
            types: [PokemonType.Bug],
            evolvesInto: [12] // Butterfree
        };
        pokemonInfo[12] = {
            // Butterfree
            types: [PokemonType.Bug, PokemonType.Flying],
            evolvesInto: []
        };
        pokemonInfo[13] = {
            // Weedle
            types: [PokemonType.Bug, PokemonType.Poison],
            evolvesInto: [14] // Kakuna
        };
        pokemonInfo[14] = {
            // Kakuna
            types: [PokemonType.Bug, PokemonType.Poison],
            evolvesInto: [15] // Beedrill
        };
        pokemonInfo[15] = {
            // Beedrill
            types: [PokemonType.Bug, PokemonType.Poison],
            evolvesInto: []
        };
        pokemonInfo[16] = {
            // Pidgey
            types: [PokemonType.Normal],
            evolvesInto: [17] // Pidgeotto
        };
        pokemonInfo[17] = {
            // Pidgeotto
            types: [PokemonType.Normal, PokemonType.Flying],
            evolvesInto: [18] // Pidgeot
        };
        pokemonInfo[18] = {
            // Pidgeot
            types: [PokemonType.Normal, PokemonType.Flying],
            evolvesInto: []
        };
        pokemonInfo[19] = {
            // Rattata
            types: [PokemonType.Normal],
            evolvesInto: [20] // Raticate
        };
        pokemonInfo[20] = {
            // Raticate
            types: [PokemonType.Normal],
            evolvesInto: []
        };
        pokemonInfo[21] = {
            // Spearow
            types: [PokemonType.Normal, PokemonType.Flying],
            evolvesInto: [22] // Fearow
        };
        pokemonInfo[22] = {
            // Fearow
            types: [PokemonType.Normal, PokemonType.Flying],
            evolvesInto: []
        };
        pokemonInfo[23] = {
            // Ekans
            types: [PokemonType.Poison],
            evolvesInto: [24] // Arbok
        };
        pokemonInfo[24] = {
            // Arbok
            types: [PokemonType.Poison],
            evolvesInto: []
        };
        pokemonInfo[25] = {
            // Pikachu
            types: [PokemonType.Electric],
            evolvesInto: [26] // Raichu
        };
        pokemonInfo[26] = {
            // Raichu
            types: [PokemonType.Electric],
            evolvesInto: []
        };
        pokemonInfo[27] = {
            // Sandshrew
            types: [PokemonType.Ground],
            evolvesInto: [28] // Sandslash
        };
        pokemonInfo[28] = {
            // Sandslash
            types: [PokemonType.Ground],
            evolvesInto: []
        };
        pokemonInfo[29] = {
            // Nidoran F
            types: [PokemonType.Poison],
            evolvesInto: [30] // Nidorina
        };
        pokemonInfo[30] = {
            // Nidorina
            types: [PokemonType.Poison],
            evolvesInto: [31] // Nidoqueen
        };
        pokemonInfo[31] = {
            // Nidoqueen
            types: [PokemonType.Poison, PokemonType.Ground],
            evolvesInto: []
        };
        pokemonInfo[32] = {
            // Nidoran M
            types: [PokemonType.Poison],
            evolvesInto: [33] // Nidorino
        };
        pokemonInfo[33] = {
            // Nidorino
            types: [PokemonType.Poison],
            evolvesInto: [34] // Nidoking
        };
        pokemonInfo[34] = {
            // Nidoking
            types: [PokemonType.Poison, PokemonType.Ground],
            evolvesInto: []
        };
        pokemonInfo[35] = {
            // Clefairy
            types: [PokemonType.Fairy],
            evolvesInto: [36] // Clefable
        };
        pokemonInfo[36] = {
            // Clefable
            types: [PokemonType.Fairy],
            evolvesInto: []
        };
        pokemonInfo[37] = {
            // Vulpix
            types: [PokemonType.Fire],
            evolvesInto: [38] // Ninetales
        };
        pokemonInfo[38] = {
            // Ninetales
            types: [PokemonType.Fire],
            evolvesInto: []
        };
        pokemonInfo[39] = {
            // Jigglypuff
            types: [PokemonType.Normal, PokemonType.Fairy],
            evolvesInto: [40] // Wigglytuff
        };
        pokemonInfo[40] = {
            // Wigglytuff
            types: [PokemonType.Normal, PokemonType.Fairy],
            evolvesInto: []
        };
        pokemonInfo[41] = {
            // Zubat
            types: [PokemonType.Poison, PokemonType.Flying],
            evolvesInto: [42] // Golbat
        };
        pokemonInfo[42] = {
            // Golbat
            types: [PokemonType.Poison, PokemonType.Flying],
            evolvesInto: []
        };
        pokemonInfo[43] = {
            // Oddish
            types: [PokemonType.Grass, PokemonType.Poison],
            evolvesInto: [44] // Gloom
        };
        pokemonInfo[44] = {
            // Gloom
            types: [PokemonType.Grass, PokemonType.Poison],
            evolvesInto: [45] // Vileplume
        };
        pokemonInfo[45] = {
            // Vileplume
            types: [PokemonType.Grass, PokemonType.Poison],
            evolvesInto: []
        };
        pokemonInfo[46] = {
            // Paras
            types: [PokemonType.Bug, PokemonType.Grass],
            evolvesInto: [47] // Parasect
        };
        pokemonInfo[47] = {
            // Parasect
            types: [PokemonType.Bug, PokemonType.Grass],
            evolvesInto: []
        };
        pokemonInfo[48] = {
            // Venonat
            types: [PokemonType.Bug, PokemonType.Poison],
            evolvesInto: [49] // Venomoth
        };
        pokemonInfo[49] = {
            // Venomoth
            types: [PokemonType.Bug, PokemonType.Poison],
            evolvesInto: []
        };
        pokemonInfo[50] = {
            // Diglett
            types: [PokemonType.Ground],
            evolvesInto: [51] // Dugtrio
        };
        pokemonInfo[51] = {
            // Dugtrio
            types: [PokemonType.Ground],
            evolvesInto: []
        };
        pokemonInfo[52] = {
            // Meowth
            types: [PokemonType.Normal],
            evolvesInto: [53] // Persian
        };
        pokemonInfo[53] = {
            // Persian
            types: [PokemonType.Normal],
            evolvesInto: []
        };
        pokemonInfo[54] = {
            // Psyduck
            types: [PokemonType.Water],
            evolvesInto: [55] // Golduck
        };
        pokemonInfo[55] = {
            // Golduck
            types: [PokemonType.Water],
            evolvesInto: []
        };
        pokemonInfo[56] = {
            // Mankey
            types: [PokemonType.Fighting],
            evolvesInto: [57] // Primeape
        };
        pokemonInfo[57] = {
            // Primeape
            types: [PokemonType.Fighting],
            evolvesInto: []
        };
        pokemonInfo[58] = {
            // Growlithe
            types: [PokemonType.Fire],
            evolvesInto: [59] // Arcanine
        };
        pokemonInfo[59] = {
            // Arcanine
            types: [PokemonType.Fire],
            evolvesInto: []
        };
        pokemonInfo[60] = {
            // Poliwag
            types: [PokemonType.Water],
            evolvesInto: [61] // Poliwhirl
        };
        pokemonInfo[61] = {
            // Poliwhirl
            types: [PokemonType.Water],
            evolvesInto: [62] // Poliwrath
        };
        pokemonInfo[62] = {
            // Poliwrath
            types: [PokemonType.Water, PokemonType.Fighting],
            evolvesInto: []
        };
        pokemonInfo[63] = {
            // Abra
            types: [PokemonType.Psychic],
            evolvesInto: [64] // Kadabra
        };
        pokemonInfo[64] = {
            // Kadabra
            types: [PokemonType.Psychic],
            evolvesInto: [65] // Alakazam
        };
        pokemonInfo[65] = {
            // Alakazam
            types: [PokemonType.Psychic],
            evolvesInto: []
        };
        pokemonInfo[66] = {
            // Machop
            types: [PokemonType.Fighting],
            evolvesInto: [67] // Machoke
        };
        pokemonInfo[67] = {
            // Machoke
            types: [PokemonType.Fighting],
            evolvesInto: [68] // Machamp
        };
        pokemonInfo[68] = {
            // Machamp
            types: [PokemonType.Fighting],
            evolvesInto: []
        };
        pokemonInfo[69] = {
            // Bellsprout
            types: [PokemonType.Grass, PokemonType.Poison],
            evolvesInto: [70] // Weepinbell
        };
        pokemonInfo[70] = {
            // Weepinbell
            types: [PokemonType.Grass, PokemonType.Poison],
            evolvesInto: [71] // Victreebel
        };
        pokemonInfo[71] = {
            // Victreebel
            types: [PokemonType.Grass, PokemonType.Poison],
            evolvesInto: []
        };
        pokemonInfo[72] = {
            // Tentacool
            types: [PokemonType.Water, PokemonType.Poison],
            evolvesInto: [73] // Tentacruel
        };
        pokemonInfo[73] = {
            // Tentacruel
            types: [PokemonType.Water, PokemonType.Poison],
            evolvesInto: []
        };
        pokemonInfo[74] = {
            // Geodude
            types: [PokemonType.Rock, PokemonType.Ground],
            evolvesInto: [75] // Graveler
        };
        pokemonInfo[75] = {
            // Graveler
            types: [PokemonType.Rock, PokemonType.Ground],
            evolvesInto: [76] // Golem
        };
        pokemonInfo[76] = {
            // Golem
            types: [PokemonType.Rock, PokemonType.Ground],
            evolvesInto: []
        };
        pokemonInfo[77] = {
            // Ponyta
            types: [PokemonType.Fire],
            evolvesInto: [78] // Rapidash
        };
        pokemonInfo[78] = {
            // Rapidash
            types: [PokemonType.Fire],
            evolvesInto: []
        };
        pokemonInfo[79] = {
            // Slowpoke
            types: [PokemonType.Water, PokemonType.Psychic],
            evolvesInto: [80] // Slowbro
        };
        pokemonInfo[80] = {
            // Slowbro
            types: [PokemonType.Water, PokemonType.Psychic],
            evolvesInto: []
        };
        pokemonInfo[81] = {
            // Magnemite
            types: [PokemonType.Electric, PokemonType.Steel],
            evolvesInto: [82] // Magneton
        };
        pokemonInfo[82] = {
            // Magneton
            types: [PokemonType.Electric, PokemonType.Steel],
            evolvesInto: []
        };
        pokemonInfo[83] = {
            // Farfetch'd
            types: [PokemonType.Normal, PokemonType.Flying],
            evolvesInto: []
        };
        pokemonInfo[84] = {
            // Doduo
            types: [PokemonType.Normal, PokemonType.Flying],
            evolvesInto: [85] // Dodrio
        };
        pokemonInfo[85] = {
            // Dodrio
            types: [PokemonType.Normal, PokemonType.Flying],
            evolvesInto: []
        };
        pokemonInfo[86] = {
            // Seel
            types: [PokemonType.Water],
            evolvesInto: [87] // Dewgong
        };
        pokemonInfo[87] = {
            // Dewgong
            types: [PokemonType.Water, PokemonType.Ice],
            evolvesInto: []
        };
        pokemonInfo[88] = {
            // Grimer
            types: [PokemonType.Poison],
            evolvesInto: [89] // Muk
        };
        pokemonInfo[89] = {
            // Muk
            types: [PokemonType.Poison],
            evolvesInto: []
        };
        pokemonInfo[90] = {
            // Shellder
            types: [PokemonType.Water],
            evolvesInto: [91] // Cloyster
        };
        pokemonInfo[91] = {
            // Cloyster
            types: [PokemonType.Water, PokemonType.Ice],
            evolvesInto: []
        };
        pokemonInfo[92] = {
            // Gastly
            types: [PokemonType.Ghost, PokemonType.Poison],
            evolvesInto: [93] // Haunter
        };
        pokemonInfo[93] = {
            // Haunter
            types: [PokemonType.Ghost, PokemonType.Poison],
            evolvesInto: [94] // Gengar
        };
        pokemonInfo[94] = {
            // Gengar
            types: [PokemonType.Ghost, PokemonType.Poison],
            evolvesInto: []
        };
        pokemonInfo[95] = {
            // Onix
            types: [PokemonType.Rock, PokemonType.Ground],
            evolvesInto: []
        };
        pokemonInfo[96] = {
            // Drowzee
            types: [PokemonType.Psychic],
            evolvesInto: [97] // Hypno
        };
        pokemonInfo[97] = {
            // Hypno
            types: [PokemonType.Psychic],
            evolvesInto: []
        };
        pokemonInfo[98] = {
            // Krabby
            types: [PokemonType.Water],
            evolvesInto: [99] // Kingler
        };
        pokemonInfo[99] = {
            // Kingler
            types: [PokemonType.Water],
            evolvesInto: []
        };
        pokemonInfo[100] = {
            // Voltorb
            types: [PokemonType.Electric],
            evolvesInto: [101] // Electrode
        };
        pokemonInfo[101] = {
            // Electrode
            types: [PokemonType.Electric],
            evolvesInto: []
        };
        pokemonInfo[102] = {
            // Exeggcute
            types: [PokemonType.Grass, PokemonType.Psychic],
            evolvesInto: [103] // Exeggutor
        };
        pokemonInfo[103] = {
            // Exeggutor
            types: [PokemonType.Grass, PokemonType.Psychic],
            evolvesInto: []
        };
        pokemonInfo[104] = {
            // Cubone
            types: [PokemonType.Ground],
            evolvesInto: [105] // Marowak
        };
        pokemonInfo[105] = {
            // Marowak
            types: [PokemonType.Ground],
            evolvesInto: []
        };
        pokemonInfo[106] = {
            // Hitmonlee
            types: [PokemonType.Fighting],
            evolvesInto: []
        };
        pokemonInfo[107] = {
            // Hitmonchan
            types: [PokemonType.Fighting],
            evolvesInto: []
        };
        pokemonInfo[108] = {
            // Lickitung
            types: [PokemonType.Normal],
            evolvesInto: []
        };
        pokemonInfo[109] = {
            // Koffing
            types: [PokemonType.Poison],
            evolvesInto: [110] // Weezing
        };
        pokemonInfo[110] = {
            // Weezing
            types: [PokemonType.Poison],
            evolvesInto: []
        };
        pokemonInfo[111] = {
            // Rhyhorn
            types: [PokemonType.Ground, PokemonType.Rock],
            evolvesInto: [112] // Rhydon
        };
        pokemonInfo[112] = {
            // Rhydon
            types: [PokemonType.Ground, PokemonType.Rock],
            evolvesInto: []
        };
        pokemonInfo[113] = {
            // Chansey
            types: [PokemonType.Normal],
            evolvesInto: []
        };
        pokemonInfo[114] = {
            // Tangela
            types: [PokemonType.Grass],
            evolvesInto: []
        };
        pokemonInfo[115] = {
            // Kangaskhan
            types: [PokemonType.Normal],
            evolvesInto: []
        };
        pokemonInfo[116] = {
            // Horsea
            types: [PokemonType.Water],
            evolvesInto: [117] // Seadra
        };
        pokemonInfo[117] = {
            // Seadra
            types: [PokemonType.Water],
            evolvesInto: []
        };
        pokemonInfo[118] = {
            // Goldeen
            types: [PokemonType.Water],
            evolvesInto: [119] // Seaking
        };
        pokemonInfo[119] = {
            // Seaking
            types: [PokemonType.Water],
            evolvesInto: []
        };
        pokemonInfo[120] = {
            // Staryu
            types: [PokemonType.Water],
            evolvesInto: [121] // Starmie
        };
        pokemonInfo[121] = {
            // Starmie
            types: [PokemonType.Water, PokemonType.Psychic],
            evolvesInto: []
        };
        pokemonInfo[122] = {
            // Mr. Mime
            types: [PokemonType.Psychic, PokemonType.Fairy],
            evolvesInto: []
        };
        pokemonInfo[123] = {
            // Scyther
            types: [PokemonType.Bug, PokemonType.Flying],
            evolvesInto: []
        };
        pokemonInfo[124] = {
            // Jynx
            types: [PokemonType.Ice, PokemonType.Psychic],
            evolvesInto: []
        };
        pokemonInfo[125] = {
            // Electabuzz
            types: [PokemonType.Electric],
            evolvesInto: []
        };
        pokemonInfo[126] = {
            // Magmar
            types: [PokemonType.Fire],
            evolvesInto: []
        };
        pokemonInfo[127] = {
            // Pinsir
            types: [PokemonType.Bug],
            evolvesInto: []
        };
        pokemonInfo[128] = {
            // Tauros
            types: [PokemonType.Normal],
            evolvesInto: []
        };
        pokemonInfo[129] = {
            // Magikarp
            types: [PokemonType.Water],
            evolvesInto: [130] // Gyarados
        };
        pokemonInfo[130] = {
            // Gyarados
            types: [PokemonType.Water, PokemonType.Flying],
            evolvesInto: []
        };
        pokemonInfo[131] = {
            // Lapras
            types: [PokemonType.Water, PokemonType.Ice],
            evolvesInto: []
        };
        pokemonInfo[132] = {
            // Ditto
            types: [PokemonType.Normal],
            evolvesInto: []
        };
        pokemonInfo[133] = {
            // Eevee
            types: [PokemonType.Normal],
            evolvesInto: [134, 135, 136] // Vaporeon, Jolteon, Flareon
        };
        pokemonInfo[134] = {
            // Vaporeon
            types: [PokemonType.Water],
            evolvesInto: []
        };
        pokemonInfo[135] = {
            // Jolteon
            types: [PokemonType.Electric],
            evolvesInto: []
        };
        pokemonInfo[136] = {
            // Flareon
            types: [PokemonType.Fire],
            evolvesInto: []
        };
        pokemonInfo[137] = {
            // Porygon
            types: [PokemonType.Normal],
            evolvesInto: []
        };
        pokemonInfo[138] = {
            // Omanyte
            types: [PokemonType.Rock, PokemonType.Water],
            evolvesInto: [139] // Omastar
        };
        pokemonInfo[139] = {
            // Omastar
            types: [PokemonType.Rock, PokemonType.Water],
            evolvesInto: []
        };
        pokemonInfo[140] = {
            // Kabuto
            types: [PokemonType.Rock, PokemonType.Water],
            evolvesInto: [141] // Kabutops
        };
        pokemonInfo[141] = {
            // Kabutops
            types: [PokemonType.Rock, PokemonType.Water],
            evolvesInto: []
        };
        pokemonInfo[142] = {
            // Aerodactyl
            types: [PokemonType.Rock, PokemonType.Flying],
            evolvesInto: []
        };
        pokemonInfo[143] = {
            // Snorlax
            types: [PokemonType.Normal],
            evolvesInto: []
        };
        pokemonInfo[144] = {
            // Articuno
            types: [PokemonType.Ice, PokemonType.Flying],
            evolvesInto: []
        };
        pokemonInfo[145] = {
            // Zapdos
            types: [PokemonType.Electric, PokemonType.Flying],
            evolvesInto: []
        };
        pokemonInfo[146] = {
            // Moltres
            types: [PokemonType.Fire, PokemonType.Flying],
            evolvesInto: []
        };
        pokemonInfo[147] = {
            // Dratini
            types: [PokemonType.Dragon],
            evolvesInto: [148] // Dragonair
        };
        pokemonInfo[148] = {
            // Dragonair
            types: [PokemonType.Dragon],
            evolvesInto: [149] // Dragonite
        };
        pokemonInfo[149] = {
            // Dragonite
            types: [PokemonType.Dragon, PokemonType.Flying],
            evolvesInto: []
        };
        pokemonInfo[150] = {
            // Mewtwo
            types: [PokemonType.Psychic],
            evolvesInto: []
        };
        pokemonInfo[151] = {
            // Mew
            types: [PokemonType.Psychic],
            evolvesInto: []
        };
        StaticInfo.pokemonInfo = pokemonInfo;
    })();
}