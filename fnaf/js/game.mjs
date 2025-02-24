import { Assets, Container, Filter, GlProgram, Graphics, NoiseFilter, Sprite, Text } from '../../public/pixi.min.mjs';
import { Sound } from "../../public/pixi-sound.mjs";
import { Bonnie, Chica, Foxy, Freddy } from "./animatronics.mjs";
import CameraTablet from "./cameratablet.mjs";
import Office from "./office.mjs";
import OfficeButtons from "./officebuttons.mjs";
import Doors from "./doors.mjs";
import Cams from "./cams.mjs";
import Jumpscares from "./jumpscares.mjs";
import Menus from './menus.mjs';

export default class Game {
    static async init(gameContainer) {
        
        this.SOUNDS = {
            officeNoise: Sound.from({ url: './assets/sounds/Buzz_Fan_Florescent2.wav' }),
            camFlip: Sound.from({url: './assets/sounds/put down.wav'}),
            windowscare: Sound.from({url: './assets/sounds/windowscare.wav'}),
            gokuscare: Sound.from({url: './assets/sounds/gokuscare.mp3', volume: 0.75}),
            powerscare: Sound.from({url: './assets/sounds/powerscare.wav', volume: 1.5}),
            lightsHum: Sound.from({url: './assets/sounds/BallastHumMedium2.wav', loop: true}),
            doorShut: Sound.from({url: './assets/sounds/SFXBible_12478.wav'}),
            winSound: Sound.from({url: './assets/sounds/chimes 2.wav', volume: 0.5}),
            camBlip: Sound.from({url: './assets/sounds/blip3.wav'}),
            cams: Sound.from({url: './assets/sounds/MiniDV_Tape_Eject_1.wav', loop: true}),
            doorBaning: Sound.from({url: './assets/sounds/knock2.wav', volume: 1.5}),
            doorError: Sound.from({url: './assets/sounds/error.wav'}),
            winCheer: Sound.from({url: './assets/sounds/CROWD_SMALL_CHIL_EC049202.wav', volume: 0.33}),
            jumpscare: Sound.from({url: './assets/sounds/XSCREAM.wav', volume: 0.33}),
            powerdown: Sound.from({url: './assets/sounds/powerdown.wav'}),
            boop: Sound.from({url: './assets/sounds/PartyFavorraspyPart_AC01__3.wav', volume: 0.125}),

            circus: Sound.from({url: './assets/sounds/circus.wav', volume: 0.15}),
            pirate: Sound.from({url: './assets/sounds/pirate song2.wav', volume: 0.15}),
            eerieAmbience: Sound.from({url: './assets/sounds/EerieAmbienceLargeSca_MV005.wav'}),

            ambience1: Sound.from({url: './assets/sounds/ambience2.wav', loop: true, volume: 0.9}),
            ambience2: Sound.from({url: './assets/sounds/ColdPresc B.wav', loop: true, volume: 0.015}),

            camError1: Sound.from({url: './assets/sounds/COMPUTER_DIGITAL_L2076505.wav'}),
            
            phoneguy1: Sound.from({url: './assets/sounds/voiceover1c.wav', volume: 0.66}),
            phoneguy2: Sound.from({url: './assets/sounds/voiceover2a.wav', volume: 0.66}),
            phoneguy3: Sound.from({url: './assets/sounds/voiceover3.wav', volume: 0.66}),
            phoneguy4: Sound.from({url: './assets/sounds/voiceover4.wav', volume: 0.66}),
            phoneguy5: Sound.from({url: './assets/sounds/voiceover5.wav', volume: 0.66}),
        }

        this.clock = 12;
        this.camUp = false;
        this.currentCam = "CAM1A";
        this.camMoveReverse = false;
        this.camMovePause = false;
        this.camPauseWait = 0;

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

        /**
         * WIN SCREEN STUFF
         */

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

        const bear5texture = await Assets.load('./assets/sprites/484bear5.png');
        this._bear5 = new Sprite(bear5texture);
        this._bear5.setSize(innerWidth*1.2, innerHeight);

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
                fontSize: 30 * (Game.scale.x*2),
            }
        }); this._clockText.position.set(Cams.cameraBorder.width-this._clockText.width, Cams.cameraBorder.y+15*Game.scale.y);
        this.currentNightText = new Text({text: `Night`,
            style: {
                fill: 0xffffff,
                align: 'center',
                fontFamily: 'FNAF',
                fontSize: 30*Game.scale.x,
            },
        }); this.currentNightText.position.set(this._clockText.position.x, this._clockText.position.y+(50*Game.scale.y));
        this.powerLevelDisplay = new Text({
            text: `Power  left: 100%`,
            style: {
                fontFamily: 'FNAF',
                fill: 0xffffff,
                fontSize: 30*(Game.scale.x*2),
            }
        });
        this.usageDisplay = new Text({text: `Usage:`, style: {fontFamily: 'FNAF' , fill: 0xffffff, fontSize: 30*(Game.scale.x*2)}});
        this.usageDisplay.position.set(Cams.cameraBorder.x+(40*Game.scale.x), innerHeight-(90*Game.scale.y));
        

        //===========================================
        //


        /**
         * USAGE METER
         */

        this.usageBar = new Container();
        for (let i = 1; i <= 5; i++) {
            const g = new Graphics().rect(0, 0, 1, 1);
            const darkerBar = new Graphics().rect(0, 0, 1, 1);
            g.visible = false;
            g.addChild(darkerBar);
            switch(i) {
                case 1: g.fill(0x00ff00); darkerBar.fill(0x00cc00); break;
                case 2: g.fill(0x00ff00); darkerBar.fill(0x00cc00); break;
                case 3: g.fill(0xffff00); darkerBar.fill(0xcccc00); break;
                case 4: g.fill(0xff0000); darkerBar.fill(0xcc0000); break;
                case 5: g.fill(0xff0000); darkerBar.fill(0xcc0000); break;
            };
            this.usageBar.addChild(g);
        };
        this.resizeUsageBars = () => {
            let count = 0;
            for (const rect of Object.values(this.usageBar.children)) {
                rect.setSize(30*Game.scale.x, 45*Game.scale.y);
                rect.position.set(this.usageDisplay.x+(this.usageDisplay.width*Game.scale.x)+((rect.width+5)*count)-(5*Game.scale.x), this.usageDisplay.y+(7.5*Game.scale.y));
                rect.children[0].setSize(0.3, 1);
                rect.children[0].position.set(1-0.3, 0);
                count++;
            };
        }; this.resizeUsageBars();

        this.powerLevelDisplay.position.set(this.usageDisplay.position.x, this.usageDisplay.y-this.usageBar.children[0].height-(5*Game.scale.y));

        this.officespritevisible = new Text({text: "SHOW OFFICE SPRITE", style: {fill: 0xffffff, fontFamily: 'FNAF', fontSize: 66*Game.scale.x}, x: innerWidth/2});
        this.officespritevisible.eventMode = 'static';
        this.officespritevisible.onpointerdown = () => {Office.sprite.visible = !(Office.sprite.visible == true)};

        this.sethour = new Text({text: "SET HOUR = 1 SECOND", style: {fill: 0xffffff, fontFamily: 'FNAF', fontSize: 66*Game.scale.x}, x: innerWidth/2, y: this.officespritevisible.y+66});
        this.sethour.eventMode = 'static';
        this.sethour.onpointerdown = () => {this._ONE_HOUR = 1};

        //
        //

        //

        this.frag = await fetch('./assets/fake3d.frag').then(res => {if (res.ok) return res.text()} );
        this.vert = await fetch('./assets/fake3d.vert').then(res => {if (res.ok) return res.text()} );

        const fake3D = new Filter({
            glProgram: new GlProgram({
                vertex: this.vert, fragment: this.frag
            }),
            resources: {
                timeUniforms: {
                    uScaleX: {value: Game.scale.x, type: 'f32'},
                    uScaleY: {value: Game.scale.y, type: 'f32'}
                }
            }
        });

        this.__ofC = new Container();
        this.__ofC.filters = [fake3D];
        this._cameraShow.filters = [
            fake3D,
        ];


        //

        /**
         * Container layering
         */

        this.displayHUDContainer.addChild(this._clockText, this.currentNightText, this.usageDisplay, this.powerLevelDisplay, this.usageBar, CameraTablet.camFlipButton);

        this._cameraShow.addChild(Cams.stageSprites['19.png']);
        this._finalCameraShow.addChild(this._cameraShow, Cams.blackBox, Cams.staticEffect);
        this._cameraGUI.addChild(Cams.cameraBorder, Cams.cameraRecording, Cams.camsMapContainer, Cams.areaName, Cams.mapButtons);
        this.cameraRender.addChild(this._finalCameraShow, Cams.blipFlash1, this._cameraGUI);
        this.__ofC.addChild(Office.sprite, Jumpscares.foxyScare, Doors.container, Office.fanAnim, Office.plushiesContainer, OfficeButtons.container);
        this.officeContainer.addChild( this.__ofC, OfficeButtons.l_doorClick, OfficeButtons.l_lightClick, OfficeButtons.r_doorClick, OfficeButtons.r_lightClick, Office.freddyBoop);

        this.officeRender.addChild(
            Office._movementContainer,
            this.officeContainer,
            CameraTablet.tablet,
            this.officespritevisible, this.sethour
        );

        this.render.addChild(this.officeRender, this.cameraRender, this.displayHUDContainer, this.jumpScares, this.winScreen);

        //

    }

    static start(options) {
        console.log(options.settings);
        this.settings = options.settings;

        Menus.bgMusic.stop(); Menus.staticSound.stop();
        for (const sound of Object.entries(this.SOUNDS)) sound[1].stop();
        this.winScreen.alpha = 0;

        this._gameActive = true;
        this.win = false;
        this.die = false;
        this.powerDown = false; this.powerDownMoment = false;

        this.night = options.night || 1;
        this.currentNightText.text = `Night ${this.night}`;

        if (this.night != 7) localStorage.setItem(`Current_Night`, this.night);

        this.randomSoundTimer = 0;
        this.timeElapsed = 0;
        this._ONE_HOUR = options.hourLength || 65;
        this.clock = 12;
        this.powerDownElapsed = 0;
        this.powerDownSecond = 0;
        this.lostPowerGamble = false;

        this._MAX_POWER_LEVEL = 100;
        this.powerLevel = this._MAX_POWER_LEVEL;
        this.powerUsage = 1;
        this._powerTimer = 0;

        this.camMovePause = false;
        this.camPauseWait = 0;

        this.leftDoorOn = false;
        this.rightDoorOn = false;

        this.leftLightOn = false;
        this.rightLightOn = false;

        this._clockText.text = `${this.clock} AM`;

        this.currentCam = "CAM1A";
        CameraTablet.camFlipButton.visible = true;
        this.changeSprite(this._cameraShow, Cams.stageSprites['19.png']);
        Game.changeSprite(Cams.camsMapContainer, Cams.camsMapSprites[`1A.png`]);

        this.animatronics = {};

        this.animatronics.bonnie = new Bonnie(options.bonnieLevel || 0);
        this.animatronics.chica = new Chica(options.chicaLevel || 0);
        this.animatronics.freddy = new Freddy(options.freddylevel || 0);
        this.animatronics.foxy = new Foxy(options.foxyLevel) || 0;

        Jumpscares.freddyScare.gotoAndStop(0);
        Jumpscares.freddyScare.visible = false;
        Jumpscares.bonnieScare.gotoAndStop(0);
        Jumpscares.bonnieScare.visible = false;
        Jumpscares.chicaScare.gotoAndStop(0);
        Jumpscares.chicaScare.visible = false;
        Jumpscares.foxyScare.gotoAndStop(0);
        Jumpscares.foxyScare.visible = false;

        OfficeButtons.__updateLeftSideButtons();
        OfficeButtons.__updateLeftSideOffice();
        OfficeButtons.__updateRightSideButtons();
        OfficeButtons.__updateRightSideOffice();

        Doors.left.resetAnimations(); Doors.left.changeAnimation('close');
        Doors.right.resetAnimations(); Doors.right.changeAnimation('close');

        Doors.left.visible = true;

        this.camUp = false;
        this.cameraRender.visible = false;
        CameraTablet.tablet.forEach(([key, animation]) => animation.visible = false);
        CameraTablet.tablet.resetAnimations();

        Cams.blackBox.visible = false;

        if (localStorage.getItem('Night_1_Finished')) Office.plushies.sprites['bonnie.png'].visible = true;
        if (localStorage.getItem('Night_5_Finished')) Office.plushies.sprites['chica.png'].visible = true;
        if (localStorage.getItem('Night_6_Finished')) Office.plushies.sprites['freddy.png'].visible = true;
        if (localStorage.getItem('Power_Easter_Egg')) Office.plushies.sprites['powerbean'].visible = true;

        if (options.settings.disablePlushies) Office.plushies.forEach(([key, value]) => value.visible = false);

        if (options.settings.devMode) {
            Office.freddyBoop.alpha = 0.5;
            OfficeButtons.l_lightClick.alpha = 0.5; OfficeButtons.r_lightClick.alpha = 0.5;
            OfficeButtons.l_doorClick.alpha = 0.5; OfficeButtons.r_doorClick.alpha = 0.5;
            this.officespritevisible.visible = true; this.sethour.visible = true;
        } else {
            Office.freddyBoop.alpha = 0;
            OfficeButtons.l_lightClick.alpha = 0; OfficeButtons.r_lightClick.alpha = 0;
            OfficeButtons.l_doorClick.alpha = 0; OfficeButtons.r_doorClick.alpha = 0;
            this.officespritevisible.visible = false; this.sethour.visible = false;
        }

        this.officeContainer.position.set(0, 0);
        this.officeRender.visible = true;
        Office.fanAnim.visible = true;

        this.SOUNDS.officeNoise.play({
            volume: 0.2,
            loop: true,
        });
        this.SOUNDS.ambience1.play();
        const phone = this.SOUNDS[`phoneguy${this.night}`];
        if (phone) phone.play();
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
                this.animatronics.foxy.aiLevel += 1;
            }
            if (this.clock == 4) {
                this.animatronics.bonnie.aiLevel += 1;
                this.animatronics.chica.aiLevel += 1;
                this.animatronics.foxy.aiLevel += 1;
            }

            this._clockText.text = `${this.clock}  AM`;
        }
        if (this.settings.devMode) {
            this._clockText.text = `${this.clock},${this.timeElapsed}`;
        }
        if (this.clock == 6 && !this.SOUNDS.winSound.isPlaying && !this.win) {
            this.win = true;
            if (this.night < 6) localStorage.setItem('Current_Night', this.night+1);
            for (const sound of Object.entries(this.SOUNDS)) sound[1].stop();
            this.SOUNDS.winSound.play();
        }
        if (this.win && this.winScreen.alpha < 1) this.winScreen.alpha += 0.1125*dt;
        if (this.winScreen.alpha>=1  && !this.SOUNDS.winCheer.isPlaying) {
            this.SOUNDS.winCheer.play();
            if (!localStorage.getItem(`Night_${this.night}_Finished`)) localStorage.setItem(`Night_${this.night}_Finished`, true);
            setTimeout(() => {this.forceGameOver();}, 2500);
        }
    }

    static _updatePower(ticker) {
        const dt = ticker.deltaTime/ticker.FPS;
        this._powerTimer += dt;
        if (this._powerTimer >= 0.99 && this.powerLevel > 0) {
            this._powerTimer = 0;
            this.powerLevel -= this.powerUsage/8.5;
        }
        if (this.powerLevel <= 0 && !this.win) this.powerDown = true;
        if (this.powerDown && !this.win) {
            this.powerDownElapsed+=dt;
            if (this.powerDownElapsed>=10 && !this.lostPowerGamble) {
                if (this.powerDownElapsed>=20) {
                    this.lostPowerGamble = true;
                    this.SOUNDS.jumpscare.play();
                    setTimeout(() => {this.SOUNDS.jumpscare.stop(); this.forceGameOver()}, 300);
                }
                if (this.powerDownSecond >= 1) {
                    this.powerDownSecond = 0;
                    const chance = Math.floor(Math.random()*4);
                    if (chance != 0) {
                        this.lostPowerGamble = true;
                        this.SOUNDS.jumpscare.play(); setTimeout(() => {this.SOUNDS.jumpscare.stop(); this.forceGameOver()}, 300);
                    }
                }
            }
            if (!this.powerDownMoment) {
                this.powerDownMoment = true;
                this.powerUsage = 0;

                this.SOUNDS.powerdown.play();
                this.SOUNDS.doorShut.play();
                this.SOUNDS.officeNoise.stop(); this.SOUNDS.lightsHum.stop();
                this.SOUNDS.cams.stop();

                this.rightLightOn = false; this.leftLightOn = false;

                if (this.camUp) {
                    this.camUp = false;
                    this.cameraRender.visible = false; this.officeRender.visible = true;
                    CameraTablet._flipDown.gotoAndPlay(0); CameraTablet._flipDown.visible = true;
                    CameraTablet._flipUp.visible = false;
                }

                this.changeSprite(this.officeSpritesContainer, Office._sprites['304.png'])
                Office.fanAnim.visible = false;
                CameraTablet._camFlipButton.visible = false;

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
        if (this.settings.devMode) {
            this.powerLevelDisplay.text = `Power  left: ${(this.powerLevel)}%`;
        } else this.powerLevelDisplay.text = `Power  left: ${Math.ceil(this.powerLevel)}%`;
        let index = 0; for (const g of Object.values(this.usageBar.children)) { g.visible = this.powerUsage >= (index+1); index++ }
    }

    static _officemove() {
        const movePercent = innerWidth*0.00525;
        if (this.officeContainer.x > -Office.margin ) {
            if (Office._moveRight) this.officeContainer.x-=movePercent;
            if (Office._innerMoveRight) this.officeContainer.x-=movePercent;
            if (this.officeContainer.x < -Office.margin) this.officeContainer.x = -Office.margin;
        }
        if (this.officeContainer.x < Office.margin ) {
            if (Office._moveLeft) this.officeContainer.x+=movePercent;
            if (Office._innerMoveLeft) this.officeContainer.x+=movePercent;
            if (this.officeContainer.x > Office.margin) this.officeContainer.x = Office.margin;
        }
        const disX = (this.officeContainer.x/this.officeContainer.width) * Game.scale.x * -1;
        Office.freddyBoop.y = Office.sprite.y-(355*Game.scale.y+(8*disX*Game.scale.y))
    }

    static updateLoop(ticker) {
        const dt = ticker.deltaTime/ticker.FPS;
        this.randomSoundTimer+=dt;

        if (this._gameActive) {
            this.updateClock(ticker);
            this._updatePower(ticker);
            this._officemove();
            Cams.camMapPseudoAnim(ticker);
            Office.__hallWayFlicker(ticker);

            if (!this.SOUNDS.ambience2.isPlaying && (this.animatronics.chica.currentState!=='CAM1A' || this.animatronics.bonnie.currentState!=='CAM1A')) {
                this.SOUNDS.ambience1.stop(); this.SOUNDS.ambience2.play({volume: 0.5});
            }
            
            if (this.randomSoundTimer>=100/60 && this.clock != 12) {
                this.randomSoundTimer = 0;
                const chance = Math.floor(Math.random()*200);
                if (chance == 0 && !this.SOUNDS.eerieAmbience.isPlaying) this.SOUNDS.eerieAmbience.play();
                if (chance == 1 && !this.SOUNDS.circus.isPlaying) this.SOUNDS.circus.play();
                if (chance == 2 && !this.SOUNDS.pirate.isPlaying) this.SOUNDS.pirate.play();
            }

            if (this.cameraRender.visible && this.currentCam!=='CAM6') {
                if (this._cameraShow.x < 0 && !this.camMoveReverse && !this.camMovePause) {
                    this._cameraShow.x += innerWidth*0.0005;
                }
                if (this._cameraShow.x >= 0) {
                    this.camMoveReverse = true;
                }
                if (this._cameraShow.x > -this._cameraShow.width*0.165 && this.camMoveReverse && !this.camMovePause) {
                    this._cameraShow.x -= innerWidth*0.0005;
                }
                if (this._cameraShow.x <= -this._cameraShow.width*0.165) {
                    this.camMoveReverse = false; this.camMovePause = true;
                }
                if (this.camMovePause) {
                    this.camPauseWait += dt;
                    if (this.camPauseWait >= 3) {
                        this.camPauseWait = 0;
                        this.camMovePause = false;
                    }
                }
            }

            for (const [key, animatronic] of Object.entries(this.animatronics)) {
                animatronic.movement(ticker);
            }
        }
    }

    static forceGameOver() {this._gameActive = false; for (const sound of Object.entries(this.SOUNDS)) sound[1].stop(); return;}

}