import { playList } from "./playlist.js"

const player = document.querySelector('.player')
const songName = player.querySelector('.song-name')
const playBtn = player.querySelector('.play')
const playPrevBtn = player.querySelector('.play-prev')
const playNextBtn = player.querySelector('.play-next')
const playListUl = player.querySelector('.play-list')
const muteButton = player.querySelector('#muteButton')
const songTimer = player.querySelector('.duration-timer')
const progressBar = player.querySelector('.transLayer')
let soundProgress = player.querySelector('#soundProgress')
let soundVolume = player.querySelector('#soundVolume')
let currentTime = 0
let duration = 0
let restoreVolume = 0
const audio = new Audio()
let isPlay = false

songTimer.innerHTML = `00:00 / 00:00`
songName.innerHTML = localStorage.getItem('songName') ? localStorage.getItem('songName') : 'No audio'
soundVolume.value = localStorage.getItem('soundVolume') ? localStorage.getItem('soundVolume') : 0.8
// audio.currentTime = localStorage.getItem('currentTime') ? localStorage.getItem('currentTime') : 0
soundProgress.style.width = localStorage.getItem('soundProgress') ? localStorage.getItem('soundProgress') : 0



const setLocalStorage = () => {
  localStorage.setItem('trackNum', trackNum)
  localStorage.setItem('songName', playList[trackNum].name)
  localStorage.setItem('soundVolume', soundVolume.value)
  localStorage.setItem('currentTime', audio.currentTime)
  localStorage.setItem('soundProgress', soundProgress.style.width)
}

const getLocalStorage = () => {
  localStorage.getItem('trackNum') ? trackNum = +localStorage.getItem('trackNum') : false
  localStorage.getItem('songName') ? playList[trackNum].name = localStorage.getItem('songName') : 'No audio'
  localStorage.getItem('soundVolume') ? soundVolume.value = localStorage.getItem('soundVolume') : 0.8
  localStorage.getItem('currentTime') ? audio.currentTime = localStorage.getItem('currentTime') : 0
  localStorage.getItem('soundProgress') ? soundProgress.style.width = localStorage.getItem('soundProgress') : 0
}

for (const track of playList) playListUl.insertAdjacentHTML('beforeEnd', `<li class="play-item">${track.name}<div class="song-duration"></li>`)

const playItems = player.querySelectorAll('.play-item')
let trackNum = localStorage.getItem('trackNum') ? +localStorage.getItem('trackNum') : 0


const playAudio = (t) => {
  audio.src = playList[t].src
  songName.textContent = playList[t].name
  audio.volume = soundVolume.value


  if (!isPlay) {
    audio.play()
    playBtn.classList.add('pause')
    playItems[t].classList.add('item-active')
    setLocalStorage()
    isPlay = true
  } else {
    
    audio.pause()
    playBtn.classList.remove('pause')
    playItems.forEach(e => e.classList.remove('item-active'))
    isPlay = false
  }

}

const playNext = () => {
  playItems[trackNum].classList.remove('item-active')

  if (trackNum < playList.length - 1) {
    trackNum += 1
  } else {
    trackNum = 0
  }

  isPlay = false
  playAudio(trackNum)

}

const playPrev = () => {
  playItems[trackNum].classList.remove('item-active')

  if (trackNum > 0) {
    trackNum -= 1
  } else {
    trackNum = playList.length - 1
  }

  isPlay = false
  playAudio(trackNum)
}

const muter = () => {

  if (audio.volume === 0) {
    audio.volume = restoreVolume
    soundVolume.value = restoreVolume
  } else {
    restoreVolume = +soundVolume.value
    audio.volume = 0
    soundVolume.value = 0
  }
}

const seek = (per) => {
  audio.currentTime = Math.floor((per / progressBar.getBoundingClientRect().width) * 100 || 0)
  soundProgress.style.width = `${audio.currentTime}%`
}

document.addEventListener('click', (e) => {
  e.target === playBtn ? playAudio(trackNum) : false
  e.target === playPrevBtn ? playPrev() : false
  e.target === playNextBtn ? playNext() : false
  e.target === muteButton ? muter() : false
  e.target === muteButton.querySelector('svg') ? muter() : false
  e.target === muteButton.querySelector('path') ? muter() : false
  e.target === progressBar ? seek(e.offsetX) : false  

  playItems.forEach((el, idx) => {
    if (e.target === el) {
      trackNum = idx
      playItems.forEach(elem => elem.classList.remove('item-active'))
      isPlay = false
      playAudio(trackNum)
    }
  })
})

const secMinFormatter = (secs) => {
  let minutes = Math.floor(secs / 60) || 0
  let seconds = (secs - minutes * 60) || 0

  return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

audio.addEventListener('timeupdate', () => {
  currentTime = Math.floor(audio.currentTime) !== NaN ? Math.floor(audio.currentTime) : 0
  duration = Math.floor(audio.duration) !== NaN ? Math.floor(audio.duration) : 0
  
  soundProgress.style.width = `${(((currentTime / duration) * 100) || 0)}%`
  songTimer.innerHTML = `${secMinFormatter(currentTime)} / ${secMinFormatter(duration)}`
  currentTime >= duration ? playNext() : false
  // console.log(audio.currentTime, currentTime)
})



soundVolume.oninput = () => audio.volume = soundVolume.value
audio.addEventListener('onended', () => playNext())
window.addEventListener('beforeunload', setLocalStorage)
window.addEventListener('load', getLocalStorage)