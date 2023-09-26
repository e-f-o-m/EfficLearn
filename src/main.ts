/* import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module'; */
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { mroutes } from './app/app-routing';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
//import { importProvidersFrom } from '@angular/core';
/* import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; */
//import { HttpRequestInterceptor } from '@core/intercectors/http-request.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(mroutes),
    //importProvidersFrom(HttpClientModule),
    //{ provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
  ]
}).catch((err) => console.error(err));


importProvidersFrom(ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
}))


/* import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err)); */
