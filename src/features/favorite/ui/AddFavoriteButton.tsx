import { useFavoriteStore, type AddFavoriteInput } from '@/entities/favorite';

type Props = {
  input: AddFavoriteInput;
  onLimit?: () => void;
  onAdded?: () => void;
  className?: string;
};

export default function AddFavoriteButton({
  input,
  onLimit,
  onAdded,
  className,
}: Props) {
  const already = useFavoriteStore((s) =>
    s.favorites.some((f) => f.id === input.id),
  );
  const addFavorite = useFavoriteStore((s) => s.addFavorite);

  const base =
    'rounded-md px-3 py-2 text-xs font-medium transition ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

  const fallback = 'mt-3 bg-black text-white hover:bg-gray-900';

  return (
    <button
      type="button"
      className={[base, className ?? fallback].join(' ')}
      disabled={already}
      onClick={() => {
        const res = addFavorite(input);
        if (!res.ok && res.reason === 'LIMIT') {
          onLimit?.();
          return;
        }
        onAdded?.();
      }}
      aria-label={already ? '즐겨찾기 추가됨' : '즐겨찾기 추가'}
    >
      {already ? '즐겨찾기 추가됨' : '즐겨찾기 추가'}
    </button>
  );
}
