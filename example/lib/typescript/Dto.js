/*
 Copyright 2017 Werner Punz

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is furnished
 to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.POST_INIT = "__post_init__";
    exports.POST_INIT_EXECUTED = "__post_init__exec__";
    function executePostConstruct(_instance, ctor) {
        if (ctor.prototype[exports.POST_INIT] && !ctor.prototype[exports.POST_INIT_EXECUTED]) {
            ctor.prototype[exports.POST_INIT_EXECUTED] = true;
            ctor.prototype[exports.POST_INIT].apply(_instance, arguments);
        }
    }
    exports.executePostConstruct = executePostConstruct;
    var ArrType = (function () {
        function ArrType(clazz) {
            this.clazz = clazz;
        }
        return ArrType;
    }());
    exports.ArrType = ArrType;
    function PostConstruct() {
        return function (target, propertyName, descriptor) {
            target[exports.POST_INIT] = target[propertyName];
        };
    }
    exports.PostConstruct = PostConstruct;
    function Dto(options) {
        if (options === void 0) { options = {}; }
        return function (ctor) {
            var cls = (function (_super) {
                __extends(GenericDtoImpl, _super);
                function GenericDtoImpl() {
                    var _this = _super.apply(this, [].slice.call(arguments).slice(0, arguments.length)) || this;
                    DtoUils.mapIt(_this, arguments[0], options);
                    executePostConstruct(_this, ctor);
                    return _this;
                }
                return GenericDtoImpl;
            }(ctor));
            return cls;
        };
    }
    exports.Dto = Dto;
    var DtoUils = (function () {
        function DtoUils() {
        }
        DtoUils.mapIt = function (target, src, mappings) {
            for (var key in src) {
                if (!src.hasOwnProperty(key)) {
                    continue;
                }
                var newVal = src[key];
                if (mappings[key] &&
                    mappings[key] instanceof ArrType) {
                    //do the array here
                    target[key] = {};
                    for (var key2 in newVal) {
                        var subTarget = new mappings[key].clazz(newVal[key2]);
                        //   subTarget = this.mapIt(subTarget, <any> newVal[key2]);
                        target[key][key2] = subTarget;
                    }
                }
                else if (mappings && mappings[key]) {
                    var subTarget = new mappings[key](newVal);
                    target[key] = subTarget;
                }
                else {
                    target[key] = newVal;
                }
            }
            return target;
        };
        return DtoUils;
    }());
});
//# sourceMappingURL=Dto.js.map