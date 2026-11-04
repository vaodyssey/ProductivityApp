export const formatId = (
  prefix: string,
  digits: number,
  value: number,
): string => {
  return `${prefix}_${String(value).padStart(digits, "0")}`;
};

export const bumpId = (id: string): string => {
  const match = id.match(/^([A-Za-z]+)_(\d+)$/);
  if (!match) throw new Error(`Invalid id format: ${id}`);

  const [, prefix, digits] = match;
  const next = parseInt(digits, 10) + 1;

  return `${prefix}_${String(next).padStart(digits.length, "0")}`;
};
