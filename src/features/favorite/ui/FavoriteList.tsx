import { useFavoriteStore } from '@/entities/favorite';
import { FavoriteCard } from '@/features/favorite/ui/FavoriteCard';

export function FavoriteList() {
  const favorites = useFavoriteStore((s) => s.favorites);

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {favorites.map((f) => (
        <FavoriteCard key={f.id} item={f} />
      ))}
    </div>
  );
}
