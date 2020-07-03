import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([] as Product[]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const newProducts = await AsyncStorage.getItem('@GoMarketPlace:products');

      if (newProducts) {
        setProducts(JSON.parse(newProducts));
      }
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      if (id) {
        const newProducts = products.map(product =>
          product.id === id
            ? { ...product, quantity: product.quantity + 1 }
            : product,
        );

        setProducts(newProducts);
        await AsyncStorage.setItem(
          '@GoMarketPlace:products',
          JSON.stringify(newProducts),
        );
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      if (id) {
        const productIndex = products.findIndex(product => product.id === id);

        let newProducts = [] as Product[];
        if (products[productIndex].quantity <= 1) {
          newProducts = products.filter(product => product.id !== id);
        } else {
          newProducts = products.map(product =>
            product.id === id
              ? { ...product, quantity: product.quantity - 1 }
              : product,
          );
        }

        setProducts(newProducts);
        await AsyncStorage.setItem(
          '@GoMarketPlace:products',
          JSON.stringify(newProducts),
        );
      }
    },
    [products],
  );

  const addToCart = useCallback(
    async product => {
      const productExists = products.find(p => p.id === product.id);

      let newProducts = [] as Product[];
      if (productExists) {
        newProducts = products.map(p =>
          p.id === product.id ? { ...product, quantity: p.quantity + 1 } : p,
        );
      } else {
        newProducts = [...products, { ...product, quantity: 1 }];
      }

      setProducts(newProducts);
      await AsyncStorage.setItem(
        '@GoMarketPlace:products',
        JSON.stringify(newProducts),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
