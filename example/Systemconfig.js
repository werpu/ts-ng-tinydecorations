System.config({
    paths: {
        "*": "*.js",
        "app/typescript/app": "example/app/typescript/app.js"
    },
    baseURL: '../',
    defaultExtension: ".js",
    defaultJSExtensions: "js",
    map: {
        angular: "node_modules/angular/angular",
        ngRoute: "node_modules/angular-route/angular-route",
        TinyDecorations: "example/lib/typescript/TinyDecorations"
    }, meta: {
        "node_modules/angular/angular": {
            format: 'global',
            exports: 'angular'
        },
        "dist/TinyDecorations": {
            depends: ["angular"],
            format:"cjs"
        }
    }
});