"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface CartItem {
    id: number;
    title: string;
    price: number;
    regularPrice: number;
    unit: string;
    sellerName: string;
    isVerified: boolean;
    imageUrl: string;
    productType: string;
    transportIncluded: boolean;
    quantity: number;
    stockAvailable: number;
}

interface CartContextType {
    items: CartItem[];
    itemCount: number;
    subtotal: number;
    deliveryCharge: number;
    discount: number;
    total: number;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    clearCart: () => void;
    applyPromoCode: (code: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [discount, setDiscount] = useState(0);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const deliveryCharge = subtotal > 0 ? (subtotal >= 5000 ? 0 : 100) : 0;

    const total = subtotal + deliveryCharge - discount;

    const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === newItem.id);

            if (existingItem) {
                // Update quantity if item already exists
                return currentItems.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: Math.min(item.quantity + 1, item.stockAvailable) }
                        : item
                );
            }

            // Add new item with quantity 1
            return [...currentItems, { ...newItem, quantity: 1 }];
        });
    }, []);

    const removeItem = useCallback((itemId: number) => {
        setItems(currentItems => currentItems.filter(item => item.id !== itemId));
    }, []);

    const updateQuantity = useCallback((itemId: number, quantity: number) => {
        setItems(currentItems =>
            currentItems.map(item =>
                item.id === itemId
                    ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stockAvailable)) }
                    : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        setDiscount(0);
    }, []);

    const applyPromoCode = useCallback((code: string) => {
        // Simple promo code logic (can be extended)
        const validCodes: Record<string, number> = {
            'KRISHI10': 100,
            'SAVE50': 50,
            'WELCOME': 150,
        };

        const discountAmount = validCodes[code.toUpperCase()];

        if (discountAmount) {
            setDiscount(discountAmount);
            return true;
        }

        return false;
    }, []);

    return (
        <CartContext.Provider
            value={{
                items,
                itemCount,
                subtotal,
                deliveryCharge,
                discount,
                total,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                applyPromoCode,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
}
