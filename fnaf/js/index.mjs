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

    const app = new Application();
    await app.init({ background: "#000000", resizeTo: window });

    Assets.addBundle('fonts', [
        {alias: 'Press Start', src: './assets/fonts/PrStart.ttf'},
        {alias: 'Volter', src: './assets/fonts/Volter__28Goldfish_29.ttf', data: { family: "Volter" }},
        {alias: 'fnaf', src: './assets/fonts/five-nights-at-freddys.ttf', data: { family: "FNAF" }}
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
    bgMusic.volume = 0.75;
    bgMusic.loop = true;
    bgMusic.play();

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

    const StartGameButton = new Button(innerWidth/2, innerHeight/2, 250*Game.scale.x, 80*Game.scale.y, "Start", MainMenu);
    StartGameButton.pivot.set(250/2, 80/2);
    StartGameButton.onpointerdown = (event) => {
       setRenderState(MenuRender, NightsMenu);
    }
    const SettingsButton = new Button(innerWidth/2, innerHeight/2+(100*Game.scale.y), 250*Game.scale.x, 80*Game.scale.y, "Settings", MainMenu);
    SettingsButton.pivot.set(250/2, 80/2);
    SettingsButton.onpointerdown = (event) => {
        setRenderState(MenuRender, SettingsMenu)
    }
    const NightsBackButton = new Button(innerWidth/2-(333*Game.scale.x), innerHeight/2-220, 140, 40, "Back", NightsMenu);
    NightsBackButton.onpointerdown = (event) => {
        setRenderState(MenuRender, MainMenu)
    }

    let NightsSelection = [];
    for (let night = 0; night < 7; night++) {
        const b = new Button(innerWidth/2-(100*Game.scale.x), innerHeight/2+(55*night*Game.scale.y)-200, 200*Game.scale.x, 50*Game.scale.y, `Night ${night+1}`, NightsMenu);
        if (night==6) b.text.text = "MAX - 4/20";
        b.pivot.set(40, b.height/2);
        b.onpointerdown = () => {
            if (night == 0) {
                Game.start({ night: night+1,
                    bonnieLevel: 0, chicaLevel: 0, freddylevel: 0, foxyLevel: 0});
            } else if (night == 1) {
                Game.start({ night: night+1,
                    bonnieLevel: 3, chicaLevel: 1, freddylevel: 0, foxyLevel: 1});
            } else if (night == 2) {
                Game.start({ night: night+1,
                    bonnieLevel: 0, chicaLevel: 5, freddylevel: 1, foxyLevel: 2});
            } else if (night == 3) {
                Game.start({ night: night+1,
                    bonnieLevel: 2, chicaLevel: 4, freddylevel: 3, foxyLevel: 6});
            } else if (night == 4) {
                Game.start({ night: night+1,
                    bonnieLevel: 5, chicaLevel: 7, freddylevel: 3, foxyLevel: 5});
            } else if (night == 5) {
                Game.start({ night: night+1,
                    bonnieLevel: 10, chicaLevel: 12, freddylevel: 4, foxyLevel: 16});
            } else {
                Game.start({ night: night+1,
                    bonnieLevel: 20, chicaLevel: 20, freddylevel: 20, foxyLevel: 20});
            }
            bgMusic.pause();
            setRenderState(app.stage, Game.render);
        }
        NightsSelection.push(b);
    }

    let totalDelta = 0;

    const changelog = new Text({
        text: `${await fetch('./assets/changelog.txt').then(res => {return res.text()})}`,
        style: { fill: 0xffffff, fontFamily: 'Volter', fontSize: innerWidth*0.015 }
    });
    changelog.position.set(10, 10); MainMenu.addChild(changelog)

    const freddles = new Text({
        text: 'JOE',
        style: { fill: 0xffffff, fontFamily: 'Volter', fontSize: innerWidth*0.015 },
        x: 10*Game.scale.x, y: 10 *Game.scale.y
    }); freddles.position.set(10, 10);

    // Game.displayHUDContainer.addChild(freddles);

    MenuRender.addChild(MainMenu, NightsMenu, SettingsMenu);
    setRenderState(MenuRender, MainMenu);

    //

    app.stage.addChild(Game.render, MenuRender);
    setRenderState(app.stage, MenuRender);
    app.canvas.style.display = "block";
    document.body.appendChild(app.canvas)

    app.ticker.maxFPS = 60;
    app.ticker.add((ticker) => {
        totalDelta+=ticker.deltaTime;
        if (Game.render.visible) {
            Game.updateLoop(ticker);
            freddles.text = `FREDDY: ${Game.animatronics.freddy.currentState}`;
            if (!Game._gameActive) {
                bgMusic.play();
                setRenderState(app.stage, MenuRender);
                setRenderState(MenuRender, MainMenu);
            }
        }
    });
})();
