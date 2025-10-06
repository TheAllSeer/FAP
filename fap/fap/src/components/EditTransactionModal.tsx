import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { Transaction } from '../types';
import { AH_TAX, COLORS } from '../constants';

interface EditTransactionModalProps {
  visible: boolean;
  transaction: Transaction;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  visible,
  transaction,
  onClose,
  onSave,
  onDelete,
}) => {
  const [transactionType, setTransactionType] = useState<Transaction['type']>(transaction.type);
  const [quantity, setQuantity] = useState(transaction.quantity.toString());
  const [costPerUnit, setCostPerUnit] = useState(transaction.costPerUnit.toString());
  const [transactionDate, setTransactionDate] = useState(new Date(transaction.timestamp));
  const [dateInput, setDateInput] = useState('');

  useEffect(() => {
    if (visible) {
      setTransactionType(transaction.type);
      setQuantity(transaction.quantity.toString());
      setCostPerUnit(transaction.costPerUnit.toString());
      const date = new Date(transaction.timestamp);
      setTransactionDate(date);
      setDateInput(formatDateForInput(date));
    }
  }, [visible, transaction]);

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (text: string) => {
    setDateInput(text);
    
    const parts = text.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const day = parseInt(parts[2]);
      
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const newDate = new Date(year, month, day);
        if (newDate.toString() !== 'Invalid Date') {
          setTransactionDate(newDate);
        }
      }
    }
  };

  const handleSave = () => {
    const qty = parseInt(quantity);
    const cost = parseFloat(costPerUnit);

    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    if (isNaN(cost) || cost < 0) {
      Alert.alert('Error', 'Please enter a valid cost/price');
      return;
    }

    onSave({
      ...transaction,
      type: transactionType,
      quantity: qty,
      costPerUnit: cost,
      timestamp: transactionDate.getTime(),
    });
  };

  const handleDelete = () => {
    onDelete(transaction.id);
  };

  const qty = parseInt(quantity) || 0;
  const cost = parseFloat(costPerUnit) || 0;
  const projectedTotal = qty * cost;
  const projectedAfterTax = transactionType === 'potion_sale' 
    ? projectedTotal * (1 - AH_TAX)
    : projectedTotal;

  const showProjection = qty > 0 && cost > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Transaction</Text>

          <Text style={styles.inputLabel}>Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                transactionType === 'fish_purchase' && styles.typeButtonActive
              ]}
              onPress={() => setTransactionType('fish_purchase')}
            >
              <Text style={styles.typeButtonText}>🟠 Buy Fish</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                transactionType === 'fish_caught' && styles.typeButtonActive
              ]}
              onPress={() => setTransactionType('fish_caught')}
            >
              <Text style={styles.typeButtonText}>🎣 Caught</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                transactionType === 'kelp_purchase' && styles.typeButtonActive
              ]}
              onPress={() => setTransactionType('kelp_purchase')}
            >
              <Text style={styles.typeButtonText}>🌿 Buy Kelp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                transactionType === 'potion_sale' && styles.typeButtonActive
              ]}
              onPress={() => setTransactionType('potion_sale')}
            >
              <Text style={styles.typeButtonText}>💰 Sell Potion</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={COLORS.textMuted}
            value={dateInput}
            onChangeText={handleDateChange}
          />

          <Text style={styles.inputLabel}>Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter quantity"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <Text style={styles.inputLabel}>
            {transactionType === 'potion_sale' ? 'Price per Unit (g)' : 'Cost per Unit (g)'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter cost/price"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
            value={costPerUnit}
            onChangeText={setCostPerUnit}
          />

          {showProjection && (
            <View style={styles.projectionContainer}>
              <View style={styles.projectionRow}>
                <Text style={styles.projectionLabel}>Total before tax:</Text>
                <Text style={styles.projectionValue}>{projectedTotal.toFixed(2)}g</Text>
              </View>
              
              {transactionType === 'potion_sale' && (
                <>
                  <View style={styles.projectionRow}>
                    <Text style={styles.projectionLabel}>AH Tax (5%):</Text>
                    <Text style={styles.taxValue}>-{(projectedTotal * AH_TAX).toFixed(2)}g</Text>
                  </View>
                  <View style={[styles.projectionRow, styles.projectionFinal]}>
                    <Text style={styles.projectionLabelFinal}>You receive:</Text>
                    <Text style={styles.projectionValueFinal}>
                      {projectedAfterTax.toFixed(2)}g
                    </Text>
                  </View>
                </>
              )}

              {transactionType !== 'potion_sale' && transactionType !== 'fish_caught' && (
                <View style={[styles.projectionRow, styles.projectionFinal]}>
                  <Text style={styles.projectionLabelFinal}>Total cost:</Text>
                  <Text style={styles.projectionValueFinal}>
                    {projectedTotal.toFixed(2)}g
                  </Text>
                </View>
              )}

              {transactionType === 'fish_caught' && (
                <View style={[styles.projectionRow, styles.projectionFinal]}>
                  <Text style={styles.projectionLabelFinal}>Total saved:</Text>
                  <Text style={styles.projectionValueFinal}>
                    {projectedTotal.toFixed(2)}g
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    backgroundColor: COLORS.border,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  projectionContainer: {
    marginTop: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  projectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  projectionLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  projectionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  taxValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.error,
  },
  projectionFinal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  projectionLabelFinal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  projectionValueFinal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  deleteButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});