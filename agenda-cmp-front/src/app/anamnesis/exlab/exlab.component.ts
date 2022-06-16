import { Component, OnInit, Input, Inject, Optional, ViewChild } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { ConsultaService } from '../../services/consulta.service';
import { EventService } from '../../services/event.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NgSelectComponent } from '@ng-select/ng-select';
import { generatePDF } from '../../dialogs/diag-report/diag-report.component';
import { UserService } from 'src/app/services/users.service';
import { NewPatientComponent } from 'src/app/dialogs/new-patient/new-patient.component';

@Component({
  selector: "app-exlab",
  templateUrl: "./exlab.component.html",
  styleUrls: ["./exlab.component.css"]
})
export class ExlabComponent implements OnInit {
  pacientes: any[];
  breakpoint:any;
  labs = [];
  groupArr = [];
  selectedLabs: any=[];
  total: number = 0;
  processing = false;
  processing2 = true;
  top = "top";
  showPrefact = window.location.pathname != "/consulta";
  prefact: boolean = false;
  paciente: any;
  laboratorista: any;
  observation = null;
  patients = [];
  labora = [];
  @Input() patient: any;
  @Input() event?: number | string;
  @Input() event1?: number | string;
  @ViewChild("selectM") selectM: NgSelectComponent;
  role = localStorage.getItem("role");
@ViewChild('mySelect') mySelect:any;

  constructor(
    private configService: ConfigService,
    private consultaService: ConsultaService,
    private eventService: EventService,
    private dialog: MatDialog,
    private userService: UserService,
    @Optional() private dialogRef?: MatDialogRef<ExlabComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() public refData?: any
  ) {
    if (refData) {
      this.event = refData.id;
      this.event1 = refData.id;
      this.prefact = refData.prefact;
      this.consultaService.getExxLabs(refData.id).subscribe(
        (res: any[]) => {
          this.selectedLabs = res;
          this.calcTotal();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  newPatient() {
    const d = this.dialog.open(NewPatientComponent, {
      width: "800px",
    });
    d.afterClosed().subscribe(
      (res) => {
        this.patients.push(res.user);
        this.patients = [...this.patients];
        res.user["fullName"] = res.user.name + " " + res.user.surname;
        this.paciente = res.user;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  calcTotal() {
    this.total = 0;
    this.selectedLabs.forEach((val) => {
      this.total += Number.parseFloat(val.unit_price);
      this.total.toFixed(2);
    });
  }

  ngOnInit() {
    this.getLaboratories();
    this.getLaboratoristas();
    if (this.showPrefact) {
      this.getPatients();
    }
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 1;
    this.processing2=false;
  }
onResize(event) {
  this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 1;
}
  printExLab(id: number) {
    this.eventService.downloadLab(id).subscribe(
      (res) => generatePDF(res, "laboratorio"),
      (error) => {
        new SwalComponent({
          type: "error",
          toast: true,
          html: "<p>Error al imprimir</p>",
          timer: 1500,
        }).show();
      }
    );
  }

  getPatients() {
    this.userService.getPatients().subscribe(
      (res: any[]) => {
        let patients = res;

        patients = patients.map((val) => {
          val.fullName = val.name + " " + val.surname;
          return val;
        });

        this.pacientes = patients;

        if (this.patient) {
          let p =
            patients[
              patients.findIndex((el) => {
                return el.id == this.patient.id;
              })
            ];
          //this.ecoRegForm.get("patient").setValue(p);
          document
            .getElementById("patient-text")
            .setAttribute("readonly", "readonly");
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getLaboratoristas() {
    this.userService.getLaboratoristas().subscribe(
      (res: any[]) => {
        this.labora = res;
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  prefacturar() {
    if (this.total < 1) return;
    this.processing = true;
    this.consultaService.preFactLab(this.refData.id, this.total).subscribe(
      (res) => {
        this.processing = false;
        new SwalComponent({
          type: "success",
          toast: true,
          html: "<p>Procesado correctamente</p>",
          timer: 1500,
        }).show();
        this.printExLab(<number>this.event);
        this.dialogRef.close(true);
      },
      (err) => {
        this.processing = false;
        new SwalComponent({
          type: "error",
          toast: true,
          html: "<p>Error al prefacturar</p>",
          timer: 1500,
        }).show();
      }
    );
  }


  save() {
    this.processing = true;
    if (!this.event && !this.paciente) {
      this.processing = false;
      return;
    }else if(this.selectedLabs.length === 0){
      new SwalComponent({
          toast: true,
          type: "error",
          html: "<p>Debe seleccionar al menos un examen</p>",
          timer: 1500,
        }).show();
        this.processing = false;
    }else{
      const data = {
      selectedLabs: this.selectedLabs,
      event: this.showPrefact ? this.paciente.id : this.event["id"],
      event1: this.showPrefact ? this.laboratorista.id : this.event["id"],
      total: this.total,
      patient: this.paciente || this.event,
      labora: this.laboratorista || this.event1,
      observation: this.observation,
    };
    console.log(data);
    this.consultaService.saveLab(data).subscribe(
      (res) => {
        new SwalComponent({
          toast: true,
          type: "success",
          html: "<p>Procesado correctamente</p>",
          timer: 1500,
        }).show();
        this.processing = false;
        this.consultaService.addLabToHist(data);
        this.total = 0;
        this.selectedLabs = [];
        this.observation = "";
        if (this.role == "2") this.printExLab(res["id"]);
        this.dialogRef.close();
      },
      (error) => {
        this.processing = false;
        new SwalComponent({
          toast: true,
          type: "error",
          html: "<p>Ha ocurrido un error</p>",
          timer: 1500,
        }).show();
      }
    );
    }

  }

  getLaboratories() {
    this.processing = true;

    this.configService.getLabs().subscribe(
      (res: any) => {
        this.processing = false;
        this.labs = res;
        console.log(res);
        this.groupArr = this.labs.reduce((r,{cat})=>{
        if(!r.some(o=>o.cat==cat)){
          r.push({cat,groupItem:this.labs.filter(v=>v.cat==cat)});
    }
    return r;
    },[]);
    console.log(this.groupArr);
      },
      (error) => {
        this.processing = false;
        console.log(error);
      }
    );
  }
  onCheckboxChecked(event, element) {

  if (event.checked) {

    this.selectedLabs.push(element);
  } else {

    let index = this.selectedLabs.indexOf(element);
    if (index > -1) {
      this.selectedLabs.splice(index, 1);
    }
  }
  console.log(JSON.stringify(this.selectedLabs));
  this.calcTotal();
}
}
