import { AnimatedSprite, Assets, Container, Sprite, Spritesheet } from "../../pixi.mjs";
import Game from "./game.mjs";
import Office from "./office.mjs";

export default class Doors {
    static async init() {

        //

        const leftdoorjson = await Assets.load('./assets/sprites/doors/left/spritesheet.json');
        const leftdoorsheet = new Spritesheet(await Assets.load('./assets/sprites/doors/left/spritesheet.png'), leftdoorjson.data);
        await leftdoorsheet.parse();
        this.leftDoorSprites = {}
        for (const [key, value] of Object.entries(leftdoorsheet.textures)) {
            this.leftDoorSprites[key] = new Sprite(value);
            const entry = this.leftDoorSprites[key];
            entry.scale.set(Game.scale.x*1.2, Game.scale.y*1.2);
            entry.position.set(-Office._currentSprite.width*0.107, 0*Game.scale.y);
        }

        this.leftDoorContainer = new Container();

        //

        this.leftDoorCloseAnim = new AnimatedSprite(leftdoorsheet.animations.close);
        this.leftDoorCloseAnim.scale.set(Game.scale.x*1.2, Game.scale.y*1.2);
        this.leftDoorCloseAnim.position.set(-Office._currentSprite.width*0.107, 0*Game.scale.y);
        this.leftDoorCloseAnim.animationSpeed = 0.44;
        this.leftDoorCloseAnim.loop = false;
        this.leftDoorCloseAnim.onComplete = () => {
            Game.changeSprite(this.leftDoorContainer, this.leftDoorSprites["102.png"]);   
        }

        this.leftDoorOpenAnim = new AnimatedSprite(leftdoorsheet.animations.open);
        this.leftDoorOpenAnim.scale.set(Game.scale.x*1.2, Game.scale.y*1.2);
        this.leftDoorOpenAnim.position.set(-Office._currentSprite.width*0.107, 0*Game.scale.y);
        this.leftDoorOpenAnim.animationSpeed = 0.44;
        this.leftDoorOpenAnim.loop = false;
        this.leftDoorOpenAnim.onComplete = () => {
            Game.changeSprite(this.leftDoorContainer, this.leftDoorSprites["88.png"]);   
        }

        this.leftDoorContainer.addChild(this.leftDoorCloseAnim);

        //

        const rightdoorjson = await Assets.load('./assets/sprites/doors/right/spritesheet.json');
        const rightdoorsheet = new Spritesheet(await Assets.load('./assets/sprites/doors/right/spritesheet.png'), rightdoorjson.data);
        await rightdoorsheet.parse();
        this.rightDoorSprites = {}
        for (const [key, value] of Object.entries(rightdoorsheet.textures)) {
            this.rightDoorSprites[key] = new Sprite(value);
            const entry = this.rightDoorSprites[key];
            entry.scale.set(Game.scale.x*1.2, Game.scale.y*1.2);
            entry.position.set(Office._currentSprite.width/1.55, 0*Game.scale.y);
        }

        this.rightDoorContainer = new Container();

        //

        this.rightDoorCloseAnim = new AnimatedSprite(rightdoorsheet.animations.close);
        this.rightDoorCloseAnim.scale.set(Game.scale.x*1.2, Game.scale.y*1.2);
        this.rightDoorCloseAnim.position.set(Office._currentSprite.width/1.55, 0*Game.scale.y);
        this.rightDoorCloseAnim.animationSpeed = 0.44;
        this.rightDoorCloseAnim.loop = false;
        this.rightDoorCloseAnim.onComplete = () => {
            // Game.changeSprite(this.leftDoorContainer, this.rightDoorSprites["102.png"]);   
        }

        this.rightDoorOpenAnim = new AnimatedSprite(rightdoorsheet.animations.open);
        this.rightDoorOpenAnim.scale.set(Game.scale.x*1.2, Game.scale.y*1.2);
        this.rightDoorOpenAnim.position.set(Office._currentSprite.width/1.55, 0*Game.scale.y);
        this.rightDoorOpenAnim.animationSpeed = 0.44;
        this.rightDoorOpenAnim.loop = false;
        this.rightDoorOpenAnim.onComplete = () => {
            console.log(this.rightDoorSprites["118.png"])
            // Game.changeSprite(this.rightDoorContainer, this.rightDoorSprites["118.png"]);   
        }

        this.rightDoorContainer.addChild(this.rightDoorCloseAnim);


    }
}