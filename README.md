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

## Getting Started

### Download from github

### Running the Examples

After downloading the project
either use "./install.sh" (Linux/Unix/MacOS)
or "install.cmd" to install the necessary dependencies
to build the files and/or run the examples.

Once done, you can simply start the small example 
via "npm start" and then point your browser to
[http://localhost:8000/](http://localhost:8000/)

## Using the library

You can use the library either embedded in your
typescript application or use a module loader
to load and/or bundle it.

### Embedding the Library

The Libraries Typescript dist file can be found in
./dist/TinyDecorations.ts 



### Using the library via a javascript module loader

The corresponding javascript build file also can be found in the
dist/ folder as well as the d.ts file

An example on how to use the library via a module loader is hosted
in the examples folder and can be started with "npm start"



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

## Restful Services

The annotation library now also supports restful services.
This is an experimental feature and will stabilize over the next few days.
It uses the Angular resource module and weaves decoration code over it.

### Implementation of a Restful Service

Every service theoretically can be made a restful service as long as it is annotated
with the "@Injectible()" annotation. 

All which needs to be done is to expose some restful methods via annotations
and the TinyDecorations library takes care of the rest.

* Here is a small example:

```typescript

@Injectable("RestService")
export class RestService {
    
     @Rest("/standardGet")
     standardGetWithUrlParams(
            @PathVariable("param1") param1: string, 
            @PathVariable("param2") param2: string): IPromise<any> {
         return null;
     }
    
}

```

In this example a simple http get request is exposed with two pathvariables.

Following url would be called

```http
/standardGet/<param1 value>/<param 2 value/
```

The result of the call is always a promise which, can be used
 for further operations (aka processing the incoming data)
 
### Supported Rest Methods and Param Types

At the time of writing following rest types are supported

* GET
* PUT
* SAVE
* DELETE

If no rest type parameter is given, a HTTP get is automatically assumed
as default.

You can change to a different Rest type the following way:

```typescript

@Rest({
        url: "/getMixedParamsPost",
        method: REST_TYPE.POST
    })
    getMixedParamsPost(@PathVariable({name: "param1"}) param1: string,
                       @PathVariable({name: "param2"}) param2: string,
                       @RequestParam({name: "requestParam1"}) requestParam1: string,
                       @RequestParam({name: "requestParam2"}) requestParam2: string,
                       @RequestBody({name: "requestBody"}) requestBody: any): REST_RESPONSE<any> {
        //mixed param with all allowed param types
    }

```

As you can see simply by giving the Rest decoration a method type
switches over to a different rest type.

Also in this example we see the three different types of rest variables

* @PathVariable({name: "param1"}) param1 / short @PathVariable("param1") param1 
Is a variable which is hosted in the url port of they rest request
(see the example above for more information)

* @RequestParam basically places a key value pair into the query part of your request

```typescript
 @RequestParam({name: "requestParam1"}) param1 becomes ?requestParam1=<value of param1>
 ```
 
 also again if you only pass the key and nothingm else you can use the abbreviation:
```typescript 
 @RequestParam("requestParam1") param1
```

The last parameter is the @RequestBody, whatever you pass there
is passed as json string in the request body.

### Advanced Rest Topics

While the basics of the rest annotions are pretty simple, the enire
annotation set is very powerful and allows also a step by step migration of existing code.

#### $resource 

The annotations use the angular resource service, and for that a 
reference to the $resource service is automatically injected into your service.
It does not need to be declared.

If you have legacy code however, you can inject the $resouce service yourself.
The TinyDecorations system will detect that you already have a $resource reference
and then omit its own code to inject it.

expample:


```typescript

@Injectable("RestService")
export class RestService {
    
    constructor(@Inject("$resource") public $resource) {  
        ... do your own custom code here
    }

}
    
```

#### $rootUrl
 
Usually you do not have the entire url available for your services.
Most of the time a system environment variable sets up the first part
of your rest request url.

The annotation system can handle this usescase by checking
if an instance var with the name $rootUrl is set in the service.
And if preset it prepends this root part to the url part passed down by the
rest call.

Example:

```typescript

export class ApplicationConsts {
    export class AppConstants {
        @Constant("myRootUrl")
        static hello1 = "http://oh.happy.com";
    }  
    
    ... additional constants
}

@Injectable("RestService")
export class RestService {
    
    constructor(@Inject("myRootUrl") public $rootUrl) {  
        ... do your own custom code here
    }
    
    
     @Rest("rest/standardGet")
     standardGet(): IPromise<any> {
         return null;
     }

}

```
A call to standardGet() will result in following Rest Request:

```http
http://oh.happy.com/rest/standardGet
```

#### Custom Code

Generally the annotations never touch your core code.
So you can add any custom rest methods not using the annotations any time, utilizing
the existing $resource facilities or other services.

Internally the system derives a class from your existing one
 and only decorates the annotated methods with its own decoration code.
 Every exsiting method if decorated will be called within the decoration via a super call.
 Every non decorated method will be inherited into the derived class.
 Constructor constracts will be valued. Injectors are kept as is and called
 via a super call from its decoration code.
 

 * Note, at the moment there is no real specified way to supporess
 the decoration from a super call. This is still a work in progress.
 I would recommend, if you need custom behavior, simply use your own 
 non annotated method.
 
#### Decorations within the call chain
 
Note: decorators are still a work in progress, so minor changes
can be expected.
  
There are several extension points within the annotation which allow
the deocoration and transformation of values within the rest chain.

Some of those decorations are inherited from the underlying
$resource system.
Some are added as convenience decorations for custom application specific behavior.

* Method decorators

  * transformResponse ... optional transformation function which is exposed from the underlying $resource system
        it allows to transform the response from the incoming value from the server
        into a convenience value to be further processed by the system.
        
        note: (TODO this scope in this case is still a work in progress)
  * decorator ... decorates the resource callchain, and expects a promise as its return value
        
        example
        
        @Rest({...
        decorator: function(resourceReturnVaue) {
                this.ApplicationUtils.makeCancellable(resourceReturnValue).$promise;
        }
        
   note, this applies to the service here, so the filter is always scoped under the service instance.
        
* Param decorators:
    
  * conversionFunc ... optional conversion function which transforms the incoming
    parameter value into something different. 
  
  

## helper functions for navigations

todo provide the documentation here

## integrating the library 

todo provide docs


