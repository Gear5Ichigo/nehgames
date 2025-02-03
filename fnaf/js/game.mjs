import { Assets, Container, Spritesheet, Text } from "../../pixi.mjs";
import { Bonnie, Chica } from "./animatronics.mjs";

export default class Game {

    _gameActive;

    _cameraTablet;
    _clockText;

    animatronics = {_id: 0};

    _ONE_HOUR = 2; // one in-game hour = 69 seconds
    timeElapsed; clock;

    _MAX_BATTERY = 100;
    battery; batteryDrain;

    static async init(gameContainer) {

        this.clock = 12;

        this.OfficeRender = new Container();
        this.CameraRender = new Container();

        this._clockText = new Text({
            text: `${this.clock}`,
            style: {
                fill: 0xffffff,
                fontFamily: 'Press Start',
                align: 'center',
            }
        });
        this.zIndex = 100;
        this._clockText.position.set(50, 50);
        console.log(this._clockText);

        Assets.add({alias: 'camflip.png', src: './assets/sprites/camflip/camflip.png'});
        const camflipJson = await Assets.load('./assets/sprites/camflip/camflip.json');
        this._cameraTablet = new Spritesheet(await Assets.load('camflip.png'), camflipJson.data);
        await this._cameraTablet.parse();

        // gameContainer.addChild(this._clockText)
    }

    static start(options) {
        this._gameActive = true;

        this.timeElapsed = 0;
        this.clock = 12;

        this.battery = this._MAX_BATTERY;
        this.batteryDrain = 1;

        this.animatronics = {};

        this.animatronics.bonnie = new Bonnie(options.bonnieLevel || 0);
        this.animatronics.chica = new Chica(options.chicaLevel || 0);
    }

    static updateClock(ticker) {
        const dt = ticker.deltaTime/ticker.FPS;
        this.timeElapsed += dt;
        console.log(this.timeElapsed);
        if (this.timeElapsed>=this._ONE_HOUR) {
            this.timeElapsed = 0;
            this.clock+=1;
            if (this.clock>=13) {
                this.clock = 1;
            }
            this._clockText.text = `${this.clock} AM`;
        }
    }

    static updateLoop(ticker) {
        if (this._gameActive) {
            this.updateClock(ticker);

            for (const [key, animatronic] of Object.entries(this.animatronics)) {
                animatronic.movement(ticker);
            }
        }
    }

    forceGameOver() {this._gameActive = false; return;}

}