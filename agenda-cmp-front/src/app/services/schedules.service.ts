import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API, setHeaders} from './api.route';
import { TimeBlock } from '../interfaces/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  constructor(private http : HttpClient) { }

  public getTimeBlocks(){
  	return this.http.get(`${API}/timetables`, {
  		headers : setHeaders()
  	});
  }

  public getAvailability(doc:number, date:string){
    return this.http.get(`${API}/event/${doc}/${date}`, {
      headers : setHeaders()
    });
  }

  public getSchedule($id){
  	return this.http.get(`${API}/schedule/${$id}`, {
  		headers : setHeaders()
  	});
  }

  public saveSchedule(schedule, xuser){
  	return this.http.post(`${API}/schedule`, {
  		time : schedule,
  		user : xuser.id
  	}, {
  		headers : setHeaders()
  	});
  }

}
