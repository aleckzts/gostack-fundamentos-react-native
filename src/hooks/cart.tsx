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
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      console.log('increment', id);

      if (id) {
        const findProductIndex = products.findIndex(
          product => product.id === id,
        );
        if (findProductIndex) {
          const newProducts = [...products];
          newProducts[findProductIndex].quantity += 1;
          setProducts(newProducts);
        }
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      console.log('decrement', id);

      if (id) {
        const findProductIndex = products.findIndex(
          product => product.id === id,
        );
        if (findProductIndex) {
          const newProducts = [...products];
          if (newProducts[findProductIndex].quantity <= 1) {
            newProducts.splice(findProductIndex, 1);
          } else {
            newProducts[findProductIndex].quantity -= 1;
          }

          setProducts(newProducts);
        }
      }
    },
    [products],
  );

  // const addToCart = useCallback(async product => {
  const addToCart = useCallback(
    async (item: Omit<Product, 'quantity'>) => {
      // TODO ADD A NEW ITEM TO THE CART
      console.log(products, item);
      if (item) {
        const findProductIndex = products.findIndex(
          product => product.id === item.id,
        );
        console.log(findProductIndex);

        if (findProductIndex < 0) {
          console.log('new product');
          const newProduct = {
            ...item,
            quantity: 1,
          } as Product;
          setProducts([...products, newProduct]);
        } else {
          console.log('already existing product');
          increment(item.id);
        }
      }
    },
    [products, increment],
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
