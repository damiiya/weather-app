import { useEffect, useMemo, useRef, useState } from 'react';

import {
  searchDistricts,
  type DistrictCandidate,
} from '@/shared/lib/districtSearch';

type Props = {
  onSelect: (candidate: DistrictCandidate) => void;
  pageSize?: number;
};

export function useDistrictAutocomplete({ onSelect, pageSize = 20 }: Props) {
  const PAGE_SIZE = pageSize;

  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [visibleLimit, setVisibleLimit] = useState(PAGE_SIZE);

  const listRef = useRef<HTMLDivElement | null>(null);

  const lastInputRef = useRef<'keyboard' | 'mouse'>('keyboard');

  const pointerArmedRef = useRef(false);

  const arrowGateRef = useRef(false);
  const gateArrowOncePerFrame = () => {
    if (arrowGateRef.current) return false;
    arrowGateRef.current = true;
    requestAnimationFrame(() => {
      arrowGateRef.current = false;
    });
    return true;
  };

  const hasKeyword = keyword.trim().length > 0;
  const showList = open && hasKeyword;

  const results = useMemo(
    () => searchDistricts(keyword, visibleLimit + 1),
    [keyword, visibleLimit],
  );

  const selectItem = (item: DistrictCandidate) => {
    onSelect(item);

    setKeyword('');
    setOpen(false);
    setActiveIndex(-1);
    setVisibleLimit(PAGE_SIZE);

    lastInputRef.current = 'keyboard';
    pointerArmedRef.current = false;
  };

  const clampIndex = (idx: number) => {
    const max = results.length - 1;
    if (max < 0) return -1;
    return Math.max(0, Math.min(idx, max));
  };

  const moveActive = (next: number) => {
    const clamped = clampIndex(next);
    if (clamped === -1) return;
    setActiveIndex(clamped);
  };

  const maybeLoadMore = (nextActiveIndex: number) => {
    const canLoadMore = results.length >= visibleLimit;
    if (!canLoadMore) return;

    const threshold = 3;
    if (nextActiveIndex >= results.length - threshold) {
      setVisibleLimit((prev) => prev + PAGE_SIZE);
    }
  };

  useEffect(() => {
    if (!showList) return;
    if (activeIndex < 0) return;

    const container = listRef.current;
    const el = container?.querySelector<HTMLElement>(
      `[data-idx="${activeIndex}"]`,
    );
    if (!el) return;

    el.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, showList]);

  const onChangeKeyword = (v: string) => {
    setKeyword(v);

    const nextOpen = v.trim().length > 0;
    setOpen(nextOpen);

    setActiveIndex(-1);
    setVisibleLimit(PAGE_SIZE);

    lastInputRef.current = 'keyboard';
    pointerArmedRef.current = false;
  };

  const onFocusInput = () => {
    if (keyword.trim().length > 0) setOpen(true);
  };

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isArrow = e.key === 'ArrowDown' || e.key === 'ArrowUp';

    if (isArrow) {
      if (!gateArrowOncePerFrame()) return;

      e.preventDefault();
      e.stopPropagation();

      lastInputRef.current = 'keyboard';
      pointerArmedRef.current = false;
    }

    if (!showList) {
      if (e.key === 'ArrowDown' && results.length > 0) {
        setOpen(true);
        setActiveIndex(0);
      } else if (e.key === 'Escape') {
        setOpen(false);
        setActiveIndex(-1);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      const next = activeIndex < 0 ? 0 : activeIndex + 1;
      maybeLoadMore(next);
      moveActive(next);
    } else if (e.key === 'ArrowUp') {
      const next = activeIndex <= 0 ? 0 : activeIndex - 1;
      moveActive(next);
    } else if (e.key === 'Enter') {
      if ((e.nativeEvent as KeyboardEvent).isComposing) return;
      e.preventDefault();

      const item = activeIndex >= 0 ? results[activeIndex] : results[0];
      if (item) selectItem(item);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const onPointerMoveList = (e: React.PointerEvent<HTMLDivElement>) => {
    const moved = (e.movementX ?? 0) !== 0 || (e.movementY ?? 0) !== 0;
    if (!moved) return;

    pointerArmedRef.current = true;
    lastInputRef.current = 'mouse';
  };

  const onMouseEnterItem = (idx: number) => {
    if (!pointerArmedRef.current) return;
    if (lastInputRef.current !== 'mouse') return;
    setActiveIndex(idx);
  };

  const loadMore = () => setVisibleLimit((prev) => prev + PAGE_SIZE);
  const canLoadMore = results.length >= visibleLimit;

  return {
    keyword,
    showList,
    results,
    activeIndex,
    canLoadMore,
    listRef,

    selectItem,
    onChangeKeyword,
    onFocusInput,
    onKeyDownInput,
    onPointerMoveList,
    onMouseEnterItem,
    loadMore,
  };
}
