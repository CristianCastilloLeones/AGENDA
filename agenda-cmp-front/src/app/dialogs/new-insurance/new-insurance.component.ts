import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { MatDialogRef } from "@angular/material";
import { ConfigService } from "../../services/config.service";
import { SwalComponent } from "@toverux/ngx-sweetalert2";

@Component({
  selector: "app-new-insurance",
  templateUrl: "./new-insurance.component.html",
  styleUrls: ["./new-insurance.component.css"]
})
export class NewInsuranceComponent implements OnInit, OnChanges {
  insuranceForm: FormGroup;
  processing: boolean = false;
  idTypes = [];
  @Input("insurance") insurance: any;

  constructor(
    public formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NewInsuranceComponent>,
    private configService: ConfigService
  ) {
    let xrole = localStorage.getItem("role") || 5;
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.insurance) {
      this.buildForm(changes.insurance.currentValue);
    }
  }

  buildForm(insurance?) {
    this.insuranceForm = this.formBuilder.group({
      address: new FormControl(
        {
          value: insurance ? insurance.address : null,
          disabled: false
        },
        [Validators.required]
      ),
      comercial_name: new FormControl(
        {
          value: insurance ? insurance.comercial_name : null,
          disabled: false
        },
        [Validators.required]
      ),
      company_id: new FormControl({ value: 42, disabled: false }, [
        Validators.required
      ]),
      email: new FormControl(
        {
          value: insurance ? insurance.email : null,
          disabled: false
        },
        [Validators.required]
      ),
      identification_number: new FormControl(
        {
          value: insurance ? insurance.identification_number : null,
          disabled: false
        },
        [Validators.required]
      ),
      identification_type_id: new FormControl(
        {
          value: insurance ? insurance.identification_type_id : null,
          disabled: false
        },
        [Validators.required]
      ),
      is_active: new FormControl({ value: true, disabled: false }, [
        Validators.required
      ]),
      phone: new FormControl(
        {
          value: insurance ? insurance.phone : null,
          disabled: false
        },
        [Validators.required]
      ),
      social_reason: new FormControl(
        {
          value: insurance ? insurance.social_reason : null,
          disabled: false
        },
        [Validators.required]
      )
    });
  }

  getIdTypes() {
    this.configService.getIdentificationTypes().subscribe((id_types: any[]) => {
      this.idTypes = id_types;
    });
  }

  createOrUpdateInsurance() {
    this.processing = true;
    if (!this.insurance) {
      this.createInsurance();
    } else {
      this.updateInsurance();
    }
  }

  updateInsurance() {
    this.configService
      .updateinsurance({ id: this.insurance.id, ...this.insuranceForm.value })
      .subscribe(
        res => {
          new SwalComponent({
            type: "success",
            toast: true,
            position: "top-right",
            html: "<p>Datos actualizados</p>",
            timer: 1500
          }).show();
          this.processing = false;
          this.dialogRef.close({ updated: true });
        },
        error => {
          this.processing = false;
          new SwalComponent({
            type: "error",
            toast: true,
            timer: 4000,
            position: "top-right",
            html: "<p>Ha ocurrido un error al actualizar los datos</p>"
          }).show();
        }
      );
  }

  createInsurance() {
    this.configService.saveInsurances(this.insuranceForm.value).subscribe(
      res => {
        this.processing = false;
        new SwalComponent({
          type: "success",
          html: "<p>La empresa o seguro ha sido registrado.</p>",
          toast: true,
          position: "top-right",
          timer: 5000
        }).show();
        this.dialogRef.close({ created: true, insurance: res });
      },
      error => {
        this.processing = false;
        var msg =
          "Ha ocurrido un error desconocido. <br> Verifique los datos o ponganse en contacto con el administrador.";
        if (error.status == 400) {
          let errObj = error.error.original["error"];
          let keys = Object.keys(errObj);
          msg = ``;
          keys.forEach(key => {
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

  ngOnInit() {
    this.getIdTypes();
  }
}
