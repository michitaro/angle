import { sprintf } from 'sprintf-js'


export type V3 = [number, number, number]


export class Angle {
    rad: number

    private constructor(rad: number) {
        this.rad = rad
    }

    get deg() { return rad2deg(this.rad) }
    get amin() { return rad2amin(this.rad) }
    get asec() { return rad2asec(this.rad) }

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

    clone() {
        return new Angle(this.rad)
    }
}


export class EquatorialCoord {
    constructor(public a: Angle, public d: Angle) { }

    static parse(s: string) {
        const { a, d } = parseEquatorialCoord(s)
        return new EquatorialCoord(a, d)
    }

    get xyz(): V3 {
        const a = this.a.rad
        const d = this.d.rad
        const cosd = Math.cos(d)
        return [
            cosd * Math.cos(a),
            cosd * Math.sin(a),
            Math.sin(d)
        ]
    }

    static fromXyz([x, y, z]: V3) {
        const r2 = x * x + y * y
        if (r2 == 0) {
            return EquatorialCoord.fromRad(0, z > 0 ? Math.PI / 2 : -Math.PI / 2)
        }
        else {
            const PI2 = 2 * Math.PI
            const a = (Math.atan2(y, x) + PI2) % PI2
            const d = Math.atan2(z, Math.sqrt(r2))
            return EquatorialCoord.fromRad(a, d)
        }
    }

    static fromRad(a: number, d: number) {
        return new EquatorialCoord(Angle.fromRad(a), Angle.fromRad(d))
    }

    static fromDeg(a: number, d: number) {
        return new EquatorialCoord(Angle.fromDeg(a), Angle.fromDeg(d))
    }

    toString() {
        return {
            a: this.a.sexadecimal(15, false),
            d: this.d.sexadecimal(1, true),
        }
    }

    clone() {
        return new EquatorialCoord(this.a.clone(), this.d.clone())
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
    return 0.000004848136811 * asec
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

const PI2 = 2 * Math.PI

export function wrapTo2Pi(x: number) {
    if (x < 0)
        return PI2 - (-x % (PI2))
    else
        return x % PI2
}

function parseEquatorialCoord(s: string) {
    s = s.replace(/([\+\-])\s+(\d)/, '$1$2').replace(/\[\d+\]/g, '')
    const numbers = s.match(/(?:[\+\-]?[\d\.]+)/g)

    if (numbers == null || numbers.length < 2 || numbers.length % 2 != 0) {
        throw new Error(`invalid coord format: '${s}': numbers=${JSON.stringify(numbers)}`)
    }

    if (numbers.length == 2) {
        return EquatorialCoord.fromDeg(Number(numbers[0]), Number(numbers[1]))
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