declare module "Dto" {

    export type DtoMapping = {[key: string]: any};

    /**
     *
     * @Dto annotation usage
     *
     * <pre>
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
       </pre>
     */
    export function Dto(mapping?:DtoMapping) : (constructor: any) => any;

    /**
     * PostConstruct decorator callback on any artifact
     *
     * usage @PostConstruct() on any instance method in your class
     */
    export function PostConstruct() : (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;


}
