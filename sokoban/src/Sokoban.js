import {
  EMPTY,
  BLOCK,
  SUCCESS_BLOCK,
  VOID,
  PLAYER,
  directions,
  size,
  multiplier as modifiedMultiplier,
  colors,
  levels,
  getLevelDimensions,
  biggestLevel
} from './constants.js'
import {
  isBlock,
  isWall,
  isTraversible,
  isVoid,
  getX,
  getY,
  countBlocks,
  generateGameBoard,
} from './utils.js'
let multiplier = modifiedMultiplier
class Sokoban {
  constructor({ level }) {
    document.querySelector('.header').classList.remove('d-none')
    this.canvas = document.querySelector('canvas')
    this.canvas.width = size.width
    this.canvas.height = size.height
    const vOverlap = document.querySelector('.board').clientHeight + this.canvas.height - window.innerHeight
    const hOverlap = document.querySelector('.board').clientWidth + this.canvas.width - window.innerWidth
    if (vOverlap > 0 && window.innerHeight > window.innerWidth) {
      const formerHeight = this.canvas.height
      this.canvas.height = this.canvas.height - vOverlap - 35
      this.canvas.width = this.canvas.width * (this.canvas.height / formerHeight)
      size.height = Math.floor(size.height * (this.canvas.height / formerHeight))
      size.width = Math.floor(size.width * (this.canvas.height / formerHeight))
      multiplier = multiplier * (this.canvas.height / formerHeight)
    }
    if (hOverlap > 0 && window.innerHeight < window.innerWidth) {
      const formerWidth = this.canvas.width
      this.canvas.width = this.canvas.width - hOverlap - 35
      this.canvas.height = this.canvas.height * (this.canvas.width / formerWidth)
      size.height = Math.floor(size.height * (this.canvas.width / formerWidth))
      size.width = Math.floor(size.width * (this.canvas.width / formerWidth))
      multiplier = multiplier * (this.canvas.width / formerWidth)
    }
    this.context = this.canvas.getContext('2d')
    this.context.fillStyle = colors.empty
    this.context.fillRect(0, 0, size.width, size.height)
    this.board = generateGameBoard({ level })
    this.boardIndex = level
    this.level = levels[level]
    this.steps = 0
    // const maxLevel = localStorage.getItem("dw-sokoban-maxlevel") ? Number(localStorage.getItem("dw-sokoban-maxlevel")) : 0
    const maxLevel = levels.length
    const currentlevel = localStorage.getItem("dw-sokoban-currentlevel") ? Number(localStorage.getItem("dw-sokoban-currentlevel")) : 0
    if (currentlevel > maxLevel) {
      localStorage.setItem("dw-sokoban-maxlevel", currentlevel)
    }
    this.renderDropdown()
  }
  renderDropdown() {
    // const maxLevel = localStorage.getItem("dw-sokoban-maxlevel") ? Number(localStorage.getItem("dw-sokoban-maxlevel")) : 0
    const maxLevel = levels.length
    const levelSelector = document.querySelector('#levelselector')
    levelSelector.innerHTML = ''
    levels.slice(0, Number(maxLevel) + 1).map((level, index) => {
      const option = document.createElement('option')
      option.value = index
      option.innerText = index + 1
      levelSelector.appendChild(option)
      levelSelector.selectedIndex = localStorage.getItem("dw-sokoban-currentlevel") ? Number(localStorage.getItem("dw-sokoban-currentlevel")) : 0
    })
  }
  paintCell(context, cell, x, y) {
    const levelDimension = getLevelDimensions(this.board)
    const offset = { row: Math.floor((biggestLevel.row - levelDimension.row) / 2), col: Math.floor((biggestLevel.col - levelDimension.col) / 2) }
    x = x + offset.col
    y = y + offset.row
    if (cell === 'void' || cell === 'player') {
      const circleSize = cell === 'player' ? multiplier / 3 : multiplier / 5
      this.context.beginPath()
      this.context.rect(x * multiplier - 1, y * multiplier - 1, multiplier - 0.5, multiplier - 0.5)
      this.context.fillStyle = colors.empty.fill
      this.context.fill()
      this.context.beginPath()
      this.context.arc(x * multiplier + (multiplier - (multiplier / 2) - 1.5), y * multiplier + (multiplier - (multiplier / 2) - 1.5), circleSize, 0, 2 * Math.PI)
      this.context.lineWidth = multiplier / 10
      this.context.strokeStyle = colors[cell].stroke
      this.context.fillStyle = colors[cell].fill
      this.context.fill()
      this.context.stroke()
    } else {
      this.context.beginPath()
      this.context.rect(x * multiplier, y * multiplier, multiplier - 2.5, multiplier - 2.5)
      this.context.fillStyle = colors[cell].fill
      this.context.fill()
      this.context.rect(x * multiplier, y * multiplier, multiplier - 2.5, multiplier - 2.5)
      this.context.lineWidth = multiplier / 10
      this.context.strokeStyle = colors[cell].stroke
      this.context.stroke()
    }
  }
  render(options = {}) {
    const highscore = localStorage.getItem('dw-sokoban-highscore') ? JSON.parse(localStorage.getItem('dw-sokoban-highscore')) : {}
    const highscoreSelector = document.querySelector('#highscore #score tbody')
    highscoreSelector.innerHTML = ""
    Object.keys(highscore).map(score => {
      const row = document.createElement('tr')
      const cell = document.createElement('td')
      const cell2 = document.createElement('td')
      cell.innerText = `${Number(score) + 1}`
      cell2.innerText = `${highscore[score]}`
      row.appendChild(cell)
      row.appendChild(cell2)
      highscoreSelector.appendChild(row)
    })
    this.context = this.canvas.getContext('2d')
    this.context.fillStyle = "#202020"
    this.context.fillRect(0, 0, size.width, size.height)
    if (options.restart) {
      this.steps = 0
      this.board = generateGameBoard({ level: this.boardIndex })
      document.querySelector('#steps').innerHTML = `${this.steps}`
    }
    if (options.level !== undefined) {
      this.level = levels[options.level]
      this.steps = 0
      document.querySelector('#steps').innerHTML = `${this.steps}`
      this.boardIndex = options.level
      this.board = generateGameBoard({ level: options.level })
    }
    this.board.forEach((row, y) => {
      row.forEach((cell, x) => {
        this.paintCell(this.context, cell, x, y)
      })
    })
    const rowsWithVoid = this.board.filter((row) => row.some((entry) => entry === VOID))
    // The player herself might be standing on an initially void cell:
    if (isVoid(this.board[this.findPlayerCoords().y][this.findPlayerCoords().x])) {
      rowsWithVoid.push(this.board[this.findPlayerCoords().y]);
    }
    const rowsWithSuccess = this.level.flatMap(a => a).filter(a => a === "void" || a === "success_block")
    const levelSuccessBlocks = this.board.flatMap(a => a).filter(a => a === "success_block")
    const isWin = rowsWithVoid.length === 0 && rowsWithSuccess.length === levelSuccessBlocks.length
    if (isWin) {
      document.querySelector('#winpopup').classList.remove('d-none')
      document.querySelector('#winpopup #score').innerHTML = this.steps

      localStorage.setItem("dw-sokoban-highscore",
        highscore
          ? JSON.stringify({ ...highscore, [this.boardIndex]: highscore[this.boardIndex] == undefined || highscore[this.boardIndex] > this.steps ? this.steps : highscore[this.boardIndex] })
          : JSON.stringify({ [this.boardIndex]: this.steps }))
      this.boardIndex++
      if (Number(localStorage.getItem("dw-sokoban-maxlevel")) <= this.boardIndex) {
        localStorage.setItem("dw-sokoban-maxlevel", this.boardIndex)
      }
      this.level = levels[this.boardIndex]
      this.renderDropdown()
      document.querySelector('#levelselector').selectedIndex = this.boardIndex
      localStorage.setItem("dw-sokoban-currentlevel", this.boardIndex)

    }
  }
  findPlayerCoords() {
    const y = this.board.findIndex((row) => row.includes(PLAYER))
    const x = this.board[y].indexOf(PLAYER)

    return {
      x,
      y,
      above: this.board[y - 1][x],
      below: this.board[y + 1][x],
      sideLeft: this.board[y][x - 1],
      sideRight: this.board[y][x + 1],
    }
  }
  movePlayer(playerCoords, direction) {
    // Replace previous spot with initial board state (void or empty)
    this.board[playerCoords.y][playerCoords.x] =
      isVoid(this.level[playerCoords.y][playerCoords.x]) ? VOID : EMPTY
    // Move player
    this.board[getY(playerCoords.y, direction, 1)][getX(playerCoords.x, direction, 1)] = PLAYER
    this.steps++
    document.querySelector('#steps').innerHTML = `${this.steps}`
  }
  movePlayerAndBoxes(playerCoords, direction) {
    const newPlayerY = getY(playerCoords.y, direction, 1)
    const newPlayerX = getX(playerCoords.x, direction, 1)
    const newBoxY = getY(playerCoords.y, direction, 2)
    const newBoxX = getX(playerCoords.x, direction, 2)
    // Don't move if the movement pushes a box into a wall
    if (isWall(this.board[newBoxY][newBoxX])) {
      return
    }
    // Count how many blocks are in a row
    let blocksInARow = 0
    if (isBlock(this.board[newBoxY][newBoxX])) {
      blocksInARow = countBlocks(1, newBoxY, newBoxX, direction, this.board)
      // See what the next block is
      const nextBlock =
        this.board[getY(newPlayerY, direction, blocksInARow)][
        getX(newPlayerX, direction, blocksInARow)
        ]
      // Push all the blocks if you can
      if (isTraversible(nextBlock)) {
        for (let i = 0; i < blocksInARow; i++) {
          // Add blocks
          this.board[getY(newBoxY, direction, i)][getX(newBoxX, direction, i)] =
            isVoid(this.board[getY(newBoxY, direction, i)][getX(newBoxX, direction, i)])
              ? SUCCESS_BLOCK
              : BLOCK
        }
        this.movePlayer(playerCoords, direction)
      }
    } else {
      // Move box
      // If on top of void, make into a success box
      this.board[newBoxY][newBoxX] = isVoid(this.board[newBoxY][newBoxX]) ? SUCCESS_BLOCK : BLOCK
      this.movePlayer(playerCoords, direction)
    }
  }

  move(playerCoords, direction) {
    const { x, y, above, below, sideLeft, sideRight } = playerCoords
    const adjacentCell = {
      [directions.up]: above,
      [directions.down]: below,
      [directions.left]: sideLeft,
      [directions.right]: sideRight,
    }
    if (isTraversible(adjacentCell[direction])) {
      this.movePlayer(playerCoords, direction)
    }
    if (isBlock(adjacentCell[direction])) {
      this.movePlayerAndBoxes(playerCoords, direction)
    }
  }
}
export default Sokoban