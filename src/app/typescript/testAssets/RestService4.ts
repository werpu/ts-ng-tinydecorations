import {extended, Inject, Injectable} from "TinyDecorations";
import {TestService2} from "../view1/TestService2";
import Rest = extended.Rest;
import DefaultRestMetaData = extended.DefaultRestMetaData;
import Restable = extended.Restable;


@Injectable("RestService4")
@Restable({
    decorator: function (data: any) {
        (<RestService4>this).__decoratorcalled2__ = true;
        return (<any>data).$promise;
    },
    $rootUrl: "rootUrl"
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