import { Assets, Spritesheet, Sprite, Container, Graphics, Text } from '../../pixi.mjs';
import Game from './game.mjs';

export default class Cams {

    static  __makeCamButton(cam, x, y, callBack) {
        const mapref = this.camsMapSprites[`${cam}.png`];
        const b = new Graphics()
        .rect(mapref.position.x+x*Game.scale.x, mapref.position.y+y*Game.scale.y, 56*Game.scale.x, 37*Game.scale.y)
        .fill(0xff0000); b.alpha = 0; b.eventMode = 'static'
        b.onpointerdown = () => {
            if (Game.currentCam === `CAM${cam}`) return;
            Game.currentCam = `CAM${cam}`;
            Game._cameraShow.x = -innerWidth*0.2;
            Game.SOUNDS.camBlip.play({volume: 1.5})
            Game.changeSprite(this.camsMapContainer, this.camsMapSprites[`${cam}.png`]);
            callBack();
        };
        this.mapButtons.addChild(b);
        return b;
    }

    static async init() {

        //

        this.cameraBorder = new Graphics()
        .rect(20*Game.scale.x, 20*Game.scale.y, 1560*Game.scale.x, 680*Game.scale.y).stroke({fill: 0xffffff, width: 3});

        this.cameraRecording = new Graphics()
        .circle(this.cameraBorder.x+(125*Game.scale.x), this.cameraBorder.y+(100*Game.scale.y), 25*Game.scale.x).fill(0xff0000);

        const camsMapJson = await Assets.load('./assets/sprites/cams/Map/spritesheet.json');
        const camsMapSheet = new Spritesheet(await Assets.load('./assets/sprites/cams/Map/spritesheet.png'), camsMapJson.data);
        await camsMapSheet.parse();
        this.camsMapSprites = {};
        for (const [key, value] of Object.entries(camsMapSheet.textures)) {
            this.camsMapSprites[key] = new Sprite(value);
            const entry =  this.camsMapSprites[key];
            entry.scale.set(Game.scale.x*1.125, Game.scale.y*1.125);
            entry.anchor = 0.5;
            entry.position.set(this.cameraBorder.width-entry.width/2, this.cameraBorder.height-entry.height/2+(30*Game.scale.y));
        }; const mapref = this.camsMapSprites['1A.png'];
        this.camsMapContainer = new Container();
        this.camsMapContainer.addChild(this.camsMapSprites['1A.png']);

        this.areaName = new Text({text: "Stage",
            style: {
                fill: 0xffffff,
                fontFamily: 'FNAF',
                fontSize: 120*(Game.scale.x/2)
            }
        }); this.areaName.position.set(mapref.x-mapref.width/2, mapref.y-mapref.height/2-(35*Game.scale.y),)

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

        const supplyClosetJson = await Assets.load('./assets/sprites/cams/Utility Closet/spritesheet.json');
        const supplyClosetSheet = new Spritesheet(await Assets.load('./assets/sprites/cams/Utility Closet/spritesheet.png'), supplyClosetJson.data);
        await supplyClosetSheet.parse();
        this.supplyClosetSprites = {};
        for (const [key, value] of Object.entries(supplyClosetSheet.textures)) {
            this.supplyClosetSprites[key] = new Sprite(value);
            const entry = this.supplyClosetSprites[key];
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

        const rightHallJson = await Assets.load('./assets/sprites/cams/Right Hallway/spritesheet.json');
        const rightHallSheet = new Spritesheet(await Assets.load('./assets/sprites/cams/Right Hallway/spritesheet.png'), rightHallJson.data);
        await rightHallSheet.parse();
        this.rightHallSprites = {};
        for (const [key, value] of Object.entries(rightHallSheet.textures)) {
            this.rightHallSprites[key] = new Sprite(value);
            const entry = this.rightHallSprites[key];
            entry.setSize(innerWidth*1.2, innerHeight);
        }

        const rightCornerJson = await Assets.load('./assets/sprites/cams/Right Corner/spritesheet.json');
        const rightCornerSheet = new Spritesheet(await Assets.load('./assets/sprites/cams/Right Corner/spritesheet.png'), rightCornerJson.data);
        await rightCornerSheet.parse();
        this.rightCornerSprites = {};
        for (const [key, value] of Object.entries(rightCornerSheet.textures)) {
            this.rightCornerSprites[key] = new Sprite(value);
            const entry = this.rightCornerSprites[key];
            entry.setSize(innerWidth*1.2, innerHeight);
        }

        const kitchen = new Graphics()
        .rect(0, 0, innerWidth, innerHeight)
        .fill(0x000000);
        kitchen.addChild(new Text({text: '-CAMERA DISABLED-\nAUDIO ONLY',
            style: {
                fontFamily: 'FNAF', fontSize: 88,
                align: 'center', fill: 0xffffff,
            },
            x: innerWidth/2-(144*Game.scale.x), y: innerHeight/2-(33*Game.scale.y)
        }));

        //

        this.mapButtons = new Container();

        this.__makeCamButton('1A', -100, -200, () => {
            this.areaName.text = 'Stage';
            Game.changeSprite(Game._cameraShow, this.stageSprites['19.png']);
        });
        this.__makeCamButton('1B', -117, -132, () => {
            this.areaName.text = 'Dining Room';
            if (Game.animatronics.chica.currentState === "CAM1B") {
                Game.changeSprite(Game._cameraShow, this.diningSprites['215.png']);
            } else if (Game.animatronics.bonnie.currentState === "CAM1B") {
                Game.changeSprite(Game._cameraShow, this.diningSprites['90.png']);
            } else if (false) {

            } else {
                Game.changeSprite(Game._cameraShow, this.diningSprites['48.png']);
            }
        });
        this.__makeCamButton('5', -224, -101, () => {

        });
        this.__makeCamButton('1C', -168, -45, () => {

        });
        this.__makeCamButton('3', -187, 57, () => {
            this.areaName.text = 'Supply Closet';
            if (Game.animatronics.bonnie.currentState === "CAM3") {
                Game.changeSprite(Game._cameraShow, this.supplyClosetSprites['190.png']);
            } else {
                Game.changeSprite(Game._cameraShow, this.supplyClosetSprites['62.png']);
            }
        });
        this.__makeCamButton('2A', -103, 95, () => {
            this.areaName.text = 'West Hall';
            if (Game.animatronics.bonnie.currentState === "CAM2A") {
                Game.changeSprite(Game._cameraShow, this.leftHallSprites['206.png']);
            } else {
                Game.changeSprite(Game._cameraShow, this.leftHallSprites['44.png']);
            }
        });
        this.__makeCamButton('2B', -103, 138, () => {
            this.areaName.text = 'W. Hall Corner';
            if (Game.animatronics.bonnie.currentState === "CAM2B") {
                Game.changeSprite(Game._cameraShow, this.leftCornerSprites['188.png']);
            } else {
                Game.changeSprite(Game._cameraShow, this.leftCornerSprites['0.png']);
            }
        });
        this.__makeCamButton('7', 134, -114, () => {

        });
        this.__makeCamButton('6', 136, 39, () => {
            this.areaName.text = 'Kitchen';
            Game._cameraShow.x = 0;
            Game.changeSprite(Game._cameraShow, kitchen);
        });
        this.__makeCamButton('4A', 0, 95, () => {
            this.areaName.text = 'East Hall';
            if (Game.animatronics.chica.currentState === "CAM4A") {
                Game.changeSprite(Game._cameraShow, this.rightHallSprites['221.png']);
            } else {
                Game.changeSprite(Game._cameraShow, this.rightHallSprites['67.png']);
            }
        });
        this.__makeCamButton('4B', 0, 138, () => {
            this.areaName.text = 'E. Hall Corner';
            if (Game.animatronics.chica.currentState === "CAM4B") {
                Game.changeSprite(Game._cameraShow, this.rightCornerSprites['220.png']);
            } else {
                Game.changeSprite(Game._cameraShow, this.rightCornerSprites['49.png']);
            }
        });
    }
}