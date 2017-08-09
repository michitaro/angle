# Angle
Simple angle unit converter for TypeScript

## Install
```sh
npm install --save @hscmap/angle
```

## Example
```typescript
import { Angle, EquatorialCoord } from "@hscmap/angle"


function equal(a: number, b: number) {
    return Math.abs(a / b - 1) <= 1.e-6 || Math.abs((a - 1) / (b - 1) - 1) <= 1.e-6
}

function assertEqual(a: number, b: number) {
    console.assert(equal(a, b))
}


function assetArrayEqual(a: number[], b: number[]) {
    console.assert(a.every((c, i) => equal(c, b[i])))
}


assertEqual(Angle.fromRad(Math.PI / 4).deg, 45)
assertEqual(Angle.fromDeg(45).rad, Math.PI / 4)
assertEqual(Angle.fromAmin(60).deg, 1)
assertEqual(Angle.fromAsec(1).deg, 1 / 3600)
assertEqual(Angle.fromDeg(1).amin, 60)
assertEqual(Angle.fromDeg(1).asec, 3600)


!(function eq2xyz() {
    assetArrayEqual(EquatorialCoord.fromDeg(0, 0).xyz, [1, 0, 0])
    assetArrayEqual(EquatorialCoord.fromDeg(90, 0).xyz, [0, 1, 0])
    assetArrayEqual(EquatorialCoord.fromDeg(90, 90).xyz, [0, 0, 1])
    assetArrayEqual(EquatorialCoord.fromDeg(0, -45).xyz, [Math.SQRT1_2, 0, -Math.SQRT1_2])
    assetArrayEqual(EquatorialCoord.fromDeg(-45, -45).xyz, [1 / 2, - 1 / 2, -Math.SQRT1_2])
})()


!(function xyz2eq() {
    function assertADEqual(eq: EquatorialCoord, a: Angle, d: Angle) {
        assetArrayEqual([eq.a.rad, eq.d.rad], [a.rad, d.rad])
    }

    assertADEqual(EquatorialCoord.fromXyz([1, 0, 0]), Angle.fromDeg(0), Angle.fromDeg(0))
    assertADEqual(EquatorialCoord.fromXyz([0, 1, 0]), Angle.fromDeg(90), Angle.fromDeg(0))
    assertADEqual(EquatorialCoord.fromXyz([0, 0, 1]), Angle.fromDeg(0), Angle.fromDeg(90))
    assertADEqual(EquatorialCoord.fromXyz([Math.SQRT1_2, 0, -Math.SQRT1_2]), Angle.fromDeg(0), Angle.fromDeg(-45))
    assertADEqual(EquatorialCoord.fromXyz([1/2, -1/2, -Math.SQRT1_2]), Angle.fromDeg(315), Angle.fromDeg(-45))
})()


!(function simple_coord_parse() {
    const eq = EquatorialCoord.parse(`29 41`)
    assertEqual(eq.a.deg, 29)
    assertEqual(eq.d.deg, 41)
})()


!(function m81_coord_parse() {
    const eq = EquatorialCoord.parse(`(RA, α) 09h 55m 33.17306s (Dec, δ) +69° 03′ 55.0610″`)
    assertEqual(eq.a.deg, 148.88822108386302)
    assertEqual(eq.d.deg, 69.06529472246791)
})()


!(function m81_coord_unparse() {
    const eq = EquatorialCoord.parse(`(RA, α) 09h 55m 33.17306s (Dec, δ) +69° 03′ 55.0610″`)
    const { a, d } = eq.toString()
    console.assert(a == '09:55:33.1731')
    console.assert(d == '+69:03:55.0610')
})()
```
