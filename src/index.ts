import { sprintf } from 'sprintf-js'


export class Angle {
    private _rad: number

    private constructor(rad: number) {
        this._rad = rad
    }

    get rad() { return this._rad }
    get deg() { return rad2deg(this._rad) }
    get amin() { return rad2amin(this._rad) }
    get asec() { return rad2asec(this._rad) }

    static fromRad(rad: number) { return new Angle(rad) }
    static fromDeg(deg: number) { return new Angle(deg2rad(deg)) }
    static fromAmin(amin: number) { return new Angle(amin2rad(amin)) }
    static fromAsec(asec: number) { return new Angle(asec2rad(asec)) }

    sexadecimal(hour2deg: number, showSign: boolean) {
        const totalSeconds = 3600 * this.deg / hour2deg
        const sign = showSign ? (totalSeconds < 0 ? '-' : '+') : ''
        const s = Math.abs(totalSeconds)
        return sprintf(`${sign}%02d:%02d:%07.4f`, Math.floor(s / 3600), Math.floor(s / 60 % 60), s % 60)
    }
}


export class EquatorialCoord {
    constructor(public a: Angle, public d: Angle) { }

    static parse(s: string) {
        const { a, d } = parseEquatorialCoord(s)
        return new EquatorialCoord(a, d)
    }

    toString() {
        return {
            a: this.a.sexadecimal(15, false),
            d: this.d.sexadecimal(1, true),
        }
    }
}


export function deg2rad(deg: number) {
    // return deg / 180 * Math.PI
    return 0.01745329252 * deg
}

export function amin2rad(amin: number) {
    // return arcmin / (60 * 180) * Math.PI
    return 0.0002908882087 * amin
}

export function asec2rad(asec: number) {
    // return arcsec / (3600 * 180) * Math.PI
    return 0.000004848136811
}

export function rad2deg(rad: number) {
    // return rad / Math.PI * 180
    return 57.2957795131 * rad
}

export function rad2amin(rad: number) {
    // return rad / Math.PI * 180 * 60
    return 3437.7467707849 * rad
}

export function rad2asec(rad: number) {
    // return rad / Math.PI * 180 * 3600
    return 206264.806247096 * rad
}


function parseEquatorialCoord(s: string) {
    s = s.replace(/([\+\-])\s+(\d)/, '$1$2')
    const numbers = s.match(/(?:[\+\-]?[\d\.]+)/g)

    if (numbers == null || numbers.length < 2 || numbers.length % 2 != 0) {
        throw new Error(`invalid coord format: '${s}': numbers=${JSON.stringify(numbers)}`)
    }

    return new EquatorialCoord(
        parseSexadecimal(numbers.slice(0, numbers.length / 2), 15),
        parseSexadecimal(numbers.slice(numbers.length / 2), 1),
    )
}


function parseSexadecimal(numbers: string[], hour2deg: number) {
    if (numbers.length == 0 || numbers.length > 3) {
        throw new Error(`invalid coord format: '${numbers.join(', ')}'`)
    }

    const hs = numbers[0]
    const m = numbers[1] != undefined ? Number(numbers[1]) : 0
    const s = numbers[2] != undefined ? Number(numbers[2]) : 0

    if (hs.substr(0, 1) == '-') {
        return Angle.fromDeg(- hour2deg * (s / 3600 + m / 60 + Number(hs.substr(1))))
    }
    else {
        return Angle.fromDeg(hour2deg * (s / 3600 + m / 60 + Number(hs)))
    }
}