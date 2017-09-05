import {C_REQ_PARAMS, C_REQ_META_DATA, extended, keepExternals, PARAM_TYPE, REST_TYPE} from "TinyDecorations";

import RequestParam = extended.RequestParam;
import {IHttpBackendService} from "angular";
import {View1Module} from "../view1/View1Module";
import {CacheService, EVICTION_TIME, STANDARD_CACHE_KEY} from "../testAssets/CacheService";
import {CacheConfigOptions, systemCache} from "ExtendedDecorations";


declare var module: any;

keepExternals(View1Module);

var oldGetTime: any;
var timeOffset = 0;

var fakeDate = function(year: any,month: any,day: any) {
    if(!oldGetTime) {
        oldGetTime = Date.prototype.getTime;
    }


    Date.prototype.getTime = function() {
        let date = new Date(year, month, day);
        return oldGetTime.call(date, date)+timeOffset;
    }
    //(<any>spyOn(window, (<any>"currentDate"))).andCallFake(function() { return new Date(year,month,day); });
};


describe('CacheServiceTest', () => {


    beforeEach(function() {
        fakeDate(1998,11,10);
        jasmine.clock().install();

        module('myApp.view1'); //this line fixed it
    });

    afterEach(function() {
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
                expect(cacheConfig.evicitionPeriod).toBe(EVICTION_TIME);
                expect(cacheConfig.refreshOnAccess).toBe(true);


            }));

            it('basic put and get without any eviction', inject(function ($httpBackend: IHttpBackendService, CacheService: CacheService) {
                let VALUE = "hello world";

                let val1 = CacheService.cacheable(VALUE);
                let val2 = CacheService.cacheable(VALUE);
                expect(CacheService.cacheablePutVale).toBe(VALUE);

                expect(val1).toBe(VALUE);
                expect(val2).toBe(VALUE);

                expect(Object.keys(systemCache.cache[STANDARD_CACHE_KEY])).toBeDefined();
                let cnt = 0;


                for(var key in systemCache.cache[STANDARD_CACHE_KEY]) {
                    cnt++;
                    expect(systemCache.cache[STANDARD_CACHE_KEY][key].data).toBe(VALUE);
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
                expect(cacheConfig.evicitionPeriod).toBe(EVICTION_TIME);
                expect(cacheConfig.refreshOnAccess).toBe(true);
                CacheService.cacheable(VALUE);
                CacheService.cacheable2(VALUE);
                expect(Object.keys(systemCache.cache[STANDARD_CACHE_KEY]).length).toBe(2);

                timeOffset = 10 * 500;
                (<any>jasmine).clock().tick( 10 *  500);

                console.log("---"+new Date().getTime())
                CacheService.cacheable2(VALUE);

                console.log("---"+new Date().getTime())
                timeOffset = 10 *  1001;
                (<any>jasmine).clock().tick( 10 *  1001);


                expect(systemCache.cache[STANDARD_CACHE_KEY]).toBeDefined();
                //one key eviced one remaining
                expect(Object.keys(systemCache.cache[STANDARD_CACHE_KEY]).length).toBe(1);

                timeOffset = 10 *  3001;
                (<any>jasmine).clock().tick( 10 *  2500);

                expect(Object.keys(systemCache.cache[STANDARD_CACHE_KEY]).length).toBe(0);

                CacheService.cacheable(VALUE);
                expect(Object.keys(systemCache.cache[STANDARD_CACHE_KEY]).length).toBe(1);

                timeOffset = 10 * 60 * 5001;
                (<any>jasmine).clock().tick( 10 *  2000);

                expect(Object.keys(systemCache.cache[STANDARD_CACHE_KEY]).length).toBe(0);


            }));
        });
    });



});