class Game {
    #settings
    #status = 'pending'
    #player1
    #player2
    #google

    constructor() {}
    #getRandomPosition(coordinates) {
        let newX, newY;
        do {
            newX = NumberUtils.getRandomNumber(this.#settings.gridSize.columns);
            newY = NumberUtils.getRandomNumber(this.#settings.gridSize.rows);
        } while (coordinates.some(el => el.x === newX && el.y === newY));

        return new Position(newX, newY);
    }
    #createUnits() {
        const player1Position = this.#getRandomPosition([])
        this.#player1 = new Player(1, player1Position)

        const player2Position = this.#getRandomPosition([player1Position])
        this.#player2 = new Player(2, player2Position)

        const googlePosition = this.#getRandomPosition([player1Position, player2Position])
        this.#google = new Google(googlePosition)
    }

    async start() {
        if(this.#status === 'pending') {
            this.#createUnits()
            this.#status = 'in-process'
        }
    }
    set settings(settings) {
        this.#settings = settings
    }
    get settings() {
        return this.#settings
    }
    get status() {
        return this.#status
    }
    get player1() {
        return this.#player1
    }
    get player2() {
        return this.#player2
    }
    get google() {
        return this.#google
    }
}

class Position {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}
class Unit {
    constructor(position) {
        this.position = position
    }
}
class Google extends Unit {
    constructor(position) {
        super(position)
    }
}
class Player extends Unit {
    constructor(id, position) {
        super(position)
        this.id = id
    }
}
class NumberUtils {
    static getRandomNumber(max) {
        return Math.floor(Math.random()*max + 1)
    }
}

module.exports = {
    Game,
}