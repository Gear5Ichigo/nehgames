import { Sound } from "../../pixi-sound.mjs";
import Cams from "./cams.mjs";
import Game from "./game.mjs";
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
                        if (Game[door.toLowerCase()+'LightOn']) {
                            Game[door.toLowerCase()+'LightOn'] = false;
                            Game.powerUsage-=1;
                        }
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
        if ((Game.currentCam === this.previousState || Game.currentCam === this.currentState) && Cams.blackBox.visible == false && Game.camUp) {
            Cams.blackBox.visible = true;
            Game.SOUNDS.camError1.play();
        }
    };
}

class Bonnie extends Animatronic {

    #footsteps = new Audio('./assets/sounds/deep_steps.wav');

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
                this.#footsteps.play();
        })
    }

    __updateSprites() {

        super.__updateSprites();

        if (this.previousState === 'CAM1A' && this.previousState === Game.currentCam) {
            if (Game.animatronics.chica.currentState === this.previousState) {
                Game.changeSprite(Game._cameraShow, Cams.stageSprites['68.png']);
            } else if (Game.animatronics.freddy.currentState === this.previousState) {
                Game.changeSprite(Game._cameraShow, Cams.stageSprites['224.png']);
            } else Game.changeSprite(Game._cameraShow, Cams.stageSprites['484.png']);
        }

        //

        if (Game.currentCam === "CAM1B" && this.previousState === "CAM1B") {
            if (Game.animatronics.chica.currentState === "CAM1B") {
                Game.changeSprite(Game._cameraShow, Cams.diningSprites["215.png"]);
            } else {
                Game.changeSprite(Game._cameraShow, Cams.diningSprites["48.png"]);
            }
        }

        //

        if (Game.currentCam === "CAM1B" && this.currentState === "CAM1B") {
            Game.changeSprite(Game._cameraShow, Cams.diningSprites["90.png"]);
        }

        if (Game.currentCam === "CAM5" && this.currentState === "CAM5") {
            Game.changeSprite(Game._cameraShow, Cams.backStageSprites["205.png"]);
        } else if (Game.currentCam === "CAM5" && this.previousState === "CAM5") {
            Game.changeSprite(Game._cameraShow, Cams.backStageSprites['83.png']);
        }

        if (Game.currentCam === "CAM3" && this.currentState === "CAM3") {
            Game.changeSprite(Game._cameraShow, Cams.supplyClosetSprites['190.png']);
        } else if (Game.currentCam === "CAM3" && this.previousState === "CAM3") {
            Game.changeSprite(Game._cameraShow, Cams.supplyClosetSprites['62.png']);
        }

        if (Game.currentCam === "CAM2A" && this.currentState === "CAM2A") {
            Game.changeSprite(Game._cameraShow, Cams.leftHallSprites["206.png"]);
        } else if (Game.currentCam === "CAM2A" && this.previousState === "CAM2A") {
            Game.changeSprite(Game._cameraShow, Cams.leftHallSprites["44.png"]);
        }

        if (Game.currentCam === "CAM2B" && this.currentState === "CAM2B") {
            Game.changeSprite(Game._cameraShow, Cams.leftCornerSprites['188.png']);
        } else if (Game.currentCam === "CAM2B" && this.previousState === "CAM2B") {
            Game.changeSprite(Game._cameraShow, Cams.leftCornerSprites['0.png']);
        }

        //

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

        if (this.previousState === 'CAM1A' && this.previousState === Game.currentCam) {
            if (Game.animatronics.bonnie.currentState === this.previousState) {
                Game.changeSprite(Game._cameraShow, Cams.stageSprites['223.png']);
            } else if (Game.animatronics.freddy.currentState === this.previousState) {
                Game.changeSprite(Game._cameraShow, Cams.stageSprites['224.png']);
            } else Game.changeSprite(Game._cameraShow, Cams.stageSprites['484.png']);
        }

        //

        if (Game.currentCam === "CAM1B" && this.previousState === "CAM1B") {
            if (Game.animatronics.bonnie.currentState === "CAM1B") {
                Game.changeSprite(Game._cameraShow, Cams.diningSprites["90.png"]);
            } else if (Game.animatronics.freddy.currentState === "CAM1B") {
                Game.changeSprite(Game._cameraShow, Cams.diningSprites["492.png"]);
            } else {
                Game.changeSprite(Game._cameraShow, Cams.diningSprites["48.png"]);
            }
        }

        if (Game.currentCam === "CAM1B" && this.currentState === "CAM1B") {
            Game.changeSprite(Game._cameraShow, Cams.diningSprites["215.png"]);
        }

        if (this.currentState === "CAM4B" && Game.currentCam === this.currentState) {
            Game.changeSprite(Game._cameraShow, Cams.rightCornerSprites['220.png']);
        } else if (this.previousState === "CAM4B" && Game.currentCam === this.previousState) {
            if (Game.animatronics.freddy.currentState === Game.currentCam) {
                Game.changeSprite(Game._cameraShow, Cams.rightCornerSprites['486.png']);
            } else Game.changeSprite(Game._cameraShow, Cams.rightCornerSprites['49.png']);
        }

        if (this.currentState === "CAM4A" && Game.currentCam === this.currentState) {
            Game.changeSprite(Game._cameraShow, Cams.rightHallSprites['221.png']);
        } else if (this.previousState === "CAM4A" && Game.currentCam === this.previousState) {
            if (Game.animatronics.freddy.currentState === Game.currentCam) {
                Game.changeSprite(Game._cameraShow, Cams.rightHallSprites['487.png']);
            } else Game.changeSprite(Game._cameraShow, Cams.rightHallSprites['67.png']);
        }

        if (this.currentState === "CAM7" && Game.currentCam === this.currentState) {
            Game.changeSprite(Game._cameraShow, Cams.restRoomsSprites['219.png']);
        } else if (this.previousState === "CAM7" && Game.currentCam === this.previousState) {
            if (Game.animatronics.freddy.currentState === Game.currentCam) {
                Game.changeSprite(Game._cameraShow, Cams.restRoomsSprites['494.png']);
            } else Game.changeSprite(Game._cameraShow, Cams.restRoomsSprites['41.png']);
        }

        //

        if (this.currentState === "ATDOOR" || this.previousState === "ATDOOR") {
            OfficeButtons.__updateRightSideButtons();
            OfficeButtons.__updateRightSideOffice();
        }
    }
}

class Freddy extends Animatronic {

    #SOUNDS = {
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
            CAM4B: ["ATDOOR"],
            ATDOOR: ["CAM1B"],
        }

        this._leaveStates = ["CAM1B"];
    }

    movement(ticker) {
        if (Game.camUp && Game.currentCam === this.currentState) {
            const stall = 100/60
            if (this.timeElapsed>=stall) this.timeElapsed = stall;
            return;
        }
        super.movement(ticker, 'right', () => {
            if (Game.animatronics.bonnie.currentState === 'CAM1A' || Game.animatronics.chica.currentState === 'CAM1A') {
                this.currentState = 'CAM1A'; return;
            }

            const rand = Math.floor(Math.random()*3+1);
            const randomLaugh = this.#SOUNDS[`laugh${rand}`];
            for (const item of Object.entries(this.#SOUNDS)) {
                item[1].stop();
            };
            randomLaugh.play();
        }) 
    }

    __updateSprites() {

        super.__updateSprites();

        if (this.previousState === 'CAM1A' && this.previousState === Game.currentCam) {
            Game.changeSprite(Game._cameraShow, Cams.stageSprites['484.png']);
        }

        if (Game.currentCam === "CAM1B" && this.currentState === Game.currentCam) {
            Game.changeSprite(Game._cameraShow, Cams.diningSprites["492.png"]);
        } else if (this.previousState === "CAM1B" && Game.currentCam === this.previousState) {
            if (Game.animatronics.chica.currentState === "CAM1B") {
                Game.changeSprite(Game._cameraShow, Cams.diningSprites["215.png"]);
            } else if (Game.animatronics.bonnie.currentState === "CAM1B") {
                Game.changeSprite(Game._cameraShow, Cams.diningSprites["90.png"]);
            } else {
                Game.changeSprite(Game._cameraShow, Cams.diningSprites["48.png"]);
            }
        }

        if (this.currentState === "CAM4B" && Game.currentCam === this.currentState) {
            Game.changeSprite(Game._cameraShow, Cams.rightCornerSprites['486.png']);
        } else if (this.previousState === "CAM4B" && Game.currentCam === this.previousState) {
            if (Game.animatronics.chica.currentState === Game.currentCam) {
                Game.changeSprite(Game._cameraShow, Cams.rightCornerSprites['220.png']);
            } else Game.changeSprite(Game._cameraShow, Cams.rightCornerSprites['49.png']);
        }

        if (this.currentState === "CAM4A" && Game.currentCam === this.currentState) {
            Game.changeSprite(Game._cameraShow, Cams.rightHallSprites['487.png']);
        } else if (this.previousState === "CAM4A" && Game.currentCam === this.previousState) {
            if (Game.animatronics.chica.currentState === Game.currentCam) {
                Game.changeSprite(Game._cameraShow, Cams.rightHallSprites['221.png']);
            } else Game.changeSprite(Game._cameraShow, Cams.rightHallSprites['67.png']);
        }

        if (this.currentState === "CAM7" && Game.currentCam === this.currentState) {
            Game.changeSprite(Game._cameraShow, Cams.restRoomsSprites['494.png']);
        } else if (this.previousState === "CAM7" && Game.currentCam === this.previousState) {
            if (Game.animatronics.chica.currentState === Game.currentCam) {
                Game.changeSprite(Game._cameraShow, Cams.restRoomsSprites['219.png']);
            } else Game.changeSprite(Game._cameraShow, Cams.restRoomsSprites['41.png']);
        }
    }
}

class Foxy extends Animatronic {

    SOUNDS = {run: Sound.from('./assets/sounds/run.wav')}

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
        if (Game.camUp && this.currentState!=="4") {
            this.movementFailed = true;
        }
        super.movement(ticker, 'left', () => {
            if (this.movementFailed) this.currentState = this.previousState || "1";
            this.movementFailed = false;
        }) 
    }

    __updateSprites() {
        if (Game.currentCam === "CAM1C") {
            if (this.currentState==="1") {
                Game.changeSprite(Game._cameraShow, Cams.pirateCoveSprites['66.png']);
            } else if (this.currentState==="2") {
                Game.changeSprite(Game._cameraShow, Cams.pirateCoveSprites['211.png']);
            } else if (this.currentState==="3") {
                Game.changeSprite(Game._cameraShow, Cams.pirateCoveSprites['338.png']);
            } else if (this.currentState==="4") {
                setTimeout(() => {
                    if (!Game.win || !Game.powerDown || !Game.die) {
                        if (Game.leftDoorOn) {
                            const predictedpower = Game.powerLevel-(1+(this.sucessfulHits*5));
                            this.sucessfulHits+=1; if (this.sucessfulHits>=2) this.sucessfulHits = 2;
                            if (predictedpower<=0) {Game.powerLevel = 0.5;} else Game.powerLevel = predictedpower;
                            Game.SOUNDS.doorBaning.play();
                        } else {
                            Game.SOUNDS.jumpscare.play(); setTimeout(() => {Game.SOUNDS.jumpscare.stop(); Game.forceGameOver();}, 300);
                        }
                    }
                }, 2000);
                this.SOUNDS.run.play();
                Game.changeSprite(Game._cameraShow, Cams.pirateCoveSprites['240.png']);
            }
        }
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
    }
}

class Bear5 extends Animatronic {
    constructor(aiLevel) {
        super(aiLevel, 5.00);
    }
}


export {Animatronic, Bonnie, Chica, Freddy, Foxy, Goku, PolishFreddy, Bear5}