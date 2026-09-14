# GPSpeed

GPS로 **현재 속도**를 보여주는 앱입니다. 안드로이드는 네이티브 앱, iPhone은 같은 코드의 웹으로 사용할 수 있습니다.

## 기능

- GPS 기반 실시간 속도 표시
- 단위 전환: `km/h` ↔ `mph` (탭, 선택값 저장)

## 요구 사항

- Node.js 18+
- 안드로이드: Android SDK, USB 디버깅(ADB) 또는 에뮬레이터
- iOS 웹: 브라우저에서 HTTPS(또는 localhost)로 위치 권한 허용

## 실행

```bash
npm install
npx expo start
```

- 안드로이드 기기 빌드·설치: `npx expo run:android`
- 웹: `npx expo start --web`

## 참고

가속도 센서만으로도 속도를 “추정”할 수는 있지만, 적분 오차가 빨리 쌓여 실사용 속도계로는 부적합합니다. 이 앱은 GPS `coords.speed`를 사용합니다.
