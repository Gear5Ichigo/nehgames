import { Application } from '../pixi.mjs';

(async () => {

    const app = new Application();
    let keys = {}

    await app.init({ background: "#000000", resizeTo: window });

    document.body.appendChild(app.canvas)

    window.addEventListener("keydown", (e) => {
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
