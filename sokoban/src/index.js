import { directions, keys, levels } from './constants.js'
import Sokoban from './Sokoban.js'
const levelSelector = document.querySelector('#levelselector')
var WORTAL_API_INIT_SCRIPT = document.createElement("script");
WORTAL_API_INIT_SCRIPT.src = "dist/WortalAd.js";
WORTAL_API_INIT_SCRIPT.type = 'text/javascript';
const head = document.getElementsByTagName("head");

const noAdDomains = ["locaxxlhost", 't.tmy.io']
const isProd = noAdDomains.filter(url => window.location.href.includes(url)).length === 0
if (isProd) {
  head[head.length - 1].appendChild(WORTAL_API_INIT_SCRIPT);
} else {
  document.getElementById("black-cover").hidden = true;
}

// init
const cachedLevel = localStorage.getItem("dw-sokoban-currentlevel")
const theLevel = cachedLevel ? Number(cachedLevel) : 0
let sokoban
sokoban = new Sokoban({ level: theLevel })
sokoban.render()
const move = (event) => {
  const playerCoords = sokoban.findPlayerCoords()

  switch (event.key) {
    case keys.up:
    case keys.w:
      sokoban.move(playerCoords, directions.up)
      break
    case keys.down:
    case keys.s:
      sokoban.move(playerCoords, directions.down)
      break
    case keys.left:
    case keys.a:
      sokoban.move(playerCoords, directions.left)
      break
    case keys.right:
    case keys.d:
      sokoban.move(playerCoords, directions.right)
      break
    default:
  }

  sokoban.render()
}
Array.from(document.querySelectorAll('.menubutton')).map(button => button.addEventListener('click', (event) => {
  document.querySelector('.header').classList.toggle('menutoggled')
}))
Array.from(document.querySelectorAll(".directionbutton")).map(button => {
  button.addEventListener('click', (event) => {
    event.key = event.target.dataset.key
    move(event)
  })
})
document.addEventListener('keydown', (event) => move(event))

document.querySelector('button#restartbutton').addEventListener('click', (event) => {
  CallAd(AdTypes.next, "Restart");
  levelSelector.value = theLevel
  event.target.closest(".menutoggled") && event.target.closest(".menutoggled").classList.remove('menutoggled')
  sokoban.render({ restart: true })
})
Array.from(document.querySelectorAll('.popup .closebutton')).map(button => {
  button.addEventListener('click', (event) => {
    button.closest('.popup').classList.toggle('d-none')
  })
})
document.querySelector('button.highscorebutton').addEventListener('click', (event) => {
  document.querySelector('#highscore').classList.remove('d-none')
})
document.querySelector('button.nextbutton').addEventListener('click', (event) => {
  document.querySelector('#winpopup').classList.add('d-none')
  if (isProd) {
    CallAd(AdTypes.next, "Win level");
  }
  sokoban.render({ level: sokoban.boardIndex })
})
levelSelector.addEventListener('change', (event) => {
  localStorage.setItem("dw-sokoban-currentlevel", event.target.value)
  sokoban.render({ level: Number(event.target.value) })
  document.querySelector('.header').classList.remove('menutoggled')
  event.target.blur()
})
