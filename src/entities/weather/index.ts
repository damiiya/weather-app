export type { WeatherDetail, WeatherSnapShot } from './model/types';
export {
  useWeatherSummaryByCoordsQuery,
  useWeatherDetailByCoordsQuery,
  usePrefetchWeatherDetailByCoords,
} from './model/queries';
export { WeatherSummaryContent } from './ui/WeatherSummaryContent';
