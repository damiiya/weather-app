import type { WeatherSnapShot } from '@/entities/weather/model/types';

type Props = {
  data?: WeatherSnapShot;
  emptyText?: string;
};

export function WeatherSummaryContent({
  data,
  emptyText = '해당 장소의 정보가 제공되지 않습니다.',
}: Props) {
  const hasAnyValue =
    data != null &&
    (data.temperatureNow != null ||
      data.temperatureMin != null ||
      data.temperatureMax != null);

  if (!hasAnyValue) {
    return <p className="text-sm text-gray-600">{emptyText}</p>;
  }

  return (
    <>
      <p className="text-3xl font-semibold">{data.temperatureNow ?? '-'}°</p>
      <p className="mt-2 text-sm text-gray-600">
        최저 {data.temperatureMin ?? '-'}° / 최고 {data.temperatureMax ?? '-'}°
      </p>
    </>
  );
}
