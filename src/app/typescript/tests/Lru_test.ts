import {CacheConfigOptions, systemCache, ILruElement, LruMap} from "ExtendedDecorations";
import {C_REQ_PARAMS, C_REQ_META_DATA, extended, keepExternals, PARAM_TYPE, REST_TYPE} from "TinyDecorations";
import {View1Module} from "../view1/View1Module";

class LruItem implements ILruElement {
    lastRefresh: number;
    key: string;
    value: any;

    constructor(key: string, value: any) {
        this.key = key;
        this.value = value;
    }
}

declare var module: any;

keepExternals(View1Module);


describe('Lru Map Test', () => {

    beforeEach(function () {
        module('myApp.view1'); //this line fixed it
    });

    describe("Basic Suite", function () {
        it('Basic Basic Lru Map Test', inject(function () {
            let probe = new LruMap<LruItem>();

            for(let cnt = 0; cnt < 10; cnt++) {
                let item = new LruItem("key"+cnt, "value"+cnt);

                probe.put(item.key, item);
            }

            expect(probe.length == 10).toBe(true);
            for(let cnt = 0; cnt < 10; cnt++) {
                expect(probe.get("key"+cnt).value).toBe("value"+cnt);
            }

            probe.remove("key"+5);

            expect(probe.keys.length == 9).toBe(true);

            expect(probe.hasKey("key9")).toBe(true);

        }));

        it('Lru map with limit', inject(function () {
            let probe = new LruMap<LruItem>(5);

            for(let cnt = 0; cnt < 10; cnt++) {
                let item = new LruItem("key"+cnt, "value"+cnt);
                item.lastRefresh = cnt;

                probe.put(item.key, item);
            }
            probe.trim();
            expect(probe.length == 5).toBe(true);
            for(let cnt = 0; cnt < 10; cnt++) {
                if(cnt >= 5) {
                    expect(probe.get("key"+cnt).value).toBe("value"+cnt);
                } else {
                    expect(probe.hasKey("key"+cnt)).toBe(false);
                }

            }

        }));

    });

});