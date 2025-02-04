import { AnimatedSprite, Application, Assets, Container, Graphics, Sprite, Text } from '../../pixi.mjs';
import './game.mjs';
import Game from './game.mjs';

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

    //

    const nativeResolution  = [1920, 1080];
    const nativeRatio = nativeResolution[0] / nativeResolution[1];

    const app = new Application();
    await app.init({ background: "#000000", resizeTo: window });

    Assets.addBundle('fonts', [
        {alias: 'Press Start', src: './assets/fonts/PrStart.ttf'},
    ]); await Assets.loadBundle('fonts');

    const GameRender = new Container();
    GameRender.sortableChildren = true;
    await Game.init(GameRender);

    window.onresize = (event) => {
        app.renderer.resize(window);
    }

    //**
    // program here 
    // */

    const bgMusic = new Audio('./1-04. Thank You For Your Patience.mp3');
    bgMusic.loop = true;
    bgMusic.play();

    const officepng = await Assets.load('./assets/sprites/office/39.png')
    const officeSprite = new Sprite(officepng);
    officeSprite.anchor = 0.6;
    officeSprite.x = innerWidth/2, officeSprite.y = innerHeight/2;
    officeSprite.height = window.innerHeight;
    officeSprite.width = window.innerWidth*1.5;

    const MenuRender = new Container();

    const SettingsMenu = new Container();
    const NightsMenu = new Container();
    const MainMenu = new Container();

    // const anim = new AnimatedSprite(camflipanim.animations.flip);
    // anim.x = innerWidth/2-(anim.width/2); anim.y = innerHeight- anim.height;
    // anim.animationSpeed = 0.7;

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
            Game.start({
                bonnieLevel: 20,
                chicaLevel: 20
            });
            bgMusic.pause();
            setRenderState(app.stage, Game.render);
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

    Game.displayHUDContainer.addChild(t, t2)
    setRenderState(Game.render, Game.officeRender);

    //

    app.stage.addChild(Game.render, MenuRender);
    setRenderState(app.stage, MenuRender);
    app.canvas.style.display = "block";
    document.body.appendChild(app.canvas)

    const scare = new Audio('assets/sounds/windowscare.wav')

    app.ticker.maxFPS = 60;
    app.ticker.add((ticker) => {
        if (actionLog.length > 6) actionLog.pop()
        const dt = ticker.deltaTime;
        totalDelta+=ticker.deltaTime;
        if (Game.render.visible) {
            Game.updateLoop(ticker);
            t.text = `Bonnie is now at : ${Game.animatronics.bonnie.currentState}`;
            t2.text = `Chica is now at : ${Game.animatronics.chica.currentState}`;
            if (Game.animatronics.bonnie.currentState === "ATDOOR") scare.play();
        }
    });
})();
