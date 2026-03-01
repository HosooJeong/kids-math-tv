# IMAGE_RESOURCES.md

유아 수학 게임용 정적 이미지 리소스 관리 문서.

원칙:
- 스프라이트시트 사용하지 않음
- 정적 PNG(투명 배경)만 사용
- 파일명/용도/생성 프롬프트를 이 문서에서 단일 관리

---

## 1) 공통 스타일 프롬프트 (항상 앞에 붙이기)

```text
2D flat vector style, cute preschool educational game art, soft pastel colors, clean thick outline, simple shapes, friendly and joyful mood, centered composition.
```

## 2) 출력 계약(OUTPUT CONTRACT, 항상 포함)

```text
OUTPUT CONTRACT:
- Return PNG with true alpha transparency.
- Do not bake checkerboard/grid into pixels.
- No background scene.
- Keep all object pixels fully inside canvas (no clipping).
- No text, no watermark.
```

---

## 3) 에셋 목록 (정적 이미지)

### A. 캐릭터/상태

#### 1) basket_idle.png
- 경로: `src/assets/ui/basket_idle.png`
- 캔버스: 1024x1024
- 용도: 기본 대기 상태
- 프롬프트:
```text
2D flat vector style, cute preschool educational game art, soft pastel colors, clean thick outline, simple shapes, friendly and joyful mood, centered composition.
OUTPUT CONTRACT:
- Return PNG with true alpha transparency.
- Do not bake checkerboard/grid into pixels.
- No background scene.
- Keep all object pixels fully inside canvas (no clipping).
- No text, no watermark.
Subject: A cute fruit basket character, front view, neutral expression, empty basket, clean silhouette.
Consistency constraints:
- Keep line thickness and proportions consistent across all future basket images.
- Canvas 1024x1024.
```

#### 2) basket_happy.png
- 경로: `src/assets/ui/basket_happy.png`
- 캔버스: 1024x1024
- 용도: 정답/성공 상태
- 프롬프트:
```text
2D flat vector style, cute preschool educational game art, soft pastel colors, clean thick outline, simple shapes, friendly and joyful mood, centered composition.
OUTPUT CONTRACT:
- Return PNG with true alpha transparency.
- Do not bake checkerboard/grid into pixels.
- No background scene.
- Keep all object pixels fully inside canvas (no clipping).
- No text, no watermark.
Subject: Same basket character as previous approved image, front view, happy smiling expression, slight celebratory pose.
Consistency constraints:
- Keep identical palette, outline thickness, and proportions from previous approved basket image.
- Canvas 1024x1024.
```

#### 3) basket_sad.png
- 경로: `src/assets/ui/basket_sad.png`
- 캔버스: 1024x1024
- 용도: 오답 안내 상태
- 프롬프트:
```text
2D flat vector style, cute preschool educational game art, soft pastel colors, clean thick outline, simple shapes, friendly and joyful mood, centered composition.
OUTPUT CONTRACT:
- Return PNG with true alpha transparency.
- Do not bake checkerboard/grid into pixels.
- No background scene.
- Keep all object pixels fully inside canvas (no clipping).
- No text, no watermark.
Subject: Same basket character as previous approved image, front view, gentle disappointed expression (not scary), child-friendly.
Consistency constraints:
- Keep identical palette, outline thickness, and proportions from previous approved basket image.
- Canvas 1024x1024.
```

#### 4) basket_full.png
- 경로: `src/assets/ui/basket_full.png`
- 캔버스: 1024x1024
- 용도: 라운드 완료/보상 화면
- 프롬프트:
```text
2D flat vector style, cute preschool educational game art, soft pastel colors, clean thick outline, simple shapes, friendly and joyful mood, centered composition.
OUTPUT CONTRACT:
- Return PNG with true alpha transparency.
- Do not bake checkerboard/grid into pixels.
- No background scene.
- Keep all object pixels fully inside canvas (no clipping).
- No text, no watermark.
Subject: Same basket character as previous approved image, front view, basket filled with apple, banana, orange, grapes, joyful expression.
Consistency constraints:
- Keep identical palette, outline thickness, and proportions from previous approved basket image.
- Canvas 1024x1024.
```

---

### B. 과일 아이콘

#### 5) fruit_apple.png
- 경로: `src/assets/ui/fruit_apple.png`
- 캔버스: 512x512
- 용도: 문제 시각화/보상 UI

#### 6) fruit_banana.png
- 경로: `src/assets/ui/fruit_banana.png`
- 캔버스: 512x512
- 용도: 문제 시각화/보상 UI

#### 7) fruit_orange.png
- 경로: `src/assets/ui/fruit_orange.png`
- 캔버스: 512x512
- 용도: 문제 시각화/보상 UI

#### 8) fruit_grape.png
- 경로: `src/assets/ui/fruit_grape.png`
- 캔버스: 512x512
- 용도: 문제 시각화/보상 UI

과일 공통 프롬프트 (`{fruit}`만 치환):
```text
2D flat vector style, cute preschool educational game art, soft pastel colors, clean thick outline, simple shapes, friendly and joyful mood, centered composition.
OUTPUT CONTRACT:
- Return PNG with true alpha transparency.
- Do not bake checkerboard/grid into pixels.
- No background scene.
- Keep all object pixels fully inside canvas (no clipping).
- No text, no watermark.
Subject: Single cute {fruit} icon, front view, simple shape, preschool-friendly.
Consistency constraints:
- Same outline thickness and color palette as the approved basket character.
- Canvas 512x512.
```

---

### C. 스티커/피드백

#### 9) sticker_correct.png
- 경로: `src/assets/ui/sticker_correct.png`
- 캔버스: 512x512
- 용도: 정답 피드백 오버레이
- 프롬프트:
```text
2D flat vector style, cute preschool educational game art, soft pastel colors, clean thick outline, simple shapes, friendly and joyful mood, centered composition.
OUTPUT CONTRACT:
- Return PNG with true alpha transparency.
- Do not bake checkerboard/grid into pixels.
- No background scene.
- Keep all object pixels fully inside canvas (no clipping).
- No text, no watermark.
Subject: Cute celebratory sticker icon (star + check vibe), child-friendly.
Consistency constraints:
- Same palette and outline thickness as approved basket assets.
- Canvas 512x512.
```

#### 10) sticker_try_again.png
- 경로: `src/assets/ui/sticker_try_again.png`
- 캔버스: 512x512
- 용도: 오답/재도전 피드백
- 프롬프트:
```text
2D flat vector style, cute preschool educational game art, soft pastel colors, clean thick outline, simple shapes, friendly and joyful mood, centered composition.
OUTPUT CONTRACT:
- Return PNG with true alpha transparency.
- Do not bake checkerboard/grid into pixels.
- No background scene.
- Keep all object pixels fully inside canvas (no clipping).
- No text, no watermark.
Subject: Cute encouragement sticker icon (gentle retry vibe), child-friendly and positive.
Consistency constraints:
- Same palette and outline thickness as approved basket assets.
- Canvas 512x512.
```

---

## 4) 검수 체크리스트

각 이미지 생성 후 아래 체크:
- [ ] PNG 파일인가?
- [ ] 진짜 alpha 투명 배경인가?
- [ ] 바둑판 패턴이 픽셀로 박혀있지 않은가?
- [ ] 오브젝트 잘림(clipping) 없는가?
- [ ] 기존 승인 이미지와 라인 두께/비율/팔레트가 일관적인가?
- [ ] 파일명이 문서와 정확히 일치하는가?

자동 검수(선택):
```bash
python3 skills/gpt-image-spec-writer/scripts/validate_image_assets.py <image1> [image2...]
```

---

## 5) 실패 시 보정 프롬프트 (한 줄)

- 투명 배경 실패:
```text
Redo in PNG with true alpha transparency only. Remove any checkerboard/grid texture baked into pixels.
```

- 스타일 일관성 실패:
```text
Keep identical line thickness, color palette, and character proportions from the previous approved image.
```

---

## 6) 진행 상태 트래커

- [ ] basket_idle.png
- [ ] basket_happy.png
- [ ] basket_sad.png
- [ ] basket_full.png
- [ ] fruit_apple.png
- [ ] fruit_banana.png
- [ ] fruit_orange.png
- [ ] fruit_grape.png
- [ ] sticker_correct.png
- [ ] sticker_try_again.png
