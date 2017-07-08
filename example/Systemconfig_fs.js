System.config({
    paths: {
        "*": "*.js",
        "app/typescript/app": "example/app/typescript/app.js"
    },
    baseURL: '../',
    defaultExtension: ".js",
    defaultJSExtensions: "js",
    map: {
        angular: "example/node_modules/angular/angular",
        ngRoute: "example/node_modules/angular-route/angular-route",
        "angular-resource": "example/node_modules/angular-resource/angular-resource",
        TinyDecorations: "example/lib/typescript/TinyDecorations"
    }, meta: {
        "example/node_modules/angular/angular": {
            format: 'global',
            exports: 'angular'
        },
        "example/lib/typescript/TinyDecorations": {
            depends: ["angular"]
        }
    }
});