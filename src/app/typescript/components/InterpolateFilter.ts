import TinyDecorations = require("TinyDecorations");
import {Filter} from "TinyDecorations";
import {IAnnotatedFilter} from "TinyDecorations";



@Filter({
    name: "interpolate"
})
export class InterpolateFilter implements IAnnotatedFilter<string> {

    constructor(private version:string) {}

    filter(text: string) {
        return String(text).replace(/\%VERSION\%/mg, this.version);
    }
}