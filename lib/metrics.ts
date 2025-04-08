import { Registry, Counter, Histogram, Gauge } from 'prom-client';

// Criar um registro para as métricas
const register = new Registry();

// Adicionar métricas padrão do Node.js
register.setDefaultLabels({
  app: 'guia-infnet'
});

// Criar um contador para requisições HTTP
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP',
  labelNames: ['method', 'path', 'status'],
  registers: [register]
});

// Criar um histograma para o tempo de resposta
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'path'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register]
});

// Métricas de memória
const memoryUsage = new Gauge({
  name: 'node_memory_usage_bytes',
  help: 'Uso de memória do processo Node.js',
  labelNames: ['type'],
  registers: [register]
});

// Métricas de CPU
const cpuUsage = new Gauge({
  name: 'node_cpu_usage_percent',
  help: 'Uso de CPU do processo Node.js',
  registers: [register]
});

// Métricas de conexões ativas
const activeConnections = new Gauge({
  name: 'node_active_connections',
  help: 'Número de conexões ativas',
  registers: [register]
});

// Métricas de erros
const errorCounter = new Counter({
  name: 'node_errors_total',
  help: 'Total de erros na aplicação',
  labelNames: ['type', 'component'],
  registers: [register]
});

// Função para obter as métricas em formato texto
export async function getMetrics() {
  // Atualizar métricas de sistema
  const memUsage = process.memoryUsage();
  memoryUsage.set({ type: 'heapUsed' }, memUsage.heapUsed);
  memoryUsage.set({ type: 'heapTotal' }, memUsage.heapTotal);
  memoryUsage.set({ type: 'rss' }, memUsage.rss);

  const cpuUsagePercent = process.cpuUsage();
  cpuUsage.set((cpuUsagePercent.user + cpuUsagePercent.system) / 1000000);

  return await register.metrics();
}

// Função para registrar uma requisição HTTP
export function recordHttpRequest(method: string, path: string, status: number, duration: number) {
  httpRequestsTotal.inc({ method, path, status });
  httpRequestDuration.observe({ method, path }, duration);
}

// Função para registrar conexões ativas
export function setActiveConnections(count: number) {
  activeConnections.set(count);
}

// Função para registrar erros
export function recordError(type: string, component: string) {
  errorCounter.inc({ type, component });
} 