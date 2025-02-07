import { Assets, Spritesheet, Sprite, Container, Graphics } from '../../pixi.mjs';
import Game from './game.mjs';

export default class Cams {
    static async init() {

        //

        const camsMapJson = await Assets.load('./assets/sprites/cams/Map/spritesheet.json');
        const camsMapSheet = new Spritesheet(await Assets.load('./assets/sprites/cams/Map/spritesheet.png'), camsMapJson.data);
        await camsMapSheet.parse();
        this.camsMapSprites = {};
        for (const [key, value] of Object.entries(camsMapSheet.textures)) {
            this.camsMapSprites[key] = new Sprite(value);
            const entry =  this.camsMapSprites[key];
            entry.scale.set(Game.scale.x*1.125, Game.scale.y*1.125);
            entry.anchor = 0.5;
            entry.position.set(innerWidth-entry.width/2, innerHeight-entry.height/2);
        }
        this.camsMapContainer = new Container();
        this.camsMapContainer.addChild(this.camsMapSprites['1A.png']);

        //

        const stageJson = await Assets.load('./assets/sprites/cams/Stage/spritesheet.json');
        const stageSheet = new Spritesheet(await Assets.load('./assets/sprites/cams/Stage/spritesheet.png'), stageJson.data);
        await stageSheet.parse();
        this.stageSprites = {};
        for (const [key, value] of Object.entries(stageSheet.textures)) {
            this.stageSprites[key] = new Sprite(value);
            const entry = this.stageSprites[key];
            entry.setSize(innerWidth*1.2, innerHeight);
        }

        const diningJson = await Assets.load('./assets/sprites/cams/Dining Room/spritesheet.json');
        const diningSheet = new Spritesheet(await Assets.load('./assets/sprites/cams/Dining Room/spritesheet.png'), diningJson.data);
        await diningSheet.parse();
        this.diningSprites = {};
        for (const [key, value] of Object.entries(diningSheet.textures)) {
            this.diningSprites[key] = new Sprite(value);
            const entry = this.diningSprites[key];
            entry.setSize(innerWidth*1.2, innerHeight);
        }

        const leftHallJson = await Assets.load('./assets/sprites/cams/Left Hallway/spritesheet.json');
        const leftHallSheet = new Spritesheet(await Assets.load('./assets/sprites/cams/Left Hallway/spritesheet.png'), leftHallJson.data);
        await leftHallSheet.parse();
        this.leftHallSprites = {};
        for (const [key, value] of Object.entries(leftHallSheet.textures)) {
            this.leftHallSprites[key] = new Sprite(value);
            const entry = this.leftHallSprites[key];
            entry.setSize(innerWidth*1.2, innerHeight);
        }

        const leftCornerJson = await Assets.load('./assets/sprites/cams/Left Corner/spritesheet.json');
        const leftCornerSheet = new Spritesheet(await Assets.load('./assets/sprites/cams/Left Corner/spritesheet.png'), leftCornerJson.data);
        await leftCornerSheet.parse();
        this.leftCornerSprites = {};
        for (const [key, value] of Object.entries(leftCornerSheet.textures)) {
            this.leftCornerSprites[key] = new Sprite(value);
            const entry = this.leftCornerSprites[key];
            entry.setSize(innerWidth*1.2, innerHeight);
        }

        //

        const m = new Container();
        const mapref = this.camsMapSprites['1A.png'];
        this.mapButtons = m;

        function makeCamButton(x, y, callBack) {
            const b = new Graphics()
            .rect(mapref.position.x+x*Game.scale.x, mapref.position.y+y*Game.scale.y, 56*Game.scale.x, 37*Game.scale.y)
            .fill(0xff0000); b.alpha = 0.5; b.eventMode = 'static'
            b.onpointerdown = () => {
                if (callBack()) return;
                Game._cameraShow.x = -innerWidth*0.2;
                Game.SOUNDS.camBlip.play({volume: 1.5})
            };
            m.addChild(b);
            return b;
        }

        const _1a = makeCamButton(-100, -200, () => {
            if (Game.currentCam === "CAM1A") return true;
            Game.currentCam = "CAM1A";

            Game.changeSprite(Game._cameraShow, this.stageSprites['19.png']);
        });
        const _1b = makeCamButton(-117, -132, () => {
            if (Game.currentCam === "CAM1B") return true;
            Game.currentCam = "CAM1B";

            if (Game.animatronics.chica.currentState === "CAM1B") {
                Game.changeSprite(Game._cameraShow, this.diningSprites['215.png']);
            } else if (Game.animatronics.bonnie.currentState === "CAM1B") {
                Game.changeSprite(Game._cameraShow, this.diningSprites['90.png']);
            } else if (false) {

            } else {
                Game.changeSprite(Game._cameraShow, this.diningSprites['48.png']);
            }
        });
        const _5 = makeCamButton(-224, -101, () => {
            Game.currentCam = "CAM5";
        });
        const _1c = makeCamButton(-168, -45, () => {
            Game.currentCam = "CAM1C";
        });
        const _3 = makeCamButton(-187, 57, () => {
            Game.currentCam = "CAM3";
        });
        const _2a = makeCamButton(-103, 95, () => {
            if (Game.currentCam === "CAM2A") return true;
            Game.currentCam = "CAM2A";

            if (Game.animatronics.bonnie.currentState === "CAM2A") {
                Game.changeSprite(Game._cameraShow, this.leftHallSprites['206.png']);
            } else {
                Game.changeSprite(Game._cameraShow, this.leftHallSprites['44.png']);
            }
        });
        const _2b = makeCamButton(-103, 138, () => {
            if (Game.currentCam === "CAM2B") return true;
            Game.currentCam = "CAM2B";

            if (Game.animatronics.bonnie.currentState === "CAM2B") {
                Game.changeSprite(Game._cameraShow, this.leftCornerSprites['188.png']);
            } else {
                Game.changeSprite(Game._cameraShow, this.leftCornerSprites['0.png']);
            }
        });
        const _4a = makeCamButton(0, 95, () => {
            Game.currentCam = "CAM4A";
        });
        const _4b = makeCamButton(0, 138, () => {
            Game.currentCam = "CAM4B";
        });
    }
}