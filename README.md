# GPSpeed

GPS로 **현재 속도**를 보여주는 앱입니다. 안드로이드는 네이티브 앱, iPhone은 웹으로 사용할 수 있습니다.

## 다운로드 / 접속

| 플랫폼 | 링크 |
|--------|------|
| **Android APK** | [최신 APK 다운로드](https://github.com/bossxor/GPSpeed/releases/latest) |
| **iPhone / 웹** | [https://bossxor.github.io/GPSpeed/](https://bossxor.github.io/GPSpeed/) |

- Android: Releases에서 `GPSpeed.apk` 설치 후 위치 권한 허용
- iPhone: Safari로 위 웹 주소를 열고 위치 권한 허용 (HTTPS라 GPS 사용 가능)
- 프로젝트 모음 대시보드: [https://bossxor.netlify.app/](https://bossxor.netlify.app/)

## 기능

- GPS 기반 실시간 속도 표시
- 단위 전환: `km/h` ↔ `mph` (탭, 선택값 저장)

## 개발 실행

```bash
npm install
npx expo start
```

- 안드로이드: `npx expo run:android`
- 웹 로컬: `npx expo start --web`
- 웹 정적 빌드: `npx expo export --platform web --output-dir web-dist`

## 참고

가속도 센서만으로도 속도를 “추정”할 수는 있지만, 적분 오차가 빨리 쌓여 실사용 속도계로는 부적합합니다. 이 앱은 GPS `coords.speed`를 사용합니다.
