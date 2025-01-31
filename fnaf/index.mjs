
import { Application, Assets, Container, Graphics, Sprite, Text } from '../pixi.mjs';

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

        movement(delta, callBack) {
            if (this.timeElapsed >= this.movementInterval) {
                this.timeElapsed = 0;
                const chance = (Math.random()*20)+1
                if (chance >= 1 && chance <= this.aiLevel)
                    callBack();
            }
        }
    }

    class Bonnie extends Animatronic {

        #possibleLocations = {
            CAM1A : ["CAM1B", "CAM5"],
            CAM1B : ["CAM2A"],
            CAM5 : ["CAM2A"],
            CAM2A : ["CAM3", "CAM2B"],
            CAM3 : ["CAM2B", ],
            CAM2B : ["CAM3", ""],
        }

        constructor(aiLevel) {
            super(aiLevel, 4.9);

            this.currentState = "CAM1A"
        }

        movement() {
            super.movement(() => {
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

        gameLoop() {

        }
    }

    //

    const app = new Application();
    await app.init({ background: "#000000", resizeTo: window });

    //**
    // program here 
    // */

    const bgMusic = new Audio('./1-04. Thank You For Your Patience.mp3');
    bgMusic.play();

    const bon = new Bonnie(20);
    bon.movement();

    const officepng = await Assets.load('./assets/sprites/office/39.png')
    const officeSprite = new Sprite(officepng);
    officeSprite.anchor = 0.5;
    officeSprite.x = innerWidth/2, officeSprite.y = innerHeight/2;
    officeSprite.height = window.innerHeight;
    officeSprite.width = window.innerWidth*1.5;

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
    const t = new Text({
        text: `${totalDelta}`,
        style: {
            fill: 0xffffff,
            align: 'center',
        }
    });

    app.stage.addChild(t);

    MenuRender.addChild(MainMenu, NightsMenu, SettingsMenu);
    setRenderState(MenuRender, MainMenu);
    
    //

    OfficeRender.addChild(officeSprite);
    GameRender.addChild(OfficeRender, CameraRender);
    setRenderState(GameRender, OfficeRender);

    //

    app.stage.addChild(GameRender, MenuRender);
    setRenderState(app.stage, MenuRender);
    app.canvas.style.display = "block";
    document.body.appendChild(app.canvas)

    app.ticker.add((ticker) => {
        totalDelta+=ticker.deltaTime;
        t.text = totalDelta;
        bon.movement(ticker.deltaTime);
    });
})();
