/* eslint-disable react-refresh/only-export-components */
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type React from 'react';
import { createContext, useContext } from 'react';

export interface CategoryBase {
  name: string;
}

export interface CategoryItem extends CategoryBase {
  id: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Salary' },
  { id: '2', name: 'Grocery' },
];

interface CategoryContextType {
  categories: CategoryItem[];
  addCategory: (category: CategoryBase) => void;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;
}

export const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useLocalStorage<CategoryItem[]>(
    'CATEGORIES',
    DEFAULT_CATEGORIES
  );

  const addCategory = (newCategory: CategoryBase) => {
    const category: CategoryItem = {
      id: crypto.randomUUID(), // generates unique ID
      ...newCategory,
    };

    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <CategoryContext.Provider
      value={{ categories, addCategory, updateCategory, deleteCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory(): CategoryContextType {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within CategoryProvider');
  }
  return context;
}
