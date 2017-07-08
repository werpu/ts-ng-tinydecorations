

import TinyDecorations = require("TinyDecorations");
import keepExternals = TinyDecorations.keepExternals;
import {IControllerService, IHttpBackendService} from "angular";

import {View1Module} from "../view1/View1Module";
import {RestService} from "../testAssets/RestService";
import {TestService} from "../view1/TestService";

keepExternals(View1Module);

declare var module: any;


describe('myApp module', function() {



    beforeEach(function () {

        module('myApp.view1'); //this line fixed it


    });

    describe('view1 controller', function(){

        it('should perform a basic get request without any parameters', inject(function($httpBackend: IHttpBackendService, RestService: RestService) {
            //spec body
            expect(RestService).toBeDefined();
            let res: any = $httpBackend.expectGET('/myRequest')
                .respond({
                    success: 'response_done'
            });

            RestService.myRequestEmbedded().then((data: any) => {
                console.debug(data);
                expect(data.success).toEqual('response_done');

            });
            /*
             beforeEach(function () {
             angular.mock.inject(function ($injector: IInjectorService) {
             $httpBackend = $injector.get('$httpBackend');
             mockRestService = $injector.get('RestService');
             });
             embeddedCalled1 = false;
             });


             it('a primitive rest test without any params', function () {
             $httpBackend.expectGET('/myRequest')
             .respond({
             success: 'response_done'
             });

             console.debug("bbogalink");
             mockRestService.getUser('test').then((theResult: any) => {
             expect(theResult.success).toEqual('response_done');
             });

             $httpBackend.flush();


             });
             */

        }));

    });
});