
import {C_REQ_PARAMS, extended, keepExternals} from "TinyDecorations";
import RequestParam = extended.RequestParam;
import PARAM_TYPE = extended.PARAM_TYPE;
import {C_REQ_META_DATA} from "../../../lib/typescript/TinyDecorations";


declare var module: any;

describe('RequestParamTest', () => {
    it('should have the inner params transferred', function() {
        const DEF_NAME = "myBoogaling";
        class RestService {
            myRequest(@RequestParam({
                name: DEF_NAME,
                paramType: PARAM_TYPE.URL
            }) myParam1: string) {
            }
        }
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA][C_REQ_PARAMS][0].name).toBe(DEF_NAME);
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA][C_REQ_PARAMS][0].paramType).toBe(PARAM_TYPE.URL);
    });

    it('should have the inner params transferred with string as paramType', function() {
        const DEF_NAME = "myBoogaling";
        class RestService {
            myRequest(@RequestParam({
                name: DEF_NAME,
                paramType: "URL"
            }) myParam1: string) {
            }
        }
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA][C_REQ_PARAMS][0].name).toBe(DEF_NAME);
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA][C_REQ_PARAMS][0].paramType).toBe(PARAM_TYPE.URL);
    });
});