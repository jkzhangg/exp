import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { InventoryRecord } from '../../types/product';

interface InventoryHistoryProps {
    records: InventoryRecord[];
    productName?: (productId: string) => string;
}

export const InventoryHistory: React.FC<InventoryHistoryProps> = ({
    records,
    productName = () => '未知商品',
}) => {
    const renderItem = ({ item: record }: { item: InventoryRecord }) => (
        <View style={styles.recordItem}>
            <View style={styles.recordInfo}>
                <Text style={styles.productName}>{productName(record.productId)}</Text>
                <Text style={styles.timestamp}>
                    {new Date(record.timestamp).toLocaleString()}
                </Text>
            </View>
            <Text style={styles.quantity}>数量: {record.quantity}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>库存变动记录</Text>
            <FlatList
                data={records}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    recordItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    recordInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
    },
    timestamp: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    quantity: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 16,
    },
}); 