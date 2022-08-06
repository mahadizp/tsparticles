import { Attract } from "./Attract";
import { Bounce } from "./Bounce";
import { Bubble } from "./Bubble";
import { Connect } from "./Connect";
import { Grab } from "./Grab";
import type { IModes } from "../../../Interfaces/Interactivity/Modes/IModes";
import type { IOptionLoader } from "../../../Interfaces/IOptionLoader";
import { Push } from "./Push";
import type { RecursivePartial } from "../../../../Types/RecursivePartial";
import { Remove } from "./Remove";
import { Repulse } from "./Repulse";
import { Slow } from "./Slow";

/**
 * [[include:Options/Interactivity/Modes.md]]
 * @category Options
 */
export class Modes implements IModes, IOptionLoader<IModes> {
    attract;
    bounce;
    bubble;
    connect;
    grab;
    push;
    remove;
    repulse;
    slow;

    constructor() {
        this.attract = new Attract();
        this.bounce = new Bounce();
        this.bubble = new Bubble();
        this.connect = new Connect();
        this.grab = new Grab();
        this.push = new Push();
        this.remove = new Remove();
        this.repulse = new Repulse();
        this.slow = new Slow();
    }

    load(data?: RecursivePartial<IModes>): void {
        if (!data) {
            return;
        }

        this.attract.load(data.attract);
        this.bubble.load(data.bubble);
        this.connect.load(data.connect);
        this.grab.load(data.grab);
        this.push.load(data.push);
        this.remove.load(data.remove);
        this.repulse.load(data.repulse);
        this.slow.load(data.slow);
    }
}
