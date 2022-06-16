import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ConsultaService } from '../../services/consulta.service';
import { ConfigService } from '../../services/config.service';
import { UserService } from '../../services/users.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { Router } from '@angular/router';
import { NewPatientComponent } from 'src/app/dialogs/new-patient/new-patient.component';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from '../../services/event.service';
import { generatePDF } from '../../dialogs/diag-report/diag-report.component';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: "app-eco-create",
  templateUrl: "./eco-create.component.html",
  styleUrls: ["./eco-create.component.css"],
})
export class EcoCreateComponent implements OnInit {
  ecos: any[];
  pacientes: any[];
  doctores: any[];
  processing = false;
  paciente: any;
  doctor: any;
  total = 0;
  ecoRegForm: FormGroup;
  role = localStorage.getItem("role") == "2" ? 1 : 0;
  @Input() patient: any;
  showPrefact = window.location.pathname != "/consulta";

  selected : any[];
  selectedOptions=[];
  selectedOption;
  constructor(
    private consultaService: ConsultaService,
    private configService: ConfigService,
    private userService: UserService,
    private eventService: EventService,
    private dialog: MatDialog,
    public formBuilder: FormBuilder
  ) {}

  show() {
    console.log(this.ecoRegForm.value);
  }

  buildForm() {
    this.ecoRegForm = this.formBuilder.group({
      doctor: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      patient: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      eco: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      observation: new FormControl(null),
      realizado: new FormControl(null),
      origin: new FormControl({ value: this.role }),
      total: this.total,
    });
  }

  newPatient() {
    const d = this.dialog.open(NewPatientComponent, {
      width: "800px",
    });
    d.afterClosed().subscribe(
      (res) => {
        this.pacientes.push(res.user);
        this.pacientes = [...this.pacientes];
        res.user["fullName"] = res.user.name + " " + res.user.surname;
        this.ecoRegForm.get("patient").setValue(res.user);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  save() {
    this.processing = true;
    this.ecoRegForm.get("eco").setValue(this.selectedOptions);
    if (!this.ecoRegForm.value.patient) {
      this.ecoRegForm.get("patient").setValue(this.patient.id);
    }else if(this.selectedOptions.length === 0){
      new SwalComponent({
          toast: true,
          type: "error",
          html: "<p>Debe seleccionar al menos una ecografia</p>",
          timer: 1500,
        }).show();
        this.processing = false;
    }else{
      this.consultaService
      .newEcograf(this.ecoRegForm.value, this.patient)
      .subscribe(
        (res) => {
          new SwalComponent({
            type: "success",
            html: "<p>Ecografía agendada<p>",
            timer: 1500,
          }).show();
          this.consultaService.addEcoToHist(this.ecoRegForm.value);
          this.ecoRegForm.reset();
          if (this.role == 1) this.printEco(res["id"]);
          this.processing = false;
          this.total = 0;
        },
        (err) => {
          this.processing = false;
          console.log(err);
        }
      );
    }

  }

  printEco(id) {
    this.eventService.downloadEco(id).subscribe(
      (r) => generatePDF(r, "ecografia"),
      (error) => console.log(error)
    );
  }

  getPat() {
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
          this.ecoRegForm.get("patient").setValue(p);
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

  getDoc() {
    this.userService.getUsers("ecografista").subscribe(
      (res: any[]) => {
        let doc = res;
        doc = doc.map((val) => {
          val.fullName = val.name + " " + val.surname;
          return val;
        });
        this.doctores = doc;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getEcos() {
    this.processing = true;
    this.configService.getEcografias().subscribe(
      (res: any[]) => {
        this.ecos = res;
        this.processing = false;
      },
      (error) => {
        this.processing = false;
        console.log(error);
      }
    );
  }

  calcTotal() {
    let ecos: any[] = this.selectedOptions;
    //let ecos: any[] = this.ecoRegForm.get('eco').value;

    let t: number = 0;
    ecos.forEach(
      function (v) {
        t += Number.parseFloat(v.unit_price);
      }.bind(this)
    );
    this.ecoRegForm.get("total").setValue(t);
    this.total = t;
  }

  ngOnInit() {
    this.buildForm();
    this.getDoc();
    this.getPat();
    this.getEcos();
  }
  get result() {
    return this.ecos.filter(item => item.checked === true);
  }

  onCheckboxChecked(event, element) {

  if (event.checked) {

    this.selectedOptions.push(element);
  } else {

    let index = this.selectedOptions.indexOf(element);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    }
  }
  console.log(JSON.stringify(this.selectedOptions));
  this.calcTotal();
}
}
