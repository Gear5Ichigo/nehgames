import { Sound } from "../../public/pixi-sound.mjs";
import { Assets, Ticker, Sprite, Graphics } from "../../public/pixi.min.mjs";
import CameraTablet from "./cameratablet.mjs";
import Cams from "./cams.mjs";
import Doors from "./doors.mjs";
import Game from "./game.mjs";
import Jumpscares from "./jumpscares.mjs";
import Office from "./office.mjs";
import OfficeButtons from "./officebuttons.mjs";

class Animatronic {

    constructor(aiLevel, movementInterval) {
        this.aiLevel = aiLevel
        this.timeElapsed = 0;
        this.movementInterval = movementInterval;
        this._possibleStates = {};
        this._leaveStates = {};
        this.currentState = null;
        this.previousState = null;
    };

    movement(ticker, door, callBack) {
        const dt = ticker.deltaTime/ticker.FPS;
        this.timeElapsed+=dt;
        if (this.timeElapsed >= this.movementInterval) {
            if (this.currentState==="OFFICE" || Game.win || Game.die || Game.powerDown) return;
            this.timeElapsed = 0;
            const chance = (Math.random()*19)+1
            if (chance >= 1 && chance <= this.aiLevel) {
                const currentCam = this._possibleStates[this.currentState];
                const moveTo = currentCam[Math.floor(Math.random()*currentCam.length)]
                this.previousState = this.currentState;
                if (moveTo && moveTo!='') {
                    if (moveTo==="OFFICE" && Game[door.toLowerCase()+'DoorOn']) {
                        const leaveTo = this._leaveStates[Math.floor(Math.random()*this._leaveStates.length)];
                        this.currentState = leaveTo;
                    } else if (moveTo==="OFFICE" && !Game[door.toLowerCase()+'DoorOn']) {
                        this.currentState = moveTo;
                        if (Game[door.toLowerCase()+'LightOn']) {
                            Game[door.toLowerCase()+'LightOn'] = false;
                            Game.powerUsage-=1;
                        }
                    } else this.currentState = moveTo;
                    callBack();
                    this.__updateSprites();
                }
            }
        }
    };

    __updateSprites() {
        if ((Game.currentCam === this.previousState || Game.currentCam === this.currentState) && !Cams.blackBox.visible && Game.camUp) {
            if (Game.currentCam === "CAM2A" && Game.animatronics.foxy.currentState === "5") return;
            Cams.blackBox.start();
        }
    };
}

class Bonnie extends Animatronic {

    footsteps = new Audio('./assets/sounds/deep_steps.wav');

    constructor(aiLevel) {
        super(aiLevel, 4.97);
        
        this.currentState = "CAM1A";
        this.previousState = null;

        this._possibleStates = {
            CAM1A : ["CAM1B", "CAM5"],
            CAM1B : ["CAM2A", "CAM5"],
            CAM5 : ["CAM2A", "CAM1B"],
            CAM2A : ["CAM3", "CAM2B"],
            CAM3 : ["CAM2B", "CAM2A", "ATDOOR"],
            CAM2B : ["ATDOOR", "CAM3"],
            ATDOOR : ["OFFICE"]
        };

        this._leaveStates = ["CAM1B"];
    }

    movement(delta) {
        super.movement(delta, 'left', () => {
            if (this.currentState === "CAM2A" || this.currentState === "CAM2B" || this.currentState === "CAM3" || this.currentState === "ATDOOR")
                this.footsteps.play();
        })
    }

    __updateSprites() {

        super.__updateSprites();

        if (Game.currentCam === this.currentState || Game.currentCam === this.previousState) {
            Cams._1A.callBack();
            Cams._1B.callBack();
            Cams._5.callBack();
            if (Game.animatronics.foxy.currentState !== "5") Cams._2A.callBack();
            Cams._2B.callBack();
            Cams._3.callBack();
        }

        if (this.currentState === "ATDOOR" || this.previousState === "ATDOOR") {
            OfficeButtons.__updateLeftSideButtons();
            OfficeButtons.__updateLeftSideOffice();
        }

    }
}

class Chica extends Animatronic {

    constructor(aiLevel) {
        super(aiLevel, 4.98)

        this.currentState = "CAM1A";
        this.previousState = null;

        this._possibleStates = {
            CAM1A : ["CAM1B"],
            CAM1B : ["CAM7", "CAM6", "CAM4A"],
            CAM6 : ["CAM4A", "CAM7"],
            CAM7 : ["CAM1B", "CAM6", "CAM4A"],
            CAM4A : ["CAM4B", "CAM1B"],
            CAM4B : ["ATDOOR"],
            ATDOOR : ["OFFICE"]
        }

        this._leaveStates = ["CAM1B", "CAM4A"];
    }

    movement(delta) {
        super.movement(delta, 'right', () => {

        })
    }

    __updateSprites() {

        super.__updateSprites();

        if (Game.currentCam === this.currentState || Game.currentCam === this.previousState) {
            Cams._1A.callBack();
            Cams._1B.callBack();
            Cams._7.callBack();
            Cams._4A.callBack();
            Cams._4B.callBack();
        }

        if (this.currentState === "ATDOOR" || this.previousState === "ATDOOR") {
            OfficeButtons.__updateRightSideButtons();
            OfficeButtons.__updateRightSideOffice();
        }

    }
}

class Freddy extends Animatronic {

    SOUNDS = {
        laugh1: Sound.from({url: './assets/sounds/Laugh_Giggle_Girl_1.wav'}),
        laugh2: Sound.from({url: './assets/sounds/Laugh_Giggle_Girl_1d.wav'}),
        laugh3: Sound.from({url: './assets/sounds/Laugh_Giggle_Girl_2d.wav'}),
        laugh4: Sound.from({url: './assets/sounds/Laugh_Giggle_Girl_8d.wav'}),
    }

    constructor(aiLevel) {
        super(aiLevel, 3.02);

        this.currentState = "CAM1A";
        this.previousState = null;

        this._possibleStates = {
            CAM1A: ["CAM1B"],
            CAM1B: ["CAM7"],
            CAM7: ["CAM4A"],
            CAM4A: ["CAM4B"],
            CAM4B: ["OFFICE"],
            ATDOOR: ["CAM1B"],
        }

        this._leaveStates = ["CAM4B"];
    }

    movement(ticker) {
        if (Game.camUp && Game.currentCam === this.currentState) {
            const stall = 100/60
            this.timeElapsed-=stall;
            if (this.timeElapsed<0) this.timeElapsed = 0;
            return;
        }
        super.movement(ticker, 'right', () => {
            if (Game.animatronics.bonnie.currentState === 'CAM1A' || Game.animatronics.chica.currentState === 'CAM1A') {
                this.currentState = 'CAM1A'; return;
            }

            const rand = Math.floor(Math.random()*3+1);
            const randomLaugh = this.SOUNDS[`laugh${rand}`];
            for (const item of Object.entries(this.SOUNDS)) {
                item[1].stop();
            };
            if (this.previousState !== "CAM4B") randomLaugh.play();
        }) 
    }

    __updateSprites() {

        super.__updateSprites();

        if (Game.currentCam === this.currentState || Game.currentCam === this.previousState) {
            Cams._1A.callBack();
            Cams._1B.callBack();
            Cams._7.callBack();
            Cams._4A.callBack();
            Cams._4B.callBack();
        }

        if (this.currentState === "OFFICE" && this.previousState === "CAM4B") {
            if (Game.rightLightOn) Game.powerUsage -= 1;
            if (Game.leftLightOn) Game.powerUsage -= 1;
            Game.rightLightOn = false; Game.leftLightOn = false;
            OfficeButtons.__updateLeftSideButtons(); OfficeButtons.__updateRightSideButtons();
            OfficeButtons.__updateLeftSideOffice(); OfficeButtons.__updateRightSideOffice();
        }
    }
}

class Foxy extends Animatronic {

    SOUNDS = {run: Sound.from({url: './assets/sounds/run.wav', volume: 1.5})}

    constructor(aiLevel) {
        super(aiLevel, 5.02)

        this._possibleStates = {
            "1": ["2"],
            "2": ["3"],
            "3": ["4"],
            "4": ["1"],
        };

        this._leaveStates = ["1"];

        this.currentState = "1";
        this.movementFailed = false;
        this.sucessfulHits = 0;
    }

    movement(ticker) {
        if (this.currentState === "4") return;
        if (Game.camUp) { this.movementFailed = true; }
        super.movement(ticker, 'left', () => {
            if (this.movementFailed) this.currentState = this.previousState || "1";
            this.movementFailed = false;
            if (this.currentState === "4") {
                let timeUp = false, checkedLeftHall = false, killmode = false;
                const roaming = new Ticker(); roaming.maxFPS = 60;
                let roamingTime = 0;
                roaming.add((ticker) => {
                    const dt = ticker.deltaTime/ticker.FPS;
                    roamingTime += dt;
                    if (Game.die || Game.win || !Game._gameActive || Game.powerDown) {roaming.stop(); roaming.destroy(); return;}
                    if (Game.camUp && Game.currentCam === "CAM2A" && !checkedLeftHall) { 
                        checkedLeftHall = true;
                        Game.changeSprite(Cams.showArea, Cams.foxyrun); Cams.foxyrun.playAnimation();
                    }
                    if (roamingTime >= 25 && !timeUp) { timeUp = true; }
                    if ((timeUp || checkedLeftHall) && !killmode) {
                        killmode = true;
                        this.SOUNDS.run.play();
                        setTimeout(() => { this.checkDoor() }, 1700);
                        roaming.destroy(); return;
                    }
                }); roaming.start();
            }
        });
    }

    checkDoor() {
        if (!Game.win || !Game.powerDown || !Game.die) {
            if (Game.leftDoorOn) {
                this.currentState = "1"; this.previousState = null; this.__updateSprites();
                const predictedpower = Game.powerLevel-(1+(this.sucessfulHits*5));
                this.sucessfulHits+=1; if (this.sucessfulHits>=2) this.sucessfulHits = 2;
                if (predictedpower<=0) {Game.powerLevel = 0.5;} else Game.powerLevel = predictedpower;
                Game.SOUNDS.doorBaning.play();
            } else {
                if (Game.camUp) CameraTablet.flip();
                Game.die == true;
                Doors.left.visible = false;
                Jumpscares.foxyScare.visible = true; Jumpscares.foxyScare.playAnimation();
                Game.SOUNDS.jumpscare.play(); setTimeout(() => {Game.SOUNDS.jumpscare.stop(); Game.forceGameOver();}, 1000);
            }
        }
    }

    __updateSprites() {
        if (Game.currentCam === "CAM1C") Cams._1C.callBack();
    }
}

class Goku extends Animatronic {
    constructor(aiLevel) {
        super(aiLevel, 5.02);
    }
}

class PolishFreddy extends Animatronic {

    SOUNDS = {
        oh: Sound.from({url: './assets/sounds/ohcholera.wav', volume: 0.33}),
        coin: Sound.from({url: './assets/sounds/coin.mp3', volume: 1.25}),
        vanish: Sound.from({url: './assets/sounds/gaster-vanish.mp3', volume: 1}),
    }

    constructor(aiLevel) {
        super(aiLevel, 6.00);

        this.trashRemaining = 0;
        this.trashObtained = 0;
        this.rageState = 1;
        this.killmode = false; this._killmodeActive = false;
        this.feedingStreak = 0;
        this.full = false;
        this.cooldownTimer = 0;
    }

    movement(ticker) {
        const dt = ticker.deltaTime/ticker.FPS;
        this.timeElapsed += dt;

        if (this.feedingStreak >= 4) {
            this.cooldownTimer+=dt;
            if (this.cooldownTimer >= 10.00) {
                this.feedingStreak = 0; this.cooldownTimer = 0;
                this.timeElapsed = 0; Office.polishFreddySprite.visible = true;
            }
            return;
        }

        if (this.timeElapsed >= this.movementInterval/this.rageState && this.rageState <= 5) {
            this.timeElapsed = 0;
            const chance = Math.floor(Math.random()*20)+1;
            console.log(chance, chance <= this.aiLevel);
            if (chance <= this.aiLevel) {
                if (this.rageState == 5) {
                    this.killmode = true;
                    return;
                }

                this.SOUNDS.oh.stop(); this.SOUNDS.oh.play();
                this.trashRemaining ++ ;
                this.rageState ++ ;

                this.__updateSprites();

                const spawns = ["CAM3", "CAM2A", "CAM2B"];
                const spawn = spawns[Math.floor(Math.random()*spawns.length)];

                const trashbag = new Sprite(Cams.trashTxt); trashbag.eventMode = 'static'; trashbag.spawn = spawn;
                trashbag.scale.set(0.1*Game.scale.x, 0.1*Game.scale.y);
                trashbag.position.set(innerWidth/2+(Math.floor(Math.random()*750)-500)*Game.scale.x, innerHeight/2+(Math.floor(Math.random()*250)-200)*Game.scale.y);
                trashbag.onpointerdown = () => {
                    if (Cams.blackBox.visible || trashbag.spawn !== Game.currentCam) return;
                    this.trashObtained++;
                    if (this.timeElapsed < 0) this.timeElapsed = 0;
                    Cams.cameraScreen.removeChild(trashbag);
                }
                Cams.cameraScreen.addChild(trashbag)

            }
        }
        if (this.killmode && !this._killmodeActive) {
            this._killmodeActive = true;
            const killingPrep = new Ticker(); killingPrep.maxFPS = 60;
            let prepTime = 0;
            const rgb = [1, 1, 1];
            killingPrep.add(ticker => {
                if (this.rageState < 5 || Game.win || Game.powerDown) {this.killmode = false; this._killmodeActive = false; killingPrep.stop(); killingPrep.destroy(); return;}
                const dt = ticker.deltaTime/ticker.FPS;
                prepTime+=dt;
                rgb[1] -= dt/5; rgb[2] -= dt/5;
                Office.polishFreddySprite.tint = rgb;
                Office.polishFreddySprite.scale.set(Office.polishFreddySprite.scale.x+(dt/5), Office.polishFreddySprite.scale.y+(dt/5));
                Office.polishFreddySprite.resize();
                if (prepTime >= 5.00 && !Jumpscares.polishFreddyScare.animations['main'].playing && !Game.die) {
                    Jumpscares.polishFreddyScare.playAnimation(); Jumpscares.polishFreddyScare.visible = true;
                    Game.die = true;
                    Game.SOUNDS.fnaf6jumpscare.play();
                    setTimeout(() => {
                        Jumpscares.polishFreddyScare.currentAnimation.gotoAndStop(0);
                        setTimeout(() => {
                            const redscreen = new Graphics().rect(-innerWidth, 0, innerWidth*2, innerHeight).fill(0xff0000);
                            redscreen.alpha = 0;
                            Jumpscares.polishFreddyScare.addChild(redscreen);
                            let time = 0;
                            const joe = setInterval(() => {
                                time+=66;
                                redscreen.alpha+=0.07;
                                if (time >= 1000) {
                                    Game.forceGameOver(); killingPrep.stop(); killingPrep.destroy(); clearInterval(joe); Jumpscares.polishFreddyScare.removeChild(redscreen); return;
                                }
                            }, 66);
                        }, 1000);
                    }, 1000);
                } 
            }); killingPrep.start();
        }
        for (const bag of Object.values(Cams.cameraScreen.children)) {
            if (bag.texture === Cams.trashTxt) {
                if (bag.spawn === Game.currentCam) bag.visible = true;
                else bag.visible = false;
            }
        }
    }

    pickUpTrash() {

    }

    feedTrash() {
        if (this.rageState > 1 && this.trashObtained > 0) {
            this.SOUNDS.coin.play();
            this.timeElapsed = 0;
            if (this.rageState == 2) {
                this.feedingStreak ++ ;
            } else this.feedingStreak = 0;
            if (this.feedingStreak >= 4) {Office.polishFreddySprite.visible = false; this.SOUNDS.vanish.play();}
            this.rageState--; this.trashObtained--;
            this.__updateSprites();
        }
    }

    __updateSprites() {
        switch(this.rageState) {
            case 1: Office.polishFreddySprite.scale.set(1*Game.scale.x, 1*Game.scale.y); break;
            case 2: Office.polishFreddySprite.scale.set(1.2*Game.scale.x, 1.2*Game.scale.y); break;
            case 3: Office.polishFreddySprite.scale.set(1.4*Game.scale.x, 1.4*Game.scale.y); break;
            case 4: Office.polishFreddySprite.scale.set(1.6*Game.scale.x, 1.6*Game.scale.y); break;
        }
        Office.polishFreddySprite.tint = 0xffffff;
        Office.polishFreddySprite.resize();
    }
}

class Bear5 extends Animatronic {
    constructor(aiLevel) {
        super(aiLevel, 5.00);
    }
}


export {Animatronic, Bonnie, Chica, Freddy, Foxy, Goku, PolishFreddy, Bear5}