import {Assets, Container, Sprite, Spritesheet, Graphics, Filter, GlProgram, AnimatedSprite} from '../../pixi.mjs';
import Game from './game.mjs';

export default class Office {
    static async init() {

        this.scale = 1.25;

        const officejson = await Assets.load('./assets/sprites/office/spritesheet.json');
        this._spriteSheet = new Spritesheet(await Assets.load('./assets/sprites/office/spritesheet@0.5x.png'), officejson.data);
        await this._spriteSheet.parse();

        this._sprites = {};
        for (const [key, value] of Object.entries(this._spriteSheet.textures)) {
            this._sprites[key] = new Sprite(value);
            const entry = this._sprites[key];
            entry.setSize(innerWidth*this.scale, innerHeight);
            entry.anchor = 0.5;
            entry.position.set(innerWidth/2, innerHeight/2);
        };

        this._sprites["127power.png"] = new Sprite(await Assets.load('./assets/sprites/office/127power.png'));
        this._sprites["127power.png"].setSize(innerWidth*1.5, innerHeight);
        this._sprites["127power.png"].anchor = 0.5;
        this._sprites["127power.png"].position.set(innerWidth/2, innerHeight/2);

        this._currentSprite = this._sprites["39.png"];

        //

        this.margin = (Office._currentSprite.width-Office._currentSprite.width/Office.scale)/2;

        //

        const fanjson = await Assets.load('./assets/sprites/fan/spritesheet.json');
        const fansheet = new Spritesheet(await Assets.load('./assets/sprites/fan/spritesheet.png'), fanjson.data);
        await fansheet.parse();
        this.fanAnim = new AnimatedSprite(fansheet.animations.loop);
        this.fanAnim.scale.set(Game.scale.x*this.scale, Game.scale.y);
        this.fanAnim.anchor = 0.5;
        this.fanAnim.position.set(innerWidth/2+(49*Game.scale.x*this.scale), innerHeight/2+(41*Game.scale.y));
        this.fanAnim.play();

        const plushiesJson = await Assets.load('./assets/sprites/plushies/spritesheet1.json');
        const plushiesSheet = new Spritesheet(await Assets.load('./assets/sprites/plushies/spritesheet1.png'), plushiesJson.data);
        await plushiesSheet.parse();
        this.plushiesSprites = {};
        for (const [key, value] of Object.entries(plushiesSheet.textures)) {
            this.plushiesSprites[key] = new Sprite(value);
            const entry = this.plushiesSprites[key];
            entry.scale.set(Game.scale.x*1.2, Game.scale.y*1.2);
            entry.visible = false;
        };
        this.plushiesSprites['freddy.png'].position.set(this._currentSprite.width/2-(360*Game.scale.x*this.scale), this._currentSprite.height/2-(140*Game.scale.y));
        this.plushiesSprites['bonnie.png'].position.set(this._currentSprite.width/2-(422*Game.scale.x*this.scale), this._currentSprite.height/2-(50*Game.scale.y));
        this.plushiesSprites['chica.png'].position.set(this._currentSprite.width/2-(255*Game.scale.x*this.scale), this._currentSprite.height/2+(4*Game.scale.y))

        this.plushiesContainer = new Container();
        this.plushiesContainer.addChild(this.plushiesSprites['freddy.png'], this.plushiesSprites['bonnie.png'], this.plushiesSprites['chica.png']);

        //

        this._movementContainer = new Container();
        const leftBox = new Graphics()
        .rect(0, 0, innerWidth*0.4, innerHeight)
        .fill(0xff0000); leftBox.alpha = 0.5; 
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
        .rect(innerWidth-innerWidth*0.4, 0, innerWidth*0.4, innerHeight)
        .fill(0x0000ff); rightBox.alpha = 0.2; 
        rightBox.eventMode = 'static';
        rightBox.onpointerenter = (event) => this._moveRight = true;
        rightBox.onpointerleave = (event) => this._moveRight = false;

        const innerRightBox = new Graphics()
        .rect(innerWidth-rightBox.width/2, 0, rightBox.width/2, innerHeight)
        .fill(0x00ff00); innerRightBox.alpha = 0;
        innerRightBox.eventMode = 'static';
        innerRightBox.onpointerenter = (event) => this._innerMoveRight = true;
        innerRightBox.onpointerleave = (event) => {this._innerMoveRight = false; console.log(event)}

        this._movementContainer.addChild(leftBox, innerLeftBox, rightBox, innerRightBox);
        this.container = new Container();
    }
}