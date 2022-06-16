import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API, FQAPI, setHeaders } from './api.route';
import { UsersItem } from '../config/users/users-datasource';

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  createPatient(patient) {
    return this.http.post(`${API}/patient`, patient, {
      headers: setHeaders(),
    });
  }

  getAge(dni) {
    return this.http.get(`${API}/patient/age/${dni}`, {
      headers: setHeaders(),
    });
  }

  getBranches() {
    return this.http.get(`${API}/companyBranches`, {
      headers: setHeaders(),
    });
  }
  getUsersFQ() {
    return this.http.get(`${FQAPI}/getAllUsers`, {
      headers: setHeaders(),
    });
  }
  getClientsFQ() {
    return this.http.get(`${FQAPI}/client`, {
      headers: setHeaders(),
    });
  }
  getUsers(
    type:
      | "adm_empresa"
      | "adm_sucursal"
      | "especialista"
      | "paciente"
      | "asistente"
      | "enfermero"
      | "ecografista"
      | "laboratorista"
      | "gestor_examenes"
      | "asistentes_caja"
  ) {
    switch (type) {
      case "adm_empresa":
        return this.http.get<UsersItem[]>(`${API}/admEmpresa`, {
          headers: setHeaders(),
        });
        break;
      case "adm_sucursal":
        return this.http.get<UsersItem[]>(`${API}/admSucursal`, {
          headers: setHeaders(),
        });
        break;
      case "especialista":
        return this.http.get<UsersItem[]>(`${API}/docs`, {
          headers: setHeaders(),
        });
        break;
      case "paciente":
        return this.http.get<UsersItem[]>(`${API}/patients`, {
          headers: setHeaders(),
        });
        break;
      case "asistente":
        return this.http.get<UsersItem[]>(`${API}/assistant`, {
          headers: setHeaders(),
        });
        break;
      case "enfermero":
        return this.http.get<UsersItem[]>(`${API}/enfermero`, {
          headers: setHeaders(),
        });
        break;
      case "ecografista":
        return this.http.get<UsersItem[]>(`${API}/ecografista`, {
          headers: setHeaders(),
        });
        break;
      case "laboratorista":
        return this.http.get<UsersItem[]>(`${API}/laboratorista`, {
          headers: setHeaders(),
        });
      case "gestor_examenes":
        return this.http.get<UsersItem[]>(`${API}/gestorExamenes`, {
          headers: setHeaders(),
        });
      case "asistentes_caja":
        return this.http.get<UsersItem[]>(`${API}/asistentesCaja`, {
          headers: setHeaders(),
        });
        break;
      default:
        return this.http.get<UsersItem[]>(`${API}/users`, {
          headers: setHeaders(),
        });
        break;
    }
  }

  createDoc(data: any) {
    return this.http.post(`${API}/doc`, data, {
      headers: setHeaders(),
    });
  }
  /**
   * ? 11 Sep
   */
  createAdmEmp(data: any) {
    console.log(data);
    return this.http.post(`${API}/admEmpresa`, data, {
      headers: setHeaders(),
    });
  }
  /**
   * 14 sept
   */
  createAdmSucursal(data: any) {
    console.log(data);
    return this.http.post(`${API}/admSucursal`, data, {
      headers: setHeaders(),
    });
  }
  checkUserFQ(creds: { id: string; password: string }) {
    console.log(creds);
    return this.http.post(`${FQAPI}/checkUserFQ/`, creds, {
      headers: setHeaders(),
    });
  }
  createAssistant(data: any) {
    return this.http.post(`${API}/assistant`, data, {
      headers: setHeaders(),
    });
  }

  createEnfermero(data: any) {
    return this.http.post(`${API}/enfermero`, data, {
      headers: setHeaders(),
    });
  }

  disableUser(data: { id: number }) {
    return this.http.patch(`${API}/user/toggle-status`, data, {
      headers: setHeaders(),
    });
  }

  getPatients() {
    return this.http.get(`${API}/patients`, {
      headers: setHeaders(),
    });
  }

  getLaboratoristas() {
    return this.http.get(`${API}/laboratorista`, {
      headers: setHeaders(),
    });
  }

  getAllDocs() {
    return this.http.get(`${API}/docs`, {
      headers: setHeaders(),
    });
  }

  getDocs(specialty: number) {
    return this.http.get(`${API}/docs/${specialty}`, {
      headers: setHeaders(),
    });
  }

  updateUser(user) {
    return this.http.patch(`${API}/user`, user, {
      headers: setHeaders(),
    });
  }
}
