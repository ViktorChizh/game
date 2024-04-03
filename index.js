class Game {
    #settings = {
        gridSize: {
            columns: 4,
            rows: 4
        },
        googleJumpInterval: 2000
    }
    #status = 'pending'
    #player1
    #player2
    #google
    #googleSetIntervalId
    #score = {
        1: {points: 0},
        2: {points: 0}
    }

    constructor() {
    }


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

        this.#moveGoogleToRandomPosition(true)
    }

    async start() {
        if (this.#status === 'pending') {
            this.#createUnits()
            this.#status = 'in-process'
            this.#runGoogleJumpInterval()
        }

    }

    async stop() {
        clearInterval(this.#googleSetIntervalId)
        this.#status = 'finished'
    }

    #runGoogleJumpInterval() {
        this.#googleSetIntervalId = setInterval(() => {
            this.#moveGoogleToRandomPosition()
        }, this.#settings.googleJumpInterval)
    }

    #moveGoogleToRandomPosition(excludeGoogle) {
        let notCrossedPosition = [this.#player1.position, this.#player2.position]
        if (!excludeGoogle) {
            notCrossedPosition.push(this.#google.position)
        }
        this.#google = new Google(this.#getRandomPosition(notCrossedPosition))
    }

    #checkBorder(player, delta) {
        if (delta.x) {
            return player.position.x + delta.x > this.#settings.gridSize.columns || player.position.x + delta.x < 1
        }
        if (delta.y) {
            return player.position.y + delta.y > this.#settings.gridSize.rows || player.position.y + delta.y < 1
        }
        return false;
    }

    #checkOtherPlayer(movingPlayer, otherPlayer, delta) {
        if (delta.x) {
            return movingPlayer.position.x + delta.x === otherPlayer.position.x;
        }
        if (delta.y) {
            return movingPlayer.position.y + delta.y === otherPlayer.position.y;
        }
        return false;
    }

    #checkGoogleCatching(player) {
        if (this.#google.position.equal(player.position)) {
            this.score[player.id].points++;
            this.#moveGoogleToRandomPosition();
        }
    }

    #movePlayer(movingPlayer, otherPlayer, delta) {
        const isBorder = this.#checkBorder(movingPlayer, delta)
        const isOtherPlayer = this.#checkOtherPlayer(movingPlayer, otherPlayer, delta)
        if (isOtherPlayer || isBorder) {
            return
        }
        if (delta.x) {
            movingPlayer.position.x = movingPlayer.position.x + delta.x
        } else {
            movingPlayer.position.y = movingPlayer.position.y + delta.y
        }
        this.#checkGoogleCatching(movingPlayer)
    }

    movePlayer1Right() {
        const delta = {x: 1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }

    movePlayer1Left() {
        const delta = {x: -1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }

    movePlayer1Up() {
        const delta = {y: -1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }

    movePlayer1Down() {
        const delta = {y: 1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }

    movePlayer2Right() {
        const delta = {x: 1}
        this.#movePlayer(this.#player2, this.#player1, delta)
    }

    movePlayer2Left() {
        const delta = {x: -1}
        this.#movePlayer(this.#player2, this.#player1, delta)
    }

    movePlayer2Up() {
        const delta = {y: -1}
        this.#movePlayer(this.#player2, this.#player1, delta)
    }

    movePlayer2Down() {
        const delta = {y: 1}
        this.#movePlayer(this.#player2, this.#player1, delta)
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

    get score() {
        return this.#score
    }

    set score(newScore) {
        this.#score = newScore;
    }
}

class Position {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    clone() {
        return new Position(this.x, this.y)
    }

    equal(otherPosition) {
        return otherPosition.x === this.x && otherPosition.y === this.y
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
        return Math.floor(Math.random() * max + 1)
    }
}

module.exports = {
    Game,
}