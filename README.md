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

There also is a companion project the [TinyDecs Codegen Project](https://github.com/werpu/tinydecscodegen),
which gives you a set of plugins for the various Jetbrains ides (aka Intellij, Webstorm, etc...)
for easier TinyDecs/Angular artifact cration and maintenance.

## Getting Started

### Install via npm

Simply type

npm install ts-ng-tinydecorations

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
        ./dist/Cache.ts 
        ./dist/Routing.ts 

Also the Javascript compilations and the respective
d.ts files are hosted at this location.

So you either can use the typescript files directly or use
the js files with their corresponding d.ts files.

An example on how to use the library via a module loader is hosted
in the examples folder and can be started with "npm start"

The libraries are split into three parts to 
reduce the resulting code footprint. 

* The TinyDecorations lib hosts the Angular related decorators
* The Caching hosts the caching decorators
* and the Routing hosts the Routing helper functions and classes

If you use the Cache and/or Routing you also have to integrate
the TinyDecorations as dependency.

There are no dependencies between Cache and Routing however.


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
       - scope?: boolean | {[key: string]: string} - scope override default use @Inject etc.. instead
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

### Parameters of the Rest System

#### @Rest Annotation Parmeters

The parameters passable to the @Rest annotation are defined by following interface

```typescript
export interface IRestMetaData {
        url: string;                    //mandatory URL
        method?: REST_TYPE;             //allowed values GET, POST, PUT, DELETE, default is get
        cancellable?: boolean;          //defaults to true
        isArray?: boolean;              //return value an array?

        //optional response transformator
        transformResponse?: (data: any, headersGetter: any, status: number) => {} | Array<(data: any, headersGetter: any, status: number) => {}>;
        
        cache?: boolean;                //cache used, default is false
        timeout?: number;               //request timeout
        responseType?: string;          //type of expected response
        hasBody?: boolean;              //specifies whether a request body is included, default value is dependent on whether 
                                        //a @RequestBody is passed or not
        /**
         * a request mapper which allows to remap a request url into something different
         * (a classical example is to prefix request strings with the
         * context path)
         */
        requestUrlMapper ?: (requestUrl: string) => string;
        decorator ?: (retPromise ?: angular.IPromise<any>) => any; //decoration function for the restful function
}
```    

#### @PathVariable, @RequestParam and @RequestBody Annotation Parmeters

Pathvariable and RequestParam expect either a string with the name
of the parameter or an object of type IRequestParam. If 

```typescript

 export interface IRequestParam {
        name?: string;           //the name of the request parameter
        defaultValue?: any;     //default value if the parameter is optional
        defaultValueFunc?: Function; //function delivering the default value
        optional?: boolean;     //optional flag
        conversionFunc?: (inval: any) => string; //value conversion function which converts the incoming parameter into something else
 }
```

Normally you only need the name, in rare cases you need optional and defaultValue,
and/or the conversionFunc.

defaultValue and/or optional however also can be implemented via typescript constructs:

```typescript

public myRestMethod(@PathVariable({name: "myParam",
                                   optional: "true",
                                   defaultValue: "booga"})
                    myParam?: string) {
    
}

```

is basically the same as:

```typescript
public myRestMethod(@PathVariable("myParam") myParam: string = "booga") {
    
}
```

The @RequestBody does not take any parameters, it also can only 
occur once in a Rest call.


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

example:


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

### requestUrlMapper

Another way to handle the root urls is simply to remap your request url.

for instance

```typescript

@Injectable("RestService5")
@Restable({
    requestUrlMapper: function(theUrl: string): string {
        return "booga/"+theUrl;
    }
})
export class RestService5 {

    @Rest({
        url: "/myRequest"
    })
    decoratedRequest(): any {
    }

}


or ....

@Injectable("RestService5")
@Restable({
    ...
})
export class RestService5 {

    @Rest({
        url: "/myRequest",
        requestUrlMapper: function(theUrl: string): string {
                return "booga/"+theUrl;
        }
    })
    decoratedRequest(): any {
    }

}



```

a call to RestService5.decoratedRequest
results in both cases to booga/myRequest


Also a central configuration is possible by 
decorating the DefaultRestMetaData.requestUrlMapper
(see the documentation to DefaultRestMetaData for further information)


### High Level Rest Annotations

One principle of an annotation system is DRY, dont repeat yourself.
If you use the @Rest annotation you often will repeat yourself regarding the rest
method and the return values. I accordance with other rest annotation frameworks
a few set of high level annotations are provided.

Those are

* @Post
* @Put
* @Delete
* @Get

* @GetForList (basically a get with a list as return value)
* @PostForList

```typescript

@Injectable("RestService")
@Restable
class RestService {
    @GetForList({
        url:"/myRequest"
    })
    myRequest(@RequestParam({
        name: DEF_NAME,
        paramType: PARAM_TYPE.URL
    }) myParam1: string): any {
    }
}

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
 
There are several extension points within the annotation which allow
the decoration and transformation of values within the rest chain.

Some of those decorations are inherited from the underlying
$resource system.
Some are added as convenience decorations for custom application specific behavior.

* Method decorators

  * transformResponse ... optional transformation function which is exposed from the underlying $resource system
        it allows to transform the response from the incoming value from the server
        into a convenience value to be further processed by the system.
   
  * decorator ... decorates the resource callchain, and expects a promise as its return value
        
        example
        
        @Rest({...
        decorator: function(resourceReturnValue, requestMetaData) {
                /**
                * note the request Metadata to the @Rest
                * is passed as pass through
                */
                this.ApplicationUtils.makeCancellable(resourceReturnValue).$promise;
        }
        
        
* Param decorators:
    
  * conversionFunc ... optional conversion function which transforms the incoming
    parameter value into something different. 
  
A note on the decoration function. the default this scope of every decoration
  function points to the instance of the encapsulating service. This is different
  to using a plain $resource decoration where no explicit scoping happens. However in the context
  of the annotations this enforced scoping to the outer service is needed to 
  perform certain context dependent transformations.
  
### Rest Configuration Chain

If you have noticed we have lots of configuration
on ret call level. Most of it repeats itself
multiple times per service.

We can set default configuration options on two levels
to reduce the amount of rest call congiruation

#### Service Level

The override on service level can be done within 
the Restable annotation block:

```typescript
@Injectable({
    name: "RestService4"
})
@Restable({
      decorator: function(data: any, restMetaData ?: IDefaultRestMetaData) {
          (<RestService4>this).__decoratorcalled2__ = true;
          return (<any>data).$promise;
      },
      $rootUrl: "rootUrl"
})
```  
The Restable (of type IRestMetaData) parameters are responsible for passing
any rest options service wide.
The service wide rest options can be overridden by local options
of the same name. 

#### Application Wide Level

For application wide level you can use
the global config map:

DefaultRestMetaData

Example:


```typescript
DefaultRestMetaData.$rootUrl = "rootUrl";

DefaultRestMetaData.decorator = function (responseData: any, restMetaData ?: IDefaultRestMetaData) {
    (<any>this).__decoratorcalled__ = true;
    return responseData.$promise;
};
```  

The settings in the DefaultRestMetaData config map
will be overridden by service options and / or
method level options.

Note, the DefaultRestMetaData must be set before
the service initialisation, because the rest metadata
usually is used at service construction time.

## Caching Subsystem

The caching subsystem is independent of the 
core angular based decorations, and can be used
outside of an angular1 system.

### Reasons to use the caches

Sometimes you want to have finer granularity
regarding caches, than what simple browser caching can provide.
And for this TinyDecorations provides a caching subsystem.


### API 

Following decorators are provided

 * @Cached(string|CacheConfigOptions) ... marks a service or class as having caching methods, a config also can be provided
 * @CachePut(string<optional>) ... forces the return value of the method being cached, it basically enforces a cache refresh 
 * @Cacheable(string<optional>) ... performs a cache lookup and returns the item if found otherwise it performse the method operation and puts the result into the cache 
 * @CacheEvict(string<optional>) ... evicts the current cache which is referenced

    example

with CacheConfigOptions being:

    CacheConfigOptions
    
    - key: string;              //the cache key, required
    - evictionPeriod: number;   //the eviction period, default 10 minutes
    - refreshOnAccess: boolean; //cache eviction algorithm, true... refresh on access, false refresh on add
    - maxCacheSize: number;     //the maximum cache size default -1 aka unlimited


The optional parameter in the rest of the decorators simply targets a cache name.
You can leave it out if your cache config is on top of the class which hosts
the caching methods.


### Example for a typical cachable service

```typescript
@Injectable("CacheService")
@Cached({
    key:STANDARD_CACHE_KEY,
    evictionPeriod: EVICTION_TIME,
    refreshOnAccess: true
})
export class CacheService {

    basicPutValue: string;

    cacheablePutVale: string;
    cacheableCallCnt: number = 0;

    constructor(@Inject("$q") private $q: IQService,@Inject("$timeout") private $timeout: ITimeoutService) {
    }

    @CachePut()
    basicPut(instr: string): string {
        this.basicPutValue = instr;
        return instr;
    }

    @CachePut()
    basicPutPromise(instr: string): IPromise<any> {
        var deferred = this.$q.defer();

        this.basicPutValue = instr;
        deferred.resolve(instr);

        return deferred.promise;
    }

    @Cacheable()
    cacheable(instr: string): string {
        this.cacheableCallCnt++;
        this.cacheablePutVale = instr;

        return instr;
    }

    @Cacheable()
    cacheablePromise(instr: string): IPromise<any> {
        var deferred = this.$q.defer();

        this.cacheableCallCnt++;
        this.cacheablePutVale = instr;
        deferred.resolve(instr);

        return deferred.promise;
    }

    @Cacheable()
    cacheable2(instr: string): string {
        this.cacheableCallCnt++;
        this.cacheablePutVale = instr;
        return instr;
    }

    @CacheEvict()
    cacheEvict() {

    }

}
```


### Result values and result Promises 

As you can see in the example, the caching can handle
normal result values and asynchronous result values transparently.
In case of a promise being a result value, internally the apply value
of the promise operation will be stored. But externally you
will always get a promise as cache result.


### Eviction

#### Access Eviction

Per default the cache size is only limited by ram and eviction of cache elements happens only
on timestamp base (LRU mechnism).

The eviction algorithm can be set either to refresh on access or per default to refresh on add.
The main difference is that refresh in add has a fixed eviction period after which the element
is evicted no matter how often it has been fetched. Refresh on access however updates
the internal cache timestamp every time an element is accessed, and the element is removed
only if there was no cache access during the eviction period for this element.

You can set the eviction algorithm via the refreshOnAccess in the cache configuration
(aka boolean flag, true ... refresh on access, false ... refresh on add)

```typescript
@Cached({
    key:STANDARD_CACHE_KEY,
    evictionPeriod: EVICTION_TIME,
    refreshOnAccess: false //refresh on add is enabled, default is refresh on access
})
```

#### Size Limit Eviction

Per default the cache size is limited by its ram, however it is possible to limit the size of a cache
by adding a cacheSize parameter. Then the eviction happens on every insert with an LRU algorithm.

The maximum cache  size can be set with the maxCacheSize cache config parameter:
```typescript
@Cached({
    key:STANDARD_CACHE_KEY,
    evictionPeriod: EVICTION_TIME,
    maxCacheSize: 100 //maximum cache size now set to 100 elements, will not be exceeded
})
```




## Helper Functions for Navigations

### Navgational Meta Data

One of the "nasty" things of angular is that enforces
a distributed configuration of metadata especially
in the navigational area.

ts-ng-tinydecorations
tries to keep the metadata at class declaration level.
(Data should always be defined at its origin)


While we cannot encapsule the navigational definitions
in decorators we can ease the life by providing neutral
ways to push the navigational metadata into the routing configuration.

#### The MetaData Class - Simple Case

The metadata helper class allows you to access decorated
metadata from a given decorated angular artifact.

What does this mean for navigation?

```typescript
@Controller({
    name: "View1Ctrl",
    template: `hello world`,
    controllerAs:"ctrl"
})
export class View1Controller {
    myVar = "myVar";

    constructor() {
    }
}


@NgModule({
    name: "myApp.view1",
    declarations: [View1Controller]
})
export class View1Module {
    constructor() {
    }
}
```


For ngRoutes:
```typescript
$routeProvider.when("/myState",MetaData.routeData(View1Controller))
```

For UIRoutes

```typescript
$stateProvider.state(
   MetaData.routeData(View1Controller, 
        {
            name: "myState",
            url:"/myState"
        }
   )
)
```

#### Or More Fine Grained 

```typescript
$stateProvider.state({
    name: "myState",
    url:"/myState",
    controller: MetaData.controllerName(View1Controller),
    template: MetaData.template(View1Controller),
    controllerAs: MetaData.controllerAs(View1Controller)
})
```

As you can see the controller name, template and controllerAs 
are defined on controller level.
All other definitions either directly access the metadata, or
use helpers on the controller class to access it.

```typescript 
    controller: MetaData.controllerName(View1Controller),
    template: MetaData.template(View1Controller),
    controllerAs: MetaData.controllerAs(View1Controller)
```



