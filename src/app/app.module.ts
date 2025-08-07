import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeEsMx from '@angular/common/locales/es-MX';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MatPaginatorIntl, MAT_PAGINATOR_DEFAULT_OPTIONS } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IPublicClientApplication, PublicClientApplication, InteractionType } from '@azure/msal-browser';
import {
    MsalGuard,
    MsalInterceptor,
    MsalBroadcastService,
    MsalInterceptorConfiguration,
    MsalModule,
    MsalService,
    MSAL_GUARD_CONFIG,
    MSAL_INSTANCE,
    MSAL_INTERCEPTOR_CONFIG,
    MsalGuardConfiguration,
    MsalRedirectComponent,
} from '@azure/msal-angular';
import { MatTooltipModule, TooltipComponent } from '@angular/material/tooltip';

import { msalConfig, loginRequest, protectedResources } from './auth-config';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared';
import { getEsPaginatorIntl, matPaginatorDefaultOptions } from './utils/helpers';
import { NzNotificationComponent } from 'ng-zorro-antd/notification';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
//import { DetailsIndicatorComponent } from './ui/detail_indicator/details-indicator/details-indicator.component';
//import { IndicatorsComponent } from './ui/indicators/indicators/indicators.component';
//import { AuditComponent } from './utils/interfaces/audit/audit.component';

registerLocaleData(localeEsMx, 'es-MX');
const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

/**
 * Here we pass the configuration parameters to create an MSAL instance.
 */
export function MSALInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication(msalConfig);
}

/**
 * MSAL Angular will automatically retrieve tokens for resources
 * added to protectedResourceMap.
 */
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const protectedResourceMap = new Map<string, Array<string>>();

    protectedResourceMap.set(protectedResources.todoListApi.endpoint, protectedResources.todoListApi.scopes);

    return {
        interactionType: InteractionType.Redirect,
        protectedResourceMap,
    };
}

/**
 * Set your default interaction type for MSALGuard here. If you have any
 * additional scopes you want the user to consent upon login, add them here as well.
 */
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
    return {
        interactionType: InteractionType.Redirect,
        authRequest: loginRequest,
    };
}
/*Object.defineProperty(TooltipComponent.prototype, 'message', {
    set(v: any) {
        const el = document.querySelectorAll('.mat-tooltip');

        if (el) {
            el[el.length - 1].innerHTML = v;
        }
    },
});*/
@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent, MsalRedirectComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
        CoreModule,
        SharedModule,
        MsalModule,
        FormsModule,
        ReactiveFormsModule,
        NzNotificationComponent,
        NzButtonModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true,
        },
        {
            provide: MSAL_INSTANCE,
            useFactory: MSALInstanceFactory,
        },
        {
            provide: MSAL_GUARD_CONFIG,
            useFactory: MSALGuardConfigFactory,
        },
        {
            provide: MSAL_INTERCEPTOR_CONFIG,
            useFactory: MSALInterceptorConfigFactory,
        },
        MsalService,
        MsalGuard,
        MsalBroadcastService,
        { provide: LOCALE_ID, useValue: 'es-MX' },
        { provide: MatPaginatorIntl, useValue: getEsPaginatorIntl() },
        {
            provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
            useValue: matPaginatorDefaultOptions,
        },
        { provide: NZ_I18N, useValue: en_US },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
