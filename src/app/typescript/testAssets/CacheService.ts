import {Inject, Injectable} from "TinyDecorations";
import {Cacheable, CacheConfig, CacheEvict, CachePut} from "ExtendedDecorations";
import {IPromise, IQService, ITimeoutService} from "angular";

export const STANDARD_CACHE_KEY = "StandardCache";
export const EVICTION_TIME = 10*1000;

@Injectable("CacheService")
@CacheConfig({
    key:STANDARD_CACHE_KEY,
    evicitionPeriod: EVICTION_TIME,
    refreshOnAccess: true
})
export class CacheService {

    basicPutValue: string;

    cacheablePutVale: string;
    cacheableCallCnt: number = 0;

    constructor(@Inject("$q") private $q: IQService,@Inject("$timeout") private $timeout: ITimeoutService) {
    }

    @CachePut()
    basicPut(instr: string): string {
        this.basicPutValue = instr;
        return instr;
    }

    @CachePut()
    basicPutPromise(instr: string): IPromise<any> {
        var deferred = this.$q.defer();
        //setTimeout(() => {
            this.basicPutValue = instr;
            deferred.resolve(instr);
        //}, 1000);

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
        //setTimeout(() => {
            this.cacheableCallCnt++;
            this.cacheablePutVale = instr;
            deferred.resolve(instr);
        //}, 1000);
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