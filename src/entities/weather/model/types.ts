export type WeatherSnapShot = {
  temperatureNow: number | null;
  temperatureMin: number | null;
  temperatureMax: number | null;
};

export type HourlyTemperaturePoint = {
  time: string;
  temperature: number | null;
};

export type WeatherDetail = WeatherSnapShot & {
  hourly: HourlyTemperaturePoint[];
  timezone: string;
};
