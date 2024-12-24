// 게임 변수 설정
let score = 0;
let highScore = 0;
let lives = 4;
let timer = 0;
let interval;
let gameOver = false;
let changilPartyActive = false;
let poop1Clicked = false; // 찬일 파티 클릭 여부를 추적하는 변수
let musicPlaying = false;
let previousPoopIndex = -1;
let poop1Cells = []; // 찬일 파티에서 `poop1` 이미지가 있는 셀들
let partyClicked = false; // 찬일 파티 기간 동안 클릭 여부 추적

// 요소들
const grid = document.getElementById('grid');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const livesElement = document.getElementById('lives');
const timerElement = document.getElementById('timer');
const penaltyInfoElement = document.getElementById('penalty-info');
const restartButton = document.getElementById('restart-button');

// 5x5 그리드 만들기 (총 25칸)
for (let i = 0; i < 25; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.dataset.index = i;
  grid.appendChild(cell);
}

// 점수 업데이트 함수
function updateScore() {
  scoreElement.innerText = `Score: ${score}`;
  updateHighScore();
}

// 최고 기록 업데이트 함수
function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    highScoreElement.innerText = `최고기록: ${highScore}`;
  }
}

// 타이머 업데이트 함수
function updateTimer() {
  timer++;
  const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
  const seconds = (timer % 60).toString().padStart(2, '0');
  timerElement.innerText = `Time: ${minutes}:${seconds}`;

  // 30초마다 목숨 1개 추가
  if (timer % 30 === 0) {
    lives++;
    updateLives();
  }
}

// 목숨 업데이트 함수
function updateLives() {
  livesElement.innerText = `Lives: ${lives}`;
  
  if (lives <= 0) {
    gameOver = true;
    clearInterval(interval);
    stopAllMusic();
    restartButton.style.display = 'block';
    alert('게임 오버!');
  } else if (lives === 1 && !musicPlaying) {
    new Audio('aa.mp3').play();
    musicPlaying = true;
  }
}

// 랜덤으로 똥 이미지가 있는 칸 변경
function changePoopCell() {
  if (gameOver || changilPartyActive) return;

  // 이전에 있던 똥을 클릭했는지 확인하고, 클릭하지 않았다면 목숨 차감
  if (previousPoopIndex !== -1) {
    const previousCell = grid.children[previousPoopIndex];
    if (!previousCell.clicked) {
      lives--; // 클릭하지 않으면 목숨 차감
      updateLives();
      new Audio('bb.mp3').play(); // 클릭 안 했으면 bb.mp3 출력
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

// 찬일 파티 이벤트 시작 함수
function startChangilParty() {
  changilPartyActive = true;
  poop1Clicked = false; // 찬일 파티 클릭 여부 초기화
  partyClicked = false; // 찬일 파티 기간 중 클릭 여부 초기화
  poop1Cells = []; // 찬일 파티에 있는 `poop1` 이미지 셀들 초기화

  // 모든 칸에 poop1.jpg 생성
  for (let i = 0; i < 25; i++) {
    const cell = grid.children[i];
    cell.classList.add('poop');
    cell.classList.remove('poop1'); // 이전에 있던 poop1 제거
  }

  // 찬일이가 클릭될 수 있도록 상태 추가
  const randomPoopIndex = Math.floor(Math.random() * 25);
  const randomCell = grid.children[randomPoopIndex];
  randomCell.classList.add('poop1'); // 찬일이가 있는 칸을 지정
  poop1Cells.push(randomCell); // 찬일 파티에서 `poop1`이 있는 셀 추가

  // 1.5초 후에 poop1.jpg를 삭제하고 찬일 이벤트 종료
  setTimeout(() => {
    for (let i = 0; i < 25; i++) {
      const cell = grid.children[i];
      cell.classList.remove('poop');
      cell.classList.add('poop1'); // poop1.jpg로 변경
      if (cell.classList.contains('poop1')) {
        poop1Cells.push(cell); // `poop1` 이미지가 있는 셀 목록에 추가
      }
    }
    setTimeout(() => {
      changilPartyActive = false;
      for (let i = 0; i < 25; i++) {
        const cell = grid.children[i];
        cell.classList.remove('poop1'); // poop1 제거
      }

      // 찬일 파티 끝났을 때, 클릭 여부에 따라 aa.mp3 또는 bb.mp3 출력
      if (partyClicked) {
        new Audio('aa.mp3').play(); // 클릭하면 aa.mp3
      } else {
        new Audio('bb.mp3').play(); // 클릭하지 않았다면 bb.mp3
      }
    }, 1500); // 1.5초 후에 모든 칸에 poop1을 표시
  }, 1500); // 1.5초 후에 찬일 이벤트 종료
}

// 찬일 파티에서 클릭 여부 확인
grid.addEventListener('click', function(event) {
  const target = event.target;

  if (gameOver) return; // 게임 오버 상태에서는 클릭 불가

  // 찬일 파티 상태에서 클릭 시 aa.mp3 출력
  if (changilPartyActive && target.classList.contains('poop1')) {
    poop1Clicked = true; // 찬일 클릭 여부 업데이트
    lives++;
    updateLives();
    new Audio('aa.mp3').play(); // 클릭하면 aa.mp3만 실행
    partyClicked = true; // 찬일 파티 기간 동안 클릭함
  }

  // 찬일 파티 기간 동안 블럭 클릭 시 목숨 1 추가하고 aa.mp3 출력
  if (changilPartyActive && !target.classList.contains('poop1')) {
    if (!partyClicked) { // 첫 클릭일 경우에만 처리
      lives++;
      updateLives();
      new Audio('aa.mp3').play(); // 클릭하면 aa.mp3 실행
      partyClicked = true; // 찬일 파티 동안 클릭됨
    }
  }

  // 좌클릭한 요소가 똥 셀인지 확인하고, 아직 클릭되지 않았다면 점수를 증가시킴
  if (target.classList.contains('cell') && target.classList.contains('poop') && !target.clicked) {
    score++; // 점수 증가
    target.clicked = true; // 클릭 여부 저장
    updateScore();
    
    // 클릭 시 랜덤으로 mp3 파일 실행
    playRandomAudio();
  } else if (!target.classList.contains('poop')) {
    // 똥이 아닌 다른 칸을 클릭했을 때 점수 차감
    score--;
    if (score < 0) score = 0; // 점수는 0 이하로 내려가지 않음
    updateScore();
    lives--;
    updateLives();
  }
});

// 찬일 파티가 10% 확률로 발생하도록 설정
setInterval(() => {
  if (Math.random() < 0.1) { // 10% 확률
    startChangilParty();
  }
}, 1000);

// 랜덤으로 mp3 파일을 출력
function playRandomAudio() {
  const audioFiles = ['rand1.mp3', 'rand2.mp3'];
  const randomFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];
  const audio = new Audio(randomFile);
  audio.play();
}

// 1초마다 랜덤한 칸을 똥 이미지로 변경
setInterval(changePoopCell, 1000);

// 타이머 시작
interval = setInterval(() => {
  updateTimer();
}, 1000);

// 게임 다시 시작하기 (새로고침)
function restartGame() {
  score = 0;
  lives = 4;
  timer = 0;
  gameOver = false;
  changilPartyActive = false;
  poop1Clicked = false; // 찬일 파티 클릭 여부 초기화
  restartButton.style.display = 'none'; // 다시 플레이 버튼 숨기기
  updateScore();
  updateLives();
  
  // 음악 끄기
  stopAllMusic();

  clearInterval(interval); // 기존 타이머 종료
  interval = setInterval(() => {
    updateTimer();
  }, 1000); // 타이머 재시작
  setInterval(changePoopCell, 1000); // 게임 시작 시 다시 똥 이미지 변경 시작

  // 페이지 새로고침
  location.reload();
}

// 모든 음악을 멈추는 함수
function stopAllMusic() {
  const audios = document.querySelectorAll('audio');
  audios.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
}
