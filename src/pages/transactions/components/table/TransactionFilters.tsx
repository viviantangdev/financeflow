import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCategory } from '@/context/categoryContext';
import type { TransactionItem } from '@/context/transactionContext';
import { cn } from '@/lib/utils';
import type { Table } from '@tanstack/react-table';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

type TransactionFiltersProps = {
  table: Table<TransactionItem>;
};

export function TransactionFilters({ table }: TransactionFiltersProps) {
  const [typeFilter, setTypeFilter] = useState<'All' | 'Income' | 'Expense'>(
    'All'
  );
  const { categories } = useCategory();

  const hasActiveFilters =
    !!table.getState().globalFilter ||
    table.getState().columnFilters.length > 0 ||
    typeFilter !== 'All';

  const handleTypeChange = (value: string) => {
    const newValue = value as 'All' | 'Income' | 'Expense';
    setTypeFilter(newValue);

    if (newValue === 'All') {
      table.getColumn('type')?.setFilterValue(undefined);
    } else {
      table.getColumn('type')?.setFilterValue(newValue);
    }
  };

  const categoryColumn = table.getColumn('category');
  const selectedCategoryValues = new Set(
    categoryColumn?.getFilterValue() as string[]
  );

  const handleClearFilters = () => {
    table.resetColumnFilters();
    table.resetGlobalFilter();
    table.getColumn('type')?.setFilterValue(undefined);
    setTypeFilter('All');
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6'>
      {/* Search */}
      <Input
        placeholder='Search description...'
        value={
          (table.getColumn('description')?.getFilterValue() as string) ?? ''
        }
        onChange={(event) =>
          table.getColumn('description')?.setFilterValue(event.target.value)
        }
        className='max-w-full bg-primary-foreground'
      />

      {/* Type Tabs */}
      <Tabs value={typeFilter} onValueChange={handleTypeChange}>
        <TabsList className='w-full border'>
          <TabsTrigger value='All' className='flex-1'>
            All
          </TabsTrigger>
          <TabsTrigger value='Income' className='flex-1'>
            Income
          </TabsTrigger>
          <TabsTrigger value='Expense' className='flex-1'>
            Expense
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Category Popover Filter */}
      <div className='min-w-50 '>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' size='default' className='justify-between'>
              <span>Category</span>
              {selectedCategoryValues.size > 0 && (
                <Badge variant='secondary' className='px-1 ml-2'>
                  {selectedCategoryValues.size}
                </Badge>
              )}
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-50 p-0' align='start' >
            <Command>
              <CommandInput placeholder='Filter categories...' />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  {categories.map((category) => {
                    const isSelected = selectedCategoryValues.has(category.id);
                    return (
                      <CommandItem
                        key={category.id}
                        onSelect={() => {
                          if (isSelected) {
                            selectedCategoryValues.delete(category.id);
                          } else {
                            selectedCategoryValues.add(category.id);
                          }
                          const filterValues = Array.from(selectedCategoryValues);
                          categoryColumn?.setFilterValue(
                            filterValues.length ? filterValues : undefined
                          );
                        }}
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50'
                          )}
                        >
                          {isSelected && <Check className='h-4 w-4' />}
                        </div>
                        <span>{category.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Clear Button */}
      {hasActiveFilters && (
        <Button variant='ghost' onClick={handleClearFilters} size='sm'>
          Clear filters
        </Button>
      )}
    </div>
  );
}
