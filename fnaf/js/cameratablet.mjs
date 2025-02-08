import { AnimatedSprite, Assets, Sprite, Spritesheet } from "../../pixi.mjs";
import Cams from "./cams.mjs";
import Game from "./game.mjs";

export default class CameraTablet {
    static async init() {
        this._animspeed = 0.66;

        this._camFlipButton = new Sprite(await Assets.load('./assets/sprites/420.png'));
        this._camFlipButton.anchor = 0.5; this._camFlipButton.alpha = 0.5;
        this._camFlipButton.scale.set(Game.scale.x, Game.scale.y);
        this._camFlipButton.position.set(innerWidth/2-(75*Game.scale.x), Cams.cameraBorder.height-this._camFlipButton.height+(40*Game.scale.y));
        this._camFlipButton.eventMode = 'static';

        const camflipjson = await Assets.load('./assets/sprites/camflip/camflip.json');
        this._cameraFlippingSprites = new Spritesheet(await Assets.load('./assets/sprites/camflip/camflip.png'), camflipjson.data);
        await this._cameraFlippingSprites.parse();

        this._flipUp = new AnimatedSprite(this._cameraFlippingSprites.animations.flip);
        this._flipUp.visible = false;
        this._flipUp.setSize(innerWidth, innerHeight);
        this._flipUp.animationSpeed = this._animspeed;
        this._flipUp.loop = false;

        this._flipDown = new AnimatedSprite(this._cameraFlippingSprites.animations.reverseFlip);
        this._flipDown.visible = false;
        this._flipDown.setSize(innerWidth, innerHeight);
        this._flipDown.animationSpeed = this._animspeed;
        this._flipDown.loop = false;
    }
}