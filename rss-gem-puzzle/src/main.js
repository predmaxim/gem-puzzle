document.addEventListener('DOMContentLoaded', () => {


  // const canvas = document.querySelector('.game');
  // const game = canvas.getContext('2d');

  class Game {
    constructor(setting) {
      this.setting = setting,
        this.newGame()
    }


    message(str, type) {
      return `<p class="${type ? type : 'message'}">${str}<p/>`
    }

    newGame() {
      const frameSizesData = { 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight' }

      const opt = {
        wrap: document.querySelector(this.setting.wrap),
        itemSize: this.setting.itemSize,
        frameSize: this.setting.frameSize,
        width: this.setting.frameSize * this.setting.itemSize,
        height: this.setting.frameSize * this.setting.itemSize,
      }

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.classList.add('game')
      canvas.width = opt.height
      canvas.height = opt.width

      opt.wrap.insertAdjacentElement('afterbegin', canvas);

      for (let i = 0; i < opt.frameSize; i++) {
        if (i == opt.frameSize) {
          i++
          console.log(opt.frameSize)
        }
        for (let j = 0; j < opt.frameSize; j++) {
          ctx.save();
          ctx.translate(j * opt.itemSize, i * opt.itemSize);
          ctx.strokeRect(0, 0, opt.itemSize, opt.itemSize);
          ctx.fillText(j, 50, 50);
          ctx.restore();
        }
      }

      return this
    }

  }


  const game = new Game({
    wrap: '.game-container',
    frameSize: 4,
    itemSize: 100,
  })

})




// draw(num, pos, elem) {
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