import { Application } from '../pixi.mjs';

(async () => {

    const app = new Application();

    await app.init({ background: "#000000", resizeTo: window });

    document.body.appendChild(app.canvas)

    app.ticker.add((delta) => {

    });
})();

document.querySelector("button[type='button']").addEventListener('click', (e) => {
    alert("you got gameed");
})
