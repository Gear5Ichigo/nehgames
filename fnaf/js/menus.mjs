import { Sound } from "../../public/pixi-sound.mjs";
import { Assets, Container, Graphics, Sprite, Text, Ticker } from "../../public/pixi.min.mjs";
import Game from "./game.mjs";
import SpriteLoader from "./spriteloader.mjs";

export default class Menus {
    static async init(app) {

        class Button extends Text {
            constructor(text, onpointerdown) {
                super({text: text, style: {fontFamily: 'Consolas', fill: 0xffffff, fontSize: 50, align: 'left'}});
                this.eventMode = 'static';
                this.onpointerdown = onpointerdown;
                this.anchor = 0.5;
                this.onpointerenter = () => this.text = `>> ${text}`;
                this.onpointerleave = () => this.text = text;
            }
        }

        this.openingTransition = false;

        this.bgMusic = Sound.from({ url: './assets/sounds/1-04. Thank You For Your Patience.wav', volume: 0.75, loop: true });
        this.staticSound = Sound.from({ url: './assets/sounds/static2.wav', volume: 0.33, loop: true });

        this.titleScreen = new Container();
        this.titleScreenButtons = new Container();
        this.titleContent = new Container();
        this.settingsOptions = new Container();
        this.achievementsDisplay = new Container();
        this.week1 = new Container();

        this.freddyBackground = await SpriteLoader.AnimatedSprite('/titlemenu/spritesheet', (animSprite) => animSprite.loop = false );
        this.freddyBackground.resize = () => this.freddyBackground.forEach(([key, anim]) => anim.setSize(innerWidth, innerHeight));
        this.freddyBackground.playAnimation();
        this.freddyBackground.animations.freddytweak.onComplete = () => {
            this.freddyBackground.resetAnimations();
            this.freddyBackground.animations.freddytweak.animationSpeed = (Math.floor(Math.random()*15)+7)/10;
            setTimeout(() => {
                if (this.openingTransition) return;
                this.freddyBackground.playAnimation();
            }, Math.floor(Math.random()*1100)+400);
        }

        this.menuStatic = await SpriteLoader.AnimatedSprite('/static/spritesheet@0.5x', () => {});
        this.menuStatic.resize = () => this.menuStatic.forEach(([key, anim]) => anim.setSize(innerWidth, innerHeight));
        this.menuStatic.playAnimation();

        this.openingPicture = new Sprite(await Assets.load('./assets/sprites/titlemenu/574.png'));
        this.blackBox = new Graphics().rect(0, 0, innerWidth, innerHeight).fill(0x000000);
        
        this.title = new Text({text: "Five\nNights\nAt\nFreddy's", style: {fontFamily: 'Consolas', fill: 0xffffff}});
        this.changelog = new Text({text: await fetch('./assets/changelog.txt').then(res => {if (res.ok) return res.text()})
            , style: {fontFamily: 'Consolas', fill: 0xffffff}
        });

        //

        this.backButton1 = new Button('Back', () => app.setRenderState(this.week1, this.titleScreen)); this.backButton1.anchor = 0;
        this.backButton2 = new Button('Back', () => app.setRenderState(this.week1, this.titleScreen)); this.backButton2.anchor = 0;

        this.newGame = new Button('New Game', () => {
            this.openingScene(app);
        }); this.newGame.anchor = 0;

        this.continueGame = new Button('Continue', () => {

        }); this.continueGame.anchor = 0;

        this._420 = new Button('Night 7', () => {
            Game.start({ night: 7,
                bonnieLevel: 20, chicaLevel: 20, freddylevel: 20, foxyLevel: 20});
            app.setRenderState(app.stage, Game.render);
            this.bgMusic.stop(); this.staticSound.stop();
        }); this._420.anchor = 0;

        //

        this.settings = new Button('Settings', () => app.setRenderState(this.week1, this.settingsOptions)); this.settings.anchor = 0;
        this.disablePlushies = new Button('Disable Plushies: OFF', () => {}); this.disablePlushies.anchor = 0;
        this.devMode = new Button('Developer Mode: OFF', () => {}); this.devMode.anchor = 0;
        this.cheats = new Button('Cheats', () => {}); this.cheats.anchor = 0;
        this.clearData = new Button('Clear Local Data', () => {}); this.clearData.anchor = 0;

        //

        this.achievments = new Button('Achievements', () => app.setRenderState(this.week1, this.achievementsDisplay)); this.achievments.anchor.set(0, 1);
        this.a1 = new Text({text: 'Complete Night 1'}, {});
        this.a2 = new Text({text: 'Complete Night 5'}, {});
        this.a3 = new Text({text: 'I Heard You Were Strong...'}, {});
        this.a4 = new Text({text: '???'}, {});

        //

        this.resize = () => {
            this.freddyBackground.resize();
            this.menuStatic.resize();
            this.openingPicture.setSize(innerWidth, innerHeight);
            this.blackBox.setSize(innerWidth, innerHeight);

            this.title.style.fontSize = 32*(innerWidth/innerHeight); this.title.style.lineHeight = this.title.style.fontSize+this.title.style.fontSize*0.3;
            this.changelog.style.fontSize = innerWidth*0.012;
            this.newGame.style.fontSize = 32*(innerWidth/innerHeight);
            this._420.style.fontSize = 32*(innerWidth/innerHeight);
            this.continueGame.style.fontSize = 32*(innerWidth/innerHeight);
            this.settings.style.fontSize = 32*(innerWidth/innerHeight);
            this.achievments.style.fontSize = 32*(innerWidth/innerHeight);

            this.title.position.set(150*Game.scale.x, 15*Game.scale.y);
            this.changelog.position.set(this.title.x+this.changelog.width, 10*Game.scale.y)
            this.backButton1.position.set(this.title.position.x, this.title.position.y); this.backButton2.position.set(this.title.position.x, this.title.position.y);
            this.newGame.position.set(this.title.x, this.title.height+this.newGame.height);
            this.continueGame.position.set(this.title.x, this.newGame.y+this._420.height);
            this._420.position.set(this.title.x, this.continueGame.y+this._420.height);
            this.settings.position.set(this.title.x, this._420.y+this.settings.height*1.5);
            this.achievments.position.set(this.settings.x+this.achievments.width, this.settings.y+this.settings.height);

            this.disablePlushies.position.set(this.backButton1.x, this.backButton1.y+this.disablePlushies.height*2);
            this.devMode.position.set(this.backButton1.x, this.disablePlushies.y+this.devMode.height);
            this.cheats.position.set(this.backButton1.x, this.devMode.position.y+this.devMode.height*3);
            this.clearData.position.set(this.backButton1.x, this.cheats.position.y+this.devMode.height*3);

        }; this.resize()

        this.achievementsDisplay.addChild(this.backButton1, this.a1, this.a2, this.a3, this.a4);
        this.settingsOptions.addChild(this.backButton2, this.disablePlushies, this.devMode, this.cheats, this.clearData);
        this.titleScreenButtons.addChild(this.newGame, this.continueGame, this._420, this.settings, this.achievments);
        this.titleContent.addChild(this.freddyBackground, this.menuStatic, this.titleScreenButtons, this.title, this.changelog);
        this.titleScreen.addChild(this.openingPicture, this.blackBox, this.titleContent);
        this.week1.addChild(this.titleScreen, this.settingsOptions, this.achievementsDisplay);

        this.resetMenu(app);
    }

    static updateLoop(ticker) {
        if (this.week1.visible) {
            const dt = ticker.deltaTime/ticker.FPS;
            if (!this.openingTransition) {
                this.menuStatic.forEach(([key, anim]) => anim.alpha = (Math.floor(Math.random()*33)+40)/100);
            }
        }
    }

    static resetMenu(app) {
        this.blackBox.alpha = 0;
        this.titleContent.alpha = 1;
        this.openingTransition = false;
        this.freddyBackground.playAnimation();
        this.menuStatic.playAnimation();
        this.bgMusic.stop(); this.bgMusic.play();
        this.staticSound.play();
        app.setRenderState(this.week1, this.titleScreen);
    }

    static openingScene(app) {
        this.openingTransition = true;
        this.staticSound.stop();
        this.freddyBackground.animations.freddytweak.stop();
        this.menuStatic.animations.main.stop();
        
        const fadingTicker = new Ticker();
        fadingTicker.maxFPS = 20; fadingTicker.minFPS = 20;

        const contentWaitOut = new Ticker();
        contentWaitOut.maxFPS = 60;
        let maxWait = 5; let countedTime = 0;

        const readWait = (ticker) => {
            if (countedTime>=maxWait) {
                fadingTicker.add(blackBoxFadeIn); fadingTicker.start();
                contentWaitOut.remove(readWait); return;
            }
            countedTime+=(ticker.deltaTime/ticker.FPS);
        };

        const blackScreenWait = (ticker) => {
            if (countedTime>=maxWait) {
                this.bgMusic.stop();
                Game.start({night: 1,
                    freddylevel: 0, bonnieLevel: 0, chicaLevel: 0, foxyLevel: 0
                });
                app.setRenderState(app.stage, Game.render);
                contentWaitOut.destroy(); return;
            }
            countedTime+=(ticker.deltaTime/ticker.FPS);
        };

        const contentFadeOut = (ticker) => {
            if (this.titleContent.alpha <= 0) {
                contentWaitOut.add(readWait); contentWaitOut.start();
                fadingTicker.stop(); fadingTicker.remove(contentFadeOut); return;
            };
            this.titleContent.alpha-=0.015;
        }

        const blackBoxFadeIn = (ticker) => {
            if (this.blackBox.alpha >= 1) {
                maxWait = 2; countedTime = 0;
                contentWaitOut.add(blackScreenWait); contentWaitOut.start();
                fadingTicker.destroy(); return;
            };
            this.blackBox.alpha+=0.02;
        }

        fadingTicker.add(contentFadeOut); fadingTicker.start();
    }
}