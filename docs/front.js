import {Game} from './game.js'
import {EventEmitter} from "./eventEmitter.js";

const asyncStart = async () => {
    const  eventEmitter = new EventEmitter()
    const  game = new Game(eventEmitter)

    game.settings.gridSize = {
        columns: 6,
        rows: 4
    }
    game.settings.pointsToWin = 3

    await game.start()

    const tableElement = document.querySelector('#grid')
    const score1Element = document.querySelector('#score1')
    const score2Element = document.querySelector('#score2')

    const render = () => {
        tableElement.innerHTML = ''
        score1Element.innerHTML = ''
        score1Element.append(game.score[1].points)
        score2Element.innerHTML = ''
        score2Element.append(game.score[2].points)


        for (let y=1; y <= game.settings.gridSize.rows; y++) {
            const  trElement = document.createElement('tr')
            for (let x=1; x<= game.settings.gridSize.columns; x++) {
                const  tdElement = document.createElement("td")
                if (game.google.position.x === x && game.google.position.y === y) {
                    const  googleElement = document.createElement('img')
                    googleElement.src = './assets/google.webp'
                    tdElement.appendChild(googleElement)
                }
                if (game.player1.position.x === x && game.player1.position.y === y) {
                    const  player1Element = document.createElement('img')
                    player1Element.src = './assets/player1.png'
                    tdElement.appendChild(player1Element)
                }
                if (game.player2.position.x === x && game.player2.position.y === y) {
                    const  player2Element = document.createElement('img')
                    player2Element.src = './assets/player2.png'
                    tdElement.appendChild(player2Element)
                }
                trElement.appendChild(tdElement)
            }
            tableElement.appendChild((trElement))
        }
    }

    window.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'ArrowUp':
                game.movePlayer1Up()
                break;
            case "ArrowDown":
                game.movePlayer1Down();
                break;
            case "ArrowLeft":
                game.movePlayer1Left();
                break;
            case "ArrowRight":
                game.movePlayer1Right();
                break;
            case "KeyW":
                game.movePlayer2Up();
                break;
            case "KeyS":
                game.movePlayer2Down();
                break;
            case "KeyA":
                game.movePlayer2Left();
                break;
            case "KeyD":
                game.movePlayer2Right();
                break;
        }


    })

    game.eventEmitter.on('unitChangePosition', () => {
        render()
    })
    render()
}
asyncStart()