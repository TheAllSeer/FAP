import { Transaction, Stats } from '../types';
import { RECIPE, AH_TAX } from '../constants';

export const calculateStats = (transactions: Transaction[]): Stats => {
  let totalFishSpent = 0;
  let totalKelpSpent = 0;
  let totalEarned = 0;
  let totalFishBought = 0;
  let totalFishCaught = 0;
  let totalFishCost = 0;
  let totalPotionsSold = 0;
  let totalPotionRevenue = 0;

  transactions.forEach(tx => {
    switch (tx.type) {
      case 'fish_purchase':
        totalFishSpent += tx.quantity * tx.costPerUnit;
        totalFishBought += tx.quantity;
        totalFishCost += tx.quantity * tx.costPerUnit;
        break;
      case 'fish_caught':
        totalFishCaught += tx.quantity;
        totalFishCost += tx.quantity * tx.costPerUnit;
        break;
      case 'kelp_purchase':
        totalKelpSpent += tx.quantity * tx.costPerUnit;
        break;
      case 'potion_sale':
        const afterTax = tx.quantity * tx.costPerUnit * (1 - AH_TAX);
        totalEarned += afterTax;
        totalPotionsSold += tx.quantity;
        totalPotionRevenue += tx.quantity * tx.costPerUnit;
        break;
    }
  });

  const totalFish = totalFishBought + totalFishCaught;
  const potionsFromFished = Math.floor(totalFishCaught / RECIPE.fishPerPotion);
  const potionsFromBought = Math.floor(totalFishBought / RECIPE.fishPerPotion);

  return {
    totalFishSpent,
    totalKelpSpent,
    totalEarned,
    netProfit: totalEarned - totalFishSpent - totalKelpSpent,
    potionsFromFished,
    potionsFromBought,
    avgCostPerFish: totalFish > 0 ? totalFishCost / totalFish : 0,
    avgPricePerPotion: totalPotionsSold > 0 ? (totalPotionRevenue * (1 - AH_TAX)) / totalPotionsSold : 0,
  };
};