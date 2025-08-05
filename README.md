# 반려동물 건강일기 🐾

반려동물의 건강 관리와 일상 기록을 위한 감성적인 다이어리 웹앱입니다.  
Vue 3 Composition API + Pinia 상태관리로 제작했고, 반응형 UI까지 구현했습니다.  

---

## 주요 기능

### 1. 반려동물 관리 (Pinia 상태관리)
- **펫 목록 관리**: store로 관리하여 전역 상태 공유
- **펫 추가**: 모달 창을 통해 새 펫 등록 가능
- **Toast 알림**: 펫 추가 시 `🐶 [이름] 등록되었습니다!` 알림 표시
- **리버스 정렬**: 최근 등록한 펫이 앞쪽에 보이도록

---

### 2. 건강일기 관리 (Props 방식)
- **포스트 작성 및 수정**: 반려동물 별 일기 작성 가능
- **포스트 삭제**: 확인창 후 삭제 처리
- **즐겨찾기 기능**: ❤️ 하트 버튼으로 즐겨찾기 추가/제거
- **작성일/수정일 표시**: 포스트 상세 페이지에서 구분

---

### 3. UI/UX
- **반응형 디자인**: 모바일 중심의 430px 레이아웃
- **펫 목록 스크롤**: 펫이 많아질 경우 좌우 스크롤 처리
- **감성적인 색감과 애니메이션**: 사용자 친화적인 인터랙션 추가
- **Floating Button**: 새 글 작성 버튼 제공

---

## 기술 스택
- **Frontend**: Vue 3 (Composition API), Pinia, TailwindCSS
- **상태관리**: Pinia
- **애니메이션**: Vue Transition
- **아이콘**: Heroicons, Phosphor Icons
- **데이터저장**: LocalStorage

---

### 학습 포인트
- Pinia Store를 활용하여 상태 관리 및 로컬스토리지 연동
- 반응형 레이아웃 구성 (Tailwind CSS + Overflow 처리)
- Vue 3 Composition API로 코드 최적화

---

## 📸 미리보기
![홈화면 미리보기](./screenshots/home.png)
![포스트 디테일](./screenshots/post-detail.png)
![펫 추가 모달](./screenshots/add-pet.png)

---

## 🚀 실행 방법
```bash
# 프로젝트 클론
git clone https://github.com/your-repo/pet-health-diary.git

# 의존성 설치
npm install

# 로컬 실행
npm run dev





(포트폴리오용 설명 문구)
🐾 반려동물 건강일기 앱
- Vue3 + Pinia + TailwindCSS로 만든 반응형 웹 앱
- 반려동물 건강기록 관리 및 즐겨찾기 기능
- 로컬스토리지 기반 데이터 유지"# pet_Blog" 
