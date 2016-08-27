declare namespace RawData {

    export interface BadgeSettings {
        badgeType: string;
        badgeRank: number;
        targets: number[];
    }

    export interface BattleSettings {
        retargetSeconds: number;
        enemyAttackInterval: number;
        attackServerInterval: number;
        roundDurationSeconds: number;
        bonusTimePerAllySeconds: number;
        maximumAttackersPerBattle: number;
        sameTypeAttackBonusMultiplier: number;
        maximumEnergy: number;
        energyDeltaPerHealthLost: number;
        dodgeDurationMs: number;
        minimumPlayerLevel: number;
        swapDurationMs: number;
        dodgeDamageReductionPercent: number;
    }

    export interface EncounterSettings {
        spinBonusThreshold: number;
        excellentThrowThreshold: number;
        greatThrowThreshold: number;
        niceThrowThreshold: number;
        milestoneThreshold: number;
    }

    export interface GymLevel {
        requiredExperience: number[];
        leaderSlots: number[];
        trainerSlots: number[];
    }

    export interface IapSettings {
        dailyDefenderBonusPerPokemon: number[];
        dailyDefenderBonusMaxDefenders: number;
        dailyDefenderBonusCurrency: string[];
        minTimeBetweenClaimsMs: string;
        dailyDefenderBonusEnabled: boolean;
    }

    export interface Potion {
        staAmount?: number;
        staPercent?: number;
    }

    export interface Incense {
        incenseLifetimeSeconds: number;
        standingTimeBetweenEncountersSeconds: number;
        movingTimeBetweenEncounterSeconds: number;
        distanceRequiredForShorterIntervalMeters: number;
    }

    export interface EggIncubator {
        incubatorType: string;
        uses?: number;
        distanceMultiplier: number;
    }

    export interface InventoryUpgrade {
        additionalStorage: number;
        upgradeType: string;
    }

    export interface XpBoost {
        xpMultiplier: number;
        boostDurationMs: number;
    }

    export interface Revive {
        staPercent: number;
    }

    export interface ItemSettings {
        itemId: string;
        itemType: string;
        category: string;
        potion?: Potion;
        incense?: Incense;
        eggIncubator?: EggIncubator;
        inventoryUpgrade?: InventoryUpgrade;
        xpBoost?: XpBoost;
        revive?: Revive;
    }

    export interface PlayerLevel {
        rankNum: number[];
        requiredExperience: number[];
        cpMultiplier: number[];
        maxEggPlayerLevel: number;
        maxEncounterPlayerLevel: number;
    }

    export interface TypeEffective {
        attackScalar: number[];
        attackType: string;
    }

    export interface PokemonUpgrades {
        upgradesPerLevel: number;
        allowedLevelsAbovePlayer: number;
        candyCost: number[];
        stardustCost: number[];
    }

    export interface Camera {
        diskRadiusM: number;
        cylinderRadiusM: number;
        cylinderHeightM: number;
        shoulderModeScale?: number;
        cylinderGroundM?: number;
    }

    export interface Encounter {
        baseCaptureRate?: number;
        baseFleeRate?: number;
        collisionRadiusM: number;
        collisionHeightM: number;
        collisionHeadRadiusM: number;
        movementType?: string;
        movementTimerS: number;
        jumpTimeS?: number;
        attackTimerS: number;
    }

    export interface Stats {
        baseStamina: number;
        baseAttack: number;
        baseDefense: number;
    }

    export interface PokemonSettings {
        pokemonId: string;
        modelScale: number;
        type: string;
        type2?: string;
        camera: Camera;
        encounter: Encounter;
        stats: Stats;
        quickMoves: string[];
        cinematicMoves: string[];
        animationTime: number[];
        evolutionIds?: string[];
        evolutionPips: number;
        pokedexHeightM: number;
        pokedexWeightKg: number;
        heightStdDev: number;
        weightStdDev: number;
        familyId: string;
        candyToEvolve?: number;
        parentPokemonId?: string;
        rarity?: string;
    }

    export interface ExtendedPokemonSettings extends PokemonSettings {
        id: number;
        elements: PokeElement[];
        availableQuickMoves: MoveSettings[];
        availableCinematicMoves: MoveSettings[];
        evolvesInto: PokemonSettings[];
    }

    export interface MoveSettings {
        movementId: string;
        animationId: number;
        pokemonType: string;
        power?: number;
        accuracyChance: number;
        criticalChance?: number;
        staminaLossScalar?: number;
        trainerLevelMin: number;
        trainerLevelMax: number;
        vfxName: string;
        durationMs: number;
        damageWindowStartMs: number;
        damageWindowEndMs: number;
        energyDelta: number;
        healScalar?: number;
    }

    export interface ExtendedMoveSettings extends MoveSettings {
        id: number;
        element: PokeElement;
        moveType: MoveType;
        availableToPokemon: PokemonSettings[];
    }

    export interface IapItemDisplay {
        sku: string;
        category: string;
        sortOrder: number;
        itemIds?: string[];
        counts?: number[];
    }

    export interface Camera2 {
        interpolation: string[];
        targetType: string[];
        easeInSpeed: number[];
        eastOutSpeed: number[];
        durationSeconds: number[];
        waitSeconds: number[];
        transitionSeconds: number[];
        angleDegree: number[];
        angleOffsetDegree: number[];
        pitchDegree: number[];
        pitchOffsetDegree: number[];
        rollDegree: number[];
        distanceMeters: number[];
        heightPercent: number[];
        vertCtrRatio: number[];
        nextCamera?: string;
    }

    export interface MoveSequenceSettings {
        sequence: string[];
    }

    export interface ItemTemplate {
        templateId: string;
        badgeSettings?: BadgeSettings;
        battleSettings?: BattleSettings;
        encounterSettings?: EncounterSettings;
        gymLevel?: GymLevel;
        iapSettings?: IapSettings;
        itemSettings?: ItemSettings;
        playerLevel?: PlayerLevel;
        typeEffective?: TypeEffective;
        pokemonUpgrades?: PokemonUpgrades;
        pokemonSettings?: PokemonSettings;
        moveSettings?: MoveSettings;
        iapItemDisplay?: IapItemDisplay;
        camera?: Camera2;
        moveSequenceSettings?: MoveSequenceSettings;
    }

    export interface RawDataRoot {
        success: boolean;
        itemTemplates: ItemTemplate[];
        timestampMs: string;
    }
}