'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useTransaction } from '@/context/transactionContext';
import { formatCurrency } from '@/lib/helpers';
import { ArrowDown, ArrowUp } from 'lucide-react';

export function DashboardCashflow() {
  const { balance, income, expense } = useTransaction();

  // Use absolute values for chart proportions
  const absIncome = Math.abs(income); // always positive
  const absExpense = Math.abs(expense); // convert negative to positive

  const totalFlow = absIncome + absExpense;

  const chartData = React.useMemo(() => {
    if (totalFlow === 0) {
      // Empty state: show neutral 50/50
      return [
        { name: 'income', value: 1, amount: 0 },
        { name: 'expense', value: 1, amount: 0 },
      ];
    }

    const incomePct = totalFlow > 0 ? (absIncome / totalFlow) * 100 : 0;
    const expensePct = totalFlow > 0 ? (absExpense / totalFlow) * 100 : 0;
    return [
      {
        name: 'Income',
        value: incomePct,
        amount: income,
        fill: 'var(--chart-1)',
      },
      {
        name: 'Expense',
        value: expensePct,
        amount: expense,
        fill: 'var(--chart-2)',
      },
    ];
  }, [absIncome, absExpense, income, expense, totalFlow]);

  const chartConfig = {
    value: {
      label: 'Percentage',
    },
    income: {
      label: 'Income',
      color: 'var(--chart-1)',
    },
    expense: {
      label: 'Expense',
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Income vs Expense</CardTitle>
        <CardDescription>All time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col md:flex-row md:items-center gap-6 md:gap-8 justify-center'>
          <div className='w-full md:w-3/5 lg:w-2/3 flex justify-center'>
            <ChartContainer
              config={chartConfig}
              className='aspect-square max-h-65 w-full max-w-65 mx-auto'
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelKey='name'
                      indicator='dot'
                      // Show percentage with % sign and 0 decimals
                      formatter={(value, name) => {
                        const amount = name === 'Income' ? income : expense;
                        return `${formatCurrency(amount)} (${Math.round(
                          Number(value)
                        ).toString()}%)`;
                      }}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey='value'
                  nameKey='name'
                  innerRadius={70}
                  // strokeWidth={90}
                  paddingAngle={1}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <g>
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor='middle'
                              dominantBaseline='middle'
                              className='fill-foreground text-3xl font-bold'
                            >
                              {formatCurrency(balance)}
                            </text>
                            <text
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 28}
                              textAnchor='middle'
                              className='fill-muted-foreground text-sm'
                            >
                              Net balance
                            </text>
                          </g>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
          <div
            className='w-full md:w-2/5 lg:w-1/3
      flex flex-col justify-center
      space-y-4 md:space-y-6
      text-base md:text-lg'
          >
            <div className='flex justify-between items-center gap-4'>
              <div className='flex items-center gap-2'>
            
                <ArrowUp size={20} className='text-emerald-500' />
                <span className='text-muted-foreground'>Income</span>
              </div>
              <span className='text-emerald-500 text-shadow-2xs'>{formatCurrency(income)}</span>
            </div>
            <div className='flex justify-between items-center gap-4'>
              <div className='flex items-center gap-2'>
                <ArrowDown size={20} className='text-red-500' />
                <span className='text-muted-foreground'>Expense</span>
              </div>
              <span className='text-red-500 text-shadow-2xs'>{formatCurrency(expense)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
