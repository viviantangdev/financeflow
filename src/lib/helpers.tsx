export const formatCurrency = (
  amount: number,
  options: { compact?: boolean } = {}
): string => {
  const { compact = true } = options;

  if (amount > 0) return `+$${compact ? formatCompactNumber(amount) : amount}`;
  if (amount < 0) return `-$${compact ? formatCompactNumber(Math.abs(amount)): Math.abs(amount)}`;
  return `$${amount}`;
};

export const formatCompactNumber = (value: number): string => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1_000_000_000) {
    return (
      sign + (absValue / 1_000_000_000).toFixed(2).replace(/\.0$/, '') + 'B'
    );
  }
  if (absValue >= 1_000_000) {
    return sign + (absValue / 1_000_000).toFixed(2).replace(/\.0$/, '') + 'M';
  }
  if (absValue >= 1_000) {
    return sign + (absValue / 1_000).toFixed(2).replace(/\.0$/, '') + 'K';
  }
  return sign + absValue.toString();
};
