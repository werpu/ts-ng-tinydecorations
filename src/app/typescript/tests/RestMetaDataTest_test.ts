import TinyDecorations = require("TinyDecorations");
import keepExternals = TinyDecorations.keepExternals;
import {IControllerService, IHttpBackendService} from "angular";

import {View1Module} from "../view1/View1Module";
import {RestService} from "../testAssets/RestService";
import {TestService} from "../view1/TestService";
import {RestService2} from "../testAssets/RestService2";
import {RestService3} from "../testAssets/RestService3";
import {extended} from "TinyDecorations";
import DefaultRestMetaData = extended.DefaultRestMetaData;
import {RestService4} from "../testAssets/RestService4";


keepExternals(View1Module);

declare var module: any;


DefaultRestMetaData.decorator = function (responseData: any) {
    (<any>this).__decoratorcalled__ = true;
    return responseData.$promise;
};


describe('myApp module', function () {

    beforeEach(function () {
        module('myApp.view1'); //this line fixed it
    });

    describe("Subset Suite", function () {
        describe('view1 controller', function () {

            it('it should have a decorated request2', inject(function ($httpBackend: IHttpBackendService, RestService3: RestService3, RestService2: RestService2) {
                //spec body
                expect(RestService3).toBeDefined();
                expect(RestService3.decoratedRequest).toBeDefined();

                let res: any = $httpBackend.expectGET('rootUrl/myRequest')
                    .respond({
                        success: 'response_done'
                    });

                var executed: boolean = false;
                //RestService3.alterRestMeta();

                RestService3.decoratedRequest().then((data: any) => {
                    expect(data.success).toEqual('response_done');
                    executed = true;
                });
                $httpBackend.flush();
                expect(executed).toBe(true);
                expect(RestService3.__decoratorcalled__).toBe(true);
            }));

            it('it should have a decorated request', inject(function ($httpBackend: IHttpBackendService, RestService4: RestService4) {
                //spec body
                expect(RestService4).toBeDefined();
                expect(RestService4.decoratedRequest).toBeDefined();

                let res: any = $httpBackend.expectGET('rootUrl/myRequest')
                    .respond({
                        success: 'response_done'
                    });

                var executed: boolean = false;

                RestService4.decoratedRequest().then((data: any) => {
                    expect(data.success).toEqual('response_done');
                    executed = true;
                });
                $httpBackend.flush();
                expect(executed).toBe(true);
                expect(RestService4.__decoratorcalled2__).toBe(true);
            }));

        });
    });

});