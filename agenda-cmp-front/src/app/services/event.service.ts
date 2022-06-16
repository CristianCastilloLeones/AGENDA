import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API, setHeaders } from './api.route';
import { Subject, Observable } from 'rxjs';
@Injectable({
  providedIn: "root",
})
export class EventService {
  private patient = new Subject<any>();

  constructor(private http: HttpClient) {}

  getRelatedLabs(event: string | number) {
    return this.http.get(`${API}/get-events-labs/${event}`, {
      headers: setHeaders(),
    });
  }

  getRelatedEcos(event: string | number) {
    return this.http.get(`${API}/get-events-ecos/${event}`, {
      headers: setHeaders(),
    });
  }

  downloadEco(id: string | number): Observable<ArrayBuffer> {
    return this.http.get(`${API}/printeco/${id}`, {
      headers: setHeaders(),
      responseType: "arraybuffer",
    });
  }

  downloadLab(id: string | number): Observable<ArrayBuffer> {
    return this.http.get(`${API}/print_lab/${id}`, {
      headers: setHeaders(),
      responseType: "arraybuffer",
    });
  }

  downloadDiet(id: string | number): Observable<ArrayBuffer> {
    return this.http.get(`${API}/printdiet/${id}`, {
      headers: setHeaders(),
      responseType: "arraybuffer",
    });
  }

  downloadPapa(id: string | number): Observable<ArrayBuffer> {
    return this.http.get(`${API}/printpapa/${id}`, {
      headers: setHeaders(),
      responseType: "arraybuffer",
    });
  }

  downloadCert(id: string | number): Observable<ArrayBuffer> {
    return this.http.get(`${API}/printcert/${id}`, {
      headers: setHeaders(),
      responseType: "arraybuffer",
    });
  }

  create(event: {
    doc: number;
    specialty: number,
    patient: number;
    day: any;
    timeblock?: number;
    observation: any;
  }) {
    return this.http.post(`${API}/event`, event, {
      headers: setHeaders(),
    });
  }
  createDerivation(event: {
    doc: number;
    specialty: number,
    patient: number;
    day: any;
    timeblock?: number;
    observation: any;
  }) {
    return this.http.post(`${API}/eventDerivation`, event, {
      headers: setHeaders(),
    });
  }
  checkEventByPatientToday(event: {
    doc: number;
    patient: number;
    day: any;
    timeblock?: number;
    observation: any;
  }) {
    return this.http.post(`${API}/checkEvent`, event, {
      headers: setHeaders(),
    });
  }
  countEventsToday(id: number, date: any) {
    return this.http.get(`${API}/doc/${id}/${date}/getTodayEvents`, {
      headers: setHeaders(),
    });
  }

  allToday() {
    return this.http.get(`${API}/events`, {
      headers: setHeaders(),
    });
  }

  reagendar(id, event) {
    return this.http.patch(`${API}/event/reagendar/${id}`, event, {
      headers: setHeaders(),
    });
  }

  finalize(id, event) {
    return this.http.patch(`${API}/event/finalize/${id}`, event, {
      headers: setHeaders(),
    });
  }

  cancel(id, xobservartion: string) {
    return this.http.patch(
      `${API}/event/cancel/${id}`,
      {
        observation: xobservartion,
      },
      {
        headers: setHeaders(),
      }
    );
  }

  getEvent(id: string | number) {
    return this.http.get(`${API}/event/${id}`, {
      headers: setHeaders(),
    });
  }

  getByDoc(doc) {
    return this.http.get(`${API}/doc/${doc}/events`, {
      headers: setHeaders(),
    });
  }

  getByUsers(id: string | number) {
    return this.http.get(`${API}/events/${id}`, {
      headers: setHeaders(),
    });
  }

  getDiag(id: string | number) {
    return this.http.get(`${API}/event/rel/${id}`, {
      headers: setHeaders(),
    });
  }

  downloadRecipe(id: string | number): Observable<ArrayBuffer> {
    return this.http.get(`${API}/recipe/${id}`, {
      headers: setHeaders(),
      responseType: "arraybuffer",
    });
  }
}
