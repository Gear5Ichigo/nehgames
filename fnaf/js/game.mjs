import { AnimatedSprite, Assets, Container, Graphics, NoiseFilter, Sprite, Spritesheet, Text } from "../../pixi.mjs";
import { Sound } from "../../pixi-sound.mjs";
import { Bonnie, Chica, Freddy } from "./animatronics.mjs";
import CameraTablet from "./cameratablet.mjs";
import Office from "./office.mjs";
import OfficeButtons from "./officebuttons.mjs";
import Doors from "./doors.mjs";
import Cams from "./cams.mjs";

export default class Game {
    static async init(gameContainer) {
        this.SOUNDS = {
            officeNoise: Sound.from({ url: './assets/sounds/Buzz_Fan_Florescent2.wav' }),
            camFlip: Sound.from({url: './assets/sounds/put down.wav'}),
            windowscare: Sound.from({url: './assets/sounds/windowscare.wav'}),
            gokuscare: Sound.from({url: './assets/sounds/gokuscare.mp3'}),
            lightsHum: Sound.from({url: './assets/sounds/BallastHumMedium2.wav'}),
            doorShut: Sound.from({url: './assets/sounds/SFXBible_12478.wav'}),
            winSound: Sound.from({url: './assets/sounds/chimes 2.wav'}),
            camBlip: Sound.from({url: './assets/sounds/blip3.wav'}),
            cams: Sound.from({url: './assets/sounds/MiniDV_Tape_Eject_1.wav', loop: true}),
            doorBaning: Sound.from({url: './assets/sounds/MiniDV_Tape_Eject_1.wav'}),

            phoneguy1: Sound.from({url: './assets/sounds/voiceover1c.wav'}),
        }

        this.clock = 12;
        this.movePercent = innerWidth*0.005;
        this.camUp = false;
        this.currentCam = "CAM1A";
        this.camSwitch = false;
        this.camMoveReverse = false;

        this.leftDoorOn = false;
        this.rightDoorOn = false;

        this.leftLightOn = false;
        this.rightLightOn = false;

        this.scale = {x: innerWidth/1600, y: innerHeight/720};

        this.render = new Container();

        this.officeRender = new Container();
        this.camTabletContainer = new Container();
        this.officeContainer = new Container();
        this.displayHUDContainer = new Container();

        this.officeSpritesContainer = new Container();

        this._doorContainer = new Container();
        this._buttonsContainer = new Container();

        this.cameraRender = new Container();
        this._cameraShow = new Container();
        this._cameraGUI = new Container();
        this.cameraRender.visible = false;

        await Office.init();
        await OfficeButtons.init();
        await Doors.init();
        await Cams.init();
        await CameraTablet.init();

        this.officeSpritesContainer.addChild(Office._currentSprite);

        const bear5texture = await Assets.load('./assets/sprites/484bear5.png');
        this._bear5 = new Sprite(bear5texture);
        this._cameraShow.filters = [
            new NoiseFilter({
                seed: Math.random(),
                noise: 0.5,
            })
        ]
        this._bear5.setSize(innerWidth*1.2, innerHeight);

        /**
         * Camera Tablet animations
         */

        CameraTablet._flipUp.onComplete = () => {
            this.officeRender.visible = false
            this.cameraRender.visible = true
            if (this.currentCam !== 'CAM6') this._cameraShow.x = -innerWidth*0.2;
            this.SOUNDS.cams.play();
        };

        CameraTablet._flipDown.onComplete = () => CameraTablet._flipDown.visible = false;

        CameraTablet._camFlipButton.onpointerenter = (event) => {
            if (CameraTablet._flipUp.playing || CameraTablet._flipDown.playing) return;
            this.SOUNDS.camFlip.play({});
            if (!this.camUp) {
                this.camUp = true;
                this.powerUsage+=1;
                CameraTablet._flipUp.visible = true;
                CameraTablet._flipUp.gotoAndPlay(0);
            } else {
                this.powerUsage-=1;
                this.camUp = false;
                this.officeRender.visible = true;
                CameraTablet._flipUp.visible = false;
                CameraTablet._flipDown.visible = true;
                CameraTablet._flipDown.gotoAndPlay(0);
                this.SOUNDS.cams.stop();

                this.cameraRender.visible = false;
            }
        };
        CameraTablet._camFlipButton.onpointerleave = (event) => {
            
        };

        //================================================
        //

        /**
         * TEXT
         */

        this._clockText = new Text({
            text: `${this.clock}  AM`,
            style: {
                fill: 0xffffff,
                fontFamily: 'FNAF',
                align: 'center',
                fontSize: 60 * Game.scale.x,
            }
        }); this._clockText.position.set(Cams.cameraBorder.width-this._clockText.width, 15*Game.scale.y);
        this.currentNightText = new Text({text: `Night`,
            style: {
                fill: 0xffffff,
                align: 'center',
                fontFamily: 'FNAF',
                fontSize: 30*Game.scale.x
            }
        }); this.currentNightText.position.set(this._clockText.position.x, this._clockText.position.y+(50*Game.scale.y));
        this.powerLevelDisplay = new Text({
            text: `Power Level: 100%`,
            style: {
                fontFamily: 'FNAF',
                fill: 0xffffff,
                fontSize: 60*Game.scale.x,
            }
        }); this.powerLevelDisplay.position.set(Cams.cameraBorder.x+(40*Game.scale.x), innerHeight-(90*Game.scale.y));
        this.usageDisplay = new Text({text: `Usage:`, style: {fontFamily: 'FNAF' , fill: 0xffffff, fontSize: 32*Game.scale.x}});
        this.usageDisplay.position.set(this.powerLevelDisplay.position.x, this.powerLevelDisplay.position.y-32);

        //
        //

        /**
         * Container layering
         */

        this.displayHUDContainer.addChild(this._clockText, this.currentNightText, this.usageDisplay, this.powerLevelDisplay, CameraTablet._camFlipButton);

        this._cameraShow.addChild(this._bear5);
        this._cameraGUI.addChild(Cams.cameraBorder, Cams.cameraRecording, Cams.camsMapContainer, Cams.areaName, Cams.mapButtons);
        this.cameraRender.addChild(this._cameraShow, this._cameraGUI);

        this.camTabletContainer.addChild(CameraTablet._flipUp, CameraTablet._flipDown);
        this._buttonsContainer.addChild(OfficeButtons._leftButtonClick, OfficeButtons._rightButtonClick);
        this._doorContainer.addChild(Doors.leftDoorContainer, Doors.rightDoorContainer);
        this.officeContainer.addChild(this.officeSpritesContainer, Office.fanAnim, this._doorContainer, this._buttonsContainer);

        this.officeRender.addChild(
            Office._movementContainer,
            this.officeContainer,
            this.camTabletContainer
        );

        this.render.addChild(this.officeRender, this.cameraRender, this.displayHUDContainer);

        //

    }

    static start(options) {
        this._gameActive = true;

        this.night = options.night || 1;
        this.currentNightText.text = `Night ${this.night}`;

        this.timeElapsed = 0;
        this._ONE_HOUR = 69;
        this.clock = 12;

        this._MAX_POWER_LEVEL = 100;
        this.powerLevel = this._MAX_POWER_LEVEL;
        this.powerUsage = 1;
        this._powerTimer = 0;

        this.animatronics = {};

        this.animatronics.bonnie = new Bonnie(options.bonnieLevel || 0);
        this.animatronics.chica = new Chica(options.chicaLevel || 0);
        this.animatronics.freddy = new Freddy(options.freddylevel || 0);

        this.SOUNDS.officeNoise.play({
            volume: 0.25,
            loop: true,
        })
        this.SOUNDS.phoneguy1.play();
    }

    static changeSprite(spriteContainer, newSprite) {
        spriteContainer.removeChild(spriteContainer.children[0]);
        spriteContainer.addChild(newSprite);
    }

    static updateClock(ticker) {
        const dt = ticker.deltaTime/ticker.FPS;
        this.timeElapsed += dt;
        if (this.timeElapsed>=this._ONE_HOUR) {
            this.timeElapsed = 0;
            this.clock+=1;
            if (this.clock>=13) {
                this.clock = 1;
            }
            this._clockText.text = `${this.clock}  AM`;
        }
        if (this.clock == 6 && !this.SOUNDS.winSound.isPlaying) {
            this.SOUNDS.winSound.play();
        }
    }

    static _updatePower(ticker) {
        const dt = ticker.deltaTime/ticker.FPS;
        this._powerTimer += dt;
        if (this._powerTimer >= 1) {
            this._powerTimer = 0;
            this.powerLevel -= this.powerUsage/10;
            this.usageDisplay.text = `Usage: ${Math.ceil(this.powerUsage)}`;
        }
        this.powerLevelDisplay.text = `Power Level: ${Math.ceil(this.powerLevel)}%`;
    }

    static _officemove() {
        const margin = (Office._currentSprite.width-Office._currentSprite.width/1.5)/2;
        if (this.officeContainer.x > -margin ) {
            if (Office._moveRight) this.officeContainer.x-=this.movePercent;
            if (Office._innerMoveRight) this.officeContainer.x-=this.movePercent*2;
        }
        if (this.officeContainer.x < margin ) {
            if (Office._moveLeft) this.officeContainer.x+=this.movePercent;
            if (Office._innerMoveLeft) this.officeContainer.x+=this.movePercent*2;
        }
    }

    static updateLoop(ticker) {
        if (this._gameActive) {
            this.updateClock(ticker);
            this._updatePower(ticker);
            this._officemove();

            this._cameraShow.filters[0].seed = Math.random();

            if (this.cameraRender.visible && this.currentCam!=='CAM6') {
                if (this._cameraShow.x < 0) {
                    this._cameraShow.x += innerWidth*0.001;
                    if (this._cameraShow >= 0 && !this.camMoveReverse)
                        this.camMoveReverse = true;
                }
            }

            for (const [key, animatronic] of Object.entries(this.animatronics)) {
                animatronic.movement(ticker);
            }
        }
    }

    forceGameOver() {this._gameActive = false; return;}

}