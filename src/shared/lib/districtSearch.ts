import rawDistricts from '@/shared/assets/korea_districts.json';

export type DistrictCandidate = {
  id: string;
  label: string;
  queryText: string;
};

type DistrictIndexItem = DistrictCandidate & {
  searchable: string;
};

const districts = rawDistricts as string[];

const normalize = (s: string) =>
  s.trim().toLowerCase().replace(/\s+/g, '').replace(/-/g, '');

export const districtIndex: DistrictIndexItem[] = districts.map((path) => {
  const parts = path.split('-').filter(Boolean);
  const label = parts.join(' > ');
  const queryText = parts.join(' ');
  return {
    id: path,
    label,
    queryText,
    searchable: normalize(parts.join('')),
  };
});

export function searchDistricts(
  keyword: string,
  limit = 30,
): DistrictCandidate[] {
  const q = normalize(keyword);
  if (!q) return [];

  return districtIndex
    .filter((item) => item.searchable.includes(q))
    .sort((a, b) => a.searchable.length - b.searchable.length)
    .slice(0, limit)
    .map(({ id, label, queryText }) => ({ id, label, queryText }));
}
