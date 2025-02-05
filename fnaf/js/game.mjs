import { AnimatedSprite, Assets, Container, Graphics, NoiseFilter, Sprite, Spritesheet, Text } from "../../pixi.mjs";
import { Sound } from "../../pixi-sound.mjs";
import { Bonnie, Chica } from "./animatronics.mjs";
import CameraTablet from "./cameratablet.mjs";
import Office from "./office.mjs";
import OfficeButtons from "./officebuttons.mjs";

export default class Game {
    static async init(gameContainer) {
        this.SOUNDS = {
            officeNoise: Sound.from({
                url: './assets/sounds/Buzz_Fan_Florescent2.wav'
            }),
            camFlip: Sound.from({url: './assets/sounds/put down.wav'}),
            windowscare: Sound.from({url: './assets/sounds/windowscare.wav'}),
            gokuscare: Sound.from({url: './assets/sounds/gokuscare.mp3'}),
            lightsHum: Sound.from({url: './assets/sounds/BallastHumMedium2.wav'})
        }

        this.clock = 12;
        this.movePercent = innerWidth*0.0044;
        this.camUp = false;
        this.camSwitch = false;

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

        await CameraTablet.init();
        await Office.init();
        await OfficeButtons.init(this);

        this.officeSpritesContainer.addChild(Office._currentSprite);

        const leftbuttonjson = await Assets.load('./assets/sprites/buttons/left/spritesheet.json');
        const leftbuttonsheet = new Spritesheet(await Assets.load('./assets/sprites/buttons/left/spritesheet.png'), leftbuttonjson.data);
        await leftbuttonsheet.parse();
        // this._all_left_button_sprites = {};
        // for (const [key, value] of Object.entries(leftbuttonsheet.textures)) {
        //     this._all_left_button_sprites[key] = new Sprite(value);
        //     const entry = this._all_left_button_sprites[key];
        //     entry.eventMode = 'static';
        //     entry.setSize(entry.width*this.scale.x, entry.height*this.scale.y);
        //     entry.position.set(-Office._currentSprite.width*0.16, innerHeight/2);
        //     console.log(entry.onpointerdown )
        //     entry.onpointerdown  = (event) => {
        //         this.SOUNDS.lightsHum.play(); this.powerUsage+=1;
        //         if (this.animatronics.bonnie.currentState === "ATDOOR") {
        //             const random = Math.random()*100;
        //             if (random <= 10) {
        //                 officeSpritesContainer.addChild(Office._sprites["58goku.png"]);
        //                 this.SOUNDS.gokuscare.play({volume: 2});
        //                 return;
        //             }
        //             officeSpritesContainer.addChild(Office._sprites["225.png"]);
        //             this.SOUNDS.windowscare.play({});
        //         } else {
        //             officeSpritesContainer.addChild(Office._sprites["58.png"]);
        //         }
        //     }
        //     entry.onpointerup = (event) => {
        //         this.SOUNDS.lightsHum.stop(); this.powerUsage-=1;
        //         officeSpritesContainer.removeChild(officeSpritesContainer.children[1]);
        //     }
        // }
        
        this._clockText = new Text({
            text: `${this.clock} AM`,
            style: {
                fill: 0xffffff,
                fontFamily: 'Volter',
                align: 'center',
            }
        });
        this._clockText.position.set(50, 120);

        const mapSprite = new Sprite(await Assets.load('./assets/sprites/cams/MAp.png'));
        mapSprite.position.set(innerWidth-mapSprite.width, innerHeight-mapSprite.height)

        const bear5texture = await Assets.load('./assets/sprites/484bear5.png');
        this._bear5 = new Sprite(bear5texture);
        this._bear5.filters = [
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
            this.cameraRender.visible = true
            this._cameraShow.children.forEach(sprite => {
                if (sprite.visible) {
                    sprite.x = -innerWidth*0.2;
                }
            })
        };

        CameraTablet._flipDown.onComplete = () => CameraTablet._flipDown.visible = false;

        CameraTablet._camFlipButton.onpointerenter = (event) => {
            if (CameraTablet._flipUp.playing || CameraTablet._flipDown.playing) return;
            this.camUp = true;
            this.SOUNDS.camFlip.play({});
            if (!this.camSwitch) {
                this.camSwitch = true;
                this.powerUsage+=1;
                CameraTablet._flipUp.visible = true;
                CameraTablet._flipUp.gotoAndPlay(0);
            } else {
                this.powerUsage-=1;
                this.camSwitch = false;
                CameraTablet._flipUp.visible = false;
                CameraTablet._flipDown.visible = true;
                CameraTablet._flipDown.gotoAndPlay(0);

                this.cameraRender.visible = false;
            }
        };
        CameraTablet._camFlipButton.onpointerleave = (event) => {
            this.camUp = false;
        };

        //================================================
        //

        /**
         * TEXT
         */

        this.powerLevelDisplay = new Text({
            text: `Power Level: 100%`,
            style: {
                fontFamily: 'FNAF',
                fill: 0xffffff,
                fontSize: 60,
            }
        }); this.powerLevelDisplay.position.set(10, innerHeight-120);
        this.usageDisplay = new Text({text: `Usage:`, style: {fontFamily: 'FNAF' , fill: 0xffffff, fontSize: 32}});
        this.usageDisplay.position.set(this.powerLevelDisplay.position.x, this.powerLevelDisplay.position.y-32)

        //
        //

        /**
         * Container layering
         */

        this.displayHUDContainer.addChild(this._clockText, this.usageDisplay, this.powerLevelDisplay, CameraTablet._camFlipButton);

        this._cameraShow.addChild(this._bear5);
        this._cameraGUI.addChild(mapSprite);
        this.cameraRender.addChild(this._cameraShow, this._cameraGUI);

        this.camTabletContainer.addChild(CameraTablet._flipUp, CameraTablet._flipDown);
        this._buttonsContainer.addChild(OfficeButtons._leftDoorClick);
        this.officeContainer.addChild(this._doorContainer, this.officeSpritesContainer, this._buttonsContainer);

        this.officeRender.addChild(Office._movementContainer, this.officeContainer, this.camTabletContainer, this.cameraRender, this.displayHUDContainer);

        this.render.addChild(this.officeRender);

        //

    }

    static start(options) {
        this._gameActive = true;

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

        this.SOUNDS.officeNoise.play({
            volume: 0.25,
            loop: true,
        })
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
            this._clockText.text = `${this.clock} AM`;
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

            this._bear5.filters[0].seed = Math.random();

            if (this.cameraRender.visible) {
                this._cameraShow.children.forEach(sprite => {
                    if (sprite.visible) {
                        if (sprite.x < 0) {sprite.x += innerWidth*0.001;}
                    }
                });
            }

            for (const [key, animatronic] of Object.entries(this.animatronics)) {
                animatronic.movement(ticker);
            }
        }
    }

    forceGameOver() {this._gameActive = false; return;}

}