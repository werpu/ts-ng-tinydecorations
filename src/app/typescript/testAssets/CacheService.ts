import {Injectable} from "TinyDecorations";
import {CacheConfig, CachePut} from "ExtendedDecorations";

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

    constructor() {
    }

    @CachePut()
    basicPut(instr: string): string {
        this.basicPutValue = instr;
        return instr;
    }

}