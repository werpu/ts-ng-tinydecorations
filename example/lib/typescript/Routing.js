System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
    exports_1("route", route);
    function uiRoute($routeProvider, controller, route) {
        $routeProvider.when(route, {
            template: MetaData.template(controller),
            controller: MetaData.controllerName(controller),
            controllerAs: MetaData.controllerAs(controller),
            templateUrl: MetaData.templateUrl(controller)
        });
    }
    exports_1("uiRoute", uiRoute);
    var MetaData;
    return {
        setters: [],
        execute: function () {
            MetaData = (function () {
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
            exports_1("MetaData", MetaData);
        }
    };
});
//# sourceMappingURL=Routing.js.map