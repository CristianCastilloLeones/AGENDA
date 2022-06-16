import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { MatDialogRef } from "@angular/material";
import { UserService } from "../../services/users.service";
import { ConfigService } from "../../services/config.service";
import { SwalComponent } from "@toverux/ngx-sweetalert2";

@Component({
  selector: "app-new-patient",
  templateUrl: "./new-patient.component.html",
  styleUrls: ["./new-patient.component.css"],
})
export class NewPatientComponent implements OnInit {
  patientForm: FormGroup;
  processing: boolean = false;
  SEXOS = [
    { name: "F", id: 1 },
    { name: "M", id: 2 },
  ];
  idTypes = [];
  INSURANCES: any[];
  sameInfo: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NewPatientComponent>,
    private userService: UserService,
    private configService: ConfigService
  ) {
    let xrole = localStorage.getItem("role") || 5;

    this.patientForm = this.formBuilder.group({
      dni: new FormControl({ value: null, disabled: false }),
      name: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      surname: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      phone: new FormControl({ value: '0999999999', disabled: false },[
        Validators.required,
      ]),
      email: new FormControl({ value: null, disabled: false }),
      password: new FormControl({ value: "123456", disabled: false }, [
        Validators.required,
      ]),
      c_password: new FormControl({ value: "123456", disabled: false }, [
        Validators.required,
      ]),
      insurance: new FormControl(1),
      birthdate: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      fname: new FormControl({ value: null, disabled: false }),
      fphone: new FormControl({ value: null, disabled: false }),
      sexo: new FormControl(null, [Validators.required]),
      role: new FormControl({ value: [3], disabled: false }, [
        Validators.required,
      ]),
      origin: new FormControl({ value: xrole, disabled: false }),
      address: new FormControl({ value: null, disabled: false }),

      //FACTURACION

      fq_address: new FormControl({
        value: null,
        disabled: false,
      }),
      fq_comercial_name: new FormControl({
        value: null,
        disabled: false,
      }),
      fq_company_id: new FormControl({ value: 42, disabled: false }, [
        Validators.required,
      ]),
      fq_email: new FormControl({
        value: null,
        disabled: false,
      }),
      fq_identification_number: new FormControl({
        value: null,
        disabled: false,
      }),
      fq_identification_type_id: new FormControl(18),
      fq_is_active: new FormControl({ value: true, disabled: false }, [
        Validators.required,
      ]),
      fq_phone: new FormControl({
        value: null,
        disabled: false,
      }),
      fq_social_reason: new FormControl({
        value: null,
        disabled: false,
      }),
    });
  }

  getInsurances() {
    this.configService.getInsurances().subscribe(
      (res: any[]) => {
        this.INSURANCES = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createPatient() {
    this.processing = true;
    console.log(this.patientForm);
    this.userService.createPatient(this.patientForm.value).subscribe(
      (res) => {
        this.processing = false;
        new SwalComponent({
          type: "success",
          html: "<p>El usuario ha sido registrado.</p>",
          toast: true,
          position: "top-right",
          timer: 5000,
        }).show();
        this.dialogRef.close({ created: true, user: res });
      },
      (error) => {
        console.log(error);
        this.processing = false;
        var msg =
          "Ha ocurrido un error desconocido. <br> Verifique los datos o ponganse en contacto con el administrador.";
        if (error.status == 400) {
          let errObj = error.error.original["error"];
          let keys = Object.keys(errObj);
          msg = ``;
          keys.forEach((key) => {
            msg += `- ${errObj[key]} <br>`;
          });
        }

        if (error.status == 502) {
          msg = "Ha ocurrido un error al conectarse con FACTURAQ";
        }

        new SwalComponent({ type: "error", html: `<p>${msg}</p>` }).show();
      }
    );
  }

  getIdTypes() {
    this.configService.getIdentificationTypes().subscribe((id_types: any[]) => {
      this.idTypes = id_types;
    });
  }

  ngOnInit() {
    this.getInsurances();
    this.getIdTypes();
  }
  toggleChange(event) {
    if (event.checked) {
      /* if (this.patientForm.controls["dni"].value.length==10) { //cedula
        this.patientForm.controls["fq_identification_type_id"].setValue(18);
      } */
      this.patientForm.controls["fq_identification_number"].setValue(
        this.patientForm.controls["dni"].value
      );
      this.patientForm.controls["fq_comercial_name"].setValue(
        this.patientForm.controls["name"].value+' '+this.patientForm.controls["surname"].value
      );
      this.patientForm.controls["fq_social_reason"].setValue(
        this.patientForm.controls["name"].value +
          " " +
          this.patientForm.controls["surname"].value
      );
      this.patientForm.controls["fq_email"].setValue(
        this.patientForm.controls["email"].value
      );
      this.patientForm.controls["fq_phone"].setValue(
        this.patientForm.controls["phone"].value
      );
    } else {
      this.patientForm.controls["fq_identification_number"].setValue(null);
      this.patientForm.controls["fq_comercial_name"].setValue(null);
      this.patientForm.controls["fq_social_reason"].setValue(null);
      this.patientForm.controls["fq_email"].setValue(null);
      this.patientForm.controls["fq_phone"].setValue(null);
    }
  }
}
