
import {Injectable} from "TinyDecorations";
import {CacheConfig} from "../../../../dist/ExtendedDecorations";


@Injectable("RestService")
@CacheConfig({
    key:"StandardCache",
    evicitionPeriod: 10*1000,
    refreshOnAccess: true
})
export class CacheService {


}