export const useAnalytics = () => {
  const trackConversion = (params: { from: string; to: string; amount: string; convertedAmount: string }) => {
    if (window.gtag) {
      window.gtag('event', 'ConvertButton', {
        event_category: 'CurrencyConverter',
        event_label: 'ConvertButton',
        currency_from: params.from,
        currency_to: params.to,
        amount: params.amount,
        converted_amount: Number(params.convertedAmount),
      });
    }
  };

  return { trackConversion };
};
