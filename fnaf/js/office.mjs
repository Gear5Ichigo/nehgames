import {Assets, Container, Sprite, Spritesheet, Graphics, Filter, GlProgram} from '../../pixi.mjs';

export default class Office {
    static async init() {

        const officejson = await Assets.load('./assets/sprites/office/spritesheet.json');
        this._spriteSheet = new Spritesheet(await Assets.load('./assets/sprites/office/spritesheet.png'), officejson.data);
        await this._spriteSheet.parse();

        this._sprites = {};
        for (const [key, value] of Object.entries(this._spriteSheet.textures)) {
            this._sprites[key] = new Sprite(value);
            const entry = this._sprites[key];
            entry.setSize(innerWidth*1.5, innerHeight);
            entry.anchor = 0.5;
            entry.position.set(innerWidth/2, innerHeight/2);
        };

        this._currentSprite = this._sprites["39.png"];

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
        innerRightBox.onpointerleave = (event) => this._innerMoveRight = false;

        this._movementContainer.addChild(leftBox, innerLeftBox, rightBox, innerRightBox);
        this.container = new Container();
    }
}