const currencyFormatter = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

export const formatCurrency = (value: number): string => {
    return `${currencyFormatter.format(value)}€`;
};

export const formatCurrencyParts = (value: number): { whole: string; fraction: string } => {
    const [whole, fraction] = currencyFormatter.format(value).split(',');
    return { whole, fraction: fraction ?? '00' };
};

export const formatCurrencyFromInput = (value: string): string => {
    const amount = Number(value);
    if (!value || Number.isNaN(amount)) {
        return formatCurrency(0);
    }
    return formatCurrency(amount);
};
