import { Assets, Spritesheet, Sprite, Container, Graphics, Text, AnimatedSprite } from '../../public/pixi.min.mjs';
import Game from './game.mjs';
import SpriteLoader from './spriteloader.mjs';

export default class Cams {

    static  __makeCamButton(cam, x, y, callBack) {
        const mapref = this.camsMapSprites[`${cam}.png`];
        const b = new Graphics()
        .rect(mapref.position.x+x*Game.scale.x, mapref.position.y+y*Game.scale.y, 56*Game.scale.x, 37*Game.scale.y)
        .fill(0xff0000); b.alpha = 0; b.eventMode = 'static'
        b.onpointerdown = () => {
            if (Game.currentCam === `CAM${cam}`) return;
            Game.currentCam = `CAM${cam}`;

            this.blipFlash1.gotoAndPlay(0); this.blipFlash1.visible = true;
            
            Game.SOUNDS.camBlip.play({volume: 1.5})
            Game.changeSprite(this.camsMapContainer, this.camsMapSprites[`${cam}.png`]);
            this._swapTimer = 0;
            this._prevCamButton = null;
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

        const blipFlashJson = await Assets.load('./assets/sprites/blipFlashes/spritesheet.json');
        const blipFlashSheet = new Spritesheet(await Assets.load('./assets/sprites/blipFlashes/spritesheet.png'), blipFlashJson.data);
        await blipFlashSheet.parse();

        this.blipFlash1 = new AnimatedSprite(blipFlashSheet.animations.first);
        this.blipFlash1.setSize(innerWidth, innerHeight);
        this.blipFlash1.loop = false;
        this.blipFlash1.onComplete = () => this.blipFlash1.visible = false; //this.blipFlash1.animationSpeed = 0.05;

        this.staticEffect = await SpriteLoader.AnimatedSprite('/static/spritesheet@0.5x', (animSprite) => {
            animSprite.alpha = 0.33;
            animSprite.setSize(innerWidth, innerHeight);
        }); this.staticEffect.playAnimation();

        const camsMapJson = await Assets.load('./assets/sprites/cams/Map/spritesheet@0.5x.png.json');
        const camsMapSheet = new Spritesheet(await Assets.load('./assets/sprites/cams/Map/spritesheet@0.5x.png'), camsMapJson.data);
        await camsMapSheet.parse();
        this.camsMapSprites = {};
        for (const [key, value] of Object.entries(camsMapSheet.textures)) {
            this.camsMapSprites[key] = new Sprite(value);
            const entry =  this.camsMapSprites[key];
            entry.scale.set(Game.scale.x*1.15, Game.scale.y*1.125);
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

        const backStageJson = await Assets.load('./assets/sprites/cams/Backstage/spritesheet.json');
        const backStageSheet = new Spritesheet(await Assets.load('./assets/sprites/cams/Backstage/spritesheet@0.5x.png'), backStageJson.data);
        await backStageSheet.parse();
        this.backStageSprites = {};
        for (const [key, value] of Object.entries(backStageSheet.textures)) {
            this.backStageSprites[key] = new Sprite(value);
            const entry = this.backStageSprites[key];
            entry.setSize(innerWidth*1.2, innerHeight);
        }

        const diningJson = await Assets.load('./assets/sprites/cams/Dining Room/spritesheet.json');
        const diningSheet = new Spritesheet(await Assets.load('./assets/sprites/cams/Dining Room/spritesheet@0.5x.png'), diningJson.data);
        await diningSheet.parse();
        this.diningSprites = {};
        for (const [key, value] of Object.entries(diningSheet.textures)) {
            this.diningSprites[key] = new Sprite(value);
            const entry = this.diningSprites[key];
            entry.setSize(innerWidth*1.2, innerHeight);
        }

        const pirateCoveJson = await Assets.load('./assets/sprites/cams/Pirate Cove/spritesheet.json');
        const priateCoveSheet = new Spritesheet(await Assets.load('./assets/sprites/cams/Pirate Cove/spritesheet.png'), pirateCoveJson.data);
        await priateCoveSheet.parse();
        this.pirateCoveSprites = {};
        for (const [key, value] of Object.entries(priateCoveSheet.textures)) {
            this.pirateCoveSprites[key] = new Sprite(value);
            const entry = this.pirateCoveSprites[key];
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

        const restRoomsJson = await Assets.load('./assets/sprites/cams/Toilets/spritesheet.json');
        const restRoomsSheet = new Spritesheet(await Assets.load('./assets/sprites/cams/Toilets/spritesheet.png'), restRoomsJson.data);
        await restRoomsSheet.parse();
        this.restRoomsSprites = {};
        for (const [key, value] of Object.entries(restRoomsSheet.textures)) {
            this.restRoomsSprites[key] = new Sprite(value);
            const entry = this.restRoomsSprites[key];
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
                fontFamily: 'FNAF', fontSize: 144*(Game.scale.x/2),
                align: 'center', fill: 0xffffff,
            },
            x: innerWidth/2-(166*Game.scale.x), y: innerHeight/2-(144*Game.scale.y)
        }));

        this.blackBox = new Graphics()
        .rect(0, 0, innerWidth*1.2, innerHeight)
        .fill(0x000000);
        this.blackBox.visible = false;

        //

        this.mapButtons = new Container();

        this._swapTimer = 0;
        this._prevCamButton = null;
        this.camMapPseudoAnim = (ticker) => {
            const dt = ticker.deltaTime/ticker.FPS;
            if (Game.cameraRender.visible) {
                this._swapTimer += dt;
                if (this._swapTimer >= 0.5) {
                    this._swapTimer = 0;
                    if (this.camsMapContainer.children[0] !== this.camsMapSprites['Complete_Map.png']) {
                        this._prevCamButton = this.camsMapContainer.children[0];
                        Game.changeSprite(this.camsMapContainer, this.camsMapSprites['Complete_Map.png']);
                    } else {
                        Game.changeSprite(this.camsMapContainer, this._prevCamButton);
                    }
                }
            }
        };

        this.__makeCamButton('1A', -100, -200, () => {
            const fr = Game.animatronics.freddy, bo = Game.animatronics.bonnie, ch = Game.animatronics.chica;
            this.areaName.text = 'Stage';
            if (fr.currentState==='CAM1A' && bo.currentState==='CAM1A' && ch.currentState==='CAM1A') { // the gangs here!
                Game.changeSprite(Game._cameraShow, this.stageSprites['19.png']);
            } else if (fr.currentState==='CAM1A' && bo.currentState==='CAM1A' && ch.currentState!=='CAM1A') { // no chica
                Game.changeSprite(Game._cameraShow, this.stageSprites['223.png']);
            } else if (fr.currentState==='CAM1A' && bo.currentState!=='CAM1A' && ch.currentState==='CAM1A') { // no bonnie
                Game.changeSprite(Game._cameraShow, this.stageSprites['68.png']);
            } else if (fr.currentState==='CAM1A' && bo.currentState!=='CAM1A' && ch.currentState!=='CAM1A') { // no bonnie and chica
                Game.changeSprite(Game._cameraShow, this.stageSprites['224.png']);
            } else { // everyones gone rip
                const chance = Math.floor(Math.random() * 4);
                if (chance == 1) {
                    Game.changeSprite(Game._cameraShow, Game._bear5);
                } else {
                    Game.changeSprite(Game._cameraShow, this.stageSprites['484.png']);
                }
            }
        });
        this.__makeCamButton('1B', -117, -132, () => {
            this.areaName.text = 'Dining Room';
            if (Game.animatronics.chica.currentState === "CAM1B") {
                Game.changeSprite(Game._cameraShow, this.diningSprites['215.png']);
            } else if (Game.animatronics.bonnie.currentState === "CAM1B") {
                Game.changeSprite(Game._cameraShow, this.diningSprites['90.png']);
            } else if (Game.animatronics.freddy.currentState === "CAM1B") {
                Game.changeSprite(Game._cameraShow, this.diningSprites['492.png']);
            } else {
                Game.changeSprite(Game._cameraShow, this.diningSprites['48.png']);
            }
        });
        this.__makeCamButton('5', -224, -101, () => {
            this.areaName.text = 'Backstage';
            if (Game.animatronics.bonnie.currentState === "CAM5") {
                Game.changeSprite(Game._cameraShow, this.backStageSprites['205.png']);
            } else {
                Game.changeSprite(Game._cameraShow, this.backStageSprites['83.png']);
            }
        });
        this.__makeCamButton('1C', -168, -45, () => {
            this.areaName.text = 'Pirate Cove';
            if (Game.animatronics.foxy.currentState==="1") {
                Game.changeSprite(Game._cameraShow, this.pirateCoveSprites['66.png']);
            } else if (Game.animatronics.foxy.currentState==="2") {
                Game.changeSprite(Game._cameraShow, this.pirateCoveSprites['211.png']);
            } else if (Game.animatronics.foxy.currentState==="3") {
                Game.changeSprite(Game._cameraShow, this.pirateCoveSprites['338.png']);
            } else if (Game.animatronics.foxy.currentState==="4") {
                Game.changeSprite(Game._cameraShow, this.pirateCoveSprites['240.png']);
            }
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
            this.areaName.text = 'Restrooms';
            if (Game.animatronics.chica.currentState === "CAM7") {
                Game.changeSprite(Game._cameraShow, this.restRoomsSprites['219.png']);
            } else if (Game.animatronics.freddy.currentState === "CAM7") {
                Game.changeSprite(Game._cameraShow, this.restRoomsSprites['494.png']);
            } else {
                Game.changeSprite(Game._cameraShow, this.restRoomsSprites['41.png']);
            }
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
            } else if (Game.animatronics.freddy.currentState === "CAM4A") {
                Game.changeSprite(Game._cameraShow, this.rightHallSprites['487.png']);
            } else {
                Game.changeSprite(Game._cameraShow, this.rightHallSprites['67.png']);
            }
        });
        this.__makeCamButton('4B', 0, 138, () => {
            this.areaName.text = 'E. Hall Corner';
            if (Game.animatronics.chica.currentState === "CAM4B") {
                Game.changeSprite(Game._cameraShow, this.rightCornerSprites['220.png']);
            } else if (Game.animatronics.freddy.currentState === "CAM4B") {
                Game.changeSprite(Game._cameraShow, this.rightCornerSprites['486.png']);
            } else {
                Game.changeSprite(Game._cameraShow, this.rightCornerSprites['49.png']);
            }
        });
    }
}