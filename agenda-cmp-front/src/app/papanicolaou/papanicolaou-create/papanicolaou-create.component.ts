import { Component, OnInit, Input, Optional } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ConsultaService } from '../../services/consulta.service';
import { UserService } from '../../services/users.service';
import { EventService } from '../../services/event.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { generatePDF } from '../../dialogs/diag-report/diag-report.component';
import { isNumber, isObject } from 'util';
import { NewPatientComponent } from 'src/app/dialogs/new-patient/new-patient.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-papanicolaou-create',
  templateUrl: './papanicolaou-create.component.html',
  styleUrls: ['./papanicolaou-create.component.css']
})
export class PapanicolaouCreateComponent implements OnInit {

  papaGroup: FormGroup;
  price: string | number;
  showPatients = false;
  patients: any[];
  processing = false;

  g_check: boolean = false;
  a_check: boolean = false;
  p_check: boolean = false;
  c_check: boolean = false;
  fum_check: boolean = false;
  hc_check: boolean = false;
  edad = 0;
  role = localStorage.getItem('role');

  @Input() patient: any;

  constructor(
    private formBuilder: FormBuilder,
    private consultaService: ConsultaService,
    private userService: UserService,
    private eventService: EventService,
    private dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<PapanicolaouCreateComponent>
  ) {
    this.buildForm();
  }

  save() {

    let pData = Object.assign({}, this.papaGroup.value);
    if (isObject(pData.patient)) pData.patient = this.papaGroup.value.patient.id;
    this.processing = true;
    this.consultaService.setPapa(pData)
      .subscribe(res => {
        new SwalComponent({ type: 'success', html: '<p>Procesado</p>', toast: true, timer: 1000 }).show();
        if(this.role == '2') this.printPapa(res['id']);
        this.processing = false;
        this.papaGroup.reset();
      }, err => {
        new SwalComponent({ type: 'error', html: '<p>Ha ocurrido un error</p>', toast: true, timer: 5000 }).show();
        this.processing = false;
      });
  }

  newPatient() {
    const d = this.dialog.open(NewPatientComponent, {
      width: '800px'
    });
    d.afterClosed()
      .subscribe(res => {
        this.patients.push(res.user);
        this.patients = [...this.patients];
        res.user["fullName"] = res.user.name + " " + res.user.surname;
        this.papaGroup.get('patient').setValue(res.user);
      }, error => {
        console.log(error);
      });
  }

  ngOnInit() {
    if (this.patient) {
      this.setAge(this.patient.dni);
      this.papaGroup.get('patient').setValue(this.patient.id);
      this.papaGroup.get('hc').setValue(this.patient.dni.padStart(10,'0'));
    } else {
      this.getPatients();
    }
    this.setPrice();
  }

  getPatients() {
    this.userService.getPatients()
      .subscribe((res: any[]) => {
        res.forEach(v => { v.fullname = `${v.name} ${v.surname}`.toUpperCase() });
        this.patients = res.filter((p) => p.sexo == "F");
        this.showPatients = true;
      }, error => {
        console.log(error);
      });
  }

  setPrice() {
    this.consultaService.getPapaPrice()
      .subscribe((res: { id: number, price: number | string }) => {
        this.papaGroup.get('price').setValue(res.price);
        this.price = res.price;
      }, error => {
        console.log(error);
      });
  }

  printPapa(id: number) {
    this.eventService.downloadPapa(id)
      .subscribe(res => generatePDF(res, "papanicolaou"),
        error => {
          new SwalComponent({ type: 'error', html: '<p>Ha ocurrido un error</p>', toast: true, timer: 5000 }).show();
        });
  }

  setAge(dni) {
    this.userService.getAge(dni)
      .subscribe((res: { age: number | string }) => {
        this.papaGroup.get('edad').setValue(res.age);
        this.edad = <number>res.age;
      }, error => {
        console.log(error);
      });
  }

  buildForm() {
    this.papaGroup = this.formBuilder.group({
      patient: new FormControl(null, [Validators.required]),
      g: new FormControl(null),
      a: new FormControl(null),
      p: new FormControl(null),
      c: new FormControl(null),
      fum: new FormControl(null),
      hc: new FormControl(null),
      edad: new FormControl(null),
      price: new FormControl(null),
      observation: new FormControl(null)
    });
  }

}
