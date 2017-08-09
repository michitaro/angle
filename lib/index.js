"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sprintf_js_1 = require("sprintf-js");
var Angle = (function () {
    function Angle(rad) {
        this._rad = rad;
    }
    Object.defineProperty(Angle.prototype, "rad", {
        get: function () { return this._rad; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Angle.prototype, "deg", {
        get: function () { return rad2deg(this._rad); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Angle.prototype, "amin", {
        get: function () { return rad2amin(this._rad); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Angle.prototype, "asec", {
        get: function () { return rad2asec(this._rad); },
        enumerable: true,
        configurable: true
    });
    Angle.fromRad = function (rad) { return new Angle(rad); };
    Angle.fromDeg = function (deg) { return new Angle(deg2rad(deg)); };
    Angle.fromAmin = function (amin) { return new Angle(amin2rad(amin)); };
    Angle.fromAsec = function (asec) { return new Angle(asec2rad(asec)); };
    Angle.prototype.sexadecimal = function (hour2deg, showSign) {
        var totalSeconds = 3600 * this.deg / hour2deg;
        var sign = showSign ? (totalSeconds < 0 ? '-' : '+') : '';
        var s = Math.abs(totalSeconds);
        return sprintf_js_1.sprintf(sign + "%02d:%02d:%07.4f", Math.floor(s / 3600), Math.floor(s / 60 % 60), s % 60);
    };
    return Angle;
}());
exports.Angle = Angle;
var EquatorialCoord = (function () {
    function EquatorialCoord(a, d) {
        this.a = a;
        this.d = d;
    }
    EquatorialCoord.parse = function (s) {
        var _a = parseEquatorialCoord(s), a = _a.a, d = _a.d;
        return new EquatorialCoord(a, d);
    };
    Object.defineProperty(EquatorialCoord.prototype, "xyz", {
        get: function () {
            var a = this.a.rad;
            var d = this.d.rad;
            var cosd = Math.cos(d);
            return [
                cosd * Math.cos(a),
                cosd * Math.sin(a),
                Math.sin(d)
            ];
        },
        enumerable: true,
        configurable: true
    });
    EquatorialCoord.fromXyz = function (_a) {
        var x = _a[0], y = _a[1], z = _a[2];
        var r2 = x * x + y * y;
        if (r2 == 0) {
            return EquatorialCoord.fromRad(0, z > 0 ? Math.PI / 2 : -Math.PI / 2);
        }
        else {
            var PI2 = 2 * Math.PI;
            var a = (Math.atan2(y, x) + PI2) % PI2;
            var d = Math.atan2(z, Math.sqrt(r2));
            return EquatorialCoord.fromRad(a, d);
        }
    };
    EquatorialCoord.fromRad = function (a, d) {
        return new EquatorialCoord(Angle.fromRad(a), Angle.fromRad(d));
    };
    EquatorialCoord.fromDeg = function (a, d) {
        return new EquatorialCoord(Angle.fromDeg(a), Angle.fromDeg(d));
    };
    EquatorialCoord.prototype.toString = function () {
        return {
            a: this.a.sexadecimal(15, false),
            d: this.d.sexadecimal(1, true),
        };
    };
    return EquatorialCoord;
}());
exports.EquatorialCoord = EquatorialCoord;
function deg2rad(deg) {
    // return deg / 180 * Math.PI
    return 0.01745329252 * deg;
}
exports.deg2rad = deg2rad;
function amin2rad(amin) {
    // return arcmin / (60 * 180) * Math.PI
    return 0.0002908882087 * amin;
}
exports.amin2rad = amin2rad;
function asec2rad(asec) {
    // return arcsec / (3600 * 180) * Math.PI
    return 0.000004848136811;
}
exports.asec2rad = asec2rad;
function rad2deg(rad) {
    // return rad / Math.PI * 180
    return 57.2957795131 * rad;
}
exports.rad2deg = rad2deg;
function rad2amin(rad) {
    // return rad / Math.PI * 180 * 60
    return 3437.7467707849 * rad;
}
exports.rad2amin = rad2amin;
function rad2asec(rad) {
    // return rad / Math.PI * 180 * 3600
    return 206264.806247096 * rad;
}
exports.rad2asec = rad2asec;
function parseEquatorialCoord(s) {
    s = s.replace(/([\+\-])\s+(\d)/, '$1$2');
    var numbers = s.match(/(?:[\+\-]?[\d\.]+)/g);
    if (numbers == null || numbers.length < 2 || numbers.length % 2 != 0) {
        throw new Error("invalid coord format: '" + s + "': numbers=" + JSON.stringify(numbers));
    }
    if (numbers.length == 2) {
        return EquatorialCoord.fromDeg(Number(numbers[0]), Number(numbers[1]));
    }
    return new EquatorialCoord(parseSexadecimal(numbers.slice(0, numbers.length / 2), 15), parseSexadecimal(numbers.slice(numbers.length / 2), 1));
}
function parseSexadecimal(numbers, hour2deg) {
    if (numbers.length == 0 || numbers.length > 3) {
        throw new Error("invalid coord format: '" + numbers.join(', ') + "'");
    }
    var hs = numbers[0];
    var m = numbers[1] != undefined ? Number(numbers[1]) : 0;
    var s = numbers[2] != undefined ? Number(numbers[2]) : 0;
    if (hs.substr(0, 1) == '-') {
        return Angle.fromDeg(-hour2deg * (s / 3600 + m / 60 + Number(hs.substr(1))));
    }
    else {
        return Angle.fromDeg(hour2deg * (s / 3600 + m / 60 + Number(hs)));
    }
}
