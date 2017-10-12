/*
 Copyright 2017 Werner Punz

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is furnished
 to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {AngularCtor} from "./TinyDecorations";
import {executePostConstruct} from "./TinyDecorations";

/**
 * various helpers to ease the dto handling
 *
 interface Dto {
    key1: AnotherDto;
    key2: []<Dto>;
 }

 @DtoImpl({
    key1: AnotherDto,
    key2: new ArrType(Dto)
 })
 class DtoImpl implements Dto {
    constructor(item: Dto) {
    }
    key1: AnotherDto;
    key2: []<Dto>;
 }
 *
 *
 */


export type DtoMapping = {[key: string]: any};

export class ArrType {
    constructor(public clazz: any) {
    }
}



export function Dto(options: DtoMapping = {}) {
    return (ctor: AngularCtor<Object>): any => {

        let cls: any = class GenericDtoImpl extends ctor {
            constructor() {
                //We have a $resource as first argument
                super(...[].slice.call(<any>arguments).slice(0, arguments.length));
                DtoUils.mapIt(this, arguments[0], options)

                executePostConstruct(this, ctor);
            }
        };
        return cls;
    }
}




class DtoUils {
    static mapIt(target: any, src: any, mappings: any): any {
        for (let key in src) {
            if (!src.hasOwnProperty(key)) {
                continue;
            }

            let newVal = src[key];
            if (mappings[key]  &&
                mappings[key] instanceof ArrType) {
                //do the array here
                (<any>target)[key] = {};

                for (let key2 in newVal) {
                    let subTarget = new mappings[key].clazz(newVal[key2]);
                    //   subTarget = this.mapIt(subTarget, <any> newVal[key2]);
                    (<any>target)[key][key2] = subTarget;
                }
            } else if (mappings && mappings[key]) {
                let subTarget = new mappings[key](newVal);

                (<any>target)[key] = subTarget;
            } else {
                (<any>target)[key] = newVal
            }
        }

        return target;
    }
}

