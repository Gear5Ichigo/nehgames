import { Application, Container, Graphics, Text } from '../pixi.mjs';

window.onerror = function(e){
    document.getElementById('prompt').innerHTML = e.toString();
}

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
        constructor(aiLevel) {
            this.aiLevel = aiLevel
            this.movementInterval = 4.5
        }

        movement() {
            const movementOppurtunity = (Math.random()*20)+1
            if (movementOppurtunity >= 1 && movementOppurtunity <= this.aiLevel)
                return true;
        }
    }

    class Game {
        constructor(fr, bo, ch, fo) {
            this.battery = 100;
            this.batteryDrain = 1;
            this.batteryDrainInterval = 4.9;

            this.rightDoorClosed = false;
            this.leftDoorClosed = false;

            this.hourLength = 89; // in seconds
            this.currentHour = 12;
        }
    }

    //

    const app = new Application();
    await app.init({ background: "#000000", resizeTo: window });

    //**
    // program here 
    // */

    let keys = {}

    const GameRender = new Container();
    const MenuRender = new Container();

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
        NightsSelection.push(b);
    }

    let totalDelta = 0;
    const t = new Text({
        text: totalDelta,
        style: {
            fill: 0xffffff,
        }
    });

    app.stage.add(t);

    MenuRender.addChild(MainMenu, NightsMenu, SettingsMenu);
    setRenderState(MenuRender, MainMenu);
    app.stage.addChild(GameRender, MenuRender);

    app.canvas.style.display = "block";
    document.body.appendChild(app.canvas)

    window.addEventListener("keydown", (e) => {
        console.log(e.key.toLowerCase());
        keys[e.key.toLowerCase()] = true;
    });
    window.addEventListener("keyup", (e) => {
        keys[e.key.toLowerCase()] = false;
    })

    app.ticker.add((delta) => {
        totalDelta+=delta;
        t.text = totalDelta;
        if ( keys["w"] ) {
            console.log("moving");
        }
    });
})();
