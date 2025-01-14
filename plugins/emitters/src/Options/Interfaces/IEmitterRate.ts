/**
 * The particles emitter rate options
 */
import type { RangeValue } from "tsparticles-engine";

export interface IEmitterRate {
    /**
     * The emitting velocity, how many seconds will pass between the next particles creation
     * Decimal values allowed
     */
    delay: RangeValue;

    /**
     * The emitting quantity, how many particles will be created at every creation event
     */
    quantity: RangeValue;
}
