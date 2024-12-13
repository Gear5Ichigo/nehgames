import { Application, Text } from '../pixi.mjs';

(async () => {

    const app = new Application();
    let keys = {}

    await app.init({ background: "#000000", resizeTo: window });

    //**
    // program here 
    // */

    const title = new Text({
        text: "FNAF",
        fill: "0xffffff",
        align: "center",
    });
    title.anchor = 0.5;
    title.x = 250; title.y = 330;

    app.stage.addChild(title);

    document.body.appendChild(app.canvas)

    window.addEventListener("keydown", (e) => {
        console.log(e.key.toLowerCase());
        keys[e.key.toLowerCase()] = true;
    });
    window.addEventListener("keyup", (e) => {
        keys[e.key.toLowerCase()] = false;
    })

    app.ticker.add((delta) => {
        if ( keys["w"] ) {
            console.log("moving");
        }
    });
})();
