export type SearchParams = Record<string, string | string[] | undefined>;

const toScalar = (params: SearchParams, key: string): string => {
  const value = params[key];
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
};

export const paramString = (params: SearchParams, key: string): string =>
  toScalar(params, key).trim();

export const paramPage = (params: SearchParams): number => {
  const value = Number(toScalar(params, "page"));
  return Number.isInteger(value) && value > 0 ? value : 1;
};

export const paramEnum = <T extends string>(
  params: SearchParams,
  key: string,
  allowed: readonly T[],
): T | undefined => {
  const value = toScalar(params, key);
  return (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
};

export const paramOptionalBoolean = (
  params: SearchParams,
  key: string,
  truthy: string,
  falsy: string,
): boolean | undefined => {
  const value = paramEnum(params, key, [truthy, falsy]);
  if (value === undefined) return undefined;
  return value === truthy;
};