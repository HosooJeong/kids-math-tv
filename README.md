# kids-math-tv

TV/리모컨 입력을 고려한 유아용 숫자 게임 MVP.

## 현재 범위
- 챕터 기반 수학 학습(1-1 ~ 2-5)
- 순차 학습 모드(잠금 해제 진행)
- 맞춤 랜덤 모드(학습 상태 기반 출제)
- 3지선다
- 챕터별 라운드 진행 stage-map 시각화
- 결과 화면(점수/별 + 다음 추천 챕터)
- 진도 보기 화면(노드형 챕터 맵, 챕터 직접 선택 시작)
- 키보드/리모컨 방향키 + Enter 입력
- 홈/퀴즈 BGM + 결과 화면 BGM 변주
- 정답/오답/UI 클릭 효과음 + 전역 음소거 토글
- 반응속도/제한시간 요소 없음

## 실행
```bash
npm install
npm run dev
```

## 조작
- `←` `→`: 선택지 이동
- `Enter`: 선택
- 화면 우측 상단 `🔊/🔇`: 전체 소리 켜기/끄기

## 오디오
- 모바일 자동재생 제한 대응: 첫 상호작용(터치/클릭/키 입력) 이후에만 오디오 시작
- 홈/퀴즈 화면은 잔잔한 루프 BGM, 결과 화면은 더 밝은 루프 BGM 재생
- 정답 시 기존 효과음을 유지하고 가벼운 반짝임 레이어를 추가
- 오답 시 부드러운 다운톤 효과음, 버튼 상호작용 시 짧은 클릭/선택 효과음 재생
- 음량은 유아용 기준으로 보수적으로 설정
- 음소거 상태는 `localStorage`에 저장되어 다음 방문에도 유지
- `AudioContext`를 사용할 수 없는 환경에서는 무음으로 동작하며 게임 플레이는 그대로 가능

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
    chapters/
      curriculum.js
      progressStore.js
    input/
      remote.js
    audio/
      createAudioManager.js
    modes/
      chapter/
        generator.js
    ui/screens/
      homeScreen.js
      quizScreen.js
      resultScreen.js
      progressScreen.js
    ui/components/
      celebrationEffects.js
      muteToggle.js
```

## 다음 확장
- modes: add-carry, subtract-basic
- 부모 설정(문제 수/난이도)
- 캐릭터/일러스트 리소스 연결
- 세션 리포트 저장
