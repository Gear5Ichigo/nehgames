import { Sound } from "../../public/pixi-sound.mjs";
import { Ticker } from "../../public/pixi.min.mjs";
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
            const chance = (Math.random()*20)+1
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
            console.log("BRO")
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
                Jumpscares.foxyScare.visible = true; Jumpscares.foxyScare.gotoAndPlay(0);
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
    constructor(aiLevel) {
        super(aiLevel, 5.00);

        this.trashRemaining = 0;
        this.rageState = 1;
    }

    movement(ticker) {
        console.log(ticker);
        const dt = ticker.deltaTime/ticker.FPS;
        this.timeElapsed += dt;
        if (this.timeElapsed >= this.movementInterval/this.trashRemaining) {
            this.timeElapsed = 0;
            this.trashRemaining ++ ;
            this.rageState ++ ;
            if (this.trashRemaining > 5) this.trashRemaining = 5;
            if (this.rageState > 5) this.rageState = 5;
            this.__updateSprites();
        }
    }

    pickUpTrash() {

    }

    feedTrash() {

    }

    __updateSprites() {
        switch(this.rageState) {
            case 1: Office.polishFreddySprite.scale.set(1, 1); break;
            case 2: Office.polishFreddySprite.scale.set(1.2, 1.2); break;
            case 3: Office.polishFreddySprite.scale.set(1.4, 1.4); break;
            case 4: Office.polishFreddySprite.scale.set(1.6, 1.6); break;
        }
    }
}

class Bear5 extends Animatronic {
    constructor(aiLevel) {
        super(aiLevel, 5.00);
    }
}


export {Animatronic, Bonnie, Chica, Freddy, Foxy, Goku, PolishFreddy, Bear5}