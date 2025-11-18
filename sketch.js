let spriteSheet1;
const spriteFrames1 = [];
let spriteSheet2;
const spriteFrames2 = [];

// 將影格尺寸變數宣告為全域，以便在 draw() 中使用
let frameWidth1, frameHeight1, frameWidth2, frameHeight2;

const totalFrames = 8; // 圖片精靈中的總影格數
let currentFrame = 0; // 目前播放的影格索引
let isPlaying = false; // 音樂與動畫的播放狀態

let song; // 用於儲存載入的音樂檔案
let amplitude; // 用於分析音樂振幅
let animationCounter = 0; // 動畫影格更新的計數器

// 在 sketch 開始前預先載入資源
function preload() {
  // 載入角色1的圖片精靈檔案
  spriteSheet1 = loadImage('1/all.png');
  // 載入角色2的圖片精靈檔案
  spriteSheet2 = loadImage('2/all.png');
  // 載入背景音樂檔案 (請替換成您的音樂路徑)
  song = loadSound('assets/jungle-waves-drumampbass-electronic-inspiring-promo-345013.mp3');
}

function setup() {
  // 建立一個佔滿整個視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // --- 處理角色 1 ---
  // 計算角色1每個影格的寬度
  frameWidth1 = Math.floor(spriteSheet1.width / totalFrames);
  frameHeight1 = spriteSheet1.height;

  // 使用 for 迴圈切割 spriteSheet 並將每個影格存入 spriteFrames 陣列
  for (let i = 0; i < totalFrames; i++) {
    // 從 spriteSheet 中擷取一個影格的區域
    let frame = spriteSheet1.get(i * frameWidth1, 0, frameWidth1, frameHeight1);
    spriteFrames1.push(frame);
  }

  // --- 處理角色 2 ---
  // 根據提供的資訊 (寬475, 高63) 計算角色2每個影格的寬度
  frameWidth2 = Math.floor(475 / totalFrames);
  frameHeight2 = 63;

  for (let i = 0; i < totalFrames; i++) {
    let frame = spriteSheet2.get(i * frameWidth2, 0, frameWidth2, frameHeight2);
    spriteFrames2.push(frame);
  }

  // 建立一個新的 Amplitude 物件來分析音訊
  amplitude = new p5.Amplitude();

  // 將圖片的繪製模式設定為中心點對齊，方便將其置中
  imageMode(CENTER);
}

function draw() {
  // 設定畫布背景顏色
  background('#f7e1d7');

  // 顯示角色1在畫布中央，並將其放大2倍
  image(spriteFrames1[currentFrame], width / 2, height / 2, frameWidth1 * 2, frameHeight1 * 2);

  // 顯示角色2在角色1的右邊，並將其放大2倍
  image(spriteFrames2[currentFrame], width / 2 + 150, height / 2, frameWidth2 * 2, frameHeight2 * 2);

  // 只有在 isPlaying 為 true 時才更新影格
  if (isPlaying) {
    // 獲取當前的音量 (振幅)，範圍在 0 到 1 之間
    let level = amplitude.getLevel();
    // 將振幅 (0-1) 映射到一個影格延遲值 (例如 15-1)。振幅越大，延遲越小，動畫越快。
    let frameDelay = map(level, 0, 1, 15, 1);

    animationCounter++;
    if (animationCounter > frameDelay) {
      currentFrame = (currentFrame + 1) % totalFrames;
      animationCounter = 0; // 重設計數器
    }
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 當滑鼠被按下時，切換動畫的播放/暫停狀態
function mousePressed() {
  isPlaying = !isPlaying;

  if (isPlaying) {
    // 如果是開始播放，就循環播放音樂
    song.loop();
  } else {
    // 如果是暫停，就停止音樂
    song.stop();
  }
}
