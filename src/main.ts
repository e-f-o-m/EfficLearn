/* import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module'; */
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { mroutes } from './app/app-routing';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';
//import { importProvidersFrom } from '@angular/core';
/* import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; */
//import { HttpRequestInterceptor } from '@core/intercectors/http-request.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(mroutes),
    importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"efficlearn","appId":"1:579175726302:web:0a579736652e6552d6964f","databaseURL":"https://efficlearn-default-rtdb.firebaseio.com","storageBucket":"efficlearn.appspot.com","apiKey":"AIzaSyCfj2bFLVFdKhWieOSITjn-QEmmAv3DU7I","authDomain":"efficlearn.firebaseapp.com","messagingSenderId":"579175726302"}))),
    importProvidersFrom(provideDatabase(() => getDatabase())),
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
