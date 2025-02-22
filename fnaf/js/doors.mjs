import SpriteLoader from "./spriteloader.mjs";
import Game from "./game.mjs";
import Office from "./office.mjs";
import { Container } from "../../public/pixi.min.mjs";

export default class Doors {
    static async init() {

        //
        this.right = null; this.left = null;

        const sides = ['left', 'right'];
        
        this.resize = (animSprite) => {
            animSprite.scale.set(Game.scale.x*1.2, Game.scale.y*1.2);
            animSprite.animationSpeed = 0.55;
            animSprite.loop = false;
        }
        for (const side of sides) {
            this[side] = await SpriteLoader.AnimatedSprite(`/doors/${side}/spritesheet`, this.resize);
        }

        this.rightX = () => {return Office.sprite.width-Office.margin-this.right.width-(80*Game.scale.x*Office.scale);}
        this.leftXOffset = 75;

        this.left.position.set(-Office.margin+(this.leftXOffset*Game.scale.x*Office.scale), 0*Game.scale.y);
        this.right.position.set(this.rightX(), 0*Game.scale.y);

        this.container = new Container();
        this.container.addChild(this.left, this.right);

        //
    
    }
}