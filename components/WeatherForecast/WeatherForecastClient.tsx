'use client';

import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WeatherForecastClient({ data }: Props) {
  const router = useRouter();
  const [unit, setUnit] = useState<Unit>('C');

  const formatted = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        dateLabel: new Intl.DateTimeFormat(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }).format(new Date(d.date)),
      })),
    [data]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-white">Weather Forecast</h2>

        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-xl border border-gray-700">
            <button
              type="button"
              onClick={() => setUnit('C')}
              className={`px-4 py-2 text-sm ${
                unit === 'C' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => setUnit('F')}
              className={`px-4 py-2 text-sm ${
                unit === 'F' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300'
              }`}
            >
              °F
            </button>
          </div>

          <button
            type="button"
            onClick={() => router.refresh()} 
            className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-200 hover:bg-gray-750"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {formatted.map((d, i) => {
          const temp = unit === 'C' ? d.temperatureC : d.temperatureF;
          const unitLabel = unit === 'C' ? '°C' : '°F';
          const moodColor =
            d.summary === 'Freezing'
              ? 'text-cyan-300'
              : d.summary === 'Cool'
              ? 'text-blue-300'
              : d.summary === 'Warm'
              ? 'text-yellow-300'
              : d.summary === 'Balmy'
              ? 'text-emerald-300'
              : 'text-gray-300';

          return (
            <div
              key={i}
              className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl transition hover:shadow-indigo-600/20"
            >
              <div className="mb-2 text-sm text-gray-400">{d.dateLabel}</div>
              <div className="mb-1 text-3xl font-bold text-white">
                {temp}
                <span className="ml-1 text-xl text-gray-300">{unitLabel}</span>
              </div>
              <div className={`text-sm ${moodColor}`}>{d.summary}</div>
            </div>
          );
        })}
      </div>

     
      {formatted.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr className="bg-gray-850">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Temperature (°C)
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Temperature (°F)
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Summary
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {formatted.map((d, i) => (
                <tr key={i} className="hover:bg-gray-850/50">
                  <td className="px-4 py-3 text-sm text-gray-200">{d.dateLabel}</td>
                  <td className="px-4 py-3 text-sm text-gray-200">{d.temperatureC} °C</td>
                  <td className="px-4 py-3 text-sm text-gray-200">{d.temperatureF} °F</td>
                  <td className="px-4 py-3 text-sm text-gray-200">{d.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
