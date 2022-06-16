import { HttpHeaders } from '@angular/common/http';

export const API = 'http://74.127.61.115:97/api';
//export const API = 'http://localhost:8000/api';
export const FQAPI = 'http://74.127.61.115:9300/api';
export function setHeaders(): HttpHeaders {

  const token = localStorage.getItem('token');

  if (token) {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
  }

  return new HttpHeaders({});

}
