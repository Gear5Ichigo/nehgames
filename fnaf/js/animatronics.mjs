class Animatronic {

    constructor(aiLevel, movementInterval) {
        this.aiLevel = aiLevel
        this.timeElapsed = 0;
        this.movementInterval = movementInterval;
        this.currentState = null;
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
        CAM2B : ["CAM3", "ATDOOR"],
        ATDOOR : ["CAM1B"]
    }

    constructor(aiLevel) {
        super(aiLevel, 4.98);
        
        this.currentState = "CAM1A"
    }

    movement(delta) {
        super.movement(delta, () => {
            const currentCam = this.#possibleLocations[this.currentState]
            const moveTo = currentCam[Math.floor(Math.random()*currentCam.length)]
            console.log(moveTo)
            if (moveTo && moveTo!='')
                this.currentState = moveTo;
            if (this.currentState === "CAM2A" || this.currentState === "CAM2B" || this.currentState === "CAM3" || this.currentState === "ATDOOR")
                this.#footsteps.play();
        })
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
        super(aiLevel, 4.97)

        this.currentState = "CAM1A"
    }

    movement(delta) {
        super.movement(delta, () => {
            const currentCam = this.#possibleLocations[this.currentState]
            const moveTo = currentCam[Math.floor(Math.random()*currentCam.length)]
            console.log(moveTo)
            if (moveTo && moveTo!='')
                this.currentState = moveTo;
        })
    }
}

class Goku extends Animatronic {
    constructor(aiLevel) {
        super(aiLevel, 5.02);
    }
}

export {Animatronic, Bonnie, Chica, Goku}