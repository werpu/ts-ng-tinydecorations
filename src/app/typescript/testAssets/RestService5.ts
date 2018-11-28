import {extended, Inject, Injectable, REST_TYPE} from "TinyDecorations";
import {TestService2} from "../view1/TestService2";
import Rest = extended.Rest;

import Restable = extended.Restable;
import {Wrapper} from "./Wrapper";
import {IPromise} from "angular";

import IDefaultRestMetaData = extended.IDefaultRestMetaData;



@Injectable("RestService5")
@Restable({
    decorator: function (data: any) {
        (<RestService5>this).__decoratorcalled2__ = true;
        return (<any>data).$promise;
    },
    $rootUrl: "rootUrl",
    requestUrlMapper: function(theUrl: string): string {
        return "booga/"+theUrl;
    }
})
export class RestService5 {

    __decoratorcalled2__ = false;

    constructor() {
    }


    @Rest({
        url: "/myRequest"

    })
    decoratedRequest(): any {
    }


    @Rest({
        url: "/myRequest2",
        method: REST_TYPE.GET,
        userMeta: Wrapper,
        decorator: function (inPromise: any, metaData: any): any {

            return inPromise.$promise.then((data: any) => {
                data.success = new metaData.userMeta(data.success);
                return data;
            });
        }

    })
    decoratedRequest2(): any {
    }


}