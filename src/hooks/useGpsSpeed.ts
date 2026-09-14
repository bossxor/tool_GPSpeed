import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';

export type GpsStatus =
  | 'requesting'
  | 'denied'
  | 'unavailable'
  | 'waiting'
  | 'active'
  | 'error';

export type GpsSpeedState = {
  status: GpsStatus;
  speedMps: number | null;
  accuracy: number | null;
  message: string | null;
};

export function useGpsSpeed(): GpsSpeedState {
  const [state, setState] = useState<GpsSpeedState>({
    status: 'requesting',
    speedMps: null,
    accuracy: null,
    message: '위치 권한을 요청하는 중…',
  });
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          if (!cancelled) {
            setState({
              status: 'unavailable',
              speedMps: null,
              accuracy: null,
              message: '기기에서 위치 서비스(GPS)를 켜 주세요.',
            });
          }
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== Location.PermissionStatus.GRANTED) {
          if (!cancelled) {
            setState({
              status: 'denied',
              speedMps: null,
              accuracy: null,
              message: '위치 권한이 필요합니다. 설정에서 허용해 주세요.',
            });
          }
          return;
        }

        if (!cancelled) {
          setState({
            status: 'waiting',
            speedMps: null,
            accuracy: null,
            message: 'GPS 신호를 찾는 중… 야외에서 더 정확합니다.',
          });
        }

        subscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 500,
            distanceInterval: 0,
            ...(Platform.OS === 'android'
              ? { mayShowUserSettingsDialog: true }
              : null),
          },
          (location) => {
            if (cancelled) return;
            const raw = location.coords.speed;
            const speedMps =
              raw == null || Number.isNaN(raw) || raw < 0 ? 0 : raw;

            setState({
              status: 'active',
              speedMps,
              accuracy: location.coords.accuracy,
              message: null,
            });
          },
        );
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : '위치 정보를 가져오지 못했습니다.';
          setState({
            status: 'error',
            speedMps: null,
            accuracy: null,
            message,
          });
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
    };
  }, []);

  return state;
}
