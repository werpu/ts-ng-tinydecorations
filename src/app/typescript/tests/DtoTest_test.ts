import {Probe1, Probe1_1, Probe1Impl, Probe2, Probe2Impl} from "../testAssets/Dtos";


let createProbe2 = function () {
    let probe2: Probe2 = {val1: "hello from probe2"};
    return probe2;
};
let createProbe1 = function (probe2: Probe2) {
    let probe1: Probe1 = {
        val1: "hello from probe1",
        val2: new Date(),
        val3: {"hello": probe2},
        val4: [probe2, probe2],
        val5: probe2,
        val6: "something",
    };
    return probe1;
};

describe('DtoTest', () => {

    it('Basic Tests', function () {


        let probe2 = createProbe2();

        let probe1 = createProbe1(probe2);


        let probe1Impl = new Probe1Impl(probe1);

        expect(probe1Impl.val1).toEqual(probe1.val1);
        expect(probe1Impl.val4[1] instanceof Probe2Impl).toBe(true);
        expect(probe1Impl.val5 instanceof Probe2Impl).toBe(true);
        expect(probe1Impl.val3["hello"] instanceof Probe2Impl).toBe(true);
    });

    it('PostInitTest', function () {


        let probe2 = createProbe2();

        let probe1 = createProbe1(probe2);
        debugger;
        let probe1Impl = new Probe1_1(probe1);

        expect(probe1Impl.postInitCalled).toBe(true);
    })

});