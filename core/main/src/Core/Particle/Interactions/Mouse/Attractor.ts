import type { Container } from "../../../Container";
import { ClickMode, HoverMode, OutMode } from "../../../../Enums";
import { Circle, Constants, Range, Utils } from "../../../../Utils";
import type { ICoordinates } from "../../../Interfaces/ICoordinates";
import type { IParticle } from "../../../Interfaces/IParticle";
import type { IExternalInteractor } from "../../../Interfaces/IExternalInteractor";

/**
 * Particle attract manager
 */
export class Attractor implements IExternalInteractor {
    constructor(private readonly container: Container) {
    }

    public isEnabled(): boolean {
        const container = this.container;
        const options = container.options;

        const mouse = container.interactivity.mouse;
        const events = options.interactivity.events;

        if (!((events.onHover.enable && mouse.position) || (events.onClick.enable && mouse.clickPosition))) {
            return false;
        }

        const hoverMode = events.onHover.mode;
        const clickMode = events.onClick.mode;

        return Utils.isInArray(HoverMode.attract, hoverMode) || Utils.isInArray(ClickMode.attract, clickMode);
    }

    public reset(): void {
        // do nothing
    }

    public interact(): void {
        const container = this.container;
        const options = container.options;
        const mouseMoveStatus = container.interactivity.status === Constants.mouseMoveEvent;
        const events = options.interactivity.events;
        const hoverEnabled = events.onHover.enable;
        const hoverMode = events.onHover.mode;
        const clickEnabled = events.onClick.enable;
        const clickMode = events.onClick.mode;

        if (mouseMoveStatus && hoverEnabled && Utils.isInArray(HoverMode.attract, hoverMode)) {
            this.hoverAttract();
        } else if (clickEnabled && Utils.isInArray(ClickMode.attract, clickMode)) {
            this.clickAttract();
        }
    }

    private hoverAttract(): void {
        const container = this.container;
        const mousePos = container.interactivity.mouse.position;

        if (!mousePos) {
            return;
        }

        const attractRadius = container.retina.attractModeDistance;

        this.processAttract(mousePos, attractRadius, new Circle(mousePos.x, mousePos.y, attractRadius));
    }

    private processAttract(position: ICoordinates, attractRadius: number, area: Range): void {
        const container = this.container;
        //const query = container.particles.spatialGrid.queryRadius(position, attractRadius);
        const query = container.particles.quadTree.query(area);

        for (const particle of query) {
            const { dx, dy, distance } = Utils.getDistances(particle.position, position);
            const normVec = {
                x: dx / distance,
                y: dy / distance,
            };

            const velocity = container.options.interactivity.modes.attract.speed * 100;
            const attractFactor = Utils.clamp((1 - Math.pow(distance / attractRadius, 2)) * velocity, 0, 50);
            const outMode = particle.particlesOptions.move.outMode;
            const sizeValue = particle.size.value;
            const pos = {
                x: particle.position.x - normVec.x * attractFactor,
                y: particle.position.y - normVec.y * attractFactor,
            };

            if (
                outMode === OutMode.bounce ||
                outMode === OutMode.bounceVertical ||
                outMode === OutMode.bounceHorizontal
            ) {
                const isInside = {
                    horizontal: pos.x - sizeValue > 0 && pos.x + sizeValue < container.canvas.size.width,
                    vertical: pos.y - sizeValue > 0 && pos.y + sizeValue < container.canvas.size.height,
                };

                if (outMode === OutMode.bounceVertical || isInside.horizontal) {
                    particle.position.x = pos.x;
                }

                if (outMode === OutMode.bounceHorizontal || isInside.vertical) {
                    particle.position.y = pos.y;
                }
            } else {
                particle.position.x = pos.x;
                particle.position.y = pos.y;
            }
        }
    }

    private clickAttract(): void {
        const container = this.container;

        if (!container.attract.finish) {
            if (!container.attract.count) {
                container.attract.count = 0;
            }

            container.attract.count++;

            if (container.attract.count === container.particles.count) {
                container.attract.finish = true;
            }
        }

        if (container.attract.clicking) {
            const attractDistance = container.retina.attractModeDistance;
            const attractRadius = Math.pow(attractDistance / 6, 3);
            const mouseClickPos = container.interactivity.mouse.clickPosition;

            if (mouseClickPos === undefined) {
                return;
            }

            //const query = container.particles.spatialGrid.queryRadius(mouseClickPos, attractRadius);
            const range = new Circle(mouseClickPos.x, mouseClickPos.y, attractRadius);
            const query = container.particles.quadTree.query(range);

            for (const particle of query) {
                const { dx, dy, distance } = Utils.getDistances(mouseClickPos, particle.position);
                const d = distance * distance;
                const velocity = container.options.interactivity.modes.attract.speed;
                const force = (-attractRadius * velocity) / d;

                if (d <= attractRadius) {
                    container.attract.particles.push(particle);
                    this.processClickAttract(particle, dx, dy, force);
                }
            }
        } else if (container.attract.clicking === false) {
            for (const particle of container.attract.particles) {
                particle.velocity.horizontal = particle.initialVelocity.horizontal;
                particle.velocity.vertical = particle.initialVelocity.vertical;
            }
            container.attract.particles = [];
        }
    }

    private processClickAttract(particle: IParticle, dx: number, dy: number, force: number): void {
        const container = this.container;
        const options = container.options;
        const f = Math.atan2(dy, dx);

        particle.velocity.horizontal = -force * Math.cos(f);
        particle.velocity.vertical = -force * Math.sin(f);

        const outMode = options.particles.move.outMode;

        if (outMode === OutMode.bounce || outMode === OutMode.bounceHorizontal || outMode === OutMode.bounceVertical) {
            const pos = {
                x: particle.position.x + particle.velocity.horizontal,
                y: particle.position.y + particle.velocity.vertical,
            };

            if (outMode !== OutMode.bounceVertical) {
                if (pos.x + particle.size.value > container.canvas.size.width || pos.x - particle.size.value < 0) {
                    particle.velocity.horizontal *= -1;
                }
            }

            if (outMode !== OutMode.bounceHorizontal) {
                if (pos.y + particle.size.value > container.canvas.size.height || pos.y - particle.size.value < 0) {
                    particle.velocity.vertical *= -1;
                }
            }
        }
    }
}
