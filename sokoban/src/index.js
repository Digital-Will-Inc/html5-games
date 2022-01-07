import { directions, keys, levels } from './constants.js'
import Sokoban from './Sokoban.js'
const levelSelector = document.querySelector('#levelselector')

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
  levelSelector.value = theLevel
  sokoban.render({ restart: true })
})
Array.from(document.querySelectorAll('button.highscorebutton')).map(button => {
  button.addEventListener('click', (event) => {
    document.querySelector('#highscore').classList.toggle('d-none')
  })
})
levelSelector.addEventListener('change', (event) => {
  localStorage.setItem("dw-sokoban-currentlevel", event.target.value)
  sokoban.render({ level: Number(event.target.value) })
  document.querySelector('.header').classList.remove('menutoggled')
  event.target.blur()
})
