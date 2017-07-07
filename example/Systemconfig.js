System.config({
    paths: {
        "*": "*.js",
        "app/typescript/app": "app/typescript/app.js"
    },
    baseURL: './',
    defaultExtension: ".js",
    defaultJSExtensions: "js",
    map: {
        angular: "node_modules/angular/angular",
        ngRoute: "node_modules/angular-route/angular-route",
        TinyDecorations: "lib/typescript/TinyDecorations"
    }, meta: {
        "node_modules/angular/angular": {
            format: 'global',
            exports: 'angular'
        },
        "lib/typescript/TinyDecorations": {
            depends: ["angular"]
        }
    }
});