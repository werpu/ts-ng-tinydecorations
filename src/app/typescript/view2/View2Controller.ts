import {Controller} from "TinyDecorations";


@Controller({
    name: "View2Ctrl",
    template: `
<p>This is the partial for view 2.</p>
<p>
  Showing of 'interpolate' filter:
  {{ 'Current version is v%VERSION%.' | interpolate }}
</p>
`
})
export class View2Controller {
    constructor(private $timeout: any) {
        $timeout(()=>{
            console.debug("hello world");
        }, 1000);
    }
}