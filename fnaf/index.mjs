import { Application, Container, Graphics, Text } from '../pixi.mjs';

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

    const app = new Application();

    let keys = {}

    await app.init({ background: "#000000", resizeTo: window });

    //**
    // program here 
    // */

    function setRenderState(render, state) {
        render.children.forEach(element => {
            if (element !== state) {
                element.visible = false;
            } else element.visible = true;
        });
    }

    const GameRender = new Container();
    const MenuRender = new Container();

    const SettingsMenu = new Container();
    const NightsMenu = new Container();
    const MainMenu = new Container();

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
        if ( keys["w"] ) {
            console.log("moving");
        }
    });
})();
