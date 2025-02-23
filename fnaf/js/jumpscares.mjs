import { AnimatedSprite, Assets, Spritesheet } from "../../public/pixi.min.mjs";
import Game from "./game.mjs";
import Office from "./office.mjs";

export default class Jumpscares {
    static async init() {

        const bonnieJson = await Assets.load('./assets/sprites/jumpscares/bonnie/spritesheet.json');
        this._bonnieSheet = new Spritesheet(await Assets.load('./assets/sprites/jumpscares/bonnie/spritesheet.png'), bonnieJson.data);
        await this._bonnieSheet.parse();

        this.bonnieScare = new AnimatedSprite(this._bonnieSheet.animations.main);
        this.bonnieScare.anchor.set(0.5, 0);
        this.bonnieScare.setSize(innerWidth*Office.scale, innerHeight);
        this.bonnieScare.position.set(innerWidth/2, 0);
        this.bonnieScare.animationSpeed = 0.55;
        this.bonnieScare.visible = false;

        Game.jumpScares.addChild(this.bonnieScare);

        const chicaJson = await Assets.load('./assets/sprites/jumpscares/chica/spritesheet.json');
        this._chicaSheet = new Spritesheet(await Assets.load('./assets/sprites/jumpscares/chica/spritesheet.png'), chicaJson.data);
        await this._chicaSheet.parse();

        this.chicaScare = new AnimatedSprite(this._chicaSheet.animations.main);
        this.chicaScare.anchor.set(0.5, 0);
        this.chicaScare.setSize(innerWidth*Office.scale, innerHeight);
        this.chicaScare.position.set(innerWidth/2, 0);
        this.chicaScare.animationSpeed = 0.55;
        this.chicaScare.visible = false;

        Game.jumpScares.addChild(this.chicaScare);

        const freddyJson = await Assets.load('./assets/sprites/jumpscares/freddy/spritesheet.json');
        this._freddySheet = new Spritesheet(await Assets.load('./assets/sprites/jumpscares/freddy/spritesheet@0.5x.png'), freddyJson.data);
        await this._freddySheet.parse();

        this.freddyScare = new AnimatedSprite(this._freddySheet.animations.main);
        this.freddyScare.anchor.set(0.5, 0);
        this.freddyScare.setSize(innerWidth*Office.scale, innerHeight);
        this.freddyScare.position.set(innerWidth/2, 0);
        this.freddyScare.animationSpeed = 0.55;
        this.freddyScare.visible = false;

        Game.jumpScares.addChild(this.freddyScare);

        const foxyJson = await Assets.load('./assets/sprites/jumpscares/foxy/spritesheet@0.5x.png.json');
        this._foxySheet = new Spritesheet(await Assets.load('./assets/sprites/jumpscares/foxy/spritesheet@0.5x.png'), foxyJson.data);
        await this._foxySheet.parse();

        this.foxyScare = new AnimatedSprite(this._foxySheet.animations.main);
        this.foxyScare.anchor.set(0.5, 0);
        this.foxyScare.setSize(innerWidth*Office.scale, innerHeight);
        this.foxyScare.position.set(innerWidth/2, 0);
        this.foxyScare.animationSpeed = 0.33;
        this.foxyScare.visible = false;
    }
}