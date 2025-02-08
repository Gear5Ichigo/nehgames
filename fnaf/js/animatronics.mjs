import Cams from "./cams.mjs";
import Game from "./game.mjs";
import Office from "./office.mjs";

class Animatronic {

    constructor(aiLevel, movementInterval) {
        this.aiLevel = aiLevel
        this.timeElapsed = 0;
        this.movementInterval = movementInterval;
        this.currentState = null;
        this.previousState = null;
    }

    movement(ticker, callBack) {
        const dt = ticker.deltaTime/ticker.FPS;
        this.timeElapsed+=dt;
        if (this.timeElapsed >= this.movementInterval) {
            this.timeElapsed = 0;
            const chance = (Math.random()*20)+1
            if (chance >= 1 && chance <= this.aiLevel)
                callBack();
        }
    }
}

class Bonnie extends Animatronic {

    #footsteps = new Audio('./assets/sounds/deep_steps.wav');

    #possibleLocations = {
        CAM1A : ["CAM1B", "CAM5"],
        CAM1B : ["CAM2A", "CAM5"],
        CAM5 : ["CAM2A", "CAM1B"],
        CAM2A : ["CAM3", "CAM2B"],
        CAM3 : ["CAM2B"],
        CAM2B : ["ATDOOR"],
        ATDOOR : ["CAM1B"]
    }

    constructor(aiLevel) {
        super(aiLevel, 4.97);
        
        this.currentState = "CAM1A"
        this.previousState = null;
    }

    movement(delta) {
        super.movement(delta, () => {
            const currentCam = this.#possibleLocations[this.currentState]
            const moveTo = currentCam[Math.floor(Math.random()*currentCam.length)]
            
            this.previousState = this.currentState;

            if (moveTo && moveTo!='')
                this.currentState = moveTo;
            if (this.currentState === "CAM2A" || this.currentState === "CAM2B" || this.currentState === "CAM3" || this.currentState === "ATDOOR")
                this.#footsteps.play();

            this.#__updateSprites();
        })
    }

    #__updateSprites() {

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

    #possibleLocations = {
        CAM1A : ["CAM1B"],
        CAM1B : ["CAM7", "CAM6", "CAM4A"],
        CAM6 : ["CAM4A"],
        CAM7 : ["CAM1B", "CAM6"],
        CAM4A : ["CAM4B"],
        CAM4B : ["ATDOOR"],
        ATDOOR : ["CAM1B"]
    }

    constructor(aiLevel) {
        super(aiLevel, 4.98)

        this.currentState = "CAM1A"
        this.previousState = null;
    }

    movement(delta) {
        super.movement(delta, () => {
            const currentCam = this.#possibleLocations[this.currentState];
            const moveTo = currentCam[Math.floor(Math.random()*currentCam.length)];

            this.previousState = this.currentState;
            
            if (moveTo && moveTo!='')
                this.currentState = moveTo;

            this.#__updateSprites();
        })
    }

    #__updateSprites() {

        //

        if (Game.currentCam === "CAM1B" && this.previousState === "CAM1B") {
            if (Game.animatronics.bonnie.currentState === "CAM1B") {
                Game.changeSprite(Game._cameraShow, Cams.diningSprites["90.png"]);
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
            Game.changeSprite(Game._cameraShow, Cams.rightCornerSprites['49.png']);
        }

        if (this.currentState === "CAM4A" && Game.currentCam === this.currentState) {
            Game.changeSprite(Game._cameraShow, Cams.rightHallSprites['221.png']);
        } else if (this.previousState === "CAM4A" && Game.currentCam === this.previousState) {
            Game.changeSprite(Game._cameraShow, Cams.rightHallSprites['67.png']);
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

class Goku extends Animatronic {
    constructor(aiLevel) {
        super(aiLevel, 5.02);
    }
}

export {Animatronic, Bonnie, Chica, Goku}