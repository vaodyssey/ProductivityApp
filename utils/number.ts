export const parseNumberFromString = (
  id: string | undefined,
): number | null => {
  if (!id || id.trim() === "") return null;

  const parsed = Number(id);

  if (isNaN(parsed) || !Number.isInteger(parsed) || parsed <= 0) return null;

  return parsed;
};
