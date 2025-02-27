import {Assets, Container, Sprite, Graphics, Point, Rectangle} from '../../public/pixi.min.mjs';
import Game from './game.mjs';
import OfficeButtons from './officebuttons.mjs';
import SpriteLoader from './spriteloader.mjs';

export default class Office {
    static async init() {

        this.conatiner = new Container();

        this.scale = 1.2;

        this._flickerTime = 0;
        this._flickerWait = 0.2;

        this.sprite = await SpriteLoader.Sprite('/office/spritesheet@0.5x');
        this.sprite.anchor = 0.5;
        this.sprite.width = innerWidth * this.scale; this.sprite.height = innerHeight;
        this.sprite.position.set(innerWidth/2, innerHeight/2);

        this.sprite.spritesheet.textures["127power.png"] = await Assets.load('./assets/sprites/office/127power.png')

        //

        this.margin = (this.sprite.width-this.sprite.width/Office.scale)/2;

        //

        this.fanResize = (animSprite) => {
            animSprite.scale.set(Game.scale.x*this.scale, Game.scale.y);
            animSprite.anchor = 0.5;
            animSprite.position.set(innerWidth/2+(49*Game.scale.x*this.scale), innerHeight/2+(41*Game.scale.y));
        };
        this.fanAnim = await SpriteLoader.AnimatedSprite('/fan/spritesheet', this.fanResize);
        this.fanAnim.playAnimation()

        //

        this.polishFreddySprite = new Sprite(await Assets.load('./assets/sprites/office/Funnybeartrashcan.webp'));
        this.polishFreddySprite.eventMode = 'static'; this.polishFreddySprite.visible = false;
        this.polishFreddySprite.onpointermove = (event) => {
            const detect = new Graphics().rect(innerWidth-innerWidth*0.4, 0, innerWidth*0.4, innerHeight).fill(0x000000);
            if (detect.containsPoint(event.global)) { this.rightBox.onpointerenter();}
        }
        this.polishFreddySprite.resize = () => {
            this.polishFreddySprite.position.set(
                innerWidth/2+166*Game.scale.x-((50*Game.scale.x)*(Game.animatronics.polishFreddy.rageState)/this.polishFreddySprite.scale.x),
                innerHeight/2+((170*Game.scale.x)/this.polishFreddySprite.scale.y)-(50*Game.scale.x*this.polishFreddySprite.scale.y));
        }
        this.polishFreddySprite.onpointerdown = () => {
            Game.animatronics.polishFreddy.feedTrash();
        }

        //

        this.plushies = await SpriteLoader.SpriteCollection('/plushies/spritesheet1@0.5x', (sprite) => {
            sprite.scale.set(1.2*Game.scale.x, 1.2*Game.scale.y);
            sprite.visible = false;
        });

        this.plushies.sprites['powerbean'] = new Sprite(await Assets.load('./assets/sprites/plushies/powerbean.png'));
        this.plushies.sprites['powerbean'].visible = false;
        this.plushies.sprites['bear5'] = new Sprite(await Assets.load('./assets/sprites/plushies/bear5plush@0.5x.png'));
        this.plushies.sprites['bear5'].visible = false;

        this.plushiesResize = () => {
            this.plushies.forEach(([key, sprite]) => sprite.scale.set(1.2*Game.scale.x, 1.2*Game.scale.y));
            this.plushies.sprites['powerbean'].scale.set(0.45*Game.scale.x, 0.45*Game.scale.y);
            this.plushies.sprites['bear5'].scale.set(0.2*Game.scale.x, 0.2*Game.scale.y);

            this.plushies.sprites['powerbean'].position.set(this.sprite.width/2-(25*Game.scale.x*this.scale), this.sprite.height/2-(31*Game.scale.y));
            this.plushies.sprites['bear5'].position.set(this.sprite.width/2+(67*Game.scale.x*this.scale), this.sprite.height/2-(20*Game.scale.y))
            this.plushies.sprites['freddy.png'].position.set(this.sprite.width/2-(350*Game.scale.x*this.scale), this.sprite.height/2-(140*Game.scale.y));
            this.plushies.sprites['bonnie.png'].position.set(this.sprite.width/2-(422*Game.scale.x*this.scale), this.sprite.height/2-(50*Game.scale.y));
            this.plushies.sprites['chica.png'].position.set(this.sprite.width/2-(255*Game.scale.x*this.scale), this.sprite.height/2+(4*Game.scale.y));
        }; this.plushiesResize();

        this.plushiesContainer = new Container();
        this.plushiesContainer.addChild(
            this.plushies.sprites['freddy.png'], 
            this.plushies.sprites['bonnie.png'], 
            this.plushies.sprites['chica.png'], 
            this.plushies.sprites['powerbean'], 
            this.plushies.sprites['bear5'],
            this.polishFreddySprite,
        );

        //

        this.freddyBoop = new Graphics()
        .rect(this.sprite.x-(150*Game.scale.x), this.sprite.y-(133*Game.scale.y), 10*Game.scale.x, 10*Game.scale.y).fill(0xccff00);
        this.freddyBoop.alpha = 0;
        this.freddyBoop.eventMode = 'static';
        this.freddyBoop.onpointerdown = (event) => Game.SOUNDS.boop.play();

        //

        this._movementContainer = new Container();

        this.leftBox = new Graphics()
        .rect(0, 0, innerWidth*0.4, innerHeight)
        .fill(0xff0000); this.leftBox.alpha = 0.5; 
        this.leftBox.eventMode = 'static';
        this.leftBox.onpointerenter = (event) => {this._moveLeft = true; this._moveRight = false; this._innerMoveRight = false;}
        this.leftBox.onpointerleave = (event) => {
            const detect = new Graphics().rect(0, 0, innerWidth*0.4, innerHeight).fill(0x000000);
            if (detect.containsPoint(event.global)) return;
            this._moveLeft = false;
        }

        this.innerLeftBox = new Graphics()
        .rect(0, 0, this.leftBox.width/2, innerHeight)
        .fill(0x00ff00); this.innerLeftBox.alpha = 0.2;
        this.innerLeftBox.eventMode = 'static';
        this.innerLeftBox.onpointerenter = (event) => {
            this._innerMoveLeft = true; this._moveLeft = true;
            this._moveRight = false; this._innerMoveRight = false;
        }
        this.innerLeftBox.onpointerleave = (event) => {
            if (event.global.x < 0) return;
            const detect = new Graphics().rect(0, 0, this.leftBox.width/2, innerHeight).fill(0x000000);
            if (detect.containsPoint(event.global)) return;
            this._innerMoveLeft = false; this._moveLeft = true;
        };

        this.rightBox = new Graphics()
        .rect(innerWidth-innerWidth*0.4, 0, innerWidth*0.4, innerHeight)
        .fill(0x0000ff); this.rightBox.alpha = 0.2; 
        this.rightBox.eventMode = 'static';
        this.rightBox.onpointerenter = (event) => {this._moveRight = true; this._moveLeft = false; this._innerMoveLeft = false;}
        this.rightBox.onpointerleave = (event) => {
            const detect = new Graphics().rect(innerWidth-innerWidth*0.4, 0, innerWidth*0.4, innerHeight).fill(0x000000);
            if (detect.containsPoint(event.global)) return;
            this._moveRight = false;
        }

        this.innerRightBox = new Graphics()
        .rect(innerWidth-this.rightBox.width/2, 0, this.rightBox.width/2, innerHeight)
        .fill(0x00ff00); this.innerRightBox.alpha = 0.2;
        this.innerRightBox.eventMode = 'static';
        this.innerRightBox.onpointerenter = (event) => {
            this._innerMoveRight = true; this._moveRight = true;
            this._moveLeft = false; this._innerMoveLeft = false;
        }
        this.innerRightBox.onpointerleave = (event) => {
            if (event.global.x > innerWidth) return;
            const detect = new Graphics().rect(innerWidth-this.rightBox.width/2, 0, this.rightBox.width/2, innerHeight).fill(0x000000);
            if (detect.containsPoint(event.global)) return;
            this._innerMoveRight = false; this._moveRight = false;
        }
        

        this.movementResize = () => {
            this.leftBox.setSize(innerWidth*0.4, innerHeight);
            this.innerLeftBox.setSize(this.leftBox.width/2, innerHeight);
            this.rightBox.setSize(innerWidth*0.4, innerHeight);
            this.innerRightBox.setSize(this.rightBox.width/2, innerHeight);
        }; 

        this._movementContainer.addChild(this.leftBox, this.innerLeftBox, this.rightBox, this.innerRightBox);
    }

    static __hallWayFlicker(ticker) {
        const dt = ticker.deltaTime/ticker.FPS;
        if (Game.leftLightOn) {
            this._flickerTime+=dt;
            if (this._flickerTime >= this._flickerWait) {
                this._flickerTime=0;
                if (Game.animatronics.bonnie.currentState === "ATDOOR") return;
                if (this.sprite.texture === this.sprite.spritesheet.textures["58.png"]) {
                    Game.SOUNDS.lightsHum.pause();
                    this.sprite.swapTexture('39.png');
                    this._flickerWait = (Math.ceil(Math.random()*5)+10)/1000;
                } else if (this.sprite.texture === this.sprite.spritesheet.textures["39.png"]) {
                    Game.SOUNDS.lightsHum.play();
                    this.sprite.swapTexture('58.png');
                    this._flickerWait = (Math.ceil(Math.random()*15)+50)/100;
                }
            }
        }
        if (Game.rightLightOn) {
            this._flickerTime+=dt;
            if (this._flickerTime >= this._flickerWait) {
                this._flickerTime=0;
                if (Game.animatronics.chica.currentState === "ATDOOR") return;
                if (this.sprite.texture === this.sprite.spritesheet.textures["127.png"]) {
                    Game.SOUNDS.lightsHum.pause();
                    this.sprite.swapTexture('39.png');
                    this._flickerWait = (Math.ceil(Math.random()*5)+10)/1000;
                } else if (this.sprite.texture === this.sprite.spritesheet.textures["39.png"]) {
                    Game.SOUNDS.lightsHum.play();
                    this.sprite.swapTexture('127.png');
                    this._flickerWait = (Math.ceil(Math.random()*15)+50)/100;
                }
            }
        }
    }
}