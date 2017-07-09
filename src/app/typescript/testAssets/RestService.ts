import {REST_RESPONSE, Injectable, extended, REST_TYPE, Inject} from "TinyDecorations";
import Rest = extended.Rest;
import RequestParam = extended.RequestParam;
import PathVariable = extended.PathVariable;
import RequestBody = extended.RequestBody;
import IAnnotatedRestInjectible = extended.IAnnotatedRestInjectible;
import {TestService2} from "../view1/TestService2";


@Injectable({name: "RestService"})
export class RestService {

    $rootUrl: string = "rootUrl";

    constructor(@Inject(TestService2) public testService2: TestService2) {
    }


    @Rest({
        url: "/myRequest",
        method: REST_TYPE.GET
    })
    myReqEmpty(): any {
    }

    @Rest({
        url: "/myRequest",
        method: REST_TYPE.GET
    })
    myRequest(): any {
    }

    @Rest({
        url: "/myRequest",
        method: REST_TYPE.GET
    })
    myRequestEmbedded(): REST_RESPONSE<any> {
    }


    @Rest({
        url: "/standardGet",
        method: REST_TYPE.GET
    })
    standardGetWithUrlParams(@PathVariable({name: "param1"}) param1: string, @PathVariable({name: "param2"}) param2: string): REST_RESPONSE<any> {
    }

    @Rest({
        url: "/mixedGet",
        method: REST_TYPE.GET
    })
    getMixedParams(@PathVariable({name: "param1"}) param1: string,
                   @PathVariable({name: "param2"}) param2: string,
                   @RequestParam({name: "requestParam1"}) requestParam1: string,
                   @RequestParam({name: "requestParam2"}) requestParam2: string,
                   @RequestBody({name: "requestBody"}) requestBody: any): REST_RESPONSE<any> {
        //mixed param with all allowed param types
    }

    @Rest({
        url: "/getMixedParamsPost",
        method: REST_TYPE.POST
    })
    getMixedParamsPost(@PathVariable({name: "param1"}) param1: string,
                       @PathVariable({name: "param2"}) param2: string,
                       @RequestParam({name: "requestParam1"}) requestParam1: string,
                       @RequestParam({name: "requestParam2"}) requestParam2: string,
                       @RequestBody({name: "requestBody"}) requestBody: any): REST_RESPONSE<any> {
        //mixed param with all allowed param types
    }

    @Rest({
        url: "/getMixedParamsPost",
        method: REST_TYPE.POST,
        isArray: true
    })
    getMixedParamsPostArr(@PathVariable({name: "param1"}) param1: string,
                          @PathVariable({name: "param2"}) param2: string,
                          @RequestParam({name: "requestParam1"}) requestParam1: string,
                          @RequestParam({name: "requestParam2"}) requestParam2: string,
                          @RequestBody({name: "requestBody"}) requestBody: any): REST_RESPONSE<any> {
        //mixed param with all allowed param types
    }
}