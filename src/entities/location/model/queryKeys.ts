export const locationKeys = {
  all: ['location'] as const,
  geocode: (normalizedQueryText: string) =>
    [...locationKeys.all, 'geocode', normalizedQueryText] as const,
};
