
import {C_REQ_PARAMS, C_REQ_META_DATA, extended, keepExternals, PARAM_TYPE, REST_TYPE} from "TinyDecorations";

import Rest = extended.Rest;

import RequestParam = extended.RequestParam;


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


    it('should have the basic passed meta data stored in the method', function() {
        const DEF_NAME = "myBoogaling";
        /**
         url: string;      //mandatory URL
         method?: string; //allowed values get, post, put, delete, default is get
         cancellable?: boolean; //defaults to false
         isArray?: boolean; //return value an array?

         //optional response transformator
         transformResponse?: (data: any, headersGetter: any, status: number) => {} | Array<(data: any, headersGetter: any, status: number) => {}>;
         cache?: boolean; //cache used?
         timeout?: number; //request timeout
         responseType?: string; //type of expected response
         hasBody?: boolean; //specifies whether a request body is included
         */
        class RestService {
            @Rest({
                url:"/myRequest",
                method: REST_TYPE.GET
            })
            myRequest(@RequestParam({
                name: DEF_NAME,
                paramType: PARAM_TYPE.URL
            }) myParam1: string): any {
            }
        }
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA].url).toEqual("/myRequest");
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA]["method"]).toEqual(REST_TYPE.GET);
    });


});