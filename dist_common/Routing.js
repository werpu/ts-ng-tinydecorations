"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
function toCamelCase(tagName) {
    var splittedTagName = tagName.split("-");
    var camelCaseName = [];
    camelCaseName.push(splittedTagName[0]);
    for (var cnt = 1; cnt < splittedTagName.length; cnt++) {
        camelCaseName.push(splittedTagName[cnt].substr(0, 1).toUpperCase());
        camelCaseName.push(splittedTagName[cnt].substr(1, splittedTagName[cnt].length - 1));
    }
    return camelCaseName.join("");
}
var MetaData = /** @class */ (function () {
    function MetaData() {
    }
    MetaData.template = function (controller, template) {
        return controller.__template__ || template || "";
    };
    MetaData.controllerName = function (controller, defaults) {
        return controller.__name__ || toCamelCase(controller.__selector__ || "");
    };
    MetaData.controllerAs = function (controller, defaults) {
        if (defaults === void 0) { defaults = "ctrl"; }
        return controller.__controllerAs__ || defaults;
    };
    MetaData.templateUrl = function (controller, defaults) {
        if (defaults === void 0) { defaults = null; }
        return controller.__templateUrl__ || defaults;
    };
    MetaData.routeData = function (controller, overrides) {
        if (overrides === void 0) { overrides = {}; }
        var controllerMap = {
            template: MetaData.template(controller),
            controller: MetaData.controllerName(controller),
            controllerAs: MetaData.controllerAs(controller),
            templateUrl: MetaData.templateUrl(controller)
        };
        for (var key in overrides) {
            controllerMap[key] = overrides[key];
        }
        return controllerMap;
    };
    return MetaData;
}());
exports.MetaData = MetaData;
/**
 * helper to reduce the ui route code
 * @param $stateProvider
 * @param controller
 * @param name
 * @param url
 * @param security
 */
function route($stateProvider, controller, name, url, security, routes) {
    if (!controller.__controller__) {
        throw Error("controller is not an annotated controller");
    }
    var routeData = {
        url: url,
        template: MetaData.template(controller),
        controller: MetaData.controllerName(controller),
        controllerAs: MetaData.controllerAs(controller)
    };
    if (security) {
        routeData.security = security;
    }
    if (routes && routes.length) {
        //TODO generate the route json as well
    }
    var retVal = $stateProvider.state(name, routeData);
    retVal.route = function (controller, name, url, security) {
        return route(retVal, controller, name, url, security);
    };
    return retVal;
}
exports.route = route;
function uiRoute($routeProvider, controller, route) {
    $routeProvider.when(route, {
        template: MetaData.template(controller),
        controller: MetaData.controllerName(controller),
        controllerAs: MetaData.controllerAs(controller),
        templateUrl: MetaData.templateUrl(controller)
    });
}
exports.uiRoute = uiRoute;
//# sourceMappingURL=Routing.js.map