import {C_REQ_PARAMS, C_REQ_META_DATA, extended, keepExternals, PARAM_TYPE, REST_TYPE} from "TinyDecorations";

import {IHttpBackendService, IQService, IRootScopeService} from "angular";
import {View1Module} from "../view1/View1Module";
import {CacheService, EVICTION_TIME, STANDARD_CACHE_KEY} from "../testAssets/CacheService";
import {CacheConfigOptions, systemCache} from "ExtendedDecorations";


declare var module: any;

keepExternals(View1Module);

var oldGetTime: any;
var timeOffset = 0;

var fakeDate = function (year: any, month: any, day: any) {
    if (!oldGetTime) {
        oldGetTime = Date.prototype.getTime;
    }


    Date.prototype.getTime = function () {
        let date = new Date(year, month, day);
        return oldGetTime.call(date, date) + timeOffset;
    }

};


describe('CacheServiceTest', () => {


    beforeEach(function () {
        fakeDate(1998, 11, 10);
        jasmine.clock().install();

        module('myApp.view1'); //this line fixed it
    });

    afterEach(function () {
        Date.prototype.getTime = oldGetTime;
        jasmine.clock().uninstall();

    });

    describe("Basic Suite", function () {
        describe('Basic Tests', function () {
            it('should be properly set up', inject(function ($httpBackend: IHttpBackendService, CacheService: CacheService) {
                expect(CacheService).toBeDefined();
                expect(systemCache).toBeDefined();
                let cacheConfig: CacheConfigOptions = systemCache.cacheConfigs[STANDARD_CACHE_KEY];
                expect(cacheConfig).toBeDefined();
                expect(cacheConfig.key).toBe(STANDARD_CACHE_KEY);
                expect(cacheConfig.evictionPeriod).toBe(EVICTION_TIME);
                expect(cacheConfig.refreshOnAccess).toBe(true);


            }));

            it('basic put and get without any eviction', inject(function ($httpBackend: IHttpBackendService, CacheService: CacheService) {
                let VALUE = "hello world";

                let val1 = CacheService.cacheable(VALUE);
                let val2 = CacheService.cacheable(VALUE);
                expect(CacheService.cacheablePutVale).toBe(VALUE);

                expect(val1).toBe(VALUE);
                expect(val2).toBe(VALUE);

                expect(systemCache.cache[STANDARD_CACHE_KEY].keys).toBeDefined();


                let cnt = 0;
                let keys = systemCache.cache[STANDARD_CACHE_KEY].keys;
                for (; cnt < keys.length; cnt++) {
                    let key = systemCache.cache[STANDARD_CACHE_KEY].keys[cnt];
                    expect(systemCache.cache[STANDARD_CACHE_KEY].get(key).data).toBe(VALUE);
                }
                expect(cnt).toBe(1);
                expect(CacheService.cacheableCallCnt).toBe(1);

            }));

            it('basic cache evict', inject(function ($httpBackend: IHttpBackendService, CacheService: CacheService) {
                let VALUE = "hello world";

                let val1 = CacheService.cacheable(VALUE);
                let val2 = CacheService.cacheable(VALUE);


                expect(val1).toBe(VALUE);
                expect(val2).toBe(VALUE);

                CacheService.cacheEvict();
                expect(systemCache.cache[STANDARD_CACHE_KEY]).toBeUndefined();

            }));

            it('should be properly set up and evicted', inject(function ($httpBackend: IHttpBackendService, CacheService: CacheService) {
                expect(CacheService).toBeDefined();
                expect(systemCache).toBeDefined();
                let VALUE = "hello world";

                let cacheConfig: CacheConfigOptions = systemCache.cacheConfigs[STANDARD_CACHE_KEY];
                expect(cacheConfig).toBeDefined();
                expect(cacheConfig.key).toBe(STANDARD_CACHE_KEY);
                expect(cacheConfig.evictionPeriod).toBe(EVICTION_TIME);
                expect(cacheConfig.refreshOnAccess).toBe(true);
                CacheService.cacheable(VALUE);
                CacheService.cacheable2(VALUE);
                expect(systemCache.cache[STANDARD_CACHE_KEY].keys.length).toBe(2);

                timeOffset = EVICTION_TIME / 2;
                (<any>jasmine).clock().tick(EVICTION_TIME / 2);


                CacheService.cacheable2(VALUE);


                timeOffset = EVICTION_TIME + 1;
                (<any>jasmine).clock().tick(EVICTION_TIME + 1);


                expect(systemCache.cache[STANDARD_CACHE_KEY]).toBeDefined();
                //one key eviced one remaining
                expect(systemCache.cache[STANDARD_CACHE_KEY].keys.length).toBe(1);

                timeOffset = EVICTION_TIME * 3;
                (<any>jasmine).clock().tick(EVICTION_TIME * 3);

                expect(systemCache.cache[STANDARD_CACHE_KEY].keys.length).toBe(0);

                CacheService.cacheable(VALUE);
                expect(systemCache.cache[STANDARD_CACHE_KEY].keys.length).toBe(1);

                timeOffset = EVICTION_TIME * 5;
                (<any>jasmine).clock().tick(EVICTION_TIME * 5);

                expect(systemCache.cache[STANDARD_CACHE_KEY].keys.length).toBe(0);
            }));

            it('should treat promises accordingly', inject(function ($httpBackend: IHttpBackendService, $q: IQService, CacheService: CacheService, $rootScope: IRootScopeService) {
                timeOffset = 0;
                expect(CacheService).toBeDefined();
                expect(systemCache).toBeDefined();
                let VALUE = "hello world";

                let promiseCalled = false;
                CacheService.basicPutPromise(VALUE).then((val: string) => {
                    expect(val).toBe(VALUE);
                    promiseCalled = true;
                });

                $rootScope.$digest();
                expect(promiseCalled).toBe(true);
                promiseCalled = false;
                expect(CacheService.basicPutValue).toBe(VALUE);
                let cnt = 0;
                let keys = systemCache.cache[STANDARD_CACHE_KEY].keys;
                for (; cnt < keys.length; cnt++) {
                    let key = systemCache.cache[STANDARD_CACHE_KEY].keys[cnt];
                    expect(systemCache.cache[STANDARD_CACHE_KEY].get(key).data).toBe(VALUE);
                }
                expect(cnt).toBe(1);

                CacheService.cacheEvict();
                CacheService.cacheablePromise(VALUE).then(function (val) {
                    promiseCalled = true;
                    expect(val).toBe(VALUE);
                });

                $rootScope.$digest();
                expect(CacheService.cacheableCallCnt).toBe(1);
                expect(CacheService.cacheablePutVale).toBe(VALUE);
                expect(promiseCalled).toBe(true);
            }));
        });
    });
});