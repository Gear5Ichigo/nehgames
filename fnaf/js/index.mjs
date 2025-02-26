import { Sound } from '../../public/pixi-sound.mjs';
import { Application, Assets, Container, Graphics, Text } from '../../public/pixi.min.mjs';
import * as PIXI from '../../public/pixi.min.mjs';
import CameraTablet from './cameratablet.mjs';
import Cams from './cams.mjs';
import Doors from './doors.mjs';
import './game.mjs';
import Game from './game.mjs';
import Menus from './menus.mjs';
import Office from './office.mjs';
import OfficeButtons from './officebuttons.mjs';

(async () => {

    //

    const app = new Application();
    await app.init({ background: "#000000", resizeTo: window });

    Assets.addBundle('fonts', [
        {alias: 'Press Start', src: './assets/fonts/PrStart.ttf'},
        {alias: 'Volter', src: './assets/fonts/Volter__28Goldfish_29.ttf', data: { family: "Volter" }},
        {alias: 'fnaf', src: './assets/fonts/five-nights-at-freddys.ttf', data: { family: "FNAF" }}
    ]); await Assets.loadBundle('fonts');

    app.setRenderState = (render, state) => {
        render.children.forEach(element => {
            if (element !== state) {
                element.visible = false;
            } else element.visible = true;
        });
    }

    await Game.init(app);
    await Menus.init(app);

    const saveme = Sound.from('./assets/sounds/snd_save.wav');

    window.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === "f" && Game._gameActive) {
            Game.forceGameOver();
            saveme.play();
        }
    })

    window.onresize = (event) => {
        Game.scale = {x: innerWidth/1600, y: innerHeight/720};

        Game.__ofC.filters = [new PIXI.Filter({
            glProgram: new PIXI.GlProgram({
                vertex: Game.vert, fragment: Game.frag
            }),
            resources: {
                timeUniforms: {
                    uScaleX: {value: Game.scale.x, type: 'f32'},
                    uScaleY: {value: Game.scale.y, type: 'f32'}
                }
            }
        })];

        Office.sprite.width = innerWidth*Office.scale; Office.sprite.height = innerHeight;
        Office.sprite.position.set(innerWidth/2, innerHeight/2);
        Office.margin = (Office.sprite.width-Office.sprite.width/Office.scale)/2;

        Game.officeContainer.x = 0;

        Office.fanAnim.forEach(([key, anim]) => Office.fanResize(anim));
        Office.freddyBoop.setSize(10*Game.scale.x, 10*Game.scale.y);
        Office.freddyBoop.x *= Game.scale.x;
        Office.plushiesResize();
        Office.movementResize();

        Doors.left.forEach(([key, anim]) => Doors.resize(anim));
        Doors.right.forEach(([key, anim]) => Doors.resize(anim));
        Doors.left.position.set(-Office.margin+(Doors.leftXOffset*Game.scale.x*Office.scale), 0*Game.scale.y);
        Doors.right.position.set(Doors.rightX(), 0*Game.scale.y);

        OfficeButtons.rightButton.resize();
        OfficeButtons.leftButton.resize();

        const btnSize = OfficeButtons.calcBtnSize();
        
        OfficeButtons.l_doorClick.setSize(btnSize[0], btnSize[1]);
        OfficeButtons.l_lightClick.setSize(btnSize[0], btnSize[1]);
        OfficeButtons.l_doorClick.position.set(OfficeButtons.leftX(), OfficeButtons.bY());
        OfficeButtons.l_lightClick.position.set(OfficeButtons.leftX(), OfficeButtons.bY2());

        OfficeButtons.r_doorClick.setSize(btnSize[0], btnSize[1]);
        OfficeButtons.r_lightClick.setSize(btnSize[0], btnSize[1]);

        Cams.resize();
        CameraTablet.camFlipButton.resize();
        CameraTablet.tablet.forEach(([key, anim]) => anim.setSize(innerWidth, innerHeight));

        Game._clockText.style.fontSize = 30*(Game.scale.x*2);
        Game.powerLevelDisplay.style.fontSize = 30*(Game.scale.x*2);
        Game.usageDisplay.style.fontSize = 30*(Game.scale.x*2);
        Game.textsResize();
        Game.resizeUsageBars();

        //

        Menus.resize();
        
    }
    

    //**
    // program here 
    // */

    app.stage.addChild(Game.render, Menus.week1);
    app.setRenderState(app.stage, Menus.week1);

    app.canvas.style.display = "block";
    document.body.appendChild(app.canvas)

    app.ticker.maxFPS = 60;
    app.ticker.add((ticker) => {
        if (Game.render.visible) {
            Game.updateLoop(ticker);
            if (!Game._gameActive) {
                app.setRenderState(app.stage, Menus.week1);
                app.setRenderState(Menus.week1, Menus.titleScreen);
                Menus.resetMenu(app);
            }
        }
        Menus.updateLoop(ticker);
    });
})();
