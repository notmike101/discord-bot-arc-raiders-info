declare global {
    namespace MetaForge {
        interface StatBlock {
            range: number;
            damage: number;
            health: number;
            radius: number;
            shield: number;
            weight: number;
            agility: number;
            arcStun: number;
            healing: number;
            stamina: number;
            stealth: number;
            useTime: number;
            duration: number;
            fireRate: number;
            firingMode: string;
            stability: number;
            stackSize: number;
            damageMult: number;
            raiderStun: number;
            weightLimit: number;
            augmentSlots?: number; // Optional in some contexts, but present in JSON
            healingSlots?: number;
            magazineSize: number;
            reducedNoise: number;
            shieldCharge: number;
            backpackSlots: number;
            quickUseSlots: number;
            damagePerSecond: number;
            movementPenalty: number;
            safePocketSlots: number;
            damageMitigation: number;
            healingPerSecond: number;
            reducedEquipTime: number;
            staminaPerSecond: number;
            increasedADSSpeed: number;
            increasedFireRate: number;
            reducedReloadTime: number;
            illuminationRadius?: number;
            increasedEquipTime: number;
            reducedUnequipTime: number;
            shieldCompatibility: string | number; // JSON shows "" (string) and 0 (number)
            increasedUnequipTime: number;
            reducedVerticalRecoil: number;
            increasedBulletVelocity: number;
            increasedVerticalRecoil: number;
            reducedMaxShotDispersion: number;
            reducedPerShotDispersion: number;
            reducedDurabilityBurnRate: number | null; // Can be null in JSON
            reducedRecoilRecoveryTime: number;
            increasedRecoilRecoveryTime: number;
            reducedDispersionRecoveryTime: number;
        }

        interface BaseItem {
            id: string;
            name: string;
            description: string;
            loadout_slots: Array<string>;
            icon: string;
            rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "";
            value: number;
            workbench: string | null;
            flavor_text: string | null;
            created_at: string;
            updated_at: string;
            shield_type: string | null;
            loot_area: string | null;
            sources: Array<string> | null;
            locations: Array<string>;
            components: Array<{
                quantity: number;
                component: {
                    id: string;
                    icon: string;
                    name: string;
                    rarity: string;
                    item_type: string;
                }
            }>;
            used_in: Array<{
                item: {
                    id: string;
                    icon: string;
                    name: string;
                    rarity: string;
                    item_type: string;
                    description: string;
                };
                quantity: number;
            }>;
            recycle_components: Array<{
                quantity: number;
                component: {
                    id: string;
                    icon: string;
                    name: string;
                    rarity: string;
                    item_type: string;
                    description: string;
                }
            }>;
            recycle_from: Array<{
                item: {
                    id: string;
                    icon: string;
                    name: string;
                    rarity: string;
                    item_type: string;
                    description: string;
                };
                quantity: number;
            }>;
            dropped_by: Array<{
                id: string;
                arc: {
                    id: string;
                    icon: string;
                    name: string;
                    description: string;
                };
                arc_id: string;
                created_at: string;
            }>;
            sold_by: Array<{
                price: number;
                trader_name: string;
            }>;
        }

        interface WeaponItem extends BaseItem {
            item_type: 'Weapon';
            loadout_slots: Array<'weapon'>;
            ammo_type: string;
            subcategory: string;
            stat_block: Pick<StatBlock, 
                'firingMode' | 'range' | 'damage' | 'health' | 'radius' | 'shield' |
                'weight' | 'agility' | 'arcStun' | 'healing' | 'stamina' | 'stealth' |
                'useTime' | 'duration' | 'fireRate' | 'stability' | 'stackSize' |
                'damageMult' | 'raiderStun' | 'weightLimit' | 'augmentSlots' |
                'healingSlots' | 'magazineSize' | 'reducedNoise' | 'shieldCharge' |
                'backpackSlots' | 'quickUseSlots' | 'damagePerSecond' | 'movementPenalty' |
                'safePocketSlots' | 'damageMitigation' | 'healingPerSecond' |
                'reducedEquipTime' | 'staminaPerSecond' | 'increasedADSSpeed' |
                'increasedFireRate' | 'reducedReloadTime' | 'shieldCompatibility' |
                'increasedUnequipTime' | 'reducedVerticalRecoil' |
                'increasedBulletVelocity' | 'reducedMaxShotDispersion' |
                'reducedPerShotDispersion' | 'reducedDurabilityBurnRate' |
                'reducedRecoilRecoveryTime'
            >;
            mods: Array<{
                mod: {
                    id: string;
                    icon: string;
                    name: string;
                    rarity: string;
                    item_type: string;
                }
            }>;
        }

        interface AmmunitionItem extends BaseItem {
            item_type: 'Ammunition',
            ammo_type: null | '';
            subcategory: null | '';
            loadout_slots: Array<'backpack' | 'safePocket'>;
            stat_block: Pick<StatBlock, 
                'range' | 'damage' | 'radius' | 'shield' | 'weight' | 'agility' |
                'arcStun' | 'healing' | 'stamina' | 'stealth' | 'useTime' |
                'duration' | 'fireRate' | 'stability' | 'stackSize' | 'damageMult' |
                'raiderStun' | 'weightLimit' | 'shieldCharge' | 'backpackSlots' |
                'quickUseSlots' | 'damagePerSecond' | 'movementPenalty' |
                'safePocketSlots' | 'damageMitigation' | 'healingPerSecond' |
                'reducedEquipTime' | 'staminaPerSecond' | 'increasedADSSpeed' |
                'increasedFireRate' | 'reducedReloadTime' | 'reducedUnequipTime' |
                'shieldCompatibility' | 'reducedVerticalRecoil' | 'increasedVerticalRecoil' |
                'reducedDurabilityBurnRate' | 'increasedRecoilRecoveryTime'
            >;
        }

        interface ModificationItem extends BaseItem {
            item_type: 'Modification';
            ammo_type: null | '';
            subcategory: null | '';
            loadout_slots: Array<'backpack' | 'safePocket'>;
            stat_block: Pick<StatBlock,
                'range' | 'damage' | 'health' | 'radius' | 'shield' | 'weight' |
                'agility' | 'arcStun' | 'healing' | 'stamina' | 'stealth' |
                'useTime' | 'duration' | 'fireRate' | 'stability' | 'stackSize' |
                'damageMult' | 'raiderStun' | 'weightLimit' | 'magazineSize' |
                'reducedNoise' | 'shieldCharge' | 'backpackSlots' | 'quickUseSlots' |
                'damagePerSecond' | 'movementPenalty' | 'safePocketSlots' |
                'damageMitigation' | 'healingPerSecond' | 'reducedEquipTime' |
                'staminaPerSecond' | 'increasedADSSpeed' | 'increasedFireRate' |
                'reducedReloadTime' | 'illuminationRadius' | 'increasedEquipTime' |
                'reducedUnequipTime' | 'shieldCompatibility' | 'increasedUnequipTime' |
                'reducedVerticalRecoil' | 'increasedBulletVelocity' |
                'increasedVerticalRecoil' | 'reducedMaxShotDispersion' |
                'reducedPerShotDispersion' | 'reducedDurabilityBurnRate' |
                'reducedRecoilRecoveryTime' | 'increasedRecoilRecoveryTime' |
                'reducedDispersionRecoveryTime'
            >;
        }

        interface BlueprintItem extends BaseItem {
            item_type: 'Blueprint';
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: Pick<StatBlock, 
                'range' | 'damage' | 'health' | 'radius' | 'shield' | 'weight' |
                'agility' | 'arcStun' | 'healing' | 'stamina' | 'stealth' |
                'useTime' | 'duration' | 'fireRate' | 'stability' | 'stackSize' |
                'damageMult' | 'raiderStun' | 'weightLimit' | 'augmentSlots' |
                'healingSlots' | 'magazineSize' | 'reducedNoise' | 'shieldCharge' |
                'backpackSlots' | 'quickUseSlots' | 'damagePerSecond' | 'movementPenalty' |
                'safePocketSlots' | 'damageMitigation' | 'healingPerSecond' |
                'reducedEquipTime' | 'staminaPerSecond' | 'increasedADSSpeed' |
                'increasedFireRate' | 'reducedReloadTime' | 'illuminationRadius' |
                'increasedEquipTime' | 'reducedUnequipTime' | 'shieldCompatibility' |
                'increasedUnequipTime' | 'reducedVerticalRecoil' | 'increasedBulletVelocity' |
                'increasedVerticalRecoil' | 'reducedMaxShotDispersion' |
                'reducedPerShotDispersion' | 'reducedDurabilityBurnRate' |
                'reducedRecoilRecoveryTime' | 'increasedRecoilRecoveryTime' |
                'reducedDispersionRecoveryTime'
            >;
        }

        interface QuickUseItem extends BaseItem {
            item_type: 'Quick Use';
            ammo_type: null | '';
            subcategory: null | '';
            loadout_slots: Array<'backpack' | 'quickUse' | 'safePocket'>;
            stat_block: Pick<StatBlock, 
                'range' | 'damage' | 'radius' | 'shield' | 'weight' | 'agility' |
                'arcStun' | 'healing' | 'stamina' | 'stealth' | 'useTime' |
                'duration' | 'fireRate' | 'stability' | 'stackSize' | 'damageMult' |
                'raiderStun' | 'weightLimit' | 'shieldCharge' | 'backpackSlots' |
                'quickUseSlots' | 'damagePerSecond' | 'movementPenalty' | 'safePocketSlots' |
                'damageMitigation' | 'healingPerSecond' | 'reducedEquipTime' |
                'staminaPerSecond' | 'increasedADSSpeed' | 'increasedFireRate' |
                'reducedReloadTime' | 'reducedUnequipTime' | 'shieldCompatibility' |
                'reducedVerticalRecoil' | 'increasedVerticalRecoil' | 'reducedDurabilityBurnRate' |
                'increasedRecoilRecoveryTime'
            >;
        }

        interface ConsumableItem extends BaseItem {
            item_type: 'Consumable';
            ammo_type: null | '';
            subcategory: null | '';
            loadout_slots: Array<'backpack' | 'quickUse' | 'safePocket'>;
            stat_block: Pick<StatBlock, 
                'range' | 'damage' | 'radius' | 'shield' | 'weight' | 'agility' |
                'arcStun' | 'healing' | 'stamina' | 'stealth' | 'useTime' |
                'duration' | 'fireRate' | 'stability' | 'stackSize' | 'raiderStun' |
                'damagePerSecond' | 'healingPerSecond' | 'increasedFireRate' |
                'reducedReloadTime' | 'reducedDurabilityBurnRate'
            >;
        }

        interface ThrowableItem extends BaseItem {
            item_type: 'Throwable',
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: Pick<StatBlock, 
                'range' | 'damage' | 'health' | 'radius' | 'shield' | 'weight' |
                'agility' | 'arcStun' | 'healing' | 'stamina' | 'stealth' | 'useTime' |
                'duration' | 'fireRate' | 'stability' | 'stackSize' | 'damageMult' |
                'raiderStun' | 'weightLimit' | 'augmentSlots' | 'healingSlots' |
                'magazineSize' | 'reducedNoise' | 'shieldCharge' | 'backpackSlots' |
                'quickUseSlots' | 'damagePerSecond' | 'movementPenalty' | 'safePocketSlots' |
                'damageMitigation' | 'healingPerSecond' | 'reducedEquipTime' |
                'staminaPerSecond' | 'increasedADSSpeed' | 'increasedFireRate' |
                'reducedReloadTime' | 'illuminationRadius' | 'increasedEquipTime' |
                'reducedUnequipTime' | 'shieldCompatibility' | 'increasedUnequipTime' |
                'reducedVerticalRecoil' | 'increasedBulletVelocity' |
                'increasedVerticalRecoil' | 'reducedMaxShotDispersion' |
                'reducedPerShotDispersion' | 'reducedDurabilityBurnRate' |
                'reducedRecoilRecoveryTime' | 'increasedRecoilRecoveryTime' |
                'reducedDispersionRecoveryTime'
            >;
        }

        interface TopsideMaterialItem extends BaseItem {
            item_type: 'Topside Material';
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: Pick<StatBlock, 
                'range' | 'damage' | 'health' | 'radius' | 'shield' | 'weight' |
                'agility' | 'arcStun' | 'healing' | 'stamina' | 'stealth' |
                'useTime' | 'duration' | 'fireRate' | 'stability' | 'stackSize' |
                'damageMult' | 'raiderStun' | 'weightLimit' | 'augmentSlots' |
                'healingSlots' | 'magazineSize' | 'reducedNoise' | 'shieldCharge' |
                'backpackSlots' | 'quickUseSlots' | 'damagePerSecond' | 'movementPenalty' |
                'safePocketSlots' | 'damageMitigation' | 'healingPerSecond' |
                'reducedEquipTime' | 'staminaPerSecond' | 'increasedADSSpeed' |
                'increasedFireRate' | 'reducedReloadTime' | 'illuminationRadius' |
                'increasedEquipTime' | 'reducedUnequipTime' | 'shieldCompatibility' |
                'increasedUnequipTime' | 'reducedVerticalRecoil' | 'increasedBulletVelocity' |
                'increasedVerticalRecoil' | 'reducedMaxShotDispersion' |
                'reducedPerShotDispersion' | 'reducedDurabilityBurnRate' |
                'reducedRecoilRecoveryTime' | 'increasedRecoilRecoveryTime' |
                'reducedDispersionRecoveryTime'
            >;
        }

        interface RefinedMaterialItem extends BaseItem {
            item_type: 'Refined Material';
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: Pick<StatBlock, 
                'range' | 'damage' | 'health' | 'radius' | 'shield' | 'weight' |
                'agility' | 'arcStun' | 'healing' | 'stamina' | 'stealth' | 'useTime' |
                'duration' | 'fireRate' | 'stability' | 'stackSize' | 'damageMult' |
                'raiderStun' | 'weightLimit' | 'augmentSlots' | 'healingSlots' |
                'magazineSize' | 'reducedNoise' | 'shieldCharge' | 'backpackSlots' |
                'quickUseSlots' | 'damagePerSecond' | 'movementPenalty' | 'safePocketSlots' |
                'damageMitigation' | 'healingPerSecond' | 'reducedEquipTime' |
                'staminaPerSecond' | 'increasedADSSpeed' | 'increasedFireRate' |
                'reducedReloadTime' | 'illuminationRadius' | 'increasedEquipTime' |
                'reducedUnequipTime' | 'shieldCompatibility' | 'increasedUnequipTime' |
                'reducedVerticalRecoil' | 'increasedBulletVelocity' |
                'increasedVerticalRecoil' | 'reducedMaxShotDispersion' |
                'reducedPerShotDispersion' | 'reducedDurabilityBurnRate' |
                'reducedRecoilRecoveryTime' | 'increasedRecoilRecoveryTime' |
                'reducedDispersionRecoveryTime'
            >;
        }

        interface AdvancedMaterialItem extends BaseItem {
            item_type: 'Advanced Material';
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: Pick<StatBlock, 
                'range' | 'damage' | 'health' | 'radius' | 'shield' | 'weight' |
                'agility' | 'arcStun' | 'healing' | 'stamina' | 'stealth' | 'useTime' |
                'duration' | 'fireRate' | 'stability' | 'stackSize' | 'damageMult' |
                'raiderStun' | 'weightLimit' | 'magazineSize' | 'reducedNoise' |
                'shieldCharge' | 'backpackSlots' | 'quickUseSlots' | 'damagePerSecond' |
                'movementPenalty' | 'safePocketSlots' | 'damageMitigation' |
                'healingPerSecond' | 'reducedEquipTime' | 'staminaPerSecond' |
                'increasedADSSpeed' | 'increasedFireRate' | 'reducedReloadTime' |
                'illuminationRadius' | 'increasedEquipTime' | 'reducedUnequipTime' |
                'shieldCompatibility' | 'increasedUnequipTime' | 'reducedVerticalRecoil' |
                'increasedBulletVelocity' | 'increasedVerticalRecoil' |
                'reducedMaxShotDispersion' | 'reducedPerShotDispersion' |
                'reducedDurabilityBurnRate' | 'reducedRecoilRecoveryTime' |
                'increasedRecoilRecoveryTime' | 'reducedDispersionRecoveryTime'
            >;
        }

        interface BasicMaterialItem extends BaseItem {
            item_type: 'Basic Material';
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: StatBlock;
        }

        interface RecyclableItem extends BaseItem {
            item_type: 'Recyclable';
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: Pick<StatBlock,
                'range' | 'damage' | 'health' | 'radius' | 'shield' | 'weight' |
                'agility' | 'arcStun' | 'healing' | 'stamina' | 'stealth' | 'useTime' |
                'duration' | 'fireRate' | 'stability' | 'stackSize' | 'damageMult' |
                'raiderStun' | 'weightLimit' | 'magazineSize' | 'reducedNoise' |
                'shieldCharge' | 'backpackSlots' | 'quickUseSlots' | 'damagePerSecond' |
                'movementPenalty' | 'safePocketSlots' | 'damageMitigation' |
                'healingPerSecond' | 'reducedEquipTime' | 'staminaPerSecond' |
                'increasedADSSpeed' | 'increasedFireRate' | 'reducedReloadTime' |
                'illuminationRadius' | 'increasedEquipTime' | 'reducedUnequipTime' |
                'shieldCompatibility' | 'increasedUnequipTime' | 'reducedVerticalRecoil' |
                'increasedBulletVelocity' | 'increasedVerticalRecoil' |
                'reducedMaxShotDispersion' | 'reducedPerShotDispersion' |
                'reducedDurabilityBurnRate' | 'reducedRecoilRecoveryTime' |
                'increasedRecoilRecoveryTime' | 'reducedDispersionRecoveryTime'
            >;
        }

        interface NatureItem extends BaseItem {
            item_type: 'Nature';
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: Pick<StatBlock, 
                'range' | 'damage' | 'radius' | 'shield' | 'weight' | 'agility' |
                'arcStun' | 'healing' | 'stamina' | 'stealth' | 'useTime' |
                'duration' | 'fireRate' | 'stability' | 'stackSize' | 'damageMult' |
                'raiderStun' | 'weightLimit' | 'shieldCharge' | 'backpackSlots' |
                'quickUseSlots' | 'damagePerSecond' | 'movementPenalty' | 'safePocketSlots'
                | 'damageMitigation' | 'healingPerSecond' | 'reducedEquipTime' |
                'staminaPerSecond' | 'increasedADSSpeed' | 'increasedFireRate' |
                'reducedReloadTime' | 'reducedUnequipTime' | 'shieldCompatibility' |
                'reducedVerticalRecoil' | 'increasedVerticalRecoil' | 'reducedDurabilityBurnRate' |
                'increasedRecoilRecoveryTime'
            >;
        }

        interface TrinketItem extends BaseItem {
            item_type: 'Trinket';
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: Pick<StatBlock, 
                'range' | 'damage' | 'health' | 'radius' | 'shield' | 'weight' |
                'agility' | 'arcStun' | 'healing' | 'stamina' | 'stealth' | 'useTime' |
                'duration' | 'fireRate' | 'stability' | 'stackSize' | 'damageMult' |
                'raiderStun' | 'weightLimit' | 'augmentSlots' | 'healingSlots' |
                'magazineSize' | 'reducedNoise' | 'shieldCharge' | 'backpackSlots' |
                'quickUseSlots' | 'damagePerSecond' | 'movementPenalty' |
                'safePocketSlots' | 'damageMitigation' | 'healingPerSecond' |
                'reducedEquipTime' | 'staminaPerSecond' | 'increasedADSSpeed' |
                'increasedFireRate' | 'reducedReloadTime' | 'illuminationRadius' |
                'increasedEquipTime' | 'reducedUnequipTime' | 'shieldCompatibility' |
                'increasedUnequipTime' | 'reducedVerticalRecoil' | 'increasedBulletVelocity' |
                'increasedVerticalRecoil' | 'reducedMaxShotDispersion' |
                'reducedPerShotDispersion' | 'reducedDurabilityBurnRate' |
                'reducedRecoilRecoveryTime' | 'increasedRecoilRecoveryTime' |
                'reducedDispersionRecoveryTime'
            >;
        }

        interface KeyItem extends BaseItem {
            item_type: 'Key';
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: StatBlock;
        }

        interface ShieldItem extends BaseItem {
            item_type: 'Shield';
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: StatBlock;
        }

        interface AugmentItem extends BaseItem {
            item_type: 'Augment';
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: StatBlock;
        }

        interface GadgetItem extends BaseItem {
            item_type: 'Gadget';
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: StatBlock;
        }

        interface QuestItem extends BaseItem {
            item_type: 'Quest Item';
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: StatBlock;
        }

        interface CosmeticItem extends BaseItem {
            item_type: 'Cosmetic';
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: StatBlock;
        } 

        interface MiscItem extends BaseItem {
            item_type: 'Misc';
            ammo_type: null | '';
            subcategory: null | '';
            stat_block: Pick<StatBlock,
                'range' | 'damage' | 'health' | 'radius' | 'shield' | 'weight' |
                'agility' | 'arcStun' | 'healing' | 'stamina' | 'stealth' |
                'useTime' | 'duration' | 'fireRate' | 'stability' | 'stackSize' |
                'damageMult' | 'raiderStun' | 'weightLimit' | 'augmentSlots' |
                'healingSlots' | 'magazineSize' | 'reducedNoise' | 'shieldCharge' |
                'backpackSlots' | 'quickUseSlots' | 'damagePerSecond' |
                'movementPenalty' | 'safePocketSlots' | 'damageMitigation' |
                'healingPerSecond' | 'reducedEquipTime' | 'staminaPerSecond' |
                'increasedADSSpeed' | 'increasedFireRate' | 'reducedReloadTime' |
                'illuminationRadius' | 'increasedEquipTime' | 'reducedUnequipTime' |
                'shieldCompatibility' | 'increasedUnequipTime' | 'reducedVerticalRecoil' |
                'increasedBulletVelocity' | 'increasedVerticalRecoil' | 'reducedMaxShotDispersion' |
                'reducedPerShotDispersion' | 'reducedDurabilityBurnRate' | 'reducedRecoilRecoveryTime' |
                'increasedRecoilRecoveryTime' | 'reducedDispersionRecoveryTime'
            >;
        }

        type ARCItem = WeaponItem 
            | ConsumableItem 
            | QuickUseItem 
            | ThrowableItem 
            | AmmunitionItem
            | ModificationItem 
            | BlueprintItem 
            | ShieldItem 
            | AugmentItem 
            | GadgetItem
            | KeyItem 
            | QuestItem
            | CosmeticItem
            | TopsideMaterialItem 
            | RefinedMaterialItem 
            | AdvancedMaterialItem 
            | BasicMaterialItem
            | RecyclableItem 
            | NatureItem 
            | TrinketItem 
            | MiscItem;

        interface APIResponse {
            data: Array<ARCItem>;
            maxValue: number;
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
        }
    }
}

export { };
