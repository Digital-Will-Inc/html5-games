

((document) => {
    // parts of the game board
    let moves = document.querySelector('.moves')
    const capElmt = document.querySelector('.cap')
    // ?
    let board = document.querySelector('#board')
    let colors = document.querySelector('#colors')
    let gameover = document.querySelector('#game-over')

    // control variables 
    let colorArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

    let running = false

    let cell = '-x'
    let skill = 5
    let tally = 0
    let cap = 25
    let color

    //  game play methods
    // ----------------------------
    let shuffle = (collection) => {
        for (let i = collection.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [collection[i - 1], collection[j]] = [collection[j], collection[i - 1]]
        }
        return collection
    }

    let setColors = (collection, n) => {
        return n < 10 ? shuffle(collection).slice(0, n) : collection
    }

    let checkWin = (moves) => {
        let n = 0
        let msg = ''
        if (moves <= cap) {
            if (board.childNodes[99].className.indexOf(cell) > -1) {
                for (var i = 0; i < 100; i++) {
                    if (board.childNodes[i].className.indexOf(cell) > -1) {
                        n++
                    }
                }
            }

            if (n === 100) {
                msg = '<span class="new-game i18nElem">youwin</span>'
                running = false
            } else if (n < 100 && moves >= cap) {
                msg = '<span class="new-game i18nElem">tryagain</span>'
                running = false
            }
        }
        if (!running) {
            gameover.innerHTML = msg
            TranslateDynamicElem(".game-over");
        }
    }

    let checkColor = (color) => {
        let tiles = board.childNodes
        for (var x = 0; x < 100; x++) {
            if (tiles[x].className.indexOf(cell) > -1) {
                tiles[x].className = color + cell
                if (x + 1 < 100 && tiles[x + 1].className === color) {
                    tiles[x + 1].className += cell
                }
                if (x + 10 < 100 && tiles[x + 10].className === color) {
                    tiles[x + 10].className += cell
                }
                if (x - 1 >= 0 && x % 10 > 0 && tiles[x - 1].className === color) {
                    tiles[x - 1].className += cell
                }
                if (x - 10 >= 0 && x % 10 > 0 && tiles[x - 10].className === color) {
                    tiles[x - 10].className += cell
                }
            }
        }
    }

    let builder = (container, element, collection, count, randomize) => {
        container.innerHTML = ''
        count = count || collection.length
        randomize = randomize || false
        for (let i = 0; i < count; i++) {
            let child = document.createElement(element)
            child.className = randomize ? collection[Math.floor((Math.random() * collection.length))] : collection[i]
            container.appendChild(child)
        }
    }

    let newGame = () => {
        let options = setColors(colorArray.slice(), skill)
        tally = 0
        capElmt.innerHTML = cap
        moves.innerText = tally
        //?
        gameover.innerHTML = ''
        running = true
        builder(colors, 'chip', options)
        builder(board, 'tile', options, 100, true)
        color = board.childNodes[0].className
        board.className = ''
        board.childNodes[0].className = color + cell
        checkColor(color)
    }

    let play = (chip) => {
        if (running && color !== chip) {
            color = chip
            if (board.className !== 'started') {
                board.className = 'started'
            }
            tally++
            //?
            checkColor(chip)
            checkWin(tally)
        }
        moves.innerText = tally
    }

    document.addEventListener("DOMContentLoaded", () => {
        newGame()
    }, false)

    document.addEventListener('click', (event) => {
        let css = Array.from(event.target.classList)
        if (event.target.tagName === 'CHIP') {
            play(event.target.className)
        }
        else if (css.includes('new-game')) {
            CallAd(AdTypes.next, "New Game");
            newGame()
        }
    })
})(document)