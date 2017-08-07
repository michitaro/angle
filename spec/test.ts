import { Angle, EquatorialCoord } from "../src"


function equal(a: number, b: number) {
    return Math.abs(a / b - 1) <= 1.e-6 || Math.abs((a - 1) / (b - 1) - 1) <= 1.e-6
}

function assertEqual(a: number, b: number) {
    console.assert(equal(a, b))
}


assertEqual(Angle.fromRad(Math.PI / 4).deg, 45)
assertEqual(Angle.fromDeg(45).rad, Math.PI / 4)
assertEqual(Angle.fromAmin(60).deg, 1)
assertEqual(Angle.fromAsec(1).deg, 1 / 3600)
assertEqual(Angle.fromDeg(1).amin, 60)
assertEqual(Angle.fromDeg(1).asec, 3600)


!(function m81_coord_parse() {
    const eq = EquatorialCoord.parse(`赤経 (RA, α) 09h 55m 33.17306s 赤緯 (Dec, δ) +69° 03′ 55.0610″`)
    assertEqual(eq.a.deg, 148.88822108386302)
    assertEqual(eq.d.deg, 69.06529472246791)
})()


!(function m81_coord_unparse() {
    const eq = EquatorialCoord.parse(`赤経 (RA, α) 09h 55m 33.17306s 赤緯 (Dec, δ) +69° 03′ 55.0610″`)
    const { a, d } = eq.toString()
    console.assert(a == '09:55:33.1731')
    console.assert(d == '+69:03:55.0610')
})()