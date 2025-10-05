import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StockPoint } from '../types';
import { commonStyles } from '../styles/commonStyles';
import { COLORS } from '../constants';

interface StockChartProps {
  stockHistory: StockPoint[];
}

export const StockChart: React.FC<StockChartProps> = ({ stockHistory }) => {
  if (stockHistory.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={commonStyles.cardTitle}>Stock Over Time</Text>
        <Text style={commonStyles.emptyText}>No stock data yet. Sell some potions!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={commonStyles.cardTitle}>Stock Over Time</Text>
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
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 200,
    marginTop: 20,
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