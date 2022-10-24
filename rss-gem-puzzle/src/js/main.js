import Game from './game';

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