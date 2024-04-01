const { Game } = require("./game.js")

describe("game test", () => {
    it('init test', ()=> {
        const game = new Game()
        game.settings = ({
            gridSize: {
                columns: 4,
                rows: 5
            }
        })
        expect (game.settings.gridSize.columns).toBe(4)
        expect (game.settings.gridSize.rows).toBe(5)

    })
    it ('start game', async () =>{
        const game = new Game()
        game.settings = {
            // для минимума проверок
            gridSize: {
                columns: 1,
                rows: 3
            }
        }
        expect (game.status).toBe('pending')
        await game.start()
        expect (game.status).toBe('in-process')
    })
    it('check players start position', async () => {
        const game = new Game()
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
        expect([1,2,3]).toContain(game.player1.position.y)
        expect([1]).toContain(game.player2.position.x)
        expect([1,2,3]).toContain(game.player2.position.y)
        expect([1]).toContain(game.google.position.x)
        expect([1,2,3]).toContain(game.google.position.y)

        // expect(game.player1.position)not
    })
})