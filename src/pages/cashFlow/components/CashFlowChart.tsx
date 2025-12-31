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
import { format } from 'date-fns';
import { TrendingDown, TrendingUp, TrendingUpDown } from 'lucide-react';
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
        <div className='py-3 grid grid-cols-3'>
          {/* Balance */}
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <TrendingUpDown className='h-4 w-4 text-emerald-500' />
              <span className='text-sm font-medium text-muted-foreground'>
                Balance
              </span>
            </div>
            <span
              className={`text-3xl font-bold
                ${balance > 0 && 'text-emerald-600'}
                ${balance < 0 && 'text-red-600'}
               ${balance === 0 && 'text-foreground'}`}
            >
              {balance === 0
                ? '$0'
                : balance > 0
                ? `+$${balance}`
                : `-$${Math.abs(balance)}`}
            </span>
          </div>
          {/* Income */}
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <TrendingUp className='h-4 w-4 text-emerald-500' />
              <span className='text-sm font-medium text-muted-foreground'>
                Income
              </span>
            </div>
            <span className='text-3xl font-bold'>${income}</span>
          </div>

          {/* Expense */}
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <TrendingDown className='h-4 w-4 text-red-500' />
              <span className='text-sm font-medium text-muted-foreground'>
                Expense
              </span>
            </div>
            <span className='text-3xl font-bold'>${expense}</span>
          </div>
        </div>
      </CardHeader>
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
