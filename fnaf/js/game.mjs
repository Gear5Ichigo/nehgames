import { AnimatedSprite, Assets, Container, Graphics, NoiseFilter, Sprite, Spritesheet, Text } from "../../pixi.mjs";
import { Sound } from "../../pixi-sound.mjs";
import { Bonnie, Chica } from "./animatronics.mjs";

export default class Game {

    _gameActive;

    render;

    officeRender;
    baseContainer;
    officeContainer;
    displayHUDContainer;

    cameraRender;
    _cameraShow; _cameraGUI;

    _cameraTablet;
    _clockText;
    _camFlipButton;
    _officesprite;
    _bear5;

    animatronics;

    _ONE_HOUR; // one in-game hour = 69 seconds
    timeElapsed; clock;

    camUp; camSwitch;

    movePercent;
    _moveLeft; _moveRight;
    _innerMoveLeft; _innerMoveRight;

    _MAX_BATTERY; battery; batteryDrain;

    SOUNDS;

    static async init(gameContainer) {
        this.SOUNDS = {
            officeNoise: Sound.from({
                url: './assets/sounds/Buzz_Fan_Florescent2.wav'
            }),
            camFlip: Sound.from({
                url: './assets/sounds/put down.wav'
            })
        }

        this.clock = 12;
        this.movePercent = innerWidth*0.0044;
        this.camUp = false;
        this.camSwitch = false;

        this.render = new Container();

        this.officeRender = new Container();
        this.baseContainer = new Container();
        this.officeContainer = new Container();
        this.displayHUDContainer = new Container();

        this.cameraRender = new Container();
        this._cameraShow = new Container();
        this._cameraGUI = new Container();
        this.cameraRender.visible = false;

        const office_texture = await Assets.load('./assets/sprites/office/39.png')
        this._officesprite = new Sprite(office_texture);
        this._officesprite.setSize(innerWidth*1.5, innerHeight);
        this._officesprite.anchor = 0.5;
        this._officesprite.position.set(innerWidth/2, innerHeight/2);

        const officeMovement = new Container();

        const leftBox = new Graphics()
        .rect(0, 0, innerWidth/3, innerHeight)
        .fill(0xff0000); leftBox.alpha = 0; 
        leftBox.eventMode = 'static';
        leftBox.onpointerenter = (event) => this._moveLeft = true;
        leftBox.onpointerleave = (event) => this._moveLeft = false;

        const innerLeftBox = new Graphics()
        .rect(0, 0, leftBox.width/2, innerHeight)
        .fill(0x00ff00); innerLeftBox.alpha = 0;
        innerLeftBox.eventMode = 'static';
        innerLeftBox.onpointerenter = (event) => this._innerMoveLeft = true;
        innerLeftBox.onpointerleave = (event) => this._innerMoveLeft = false;

        const rightBox = new Graphics()
        .rect(innerWidth-innerWidth/3, 0, innerWidth/3, innerHeight)
        .fill(0x0000ff); rightBox.alpha = 0; 
        rightBox.eventMode = 'static';
        rightBox.onpointerenter = (event) => this._moveRight = true;
        rightBox.onpointerleave = (event) => this._moveRight = false;

        const innerRightBox = new Graphics()
        .rect(innerWidth-rightBox.width/2, 0, rightBox.width/2, innerHeight)
        .fill(0x00ff00); innerRightBox.alpha = 0;
        innerRightBox.eventMode = 'static';
        innerRightBox.onpointerenter = (event) => this._innerMoveRight = true;
        innerRightBox.onpointerleave = (event) => this._innerMoveRight = false;

        officeMovement.addChild(leftBox, innerLeftBox, rightBox, innerRightBox);
        
        this._clockText = new Text({
            text: `${this.clock} AM`,
            style: {
                fill: 0xffffff,
                fontFamily: 'Press Start',
                align: 'center',
            }
        });
        this._clockText.position.set(50, 120);

        const mapSprite = new Sprite(await Assets.load('./assets/sprites/cams/MAp.png'));
        mapSprite.position.set(innerWidth-mapSprite.width, innerHeight-mapSprite.height)

        const bear5texture = await Assets.load('./assets/sprites/484bear5.png');
        this._bear5 = new Sprite(bear5texture);
        this._bear5.filters = [
            new NoiseFilter({
                seed: Math.random(),
                noise: 0.5,
            })
        ]
        this._bear5.setSize(innerWidth*1.2, innerHeight);

        Assets.add({alias: 'camflip.png', src: './assets/sprites/camflip/camflip.png'});
        const camflipJson = await Assets.load('./assets/sprites/camflip/camflip.json');
        this._cameraTablet = new Spritesheet(await Assets.load('camflip.png'), camflipJson.data);
        await this._cameraTablet.parse();

        const camFlipAnim = new AnimatedSprite(this._cameraTablet.animations.flip);
        camFlipAnim.animspeed = 0.5; camFlipAnim.loop = false;
        camFlipAnim.visible = false;
        camFlipAnim.setSize(innerWidth, innerHeight);
        camFlipAnim.onComplete = () => {
            this.cameraRender.visible = true
            this._cameraShow.children.forEach(sprite => {
                if (sprite.visible) {
                    sprite.x = -innerWidth*0.2;
                }
            })
        };

        const reverseFlipAnim = new AnimatedSprite(this._cameraTablet.animations.reverseFlip);
        reverseFlipAnim.animspeed = 0.5; reverseFlipAnim.loop = false;
        reverseFlipAnim.visible = false;
        reverseFlipAnim.setSize(innerWidth, innerHeight);
        reverseFlipAnim.onComplete = () => reverseFlipAnim.visible = false;

        const cf_texture = await Assets.load('./assets/sprites/420.png');
        this._camFlipButton = new Sprite(cf_texture);
        this._camFlipButton.anchor = 0.5; this._camFlipButton.alpha = 0.5;
        this._camFlipButton.position.set(innerWidth/2, innerHeight-this._camFlipButton.height+20);
        this._camFlipButton.eventMode = 'static';
        this._camFlipButton.onmouseenter = (event) => {
            this.camUp = true;
            this.SOUNDS.camFlip.play({});
            if (!this.camSwitch) {
                this.camSwitch = true;
                camFlipAnim.visible = true;
                camFlipAnim.gotoAndPlay(0);
            } else {
                this.camSwitch = false;
                camFlipAnim.visible = false;
                reverseFlipAnim.visible = true;
                reverseFlipAnim.gotoAndPlay(0);

                this.cameraRender.visible = false;
            }
        }; 
        this._camFlipButton.onmouseleave = (event) => {
            this.camUp = false;
        };

        this.displayHUDContainer.addChild(this._clockText);
        this._cameraShow.addChild(this._bear5);
        this._cameraGUI.addChild(mapSprite);
        this.cameraRender.addChild(this._cameraShow, this._cameraGUI);
        this.officeContainer.addChild(this._officesprite, officeMovement, camFlipAnim, reverseFlipAnim, this.cameraRender, this._camFlipButton);
        this.officeRender.addChild(this.baseContainer, this.officeContainer, this.displayHUDContainer);

        this.render.addChild(this.officeRender);
    }

    static start(options) {
        this._gameActive = true;

        this.timeElapsed = 0;
        this._ONE_HOUR = 69;
        this.clock = 12;

        this._MAX_BATTERY = 100;
        this.battery = this._MAX_BATTERY;
        this.batteryDrain = 1;

        this.animatronics = {};

        this.animatronics.bonnie = new Bonnie(options.bonnieLevel || 0);
        this.animatronics.chica = new Chica(options.chicaLevel || 0);

        this.SOUNDS.officeNoise.play({
            volume: 0.25,
            loop: true,
        })
    }

    static updateClock(ticker) {
        const dt = ticker.deltaTime/ticker.FPS;
        this.timeElapsed += dt;
        if (this.timeElapsed>=this._ONE_HOUR) {
            this.timeElapsed = 0;
            this.clock+=1;
            if (this.clock>=13) {
                this.clock = 1;
            }
            this._clockText.text = `${this.clock} AM`;
        }
    }

    static _officemove() {
        if (this._officesprite.x > this._officesprite.width*0.17) {
            if (this._moveRight) this._officesprite.x-=this.movePercent;
            if (this._innerMoveRight) this._officesprite.x-=this.movePercent*2;
        }
        if (this._officesprite.x < this._officesprite.width/2) {
            if (this._moveLeft) this._officesprite.x+=this.movePercent;
            if (this._innerMoveLeft) this._officesprite.x+=this.movePercent*2;
        }
    }

    static updateLoop(ticker) {
        if (this._gameActive) {
            this.updateClock(ticker);
            this._officemove();

            this._bear5.filters[0].seed = Math.random();

            if (this.cameraRender.visible) {
                this._cameraShow.children.forEach(sprite => {
                    if (sprite.visible) {
                        if (sprite.x < 0) {sprite.x += innerWidth*0.0012;}
                    }
                });
            }

            for (const [key, animatronic] of Object.entries(this.animatronics)) {
                animatronic.movement(ticker);
            }
        }
    }

    forceGameOver() {this._gameActive = false; return;}

}