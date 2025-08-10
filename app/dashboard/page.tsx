import WeatherForecast from '@/components/WeatherForecast';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6">
      <div className="mx-auto max-w-5xl">
        <WeatherForecast />
      </div>
    </div>
  );
}