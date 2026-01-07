import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { formatCurrency } from '@/lib/helpers';
import { format } from 'date-fns';
import { ArrowDown, ArrowUp, PiggyBank } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

type CashFlowChartProps = {
  chartData: { name: string; income: number; expense: number }[];
  balance: number;
  income: number;
  expense: number;
  viewMode: string;
  selectedDate: Date;
};

export function CashFlowChart({
  chartData,
  balance,
  income,
  expense,
  viewMode,
  selectedDate,
}: CashFlowChartProps) {
  const balanceAmount = formatCurrency(balance);
  const incomeAmount = formatCurrency(income);
  const expenseAmount = formatCurrency((expense));

  const chartConfig = {
    income: { label: 'Income', color: 'var(--chart-1)' },
    expense: { label: 'Expense', color: 'var(--chart-2)' },
  } satisfies ChartConfig;

  const periodLabel =
    viewMode === 'year'
      ? selectedDate.getFullYear()
      : viewMode === 'month'
      ? format(selectedDate, 'MMMM yyyy')
      : format(selectedDate, 'MMM dd, yyyy');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chart - Cash flow</CardTitle>
        <CardDescription>
          Showing total for selected period - {periodLabel}
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-wrap gap-2'>
        {/* Balance */}
        <div className='flex-1 flex flex-col justify-center items-center gap-2 p-3 border rounded-lg'>
          <div className='flex items-center gap-2'>
            <PiggyBank />
            <span className='text-sm font-medium text-muted-foreground'>
              Balance
            </span>
          </div>
          <span
            className={`text-lg font-bold text-shadow-2xs
                ${balance > 0 && 'text-emerald-500'}
                ${balance < 0 && 'text-red-600'}
               ${balance === 0 && 'text-foreground'}`}
          >
            {balanceAmount}
          </span>
        </div>

        {/* Income */}
        <div className='flex-1 flex flex-col justify-center items-center gap-2 p-3 border rounded-lg'>
          <div className='flex items-center gap-2'>
            <ArrowUp className='text-emerald-500' />
            <span className='text-sm font-medium text-muted-foreground'>
              Income
            </span>
          </div>
          <span className='text-lg font-bold text-shadow-2xs text-emerald-500'>
            {incomeAmount}
          </span>
        </div>

        {/* Expense */}
        <div className='flex-1 flex flex-col justify-center items-center gap-2 p-3 border rounded-lg'>
          <div className='flex items-center gap-2'>
            <ArrowDown className=' text-red-500' />
            <span className='text-sm font-medium text-muted-foreground'>
              Expense
            </span>
          </div>
          <span className='text-lg font-bold text-shadow-2xs text-red-500'>
            {expenseAmount}
          </span>
        </div>
      </CardContent>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className='h-75 w-full rounded-lg border'
          >
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='name'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent indicator='dot' />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey='income' fill='var(--color-income)' radius={4} />
              <Bar dataKey='expense' fill='var(--color-expense)' radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className='h-75 flex items-center justify-center rounded-lg border border-dashed text-muted-foreground'>
            No data for selected period
          </div>
        )}
      </CardContent>
    </Card>
  );
}
