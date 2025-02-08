import { Sound } from "../../pixi-sound.mjs";
import Cams from "./cams.mjs";
import Game from "./game.mjs";
import Office from "./office.mjs";

class Animatronic {

    constructor(aiLevel, movementInterval) {
        this.aiLevel = aiLevel
        this.timeElapsed = 0;
        this.movementInterval = movementInterval;
        this._possibleStates = {};
        this.currentState = null;
        this.previousState = null;
    }

    __updateSprites() {};

    movement(ticker, callBack) {
        const dt = ticker.deltaTime/ticker.FPS;
        this.timeElapsed+=dt;
        if (this.timeElapsed >= this.movementInterval) {
            this.timeElapsed = 0;
            const chance = (Math.random()*20)+1
            if (chance >= 1 && chance <= this.aiLevel) {
                const currentCam = this._possibleStates[this.currentState];
                const moveTo = currentCam[Math.floor(Math.random()*currentCam.length)]
                console.log(currentCam, moveTo);
                this.previousState = this.currentState;
                if (moveTo && moveTo!='')
                    this.currentState = moveTo;
                callBack();
                this.__updateSprites();
            }
        }
    }
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
            CAM3 : ["CAM2B"],
            CAM2B : ["ATDOOR"],
            ATDOOR : ["CAM1B"]
        };
    }

    movement(delta) {
        super.movement(delta, () => {
            if (this.currentState === "CAM2A" || this.currentState === "CAM2B" || this.currentState === "CAM3" || this.currentState === "ATDOOR")
                this.#footsteps.play();
        })
    }

    __updateSprites() {

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

        if (Game.leftLightOn && this.currentState==="ATDOOR") {
            const random = Math.random()*100;
            if (random <= 10) {
                Game.changeSprite(Game.officeSpritesContainer, Office._sprites["58goku.png"]);
                Game.SOUNDS.gokuscare.play({volume: 2});
                return;
            }
            Game.changeSprite(Game.officeSpritesContainer, Office._sprites["225.png"]);
            Game.SOUNDS.windowscare.play({});
        } else if (this.previousState === "ATDOOR") {
            if (Game.leftLightOn) {
                Game.changeSprite(Game.officeSpritesContainer, Office._sprites["58.png"]);
            } else Game.changeSprite(Game.officeSpritesContainer, Office._sprites["39.png"]);
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
            CAM6 : ["CAM4A"],
            CAM7 : ["CAM1B", "CAM6"],
            CAM4A : ["CAM4B"],
            CAM4B : ["ATDOOR"],
            ATDOOR : ["CAM1B"]
        }
    }

    movement(delta) {
        super.movement(delta, () => {

        })
    }

    __updateSprites() {

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
        } else if (this.previousState === "CAM4A" && Game.currentCam === this.previousState) {
            if (Game.animatronics.freddy.currentState === Game.currentCam) {
                Game.changeSprite(Game._cameraShow, Cams.restRoomsSprites['494.png']);
            } else Game.changeSprite(Game._cameraShow, Cams.restRoomsSprites['41.png']);
        }

        //

        if (Game.rightLightOn && this.currentState==="ATDOOR") {
            const random = Math.random()*100;
            if (random <= 6) {
                Game.changeSprite(Game.officeSpritesContainer, Office._sprites["225power.png"]);
                return;
            }
            Game.changeSprite(Game.officeSpritesContainer, Office._sprites["225.png"]);
            Game.SOUNDS.windowscare.play({});
        } else if (this.previousState === "ATDOOR") {
            if (Game.rightLightOn) {
                Game.changeSprite(Game.officeSpritesContainer, Office._sprites["127.png"]);
            } else Game.changeSprite(Game.officeSpritesContainer, Office._sprites["39.png"]);
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
    }

    movement(ticker) {
        if (Game.camUp && Game.currentCam === this.currentState) return;
        super.movement(ticker, () => {
            if (Game.animatronics.bonnie.currentState === 'CAM1A' || Game.animatronics.chica.currentState === 'CAM1A') {
                this.currentState = 'CAM1A'; return;
            }

            const rand = Math.floor(Math.random()*3+1);
            const randomLaugh = this.#SOUNDS[`laugh${rand}`];
            randomLaugh.play();
        }) 
    }

    __updateSprites() {

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
            Game.changeSprite(Game._cameraShow, Cams.rightHallSprites['221.png']);
        } else if (this.previousState === "CAM4A" && Game.currentCam === this.previousState) {
            if (Game.animatronics.chica.currentState === Game.currentCam) {
                Game.changeSprite(Game._cameraShow, Cams.rightHallSprites['487.png']);
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

class Goku extends Animatronic {
    constructor(aiLevel) {
        super(aiLevel, 5.02);
    }
}

export {Animatronic, Bonnie, Chica, Freddy, Goku}