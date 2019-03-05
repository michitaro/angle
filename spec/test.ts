import { Angle, EquatorialCoord } from "../src"
import assert = require('assert')


function equal(a: number, b: number) {
    return Math.abs(a / b - 1) <= 1.e-6 || Math.abs((a - 1) / (b - 1) - 1) <= 1.e-6
}

function deepEqual(a: number[], b: number[]) {
    return a.every((c, i) => equal(c, b[i]))
}

describe('Angle', () => {
    it('.fromRad(PI/4) == 45 degree', () => {
        assert(equal(Angle.fromRad(Math.PI / 4).deg, 45))
    })
    it('.fromAmin(60) == 1 deg', () => {
        assert(equal(Angle.fromAmin(60).deg, 1))
    })
    it('.fromAsec(1) == 1 / 3600 degree', () => {
        assert(equal(Angle.fromAsec(1).deg, 1 / 3600))
    })
    it('.fromDeg(1) == 60 arcmin', () => {
        assert(equal(Angle.fromDeg(1).amin, 60))
    })
    it('.fromDeg(1) == 3600 arcsec)', () => {
        assert(equal(Angle.fromDeg(1).asec, 3600))
    })
})

describe('EquatorialCoord#xyz', () => {
    it('returns unit vector', () => {
        assert(deepEqual(EquatorialCoord.fromDeg(0, 0).xyz, [1, 0, 0]))
        assert(deepEqual(EquatorialCoord.fromDeg(90, 0).xyz, [0, 1, 0]))
        assert(deepEqual(EquatorialCoord.fromDeg(90, 90).xyz, [0, 0, 1]))
        assert(deepEqual(EquatorialCoord.fromDeg(0, -45).xyz, [Math.SQRT1_2, 0, -Math.SQRT1_2]))
        assert(deepEqual(EquatorialCoord.fromDeg(-45, -45).xyz, [1 / 2, - 1 / 2, -Math.SQRT1_2]))
    })
})

describe('EquatorialCoord.fromXyz', () => {
    function eqEqual(eq: EquatorialCoord, a: Angle, d: Angle) {
        return deepEqual([eq.a.rad, eq.d.rad], [a.rad, d.rad])
    }

    it('returns EquatorialCoord', () => {
        assert(eqEqual(EquatorialCoord.fromXyz([1, 0, 0]), Angle.fromDeg(0), Angle.fromDeg(0)))
        assert(eqEqual(EquatorialCoord.fromXyz([0, 1, 0]), Angle.fromDeg(90), Angle.fromDeg(0)))
        assert(eqEqual(EquatorialCoord.fromXyz([0, 0, 1]), Angle.fromDeg(0), Angle.fromDeg(90)))
        assert(eqEqual(EquatorialCoord.fromXyz([Math.SQRT1_2, 0, -Math.SQRT1_2]), Angle.fromDeg(0), Angle.fromDeg(-45)))
        assert(eqEqual(EquatorialCoord.fromXyz([1 / 2, -1 / 2, -Math.SQRT1_2]), Angle.fromDeg(315), Angle.fromDeg(-45)))
    })
})


describe('EquatorialCoord.parse', () => {
    it('parses simple coord string', () => {
        const eq = EquatorialCoord.parse(`29 41`)
        assert(equal(eq.a.deg, 29))
        assert(equal(eq.d.deg, 41))
    })

    it('parses complex coord string such as `(RA, α) 09h 55m 33.17306s (Dec, δ) +69° 03′ 55.0610″`', () => {
        const eq = EquatorialCoord.parse(`(RA, α) 09h 55m 33.17306s (Dec, δ) +69° 03′ 55.0610″`)
        const { a, d } = eq.toString()
        assert(a == '09:55:33.1731')
        assert(d == '+69:03:55.0610')
    })

    it('parses coord string includings "floating-point expression" such as `173.92488824340327 7.471561224924194e-07`', () => {
        const s = `173.92488824340327 7.471561224924194e-07`
        const { a, d } = EquatorialCoord.parse(s)
        assert(equal(a.deg, 173.92488824340327))
        assert(equal(d.deg, 7.471561224924194e-07))
    })
})
