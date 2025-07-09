(self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;

import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideServiceWorker } from '@angular/service-worker';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideAppCheck, initializeAppCheck } from '@angular/fire/app-check';
import { ReCaptchaV3Provider } from '@angular/fire/app-check';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(CommonModule, FormsModule, BrowserAnimationsModule),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideAnimations(), 
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideFunctions(() => getFunctions(undefined, 'us-central1')),
    provideAppCheck(() =>
      initializeAppCheck(undefined, {
        provider: new ReCaptchaV3Provider('6LeW63orAAAAAJPOCcJaDcdTohJSxNJzVxJSx3Vj'),
        isTokenAutoRefreshEnabled: true,
      }))
  ]
}).catch((err) => console.error(err));

