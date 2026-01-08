import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccount, type AccountItem } from '@/context/accountContext';
import { format } from 'date-fns';
import { ChevronsUpDown } from 'lucide-react';
import type { ViewMode } from '../CashFlowPage';


type CashFlowFiltersProps = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  years: number[];
  selectedAccount: AccountItem | undefined;
  setSelectedAccount: (account: AccountItem | undefined) => void;
};

export function CashFlowFilters({
  viewMode,
  setViewMode,
  selectedDate,
  setSelectedDate,
  years,
  selectedAccount,
  setSelectedAccount,
}: CashFlowFiltersProps) {
  const { accounts } = useAccount();
  const displayDate =
    viewMode === 'year'
      ? selectedDate.getFullYear()
      : viewMode === 'month'
      ? format(selectedDate, 'MMMM yyyy')
      : format(selectedDate, 'MMM dd, yyyy');
  const displayAccount =
    selectedAccount === undefined ? 'All accounts' : selectedAccount.name;

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
        <TabsList className='border'>
          <TabsTrigger value='year'>Year</TabsTrigger>
          <TabsTrigger value='month'>Month</TabsTrigger>
          <TabsTrigger value='day'>Day</TabsTrigger>
        </TabsList>
      </Tabs>

      <Popover>
        <PopoverTrigger asChild className='bg-muted!'>
          <Button
            variant='outline'
            className='w-50 justify-between text-left font-normal'
          >
            <span>{displayDate}</span>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='end'>
          {viewMode === 'day' ? (
            <Calendar
              mode='single'
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
            />
          ) : viewMode === 'year' ? (
            <div className='grid grid-cols-3 gap-2 p-3 max-w-60'>
              {years.map((year) => (
                <Button
                  key={year}
                  variant={
                    selectedDate.getFullYear() === year ? 'default' : 'outline'
                  }
                  size='sm'
                  onClick={() =>
                    setSelectedDate(new Date(year, selectedDate.getMonth()))
                  }
                >
                  {year}
                </Button>
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-3 gap-2 p-3 max-w-70'>
              {Array.from({ length: 12 }, (_, i) => (
                <Button
                  key={i}
                  variant={
                    selectedDate.getMonth() === i ? 'default' : 'outline'
                  }
                  size='sm'
                  onClick={() =>
                    setSelectedDate(new Date(selectedDate.getFullYear(), i))
                  }
                >
                  {format(new Date(0, i), 'MMMM')}
                </Button>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild className='bg-muted!'>
          <Button
            variant='outline'
            className='w-50 justify-between text-left font-normal'
          >
            <span>{displayAccount}</span>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='end'>
          <div className='space-x-2 space-y-2 p-3 max-w-65'>
            <Button
              variant={selectedAccount === undefined ? 'default' : 'outline'}
              onClick={() => setSelectedAccount(undefined)}
            >
              All accounts
            </Button>
            {accounts.map((acc) => (
              <Button
                key={acc.id}
                variant={selectedAccount?.id === acc.id ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSelectedAccount(acc)}
              >
                {acc.name}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
