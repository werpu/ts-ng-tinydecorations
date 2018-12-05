import {C_REQ_PARAMS, C_REQ_META_DATA, extended, keepExternals, PARAM_TYPE, REST_TYPE} from "TinyDecorations";

import Rest = extended.Rest;

import RequestParam = extended.RequestParam;

import Post = extended.Post;
import Get = extended.Get;
import PostForList = extended.PostForList;
import GetForList = extended.GetForList;
import Put = extended.Put;
import Delete = extended.Delete;


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



    it('Extended Metadata 1', function() {
        const DEF_NAME = "myBoogaling";

        class RestService {
            @Post({
                url:"/myRequest"
            })
            myRequest(@RequestParam({
                name: DEF_NAME,
                paramType: PARAM_TYPE.URL
            }) myParam1: string): any {
            }
        }
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA].url).toEqual("/myRequest");
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA]["method"]).toEqual(REST_TYPE.POST);
    });


    it('Extended Metadata 2', function() {
        const DEF_NAME = "myBoogaling";

        class RestService {
            @PostForList({
                url:"/myRequest"
            })
            myRequest(@RequestParam({
                name: DEF_NAME,
                paramType: PARAM_TYPE.URL
            }) myParam1: string): any {
            }
        }
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA].url).toEqual("/myRequest");
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA]["method"]).toEqual(REST_TYPE.POST);
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA]["isArray"]).toEqual(true);
    });

    it('Extended Metadata 2_1', function() {
        const DEF_NAME = "myBoogaling";

        class RestService {
            @Get({
                url:"/myRequest"
            })
            myRequest(@RequestParam({
                name: DEF_NAME,
                paramType: PARAM_TYPE.URL
            }) myParam1: string): any {
            }
        }
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA].url).toEqual("/myRequest");
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA]["method"]).toEqual(REST_TYPE.GET);
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA]["isArray"]).toEqual(undefined);
    });

    it('Extended Metadata 3', function() {
        const DEF_NAME = "myBoogaling";

        class RestService {
            @GetForList({
                url:"/myRequest"
            })
            myRequest(@RequestParam({
                name: DEF_NAME,
                paramType: PARAM_TYPE.URL
            }) myParam1: string): any {
            }
        }
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA].url).toEqual("/myRequest");
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA]["method"]).toEqual(REST_TYPE.GET);
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA]["isArray"]).toEqual(true);
    });


    it('Extended Metadata 4', function() {
        const DEF_NAME = "myBoogaling";

        class RestService {
            @Put({
                url:"/myRequest"
            })
            myRequest(@RequestParam({
                name: DEF_NAME,
                paramType: PARAM_TYPE.URL
            }) myParam1: string): any {
            }
        }
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA].url).toEqual("/myRequest");
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA]["method"]).toEqual(REST_TYPE.PUT);

    });

    it('Extended Metadata 5', function() {
        const DEF_NAME = "myBoogaling";

        class RestService {
            @Delete({
                url:"/myRequest"
            })
            myRequest(@RequestParam({
                name: DEF_NAME,
                paramType: PARAM_TYPE.URL
            }) myParam1: string): any {
            }
        }
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA].url).toEqual("/myRequest");
        expect((<any>RestService).prototype["myRequest"][C_REQ_META_DATA]["method"]).toEqual(REST_TYPE.DELETE);

    });
});