# `ts-ng-tinydecorations` — A low footprint decorations/annotations set for Angular 1.5+

This project has the aim to deliver a set of Angular 4 like typescript decorations for angular 1.5, with 
a low code footprint. So it is ideal for projects which want the simplification, decorations
can deliver, but also do not want to much additional code.
While the project eases the porting of Angular 1.x apps to Angular 4. It is not its goal.
Its aim is more to make the code for component libraries and small applications more readable, which need
a small footprint solution to be embeddable.

If you want to introduce an Angular 4 decorations in a bigger application, 
there are [solutions](https://github.com/ngParty/ng-metadata) with more
code footprint however which are more complete and closer to what Angular 4 delivers


## Supported decorators

### @NgModule(options: IModuleOptions)

    IModuleOptions:

    - name: string - name for the module
    - imports?: Array<string|Object> - Module imports
    - exports?: Array<string|Object> - Module exports (kept mainly for upwards compatibility, does mostly the same as providers)
    - providers?: Array<string|Object> - Providers providers for the module (components, constants, injectors etc..)
    
       
###  @Injectable(options:IServiceOptions) ... defines an injectable (maps to angular.service)    

     IServiceOptions:
     
     - name: string - the name of the injectable
       
    
###  @Controller(options: IControllerOptions) .. a simple page controller

        IControllerOptions:
        
        - name: string - name of the controller
        - controllerAs?: string - template alias which can be reused in navigations (helper functions are provided)
        - template?: string - the template (navigational helper functions are provided)
        - templateUrl?: string - the template url (navigational helper functions are provided)
  
```typescript
 
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
             console.log("hello world");
         }, 1000);
     }
 }
 
```  



### @Component(options: ICompOptions) ... a standard angular component

    ICompOptions:
    - name: string - name of the component
    - controllerAs?: string - template alias which can be reused in navigations (helper functions are provided)
    - template?: string - the template (navigational helper functions are provided)
    - templateUrl?: string - the template url (navigational helper functions are provided)
    - selector?: string - the template selector (does not need to be camel cased)
    - bindings?: { [key: string]: string } bindings override (you also can use @Input etc...)             
    - transclude?: boolean | {[key: string]: string } transclude/transcludes
 
  Example:
    
```typescript  
  
  @Component({
      selector: "app-version-comp",
      template:"<div>{{ctrl.version}}</div>",
      controllerAs: "ctrl"
  })
  export class VersionComponent {
      constructor(public version: any) {
      }
  }
  
```

### @Directive(options: IDirectiveOptions) ... standard directive

       IDirectiveOptions: 
       - name: string - name of the controller
       - controllerAs?: string - template alias which can be reused in navigations (helper functions are provided)
       - template?: string - the template (navigational helper functions are provided)
       - templateUrl?: string - the template url (navigational helper functions are provided)
       - selector?: string - the template selector (does not need to be camel cased)
       - bindings?: { [key: string]: string } bindings override (you also can use @Input etc...)             
       - transclude?: boolean | {[key: string]: string } transclude/transcludes
       - restrict?: string - standard angular restriction options "AE"..
       - priority?: number - standard angular directive priority
       - replace?: boolean - replace of the element or not 
       - require: Array<any> - standard require (see directive docs for further info)
       - bindToController?: boolean - shall the scope values be bound to the controller (default yes)
       - multiElement?: boolean - multielement directive (default no)
       - scope?: boolean - scope override default use @Inject etc.. instead
       - compile?: Function - comple callback function
       - preLink: Function - prelink callback function
       - postLink: Function - postlink callback function
      
  
  
  
  Example:

```typescript 

@Directive({
    selector: "app-version",
    restrict: "EA",
    transclude: true,
    controllerAs: "ctrl",
    template: "<div><ng-transclude></ng-transclude>{{ctrl.version}} - {{ctrl.myVar}}</div>"
})
export class VersionDirective {

    @Input() myVar: string;

    constructor(@Inject("version") private version: any,@Inject("$scope") private $scope: any) {
    }
    
    //link and postLink are mutually exclusive due to angular
    //restrictions, if you enable both
    //you will get an error
    
    //link(scope: IScope, elm: any, attrs: any, controller: any, transcludes: any) {
    //    console.log("link", this.myVar);
    //}
    

    preLink(scope: IScope, elm: any, attrs:IAttributes) {
        console.log("prelink");
    }

    postLink(scope: IScope, elm: any, attrs:IAttributes) {
        console.log("postLink");
    }
}

```  
  
Note: for convenience reasons all Directive methods are now bound
  to the instance scope of the directive (aka the controller),
  this is a different behavior to a standard angular directive
  which does not have a fixing binding of the various directive function.
  The directive now behaves as a class like you would expect an instance of a class to be.
  All functions reference the same this object as the constructor.
  
  
### @Filter(opts:IFilterOptions)


    - name: string - name of the controller
    
    Example:
```typescript  

  @Filter({
      name: "interpolate"
  })
  export class InterpolateFilter implements IAnnotatedFilter<string> {
  
      constructor(@Inject("version") private version:string) {}
  
      filter(text: string) {
          return String(text).replace(/\%VERSION\%/mg, this.version);
      }
  }
  
```  
    
    
###  @Inject(artifact?: string|Object) inject with an optional override
   
   Example:
   
```typescript
   @Injectable({name: "TestService2"})
   export class TestService2 {
       constructor(@Inject("hello1") public myVar1: string, @Inject(MyConsts.helloWorld) public hello2: string, private TestService1: TestService1) {
       }
   }
```
in the example: 
* a constant with the name hello1 is injected into myVar1
* a constant with the name helloWorld is injected into hello2 (type injection)
* a service TestService1 is injected into the variable TestService1 (name match)

## Bindings

Components and directive can have bindings assigned, following annotations
are provided

* @Input(optional ?: boolean) ... maps to "<" respectively "<?"
* @Output(optional ?: boolean) ... maps to ">" respectively ">?"
* @Both(optional ?: boolean) ... maps to "=" respectively "=?"
* @String(optional ?: boolean) ... maps to "@" respectively "@?"
* @Func(optional ?: boolean) ... maps to "&" respectively "&?"

   Example:
   
```typescript

@Component({
    selector: "app-version-comp",
    template:"<div>{{ctrl.version}} - {{ctrl.myVar1}}</div>",
    controllerAs: "ctrl"
})
export class VersionComponent {
    
    @Input() myVar1;
    
    constructor(public version: any) {
    }
}

```

## Application Constants

As a convenience API, a @Constant annotation is provided
which allows angular constants to be registered automatically

```typescript
export class VersionConst {
    @Constant("version")
    static version =  '0.1'
    
    @Constant("my_version2")
    static version2 =  '0.2'
}

@NgModule({
    name: "myApp",
    declarations: [VersionConst] //register all constants at once
})
class MyApp {
}
```

Once registered, constants can now be injected by name or type
(but not referenced directly anymore)

```typescript

@Injectable({name: "MyService"})
export class MyService {
    constructor(@Inject("my_version2") public myVar1: string, @Inject(VersionConst.version) public hello2: string) {
    }
}

//Following is not possible anymore after declaring a var as constant
//console.log(VersionConst.version)
```

So a class variable declared as constant "always" must be injected
never directly referenced.


## Bootstrapping the Application

Bootstrapping the application resembles closely what Angular 2 provides.
However to fulfill the requirements of Angular 1 two new 
annotations where introduced 

* @Config ... a configuration for a module
* @Run ... a run callback for a module

Example:

```typescript

@Config()
export class AppConfig {
    constructor(@Inject("$locationProvider") private $locationProvider: ILocationProvider,
                @Inject("$routeProvider") private $routeProvider: any) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/view1'});
        console.log("config called");
    }
}

@Run()
export class AppRun {
    constructor() {
        console.log("run called");
    }
}

@NgModule({
    name: "myApp",
    imports: ["ngRoute",
        View2Module,
        VersionModule, View1Module],
    declarations: [AppConfig, AppRun]
})
class MyApp {
}


/*now lets bootstrap the application, unfortunately ng-app does not work due to the systemjs lazy binding*/
platformBrowserDynamic().bootstrapModule(MyApp);

```

Note: for the moment only a dynamic application binding is supported. No
static binding aka &lt;html ng-app="myApp"&gt; is supported yet.



## helper functions for navigations

todo provide the documentation here

## integrating the library 

todo provide docs


