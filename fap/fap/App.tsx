import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Transaction, StockPoint, TabType } from './src/types';
import { COLORS } from './src/constants';
import { loadTransactions, loadStockHistory, saveAll } from './src/utils/storage';
import { calculateStats } from './src/utils/calculations';
import { Dashboard } from './src/components/Dashboard';
import { TransactionList } from './src/components/TransactionList';
import { StockChart } from './src/components/StockChart';
import { AddTransactionModal } from './src/components/AddTransactionModal';
import { EditTransactionModal } from './src/components/EditTransactionModal';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stockHistory, setStockHistory] = useState<StockPoint[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    loadData();

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const loadData = async () => {
    const txData = await loadTransactions();
    const stockData = await loadStockHistory();
    setTransactions(txData);
    setStockHistory(stockData);
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };

    const newTransactions = [newTransaction, ...transactions];
    let newStock = [...stockHistory];

    if (transaction.type === 'potion_sale') {
      const currentStock = newStock.length > 0 ? newStock[newStock.length - 1].potions : 0;
      newStock.push({
        timestamp: transaction.timestamp,
        potions: Math.max(0, currentStock - transaction.quantity),
      });
    }

    setTransactions(newTransactions);
    setStockHistory(newStock);
    saveAll(newTransactions, newStock);
  };

  const handleEditTransaction = (updatedTransaction: Transaction) => {
    const newTransactions = transactions.map(tx =>
      tx.id === updatedTransaction.id ? updatedTransaction : tx
    );
    setTransactions(newTransactions);
    saveAll(newTransactions, stockHistory);
    setEditModalVisible(false);
    setSelectedTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newTransactions = transactions.filter(tx => tx.id !== id);
            setTransactions(newTransactions);
            saveAll(newTransactions, stockHistory);
            setEditModalVisible(false);
            setSelectedTransaction(null);
          },
        },
      ]
    );
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditModalVisible(true);
  };

  const stats = calculateStats(transactions);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>WoW AH Tracker</Text>
        <Text style={styles.headerSubtitle}>Free Action Potions</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, currentTab === 'dashboard' && styles.tabActive]}
          onPress={() => setCurrentTab('dashboard')}
        >
          <Text style={[styles.tabText, currentTab === 'dashboard' && styles.tabTextActive]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentTab === 'log' && styles.tabActive]}
          onPress={() => setCurrentTab('log')}
        >
          <Text style={[styles.tabText, currentTab === 'log' && styles.tabTextActive]}>
            Transactions
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          keyboardHeight > 0 && { paddingBottom: keyboardHeight }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {currentTab === 'dashboard' && (
          <>
            <StockChart stockHistory={stockHistory} />
            <Dashboard stats={stats} />
          </>
        )}
        {currentTab === 'log' && (
          <TransactionList
            transactions={transactions}
            onTransactionPress={handleTransactionPress}
          />
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTransaction}
      />

      {selectedTransaction && (
        <EditTransactionModal
          visible={editModalVisible}
          transaction={selectedTransaction}
          onClose={() => {
            setEditModalVisible(false);
            setSelectedTransaction(null);
          }}
          onSave={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.card,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 55,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 32,
    color: COLORS.background,
    fontWeight: 'bold',
  },
});