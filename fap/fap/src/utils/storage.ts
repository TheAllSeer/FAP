import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, StockPoint } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: '@fap_transactions',
  STOCK_HISTORY: '@fap_stock_history',
};

export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

export const saveTransactions = async (transactions: Transaction[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

export const loadStockHistory = async (): Promise<StockPoint[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STOCK_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading stock history:', error);
    return [];
  }
};

export const saveStockHistory = async (stockHistory: StockPoint[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.STOCK_HISTORY, JSON.stringify(stockHistory));
  } catch (error) {
    console.error('Error saving stock history:', error);
  }
};

export const saveAll = async (transactions: Transaction[], stockHistory: StockPoint[]): Promise<void> => {
  await Promise.all([
    saveTransactions(transactions),
    saveStockHistory(stockHistory),
  ]);
};