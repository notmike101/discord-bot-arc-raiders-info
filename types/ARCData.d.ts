declare global {
  namespace ARCData {
    interface MultiLanguageString {
      readonly en?: string;
      readonly de?: string;
      readonly fr?: string;
      readonly es?: string;
      readonly pt?: string;
      readonly pl?: string;
      readonly no?: string;
      readonly da?: string;
      readonly it?: string;
      readonly ru?: string;
      readonly ja?: string;
      readonly "zh-TW"?: string;
      readonly uk?: string;
      readonly "zh-CN"?: string;
      readonly kr?: string;
      readonly hr?: string;
      readonly sr?: string;
    }

    interface Item {
      readonly id: string;
      readonly name: MultiLanguageString;
      readonly description: MultiLanguageString;
      readonly type: string;
      readonly value: number;
      readonly rarity: string;
      readonly recyclesInto: Record<string, number>;
      readonly weightKg: number;
      readonly stackSize: number;
      readonly effects?: Record<string, MultiLanguageString>;
      readonly imageFilename: string;
      readonly updatedAt: string;
      readonly recipe: Record<string, number>;
      readonly craftBench: string;
      readonly salvagesInto?: Record<string, number>;
      readonly foundIn?: string;
    }

    interface Weapon {
      readonly id: string;
      readonly name: MultiLanguageString;
      readonly description: MultiLanguageString;
      readonly type: string;
      readonly value: number;
      readonly rarity: string;
      readonly effects: Record<string, MultiLanguageString>;
      readonly weightKg: number;
      readonly upgradeCost: Record<string, number>;
      readonly recyclesInto: Record<string, number>;
      readonly salvagesInto: Record<string, number>;
      readonly imageFilename: string;
      readonly updatedAt: string;
      readonly isWeapon: true,
      readonly repairMaterials: Record<string, number | null>;
      readonly craftBench?: Array<string> | string;
    }
  }
}

export {};
