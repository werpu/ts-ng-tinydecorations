import {Inject, Injectable, extended, REST_TYPE} from "TinyDecorations";
import {Cacheable, Cached, CacheEvict, CachePut} from "Cache";
import {IPromise, IQService, ITimeoutService} from "angular";
import Restable = extended.Restable;
import Rest = extended.Rest;

export const STANDARD_CACHE_KEY = "StandardCache";
export const EVICTION_TIME = 10*1000;

@Injectable("CacheService")

@Cached({
    key:STANDARD_CACHE_KEY,
    evictionPeriod: EVICTION_TIME,
    refreshOnAccess: true
})
@Restable({
    $rootUrl: "rootUrl"
})
export class CacheService {

    basicPutValue: string;

    cacheablePutVale: string;
    cacheableCallCnt: number = 0;

    constructor(@Inject("$q") private $q: IQService,@Inject("$timeout") private $timeout: ITimeoutService) {

    }


    @CachePut()
    @Rest({
        url: "/myRequest",
        method: REST_TYPE.GET,
        decorator: function(inPromise: any): any {
            (<any>this).__decoratorcalled__ = true;
            return inPromise.$promise;
        }
    })
    theCachedReq(instr: string): any {
    }


    @CachePut()
    basicPut(instr: string): string {
        this.basicPutValue = instr;
        return instr;
    }

    @CachePut()
    basicPutPromise(instr: string): IPromise<any> {
        var deferred = this.$q.defer();

        this.basicPutValue = instr;
        deferred.resolve(instr);

        return deferred.promise;
    }

    @Cacheable()
    cacheable(instr: string): string {
        this.cacheableCallCnt++;
        this.cacheablePutVale = instr;

        return instr;
    }

    @Cacheable()
    cacheablePromise(instr: string): IPromise<any> {
        var deferred = this.$q.defer();

        this.cacheableCallCnt++;
        this.cacheablePutVale = instr;
        deferred.resolve(instr);

        return deferred.promise;
    }

    @Cacheable()
    cacheable2(instr: string): string {
        this.cacheableCallCnt++;
        this.cacheablePutVale = instr;
        return instr;
    }

    @CacheEvict()
    cacheEvict() {

    }

}