import {extended, Inject, Injectable} from "TinyDecorations";
import {TestService2} from "../view1/TestService2";
import Rest = extended.Rest;
import DefaultRestMetaData = extended.DefaultRestMetaData;


@Injectable("RestService3")
export class RestService3 {

    $rootUrl: string = "rootUrl";

    __decoratorcalled__ = false;

    constructor(@Inject("$resource") private $resource: any) {

    }


    @Rest({
        url: "/myRequest"
    })
    decoratedRequest(): any {
    }



}