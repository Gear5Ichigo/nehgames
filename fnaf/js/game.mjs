import { AnimatedSprite, Assets, Container, Graphics, NoiseFilter, Sprite, Spritesheet, Text } from "../../pixi.mjs";
import { Sound } from "../../pixi-sound.mjs";
import { Bonnie, Chica, Freddy } from "./animatronics.mjs";
import CameraTablet from "./cameratablet.mjs";
import Office from "./office.mjs";
import OfficeButtons from "./officebuttons.mjs";
import Doors from "./doors.mjs";
import Cams from "./cams.mjs";
import Jumpscares from "./jumpscares.mjs";

export default class Game {
    static async init(gameContainer) {
        this.SOUNDS = {
            officeNoise: Sound.from({ url: './assets/sounds/Buzz_Fan_Florescent2.wav' }),
            camFlip: Sound.from({url: './assets/sounds/put down.wav'}),
            windowscare: Sound.from({url: './assets/sounds/windowscare.wav'}),
            gokuscare: Sound.from({url: './assets/sounds/gokuscare.mp3', volume: 0.45}),
            lightsHum: Sound.from({url: './assets/sounds/BallastHumMedium2.wav', loop: true}),
            doorShut: Sound.from({url: './assets/sounds/SFXBible_12478.wav'}),
            winSound: Sound.from({url: './assets/sounds/chimes 2.wav', volume: 0.7}),
            camBlip: Sound.from({url: './assets/sounds/blip3.wav'}),
            cams: Sound.from({url: './assets/sounds/MiniDV_Tape_Eject_1.wav', loop: true}),
            doorBaning: Sound.from({url: './assets/sounds/MiniDV_Tape_Eject_1.wav'}),
            doorError: Sound.from({url: './assets/sounds/error.wav'}),
            winCheer: Sound.from({url: './assets/sounds/CROWD_SMALL_CHIL_EC049202.wav', volume: 0.5}),
            jumpscare: Sound.from({url: './assets/sounds/XSCREAM.wav', volume: 0.2}),
            powerdown: Sound.from({url: './assets/sounds/powerdown.wav'}),

            camError1: Sound.from({url: './assets/sounds/COMPUTER_DIGITAL_L2076505.wav'}),
            
            phoneguy1: Sound.from({url: './assets/sounds/voiceover1c.wav', volume: 0.7}),
        }

        this.clock = 12;
        this.movePercent = innerWidth*0.00525;
        this.camUp = false;
        this.currentCam = "CAM1A";
        this.camMoveReverse = false;

        this.leftDoorOn = false;
        this.rightDoorOn = false;

        this.leftLightOn = false;
        this.rightLightOn = false;

        this.win = false;

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
        this._finalCameraShow = new Container();
        this._cameraGUI = new Container();
        this.cameraRender.visible = false;

        this.jumpScares = new Container();

        this.winScreen = new Container();
        const winScreenBg = new Graphics()
        .rect(0, 0, innerWidth, innerHeight).fill(0x000000);
        const timeChangeContainer = new Container();
        const am = new Text({text: 'AM',
            style: {
                fill: 0xffffff,
                fontFamily: 'FNAF',
                fontSize: 100,
            },
            x: 0, y: 0
        });
        const _5 = new Text({text: '5',
            style: {
                fill: 0xffffff,
                fontFamily: 'FNAF',
                fontSize: 100,
            },
            x: 0, y: 0
        });
        const _6 = new Text({text: '6',
            style: {
                fill: 0xffffff,
                fontFamily: 'FNAF',
                fontSize: 100,
            },
            x: -100, y: 0
        });
        const _6am = new Text({text: '6  AM',
            style: {
                fill: 0xffffff,
                fontFamily: 'FNAF',
                fontSize: 100,
            },
            x: innerWidth/2-(49*this.scale.x), y: innerHeight/2-(20*Game.scale.y)
        });
        timeChangeContainer.addChild(am, _5, _6); timeChangeContainer.setSize(100, 100);
        this.winScreen.addChild(winScreenBg, _6am); this.winScreen.alpha = 0;

        await Office.init();
        await OfficeButtons.init();
        await Doors.init();
        await Cams.init();
        await CameraTablet.init();
        await Jumpscares.init();

        this.officeSpritesContainer.addChild(Office._currentSprite);

        const bear5texture = await Assets.load('./assets/sprites/484bear5.png');
        this._bear5 = new Sprite(bear5texture);
        this._finalCameraShow.filters = [
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
            if (this.animatronics.bonnie.currentState==="OFFICE" || this.animatronics.chica.currentState==="OFFICE") {
                this.die = true;
                if (this.animatronics.bonnie.currentState==="OFFICE") {
                    Jumpscares.bonnieScare.visible = true;
                    Jumpscares.bonnieScare.gotoAndPlay(0);
                } else if (this.animatronics.chica.currentState==="OFFICE") {
                    Jumpscares.chicaScare.visible = true;
                    Jumpscares.chicaScare.gotoAndPlay(0);
                }
                this.SOUNDS.jumpscare.play();
                setTimeout(() => {
                    Jumpscares.bonnieScare.stop(); this.forceGameOver()
                }, 660);
            }
            this.officeRender.visible = false
            this.cameraRender.visible = true
            if (this.currentCam !== 'CAM6') this._cameraShow.x = -innerWidth*0.2;
            this.SOUNDS.cams.play();
            if (this.leftLightOn || this.rightLightOn) {
                this.rightLightOn = false;
                this.leftLightOn = false;
                this.powerUsage-=1;
                OfficeButtons.__updateLeftSideOffice(); OfficeButtons.__updateRightSideOffice();
                OfficeButtons.__updateLeftSideButtons(); OfficeButtons.__updateRightSideButtons();
                this.SOUNDS.lightsHum.stop();
            };
        };

        CameraTablet._flipDown.onComplete = () => CameraTablet._flipDown.visible = false;

        CameraTablet._camFlipButton.onpointerenter = () => {
            if (Game.die || Game.powerDown) return;
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
                Game.SOUNDS.camError1.stop();

                Cams.blackBox.visible = false;
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

        this._cameraShow.addChild(Cams.stageSprites['19.png']);
        this._finalCameraShow.addChild(this._cameraShow, Cams.blackBox);
        this._cameraGUI.addChild(Cams.cameraBorder, Cams.cameraRecording, Cams.camsMapContainer, Cams.areaName, Cams.mapButtons);
        this.cameraRender.addChild(this._finalCameraShow, this._cameraGUI);

        this.camTabletContainer.addChild(CameraTablet._flipUp, CameraTablet._flipDown);
        this._buttonsContainer.addChild(OfficeButtons._leftButtonClick, OfficeButtons._rightButtonClick);
        this._doorContainer.addChild(Doors.leftDoorContainer, Doors.rightDoorContainer);
        this.officeContainer.addChild(this.officeSpritesContainer, Office.fanAnim, this._doorContainer, this._buttonsContainer);

        this.officeRender.addChild(
            Office._movementContainer,
            this.officeContainer,
            this.camTabletContainer,
        );

        this.render.addChild(this.officeRender, this.cameraRender, this.displayHUDContainer, this.jumpScares, this.winScreen);

        //

    }

    static start(options) {
        this.devMode = options.dev || false;

        for (const sound of Object.entries(this.SOUNDS)) sound[1].stop();
        this.winScreen.alpha = 0;

        this._gameActive = true;
        this.win = false;
        this.die = false;
        this.powerDown = false; this.powerDownMoment = false;

        this.night = options.night || 1;
        this.currentNightText.text = `Night ${this.night}`;

        this.timeElapsed = 0;
        this._ONE_HOUR = 69;
        this.clock = 12;
        this.powerDownElapsed = 0;
        this.powerDownSecond = 0;

        this._MAX_POWER_LEVEL = 100;
        this.powerLevel = this._MAX_POWER_LEVEL;
        this.powerUsage = 1;
        this._powerTimer = 0;

        this.leftDoorOn = false;
        this.rightDoorOn = false;

        this.leftLightOn = false;
        this.rightLightOn = false;

        this._clockText.text = `${this.clock} AM`;

        this.currentCam = "CAM1A";
        this.changeSprite(this._cameraShow, Cams.stageSprites['19.png']);
        Game.changeSprite(Cams.camsMapContainer, Cams.camsMapSprites[`1A.png`]);

        this.animatronics = {};

        this.animatronics.bonnie = new Bonnie(options.bonnieLevel || 0);
        this.animatronics.chica = new Chica(options.chicaLevel || 0);
        this.animatronics.freddy = new Freddy(options.freddylevel || 0);

        Jumpscares.bonnieScare.gotoAndStop(0);
        Jumpscares.bonnieScare.visible = false;
        Jumpscares.chicaScare.gotoAndStop(0);
        Jumpscares.chicaScare.visible = false;

        OfficeButtons.__updateLeftSideButtons();
        OfficeButtons.__updateLeftSideOffice();
        OfficeButtons.__updateRightSideButtons();
        OfficeButtons.__updateRightSideOffice();

        Doors.leftDoorCloseAnim.gotoAndStop(0);
        Doors.rightDoorCloseAnim.gotoAndStop(0);

        this.camUp = false;
        this.cameraRender.visible = false;
        CameraTablet._flipDown.visible = false;
        CameraTablet._flipUp.visible = false;
        CameraTablet._flipDown.gotoAndStop(0);
        CameraTablet._flipUp.gotoAndStop(0);

        Cams.blackBox.visible = false;

        this.officeContainer.position.set(0, 0);
        this.officeRender.visible = true;
        Office.fanAnim.visible = true;

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

            if (this.clock>=13) this.clock = 1;
            if (this.clock == 2) this.animatronics.bonnie.aiLevel += 1;
            if (this.clock == 3) {
                this.animatronics.bonnie.aiLevel += 1;
                this.animatronics.chica.aiLevel += 1;
            }
            if (this.clock == 4) {
                this.animatronics.bonnie.aiLevel += 1;
                this.animatronics.chica.aiLevel += 1;
            }

            this._clockText.text = `${this.clock}  AM`;
        }
        if (this.clock == 6 && !this.SOUNDS.winSound.isPlaying && !this.win) {
            this.win = true;
            for (const sound of Object.entries(this.SOUNDS)) sound[1].stop();
            this.SOUNDS.winSound.play();
        }
        if (this.win && this.winScreen.alpha < 1) this.winScreen.alpha += 0.1125*dt;
        if (this.winScreen.alpha>=1  && !this.SOUNDS.winCheer.isPlaying) {
            this.SOUNDS.winCheer.play();
            setTimeout(() => {this.forceGameOver();}, 2500);
        }
    }

    static _updatePower(ticker) {
        const dt = ticker.deltaTime/ticker.FPS;
        this._powerTimer += dt;
        if (this._powerTimer >= 0.98 && this.powerLevel > 0) {
            this._powerTimer = 0;
            this.powerLevel -= this.powerUsage/8.7;
            this.usageDisplay.text = `Usage: ${Math.ceil(this.powerUsage)}`;
        }
        if (this.powerLevel <= 0 && !this.win) this.powerDown = true;
        if (this.powerDown && !this.win) {
            this.powerDownElapsed+=dt;
            if (this.powerDownElapsed>=10) {
                if (this.powerDownElapsed>=20) this.SOUNDS.jumpscare.play(); setTimeout(() => {this.SOUNDS.jumpscare.stop();}, 300);
                if (this.powerDownSecond >= 1) {
                    this.powerDownSecond = 0;
                    const chance = Math.floor(Math.random()*4);
                    if (chance != 0) {
                        this.SOUNDS.jumpscare.play(); setTimeout(() => {this.SOUNDS.jumpscare.stop();}, 300);
                    }
                }
            }
            if (!this.powerDownMoment) {
                this.powerDownMoment = true;
                this.powerUsage = 0;

                this.SOUNDS.powerdown.play();
                this.SOUNDS.doorShut.play();
                this.SOUNDS.officeNoise.stop(); this.SOUNDS.lightsHum.stop();

                this.rightLightOn = false; this.leftLightOn = false;

                if (this.camUp) {
                    this.camUp = false;
                    this.cameraRender.visible = false; this.officeRender.visible = true;
                    CameraTablet._flipDown.gotoAndPlay(0); CameraTablet._flipDown.visible = true;
                    CameraTablet._flipUp.visible = false;
                }

                this.changeSprite(this.officeSpritesContainer, Office._sprites['304.png'])
                Office.fanAnim.visible = false;

                if (this.leftDoorOn) {
                    this.leftDoorOn = false;
                    Game.changeSprite(Doors.leftDoorContainer, Doors.leftDoorOpenAnim);
                    Doors.leftDoorOpenAnim.gotoAndPlay(0);
                }
                if (this.rightDoorOn) {
                    this.rightDoorOn = false;
                    Game.changeSprite(Doors.rightDoorContainer, Doors.rightDoorOpenAnim);
                    Doors.rightDoorOpenAnim.gotoAndPlay(0);
                }
            };
            OfficeButtons.__updateLeftSideButtons(); OfficeButtons.__updateRightSideButtons();
        }
        if (this.powerUsage <= 0 && !this.powerDown) this.powerUsage = 1;
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

            this._finalCameraShow.filters[0].seed = Math.random();

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

    static forceGameOver() {this._gameActive = false; for (const sound of Object.entries(this.SOUNDS)) sound[1].stop(); return;}

}