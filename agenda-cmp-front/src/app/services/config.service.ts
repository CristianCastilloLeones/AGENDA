import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API, setHeaders, FQAPI } from './api.route';

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  constructor(private http: HttpClient) {}

  getLabs() {
    return this.http.get(`${API}/laboratory`, {
      headers: setHeaders(),
    });
  }

  getInsurances() {
    return this.http.get(`${API}/config/insurance`, {
      headers: setHeaders(),
    });
  }

  getIdentificationTypes() {
    return this.http.get(`${FQAPI}/entitymasterdataEntity/14`, {
      headers: setHeaders(),
    });
  }

  updateinsurance(data) {
    return this.http.patch(`${API}/config/insurance/${data.id}`, data, {
      headers: setHeaders(),
    });
  }

  saveInsurances(data: any) {
    return this.http.post(`${API}/config/insurance`, data, {
      headers: setHeaders(),
    });
  }

  setLabs(lab: any) {
    return this.http.post(`${API}/laboratory/new`, lab, {
      headers: setHeaders(),
    });
  }

  setCatLab(data: any) {
    return this.http.post(`${API}/config/labcat`, data, {
      headers: setHeaders(),
    });
  }

  getCatLab() {
    return this.http.get(`${API}/config/labcat`, {
      headers: setHeaders(),
    });
  }

  getEcografias() {
    return this.http.get(`${API}/ecografia`, {
      headers: setHeaders(),
    });
  }

  setEcografias(ecografia) {
    return this.http.post(`${API}/ecografia`, ecografia, {
      headers: setHeaders(),
    });
  }

  getSpecialties() {
    return this.http.get(`${API}/specialties`, {
      headers: setHeaders(),
    });
  }
  /**
   * ? 11 sep
   */
  getRoles() {
    return this.http.get(`${API}/roles`, {
      headers: setHeaders(),
    });
  }
  setSpecialties(specialty) {
    return this.http.post(`${API}/specialty`, specialty, {
      headers: setHeaders(),
    });
  }

  updateSpecialty(specialty) {
    return this.http.patch(`${API}/specialty`, specialty, {
      headers: setHeaders(),
    });
  }

  getHolidays() {
    return this.http.get(`${API}/holiday`, {
      headers: setHeaders(),
    });
  }

  getHoliday() {
    return this.http.get(`${API}/holidays`, {
      headers: setHeaders(),
    });
  }

  setHolidays(xdata) {
    return this.http.post(
      `${API}/holiday`,
      { days: xdata },
      {
        headers: setHeaders(),
      }
    );
  }
}
