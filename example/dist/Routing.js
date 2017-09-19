System.register(["./TinyDecorations"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
            template: TinyDecorations_1.MetaData.template(controller),
            controller: TinyDecorations_1.MetaData.controllerName(controller),
            controllerAs: TinyDecorations_1.MetaData.controllerAs(controller)
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
            template: TinyDecorations_1.MetaData.template(controller),
            controller: TinyDecorations_1.MetaData.controllerName(controller),
            controllerAs: TinyDecorations_1.MetaData.controllerAs(controller),
            templateUrl: TinyDecorations_1.MetaData.templateUrl(controller)
        });
    }
    exports_1("uiRoute", uiRoute);
    var TinyDecorations_1;
    return {
        setters: [
            function (TinyDecorations_1_1) {
                TinyDecorations_1 = TinyDecorations_1_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=Routing.js.map