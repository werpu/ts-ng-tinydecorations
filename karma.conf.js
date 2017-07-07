//jshint strict: false
module.exports = function (config) {
    config.set({


        basePath : 'example',


        files : [
            '**/*_test.js'
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
                'node_modules/angular/angular.js',
                'node_modules/angular-route/angular-route.js',
                'node_modules/angular-mocks/angular-mocks.js'
            ],

            serveFiles: [
                '**/*.js'
            ],

            testFileSuffix: "_test.js"
        }



    });
};
