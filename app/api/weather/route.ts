import { NextResponse } from 'next/server';

const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&current=temperature_2m,weather_code,is_day&timezone=Asia/Jakarta';

export const revalidate = 600;

export async function GET() {
  try {
    const response = await fetch(WEATHER_URL, {
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Weather service unavailable' },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      current: {
        temperature_2m: number;
        weather_code: number;
        is_day: number;
      };
    };

    return NextResponse.json({
      temp: data.current.temperature_2m,
      code: data.current.weather_code,
      isDay: data.current.is_day === 1,
    });
  } catch {
    return NextResponse.json(
      { error: 'Weather service unavailable' },
      { status: 502 },
    );
  }
}
