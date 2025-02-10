import { AnimatedSprite, Assets, Spritesheet } from "../../pixi.mjs";
import Game from "./game.mjs";

export default class Jumpscares {
    static async init() {

        const bonnieJson = await Assets.load('./assets/sprites/jumpscares/bonnie/spritesheet.json');
        this._bonnieSheet = new Spritesheet(await Assets.load('./assets/sprites/jumpscares/bonnie/spritesheet.png'), bonnieJson.data);
        await this._bonnieSheet.parse();

        this.bonnieScare = new AnimatedSprite(this._bonnieSheet.animations.main);
        this.bonnieScare.anchor.set(0.5, 0);
        this.bonnieScare.setSize(innerWidth*1.5, innerHeight);
        this.bonnieScare.position.set(innerWidth/2, 0);
        this.bonnieScare.animationSpeed = 0.55;
        this.bonnieScare.visible = false;

        Game.jumpScares.addChild(this.bonnieScare);

        const chicaJson = await Assets.load('./assets/sprites/jumpscares/chica/spritesheet.json');
        this._chicaSheet = new Spritesheet(await Assets.load('./assets/sprites/jumpscares/chica/spritesheet.png'), chicaJson.data);
        await this._chicaSheet.parse();

        this.chicaScare = new AnimatedSprite(this._chicaSheet.animations.main);
        this.chicaScare.anchor.set(0.5, 0);
        this.chicaScare.setSize(innerWidth*1.5, innerHeight);
        this.chicaScare.position.set(innerWidth/2, 0);
        this.chicaScare.animationSpeed = 0.55;
        this.chicaScare.visible = false;

        Game.jumpScares.addChild(this.chicaScare);

        const freddyJson = await Assets.load('./assets/sprites/jumpscares/freddy/spritesheet.json');
        this._freddySheet = new Spritesheet(await Assets.load('./assets/sprites/jumpscares/freddy/spritesheet.png'), freddyJson.data);
        await this._freddySheet.parse();

        this.freddyScare = new AnimatedSprite(this._freddySheet.animations.main);
        this.freddyScare.anchor.set(0.5, 0);
        this.freddyScare.setSize(innerWidth*1.5, innerHeight);
        this.freddyScare.position.set(innerWidth/2, 0);
        this.freddyScare.animationSpeed = 0.55;
        this.freddyScare.visible = false;

        Game.jumpScares.addChild(this.freddyScare);
    }
}