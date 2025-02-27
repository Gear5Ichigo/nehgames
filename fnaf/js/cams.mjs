import { Assets, Spritesheet, Sprite, Container, Graphics, Text, AnimatedSprite, Ticker } from '../../public/pixi.min.mjs';
import Game from './game.mjs';
import SpriteLoader from './spriteloader.mjs';

export default class Cams {

    static  __makeCamButton(cam, x, y, callBack) {
        const mapref = this.camsMap;
        const b = new Graphics()
        .rect(0, 0, 56*Game.scale.x, 37*Game.scale.y)
        .fill(0xff0000); b.alpha = 0; b.eventMode = 'static'
        b.callBack = () => { if (Game.currentCam === `CAM${cam}`) callBack(); }
        b.resize = () => { b.position.set(mapref.position.x+x*Game.scale.x, mapref.position.y+y*Game.scale.y); b.setSize(56*Game.scale.x, 37*Game.scale.y) }
        b.onpointerdown = () => {
            if (Game.currentCam === `CAM${cam}`) return;
            Game.currentCam = `CAM${cam}`;

            this.blipFlash1.gotoAndPlay(0); this.blipFlash1.visible = true;
            
            Game.SOUNDS.camBlip.play({volume: 1.5})
            this.camsMap.swapTexture(`${cam}.png`);
            this._swapTimer = 0;
            this._prevCamButton = null;
            if (this.showArea.children[0]) this.showArea.removeChild(this.showArea.children[0]);
            b.callBack();
        };
        this.mapButtons.addChild(b);
        return b;
    }

    static async init() {

        //

        this.cameraScreen = new Container();

        this.cameraBorder = new Graphics()
        .rect(0, 0, 1560*Game.scale.x, 680*Game.scale.y).stroke({fill: 0xffffff, width: 3});

        this.cameraRecording = new Graphics()
        .circle(0, 0, 25*Game.scale.x).fill(0xff0000);

        const blipFlashJson = await Assets.load('./assets/sprites/blipFlashes/spritesheet.json');
        const blipFlashSheet = new Spritesheet(await Assets.load('./assets/sprites/blipFlashes/spritesheet.png'), blipFlashJson.data);
        await blipFlashSheet.parse();

        this.blipFlash1 = new AnimatedSprite(blipFlashSheet.animations.first);
        this.blipFlash1.setSize(innerWidth, innerHeight);
        this.blipFlash1.loop = false;
        this.blipFlash1.onComplete = () => this.blipFlash1.visible = false; //this.blipFlash1.animationSpeed = 0.05;

        this.staticEffect = await SpriteLoader.AnimatedSprite('/static/spritesheet@0.5x', (animSprite) => {
            animSprite.alpha = 0.22;
        }); this.staticEffect.playAnimation();

        this.camsMap = await SpriteLoader.Sprite('/cams/Map/spritesheet@0.5x');
        this.camsMap.swapTexture('1A.png')
        this.camsMap.anchor = 0.5;

        this.trashTxt = await Assets.load('./assets/sprites/trash.png');

        this.areaName = new Text({text: "Stage",
            style: {
                fill: 0xffffff,
                fontFamily: 'FNAF',
                fontSize: 120*(Game.scale.x/2)
            }
        });

        //

        const areas = ['Stage', 'Backstage', 'Dining Room', 'Pirate Cove', 'Supply Closet', 'Left Hallway', 'Left Corner', 'Right Hallway', 'Right Corner', 'Restrooms'];
        for (const area of areas) {
            const json = await Assets.load(`./assets/sprites/cams/${area}/spritesheet@0.5x.json`);
            const spritesheet = new Spritesheet(await Assets.load(`./assets/sprites/cams/${area}/spritesheet@0.5x.png`), json.data);
            await spritesheet.parse();
            this[area.replace(/ /g,'').toLowerCase()] = spritesheet.textures;
        };
        this.showArea = new Sprite(Object.values(this.stage)[0]);
        this.cameraScreen.addChild(this.showArea);

        this.kitchen = new Graphics()
        .rect(0, 0, innerWidth, innerHeight)
        .fill(0x000000);
        this.kitchen.addChild(new Text({text: '-CAMERA DISABLED-\nAUDIO ONLY',
            style: {
                fontFamily: 'FNAF', fontSize: 144*(Game.scale.x/2),
                align: 'center', fill: 0xffffff,
            },
        }));

        this.foxyrun = await SpriteLoader.AnimatedSprite('/foxyrun/spritesheet@0.5x', (as) => { as.animationSpeed = 0.66; as.loop = false; });
        this.foxyrun.visible = true;

        this.blackBox = new Graphics()
        .rect(0, 0, innerWidth*1.2, innerHeight)
        .fill(0x000000);
        this.blackBox.visible = false;

        this.blackBox.start = () => {
            if (!this.blackBox.visible) {
                const sound = Game.SOUNDS[`camError${Math.floor(Math.random()*4)+1}`];
                console.log(`camError${Math.floor(Math.random()*4)+1}`)
                sound.play();
                this.blackBox.visible = true;
                const timer = new Ticker();
                timer.maxFPS = 60;
                let time = 0;
                timer.add((ticker) => {
                    time+=ticker.deltaTime/ticker.FPS;
                    if (time >= 5.00) {this.blackBox.visible = false; timer.destroy(); return;}
                }); timer.start();
            }
        }

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
                    if (this.camsMap.texture !== this.camsMap.spritesheet.textures['Complete_Map.png']) {
                        this._prevCamButton = Game.currentCam.substring(3)+'.png';
                        this.camsMap.swapTexture('Complete_Map.png');
                    } else {
                        this.camsMap.swapTexture(this._prevCamButton);
                    }
                }
            }
        };

        this._1A = this.__makeCamButton('1A', -100, -200, () => {
            const fr = Game.animatronics.freddy, bo = Game.animatronics.bonnie, ch = Game.animatronics.chica;
            this.areaName.text = 'Stage';
            if (fr.currentState==='CAM1A' && bo.currentState==='CAM1A' && ch.currentState==='CAM1A') { // the gangs here!
                this.showArea.texture = this.stage['19.png'];
            } else if (fr.currentState==='CAM1A' && bo.currentState==='CAM1A' && ch.currentState!=='CAM1A') { // no chica
                this.showArea.texture = this.stage['223.png'];
            } else if (fr.currentState==='CAM1A' && bo.currentState!=='CAM1A' && ch.currentState==='CAM1A') { // no bonnie
                this.showArea.texture = this.stage['68.png'];
            } else if (fr.currentState==='CAM1A' && bo.currentState!=='CAM1A' && ch.currentState!=='CAM1A') { // no bonnie and chica
                this.showArea.texture = this.stage['224.png'];
            } else { // everyones gone rip
                const chance = Math.floor(Math.random() * 4);
                if (chance == 1) {
                    this.showArea.texture = Game._bear5.texture;
                } else {
                    this.showArea.texture = this.stage['484.png'];
                }
            }
        });
        this._1B = this.__makeCamButton('1B', -117, -132, () => {
            this.areaName.text = 'Dining Room';
            if (Game.animatronics.chica.currentState === "CAM1B") {
                this.showArea.texture = this.diningroom['215.png'];
            } else if (Game.animatronics.bonnie.currentState === "CAM1B") {
                this.showArea.texture = this.diningroom['90.png'];
            } else if (Game.animatronics.freddy.currentState === "CAM1B") {
                this.showArea.texture = this.diningroom['492.png'];
            } else {
                this.showArea.texture = this.diningroom['48.png'];
            }
        });
        this._5 =this.__makeCamButton('5', -224, -101, () => {
            this.areaName.text = 'Backstage';
            if (Game.animatronics.bonnie.currentState === "CAM5") {
                this.showArea.texture = this.backstage['205.png'];
            } else {
                this.showArea.texture = this.backstage['83.png'];
            }
        });
        this._1C = this.__makeCamButton('1C', -168, -45, () => {
            this.areaName.text = 'Pirate Cove';
            if (Game.animatronics.foxy.currentState==="1") {
                this.showArea.texture = this.piratecove['66.png'];
            } else if (Game.animatronics.foxy.currentState==="2") {
                this.showArea.texture = this.piratecove['211.png'];
            } else if (Game.animatronics.foxy.currentState==="3") {
                this.showArea.texture = this.piratecove['338.png'];
            } else if (Game.animatronics.foxy.currentState==="4") {
                this.showArea.texture = this.piratecove['240.png'];
            }
        });
        this._3 = this.__makeCamButton('3', -187, 57, () => {
            this.areaName.text = 'Supply Closet';
            if (Game.animatronics.bonnie.currentState === "CAM3") {
                this.showArea.texture =  this.supplycloset['190.png'];
            } else {
                this.showArea.texture = this.supplycloset['62.png'];
            }
        });
        this._2A =this.__makeCamButton('2A', -103, 95, () => {
            this.areaName.text = 'West Hall';
            if (Game.animatronics.bonnie.currentState === "CAM2A") {
                this.showArea.texture = this.lefthallway['206.png'];
            } else {
                this.showArea.texture = this.lefthallway['44.png'];
            }
        });
        this._2B =this.__makeCamButton('2B', -103, 138, () => {
            this.areaName.text = 'W. Hall Corner';
            if (Game.animatronics.bonnie.currentState === "CAM2B") {
                this.showArea.texture = this.leftcorner['188.png'];
            } else {
                const chance = Math.floor(Math.random() * 100);
                if (chance <= 1) {
                    this.showArea.texture = this.leftcorner['540.png'];
                } else this.showArea.texture = this.leftcorner['0.png'];
            }
        });
        this._7 = this.__makeCamButton('7', 134, -114, () => {
            this.areaName.text = 'Restrooms';
            if (Game.animatronics.chica.currentState === "CAM7") {
                this.showArea.texture = this.restrooms['219.png'];
            } else if (Game.animatronics.freddy.currentState === "CAM7") {
                this.showArea.texture = this.restrooms['494.png'];
            } else {
                this.showArea.texture = this.restrooms['41.png'];
            }
        });
        this.__makeCamButton('6', 136, 39, () => {
            this.areaName.text = 'Kitchen';
            this.showArea.x = 0;
            Game.changeSprite(this.showArea, this.kitchen);
        });
        this._4A = this.__makeCamButton('4A', 0, 95, () => { 
            this.areaName.text = 'East Hall';
            if (Game.animatronics.chica.currentState === "CAM4A") {
                this.showArea.texture = this.righthallway['221.png'];
            } else if (Game.animatronics.freddy.currentState === "CAM4A") {
                this.showArea.texture = this.righthallway['487.png'];
            } else {
                this.showArea.texture = this.righthallway['67.png'];
            }
        });
        this._4B = this.__makeCamButton('4B', 0, 138, () => {
            this.areaName.text = 'E. Hall Corner';
            if (Game.animatronics.chica.currentState === "CAM4B") {
                this.showArea.texture = this.rightcorner['220.png'];
            } else if (Game.animatronics.freddy.currentState === "CAM4B") {
                this.showArea.texture = this.rightcorner['486.png'];
            } else {
                this.showArea.texture = this.rightcorner['49.png'];
            }
        });

        this.resize = () => {
            this.staticEffect.setSize(innerWidth, innerHeight);
            this.cameraBorder.position.set(20*Game.scale.x, 20*Game.scale.y);
            this.cameraBorder.setSize(1560*Game.scale.x, 680*Game.scale.y);
            this.cameraRecording.position.set(this.cameraBorder.x+(125*Game.scale.x), this.cameraBorder.y+(100*Game.scale.y));
            this.camsMap.scale.set(Game.scale.x*1.15, Game.scale.y*1.125);
            this.camsMap.position.set(this.cameraBorder.width-this.camsMap.width/2, this.cameraBorder.height-this.camsMap.height/2+(30*Game.scale.y));
            this.areaName.position.set(this.camsMap.x-this.camsMap.width/2, this.camsMap.y-this.camsMap.height/2-(35*Game.scale.y));
            // this.foxyrun.setSize(innerWidth*1.2, innerHeight);
            this.showArea.setSize(innerWidth*1.2, innerHeight);
            this.kitchen.children[0].position.set(innerWidth/2-(444*Game.scale.x), innerHeight/2-(222*Game.scale.y));

            for (const child of this.mapButtons.children) child.resize();
        }; this.resize();
    }
}