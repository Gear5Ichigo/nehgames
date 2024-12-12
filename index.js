import { Application } from './pixi'

(async () => {

    const app = new Application();

    await app.init({ background: "#000000", resizeTo: window });

    document.body.appendChild(app.canvas)

    app.ticker.add((delta) => {

    });
})();