import { GameProxy as Game } from "./gameProxy.js";

import { EventEmitter } from "./eventEmitter.js";

const asyncStart = async () => {
    const eventEmitter = new EventEmitter();
    const game = new Game(eventEmitter);

    await game.start();


    const tableElement = document.querySelector("#grid");
    const score1Element = document.querySelector("#score1");
    const score2Element = document.querySelector("#score2");
    const conditionElement = document.querySelector("#condition");

    let renderCounter = 0;

    const render = async (counter) => {

        tableElement.innerHTML = "";
        score1Element.innerHTML = "";
        score2Element.innerHTML = "";
        conditionElement.innerHTML = "";

        const score = await game.getScore()
        if (counter < renderCounter) {
            console.log("BREAK")
            return;
        }
        const settings = await game.getSettings()
        if (counter < renderCounter) {
            console.log("BREAK")
            return;
        }
        conditionElement.append(`условие победы: ${settings.pointsToWin} раз поймать GOOGLE (надо на него стать как можно быстрее). GOOGLE
        перемещается каждые ${settings.googleJumpInterval/1000} секунды. После окончания игра перезапускается через 5 секунд.`);
        const google = await game.getGoogle()
        if (counter < renderCounter) {
            console.log("BREAK")
            return;
        }
        const player1 = await game.getPlayer1()
        if (counter < renderCounter) {
            console.log("BREAK")
            return;
        }
        const player2 = await game.getPlayer2()
        if (counter < renderCounter) {
            console.log("BREAK")
            return;
        }

        score1Element.append(`${score[1].points}`);
        score2Element.append(`${score[2].points}`);

        for (let y = 1; y <= settings.gridSize.rows; y++) {
            const trElement = document.createElement("tr");
            for (let x = 1; x <= settings.gridSize.columns; x++) {
                const tdElement = document.createElement("td");

                if (google.position.x === x && google.position.y === y) {
                    const googleElement = document.createElement("img");
                    googleElement.src = "./assets/google.webp";
                    tdElement.appendChild(googleElement);
                }

                if (player1.position.x === x && player1.position.y === y) {
                    const player1Element = document.createElement("img");
                    player1Element.src = "./assets/player1.png";
                    tdElement.appendChild(player1Element);
                }

                if (player2.position.x === x && player2.position.y === y) {
                    const player2Element = document.createElement("img");
                    player2Element.src = "./assets/player2.png";
                    tdElement.appendChild(player2Element);
                }

                trElement.appendChild(tdElement);
            }
            tableElement.appendChild(trElement);
        }
    };

    window.addEventListener("keydown", (e) => {
        switch (e.code) {
            case "ArrowUp":
                game.movePlayer1Up();
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
    });

    game.eventEmitter.on("unitPositionChanged", () => {
        renderCounter++;
        render(renderCounter);
    });

    render(renderCounter);
};
asyncStart();
