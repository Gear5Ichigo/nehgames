import { AnimatedSprite, Assets, Spritesheet } from "../../public/pixi.min.mjs";
import Game from "./game.mjs";
import Office from "./office.mjs";
import SpriteLoader from "./spriteloader.mjs";

export default class Jumpscares {
    static async init() {

        this.bonnieScare = await SpriteLoader.AnimatedSprite('/jumpscares/bonnie/spritesheet', (as) => {as.animationSpeed = 0.55;});
        Game.jumpScares.addChild(this.bonnieScare);

        this.chicaScare = await SpriteLoader.AnimatedSprite('/jumpscares/chica/spritesheet', (as) => {as.animationSpeed = 0.55;});
        Game.jumpScares.addChild(this.chicaScare);

        this.freddyScare = await SpriteLoader.AnimatedSprite('/jumpscares/freddy/spritesheet@0.5x', (as) => {as.animationSpeed = 0.55;});
        Game.jumpScares.addChild(this.freddyScare);

        this.foxyScare = await SpriteLoader.AnimatedSprite('/jumpscares/foxy/spritesheet@0.5x', (as) => {as.animationSpeed = 0.33; as.anchor.set(0.5, 0)});
        this.foxyScare.visible = false;
        this.foxyScare.setSize(innerWidth*1.2, innerHeight);
        this.foxyScare.position.set(innerWidth/2, 0)

        this.polishFreddyScare = await SpriteLoader.AnimatedSprite('/jumpscares/polishfreddy/bear-jumpscare', (as) => {});
        Game.jumpScares.addChild(this.polishFreddyScare);

        console.log(Game.jumpScares.children)
        this.resize = () => {
            for (const jumpscare of Game.jumpScares.children) {
                jumpscare.forEach(([key, sprite]) => sprite.anchor.set(0.5, 0) );
                jumpscare.setSize(innerWidth*Office.scale, innerHeight);
                jumpscare.position.set(innerWidth/2, 0);
            }
        }; this.resize();
    }
}