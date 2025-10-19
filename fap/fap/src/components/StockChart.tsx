import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../types';
import { commonStyles } from '../styles/commonStyles';
import { COLORS, AH_TAX } from '../constants';

interface StockChartProps {
  transactions: Transaction[];
}

interface ProfitPoint {
  timestamp: number;
  profit: number;
  label: string;
}

export const StockChart: React.FC<StockChartProps> = ({ transactions }) => {
  // Calculate cumulative profit over time
  const calculateProfitHistory = (): ProfitPoint[] => {
    if (transactions.length === 0) return [];

    // Sort transactions by timestamp (oldest first)
    const sortedTransactions = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
    
    const profitPoints: ProfitPoint[] = [];
    let cumulativeProfit = 0;

    sortedTransactions.forEach((tx) => {
      switch (tx.type) {
        case 'fish_purchase':
          cumulativeProfit -= tx.quantity * tx.costPerUnit;
          break;
        case 'kelp_purchase':
          cumulativeProfit -= tx.quantity * tx.costPerUnit;
          break;
        case 'potion_sale':
          const afterTax = tx.quantity * tx.costPerUnit * (1 - AH_TAX);
          cumulativeProfit += afterTax;
          break;
        case 'fish_caught':
          // Fish caught doesn't affect actual profit, just savings
          break;
      }

      profitPoints.push({
        timestamp: tx.timestamp,
        profit: cumulativeProfit,
        label: new Date(tx.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      });
    });

    return profitPoints;
  };

  const profitHistory = calculateProfitHistory();

  if (profitHistory.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.currentProfitBanner}>
          <Text style={styles.currentProfitLabel}>Current Profit</Text>
          <Text style={styles.currentProfitValue}>0.00g</Text>
        </View>
        <Text style={styles.subtitle}>Profit Over Time</Text>
        <Text style={commonStyles.emptyText}>No transactions yet. Start tracking your profits!</Text>
      </View>
    );
  }

  const currentProfit = profitHistory[profitHistory.length - 1].profit;
  const isPositive = currentProfit >= 0;

  // Get min and max for scaling the chart
  const profits = profitHistory.map(p => p.profit);
  const minProfit = Math.min(...profits, 0);
  const maxProfit = Math.max(...profits, 0);
  const profitRange = maxProfit - minProfit;

  // Take up to last 10 points for display
  const displayPoints = profitHistory.slice(-10);

  return (
    <View style={styles.container}>
      <View style={[
        styles.currentProfitBanner,
        isPositive ? styles.profitPositive : styles.profitNegative
      ]}>
        <Text style={styles.currentProfitLabel}>Current Profit</Text>
        <Text style={styles.currentProfitValue}>
          {isPositive ? '+' : ''}{currentProfit.toFixed(2)}g
        </Text>
      </View>
      
      <Text style={styles.subtitle}>Profit Over Time</Text>
      <View style={styles.chart}>
        {displayPoints.map((point, index) => {
          // Calculate bar height as percentage
          let barHeight = 50; // Default to middle
          
          if (profitRange !== 0) {
            const normalizedValue = ((point.profit - minProfit) / profitRange) * 100;
            barHeight = Math.max(5, Math.min(95, normalizedValue));
          }

          const isPointPositive = point.profit >= 0;

          return (
            <View key={index} style={styles.chartPoint}>
              <View style={styles.chartBar}>
                <View style={styles.zeroLine} />
                <View
                  style={[
                    styles.chartBarFill,
                    isPointPositive ? styles.chartBarPositive : styles.chartBarNegative,
                    { height: `${barHeight}%` }
                  ]}
                />
              </View>
              <Text style={[
                styles.chartLabel,
                isPointPositive ? styles.chartLabelPositive : styles.chartLabelNegative
              ]}>
                {point.profit >= 0 ? '+' : ''}{point.profit.toFixed(0)}
              </Text>
              <Text style={styles.chartDate}>{point.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  currentProfitBanner: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  profitPositive: {
    backgroundColor: COLORS.success,
  },
  profitNegative: {
    backgroundColor: COLORS.error,
  },
  currentProfitLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.background,
    marginBottom: 4,
  },
  currentProfitValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 200,
    marginTop: 12,
  },
  chartPoint: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 30,
    height: 150,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
  },
  zeroLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.textMuted,
    opacity: 0.5,
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 4,
  },
  chartBarPositive: {
    backgroundColor: COLORS.success,
  },
  chartBarNegative: {
    backgroundColor: COLORS.error,
  },
  chartLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  chartLabelPositive: {
    color: COLORS.success,
  },
  chartLabelNegative: {
    color: COLORS.error,
  },
  chartDate: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});