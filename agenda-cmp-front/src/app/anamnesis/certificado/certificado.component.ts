import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsultaService } from '../../services/consulta.service';
import { EventService } from '../../services/event.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { generatePDF } from '../../dialogs/diag-report/diag-report.component';
import { ConfigService } from "../../services/config.service";
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
@Component({
  selector: 'app-certificado',
  templateUrl: './certificado.component.html',
  styleUrls: ['./certificado.component.css']
})
export class CertificadoComponent implements OnInit {

  @Input() patient: any;
  certForm: FormGroup;
  specialties: any = [];
  descripciones = [
    {
      placeholder: "Descripción",
      controlText: "descripcion",
      controlPre: "pre",
      controlDef: "def",
      controlCie: "cie",
    },
  ];
  cie10: any;
  loadCie = false;
  clearCie = false;
  dr: any = JSON.parse(localStorage.getItem("user"));
  specialtyControl = new FormControl(null, [Validators.required]);
  descriptionControl = new FormControl(null, [Validators.required]);
  cieControl = new FormControl(null, [Validators.required]);
  reposoControl = new FormControl(null, [Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]);
  constructor(
    private formBuilder: FormBuilder,
    private consultaService: ConsultaService,
    private eventService: EventService,
    private configService: ConfigService
  ) {

  }

  buildForm() {
    this.certForm = this.formBuilder.group({
      description: this.descriptionControl,
      patient: new FormControl(this.patient.id, [Validators.required]),
      dr: new FormControl(this.dr, [Validators.required]),
      specialty: this.specialtyControl,
      cie: this.cieControl,
      reposo: this.reposoControl,
      price: new FormControl(1.00, [Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]),
      observation: new FormControl(null),
    });
  }

  save() {
    console.log(this.certForm)
     this.consultaService.setCert(this.certForm.value)
      .subscribe(res => {
        new SwalComponent({ type: 'success', html: '<p>Procesado correctamente</p>', toast: true, timer: 2500 })
          .show();
          this.certForm.setValue({
            description: null,
            specialty: null,
            patient: this.patient.id || null,
            dr: this.dr || null,
            cie: null,
            reposo: null,
            price: null,
            observation: null,
          });
        this.printCert(res['id']);
      }, error => {
        new SwalComponent({ type: 'error', html: '<p>Ha ocurrido un error.</p>', toast: true, timer: 3500 })
          .show();
      });
  }

  printCert(id: number) {
    this.eventService.downloadCert(id)
      .subscribe(res => generatePDF(res, "certificado"),
        error => {
          new SwalComponent({ type: 'error', html: '<p>Ha ocurrido un error al imprimir.</p>', toast: true, timer: 3500 })
            .show();
        });
  }

  ngOnInit() {
    this.buildForm();
    this.certForm
      .get("cie")
      .valueChanges.pipe(
        debounceTime(1000),
        tap((v) => {
          this.loadCie = v.length > 3;
        }),
        switchMap((value) => {
          return value.length > 3 ? this.consultaService.filterCie(value) : [];
        }),
        finalize(() => (this.loadCie = false))
      )
      .subscribe(
        (data) => {
          console.log(data)
          this.loadCie = false;
          this.cie10 = data;
          this.clearCie = true;
        },
        (error) => {
          console.log('error cie10')
          this.loadCie = false;
        }
      );
    this.configService.getSpecialties().subscribe(
      (res) => {
        this.specialties = res;
      },
      (error) => {
        console.log(error);
      }
    );

  }
  clearCie10() {
    this.certForm.get("descripcion").setValue("");
    this.clearCie = false;
  }

}
