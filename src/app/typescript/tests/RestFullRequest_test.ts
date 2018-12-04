import TinyDecorations = require("TinyDecorations");
import keepExternals = TinyDecorations.keepExternals;
import {IControllerService, IHttpBackendService} from "angular";

import {View1Module} from "../view1/View1Module";
import {RestService} from "../testAssets/RestService";
import {TestService} from "../view1/TestService";
import {RestService2} from "../testAssets/RestService2";
import {RestService5} from "../testAssets/RestService5";
import {CacheService, STANDARD_CACHE_KEY} from "../testAssets/CacheService";

import {CacheConfigOptions, systemCache} from "Cache";


keepExternals(View1Module);

declare var module: any;


describe('myApp module', function () {

    beforeEach(function () {
        module('myApp.view1'); //this line fixed it
    });

    describe("Subset Suite", function () {
        describe('view1 controller', function () {

            it('should perform a basic get request without any parameters', inject(function ($httpBackend: IHttpBackendService, RestService: RestService, RestService2: RestService2) {
                //spec body
                expect(RestService).toBeDefined();
                expect(RestService.testService2).toBeDefined();

                let res: any = $httpBackend.expectGET('rootUrl/myRequest')
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
            it('it should perform a remapping', inject(function ($httpBackend: IHttpBackendService, RestService: RestService, RestService2: RestService2) {
                //spec body

                expect(RestService).toBeDefined();
                expect(RestService.testService2).toBeDefined();


                $httpBackend.expectGET("booga/rootUrl/myRequest")   .respond({
                    success: 'response_done'
                });

                var executed: boolean = false;
                var promise = RestService.myRequestMapped();
                promise.then((data: any) => {
                    expect(data.success).toEqual('response_done');
                    executed = true;
                });
                $httpBackend.flush();




            }));


            it('should perform a basic get request with decoration', inject(function ($httpBackend: IHttpBackendService, RestService: RestService, RestService2: RestService2) {
                //spec body
                expect(RestService).toBeDefined();
                expect(RestService.testService2).toBeDefined();

                let res: any = $httpBackend.expectGET('rootUrl/myRequest')
                    .respond({
                        success: 'response_done'
                    });

                var executed: boolean = false;
                var promise = RestService.myReqEmpty();
                promise.then((data: any) => {
                    expect(data.success).toEqual('response_done');
                    executed = true;
                });
                $httpBackend.flush();

                expect(RestService.__decoratorcalled__).toBe(true);
                expect(executed).toBe(true);
            }));

            it('should perform a basic get request  with url parameters', inject(function ($httpBackend: IHttpBackendService, RestService: RestService, RestService2: RestService2) {
                //spec body
                expect(RestService).toBeDefined();
                let res: any = $httpBackend.expect("GET", 'rootUrl/standardGet/value1/value2')
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


            it('should a mixed param type test post request', inject(function ($httpBackend: IHttpBackendService, RestService: RestService, RestService2: RestService2) {
                //spec body
                expect(RestService).toBeDefined();

                let bodyData = "";
                var executed: boolean = false;
                let res: any = $httpBackend.expectPOST('rootUrl/getMixedParamsPost/value1/value2?requestParam1=req1&requestParam2=req2', function (data) {
                    bodyData = data;
                    return bodyData == "bodyReq";
                }).respond({
                    success: 'response_done'
                });


                RestService.getMixedParamsPost("value1", "value2", "req1", "req2", "bodyReq").then((data: any) => {
                    expect(data.success).toEqual('response_done');
                    executed = true;
                });

                $httpBackend.flush();

                expect(executed).toBe(true);
            }));


            it('should a mixed param type test', inject(function ($httpBackend: IHttpBackendService, RestService: RestService) {
                //spec body
                expect(RestService).toBeDefined();

                ///mixedGet/value1/value2?requestParam1=value1&requestParam2=value2
                ///mixedGet/value1/value2?requestParam1=req1&requestParam2=req2
                let bodyData = "";
                //body in a get request either net tested or not passed
                let res: any = $httpBackend.expectGET('rootUrl/mixedGet/value1/value2?requestParam1=req1&requestParam2=req2')
                    .respond({
                        success: 'response_done'
                    });

                var executed: boolean = false;
                RestService.getMixedParams("value1", "value2", "req1", "req2", "bodyReq").then((data: any) => {
                    expect(data.success).toEqual('response_done');
                    executed = true;
                });
                $httpBackend.flush();

                expect(executed).toBe(true);
            }));

            //we have to take that out, karma bombs out here instead of going into catch
            it('enforced isArray test', inject(function ($httpBackend: IHttpBackendService, RestService: RestService) {
                //spec body
                expect(RestService).toBeDefined();

                expect(() => {
                    ///mixedGet/value1/value2?requestParam1=value1&requestParam2=value2
                    ///mixedGet/value1/value2?requestParam1=req1&requestParam2=req2
                    let bodyData = "";
                    //body in a get request either net tested or not passed
                    let res: any = $httpBackend.expectGET('rootUrl/mixedGet/value1/value2?requestParam1=req1&requestParam2=req2')
                        .respond([{
                            success: 'response_done'
                        }]);

                    var executed: boolean = false;
                    RestService.getMixedParams("value1", "value2", "req1", "req2", "bodyReq").then((data: any) => {
                        expect(data[0].success).toEqual('response_done');
                        executed = true;
                    });
                    $httpBackend.flush();
                }).toThrowError(/resource/gi)




            }));

            it('should a mixed param type test with array', inject(function ($httpBackend: IHttpBackendService, RestService: RestService) {
                //spec body
                expect(RestService).toBeDefined();

                ///mixedGet/value1/value2?requestParam1=value1&requestParam2=value2
                ///mixedGet/value1/value2?requestParam1=req1&requestParam2=req2
                let bodyData = "";
                //body in a get request either net tested or not passed
                let res: any = $httpBackend.expectPOST('rootUrl/getMixedParamsPost/value1/value2?requestParam1=req1&requestParam2=req2')
                    .respond([{
                        success: 'response_done'
                    }]);

                var executed: boolean = false;
                RestService.getMixedParamsPostArr("value1", "value2", "req1", "req2", "bodyReq").then((data: any) => {
                    expect(data[0].success).toEqual('response_done');
                    executed = true;
                });
                $httpBackend.flush();

                expect(executed).toBe(true);
            }));


            //have to take the cache tests out for the moment
            //due to jasmine api changes I have to investigage
           /* it('it should have a cached rest result', inject(function ($httpBackend: IHttpBackendService, RestService: RestService, CacheService: CacheService) {
                expect(CacheService).toBeDefined();
                expect(systemCache).toBeDefined();
                let cacheConfig: CacheConfigOptions = systemCache.cacheConfigs[STANDARD_CACHE_KEY];
                let res: any = $httpBackend.expectGET('rootUrl/myRequest')
                    .respond({
                        success: 'response_done'
                    });
                CacheService.theCachedReq("booga");

                $httpBackend.flush();
                expect(systemCache.cache[STANDARD_CACHE_KEY].keys.length).toBe(1);

            }));
*/

            it('it should work with a class level url decorator', inject(function ($httpBackend: IHttpBackendService, RestService5: RestService5, CacheService: CacheService) {
                expect(RestService5).toBeDefined();
                expect(RestService5.decoratedRequest).toBeDefined();

                let res: any = $httpBackend.expectGET('booga/rootUrl/myRequest')
                    .respond({
                        success: 'response_done'
                    });

                var executed: boolean = false;
                var promise = RestService5.decoratedRequest();
                promise.then((data: any) => {
                    expect(data.success).toEqual('response_done');
                    executed = true;
                });
                $httpBackend.flush();

            }));


            it('it should be meta data decoratable', inject(function ($httpBackend: IHttpBackendService, RestService5: RestService5, CacheService: CacheService) {
                expect(RestService5).toBeDefined();
                expect(RestService5.decoratedRequest).toBeDefined();

                let res: any = $httpBackend.expectGET('booga/rootUrl/myRequest2')
                    .respond({
                        success: 'response_done'
                    });

                var executed: boolean = false;
                var promise = RestService5.decoratedRequest2();
                promise.then((data: any) => {

                        expect(data.success.value).toEqual('response_done');

                });
                $httpBackend.flush();

            }));
        });
    });
});