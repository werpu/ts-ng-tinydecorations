import {REST_RESPONSE, Injectable, extended, REST_TYPE, Inject} from "TinyDecorations";
import Rest = extended.Rest;
import RequestParam = extended.RequestParam;
import PathVariable = extended.PathVariable;


@Injectable({name: "RestService"})
 export class RestService {
    constructor(@Inject("$resource") private $resource: any) {
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

}