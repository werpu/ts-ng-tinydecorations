/// <reference types="angular" />
import { IAttributes, IScope } from "angular";
export declare class VersionDirective {
    private version;
    private $scope;
    myVar: string;
    constructor(version: any, $scope: any);
    link(scope: IScope, elm: any, attrs: any, controller: any, transcludes: any): void;
    preLink(scope: IScope, elm: any, attrs: IAttributes): void;
    postLink(scope: IScope, elm: any, attrs: IAttributes): void;
}
