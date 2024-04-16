// для тестов в game.js надо закоментить стр.2,74,124 и раскоментить стр.3,231-233 Затем в package.json запустить test

const {Game} = require("./docs/game.js")

//  Создаем спецфункцию (промисификатор) для имитации задержки
function sleep(delay) {
    return new Promise((res) => {
        setTimeout(res, delay)
    })
}

describe("game test", () => {
    let game
    beforeEach(() => {
        game = new Game()
    })
    afterEach(async () => {
        await game.stop()
    })
    it('init test', () => {
        game.settings = ({
            gridSize: {
                columns: 4,
                rows: 5
            }
        })
        expect(game.settings.gridSize.columns).toBe(4)
        expect(game.settings.gridSize.rows).toBe(5)
    })
    it('start game', async () => {
        game.settings = {
            // для минимума проверок
            gridSize: {
                columns: 1,
                rows: 3
            }
        }
        expect(game.status).toBe('pending')
        await game.start()
        expect(game.status).toBe('in-process')
    })
    it('check players start position', async () => {
        game.settings = {
            // для минимума проверок
            gridSize: {
                columns: 1,
                rows: 3
            }
        }
        await game.start()
        // проверяем не выпадают ли игроки из поля
        expect([1]).toContain(game.player1.position.x)
        expect([1, 2, 3]).toContain(game.player1.position.y)
        expect([1]).toContain(game.player2.position.x)
        expect([1, 2, 3]).toContain(game.player2.position.y)
        expect([1]).toContain(game.google.position.x)
        expect([1, 2, 3]).toContain(game.google.position.y)
        // проверяем не находятся ли игроки на одном поле
        expect(game.google.position).not.toEqual(game.player1.position)
        expect(game.google.position).not.toEqual(game.player2.position)
        expect(game.player1.position).not.toEqual(game.player2.position)
    })
    it('check google position after jump', async () => {
        game.settings = {
            gridSize: {
                columns: 4,
                rows: 4
            },
            googleJumpInterval: 100
        }
        await game.start()
        // копируем адрес гугла, сохраняя наследование от класса Position
        const prevPosition = game.google.position.clone()
        //задаем на 50мс больше, чем ожидание в googleJumpInterval в начальных настройках
        await sleep(150)

        //  expect(game.google.position).not.toEqual(prevPosition)
        expect(game.google.position.equal(prevPosition)).toBe(false)
    })
    it("catch google by player1 or player2 for one row", async () => {
        for (let i = 0; i < 10; i++) {
            game.settings = {
                gridSize: {
                    columns: 3,
                    rows: 1,
                },
            };
            game.score = {
                1: {points: 0},
                2: {points: 0},
            };

            await game.start();
            // возможные варианты расположения в заданных минимальных условиях
            // p1 p2 g | p1 g p2 | p2 p1 g | p2 g p1 | g p1 p2 | g p2 p1
            const deltaForPlayer1 = game.google.position.x - game.player1.position.x;

            const prevGooglePosition = game.google.position.clone();

            if (Math.abs(deltaForPlayer1) === 2) {
                if (game.google.position.x - game.player2.position.x > 0) game.movePlayer2Right();
                else game.movePlayer2Left();

                expect(game.score[1].points).toBe(0);
                expect(game.score[2].points).toBe(1);
            } else {
                if (deltaForPlayer1 > 0) game.movePlayer1Right();
                else game.movePlayer1Left();

                expect(game.score[1].points).toBe(1);
                expect(game.score[2].points).toBe(0);
            }

            expect(game.google.position.equal(prevGooglePosition)).toBe(false);
        }
    });
    it("catch google by player1 or player2 for one column", async () => {
        for (let i = 0; i < 10; i++) {
            game.settings = {
                gridSize: {
                    columns: 1,
                    rows: 3,
                },
            }
            game.score = {
                1: {points: 0},
                2: {points: 0},
            }

            await game.start();
            // возможные варианты расположения в заданных минимальных условиях
            // p1   p1   p2   p2    g    g
            // p2    g   p1    g   p1   p2
            //  g   p2    g   p1   p2   p1
            const deltaForPlayer1 = game.google.position.y - game.player1.position.y;
            const prevGooglePosition = game.google.position.clone();

            if (Math.abs(deltaForPlayer1) === 2) {
                if (game.google.position.y - game.player2.position.y > 0) game.movePlayer2Down();
                else game.movePlayer2Up();

                expect(game.score[1].points).toBe(0);
                expect(game.score[2].points).toBe(1);
            } else {
                if (deltaForPlayer1 > 0) game.movePlayer1Down();
                else game.movePlayer1Up();

                expect(game.score[1].points).toBe(1);
                expect(game.score[2].points).toBe(0);
            }

            expect(game.google.position.equal(prevGooglePosition)).toBe(false);
        }
    });
    it("check first or second player won", async () => {
        game.settings = {
            pointsToWin: 3,
            gridSize: {
                columns: 3,
                rows: 1,
            },
        };
        game.score = {
            1: { points: 0 },
            2: { points: 0 },
        };

        await game.start();
        // p1 p2 g | p1 g p2 | p2 p1 g | p2 g p1 | g p1 p2 | g p2 p1
        const deltaForPlayer1 = game.google.position.x - game.player1.position.x;

        if (Math.abs(deltaForPlayer1) === 2) {
            const deltaForPlayer2 = game.google.position.x - game.player2.position.x;
            if (deltaForPlayer2 > 0) {
                game.movePlayer2Right();
                game.movePlayer2Left();
                game.movePlayer2Right();
            } else {
                game.movePlayer2Left();
                game.movePlayer2Right();
                game.movePlayer2Left();
            }

            expect(game.score[1].points).toBe(0);
            expect(game.score[2].points).toBe(3);
        } else {
            if (deltaForPlayer1 > 0) {
                game.movePlayer1Right();
                game.movePlayer1Left();
                game.movePlayer1Right();
            } else {
                game.movePlayer1Left();
                game.movePlayer1Right();
                game.movePlayer1Left();
            }

            expect(game.score[1].points).toBe(3);
            expect(game.score[2].points).toBe(0);
        }
        expect(game.status).toBe("finished");
    });
});