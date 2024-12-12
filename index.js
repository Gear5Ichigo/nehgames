import { Application } from './pixi'

(async () => {

    const app = new Application();

    await app.init({ background: "#1099bb", resizeTo: window });

    alert(app);

    document.body.appendChild(app.canvas)

    app.ticker.add((delta) => {

    });
})();