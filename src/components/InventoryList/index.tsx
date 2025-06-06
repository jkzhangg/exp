import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { Product } from '../../types/models';
import { Theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface InventoryListProps {
    products: Product[];
    onRefresh?: () => Promise<void>;
    onUpdateQuantity?: (productId: string, newQuantity: number) => Promise<void>;
    onProductSelect?: (product: Product) => void;
    refreshing?: boolean;
}

export const InventoryList: React.FC<InventoryListProps> = ({
    products,
    onRefresh,
    onUpdateQuantity,
    onProductSelect,
    refreshing = false,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const filteredProducts = products.filter((product) => {
        const query = searchQuery.toLowerCase();
        return (
            product.id.toLowerCase().includes(query) ||
            (product.name?.toLowerCase() || '').includes(query)
        );
    }).sort((a, b) => {
        const dateA = a.createdAt;
        const dateB = b.createdAt;
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const renderItem = ({ item: product }: { item: Product }) => (
        <TouchableOpacity
            style={styles.productItem}
            onPress={() => onProductSelect?.(product)}
        >
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name || '未命名商品'}</Text>
                <Text style={styles.productId}>ID: {product.id}</Text>
            </View>
            <View style={styles.quantityControl}>
                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => onUpdateQuantity?.(product.id, product.quantity - 1)}
                >
                    <Ionicons name="remove" size={16} color={Theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.quantity}>{product.quantity}</Text>
                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => onUpdateQuantity?.(product.id, product.quantity + 1)}
                >
                    <Ionicons name="add" size={16} color={Theme.colors.text} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const ListEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {searchQuery ? '没有找到匹配的商品' : '暂无商品'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Ionicons
                        name="search"
                        size={20}
                        color={Theme.colors.secondaryText}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="搜索商品..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                    <Ionicons
                        name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                        size={20}
                        color={Theme.colors.text}
                    />
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredProducts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={ListEmptyComponent}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        padding: Theme.spacing.md,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: Theme.borderRadius.md,
        marginRight: Theme.spacing.sm,
    },
    searchIcon: {
        padding: Theme.spacing.sm,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: Theme.typography.fontSize.md,
        color: Theme.colors.text,
    },
    sortButton: {
        padding: Theme.spacing.sm,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: Theme.borderRadius.md,
    },
    listContent: {
        flexGrow: 1,
    },
    productItem: {
        flexDirection: 'row',
        padding: Theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Theme.colors.background,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: Theme.typography.fontSize.md,
        fontWeight: '500',
        color: Theme.colors.text,
    },
    productId: {
        fontSize: Theme.typography.fontSize.sm,
        color: Theme.colors.secondaryText,
        marginTop: Theme.spacing.xs,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: Theme.borderRadius.md,
        padding: Theme.spacing.xs,
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Theme.colors.background,
    },
    quantity: {
        marginHorizontal: Theme.spacing.md,
        fontSize: Theme.typography.fontSize.md,
        fontWeight: '500',
        color: Theme.colors.text,
        minWidth: 30,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Theme.spacing.xl,
    },
    emptyText: {
        fontSize: Theme.typography.fontSize.md,
        color: Theme.colors.secondaryText,
    },
}); 