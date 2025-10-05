import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Transaction } from '../types';
import { commonStyles } from '../styles/commonStyles';
import { COLORS, AH_TAX } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const getTransactionIcon = (type: Transaction['type']): string => {
  switch (type) {
    case 'fish_purchase': return '🐟 Fish Purchase';
    case 'fish_caught': return '🎣 Fish Caught';
    case 'kelp_purchase': return '🌿 Kelp Purchase';
    case 'potion_sale': return '💰 Potion Sale';
  }
};

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return <Text style={commonStyles.emptyText}>No transactions yet. Add one to get started!</Text>;
  }

  return (
    <View>
      {transactions.map(tx => {
        const total = tx.quantity * tx.costPerUnit;
        const displayTotal = tx.type === 'potion_sale' ? total * (1 - AH_TAX) : total;
        
        return (
          <TouchableOpacity
            key={tx.id}
            style={styles.transactionCard}
            onLongPress={() => onDelete(tx.id)}
          >
            <View style={styles.transactionHeader}>
              <Text style={styles.transactionType}>
                {getTransactionIcon(tx.type)}
              </Text>
              <Text style={styles.transactionDate}>
                {new Date(tx.timestamp).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionQuantity}>Qty: {tx.quantity}</Text>
              <Text style={styles.transactionCost}>
                {tx.costPerUnit.toFixed(2)}g each
              </Text>
              <Text style={styles.transactionTotal}>
                Total: {displayTotal.toFixed(2)}g
                {tx.type === 'potion_sale' && ' (after tax)'}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  transactionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionQuantity: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  transactionCost: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  transactionTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});