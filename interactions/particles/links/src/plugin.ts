import type { Engine, IPlugin } from "tsparticles-engine";
import type { LinkContainer } from "./Types";
import { LinkInstance } from "./LinkInstance";

class LinksPlugin implements IPlugin {
    readonly id;

    constructor() {
        this.id = "links";
    }

    getPlugin(container: LinkContainer): LinkInstance {
        return new LinkInstance(container);
    }

    loadOptions(): void {
        // do nothing
    }

    needsPlugin(): boolean {
        return true;
    }
}

/**
 * @param engine -
 */
export async function loadPlugin(engine: Engine): Promise<void> {
    const plugin = new LinksPlugin();

    await engine.addPlugin(plugin);
}
