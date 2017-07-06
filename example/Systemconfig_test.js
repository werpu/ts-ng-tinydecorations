System.config({
    paths: {
        "*": "*.js",
        "app/typescript/app": "example/app/typescript/app.js",
        "example/lib/typescript/TinyDecorations": "example/lib/typescript/TinyDecorations.js"
    },
    baseURL: './',
    defaultExtension: ".js",
    defaultJSExtensions: "js",
    map: {
        angular: "../node_modules/angular/angular",
        ngRoute: "../node_modules/angular-route/angular-route",
        TinyDecorations: "lib/typescript/TinyDecorations"
    }, meta: {
        "../node_modules/angular/angular": {
            format: 'global',
            exports: 'angular'
        },
        "../example/lib/typescript/TinyDecorations": {
            depends: ["angular"],
            format:"cjs"
        }
    }
});