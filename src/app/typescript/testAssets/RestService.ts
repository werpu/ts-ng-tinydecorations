import {REST_RESPONSE, Injectable, extended, REST_TYPE, Inject} from "TinyDecorations";
import Rest = extended.Rest;


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

}