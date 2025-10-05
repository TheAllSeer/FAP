export interface Transaction {
  id: string;
  type: 'fish_purchase' | 'fish_caught' | 'kelp_purchase' | 'potion_sale';
  quantity: number;
  costPerUnit: number;
  timestamp: number;
}

export interface StockPoint {
  timestamp: number;
  potions: number;
}

export interface Stats {
  totalFishSpent: number;
  totalKelpSpent: number;
  totalEarned: number;
  netProfit: number;
  potionsFromFished: number;
  potionsFromBought: number;
  avgCostPerFish: number;
  avgPricePerPotion: number;
}

export type TabType = 'dashboard' | 'log' | 'stock';