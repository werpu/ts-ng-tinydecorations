//jshint strict: false
module.exports = function (config) {
    config.set({


        basePath : 'example',

        files : [
            '../node_modules/angular/angular.js',
            '../node_modules/angular-route/angular-route.js',
        //    '../node_modules/angular-mocks/angular-mocks.js',
            'example/**/*_test.js'
        ],

        autoWatch : true,

        frameworks: ['systemjs','jasmine'],

        browsers : ['Chrome'],

        plugins : [
            'karma-systemjs',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',

            'karma-junit-reporter'
        ],

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },

        systemjs: {

            // Point out where the SystemJS config file is
            configFile: 'Systemconfig.js',

            includeFiles : [
                '../node_modules/angular/angular.js',
                '../node_modules/angular-mocks/angular-mocks.js',
                '../node_modules/angular-route/angular-route.js'
            ],

            serveFiles: [
                '**/*.js'
            ],

            // Add any additional configuration, such as mappings to modules only used in testing
            config: {
                paths: {
                    'angular-mocks': '../node_modules/angular-mocks/angular-mocks.js',
                    'angular-route': '../node_modules/angular-route/angular-route.js',
                    'traceur': '../node_modules/traceur/bin/traceur.js',
                    'systemjs': '../node_modules/systemjs/dist/system.js',
                    "ngRoute": '../node_modules/angular-mocks/angular-route.js'
                }
            },
            testFileSuffix: "_test.js"
        }



    });
};
