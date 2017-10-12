System.register(["./TinyDecorations"], function (exports_1, context_1) {
    "use strict";
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
    var __moduleName = context_1 && context_1.id;
    function Dto(options) {
        if (options === void 0) { options = {}; }
        return function (ctor) {
            var cls = (function (_super) {
                __extends(GenericDtoImpl, _super);
                function GenericDtoImpl() {
                    var _this = _super.apply(this, [].slice.call(arguments).slice(0, arguments.length)) || this;
                    DtoUils.mapIt(_this, arguments[0], options);
                    TinyDecorations_1.executePostInit(_this, ctor);
                    return _this;
                }
                return GenericDtoImpl;
            }(ctor));
            return cls;
        };
    }
    exports_1("Dto", Dto);
    var TinyDecorations_1, ArrType, DtoUils;
    return {
        setters: [
            function (TinyDecorations_1_1) {
                TinyDecorations_1 = TinyDecorations_1_1;
            }
        ],
        execute: function () {
            ArrType = (function () {
                function ArrType(clazz) {
                    this.clazz = clazz;
                }
                return ArrType;
            }());
            exports_1("ArrType", ArrType);
            DtoUils = (function () {
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
        }
    };
});
//# sourceMappingURL=Dto.js.map