import { Component, OnInit } from '@angular/core';
import { OAuthService, JwksValidationHandler, AuthConfig } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';

const authConfig: AuthConfig = {
 
  // Url of the Identity Provider OKTA TOKEN 1 HOUR
  //issuer: 'https://dev-120928.oktapreview.com',
  // Url authorize server custom with token 5 min 
  issuer: 'https://dev-120928.oktapreview.com/oauth2/default',
 
  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '',

   // URL of the SPA to redirect the user after silent refresh
  silentRefreshRedirectUri: window.location.origin + '/assets/silent-refresh.html',
 
  // The SPA's id. The SPA is registerd with this id at the auth-server
  clientId: '0oahcep0nuuPVlUTF0h7',
 
  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: 'openid profile email',
  responseType : 'id_token token token_expires',
  timeoutFactor: 0.8,
  showDebugInformation: true,
  silentRefreshIFrameName: 'XXXXXXX-refresh',
  silentRefreshShowIFrame: true
}

// const authConfig: AuthConfig = {
 
//   // Url of the Identity Provider
//   issuer: 'https://auth.dev.interne.montreal.ca',
 
//   // URL of the SPA to redirect the user to after login
//   redirectUri: window.location.origin +'/authorize',

//   // URL of the SPA to redirect the user after silent refresh
//   silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
 
//   // The SPA's id. The SPA is registerd with this id at the auth-server
//   clientId: '@!4025.CA62.9BB6.16C5!0001!2212.0010!0008!2212.0070',
 
//   // set the scope for the permissions the client should request
//   // The first three are defined by OIDC. The 4th is a usecase-specific one
//   scope: 'openid profile user_name',
//   responseType : 'id_token token token_expires'
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  
  constructor(private oauthService: OAuthService) {
    
  }

  async ngOnInit() {
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();

    // Load Discovery Document and then try to login the user
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();
    
    // Silent refresh activate
    this.oauthService.setupAutomaticSilentRefresh();
    
    this.oauthService.events.subscribe(e => {
      // tslint:disable-next-line:no-console
      console.log('oauth/oidc event', e);
    });
    this.oauthService.events
    .pipe(filter(e => e.type === 'token_received'))
    .subscribe(e => {
      console.log('RECEIVED token event', e);
      // this.oauthService.loadUserProfile();
    });
  }
}
