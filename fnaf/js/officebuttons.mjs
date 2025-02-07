import { Assets, Spritesheet, Sprite, Container, Graphics } from '../../pixi.mjs';
import Doors from './doors.mjs';
import Game from './game.mjs'
import Office from './office.mjs';

export default class OfficeButtons {
    static async init() {

        const bScale = 1.33;
        const btnSize = [40*Game.scale.x*bScale, 55*Game.scale.y*bScale];

        //

        const leftbuttonjson = await Assets.load('./assets/sprites/buttons/left/spritesheet.json');
        const leftbuttonsheet = new Spritesheet(await Assets.load('./assets/sprites/buttons/left/spritesheet.png'), leftbuttonjson.data);
        await leftbuttonsheet.parse();

        this._leftButtonSprites = {};
        for (const [key, value] of Object.entries(leftbuttonsheet.textures)) {
            this._leftButtonSprites[key] = new Sprite(value);
            const entry = this._leftButtonSprites[key];
            entry.scale.set(Game.scale.x*bScale, Game.scale.y*bScale);
            entry.position.set(-Office._currentSprite.width*0.165, innerHeight*0.44);
        };
        this._leftButtonCurrentSprite = this._leftButtonSprites["122.png"];

        //

        this._leftButtonClick = new Container();
        this._lbSpriteConainer = new Container();

        const leftX = this._leftButtonCurrentSprite.x+(30*Game.scale.x*bScale);
        const bY = this._leftButtonCurrentSprite.y+(52*Game.scale.y*bScale);
        const bY2 = this._leftButtonCurrentSprite.y+(132*Game.scale.y*bScale);

        const l_doorClick = new Graphics()
        .rect(leftX, bY, btnSize[0], btnSize[1]).fill(0xff00ff); l_doorClick.alpha = 0.0;
        l_doorClick.eventMode = 'static';
        l_doorClick.onpointerdown = () => {
            this.__left_door();
            this.__updateLeftButtons();
        }

        const l_lightClick = new Graphics()
        .rect(leftX, bY2, btnSize[0], btnSize[1]).fill(0xff00ff); l_lightClick.alpha = 0.0;
        l_lightClick.eventMode = 'static';
        l_lightClick.onpointerdown = () => {
            this.__left_light();
            this.__updateOffice();
            this.__updateLeftButtons();
        };
        
        this._lbSpriteConainer.addChild(this._leftButtonCurrentSprite);
        this._leftButtonClick.addChild(this._lbSpriteConainer, l_doorClick, l_lightClick);

        //

        const rightbuttonjson = await Assets.load('./assets/sprites/buttons/right/spritesheet.json');
        const rightbuttonsheet = new Spritesheet(await Assets.load('./assets/sprites/buttons/right/spritesheet.png'), rightbuttonjson.data);
        await rightbuttonsheet.parse();

        this._rightButtonSprites = {}
        for (const [key, value] of Object.entries(rightbuttonsheet.textures)) {
            this._rightButtonSprites[key] = new Sprite(value)
            const entry = this._rightButtonSprites[key];
            entry.scale.set(Game.scale.x*bScale, Game.scale.y*bScale);
            entry.position.set(Office._currentSprite.width/1.29, innerHeight*0.44);
        };
        this._rightButtonCurrentSprite = this._rightButtonSprites["134.png"];

        //

        const rightX = Office._currentSprite.width/1.29+(21*Game.scale.x*bScale)

        this._rightButtonClick = new Container();
        this._rbSpriteContainer = new Container();

        const r_doorClick = new Graphics()
        .rect(rightX, bY, btnSize[0], btnSize[1]).fill(0x00ff00); r_doorClick.alpha = 0.0;
        r_doorClick.eventMode = 'static';
        r_doorClick.onpointerdown = () => {

            this.__updateRightButtons();
        }

        const r_lightClick = new Graphics()
        .rect(rightX, bY2, btnSize[0], btnSize[1]).fill(0x00ff00); r_lightClick.alpha = 0.0;
        r_lightClick.eventMode = 'static';
        r_lightClick.onpointerdown = (event) => {
            this.__right_light();
            this.__updateOffice();
            this.__updateRightButtons();
        }

        this._rbSpriteContainer.addChild(this._rightButtonCurrentSprite);
        this._rightButtonClick.addChild(this._rbSpriteContainer, r_doorClick, r_lightClick)

        this.container = new Container();
    }

    static __updateOffice() {
        if (Game.rightLightOn) {
            if (Game.animatronics.chica.currentState === "ATDOOR") {
                Game.SOUNDS.windowscare.play();
                const random = Math.random()*100;
                if (random <= 6) {
                    Game.changeSprite(Game.officeSpritesContainer, Office._sprites["127power.png"]);
                    return
                }
                Game.changeSprite(Game.officeSpritesContainer, Office._sprites["227.png"]);
            } else Game.changeSprite(Game.officeSpritesContainer, Office._sprites["127.png"]);
        } else if (Game.leftLightOn) {
            if (Game.animatronics.bonnie.currentState === "ATDOOR") {
                const random = Math.random()*100;
                if (random <= 10) {
                    Game.changeSprite(Game.officeSpritesContainer, Office._sprites["58goku.png"]);
                    Game.SOUNDS.gokuscare.play({volume: 2});
                    return;
                }
                Game.changeSprite(Game.officeSpritesContainer, Office._sprites["225.png"]);
                Game.SOUNDS.windowscare.play({});
            } else Game.changeSprite(Game.officeSpritesContainer, Office._sprites["58.png"]);
        } else Game.changeSprite(Game.officeSpritesContainer, Office._sprites["39.png"]);
    }

    static __updateLeftButtons() {
        if (Game.leftLightOn && Game.leftDoorOn) {
            Game.changeSprite(this._lbSpriteConainer, this._leftButtonSprites["130.png"])
        } else if (Game.leftLightOn) {
            Game.changeSprite(this._lbSpriteConainer, this._leftButtonSprites["125.png"])
        } else if (Game.leftDoorOn) {
            Game.changeSprite(this._lbSpriteConainer, this._leftButtonSprites["124.png"])
        } else {
            Game.changeSprite(this._lbSpriteConainer, this._leftButtonSprites["122.png"])
        }
    }

    static __updateRightButtons() {
        if (Game.rightLightOn && Game.rightDoorOn) {
            Game.changeSprite(this._rbSpriteContainer, this._rightButtonSprites["47.png"])
        } else if (Game.rightLightOn) {
            Game.changeSprite(this._rbSpriteContainer, this._rightButtonSprites["131.png"])
        } else if (Game.rightDoorOn) {
            Game.changeSprite(this._rbSpriteContainer, this._rightButtonSprites["135.png"])
        } else {
            Game.changeSprite(this._rbSpriteContainer, this._rightButtonSprites["134.png"])
        }
    }
    static __right_light() {
        if (!Game.rightLightOn) {
            Game.powerUsage+=1;
            Game.rightLightOn = true;
            if (Game.leftLightOn) {
                Game.powerUsage-=1;
                Game.leftLightOn = false;
            }
            Game.SOUNDS.lightsHum.stop(); Game.SOUNDS.lightsHum.play();
        } else {
            Game.powerUsage-=1;
            Game.rightLightOn = false;
            Game.SOUNDS.lightsHum.stop();
        }
    }

    static __left_light() {
        if (!Game.leftLightOn) {
            Game.powerUsage+=1;
            Game.leftLightOn = true;
            if (Game.rightLightOn) {
                Game.powerUsage-=1;
                Game.rightLightOn = false;
            }
            Game.SOUNDS.lightsHum.stop(); Game.SOUNDS.lightsHum.play();
        } else {
            Game.powerUsage-=1;
            Game.leftLightOn = false;
            Game.SOUNDS.lightsHum.stop();
        }
    }

    static __left_door() {
        if (Doors.leftDoorOpenAnim.playing || Doors.leftDoorCloseAnim.playing) return;
        if (!Game.leftDoorOn) {
            Game.powerUsage += 1;
            Game.leftDoorOn = true;
            Game.changeSprite(Doors.leftDoorContainer, Doors.leftDoorCloseAnim);
            Doors.leftDoorCloseAnim.gotoAndPlay(0);
            Game.SOUNDS.doorShut.play();
        } else {
            Game.powerUsage -= 1;
            Game.leftDoorOn = false
            Game.changeSprite(Doors.leftDoorContainer, Doors.leftDoorOpenAnim);
            Doors.leftDoorOpenAnim.gotoAndPlay(0);
            Game.SOUNDS.doorShut.play();
        }
    }
}