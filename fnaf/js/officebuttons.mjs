import { Assets, Spritesheet, Sprite, Container, Graphics } from '../../pixi.mjs';
import Game from './game.mjs'
import Office from './office.mjs';

export default class OfficeButtons {
    static async init() {
        const leftbuttonjson = await Assets.load('./assets/sprites/buttons/left/spritesheet.json');
        const leftbuttonsheet = new Spritesheet(await Assets.load('./assets/sprites/buttons/left/spritesheet.png'), leftbuttonjson.data);
        await leftbuttonsheet.parse();

        this._leftDoorSprites = {};
        for (const [key, value] of Object.entries(leftbuttonsheet.textures)) {
            this._leftDoorSprites[key] = new Sprite(value);
            const entry = this._leftDoorSprites[key];
            entry.setSize(entry.width*Game.scale.x, entry.height*Game.scale.y)
            entry.position.set(-Office._currentSprite.width*0.16, innerHeight/2);
        };
        this._leftDoorCurrentSprite = this._leftDoorSprites["122.png"];

        this._leftDoorClick = new Container();
        this._ldSpriteConainer = new Container();

        const leftX = this._leftDoorCurrentSprite.x+(30*Game.scale.x);
        const bY = this._leftDoorCurrentSprite.y+(52*Game.scale.y);
        const bY2 = this._leftDoorCurrentSprite.y+(132*Game.scale.y);

        const btnSize = [40*Game.scale.x, 55*Game.scale.y]

        const l_doorClick = new Graphics()
        .rect(leftX, bY, btnSize[0], btnSize[1]).fill(0xff00ff); l_doorClick.alpha = 0.5;
        l_doorClick.eventMode = 'static';
        l_doorClick.onpointerdown = this.__doordown;

        const l_lightClick = new Graphics()
        .rect(leftX, bY2, btnSize[0], btnSize[1]).fill(0xff00ff); l_lightClick.alpha = 0.5;
        l_lightClick.eventMode = 'static';
        l_lightClick.onpointerdown = this.__lightdown;
        l_lightClick.onpointerup = this.__lightup;
        l_lightClick.onpointerleave = this.__lightup;
        
        this._ldSpriteConainer.addChild(this._leftDoorCurrentSprite);
        this._leftDoorClick.addChild(this._ldSpriteConainer, l_doorClick, l_lightClick);

        // const rightbuttonjson = await Assets.load('./assets/sprites/buttons/right/spritesheet.json');
    }

    static __lightdown(event) {
        Game.SOUNDS.lightsHum.play(); this.powerUsage+=1;
        if (Game.animatronics.bonnie.currentState === "ATDOOR") {
            const random = Math.random()*100;
            if (random <= 10) {
                Game.officeSpritesContainer.addChild(Office._sprites["58goku.png"]);
                Game.SOUNDS.gokuscare.play({volume: 2});
                return;
            }
            Game.officeSpritesContainer.addChild(Office._sprites["225.png"]);
            Game.SOUNDS.windowscare.play({});
        } else {
            Game.officeSpritesContainer.addChild(Office._sprites["58.png"]);
        }
    }

    static __lightup(event) {
        Game.SOUNDS.lightsHum.stop();
        Game.officeSpritesContainer.removeChild(Game.officeSpritesContainer.children[1]);
    }

    static __doordown(event) {

    }

    static __doorup(event) {

    }
}