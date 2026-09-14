import { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGpsSpeed } from './src/hooks/useGpsSpeed';
import { formatSpeed, SpeedUnit, unitLabel } from './src/utils/speed';

const UNIT_KEY = 'gpspeed.unit';

export default function App() {
  const gps = useGpsSpeed();
  const [unit, setUnit] = useState<SpeedUnit>('kmh');
  const [unitReady, setUnitReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(UNIT_KEY)
      .then((saved) => {
        if (saved === 'kmh' || saved === 'mph') {
          setUnit(saved);
        }
      })
      .finally(() => setUnitReady(true));
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const next: SpeedUnit = prev === 'kmh' ? 'mph' : 'kmh';
      AsyncStorage.setItem(UNIT_KEY, next).catch(() => undefined);
      return next;
    });
  }, []);

  const speedText = formatSpeed(gps.speedMps, unit);
  const showStatus = gps.status !== 'active' || Boolean(gps.message);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.brand}>GPSpeed</Text>
        <Text style={styles.caption}>GPS 현재 속도</Text>

        <View style={styles.speedBlock}>
          <Text style={styles.speedValue} accessibilityLabel={`속도 ${speedText}`}>
            {unitReady ? speedText : '--'}
          </Text>
          <Pressable
            onPress={toggleUnit}
            style={({ pressed }) => [styles.unitButton, pressed && styles.unitPressed]}
            accessibilityRole="button"
            accessibilityLabel="속도 단위 변경"
          >
            <Text style={styles.unitText}>{unitLabel(unit)}</Text>
            <Text style={styles.unitHint}>탭하여 전환</Text>
          </Pressable>
        </View>

        {showStatus ? (
          <Text style={styles.status}>{gps.message ?? '측정 중…'}</Text>
        ) : (
          <Text style={styles.status}>
            {gps.accuracy != null
              ? `정확도 ±${Math.round(gps.accuracy)} m`
              : 'GPS 연결됨'}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brand: {
    position: 'absolute',
    top: 28,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#F4F7FB',
  },
  caption: {
    marginBottom: 18,
    fontSize: 15,
    color: '#8FA0B8',
  },
  speedBlock: {
    alignItems: 'center',
  },
  speedValue: {
    fontSize: 96,
    lineHeight: 108,
    fontWeight: '200',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  unitButton: {
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A3A55',
    backgroundColor: '#121A2B',
  },
  unitPressed: {
    opacity: 0.75,
  },
  unitText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#6EC1FF',
  },
  unitHint: {
    marginTop: 2,
    fontSize: 12,
    color: '#6B7C94',
  },
  status: {
    marginTop: 36,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: '#9AABC4',
    maxWidth: 280,
  },
});
