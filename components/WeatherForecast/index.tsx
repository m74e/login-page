// components/WeatherForecast/index.tsx  (SERVER COMPONENT — no "use client")
import { cookies } from 'next/headers';
import WeatherForecastClient from './WeatherForecastClient';



async function getForecast(): Promise<Forecast[]> {
  const cookieStore = await cookies();              
  const token = cookieStore.get('accessToken')?.value;

  const base = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/api\/?$/i, '');

  const res = await fetch(`${base}/WeatherForecast`, {
    cache: 'no-store',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    throw new Error(`Failed to load forecast (${res.status})`);
  }

  return res.json();
}

export default async function WeatherForecast() {
  const data = await getForecast();
  return <WeatherForecastClient data={data} />;
}
