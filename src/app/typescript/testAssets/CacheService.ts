import {Injectable} from "TinyDecorations";
import {Cacheable, CacheConfig, CacheEvict, CachePut} from "ExtendedDecorations";

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

    constructor() {
    }

    @CachePut()
    basicPut(instr: string): string {
        this.basicPutValue = instr;
        return instr;
    }

    @Cacheable()
    cacheable(instr: string): string {
        this.cacheableCallCnt++;
        this.cacheablePutVale = instr;
        return instr;
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