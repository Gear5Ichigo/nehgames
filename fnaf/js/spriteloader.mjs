import { AnimatedSprite, Assets, Container, Sprite, Spritesheet } from "../../public/pixi.min.mjs";

export default class SpriteLoader extends Sprite {

    static async Sprite(src) {
        class ExtendedSprite extends Sprite {
            constructor(sheet) {
                super(sheet.textures[Object.keys(sheet.textures)[0]]);
                this.spritesheet = sheet;
            }
            
            swapTexture(key) { this.texture = this.spritesheet.textures[key]; }
        }
        return new ExtendedSprite(await this.loadSheet(src));
    }

    static async SpriteCollection(src, callBack) {
        const sheet = await this.loadSheet(src);
        sheet.sprites = {};
        for (const [key, value] of Object.entries(sheet.textures)) {
            sheet.sprites[key] = new Sprite(value);
            if (callBack !== undefined) callBack(sheet.sprites[key]);
        }
        sheet.forEach = (callBack) => {for (const [key, sprite] of Object.entries(sheet.sprites)) callBack([key, sprite]);}
        return sheet;
    }

    static async AnimatedSprite(src, callBack) {
        class ExtendedAnimatedSprite extends Container {
            constructor(sheet) {
                super();
                this.spritesheet = sheet;
                this.animations = {};
                for (const [key, value] of Object.entries(this.spritesheet.animations)) {
                    this.animations[key] = new AnimatedSprite(value);
                    this.addChild(this.animations[key]);
                    if (callBack !== undefined || callBack !== null) callBack(this.animations[key]);
                }
                this.currentAnimation = this.animations[Object.keys(this.animations)[0]];
                this.changeAnimation(this.currentAnimation);
            }

            forEach(callBack) {
                for (const [key, animation] of Object.entries(this.animations)) {
                    callBack([key, animation]);
                }
            }

            changeAnimation(key) {
                for (const [string, animation] of Object.entries(this.animations)) {
                    animation.visible = false;
                    if (key === string || key === animation) {animation.visible = true; this.currentAnimation = animation;}
                }
            }

            playAnimation(key) {
                if (key == undefined || key == null || key == '') {
                    this.animations[Object.keys(this.animations)[0]].gotoAndPlay(0);
                } else {
                    this.changeAnimation(key);
                    this.animations[key].gotoAndPlay(0);
                }
            }

            resetAnimations() {
                this.forEach( ([key, animation]) => {
                    animation.gotoAndStop(0);
                })
            }
        }
        return new ExtendedAnimatedSprite(await this.loadSheet(src))
    }

    static async loadSheet(src) {
        const json = await Assets.load(`./assets/sprites${src}.json`);
        const spritesheet =  new Spritesheet(await Assets.load(`./assets/sprites${src}.png`), json.data);
        await spritesheet.parse();
        return spritesheet;
    }
}