import { CashFlowChartCore } from './components/CashFlowChartCore';

export default function CashFlowPage() {
  return (
    <div className='space-y-10'>
      {/* Cashflow Chart with filters */}
      <section>
        <CashFlowChartCore />
      </section>
    </div>
  );
}
