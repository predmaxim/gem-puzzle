document.addEventListener('DOMContentLoaded', () => {

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
      this.frameSize = 4;
      this.moves = 0,
        this.info = {
          frameSize: this.frameSize,
          moves: 0,
          blocks: [],
          time: { minutes: 0, seconds: 0 },
          best: { time: { minutes: 0, seconds: 0 }, moves: 0, frameSize: 0, },
          blocksNumbers: [],
        };
      this.itemSize = 0;
      this.blocksNumbers = [];
      this.isGame = false;
      this.isTimer = 0;
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.blocks = [];
      this.zeroBlock = [];
      this.currentBlock = {}
      this.init();
    }

    init() {
      // this.restore();
      this.info.blocksNumbers.length == 0 ? this.setPlayField() : this.blocksNumbers = this.info.blocksNumbers;
      this.setCanvas();

      window.addEventListener('resize', () => {
        if (window.innerWidth < 900) {
          this.itemSize = Math.floor(window.innerWidth / (this.frameSize + 2))
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
          this.frameSize = +e.target.dataset.action;
          this.frameSizeInfoElem.textContent = `${+e.target.dataset.action}x${+e.target.dataset.action}`;
          this.info.frameSize = this.frameSize
          this.stop();
          this.setCanvas();
        }
      })
    }

    setPlayField() {

      const arr = Array(this.frameSize * this.frameSize)
        .fill().map((_, i) => i).sort(() => Math.random() - 0.5)

      const res = []

      while (res.length < this.frameSize) {
        res.push(arr.splice(0, this.frameSize));
      }
      this.blocksNumbers = res;
      // console.log(this.blocksNumbers)
      return res
    }

    save() {
      localStorage.setItem('info', JSON.stringify(this.info))
      console.log('Game saved')
    }

    restore() {
      if (localStorage.getItem('info')) {
        this.info = JSON.parse(localStorage.getItem('info'))

        this.timerElem.textContent = `${String(this.info.time.minutes).length < 2 ? 0 : ''}${this.info.time.minutes}:${String(this.info.time.seconds).length < 2 ? 0 : ''}${this.info.time.seconds}`;

        this.frameSize = this.info.frameSize
        this.frameSizeInfoElem.textContent = `${this.frameSize}x${this.frameSize}`;

        this.movesElem.textContent = this.info.moves
        // this.blocks.textContent = this.info.blocks
      }
    }

    setCanvas() {
      this.itemSize = window.innerWidth < 900
        ? Math.floor(window.innerWidth / (this.frameSize + 2))
        : this.setting.itemSize;
      this.canvas.classList.add('game')
      this.canvas.width = this.frameSize * this.itemSize
      this.canvas.height = this.canvas.width

      this.wrap.insertAdjacentElement('afterbegin', this.canvas);

      let tempBlocks = [];
      for (let i = 0; i < this.frameSize; i++) {
        for (let j = 0; j < this.frameSize; j++) {
          this.ctx.save();
          this.ctx.translate(j * this.itemSize + 2, i * this.itemSize + 2);
          this.ctx.fillStyle = '#e2e2e2'
          this.ctx.fillRect(0, 0, this.itemSize - 4, this.itemSize - 4);

          if (this.blocksNumbers[i][j] === 0) {
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(0, 0, this.itemSize - 4, this.itemSize - 4);

            // zero block info to zeroBlock variable
            this.zeroBlock = {
              name: this.blocksNumbers[i][j],
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
          this.ctx.font = window.innerWidth < 400 && this.frameSize > 5
            ? "12px sans-serif"
            : "20px sans-serif";
          window.innerWidth < 400 && this.frameSize > 5
            ? this.ctx.fillText(this.blocksNumbers[i][j], this.itemSize / 2, this.itemSize / 2)
            : this.ctx.fillText(this.blocksNumbers[i][j], this.itemSize / 2, this.itemSize / 2)
          this.ctx.restore();

          // push new block info to blocks array
          tempBlocks.push({
            name: this.blocksNumbers[i][j],
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

    message(type, str) {
      const result = `
      <div class="message ${type ? type : ''}">
        <div class="message__header"><b>YOUR RESULTS</b></div>
        <div class="message__frame-size">Frame size: ${this.frameSize}x${this.frameSize}</div>
        <div class="message__time">Time: ${String(this.info.time.minutes).length < 2 ? 0 : ''}${this.info.time.minutes}:${String(this.info.time.seconds).length < 2 ? 0 : ''}${this.info.time.seconds}</div>
        <div class="message__moves">Moves: ${this.info.moves}</div>
        <div class="message__moves"><b>Best result:</b> Moves: ${this.info.best.moves} | Time: ${String(this.info.best.time.minutes).length < 2 ? 0 : ''}${this.info.best.time.minutes}:${String(this.info.best.time.seconds).length < 2 ? 0 : ''}${this.info.best.time.seconds}</div>
        <button class="message__button">Close</button>
      </div>`

      const message = `
      <div class="message ${type ? type : ''}">
        <div class="message__body">${str}</div>
        <button class="message__button">Close</button>
      </div>`

      if (document.querySelector('.message')) document.querySelector('.message').remove()

      if (type == 'result') {
        this.wrap.insertAdjacentHTML('afterbegin', result)
      } else {
        this.wrap.insertAdjacentHTML('afterbegin', message)
      }


      document.querySelector('.message__button').addEventListener('click', () => document.querySelector('.message').remove())

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

        this.blocksNumbers = this.blocksNumbers.map((arr) => {
          return arr.map(e => {
            if (e == 0) e = this.currentBlock.name
            else if (e == this.currentBlock.name) e = 0
            return e
          })

        })

        this.moves += 1
        this.info.moves = this.moves
        this.movesElem.textContent = this.moves
        // console.log(this.isSolved())
        this.setCanvas()
        // if (!this.isSolved()) this.setCanvas()
        // else this.gameOver()
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
      if (this.isGame == true) this.stop();
      if (document.querySelector('.message')) document.querySelector('.message').remove();
      this.info.blocksNumbers.length = 0
      // this.setPlayField()
      this.moves = 0
      this.setCanvas()
      this.timer();
      this.isGame = true;
      console.log('New game started');
    }

    stop() {
      clearInterval(this.isTimer);
      this.setPlayField();
      this.movesElem.textContent = 0;
      this.moves = 0
      this.timerElem.textContent = `00:00`;
      this.isGame = false;
      console.log('Game stopped');
    }

    result() {
      this.message('result')
    }

    timer() {
      console.log('Timer Started')
      let minutes = 0, seconds = 0

      this.isTimer = setInterval(() => {
        if (seconds == 59) {
          minutes += 1
          seconds = 0
        }

        seconds += 1

        this.timerElem.textContent = `${String(minutes).length < 2 ? 0 : ''}${minutes}:${String(seconds).length < 2 ? 0 : ''}${seconds}`
        this.info.time = { minutes, seconds }
      }, 1000)
    }

    isSolved() {
      let res
      this.blocksNumbers.forEach((arr, i, a) => {
        res = arr.filter((e, i) => e == i)
          .every((e, ind) => e == a[i][ind])
      })
      return res
    }

    gameOver() {
      this.message('winner', 'You winner!!!')
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

  // draw(num, pos, elem) {
  //   const frameSizesData = { 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight' }

  //   if (!frameSizesData[num]) return gameContainerElem.insertAdjacentHTML(pos, this.message('Wrong frame size!'))

  //   gameElem.setAttribute('class', `game ${frameSizesData[num]}`)

  //   let random = [];
  //   const n = num * num - 1;
  //   while (random.length < n) {
  //     let r = Math.floor(Math.random() * n) + 1;
  //     if (!random.includes(r)) random.push(r);
  //   }


  //   const items = [...Array(num).keys()].map(i => `<div class="game__item"><span>${random[i]}</span></div>`)
  //   return items.map((el) => elem.insertAdjacentHTML(pos, el))
  // }





})





