// 기본 변수 설정
const grid = document.getElementById('grid');
let score = 0;
let highScore = 0;
let lives = 4;
let timer = 0; // 게임 시작 타이머
let interval; // 타이머 인터벌
let poop1Active = false; // 찬일 이벤트 활성화 여부
let previousPoopIndex = -1; // 이전 poop 이미지 인덱스
let gameOver = false; // 게임 오버 여부

// 5x5 그리드 만들기 (총 25칸)
for (let i = 0; i < 25; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.dataset.index = i; // 각 칸에 고유한 인덱스를 지정
  grid.appendChild(cell);
}

// 점수 업데이트 함수
function updateScore() {
  document.getElementById('score').innerText = `Score: ${score}`;
  updateHighScore();
}

// 최고 기록 업데이트 함수
function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    document.getElementById('high-score').innerText = `최고기록: ${highScore}`;
  }
}

// 타이머 업데이트 함수
function updateTimer() {
  timer++;
  const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
  const seconds = (timer % 60).toString().padStart(2, '0');
  document.getElementById('timer').innerText = `Time: ${minutes}:${seconds}`;
}

// 목숨 업데이트 함수
function updateLives() {
  document.getElementById('lives').innerText = `Lives: ${lives}`;
  if (lives === 0) {
    gameOver = true; // 게임 오버 상태로 변경
    clearInterval(interval); // 타이머 멈추기
    document.getElementById('restart-button').style.display = 'block'; // 다시 플레이 버튼 보이기
    alert('게임 오버! 찬일팸의 입단!');
  }
}

// 랜덤으로 똥 이미지가 있는 칸 변경
function changePoopCell() {
  if (gameOver || poop1Active) return; // 게임 오버나 찬일 이벤트 중에는 똥 이미지 변경 안 함

  // 이전에 있던 똥을 클릭했는지 확인하고, 클릭하지 않았다면 목숨 차감
  if (previousPoopIndex !== -1) {
    const previousCell = grid.children[previousPoopIndex];
    if (!previousCell.clicked) {
      lives -= 1; // 클릭하지 않으면 목숨 차감
      updateLives();
    }
    previousCell.classList.remove('poop');
  }

  // 새로운 랜덤 인덱스 계산
  const randomIndex = Math.floor(Math.random() * 25);
  const randomCell = grid.children[randomIndex];
  randomCell.classList.add('poop');
  randomCell.clicked = false; // 새로운 칸의 클릭 상태 초기화
  
  // 똥 칸의 인덱스 저장
  previousPoopIndex = randomIndex;
}

// 찬일 이벤트 시작 함수
function startChanilEvent() {
  poop1Active = true;
  // 모든 칸에 poop1.jpg 생성
  for (let i = 0; i < 25; i++) {
    const cell = grid.children[i];
    cell.classList.add('poop');
    cell.classList.remove('poop1'); // 이전에 있던 poop1 제거
  }

  // 1.5초 후에 poop1.jpg를 삭제하고 찬일 이벤트 종료
  setTimeout(() => {
    for (let i = 0; i < 25; i++) {
      const cell = grid.children[i];
      cell.classList.remove('poop');
      cell.classList.add('poop1'); // poop1.jpg로 변경
    }
    setTimeout(() => {
      poop1Active = false;
      for (let i = 0; i < 25; i++) {
        const cell = grid.children[i];
        cell.classList.remove('poop1'); // poop1 제거
      }
    }, 1500); // 1.5초 동안 진행
  }, 1500); // 1.5초 후에 모든 칸에 poop1을 표시
}

// 좌클릭 또는 우클릭으로 점수 증가
grid.addEventListener('click', function(event) {
  const target = event.target;

  if (gameOver) return; // 게임 오버 상태에서는 클릭 불가

  // 좌클릭한 요소가 똥 셀인지 확인하고, 아직 클릭되지 않았다면 점수를 증가시킴
  if (target.classList.contains('cell') && target.classList.contains('poop') && !target.clicked) {
    score += 1;
    target.clicked = true; // 클릭 여부 저장
    updateScore();
  } else if (!target.classList.contains('poop')) {
    // 똥이 아닌 다른 칸을 클릭했을 때 점수 차감
    score -= 1;
    if (score < 0) score = 0; // 점수는 0 이하로 내려가지 않음
    updateScore();
    lives -= 1;
    updateLives();
  }

  // 찬일 이벤트에서 클릭한 경우
  if (target.classList.contains('poop1')) {
    lives -= 1;
    updateLives();
    new Audio('aa.mp3').play(); // aa.mp3 재생
  }
});

// 우클릭으로도 점수 증가
grid.addEventListener('contextmenu', function(event) {
  const target = event.target;

  if (gameOver) return; // 게임 오버 상태에서는 클릭 불가

  // 우클릭한 요소가 똥 셀인지 확인하고, 아직 클릭되지 않았다면 점수를 증가시킴
  if (target.classList.contains('cell') && target.classList.contains('poop') && !target.clicked) {
    score += 1;
    target.clicked = true; // 클릭 여부 저장
    updateScore();
  } else if (!target.classList.contains('poop')) {
    // 똥이 아닌 다른 칸을 우클릭했을 때 점수 차감
    score -= 1;
    if (score < 0) score = 0; // 점수는 0 이하로 내려가지 않음
    updateScore();
    lives -= 1;
    updateLives();
  }

  event.preventDefault(); // 기본 우클릭 메뉴 방지
});

// 1초마다 랜덤한 칸을 똥 이미지로 변경
setInterval(changePoopCell, 1000);

// 찬일 이벤트가 10초마다 발생할 확률 30%
setInterval(() => {
  if (Math.random() < 0.3) {
    startChanilEvent();
  }
}, 10000);

// 타이머 시작
interval = setInterval(() => {
  updateTimer();
}, 1000);

// 게임 다시 시작하기
function restartGame() {
  score = 0;
  lives = 4;
  timer = 0;
  gameOver = false;
  document.getElementById('restart-button').style.display = 'none'; // 다시 플레이 버튼 숨기기
  updateScore();
  updateLives();
  clearInterval(interval); // 기존 타이머 종료
  interval = setInterval(() => {
    updateTimer();
  }, 1000); // 타이머 재시작
  setInterval(changePoopCell, 1000); // 게임 시작 시 다시 똥 이미지 변경 시작
}
