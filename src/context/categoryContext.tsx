import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { iconMap } from '@/lib/icons';
import { createContext, useContext } from 'react';

export interface CategoryBase {
  name: string;
  iconName: keyof typeof iconMap;
}

export interface CategoryItem extends CategoryBase {
  id: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Housing', iconName: 'House' },
  { id: '2', name: 'Food', iconName: 'Apple' },
  { id: '3', name: 'Transportation', iconName: 'Bike' },
  { id: '4', name: 'Lifestyle', iconName: 'Shirt' },
  { id: '5', name: 'Entertainment', iconName: 'Clapperboard' },
  { id: '6', name: 'Wages', iconName: 'Wallet' },
];
interface CategoryContextType {
  categories: CategoryItem[];
  addCategory: (category: CategoryBase) => void;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
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

// eslint-disable-next-line react-refresh/only-export-components
export function useCategory(): CategoryContextType {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within CategoryProvider');
  }
  return context;
}
