export type SpeedUnit = 'kmh' | 'mph';

const MS_TO_KMH = 3.6;
const MS_TO_MPH = 2.2369362912;

export function convertSpeed(metersPerSecond: number, unit: SpeedUnit): number {
  const factor = unit === 'kmh' ? MS_TO_KMH : MS_TO_MPH;
  return metersPerSecond * factor;
}

export function formatSpeed(metersPerSecond: number | null, unit: SpeedUnit): string {
  if (metersPerSecond == null || Number.isNaN(metersPerSecond) || metersPerSecond < 0) {
    return '--';
  }
  return convertSpeed(metersPerSecond, unit).toFixed(1);
}

export function unitLabel(unit: SpeedUnit): string {
  return unit === 'kmh' ? 'km/h' : 'mph';
}
