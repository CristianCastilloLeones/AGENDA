import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API, setHeaders } from './api.route';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class ConsultaService {
  private subject = new Subject<any>();
  private newLabSub = new Subject<any>();
  private newEcoSub = new Subject<any>();
  private labSubject = new Subject<any>();
  private delRecItemSubject = new Subject<any>();

  constructor(private http: HttpClient) {}

  setDiet(data: { diet: string; patient: number | string }) {
    return this.http.post(`${API}/diet`, data, {
      headers: setHeaders(),
    });
  }

  getAllergies(id) {
    return this.http.get(`${API}/allergies/${id}`, {
      headers: setHeaders(),
    });
  }

  updateAllergies(id, allergies) {
    return this.http.patch(`${API}/allergies/${id}`, allergies, {
      headers: setHeaders(),
    });
  }

  getDiet(id) {
    return this.http.get(`${API}/diet/${id}`, {
      headers: setHeaders(),
    });
  }

  listDiets(id) {
    return this.http.get(`${API}/diet/byUser/${id}`, {
      headers: setHeaders(),
    });
  }

  createCert(data) {
    return this.http.post(`${API}/certificado/`, data, {
      headers: setHeaders(),
    });
  }

  editEco(data: any) {
    return this.http.patch(`${API}/ecografia/${data.id}`, data, {
      headers: setHeaders(),
    });
  }

  editLab(data: any) {
    return this.http.patch(`${API}/laboratory/${data.id}`, data, {
      headers: setHeaders(),
    });
  }

  getCert(id: number) {
    return this.http.get(`${API}/certificado/${id}`, {
      headers: setHeaders(),
    });
  }

  setCert(data: any) {
    return this.http.post(`${API}/certificado`, data, {
      headers: setHeaders(),
    });
  }

  updatePapaPrice(data: any) {
    return this.http.patch(`${API}/papanicolao/price`, data, {
      headers: setHeaders(),
    });
  }

  fillPapa(id) {
    return this.http.patch(
      `${API}/papanicolao/fillMuestra/${id}`,
      {},
      {
        headers: setHeaders(),
      }
    );
  }

  deliveryMuestra(id) {
    return this.http.patch(
      `${API}/papanicolao/deliveryMuestra/${id}`,
      {},
      {
        headers: setHeaders(),
      }
    );
  }

  preFactLab(id, xtotal) {
    return this.http.post(
      `${API}/laboratory/prefact/${id}`,
      { total: xtotal },
      {
        headers: setHeaders(),
      }
    );
  }

  getExxLabs(id: number | string) {
    return this.http.get(`${API}/laboratories/${id}`, {
      headers: setHeaders(),
    });
  }

  getPapaPrice() {
    return this.http.get(`${API}/papanicolao/price`, {
      headers: setHeaders(),
    });
  }

  setPapa(data: any) {
    return this.http.post(`${API}/papanicolao`, data, {
      headers: setHeaders(),
    });
  }

  getPapa(prefact: number | string | boolean) {
    return this.http.get(`${API}/papanicolao/list/${prefact}`, {
      headers: setHeaders(),
    });
  }

  preFactPapa(id, xtotal) {
    return this.http.patch(
      `${API}/papanicolao/prefact/${id}`,
      { total: xtotal },
      {
        headers: setHeaders(),
      }
    );
  }

  getExLabs(prefact: number | string | boolean) {
    return this.http.get(`${API}/laboratory/${prefact}`, {
      headers: setHeaders(),
    });
  }

  ecoGrafList(prefact, start?, end?) {
    let route =
      start && end
        ? `${API}/ecoreg/${prefact}/${start}/${end}`
        : `${API}/ecoreg/${prefact}`;
    return this.http.get(route, {
      headers: setHeaders(),
    });
  }

  newEcograf(data, patient?) {
    patient && Object.assign(data, { event: patient.id_consulta });
    return this.http.post(`${API}/ecoreg`, data, {
      headers: setHeaders(),
    });
  }

  prefactEco(id: number | string) {
    return this.http.get(`${API}/ecografia/prefact/${id}`, {
      headers: setHeaders(),
    });
  }

  revokeEco(id: number | string) {
    return this.http.get(`${API}/ecografia/revoke/${id}`, {
      headers: setHeaders(),
    });
  }

  pushRecItem(receta: any, diagnostico: any) {
    const z = Object.assign({}, receta, diagnostico);
    this.subject.next(z);
  }

  deleteRecTime(index: any) {
    this.delRecItemSubject.next(index);
  }

  itemDeleted() {
    return this.delRecItemSubject.asObservable();
  }

  recipeStream(): Observable<any> {
    return this.subject.asObservable();
  }

  labStream(): Observable<any> {
    return this.labSubject.asObservable();
  }

  getHistorial(dni = null, start = null, end = null) {
    return this.http.get(`${API}/patient/historial/${dni}/${start}/${end}`, {
      headers: setHeaders(),
    });
  }

  getHistoria(id: string | number) {
    console.log(`${API}/historia/${id}`);
    return this.http.get(`${API}/historia/${id}`, {
      headers: setHeaders(),
    });
  }

  pushLabData(data: any) {
    this.labSubject.next(data);
  }

  saveLab(data: any) {
    return this.http.post(`${API}/laboratory`, data, {
      headers: setHeaders(),
    });
  }

  createLab(data: any) {
    return this.http.post(`${API}/laboratory/new`, data, {
      headers: setHeaders(),
    });
  }

  saveDiagnostico(data: any) {
    return this.http.post(`${API}/diagnostico`, data, {
      headers: setHeaders(),
    });
  }

  filterCie(value) {
    return this.http.get(`${API}/cie/${value}`, {
      headers: setHeaders(),
    });
  }

  saveHistory(data: any) {
    return this.http.post(`${API}/consulta`, data, {
      headers: setHeaders(),
    });
  }

  loadHistory(hcl, event) {
    return this.http.get(`${API}/consulta/${hcl}/${event}`, {
      headers: setHeaders(),
    });
  }

  getInventary() {
    return this.http.get(`${API}/cie/inventary`, {
      headers: setHeaders(),
    });
  }

  getRecipe(id: string | number) {
    return this.http.get(`${API}/receta/${id}`, {
      headers: setHeaders(),
    });
  }

  newLabStream() {
    return this.newLabSub.asObservable();
  }

  addLabToHist(lab: any) {
    this.newLabSub.next(lab.selectedLabs);
  }

  newEcoStream() {
    return this.newEcoSub.asObservable();
  }

  addEcoToHist(eco: any) {
    let ecoes = [];
    let price = 0;
    eco.eco.forEach((e) => {
      ecoes.push(e.generic);
      price += e.unit_price;
    });
    this.newEcoSub.next({ ecos: `${ecoes.join(", ")}.`, price });
  }
  checkRecipeByPatientToday(data: any) {
    return this.http.post(`${API}/checkRecipe`, data, {
      headers: setHeaders(),
    });
  }
}
