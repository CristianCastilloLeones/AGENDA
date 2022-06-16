import { Component, OnInit, Inject, Optional, Input } from "@angular/core";
import { UserService } from "../../../services/users.service";
import { EventService } from "../../../services/event.service";
import { SchedulesService } from "../../../services/schedules.service";
import { ConfigService } from "../../../services/config.service";

import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { NewPatientComponent } from "../../../dialogs/new-patient/new-patient.component";
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { ActivatedRoute,Router } from "@angular/router";
import { stringify } from "querystring";
@Component({
  selector: 'app-derivation',
  templateUrl: './derivation.component.html',
  styleUrls: ['./derivation.component.css']
})
export class DerivationComponent implements OnInit {
  docs: any = [];
  specialties: any = [];
  pacientes: any = [];
  timeBlocks;
  processing = false;
  clientsFact: any[];
  dateForm: FormGroup;
  minDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
  dateFilter = this.dateFilt;
  reagendar = false;
  todayEvents: number = -2;
  @Input() event?: number | string;
  paciente: any;
  price:any;
  constructor(
    private userService: UserService,
    private scheduleService: SchedulesService,
    private configService: ConfigService,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    @Optional() private dialogRef?: MatDialogRef<DerivationComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() public refData?: any
  ) {
    this.buildForm();

    this.dateForm.get("specialty").valueChanges.subscribe((sp) => {
      if (!sp) {
        return;
      }
      //this.dateForm.get('date').reset();
      //this.dateForm.get('hour').reset();
      this.dateForm.get("doc").reset();
      this.getDoctors(sp.id);
      this.price=sp.price;
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.paciente = params;
      console.log(this.paciente)
    }, error => {
      console.log(error);
    });
      }

  getTodayEvents(id: number) {
    const date: Date = this.dateForm.get("date").value;
    const month =
      date.getMonth() + 1 > 9
        ? date.getMonth() + 1
        : (date.getMonth() + 1).toString().padStart(2, "0");
    const day =
      date.getDate() > 9
        ? date.getDate()
        : date.getDate().toString().padStart(2, "0");
    const fdate = `${date.getFullYear()}-${month}-${day}`;
    this.eventService.countEventsToday(id, fdate).subscribe(
      (counter: any) => {
        this.todayEvents = counter["events"] || -1;
      },
      (error) => {
        console.log(error);
      }
    );

  }

  buildForm() {
    this.dateForm = this.formBuilder.group({
      doc: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      specialty: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      date: new FormControl({ value: new Date(), disabled: false }, [
        Validators.required,
      ]),
      paciente: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      observation: new FormControl({ value: "", disabled: false }),
      useInsurance: new FormControl({ value: false, disabled: false }, [
        Validators.required,
      ]),
    });


  }



  public getSpecialities() {
    this.dateForm.get("specialty").disable();
    this.configService.getSpecialties().subscribe(
      (res) => {
        console.log(res)
        //this.specialties = res;
        this.dateForm.get("specialty").enable();

        this.specialties = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public getDoctors(sp) {
    this.dateForm.get("doc").disable();
    this.userService.getDocs(sp).subscribe(
      (res: Array<any>) => {
        this.dateForm.get("doc").enable();
        let doc = res;
        doc = doc.map((val) => {
          val.fullName = val.name + " " + val.surname;
          return val;
        });
        this.docs = doc;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
    this.getSpecialities();
    this.getPatients();
    this.getHolidays();
    this.getClientsFact();
    this.dateForm.get("doc").valueChanges.subscribe(
      (doc) => this.getEventsCounterByDate(doc),
      (error) => {
        console.log(error);
      }
    );
    this.dateForm.get("date").valueChanges.subscribe(
      () => this.getEventsCounterByDate(this.dateForm.get("doc").value),
      (error) => {
        console.log(error);
      }
    );
    this.dateForm.get("paciente").valueChanges.subscribe(
      (value) => {
        if (value) {
          if (value.insurance) {
            // new SwalComponent({
            //   type: "question",
            //   title: "Seguro/Empresa",
            //   html: `<p>
            //     Este usuario tiene asignado una empresa/seguro
            //     <strong>(${value.insuranceName})</strong>.
            //     <br> ¿Facturar a nombre de <strong>${value.insuranceName}</strong>?</p>`,
            //   showConfirmButton: true,
            //   showCancelButton: true,
            //   confirmButtonText: `Si, Facturar a nombre de ${value.insuranceName}`,
            //   cancelButtonText: "No, factuar a mi nombre",
            // })
            //   .show()
            //   .then((result) => {
            //     if (result.value) {
            this.dateForm.get("useInsurance").setValue(true);
          } else {
            this.dateForm.get("useInsurance").setValue(false);
          }
          //});
          //}
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getEventsCounterByDate(doc) {
    if (!doc) {
      this.todayEvents = -2;
      return;
    }
    this.getTodayEvents(doc.user);
  }

  dateHasChanged(d) {
    const date = new Date(d.value).toLocaleDateString();
    const doc = this.dateForm.get("doc").value;
    //this.dateForm.get('hour').reset();
    //this.dateForm.get('hour').disable();
    this.scheduleService.getAvailability(doc.user, date).subscribe(
      (res) => {
        this.dateForm.get("hour").enable();
        //this.timeBlocks = Object.values(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  dateFilt(date: Date) {
    const nowork = localStorage.getItem("nowork");
    const holiday = JSON.stringify({
      day: date.getDate(),
      month: date.getMonth(),
    });
    return !nowork.includes(holiday);
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
        this.dateForm.get("paciente").setValue(res.user);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPatients() {
    //this.dateForm.get("patient").disable();
    this.userService.getPatients().subscribe(
      (res: Array<any>) => {
        //this.dateForm.get("patient").enable();
        let patients = res;
        patients = patients.map((val) => {
          val.fullName = val.name + " " + val.surname;
          return val;
        });
        console.log(patients)
        this.pacientes = patients;
        if (this.paciente) {
          let p =
            patients[
            patients.findIndex((el) => {
              return el.id == this.paciente.id;
            })
            ];
          this.dateForm.get("paciente").setValue(p);
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

  reAgendar() {
    const date: Date = this.dateForm.get("date").value;
    const formatDate = `${date.getFullYear()}-${date.getMonth() + 1
      }-${date.getDate()}`;
    const id = this.refData.event;
    let event = {
      day: formatDate,
      observation: this.dateForm.get("observation").value,
    };

    if (
      this.dateForm.get("specialty").value &&
      this.dateForm.get("doc").value
    ) {
      Object.assign(event, {
        specialty: this.dateForm.get("specialty").value,
        doc: this.dateForm.get("doc").value.user,
      });
      console.log(event);
    }

    this.processing = true;
    this.eventService.reagendar(id, event).subscribe(
      (res: any) => {
        this.processing = false;
        this.dialogRef.close({ reagended: res.success, event: res.event });
      },
      (error) => {
        this.processing = false;
        console.log(error);
      }
    );
  }

  getHolidays() {
    this.dateForm.get("date").disable();
    this.configService.getHoliday().subscribe(
      (res) => {
        this.dateForm.get("date").enable();
        localStorage.setItem("nowork", JSON.stringify(res));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showTicket(ticket) {
    if (ticket.fact_id) {
      window.open(
        `http://74.127.61.115:93/invoice/createCMP/${ticket.fact_id}`,
        "_blank"
      );
      this.dateForm.reset();
      this.price=null;
      //  window.open(
      //    `http://127.0.0.1:8000/invoice/createCMP/${ticket.fact_id}`,
      //    "_blank"
      //  );
    }
  }

  agendar(fact?: boolean) { //true=sin factura (consumidor final)
    const date: Date = this.dateForm.get("date").value;
    const formatDate = `${date.getFullYear()}-${date.getMonth() + 1
      }-${date.getDate()}`;
    //console.log(this.dateForm.get("patient"));
    let clientFQ: any;
      clientFQ = this.paciente.dni;
      const event = {
        doc: this.dateForm.get("doc").value.user,
        specialty: this.dateForm.get("specialty").value.id,
        patient: this.paciente.id,
        day: formatDate,
        observation: this.dateForm.get("observation").value,
        useInsurance: this.dateForm.get("useInsurance").value,
        client: clientFQ,
      };
      //console.log(event)
      this.checkEvent(event, fact);

  }
  checkEvent(event, fact?: boolean) {
    const date: Date = this.dateForm.get("date").value;


    new SwalComponent({
      type: "question",
      html: `<p>¿ Desea agendar la cita para el ${date.getDate()}/${date.getMonth() + 1
        } ?</p>`,
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    })
      .show()
      .then((r) => {
        if (r.dismiss) {
          return;
        }
        this.processing = true;
        this.eventService.checkEventByPatientToday(event).subscribe(
          (res: any) => {
            console.log(res);
            this.processing = false;
            if (res) {
              return new SwalComponent({
                type: "info",
                html: `<h3>Ya se realizó una cita con información similar!</h3>
          <center><table><tr><td>Paciente:</td> <td>${res.paciente}</td></tr>
          <tr><td>Medico:</td> <td>${res.doctor}</td></tr>
          <tr><td>Especialidad:</td> <td>${res.specialty}</td></tr>
          <tr><td>Fecha:</td> <td>${res.date}</td></tr></table></center>
          <hr>
          <strong>Si desea confirmar la cita haga clic en SI, caso contrario NO para cancelar.</strong>`,
                showCancelButton: true,
                confirmButtonText: "SI",
                cancelButtonText: "NO",
              })
                .show()
                .then((r) => {
                  if (r.dismiss) {
                    return;
                  }
                  this.processing = true;
                  this.agendarEvento(event, fact);
                });
            } else {
              this.processing = true;
              this.agendarEvento(event, fact);
            }
          },
          (error) => {
            new SwalComponent({
              type: "error",
              html: "<p>Ha ocurrido un error.</p>",
              timer: 1500,
            }).show();
          }
        );
      });
  }
  agendarEvento(event, fact?: boolean) {
    console.log(event)
    this.eventService.createDerivation(event).subscribe(
      (res) => {
        console.log(res);
        this.processing = false;

        // if (fact) {
        //   this.showTicket(res);
        // }
        new SwalComponent({
          type: "success",
          toast: true,
          html: "<p>Agendado correctamente.</p>",
          timer: 1500,
        }).show();
        //this.router.navigate(["/citas"]);
        this.dateForm.reset();
        this.price = null;

      },
      (error) => {
        //console.log(error);
        this.processing = false;
        if (error.status === 409) {
          //verifica si se realizo una cita similar

          return new SwalComponent({
            type: "info",
            html:
              "<p>El médico o paciente ya ha ocupado este bloque horario.</p>",
          }).show();
        }
        new SwalComponent({
          type: "error",
          html: "<p>Ha ocurrido un error.</p>",
          timer: 1500,
        }).show();
      }
    );
  }
  getClientsFact() {
    this.userService.getClientsFQ().subscribe(
      (rs: any[]) => {
        //console.log(rs)
        this.clientsFact = rs;
        //this.admForm.get("branch_office").enable();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
