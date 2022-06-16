import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API, setHeaders } from './api.route';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http : HttpClient) { }

  getMonthlyEvents(user?){
    if(!user){
      return this.http.get(`${API}/charts/evtspermonth`, {
        headers: setHeaders()
      });
    }else{
      return this.http.get(`${API}/charts/evtspermonth/${user}`, {
        headers: setHeaders()
      });
    }
  }

  eventCountByStatus() {
    return this.http.get(`${API}/charts/eventsCount`, {
      headers: setHeaders()
    });
  }

  getAverage(user?){
  	if(!user){
      return this.http.get(`${API}/charts/successPercentage`, {
        headers : setHeaders()
      });
    }else{
      return this.http.get(`${API}/charts/successPercentage/${user}`, {
        headers : setHeaders()
      });
    }
  }

  usersOrigin(){
  	return this.http.get(`${API}/charts/usersOrigin`, {
  		headers : setHeaders()
  	});
  }

  usersReport(role) : Observable<ArrayBuffer>{
    return this.http.get(`${API}/xls/users/${role}`, {
      headers: setHeaders(),
      responseType: 'arraybuffer'
    });
  }

  eventsReport(user?) : Observable<ArrayBuffer>{
    console.log(user || 'no user');
    if(user){
      return this.http.get(`${API}/xls/events/${user.id}`, {
        headers: setHeaders(),
        responseType: 'arraybuffer'
      });
    }
    return this.http.get(`${API}/xls/events`, {
      headers: setHeaders(),
      responseType: 'arraybuffer'
    });
  }

  hotSpecialties(){
    return this.http.get(`${API}/charts/hotSpecialties`, {
      headers: setHeaders()
    });
  }

}
