# kids-math-tv

TV/리모컨 입력을 고려한 유아용 숫자 게임 MVP.

## MVP 범위
- 한 자리 수 + 한 자리 수
- 3지선다
- 10문제 라운드
- 결과 화면(점수/별)
- 키보드/리모컨 방향키 + Enter 입력

## 실행
```bash
npm install
npm run dev
```

## 조작
- `←` `→`: 선택지 이동
- `Enter`: 선택

## 모바일 지원
- 반응형 브레이크포인트: `<=768px`, `<=480px`
- 홈/퀴즈/결과 화면이 세로(포트레이트)에서도 가로 스크롤 없이 보이도록 레이아웃/타이포/버튼 크기 조정
- 터치 조작을 위한 버튼 크기/간격 강화 + 기존 키보드/리모컨 조작 유지

## 구조
```txt
src/
  app/
    createApp.js
  features/
    game-engine/
      createSession.js
    input/
      remote.js
    modes/
      add-single-digit/
        generator.js
    ui/screens/
      homeScreen.js
      quizScreen.js
      resultScreen.js
```

## 다음 확장
- modes: add-carry, subtract-basic
- 부모 설정(문제 수/난이도)
- 캐릭터/일러스트 리소스 연결
- 세션 리포트 저장
