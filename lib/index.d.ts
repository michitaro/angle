export declare type V3 = [number, number, number];
export declare class Angle {
    private _rad;
    private constructor();
    readonly rad: number;
    readonly deg: number;
    readonly amin: number;
    readonly asec: number;
    static fromRad(rad: number): Angle;
    static fromDeg(deg: number): Angle;
    static fromAmin(amin: number): Angle;
    static fromAsec(asec: number): Angle;
    sexadecimal(hour2deg: number, showSign: boolean): string;
}
export declare class EquatorialCoord {
    a: Angle;
    d: Angle;
    constructor(a: Angle, d: Angle);
    static parse(s: string): EquatorialCoord;
    readonly xyz: V3;
    static fromXyz([x, y, z]: V3): EquatorialCoord;
    static fromRad(a: number, d: number): EquatorialCoord;
    static fromDeg(a: number, d: number): EquatorialCoord;
    toString(): {
        a: string;
        d: string;
    };
}
export declare function deg2rad(deg: number): number;
export declare function amin2rad(amin: number): number;
export declare function asec2rad(asec: number): number;
export declare function rad2deg(rad: number): number;
export declare function rad2amin(rad: number): number;
export declare function rad2asec(rad: number): number;
