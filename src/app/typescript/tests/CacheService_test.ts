import {C_REQ_PARAMS, C_REQ_META_DATA, extended, keepExternals, PARAM_TYPE, REST_TYPE} from "TinyDecorations";

import RequestParam = extended.RequestParam;
import {IHttpBackendService} from "angular";
import {View1Module} from "../view1/View1Module";
import {CacheService, EVICTION_TIME, STANDARD_CACHE_KEY} from "../testAssets/CacheService";
import {CacheConfigOptions, systemCache} from "ExtendedDecorations";


declare var module: any;

keepExternals(View1Module);

describe('CacheServiceTest', () => {

    beforeEach(function () {
        module('myApp.view1'); //this line fixed it
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
                CacheService.basicPut(VALUE);
                expect(CacheService.basicPutValue).toBe(VALUE);

                debugger;
                expect(Object.keys(systemCache.cache[STANDARD_CACHE_KEY])).toBeDefined();
                let cnt = 0;


                for(var key in systemCache.cache[STANDARD_CACHE_KEY]) {
                    cnt++;
                    expect(systemCache.cache[STANDARD_CACHE_KEY][key].data).toBe(VALUE);
                }
                expect(cnt).toBe(1);


            }));
        });
    });
});