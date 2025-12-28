import { getFormatNumber } from "@/lib/helpers";

type TotalCardType = 'Balance' | 'Income' | 'Expense';

type TotalCardProps = {
  amount: number;
  type: TotalCardType;
};

export const TotalCard = ({ amount, type }: TotalCardProps) => {
  const isNegative = amount < 0;

  return (
    <div className='bg-white flex flex-col gap-3 py-3 px-6 rounded-md shadow-sm'>
      <span>{type}</span>
      <span className={`${isNegative && type === 'Balance' && 'text-red-500'}`}>
        ${getFormatNumber(amount)}
      </span>
    </div>
  );
};