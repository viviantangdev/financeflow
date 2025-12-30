import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

type CashFlowChartProps = {
  chartData: { name: string; income: number; expense: number }[];
};

export function CashFlowChart({ chartData }: CashFlowChartProps) {
  const chartConfig = {
    income: { label: 'Income', color: 'var(--chart-1)' },
    expense: { label: 'Expense', color: 'var(--chart-2)' },
  } satisfies ChartConfig;

  return (
    <section className='space-y-4'>
      {chartData.length > 0 ? (
        <ChartContainer config={chartConfig} className='h-75 w-full'>
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
    </section>
  );
}
