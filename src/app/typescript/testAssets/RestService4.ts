import {extended, Inject, Injectable} from "TinyDecorations";
import {TestService2} from "../view1/TestService2";
import Rest = extended.Rest;
import DefaultRestMetaData = extended.DefaultRestMetaData;


@Injectable({
    name: "RestService4",
    restOptions: {
        decorator: function(data) {
            (<RestService4>this).__decoratorcalled2__ = true;
            return (<any>data).$promise;
        },
        $rootUrl: "rootUrl"
    }
})
export class RestService4 {

    __decoratorcalled2__ = false;

    constructor() {
    }


    @Rest({
        url: "/myRequest"
    })
    decoratedRequest(): any {
    }



}