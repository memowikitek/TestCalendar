import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { AccountInfo, InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { UsersService } from './core/services';

@Component({
    selector: 'app-root',
    //standalone: true,
    //imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
    private readonly _destroying$: Subject<void>;
    constructor(
        @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
        private authService: MsalService,
        private broadcastService: MsalBroadcastService,
        private readonly router: Router,
        private readonly users: UsersService
    ) {
        this._destroying$ = new Subject<void>();
    }

    ngOnInit(): void {
        this.broadcastService.inProgress$
            .pipe(
                filter((status: InteractionStatus) => status === InteractionStatus.None),
                takeUntil(this._destroying$)
            )
            .subscribe({
                next: (response) => {
                    let account: AccountInfo = this.authService.instance.getAllAccounts().find(() => true);
                    if (!!account) {
                        // this.router.navigate(['/welcome-screen']);
                    } else {
                        this.router.navigate(['/login']);
                    }
                },
                error: (error) => {
                    // console.log('Error');
                    console.error(error);
                    this.router.navigate(['/unauthorized']);
                },
            });
    }

    ngOnDestroy(): void {
        this._destroying$.next(undefined);
        this._destroying$.complete();
    }
}
