import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stats } from '../types';
import { commonStyles } from '../styles/commonStyles';
import { COLORS } from '../constants';

interface DashboardProps {
  stats: Stats;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <View>
      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Financial Summary</Text>
        
        <View style={commonStyles.statRow}>
          <Text style={commonStyles.statLabel}>Fish Spent:</Text>
          <Text style={commonStyles.statValue}>{stats.totalFishSpent.toFixed(2)}g</Text>
        </View>
        
        <View style={commonStyles.statRow}>
          <Text style={commonStyles.statLabel}>Kelp Spent:</Text>
          <Text style={commonStyles.statValue}>{stats.totalKelpSpent.toFixed(2)}g</Text>
        </View>
        
        <View style={commonStyles.statRow}>
          <Text style={commonStyles.statLabel}>Total Spent:</Text>
          <Text style={commonStyles.statValue}>
            {(stats.totalFishSpent + stats.totalKelpSpent).toFixed(2)}g
          </Text>
        </View>
        
        <View style={commonStyles.divider} />
        
        <View style={commonStyles.statRow}>
          <Text style={commonStyles.statLabel}>Earned from Sales (After Tax):</Text>
          <Text style={[commonStyles.statValue, styles.earnedText]}>
            {stats.totalEarned.toFixed(2)}g
          </Text>
        </View>
        
        <View style={commonStyles.divider} />
        
        <View style={commonStyles.statRow}>
          <Text style={[commonStyles.statLabel, styles.profitLabel]}>Net Profit:</Text>
          <Text style={[
            commonStyles.statValue,
            styles.profitValue,
            stats.netProfit >= 0 ? styles.profitPositive : styles.profitNegative
          ]}>
            {stats.netProfit >= 0 ? '+' : ''}{stats.netProfit.toFixed(2)}g
          </Text>
        </View>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Production Stats</Text>
        
        <View style={commonStyles.statRow}>
          <Text style={commonStyles.statLabel}>Potions (Fished Materials):</Text>
          <Text style={commonStyles.statValue}>{stats.potionsFromFished}</Text>
        </View>
        
        <View style={commonStyles.statRow}>
          <Text style={commonStyles.statLabel}>Potions (Bought Materials):</Text>
          <Text style={commonStyles.statValue}>{stats.potionsFromBought}</Text>
        </View>
        
        <View style={commonStyles.divider} />
        
        <View style={commonStyles.statRow}>
          <Text style={commonStyles.statLabel}>Avg Cost per Fish:</Text>
          <Text style={commonStyles.statValue}>{stats.avgCostPerFish.toFixed(2)}g</Text>
        </View>
        
        <View style={commonStyles.statRow}>
          <Text style={commonStyles.statLabel}>Avg Price per Potion (After Tax):</Text>
          <Text style={commonStyles.statValue}>{stats.avgPricePerPotion.toFixed(2)}g</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  earnedText: {
    color: COLORS.success,
  },
  profitLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profitValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profitPositive: {
    color: COLORS.success,
  },
  profitNegative: {
    color: COLORS.error,
  },
});