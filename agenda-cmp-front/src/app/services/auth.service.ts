import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API, setHeaders } from './api.route';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }

  login(creds : {email : string, password : string}){
  	return this.http.post(API+"/login", creds, {
      headers : setHeaders()
    });
  }

  verifyCode(xcode, xmail){
    return this.http.post(API+"/verify", {code:xcode, mail:xmail}, {
      headers : setHeaders()
    });    
  }

  resetPassword(xmail){
    return this.http.post(API+"/passreset", {email:xmail}, {
      headers: setHeaders()
    });
  }

  resendCode(xmail){
    return this.http.post(API+"/resend_verification", {mail:xmail}, {
      headers : setHeaders()
    });    
  }

  logout(){
  	return this.http.post(`${API}/logout`, {}, {
  		headers : setHeaders()
  	});
  }

}