import { useDistrictAutocomplete } from '@/features/search-district/model/useDistrictAutocomplete';
import type { DistrictCandidate } from '@/shared/lib/districtSearch';

type Props = {
  onSelect: (candidate: DistrictCandidate) => void;
  selectedLabel?: string;
};
export function DistrictSearchBox({ onSelect, selectedLabel }: Props) {
  const {
    keyword,
    showList,
    results,
    activeIndex,
    canLoadMore,
    listRef,
    onChangeKeyword,
    onFocusInput,
    onKeyDownInput,
    onPointerMoveList,
    onMouseEnterItem,
    selectItem,
    loadMore,
  } = useDistrictAutocomplete({ onSelect, pageSize: 20 });

  const inputId = 'district-search-input';
  const activeOptionId =
    activeIndex >= 0 && results[activeIndex]
      ? `district-opt-${results[activeIndex].id}`
      : undefined;

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={inputId} className="block text-sm font-medium">
          장소 검색
        </label>

        {selectedLabel ? (
          <span className="max-w-[60%] truncate rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
            선택됨: {selectedLabel}
          </span>
        ) : null}
      </div>

      <input
        id={inputId}
        className="mt-2 w-full rounded-md border border-gray-200 px-3 py-3 text-base focus:border-gray-400 focus:outline-none md:py-2 md:text-sm"
        value={keyword}
        onChange={(e) => onChangeKeyword(e.target.value)}
        onFocus={onFocusInput}
        onKeyDown={onKeyDownInput}
        placeholder="시/군/구/동 이름을 입력하세요 (예: 관악구, 봉천동)"
        aria-expanded={showList}
        aria-autocomplete="list"
        aria-controls="district-search-list"
        aria-activedescendant={showList ? activeOptionId : undefined}
      />

      {showList && (
        <div
          id="district-search-list"
          ref={listRef}
          className="mt-3 max-h-64 overflow-auto rounded-md border border-gray-100"
          role="listbox"
          onPointerMove={onPointerMoveList}
        >
          {results.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">
              검색 결과가 없습니다.
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-100">
                {results.map((item, idx) => {
                  const active = idx === activeIndex;

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        data-idx={idx}
                        className={[
                          'w-full cursor-pointer px-3 py-3 text-left text-sm',
                          active ? 'bg-gray-50' : 'hover:bg-gray-50',
                        ].join(' ')}
                        onMouseEnter={() => onMouseEnterItem(idx)}
                        onClick={() => selectItem(item)}
                      >
                        <div className="font-medium">{item.label}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          {item.queryText}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {canLoadMore && (
                <div className="border-t border-gray-100 p-2">
                  <button
                    type="button"
                    className="w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50"
                    onClick={loadMore}
                  >
                    더 보기
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
