import { Injectable } from '@angular/core';
import { AppUserAuth } from './app-user-auth';
import { AppUser } from './app-user';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

// import { LOGIN_MOCKS } from './login-mocks';

const API_URL: string = "http://localhost:3000/api/security";
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  securityObject: AppUserAuth = new AppUserAuth();

  constructor(private http: HttpClient) { }

  login(entity: AppUser): Observable<AppUserAuth> {
    
    this.resetSequrityObject();

    return this.http.post<AppUserAuth>(API_URL + '/login', entity, httpOptions).pipe(
            tap( resp => {
              Object.assign(this.securityObject, resp);
              localStorage.setItem('bearerToken', this.securityObject.bearerToken);
            })
          )

  }
  
  //# begin login to MOCK
  // login(entity: AppUser): Observable<AppUserAuth> {
    
  //   this.resetSequrityObject();

  //   Object.assign(this.securityObject, LOGIN_MOCKS.find(user => user.userName.toLowerCase() === entity.userName.toLowerCase()))

  //   if(this.securityObject.userName !== "") {
  //     localStorage.setItem('bearerToken', this.securityObject.bearerToken);
  //   }

  //   return of<AppUserAuth>(this.securityObject);
  // }
  //# end login to MOCK

  logout(): void {
    this.resetSequrityObject();
  }

  resetSequrityObject(): void {
    
    this.securityObject.userName = "";
    this.securityObject.bearerToken = "";

    this.securityObject.isAuthenticated = false;
    
    this.securityObject.claims = [];

    // this.securityObject.canAccessProducts = false;
    // this.securityObject.canAddProduct = false;
    // this.securityObject.canSaveProduct = false;
    // this.securityObject.canAccessCategories = false;
    // this.securityObject.canAddCategory = false;

    localStorage.removeItem('bearerToken');
    
  }

  // hasClaim(claimType: any, claimValue?: any) {
  //   return this.isClaimValid(claimType, claimValue);
  // }

  hasClaim(claimType: any, claimValue?: any) {
    let ret: boolean = false;

    if (typeof claimType === 'string') {
      ret = this.isClaimValid(claimType, claimValue);
    } else {
      let claims: string[] = claimType;
      if (claims) {
        for(let index = 0; index < claims.length; index++) {
          ret = this.isClaimValid(claims[index]);
          
          if (ret) {
            break;
          }
        }
      }
    }

    return ret; 
  }

  private isClaimValid(claimType: string, claimValue?: string): boolean {
    let ret: boolean = false;
    let auth: AppUserAuth = null;

    auth = this.securityObject;

    if(auth) {
      
      if (claimType.indexOf(':') >= 0) {
        let words: string[] = claimType.split(':');
        claimType = words[0].toLowerCase();
        claimValue = words[1];
      }
      else {
        claimType = claimType.toLowerCase();

        claimValue = claimValue ? claimValue : 'true';
      }

      ret = auth.claims.find(c => c.claimType.toLowerCase() == claimType && c.claimValue == claimValue) != null;
    }

    return ret;
  }
}
