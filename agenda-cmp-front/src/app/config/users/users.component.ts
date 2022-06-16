import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { UsersDataSource, UsersItem } from './users-datasource';
import { UserService } from '../../services/users.service';
import { ChartService } from '../../services/chart.service';
import { UserOptionsComponent } from '../../dialogs/user-options/user-options.component';
import { MatDialog } from '@angular/material';
import { NewPatientComponent } from '../../dialogs/new-patient/new-patient.component';
import { NewDoctorComponent } from '../../dialogs/new-doctor/new-doctor.component';
import { NewAssistantComponent } from '../../dialogs/new-assistant/new-assistant.component';
import { NewAdmEmpresaComponent } from '../../dialogs/new-adm-empresa/new-adm-empresa.component';
import { NewAdmSucursalComponent } from 'src/app/dialogs/new-adm-sucursal/new-adm-sucursal.component';

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() type:
    | "adm_empresa"
    |  "adm_sucursal"
    | "especialista"
    | "paciente"
    | "asistente"
    | "enfermero"
    | "ecografista"
    | "laboratorista"
    |  "gestor_examenes"
    |  "asistentes_caja";
  dataSource: UsersDataSource;
  def: UsersDataSource;
  backupData: any;
  processing: boolean = false;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    "id",
    "name",
    "surname",
    "dni",
    "phone",
    "email",
    "status",
  ];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private chartService: ChartService
  ) {}

  ngOnInit() {
    this.dataSource = new UsersDataSource(this.paginator, this.sort);
    this.def = new UsersDataSource(this.paginator, this.sort);
    if (this.type != "paciente") this.displayedColumns.push("branch_office");
    this.getUsers();
  }

  applyFilter(filterValue: string) {
    this.def = new UsersDataSource(this.paginator, this.sort);
    this.def.data = [...this.backupData];
    this.def.data = [...this.def.filter(filterValue)];
    this.dataSource = this.def;
  }

  options(r) {
    //console.log(r);
    let d = this.dialog.open(UserOptionsComponent, {
      data: Object.assign(r, { type: this.type }),
      width: "50vw",
    });
    d.afterClosed().subscribe(
      (result) => {
        if (result.updated) this.getUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  newPatient() {
    let d = this.dialog.open(NewPatientComponent, {
      width: "50vw",
    });
    d.afterClosed().subscribe(
      (res) => {
        if (res.created) this.getUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  /**
   * ? 11 septiembre
   */
  newAdmEmpresa() {
    let d = this.dialog.open(NewAdmEmpresaComponent, {
      width: "50vw",
    });
    d.afterClosed().subscribe(
      (res) => {
        if (res.created) this.getUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  newAdmSucursal() {
    let d = this.dialog.open(NewAdmSucursalComponent, {
      width: "50vw",
    });
    d.afterClosed().subscribe(
      (res) => {
        if (res.created) this.getUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  newDoc() {
    let d = this.dialog.open(NewDoctorComponent, {
      width: "50vw",
    });
    d.afterClosed().subscribe(
      (res) => {
        if (res.created) this.getUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  newAssistant() {
    let d = this.dialog.open(NewAssistantComponent, {
      width: "50vw",
      data: { role: [4] },
    });
    d.afterClosed().subscribe(
      (res) => {
        if (res.created) this.getUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  newEcografista() {
    let d = this.dialog.open(NewAssistantComponent, {
      width: "50vw",
      data: { role: [6]},
    });
    d.afterClosed().subscribe(
      (res) => {
        if (res.created) this.getUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  newLaboratorista() {
    let d = this.dialog.open(NewAssistantComponent, {
      width: "50vw",
      data: { role: [7]},
    });
    d.afterClosed().subscribe(
      (res) => {
        if (res.created) this.getUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  newEnfermero() {
    let d = this.dialog.open(NewAssistantComponent, {
      width: "50vw",
      data: { role: [5]},
    });
    d.afterClosed().subscribe(
      (res) => {
        if (res.created) this.getUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  /**
   * 14 sept
   */
  newGestorExamenes() {
    let d = this.dialog.open(NewAssistantComponent, {
      width: "50vw",
      data: { role: [10] },
    });
    d.afterClosed().subscribe(
      (res) => {
        if (res.created) this.getUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  newAsistenteCaja() {
    let d = this.dialog.open(NewAssistantComponent, {
      width: "50vw",
      data: { role: [11] },
    });
    d.afterClosed().subscribe(
      (res) => {
        if (res.created) this.getUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  usersReport() {
    let val = 3;
    if (this.type == "especialista") val = 2;
    if (this.type == "asistente") val = 4;

    this.chartService.usersReport(val).subscribe(
      (res: any) => this.generateXls(res, this.type),
      (error) => {
        console.log(error);
      }
    );
  }

  generateXls(res: any, filename: string) {
    let _blob = new Blob([res], { type: "application/vnd.ms-excel" });
    var url = window.URL.createObjectURL(_blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display: none");
    a.href = url;
    a.download = `r-${filename}.xls`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  getUsers() {
    this.processing = true;
    this.def = new UsersDataSource(this.paginator, this.sort);
    this.userService.getUsers(this.type).subscribe(
      (res: UsersItem[]) => {
        console.log(res)
        this.processing = false;
        this.def.data = res;
        this.backupData = res;
        this.dataSource = this.def;
      },
      (error) => {
        this.processing = false;
        console.log(error);
      }
    );
  }
}
