import { directions, keys, levels } from './constants.js'
import Sokoban from './Sokoban.js'
const levelSelector = document.querySelector('#levelselector')

// init
const cachedLevel = localStorage.getItem("dw-sokoban-currentlevel")
const theLevel = cachedLevel ? Number(cachedLevel) : 0
let sokoban
// window.triggerWortalAd("preroll", "Game initialized ad", function () {
//   console.log("Before ad!");
// }, function () {
//   console.log("After ad");
// }, function () {
//   console.log("adBreakDone");
// });
// setTimeout(() => {
  sokoban = new Sokoban({ level: theLevel })
  sokoban.render()
// }, 1000);
// re-render
document.addEventListener('keydown', (event) => {
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
})

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
  event.target.blur()
})
