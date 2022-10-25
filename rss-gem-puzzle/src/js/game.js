class Game {

  constructor(setting) {
    this.setting = setting;
    this.info = [
      {
        id: 3,
        time: { minutes: 0, seconds: 0 },
        moves: 0,
        blocksMap: [],
        winnerBlocksResult: [...Array(9).keys()],
        best: {
          time: { minutes: 0, seconds: 0 },
          moves: 0,
        },
        last: false
      },
      {
        id: 4,
        time: { minutes: 0, seconds: 0 },
        moves: 0,
        blocksMap: [],
        winnerBlocksResult: [...Array(16).keys()],
        best: {
          time: { minutes: 0, seconds: 0 },
          moves: 0,
        },
        last: false
      },
      {
        id: 5,
        time: { minutes: 0, seconds: 0 },
        moves: 0,
        blocksMap: [],
        winnerBlocksResult: [...Array(25).keys()],
        best: {
          time: { minutes: 0, seconds: 0 },
          moves: 0,
        },
        last: false
      },
      {
        id: 6,
        time: { minutes: 0, seconds: 0 },
        moves: 0,
        blocksMap: [],
        winnerBlocksResult: [...Array(36).keys()],
        best: {
          time: { minutes: 0, seconds: 0 },
          moves: 0,
        },
        last: false
      },
      {
        id: 7,
        time: { minutes: 0, seconds: 0 },
        moves: 0,
        blocksMap: [],
        winnerBlocksResult: [...Array(49).keys()],
        best: {
          time: { minutes: 0, seconds: 0 },
          moves: 0,
        },
        last: false
      },
      {
        id: 8,
        time: { minutes: 0, seconds: 0 },
        moves: 0,
        blocksMap: [],
        winnerBlocksResult: [...Array(64).keys()],
        best: {
          time: { minutes: 0, seconds: 0 },
          moves: 0,
        },
        last: false
      },
    ];
    this.defaultFSid = 4;
    this.itemSize = 80;
    this.minutes = 0;
    this.seconds = 0;
    this.moves = 0;
    this.isGame = false;
    this.isTimer = 0;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.blocks = [];
    this.zeroBlock = [];
    this.currentBlock = {};
    this.createPage();
    this.init();
  }

  init() {
    this.restore(this.defaultFSid);
    console.log(this.frameSize)
    // this.setCurrentBlocksMap(this.frameSize.id)
    this.setCanvas();
    this.playAudio();

    window.addEventListener('resize', () => {
      if (window.innerWidth < 600) {
        this.itemSize = Math.floor(window.innerWidth / (this.frameSize.id + 2))
        this.setCanvas();
      } else if (window.innerWidth >= 600) this.itemSize = 80
    })

    document.addEventListener('click', (e) => {
      if (e.target == this.canvas && this.isGame) this.moveBlock(e);
      if (e.target == this.startBtn) this.start();
      if (e.target == this.stopBtn) this.stop();
      if (e.target == this.saveBtn) this.save();
      if (e.target == this.resultBtn) this.result();
      if (e.target.classList.contains('frame-size')) {

        this.stop();
        this.clearMoves();
        this.clearTimer();


        this.restore(+e.target.dataset.action);
        // this.setCurrentBlocksMap(+e.target.dataset.action)

        this.setCanvas();
        this.frameSizeInfoElem.textContent = `${this.frameSize.id}x${this.frameSize.id}`
      }
    })
  }

  createPage() {
    if (!document.querySelector('container')) {

      const container = document.createElement('div')
      container.className = 'container'
      document.body.prepend(container)

      let h1 = document.createElement('h1')
      h1.textContent = 'RSS Gem Puzzle'
      container.prepend(h1)

      let buttons = document.createElement('div')
      buttons.className = 'buttons'
      container.append(buttons)

      for (let button of ['start', 'stop', 'save', 'result']) {
        let b = document.createElement('button')
        b.className = `${button}`
        b.textContent = `${button}`
        buttons.append(b)
      }

      let currentInfo = document.createElement('div')
      currentInfo.className = 'current-info'
      container.append(currentInfo)

      currentInfo.insertAdjacentHTML('afterbegin', '<div class="timer">Time: <span>00:00</span></div>')
      currentInfo.insertAdjacentHTML('afterbegin', '<div class="moves">Moves: <span>0</span></div>')

      let gameContainer = document.createElement('div')
      gameContainer.className = 'game-container'
      container.append(gameContainer)

      let frameSizeInfo = document.createElement('div')
      frameSizeInfo.className = 'frame-size-info'
      container.append(frameSizeInfo)

      frameSizeInfo.insertAdjacentHTML('afterbegin', 'Frame size: <span></span></div>')

      let otherFrameSizes = document.createElement('div')
      otherFrameSizes.className = 'other-frame-sizes'
      container.append(otherFrameSizes)

      otherFrameSizes.innerHTML += 'Other sizes:'

      for (let frameSize of this.info) {
        let a = document.createElement('a')
        a.href = '#'
        a.className = `frame-size`
        a.setAttribute('data-action', `${frameSize.id}`)
        a.textContent = `${frameSize.id}x${frameSize.id}`
        otherFrameSizes.append(a)
      }

      this.movesElem = document.querySelector('.moves span')
      this.wrap = gameContainer
      this.startBtn = document.querySelector('.start')
      this.stopBtn = document.querySelector('.stop');
      this.saveBtn = document.querySelector('.save');
      this.resultBtn = document.querySelector('.result');
      this.timerElem = document.querySelector('.timer span');
      this.frameSizeInfoElem = document.querySelector('.frame-size-info span');
    }
  }

  setCurrentBlocksMap(fs) {
    if (this.info.filter(e => e.id == fs)[0].blocksMap.length === 0) {

      const s = this.info.filter(e => e.id == fs)[0]

      const arr = s.winnerBlocksResult.slice()

      const res = []

      for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }

      while (res.length < s.id) {
        res.push(arr.splice(0, s.id));
      }

      this.frameSize.blocksMap = res.slice();

    } else this.frameSize.blocksMap = this.info.filter(e => e.id == fs)[0].blocksMap.slice()



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

        if (this.frameSize.blocksMap[i][j] === 0) {
          this.ctx.fillStyle = '#fff';
          this.ctx.fillRect(0, 0, this.itemSize - 4, this.itemSize - 4);

          // zero block info to zeroBlock variable
          this.zeroBlock = {
            name: this.frameSize.blocksMap[i][j],
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
          ? this.ctx.fillText(this.frameSize.blocksMap[i][j], this.itemSize / 2, this.itemSize / 2)
          : this.ctx.fillText(this.frameSize.blocksMap[i][j], this.itemSize / 2, this.itemSize / 2)
        this.ctx.restore();

        // push new block info to blocks array
        tempBlocks.push({
          name: this.frameSize.blocksMap[i][j],
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
      this.playAudio().play()

      this.frameSize.blocksMap = this.frameSize.blocksMap.map((arr) => {
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

    if (this.isGame === true) {
      this.clearMoves();
      this.clearTimer();
      this.minutes = 0;
      this.seconds = 0;

      this.setCurrentBlocksMap();
      this.setCanvas()
    }

    this.setCanvas()
    this.timer();
    this.isGame = true;
    console.log('Game started');
  }

  stop() {
    document.querySelector('.start').classList.remove('active')
    clearInterval(this.isTimer);
    this.isGame = false;
    console.log('Game stopped');
  }

  result() {
    this.message('result')
    document.querySelector('.result').classList.add('active')
  }

  timer() {
    console.log('Timer Started')

    this.isTimer = setInterval(() => {
      if (this.seconds == 59) {
        this.minutes += 1
        this.seconds = 0
      }
      this.seconds += 1

      this.timerElem.textContent = `${String(this.minutes).length < 2 ? 0 : ''}${this.minutes}:${String(this.seconds).length < 2 ? 0 : ''}${this.seconds}`
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
    const s = this.info.filter(e => e.id == this.frameSize.id)[0]

    s.moves = this.moves
    s.time.minutes = this.minutes
    s.time.seconds = this.seconds
    s.blocksMap = this.frameSize.blocksMap

    if (this.isSolved()) {
      s.best.time.minutes = this.time.minutes;
      s.best.time.seconds = this.time.seconds;
      s.best.moves = this.moves;
    }


    localStorage.setItem('info', JSON.stringify(this.info))
    console.log('Game saved')
  }

  getFrameSize(fs) {
    return JSON.parse(JSON.stringify(this.info.filter(e => e.id === fs)[0]))
  }

  setFrameSize(fs) {

    if (this.frameSize) this.info.filter(e => e.id === this.frameSize.id)[0].last = false
    this.info.filter(e => e.id === fs)[0].last = true
    this.frameSize = this.getFrameSize(fs)

  }

  restore(fs) {

    if (localStorage.getItem('info')) this.info = JSON.parse(localStorage.getItem('info'))

    const s = this.info.filter(e => e.id == fs)[0]
    this.setFrameSize(fs)
    this.setCurrentBlocksMap(fs)

    this.timerElem.textContent = `${String(this.frameSize.time.minutes).length < 2 ? 0 : ''}${this.frameSize.time.minutes}:${String(this.frameSize.time.seconds).length < 2 ? 0 : ''}${this.frameSize.time.seconds}`;
    this.moves = this.frameSize.moves
    this.movesElem.textContent = this.frameSize.moves
    this.frameSizeInfoElem.textContent = `${this.frameSize.id}x${this.frameSize.id}`;

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


  isSolved() {
    const w = this.frameSize.winnerBlocksResult.slice()
    const c = this.frameSize.blocksMap.flat()
    w.splice(0, 1)
    c.splice(c.length - 1, 1)
    return w.every((e, i) => e == c[i])
  }

  gameOver() {
    this.save();
    this.message('winner', 'YOU WON!!!');
    console.log('Winner!');
  }

  playAudio() {
    return new Audio('../assets/audio/adriantnt_u_click.mp3');
  }
}


export default Game;



