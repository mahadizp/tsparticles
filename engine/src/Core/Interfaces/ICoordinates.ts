import type { RangeValue } from "../../Types/RangeValue";
import type { SizeMode } from "../../Enums/Modes/SizeMode";

export interface ICoordinates {
    x: number;
    y: number;
}

export interface ICoordinates3d extends ICoordinates {
    z: number;
}

export interface IRangedCoordinates {
    x: RangeValue;
    y: RangeValue;
}

export interface IRangedCoordinates3d extends IRangedCoordinates {
    z: RangeValue;
}

export interface ICoordinatesWithMode extends ICoordinates {
    mode: SizeMode | keyof typeof SizeMode;
}

export interface ICenterCoordinates extends ICoordinatesWithMode {
    radius: number;
}
