import { Application, Assets, Container, Graphics, Sprite, Text } from '../pixi.mjs';
import { sound } from '../pixi-sound.mjs';
import { PixelateFilter } from '../pixi-filters.mjs';

(async () => {

    class Button extends Container {

        constructor(x, y, width, height, text, container) {
            super({
                eventMode: 'static'
            });

            this.rect = new Graphics()
            .rect(x, y, width, height,)
            .fill(0xffffff)
            
            this.text = new Text({
                text: text,
                zIndex: 2,
                x: x, y: y,
                style: {
                    fill: 0x000000,
                    fontSize: 32,
                    align: 'center'
                },
            })

            this.addChild(this.text, this.rect);
            container.addChild(this);
        }
    }

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

        #footsteps = new Audio('./assets/audio/deep steps.wav');

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

    class Game {
        constructor(fr, bo, ch, fo) {
            this.animatronics = {

            }

            this.battery = 100;
            this.batteryDrain = 1;
            this.batteryDrainInterval = 4.9;

            this.rightDoorClosed = false;
            this.leftDoorClosed = false;

            this.hourLength = 89; // in seconds
            this.currentHour = 12;
        }

        update() {

        }
    }

    //

    const app = new Application();
    await app.init({ background: "#000000", resizeTo: window });

    window.onresize = (event) => {
        
    }

    //**
    // program here 
    // */

    const bgMusic = new Audio('./1-04. Thank You For Your Patience.mp3');
    bgMusic.play();

    const bon = new Bonnie(20);
    const ch = new Chica(20);

    const officepng = await Assets.load('./assets/sprites/office/39.png')
    const officeSprite = new Sprite(officepng);
    officeSprite.anchor = 0.5;
    officeSprite.x = innerWidth/2, officeSprite.y = innerHeight/2;
    officeSprite.height = window.innerHeight;
    officeSprite.width = window.innerWidth*1.5;

    const camflipbuttonpng = await Assets.load('./assets/sprites/420.png');
    const camflipbutton = new Sprite(camflipbuttonpng);
    camflipbutton.anchor - 0.5;
    camflipbutton.x = innerWidth/2, camflipbutton.y = innerHeight-camflipbutton.height-10;

    const GameRender = new Container();
    const MenuRender = new Container();

    const OfficeRender = new Container();
    const CameraRender = new Container();

    const SettingsMenu = new Container();
    const NightsMenu = new Container();
    const MainMenu = new Container();

    function setRenderState(render, state) {
        render.children.forEach(element => {
            if (element !== state) {
                element.visible = false;
            } else element.visible = true;
        });
    }

    const StartGameButton = new Button(innerWidth/2, innerHeight/2, 250, 80, "Start", MainMenu);
    StartGameButton.onpointerdown = (event) => {
       setRenderState(MenuRender, NightsMenu);
    }
    const SettingsButton = new Button(innerWidth/2, innerHeight/2+100, 250, 80, "Settings", MainMenu);
    SettingsButton.onpointerdown = (event) => {
        setRenderState(MenuRender, SettingsMenu)
    }
    const NightsBackButton = new Button(innerWidth/2-250, innerHeight/2-220, 140, 40, "Back", NightsMenu);
    NightsBackButton.onpointerdown = (event) => {
        setRenderState(MenuRender, MainMenu)
    }

    let NightsSelection = [];
    for (let night = 0; night < 5; night++) {
        const b = new Button(innerWidth/2-100, innerHeight/2+(100*night)-200, 250, 80, `Night ${night+1}`, NightsMenu)
        b.onpointerdown = (event) => {
            setRenderState(app.stage, GameRender);
        }
        NightsSelection.push(b);
    }

    let totalDelta = 0;
    const actionLog = [];
    const t = new Text({
        text: `har har`,
        style: {
            fill: 0xffffff,
            align: 'center',
        }
    });
    t.x = 1, t.y = 1;
    const t2 = new Text({
        text: `har har`,
        style: {
            fill: 0xffe135,
            align: 'center',
        }
    });
    t2.x = 1, t2.y = 51;

    MenuRender.addChild(MainMenu, NightsMenu, SettingsMenu);
    setRenderState(MenuRender, MainMenu);

    //

    OfficeRender.addChild(officeSprite, camflipbutton, t, t2);
    GameRender.addChild(OfficeRender, CameraRender);
    setRenderState(GameRender, OfficeRender);

    //

    app.stage.addChild(GameRender, MenuRender);
    setRenderState(app.stage, MenuRender);
    app.canvas.style.display = "block";
    document.body.appendChild(app.canvas)

    const scare = new Audio('assets/sounds/windowscare.wav')

    app.ticker.maxFPS = 60;
    app.ticker.add((ticker) => {
        if (actionLog.length > 6) actionLog.pop()
        const dt = ticker.deltaTime;
        totalDelta+=ticker.deltaTime;
        t.text = `Bonnie is now at : ${bon.currentState}`;
        t2.text = `Chica is now at : ${ch.currentState}`;
        if (GameRender.visible) {
            bon.movement(ticker);
            ch.movement(ticker);
            if (bon.currentState === "ATDOOR") scare.play();
        }
    });
})();
