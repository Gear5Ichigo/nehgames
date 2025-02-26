import { sound, Sound } from "../../public/pixi-sound.mjs";
import { Assets, Container, Graphics, Sprite, Text, Ticker } from "../../public/pixi.min.mjs";
import Game from "./game.mjs";
import SpriteLoader from "./spriteloader.mjs";

export default class Menus {
    static async init(app) {

        class Button extends Text {
            constructor(text, onpointerdown) {
                super({text: text, style: {fontFamily: 'Consolas', fill: 0xffffff, fontSize: 50, align: 'left'}});
                this.defaultText = text;
                this.eventMode = 'static';
                this.onpointerdown = onpointerdown;
                this.anchor = 0.5;
                this.onpointerenter = () => this.text = `>> ${this.defaultText}`;
                this.onpointerleave = () => this.text = this.defaultText;
            }

            updateDefaultText(text) {
                this.text = text;
                this.defaultText = text;
            }
        }

        this.openingTransition = false;
        this.settings = {
            disablePlushies: false,
            devMode: false,
        };

        sound.disableAutoPause = true;
        this.bgMusic = Sound.from({ url: './assets/sounds/1-04. Thank You For Your Patience.wav', volume: 0.75, loop: true, singleInstance: true, preload: true});
        this.staticSound = Sound.from({ url: './assets/sounds/static2.wav', volume: 0.33, loop: true, singleInstance: true, preload: true});

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
        this.backButton3 = new Button('Back', () => app.setRenderState(this.week1, this.titleScreen)); this.backButton3.anchor = 0;

        this.newGame = new Button('New Game', () => {
            this.openingScene(app);
        }); this.newGame.anchor = 0;

        this.continueGame = new Button('Continue', () => {
            const currentNight = parseInt(localStorage.getItem('Current_Night'));
            console.log(currentNight);
            switch (currentNight) {
                case 1: Game.start({night: currentNight, freddylevel: 0, bonnieLevel: 0, chicaLevel: 0, foxyLevel: 0, settings: this.settings}); app.setRenderState(app.stage, Game.render); break;
                case 2: Game.start({night: currentNight, freddylevel: 0, bonnieLevel: 3, chicaLevel: 1, foxyLevel: 1, settings: this.settings}); app.setRenderState(app.stage, Game.render); break;
                case 3: Game.start({night: currentNight, freddylevel: 1, bonnieLevel: 0, chicaLevel: 5, foxyLevel: 2, settings: this.settings}); app.setRenderState(app.stage, Game.render); break;
                case 4: Game.start({night: currentNight, freddylevel: 2, bonnieLevel: 2, chicaLevel: 4, foxyLevel: 6, settings: this.settings}); app.setRenderState(app.stage, Game.render); break;
                case 5: Game.start({night: currentNight, freddylevel: 3, bonnieLevel: 5, chicaLevel: 7, foxyLevel: 5, settings: this.settings}); app.setRenderState(app.stage, Game.render); break;
                case 6: Game.start({night: currentNight, freddylevel: 4, bonnieLevel: 10, chicaLevel: 12, foxyLevel: 16, settings: this.settings}); app.setRenderState(app.stage, Game.render); break;
                default: break;
            }
        }); this.continueGame.anchor = 0;

        this.customizeNight = new Button('Customize Night', () => {
            app.setRenderState(this.week1, this.customNightMenu);
        }); this.customizeNight.anchor = 0;

        //

        this.gotosettings = new Button('Settings', () => app.setRenderState(this.week1, this.settingsOptions)); this.gotosettings.anchor = 0;
        this.disablePlushies = new Button('Disable Plushies: OFF', () => {
            if (!this.settings.disablePlushies) {
                this.settings.disablePlushies = true;
                this.disablePlushies.updateDefaultText('Disable Plushies: ON');
                this.disablePlushies.text = '>> Disable Plushies: ON';
            } else {
                this.settings.disablePlushies = false;
                this.disablePlushies.updateDefaultText('Disable Plushies: OFF');
                this.disablePlushies.text = '>> Disable Plushies: OFF';
            }
        }); this.disablePlushies.anchor = 0;
        this.devMode = new Button('Developer Mode: OFF', () => {
            if (!this.settings.devMode) {
                this.settings.devMode = true;
                this.devMode.updateDefaultText('Developer Mode: ON');
                this.devMode.text = '>> Developer Mode: ON';
            } else {
                this.settings.devMode = false;
                this.devMode.updateDefaultText('Developer Mode: OFF');
                this.devMode.text = '>> Developer Mode: OFF';
            }
        }); this.devMode.anchor = 0;
        this.cheats = new Button('Cheats', () => {}); this.cheats.anchor = 0;
        this.clearData = new Button('Clear Local Data', () => {}); this.clearData.anchor = 0;

        //

        this.achievments = new Button('Achievements', () => app.setRenderState(this.week1, this.achievementsDisplay)); this.achievments.anchor.set(0, 1);
        this.a1 = new Text({text: 'Complete Night 1'}, {});
        this.a2 = new Text({text: 'Complete Night 5'}, {});
        this.a3 = new Text({text: 'I Heard You Were Strong...'}, {});
        this.a4 = new Text({text: '???'}, {});

        //

        class NumberRange extends Container {
            constructor(min, max, label, step) {
                super();
                const _step = step || 1;
                this.value = 0; this.min = min; this.max = this.max;

                const style = {fontFamily: 'Consolas', fill: 0xffffff}

                this.addButton = new Text({text: '>', style: style});
                this.addButton.eventMode = 'static';
                this.addButton.onpointerdown = () => { if (this.value < max) this.value+=_step; this.numberDisplay.text = Math.floor(this.value*10)/10 ; }
                this.addButton.position.set(50, 0);

                this.subtractButton = new Text({text: '<', style: style});
                this.subtractButton.eventMode = 'static';
                this.subtractButton.onpointerdown = () => { if (this.value > min) this.value-=_step; this.numberDisplay.text = Math.floor(this.value*10)/10 ; }
                this.subtractButton.position.set(-50, 0);

                this.numberDisplay = new Text({text: '0', style: style});

                this.label = new Text({text: label, style: style});
                this.label.position.set(this.subtractButton.x, -30*Game.scale.y);
                this.label.anchor = 0;

                this.addChild(this.subtractButton, this.numberDisplay, this.addButton, this.label);
            }
        }

        this.customNightMenu = new Container();

        this.icons = await SpriteLoader.SpriteCollection('/customnight/spritesheet@0.5x', (s) => {s.anchor.set(0, 0)});

        this.freddyAi = new NumberRange(0, 20, 'A.I. Level');
        this.bonnieAi = new NumberRange(0, 20, 'A.I. Level');
        this.chicaAi = new NumberRange(0, 20, 'A.I. Level');
        this.foxyAi = new NumberRange(0, 20, 'A.I. Level');

        this.customHour = new NumberRange(1, 100000, 'Hour (Secs)');
        this.customHour.value = 65;
        this.customHour.numberDisplay.text = 65;

        this.customUsage = new NumberRange(0.2, 10, 'Power Usage', 0.1);
        this.customUsage.value = 1;
        this.customUsage.numberDisplay.text = 1;

        this.set20Ai = new Text({text: 'Set All A.I. 20', style: {fill:0xffffff, fontFamily: 'Consolas'}});
        this.set20Ai.eventMode = 'static';
        this.set20Ai.onpointerdown = () => {
            const animtronics = ['freddy', 'bonnie', 'chica', 'foxy'];
            for (const name of animtronics) {
                this[`${name}Ai`].value = 20; this[`${name}Ai`].numberDisplay.text = 20;
            }
        }

        this.readyCustomNight = new Button('READY', () => {
            Game.start({
                night: 7,
                freddylevel: this.freddyAi.value, bonnieLevel: this.bonnieAi.value, chicaLevel: this.chicaAi.value, foxyLevel: this.foxyAi.value,
                hourLength: this.customHour.value, usageMultiplier: this.customUsage.value,
                settings: this.settings
            });
            app.setRenderState(app.stage, Game.render); this.bgMusic.stop(); this.staticSound.stop();
        })

        //

        this.resize = () => {
            this.freddyBackground.resize();
            this.menuStatic.resize();
            this.openingPicture.setSize(innerWidth, innerHeight);
            this.blackBox.setSize(innerWidth, innerHeight);

            this.title.style.fontSize = 32*(innerWidth/innerHeight); this.title.style.lineHeight = this.title.style.fontSize+this.title.style.fontSize*0.3;
            this.changelog.style.fontSize = innerWidth*0.012;
            this.newGame.style.fontSize = 32*(innerWidth/innerHeight);
            this.customizeNight.style.fontSize = 32*(innerWidth/innerHeight);
            this.continueGame.style.fontSize = 32*(innerWidth/innerHeight);
            this.gotosettings.style.fontSize = 32*(innerWidth/innerHeight);
            this.achievments.style.fontSize = 32*(innerWidth/innerHeight);

            this.title.position.set(150*Game.scale.x, 15*Game.scale.y);
            this.changelog.position.set(this.title.x+this.changelog.width, 10*Game.scale.y)
            this.newGame.position.set(this.title.x, this.title.height+this.newGame.height);
            this.continueGame.position.set(this.title.x, this.newGame.y+this.customizeNight.height);
            this.customizeNight.position.set(this.title.x, this.continueGame.y+this.customizeNight.height);
            this.gotosettings.position.set(this.title.x, this.customizeNight.y+this.gotosettings.height*1.5);
            this.achievments.position.set(this.gotosettings.x+this.achievments.width, this.gotosettings.y+this.gotosettings.height);

            this.backButton1.position.set(this.title.position.x, this.title.position.y);
            this.backButton2.position.set(this.title.position.x, this.title.position.y);
            this.backButton3.position.set(this.title.position.x, this.title.position.y);

            this.freddyAi.position.set(innerWidth/2-250*Game.scale.x, innerHeight/2);
            this.bonnieAi.position.set(this.freddyAi.x+this.bonnieAi.width+50*Game.scale.x, this.freddyAi.y);
            this.chicaAi.position.set(this.bonnieAi.x+this.chicaAi.width+50*Game.scale.x, this.freddyAi.y);
            this.foxyAi.position.set(this.chicaAi.x+this.foxyAi.width+50*Game.scale.x, this.freddyAi.y);
            this.customHour.position.set(this.freddyAi.x, this.freddyAi.y+this.customHour.height+10*Game.scale.y);
            this.customUsage.position.set(this.customHour.x+this.customUsage.width+55*Game.scale.x, this.customHour.y);
            this.set20Ai.position.set(this.freddyAi.x-this.set20Ai.width*1.5, this.freddyAi.y);

            this.icons.forEach(([key, value]) => { value.scale.set(0.7*Game.scale.x, 0.7*Game.scale.y); });
            this.icons.sprites['527.png'].position.set(this.freddyAi.x-this.freddyAi.width/2, this.freddyAi.y-this.icons.sprites['527.png'].height-this.freddyAi.height/2-10*(Game.scale.y));
            this.icons.sprites['528.png'].position.set(this.bonnieAi.x-this.bonnieAi.width/2, this.bonnieAi.y-this.icons.sprites['528.png'].height-this.bonnieAi.height/2-10*(Game.scale.y));
            this.icons.sprites['529.png'].position.set(this.chicaAi.x-this.chicaAi.width/2, this.chicaAi.y-this.icons.sprites['529.png'].height-this.chicaAi.height/2-10*(Game.scale.y));
            this.icons.sprites['536.png'].position.set(this.foxyAi.x-this.foxyAi.width/2, this.foxyAi.y-this.icons.sprites['536.png'].height-this.foxyAi.height/2-10*(Game.scale.y));

            this.readyCustomNight.position.set(this.customHour.x+250*Game.scale.x, this.customHour.y+this.customHour.height+10*Game.scale.y);

            this.disablePlushies.position.set(this.backButton1.x, this.backButton1.y+this.disablePlushies.height*2);
            this.devMode.position.set(this.backButton1.x, this.disablePlushies.y+this.devMode.height);
            this.cheats.position.set(this.backButton1.x, this.devMode.position.y+this.devMode.height*3);
            this.clearData.position.set(this.backButton1.x, this.cheats.position.y+this.devMode.height*3);

        }; this.resize()

        this.customNightMenu.addChild(
            this.backButton3, 
            this.freddyAi, this.bonnieAi, this.chicaAi, this.foxyAi,
            this.readyCustomNight, this.customHour, this.customUsage, this.set20Ai,
            this.icons.sprites['527.png'], this.icons.sprites['528.png'], this.icons.sprites['529.png'], this.icons.sprites['536.png'], 
        );
        this.achievementsDisplay.addChild(this.backButton1, this.a1, this.a2, this.a3, this.a4);
        this.settingsOptions.addChild(this.backButton2, this.disablePlushies, this.devMode, this.cheats, this.clearData);
        this.titleScreenButtons.addChild(this.newGame, this.continueGame, this.customizeNight, this.gotosettings, this.achievments);
        this.titleContent.addChild(this.freddyBackground, this.menuStatic, this.titleScreenButtons, this.title, this.changelog);
        this.titleScreen.addChild(this.openingPicture, this.blackBox, this.titleContent);
        this.week1.addChild(this.titleScreen, this.settingsOptions, this.achievementsDisplay, this.customNightMenu);

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
        if (localStorage.getItem('Current_Night')) {
            this.continueGame.visible = true;
            this.continueGame.updateDefaultText(`Continue Night ${localStorage.getItem('Current_Night')}`);
        } else this.continueGame.visible = false;
        this.blackBox.alpha = 0;
        this.titleContent.alpha = 1;
        this.openingTransition = false;
        this.freddyBackground.playAnimation();
        this.menuStatic.playAnimation();
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
                    freddylevel: 0, bonnieLevel: 0, chicaLevel: 0, foxyLevel: 0,
                    settings: this.settings});
                app.setRenderState(app.stage, Game.render); this.bgMusic.stop(); this.staticSound.stop();
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