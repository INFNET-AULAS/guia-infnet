import { getMetrics } from '@/lib/metrics';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const metrics = await getMetrics();
    return new NextResponse(metrics, {
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Erro ao obter métricas:', error);
    return new NextResponse('Erro ao obter métricas', { status: 500 });
  }
} 