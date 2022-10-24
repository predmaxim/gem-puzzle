// document.addEventListener('DOMContentLoaded', () => {

class Game {

  constructor(setting) {
    this.setting = setting;
    this.movesElem = document.querySelector(this.setting.moves);
    this.wrap = document.querySelector(this.setting.wrap);
    this.startBtn = document.querySelector(this.setting.startBtn);
    this.stopBtn = document.querySelector(this.setting.stopBtn);
    this.saveBtn = document.querySelector(this.setting.saveBtn);
    this.resultBtn = document.querySelector(this.setting.resultBtn);
    this.timerElem = document.querySelector(this.setting.timerElem);
    this.frameSizeInfoElem = document.querySelector(this.setting.frameSizeInfoElem);
    this.frameSizeInfoElem = document.querySelector(this.setting.frameSizeInfoElem);
    this.info = [
      {
        id: 3,
        time: { minutes: 0, seconds: 0 },
        moves: 0,
        blocksMap: [],
        winnerBlocksResult: [],
        best: {
          time: { minutes: 0, seconds: 0 },
          moves: 0,
        },
      },
      {
        id: 4,
        time: { minutes: 0, seconds: 0 },
        moves: 0,
        blocksMap: [],
        winnerBlocksResult: [],
        best: {
          time: { minutes: 0, seconds: 0 },
          moves: 0,
        },
      },
      {
        id: 5,
        time: { minutes: 0, seconds: 0 },
        moves: 0,
        blocksMap: [],
        winnerBlocksResult: [],
        best: {
          time: { minutes: 0, seconds: 0 },
          moves: 0,
        },
      },
      {
        id: 6,
        time: { minutes: 0, seconds: 0 },
        moves: 0,
        blocksMap: [],
        winnerBlocksResult: [],
        best: {
          time: { minutes: 0, seconds: 0 },
          moves: 0,
        },
      },
      {
        id: 7,
        time: { minutes: 0, seconds: 0 },
        moves: 0,
        blocksMap: [],
        winnerBlocksResult: [],
        best: {
          time: { minutes: 0, seconds: 0 },
          moves: 0,
        },
      },
      {
        id: 8,
        time: { minutes: 0, seconds: 0 },
        moves: 0,
        blocksMap: [],
        winnerBlocksResult: [],
        best: {
          time: { minutes: 0, seconds: 0 },
          moves: 0,
        },
      },
    ];
    this.frameSize = this.info.filter(e => e.id == 4)[0]; //!!!!!!!!!!!!
    this.itemSize = 0;
    this.moves = 0;
    this.isGame = false;
    this.isTimer = 0;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.blocks = [];
    this.zeroBlock = [];
    this.currentBlock = {};
    this.currentBlocksMap = [];
    this.winnerBlocksResult = [];
    this.init();
  }

  init() {

    this.restore();

    if (this.frameSize.blocksMap.length === 0) this.setCurrentBlocksMap()
    if (this.frameSize.winnerBlocksResult.length === 0) this.setWinnerBlocksResult()

    this.setCanvas();

    window.addEventListener('resize', () => {
      if (window.innerWidth < 600) {
        this.itemSize = Math.floor(window.innerWidth / (this.frameSize.id + 2))
        this.setCanvas();
      } else this.itemSize = this.setting.itemSize
    })

    document.addEventListener('click', (e) => {
      if (e.target == this.canvas && this.isGame) this.moveBlock(e);
      if (e.target == this.startBtn) this.start();
      if (e.target == this.stopBtn) this.stop();
      if (e.target == this.saveBtn) this.save();
      if (e.target == this.resultBtn) this.result();
      if (e.target.classList.contains('frame-size')) {

        let target = +e.target.dataset.action

        this.frameSize = this.info.filter(e => e.id === target)[0];
        this.frameSizeInfoElem.textContent = `${target}x${target}`;
        this.clearMoves();
        this.clearTimer();
        this.stop();
        this.setCurrentBlocksMap();
        this.setCanvas();
      }
    })
  }

  setCurrentBlocksMap() {
    // if (this.winnerBlocksResult.length === 0) 
    this.setWinnerBlocksResult()

    const arr = this.winnerBlocksResult.slice()

    const res = []

    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    while (res.length < this.frameSize.id) {
      res.push(arr.splice(0, this.frameSize.id));
    }

    this.currentBlocksMap = res.slice();
    this.frameSize.blocksMap = res.slice()
    return res;
  }

  setCanvas() {
    this.itemSize = window.innerWidth < 600
      ? Math.floor(window.innerWidth / (this.frameSize.id + 2))
      : this.setting.itemSize;

    this.canvas.classList.add('game')
    this.canvas.width = this.frameSize.id * this.itemSize
    this.canvas.height = this.canvas.width

    this.wrap.insertAdjacentElement('afterbegin', this.canvas);

    let tempBlocks = [];
    for (let i = 0; i < this.frameSize.id; i++) {
      for (let j = 0; j < this.frameSize.id; j++) {
        this.ctx.save();
        this.ctx.translate(j * this.itemSize + 2, i * this.itemSize + 2);
        this.ctx.fillStyle = '#e2e2e2'
        this.ctx.fillRect(0, 0, this.itemSize - 4, this.itemSize - 4);

        if (this.currentBlocksMap[i][j] === 0) {
          this.ctx.fillStyle = '#fff';
          this.ctx.fillRect(0, 0, this.itemSize - 4, this.itemSize - 4);

          // zero block info to zeroBlock variable
          this.zeroBlock = {
            name: this.currentBlocksMap[i][j],
            x: Math.floor(j * (this.itemSize)),
            y: Math.floor(i * (this.itemSize)),
            width: Math.floor(this.itemSize),
            height: Math.floor(this.itemSize),
            row: i + 1,
            col: j + 1,
          }
        } else this.ctx.fillStyle = '#000';

        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = window.innerWidth < 400 && this.frameSize.id > 5
          ? "12px sans-serif"
          : "20px sans-serif";
        window.innerWidth < 400 && this.frameSize.id > 5
          ? this.ctx.fillText(this.currentBlocksMap[i][j], this.itemSize / 2, this.itemSize / 2)
          : this.ctx.fillText(this.currentBlocksMap[i][j], this.itemSize / 2, this.itemSize / 2)
        this.ctx.restore();

        // push new block info to blocks array
        tempBlocks.push({
          name: this.currentBlocksMap[i][j],
          x: Math.floor(j * this.itemSize),
          y: Math.floor(i * this.itemSize),
          width: Math.floor(this.itemSize),
          height: Math.floor(this.itemSize),
          row: i + 1,
          col: j + 1,
        })
        this.blocks.length = 0
        this.blocks = tempBlocks.flat()
      }
    }
  }

  moveBlock(e) {
    const x = Math.floor(e.offsetX);
    const y = Math.floor(e.offsetY);

    const drawBlock = () => {
      // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // // this.ctx.translate(this.zeroBlock.x, this.zeroBlock.y);

      // this.ctx.fillStyle = '#e2e2e2'
      // this.ctx.rect(this.zeroBlock.x, this.zeroBlock.y, this.currentBlock.width, this.currentBlock.height);
      // this.ctx.fill()

      // this.ctx.fillStyle = '#000'
      // this.ctx.textAlign = 'center';
      // this.ctx.textBaseline = 'middle';
      // this.ctx.font = window.innerWidth < 400 && this.frameSize > 5
      //   ? "12px sans-serif"
      //   : "20px sans-serif";
      // window.innerWidth < 400 && this.frameSize > 5
      // this.ctx.fillText(this.currentBlock.name, this.zeroBlock.x + this.itemSize / 2, this.zeroBlock.y + this.itemSize / 2)

      this.currentBlocksMap = this.currentBlocksMap.map((arr) => {
        return arr.map(e => {
          if (e == 0) e = this.currentBlock.name
          else if (e == this.currentBlock.name) e = 0
          return e
        })
      })


      this.moves += 1
      this.movesElem.textContent = this.moves

      this.setCanvas()
      if (!this.isSolved()) this.setCanvas()
      else this.gameOver()
    }

    if (this.isClickOnBlock(x, y)) {

      if (this.currentBlock.col == this.zeroBlock.col) {
        if (this.currentBlock.y == this.zeroBlock.y + this.zeroBlock.height) drawBlock()
        if (this.currentBlock.y + this.zeroBlock.height == this.zeroBlock.y) drawBlock()
      }

      if (this.currentBlock.row == this.zeroBlock.row) {
        if (this.currentBlock.x + this.currentBlock.width == this.zeroBlock.x) drawBlock()
        if (this.currentBlock.x == this.zeroBlock.x + this.zeroBlock.width) drawBlock()
      }
    }
  }

  start() {
    document.querySelector('.start').classList.add('active')

    if (document.querySelector('.message')) document.querySelector('.message').remove();
    this.frameSize.blocksMap.length = 0;
    this.frameSize.winnerBlocksResult.length = 0;

    if (this.frameSize.moves === 0 || this.isGame === true) {
      this.clearMoves();
    }

    if (this.frameSize.time.minutes === 0 && this.frameSize.time.seconds === 0 || this.isGame === true) {
      this.clearTimer();
    }

    if (this.isGame === true) this.setCurrentBlocksMap();

    this.setCanvas()
    this.setWinnerBlocksResult()
    this.timer();
    this.isGame = true;
    console.log('New game started');
  }

  stop() {
    document.querySelector('.start').classList.remove('active')
    clearInterval(this.isTimer);
    // this.setCurrentBlocksMap();
    this.isGame = false;
    console.log('Game stopped');
  }

  result() {
    this.message('result')
    document.querySelector('.result').classList.add('active')
  }

  timer() {
    console.log('Timer Started')
    let { minutes, seconds } = this.frameSize.time
    // let minutes = 0, seconds = 0

    this.isTimer = setInterval(() => {
      if (seconds == 59) {
        minutes += 1
        seconds = 0
      }
      seconds += 1

      this.timerElem.textContent = `${String(minutes).length < 2 ? 0 : ''}${minutes}:${String(seconds).length < 2 ? 0 : ''}${seconds}`
      this.frameSize.time = { minutes, seconds }
    }, 1000)
  }

  clearTimer() {
    clearInterval(this.isTimer);
    this.timerElem.textContent = `00:00`;
    this.frameSize.time.minutes = 0;
    this.frameSize.time.seconds = 0;
  }

  clearMoves() {
    this.moves = 0;
    this.movesElem.textContent = 0;
    // this.frameSize.moves = 0;
  }

  message(type, str) {

    const messages = {
      result: `
      <div class="message ${type ? type : ''}">
        <div class="message__header"><b>YOUR RESULTS</b></div>
        <div class="message__frame-size">Frame size: ${this.frameSize.id}x${this.frameSize.id}</div>
        <div class="message__time">Time: ${String(this.frameSize.time.minutes).length < 2 ? 0 : ''}${this.frameSize.time.minutes}:${String(this.frameSize.time.seconds).length < 2 ? 0 : ''}${this.frameSize.time.seconds}</div>
        <div class="message__moves">Moves: ${this.moves}</div>
        <div class="message__moves"><b>Best result:</b> Moves: ${this.frameSize.best.moves} | Time: ${String(this.frameSize.best.time.minutes).length < 2 ? 0 : ''}${this.frameSize.best.time.minutes}:${String(this.frameSize.best.time.seconds).length < 2 ? 0 : ''}${this.frameSize.best.time.seconds}</div>
        <button class="message__button">Close</button>
      </div>`,

      winner: `
      <div class="message ${type ? type : ''}">
        <div class="message__header"><b>Hooray! You solved the puzzle in ${String(this.frameSize.time.minutes).length < 2 ? 0 : ''}${this.frameSize.time.minutes}:${String(this.frameSize.time.seconds).length < 2 ? 0 : ''}${this.frameSize.time.seconds} and ${this.moves} moves!</b></div>
        <div class="message__moves"><b>Best result:</b> Moves: ${this.frameSize.best.moves} | Time: ${String(this.frameSize.best.time.minutes).length < 2 ? 0 : ''}${this.frameSize.best.time.minutes}:${String(this.frameSize.best.time.seconds).length < 2 ? 0 : ''}${this.frameSize.best.time.seconds}</div>
        <button class="message__button">Close</button>
      </div>`,

      message: `
      <div class="message ${type ? type : ''}">
        <div class="message__body">${str}</div>
        <button class="message__button">Close</button>
      </div>`,
    }

    for (let key in messages) {
      if (key == type) {
        if (document.querySelector('.message')) document.querySelector('.message').remove()
        this.wrap.insertAdjacentHTML('afterbegin', messages[key])
        document.querySelector('.message__button').addEventListener('click', () => {
          document.querySelector('.result').classList.remove('active')
          document.querySelector('.message').remove()
        })
      }
    }
  }

  save() {
    this.frameSize.moves = this.moves
    this.frameSize.blocksMap = this.currentBlocksMap.slice()
    this.frameSize.winnerBlocksResult = this.winnerBlocksResult.slice()
    localStorage.setItem('info', JSON.stringify(this.info))
    console.log('Game saved')
  }

  restore() {
    if (localStorage.getItem('info')) {
      this.info = JSON.parse(localStorage.getItem('info'))

      this.timerElem.textContent = `${String(this.frameSize.time.minutes).length < 2 ? 0 : ''}${this.frameSize.time.minutes}:${String(this.frameSize.time.seconds).length < 2 ? 0 : ''}${this.frameSize.time.seconds}`;

      this.frameSizeInfoElem.textContent = `${this.frameSize.id}x${this.frameSize.id}`;

      this.movesElem.textContent = this.frameSize.moves
      this.moves = this.frameSize.moves

      this.currentBlocksMap = this.frameSize.blocksMap.length !== 0 ? this.frameSize.blocksMap.slice() : false
    }
  }

  isClickOnBlock(x, y) {
    for (let block of this.blocks) {
      if (x >= block.x && x <= (block.x + block.width) && y >= block.y && y <= (block.y + block.height)) {
        this.currentBlock = block
        return true
      }
    }
    return false
  }

  setWinnerBlocksResult() {
    this.winnerBlocksResult = [...Array(this.frameSize.id * this.frameSize.id).keys()]
  }

  isSolved() {
    const w = this.winnerBlocksResult.slice()
    const c = this.currentBlocksMap.flat()
    w.splice(0, 1)
    c.splice(c.length - 1, 1)
    return w.every((e, i) => e == c[i])
  }

  gameOver() {

    this.frameSize.best.time.minutes = this.frameSize.time.minutes;
    this.frameSize.best.time.seconds = this.frameSize.time.seconds;
    this.frameSize.best.moves = this.moves;

    this.save();
    this.message('winner', 'YOU WON!!!');
    console.log('Winner!');
  }
}

const game = new Game({
  wrap: '.game-container',
  startBtn: '.start',
  stopBtn: '.stop',
  saveBtn: '.save',
  resultBtn: '.result',
  timerElem: '.timer span',
  moves: '.moves span',
  frameSizeInfoElem: '.frame-size-info span',
  itemSize: 80,
})
// })

export default Game;



