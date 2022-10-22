document.addEventListener('DOMContentLoaded', () => {

  class Game {
    constructor(setting) {
      this.setting = setting;
      this.frameSize = this.setting.frameSize;
      this.itemSize = this.setting.itemSize;
      this.playField = this.numbers();
      this.movesElem = document.querySelector(this.setting.moves);
      this.wrap = document.querySelector(this.setting.wrap);
      this.startBtn = document.querySelector(this.setting.startBtn);
      this.stopBtn = document.querySelector(this.setting.stopBtn);
      this.saveBtn = document.querySelector(this.setting.saveBtn);
      this.resultBtn = document.querySelector(this.setting.resultBtn);
      this.timerElem = document.querySelector(this.setting.timerElem);
      this.frameSizeInfo = document.querySelector(this.setting.frameSizeInfo);
      this.frameSizeBtns = document.querySelectorAll(this.setting.frameSizeBtns);
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.isGame = false;
      this.time = 0;
      this.info = {
        best: {
          time: { minutes: 0, seconds: 0 },
          moves: 0,
        },
        moves: 0,
        currentTime: { minutes: 0, seconds: 0 },
        frameSize: 0,
      };

      this.init();
    }

    init() {
      this.restore();

      window.addEventListener('resize', () => {
        if (window.innerWidth < 1024) {
          1
          this.itemSize = window.innerWidth / (this.frameSize + 2.5)
          this.drawCanvas();
        } else this.itemSize = this.setting.itemSize
      })

      document.addEventListener('click', (e) => {
        if (e.target == this.startBtn) {
          this.start()
          if (document.querySelector('.message')) document.querySelector('.message').remove()
        };
        if (e.target == this.stopBtn) this.stop();
        if (e.target == this.saveBtn) this.save();
        if (e.target == this.resultBtn) this.result();
        if (e.target.classList.contains('frame-size')) {
          this.frameSize = +e.target.dataset.action;
          this.frameSizeInfo.textContent = `${+e.target.dataset.action}x${+e.target.dataset.action}`;
          this.info.frameSize = this.frameSize;
          this.stop();
          this.numbers();
          this.drawCanvas();
          this.isGame = false
        }
      })
      setTimeout(() => {
        this.drawCanvas();
      }, 0);

    }

    numbers() {

      const arr = Array(this.frameSize * this.frameSize)
        .fill().map((_, i) => i).sort(() => Math.random() - 0.5)

      const res = []

      while (res.length < this.frameSize) {
        res.push(arr.splice(0, this.frameSize));
      }
      this.playField = res;
      return res
    }

    restore() {
      if (localStorage.getItem('info')) {
        this.info = JSON.parse(localStorage.getItem('info'))

        this.timerElem.textContent = `${String(this.info.currentTime.minutes).length < 2 ? 0 : ''}${this.info.currentTime.minutes}:${String(this.info.currentTime.seconds).length < 2 ? 0 : ''}${this.info.currentTime.seconds}`;

        this.frameSize = this.info.frameSize
        this.frameSizeInfo.textContent = `${this.info.frameSize}x${this.info.frameSize}`;
      }
    }

    drawCanvas() {

      if (window.innerWidth < 1024) {
        this.itemSize = window.innerWidth / (this.frameSize + 2.5)
      } else this.itemSize = this.setting.itemSize

      this.ctx = this.canvas.getContext('2d')
      this.canvas.classList.add('game')
      this.canvas.width = this.frameSize * this.itemSize
      this.canvas.height = this.frameSize * this.itemSize

      this.wrap.insertAdjacentElement('afterbegin', this.canvas);

      for (let i = 0; i < this.frameSize; i++) {
        if (i == this.frameSize) i++
        for (let j = 0; j < this.frameSize; j++) {
          this.ctx.save();
          this.ctx.translate(j * this.itemSize, i * this.itemSize);
          this.ctx.strokeStyle = '#e2e2e2'
          this.ctx.strokeRect(0, 0, this.itemSize, this.itemSize);
          this.ctx.font = "20px sans-serif";
          this.ctx.textAlign = 'center';
          this.ctx.fillText(this.playField[i][j], this.itemSize / 2, this.itemSize / 2 + 8)
          this.ctx.restore();
        }
      }
    }

    message(type, str) {
      const result = `
      <div class="message ${type ? type : ''}">
        <div class="message__header"><b>YOUR RESULTS</b></div>
        <div class="message__frame-size">Frame size: ${this.info.frameSize}x${this.info.frameSize}</div>
        <div class="message__time">Time: ${String(this.info.currentTime.minutes).length < 2 ? 0 : ''}${this.info.currentTime.minutes}:${String(this.info.currentTime.seconds).length < 2 ? 0 : ''}${this.info.currentTime.seconds}</div>
        <div class="message__moves">Moves: ${this.info.moves}</div>
        <div class="message__moves"><b>Best result:</b> Moves: ${this.info.best.moves} | Times: ${String(this.info.best.time.minutes).length < 2 ? 0 : ''}${this.info.best.time.minutes}:${String(this.info.best.time.seconds).length < 2 ? 0 : ''}${this.info.best.time.seconds}</div>
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

    save() {
      localStorage.setItem('info', JSON.stringify(this.info))
      console.log('Game saved')
    }

    start() {
      if (this.isGame == true) this.stop();
      this.drawCanvas()
      this.newGame();
      this.timer();
      this.isGame = true;
      console.log('New game started');
    }

    stop() {
      clearInterval(this.time);
      this.numbers();
      this.movesElem.textContent = 0;
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

      this.time = setInterval(() => {
        if (seconds == 59) {
          minutes += 1
          seconds = 0
        }

        seconds += 1

        this.timerElem.textContent = `${String(minutes).length < 2 ? 0 : ''}${minutes}:${String(seconds).length < 2 ? 0 : ''}${seconds}`
        this.info.currentTime = { minutes, seconds }
      }, 1000)
    }

    newGame() {


      return this

    }
  }

  const game = new Game({
    wrap: '.game-container',
    frameSize: 4,
    itemSize: 90,
    startBtn: '.start',
    stopBtn: '.stop',
    saveBtn: '.save',
    resultBtn: '.result',
    timerElem: '.timer span',
    moves: '.moves span',
    frameSizeBtns: '.frame-size',
    frameSizeInfo: '.frame-size-info span'
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





