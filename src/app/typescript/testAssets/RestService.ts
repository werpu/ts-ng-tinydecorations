import {REST_RESPONSE, Injectable, extended, REST_TYPE, Inject} from "TinyDecorations";
import Rest = extended.Rest;
import RequestParam = extended.RequestParam;
import PathVariable = extended.PathVariable;
import RequestBody = extended.RequestBody;

import {TestService2} from "../view1/TestService2";
import {IPromise} from "angular";


@Injectable("RestService")
export class RestService {

    $rootUrl: string = "rootUrl";

    __decoratorcalled__!: boolean;


    constructor(@Inject(TestService2) public testService2: TestService2) {
    }

    public myDoit() {

    }

    @Rest({
        url: "/myRequest",
        method: REST_TYPE.GET,
        decorator: function(inPromise: any): any {
            (<any>this).__decoratorcalled__ = true;
           return inPromise.$promise;
        }
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
        method: REST_TYPE.GET,
        requestUrlMapper: function(theUrl: string): string {
            return "booga/"+theUrl;
        }
    })
    myRequestMapped(): any {
    }


    @Rest({
        url: "/myRequest",
        method: REST_TYPE.GET
    })
    myRequestEmbedded(): REST_RESPONSE<any> {
    }


    @Rest("/standardGet")
    standardGetWithUrlParams(@PathVariable("param1") param1: string, @PathVariable("param2") param2: string): any {
    }

    @Rest({
        url: "/mixedGet",
        method: REST_TYPE.GET
    })
    getMixedParams(@PathVariable({name: "param1"}) param1: string,
                   @PathVariable({name: "param2"}) param2: string,
                   @RequestParam({name: "requestParam1"}) requestParam1: string,
                   @RequestParam({name: "requestParam2"}) requestParam2: string,
                   @RequestBody() requestBody: any): REST_RESPONSE<any> {
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
                       @RequestBody() requestBody: any): REST_RESPONSE<any> {
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
                          @RequestBody() requestBody: any): REST_RESPONSE<any> {
        //mixed param with all allowed param types
    }
}