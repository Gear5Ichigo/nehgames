import { Assets, Spritesheet, Sprite, Container, Graphics } from '../../public/pixi.min.mjs';
import Doors from './doors.mjs';
import Game from './game.mjs'
import Office from './office.mjs';
import SpriteLoader from './spriteloader.mjs';

export default class OfficeButtons {
    static async init() {

        this.bScale = 1.2;
        this.calcBtnSize = () => {return [40*Game.scale.x*this.bScale, 82*Game.scale.y*this.bScale]}
        
        const btnSize = this.calcBtnSize();

        //

        this.leftButton = await SpriteLoader.Sprite('/buttons/left/spritesheet');
        this.leftButton.swapTexture('122.png');
        this.leftButton.resize = () => {
            this.leftButton.scale.set(Game.scale.x*this.bScale, Game.scale.y*this.bScale);
            this.leftButton.position.set(-Office.margin, innerHeight*0.375);
        }; this.leftButton.resize();

        //

        this._leftButtonClick = new Container();

        this.leftX = () => {return this.leftButton.x+(30*Game.scale.x*this.bScale)}
        this.bY = () => {return this.leftButton.y+(52*Game.scale.y*this.bScale)}
        this.bY2 = () => {return this.leftButton.y+(131*Game.scale.y*this.bScale)}

        function canClick() {return Game.die || Game.powerDown || Game.animatronics.bonnie.currentState==="OFFICE" || Game.animatronics.freddy.currentState==="OFFICE"}

        this.l_doorClick = new Graphics()
        .rect(0, 0, btnSize[0], btnSize[1]).fill(0xff00ff);
        this.l_doorClick.position.set(this.leftX(), this.bY()-(27*Game.scale.y));
        this.l_doorClick.alpha = 0.0;
        this.l_doorClick.eventMode = 'dynamic';
        this.l_doorClick.onpointerdown = () => {
            if (canClick()) { Game.SOUNDS.doorError.play(); return; };
            this.__left_door();
            this.__updateLeftSideButtons(); this.__updateRightSideButtons();
        }

        this.l_lightClick = new Graphics()
        .rect(0, 0, btnSize[0], btnSize[1]).fill(0xff00ff);
        this.l_lightClick.position.set(this.leftX(), this.bY2()+(20*Game.scale.y))
        this.l_lightClick.alpha = 0.0;
        this.l_lightClick.eventMode = 'dynamic';
        this.l_lightClick.onpointerdown = () => {
            if (canClick()) { Game.SOUNDS.doorError.play(); return; };
            this.__left_light();
            this.__updateLeftSideButtons(); this.__updateRightSideButtons();
            this.__updateLeftSideOffice();
        };
        
        this._leftButtonClick.addChild(this.leftButton);

        //

        this.rightButton = await SpriteLoader.Sprite('/buttons/right/spritesheet');
        this.rightButton.swapTexture('134.png');
        this.rightButton.resize = () => {
            this.rightButton.scale.set(Game.scale.x*(this.bScale+0.), Game.scale.y*(this.bScale+0.));
            this.rightButton.position.set(Office.sprite.width-Office.margin-this.rightButton.width, innerHeight*0.375)
        }; this.rightButton.resize();

        //

        this.rightX = () => {return this.rightButton.x+(22*Game.scale.x*this.bScale)}

        this._rightButtonClick = new Container();

        this.r_doorClick = new Graphics()
        .rect(this.rightX(), this.bY()-(20*Game.scale.y), btnSize[0], btnSize[1]*0.95).fill(0x00ff00);
        this.r_doorClick.alpha = 0.0;
        this.r_doorClick.eventMode = 'static';
        this.r_doorClick.onpointerdown = () => {
            if (canClick()) { Game.SOUNDS.doorError.play(); return; };
            this.__right_door();
            this.__updateRightSideButtons(); this.__updateLeftSideButtons();
        }

        this.r_lightClick = new Graphics()
        .rect(this.rightX(), this.bY2()+(7*Game.scale.y), btnSize[0], btnSize[1]).fill(0x00ff00);
        this.r_lightClick.alpha = 0.0;
        this.r_lightClick.eventMode = 'static';
        this. r_lightClick.onpointerdown = (event) => {
            event.hitAll = true;
            if (canClick()) { Game.SOUNDS.doorError.play(); return; };
            this.__right_light();
            this.__updateRightSideButtons(); this.__updateLeftSideButtons();
            this.__updateRightSideOffice();
        }

        this._rightButtonClick.addChild(this.rightButton)

        this.container = new Container(); this.container.addChild(this._leftButtonClick, this._rightButtonClick);
    }

    static __updateRightSideButtons() {
        if (Game.rightLightOn && Game.rightDoorOn) {
            this.rightButton.swapTexture('47.png');
        } else if (Game.rightLightOn) {
            this.rightButton.swapTexture('131.png');
        } else if (Game.rightDoorOn) {
            this.rightButton.swapTexture('135.png');
        } else {
            this.rightButton.swapTexture('134.png');
        }
    }

    static __updateRightSideOffice() {
        if (Game.rightLightOn) {
            if (Game.animatronics.chica.currentState === "ATDOOR") {
                Game.SOUNDS.windowscare.play();
                const random = Math.random()*100;
                if (random <= 6) {
                    if (!localStorage.getItem("Power_Easter_Egg")) localStorage.setItem("Power_Easter_Egg", true);
                    Office.sprite.swapTexture('127power.png');
                    Game.SOUNDS.powerscare.play();
                    return
                }
                Office.sprite.swapTexture('227.png');
            } else Office.sprite.swapTexture('127.png');
        } else Office.sprite.swapTexture('39.png');
    }

    static __updateLeftSideButtons() {
        if (Game.leftLightOn && Game.leftDoorOn) {
            this.leftButton.swapTexture('130.png');
        } else if (Game.leftLightOn) {
            this.leftButton.swapTexture('125.png');
        } else if (Game.leftDoorOn) {
            this.leftButton.swapTexture('124.png');
        } else {
            this.leftButton.swapTexture('122.png');
        }
    }

    static __updateLeftSideOffice() {
        if (Game.leftLightOn) {
            if (Game.animatronics.bonnie.currentState === "ATDOOR") {
                const random = Math.random()*100;
                if (random <= 10) {
                    Office.sprite.swapTexture('58goku.png');
                    Game.SOUNDS.gokuscare.play();
                    return;
                }
                Office.sprite.swapTexture('225.png'); // bonnie
                Game.SOUNDS.windowscare.play({});
            } else Office.sprite.swapTexture('58.png');
        } else Office.sprite.swapTexture('39.png');
    }


    static __right_light() {
        if (!Game.rightLightOn) {
            Game.powerUsage+=1;
            Game.rightLightOn = true;
            if (Game.leftLightOn) {
                Game.powerUsage-=1;
                Game.leftLightOn = false;
            }
            Game.SOUNDS.lightsHum.stop(); Game.SOUNDS.lightsHum.play();
        } else {
            Game.powerUsage-=1;
            Game.rightLightOn = false;
            Game.SOUNDS.lightsHum.stop();
        }
    }

    static __left_light() {
        if (!Game.leftLightOn) {
            Game.powerUsage+=1;
            Game.leftLightOn = true;
            if (Game.rightLightOn) {
                Game.powerUsage-=1;
                Game.rightLightOn = false;
            }
            Game.SOUNDS.lightsHum.stop(); Game.SOUNDS.lightsHum.play();
        } else {
            Game.powerUsage-=1;
            Game.leftLightOn = false;
            Game.SOUNDS.lightsHum.stop();
        }
    }

    static __left_door() {
        if (Doors.left.animations.open.playing || Doors.left.animations.close.playing) return;
        if (!Game.leftDoorOn) {
            Game.powerUsage += 1;
            Game.leftDoorOn = true;
            Doors.left.playAnimation('close');
            Game.SOUNDS.doorShut.play();
        } else {
            Game.powerUsage -= 1;
            Game.leftDoorOn = false
            Doors.left.playAnimation('open');
            Game.SOUNDS.doorShut.play();
        }
    }

    static __right_door() {
        if (Doors.right.animations.close.playing || Doors.right.animations.open.playing) return;
        if (!Game.rightDoorOn) {
            Game.powerUsage += 1;
            Game.rightDoorOn = true;
            Doors.right.playAnimation('close');
            Game.SOUNDS.doorShut.play();
        } else {
            Game.powerUsage -= 1;
            Game.rightDoorOn = false
            Doors.right.playAnimation('open');
            Game.SOUNDS.doorShut.play();
        }
    }
}