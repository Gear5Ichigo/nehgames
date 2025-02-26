import { Assets, Sprite } from "../../public/pixi.min.mjs";
import Cams from "./cams.mjs";
import Game from "./game.mjs";
import OfficeButtons from "./officebuttons.mjs";
import SpriteLoader from "./spriteloader.mjs";
import Jumpscares from "./jumpscares.mjs";
import Office from "./office.mjs";

export default class CameraTablet {
    static async init() {

        this.camFlipButton = new Sprite(await Assets.load('./assets/sprites/420.png'));
        this.camFlipButton.anchor = 0.5;
        this.camFlipButton.eventMode = 'static';
        this.camFlipButton.resize = () => {
            this.camFlipButton.scale.set(Game.scale.x*1.25, Game.scale.y);
            this.camFlipButton.position.set(innerWidth/2-(50*Game.scale.x), Cams.cameraBorder.height-this.camFlipButton.height+(42*Game.scale.y));
        }; this.camFlipButton.resize();

        this.tablet = await SpriteLoader.AnimatedSprite('/camflip/camflip', (animSprite) => {
            animSprite.setSize(innerWidth, innerHeight);
            animSprite.animationSpeed = 0.6;
            animSprite.loop = false;
            animSprite.visible = false;
        });

        this.tablet.animations.flip.onComplete = () => {
            if (Game.animatronics.bonnie.currentState==="OFFICE" || Game.animatronics.chica.currentState==="OFFICE" || Game.animatronics.freddy.currentState==="OFFICE") {
                if (Game.win) return;
                Game.die = true;
                if (Game.animatronics.freddy.currentState==="OFFICE") {
                    Jumpscares.freddyScare.visible = true;
                    Jumpscares.freddyScare.gotoAndPlay(0);
                } else if (Game.animatronics.bonnie.currentState==="OFFICE") {
                    Jumpscares.bonnieScare.visible = true;
                    Jumpscares.bonnieScare.gotoAndPlay(0);
                } else if (Game.animatronics.chica.currentState==="OFFICE") {
                    Jumpscares.chicaScare.visible = true;
                    Jumpscares.chicaScare.gotoAndPlay(0);
                }
                Game.SOUNDS.jumpscare.play();
                setTimeout(() => {
                    Game.forceGameOver()
                }, 660);
            }
            Game.officeRender.visible = false
            Game.cameraRender.visible = true

            Cams.blipFlash1.gotoAndPlay(0); Cams.blipFlash1.visible = true;
            
            Game.SOUNDS.cams.play();
            if (Game.leftLightOn || Game.rightLightOn) {
                Game.rightLightOn = false;
                Game.leftLightOn = false;
                Game.powerUsage-=1;
                OfficeButtons.__updateLeftSideOffice(); OfficeButtons.__updateRightSideOffice();
                OfficeButtons.__updateLeftSideButtons(); OfficeButtons.__updateRightSideButtons();
                Game.SOUNDS.lightsHum.stop();
            };
        };

        this.tablet.animations.reverseFlip.onComplete = () => this.tablet.animations.reverseFlip.visible = false;

        //

        this.camFlipButton.onpointerenter = () => {if (!Game.powerDown) this.flip()};

        this.camFlipButton.onpointerleave = () => {};
    }

    static flip() {
        if (Game.die) return;
        if (this.tablet.animations.flip.playing || this.tablet.animations.reverseFlip.playing ) return;
        Game.SOUNDS.camFlip.play({});
        Office._moveRight = false; Office._innerMoveRight = false;
        Office._moveLeft = false; Office._innerMoveRight = false;
        if (!Game.camUp) {
            Game.camUp = true;
            Game.powerUsage+=1;
            this.tablet.animations.flip.visible = true;
            this.tablet.playAnimation('flip');
        } else {
            Game.powerUsage-=1;
            Game.camUp = false;
            Game.officeRender.visible = true;
            this.tablet.animations.flip.visible = false;
            this.tablet.animations.reverseFlip.visible = false;
            this.tablet.playAnimation('reverseFlip');
            Game.SOUNDS.cams.stop();
            Game.SOUNDS.camError1.stop();

            Game.cameraRender.visible = false;
        }
    }
}