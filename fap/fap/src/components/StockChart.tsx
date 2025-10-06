import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StockPoint } from '../types';
import { commonStyles } from '../styles/commonStyles';
import { COLORS } from '../constants';

interface StockChartProps {
  stockHistory: StockPoint[];
}

export const StockChart: React.FC<StockChartProps> = ({ stockHistory }) => {
  const currentStock = stockHistory.length > 0 
    ? stockHistory[stockHistory.length - 1].potions 
    : 0;

  if (stockHistory.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.currentStockBanner}>
          <Text style={styles.currentStockLabel}>Current Stock</Text>
          <Text style={styles.currentStockValue}>0 potions</Text>
        </View>
        <Text style={styles.subtitle}>Stock Over Time</Text>
        <Text style={commonStyles.emptyText}>No stock data yet. Sell some potions!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.currentStockBanner}>
        <Text style={styles.currentStockLabel}>Current Stock</Text>
        <Text style={styles.currentStockValue}>{currentStock} potions</Text>
      </View>
      
      <Text style={styles.subtitle}>Stock Over Time</Text>
      <View style={styles.chart}>
        {stockHistory.map((point, index) => (
          <View key={index} style={styles.chartPoint}>
            <View style={styles.chartBar}>
              <View
                style={[
                  styles.chartBarFill,
                  { height: `${Math.min(point.potions * 10, 100)}%` }
                ]}
              />
            </View>
            <Text style={styles.chartLabel}>{point.potions}</Text>
            <Text style={styles.chartDate}>
              {new Date(point.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
        ))}
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
  currentStockBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  currentStockLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.background,
    marginBottom: 4,
  },
  currentStockValue: {
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
    alignItems: 'flex-end',
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
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: 4,
    fontWeight: '600',
  },
  chartDate: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});