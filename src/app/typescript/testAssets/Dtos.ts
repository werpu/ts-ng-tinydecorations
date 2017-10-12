import {ArrType, Dto} from "../../../lib/typescript/Dto";
import {PostConstruct} from "../../../lib/typescript/TinyDecorations";

export interface Probe1 {
    val1: string;
    val2: Date;
    val3: any;
    val4: Probe2[];
    val5: Probe2;
    val6: any;
}

export interface Probe2 {
    val1: string;
}

@Dto({})
export class Probe2Impl implements Probe2 {

    val1: string;

    constructor(data: Probe2) {

    }
}

@Dto({
    val3: new ArrType(Probe2Impl),
    val4: new ArrType(Probe2Impl),
    val5: Probe2Impl
})
export class Probe1Impl implements Probe1 {

    val1: string;
    val2: Date;
    val3: any;
    val4: Probe2[];
    val5: Probe2;
    val6: any;

    constructor(data: Probe1, mixin: any = {} /*put your own arguments in here*/) {
    }

}


@Dto({
    val3: new ArrType(Probe2Impl),
    val4: new ArrType(Probe2Impl),
    val5: Probe2Impl
})
export class Probe1_1 implements Probe1 {

    val1: string;
    val2: Date;
    val3: any;
    val4: Probe2[];
    val5: Probe2;
    val6: any;

    postConstructCalled: boolean = false;

    constructor(data: Probe1, mixin: any = {} /*put your own arguments in here*/) {
    }

    @PostConstruct()
    PostConstruct(data: Probe1) {
        if(data && data.val1) {
            this.postConstructCalled = true;
        }
    }

}
