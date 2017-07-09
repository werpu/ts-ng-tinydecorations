

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

            var executed: boolean = false;
            RestService.myRequestEmbedded().then((data: any) => {
                expect(data.success).toEqual('response_done');
                executed = true;
            });
            $httpBackend.flush();
            expect(executed).toBe(true);
        }));


        it('should perform a basic get request  with url parameters', inject(function($httpBackend: IHttpBackendService, RestService: RestService) {
            //spec body
            expect(RestService).toBeDefined();
            let res: any = $httpBackend.expect("GET",'/standardGet/value1/value2')
                .respond({
                    success: 'response_done'
                });

            var executed: boolean = false;
            RestService.standardGetWithUrlParams("value1", "value2").then((data: any) => {
                expect(data.success).toEqual('response_done');
                executed = true;
            });
            $httpBackend.flush();
            expect(executed).toBe(true);
        }));

    });
});