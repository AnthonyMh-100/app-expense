export const hasNumbers = (value: string): boolean => {
  return value.split("").some((character) => !isNaN(Number(character)));
};

export const isOnlyNumbers = (value: string): boolean => {
  return value.split("").every((character) => !isNaN(Number(character)));
};

export const isValidEmail = (value: string): boolean => {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return EMAIL_REGEX.test(value);
};

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);
