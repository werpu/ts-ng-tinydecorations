import { IAnnotatedFilter } from "TinyDecorations";
export declare class InterpolateFilter implements IAnnotatedFilter<string> {
    private version;
    constructor(version: string);
    filter(text: string): string;
}
