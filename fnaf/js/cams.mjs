import { Assets, Spritesheet, Sprite } from '../../pixi.mjs';

export default class Cams {
    static async init() {
        const camsjson = await Assets.load('./assets/sprites/cams/');
    }
}