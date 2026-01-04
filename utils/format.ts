const formatNumberParts = (value: number): { whole: string; fraction: string } => {
    const sign = value < 0 ? '-' : '';
    const fixed = Math.abs(value).toFixed(2);
    const [wholeRaw, fraction = '00'] = fixed.split('.');
    const whole = wholeRaw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return { whole: `${sign}${whole}`, fraction };
};

export const formatCurrency = (value: number): string => {
    const parts = formatNumberParts(value);
    return `${parts.whole},${parts.fraction}€`;
};

export const formatCurrencyParts = (value: number): { whole: string; fraction: string } => {
    return formatNumberParts(value);
};

export const formatCurrencyFromInput = (value: string): string => {
    const amount = Number(value);
    if (!value || Number.isNaN(amount)) {
        return formatCurrency(0);
    }
    return formatCurrency(amount);
};
