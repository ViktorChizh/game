import { WebSocketServer } from 'ws';
import {EventEmitter} from './eventEmitter.js';
import {Game} from './game.js';

const eventEmitter = new EventEmitter();
const game = new Game(eventEmitter);
game.start();

const wss = new WebSocketServer({ port: 3002 });

wss.on('connection', function connection(tunnel) {

    game.eventEmitter.subscribe("unitPositionChanged", () => {
        const message = {
            type: "event",
            eventName: "unitPositionChanged"
        }
        tunnel.send(JSON.stringify(message));
    })

    tunnel.on('message', async function message(data) {
        // console.log("input message")
        const action = JSON.parse(data);

        const result = await game[action.procedure]();

        const response = {
            procedure: action.procedure,
            result: result,
            type: "response"
        }
        tunnel.send(JSON.stringify(response));
    });

    // tunnel.send('something');
});

