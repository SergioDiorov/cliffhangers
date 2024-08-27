import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ProductType {
  imgSrc: string;
  productPrice: string;
  productName: string;
  priceOpened: boolean;
  nameOpened: boolean;
}

export interface ProductsState {
  product1: ProductType;
  product2: ProductType;
  product3: ProductType;
}

interface ProductsContextProps {
  products: ProductsState;
  setProduct: (key: keyof ProductsState, value: ProductType) => void;
  resetProducts: () => void;
}

const initialProductsValues: ProductsState = {
  product1: {
    imgSrc: '',
    productPrice: '',
    productName: '',
    priceOpened: false,
    nameOpened: false,
  },
  product2: {
    imgSrc: '',
    productPrice: '',
    productName: '',
    priceOpened: false,
    nameOpened: false,
  },
  product3: {
    imgSrc: '',
    productPrice: '',
    productName: '',
    priceOpened: false,
    nameOpened: false,
  },
};

const ProductsContext = createContext<ProductsContextProps | undefined>(
  undefined,
);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<ProductsState>(
    initialProductsValues,
  );

  const setProduct = (key: keyof ProductsState, value: ProductType) => {
    setProducts((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetProducts = () => {
    setProducts(initialProductsValues);
  };

  return (
    <ProductsContext.Provider value={{ products, setProduct, resetProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = (): ProductsContextProps => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
