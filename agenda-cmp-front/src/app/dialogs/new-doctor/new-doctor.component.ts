import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/users.service';
import { ConfigService } from '../../services/config.service';
import { MatDialogRef } from '@angular/material';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: "app-new-doctor",
  templateUrl: "./new-doctor.component.html",
  styleUrls: ["./new-doctor.component.css"],
})
export class NewDoctorComponent implements OnInit {
  docForm: FormGroup;
  specialties: any = [];
  processing = false;
  minDate = new Date(new Date().getFullYear(), 0, 1);
  maxDate = new Date(new Date().getFullYear(), 11, 31);
  boffices: any[];
  role: any[];
  usersFact: any[];
  canEdit: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NewDoctorComponent>,
    private configService: ConfigService,
    private userService: UserService
  ) {
    this.docForm = this.formBuilder.group({
      dni: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      name: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      surname: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      phone: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      email: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      branch_office: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      password: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      c_password: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      specialty: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      code: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      role: new FormControl({ value: [2], disabled: false }, [
        Validators.required,
      ]),
      userFact: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      userFactPassword: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
    });
  }

  ngOnInit() {
    this.getBo();
    this.configService.getSpecialties().subscribe(
      (rs) => {
        this.specialties = rs;
      },
      (error) => {
        console.log(error);
      }
    );
    this.configService.getRoles().subscribe(
      (rs: any[]) => {
        this.role = rs;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getBo() {
    this.userService.getBranches().subscribe(
      (rs: any[]) => {
        this.boffices = rs;
        this.docForm.get("branch_office").enable();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  create() {
    this.processing = true;
    //comprobar usuario y contrasena facturacion
    if (this.docForm.get("userFact").value != null) {
      let creds = {
        id: this.docForm.get("userFact").value,
        password: this.docForm.get("userFactPassword").value,
      };
      console.log(creds);
      this.userService.checkUserFQ(creds).subscribe(
        (res) => {
          console.log(res);
          this.createUser();
        },
        (error) => {
          this.processing = false;
          let msg = "Ha ocurrido un error desconocido.";
          console.log(error.status);
          if (error.status == 401) {
            msg = `Credenciales de usuario de facturación incorrectas`;
          } else if (error.status == 500) {
            msg = `Error de la aplicación`;
          }
          new SwalComponent({ type: "error", html: `<p>${msg}</p>` }).show();
        }
      );
    } else {
      this.createUser();
    }
  }
  createUser() {
    this.userService.createDoc(this.docForm.value).subscribe(
      (res) => {
        this.processing = false;
        new SwalComponent({
          type: "success",
          html: "<p>Procesado correctamente.</p>",
          toast: true,
          position: "top-right",
          timer: 2500,
        }).show();
        this.dialogRef.close({ created: true });
      },
      (error) => {
        this.processing = false;
        let msg = "Ha ocurrido un error desconocido.";
        if (error.status == 400) {
          const errObj = error.error.original["error"];
          const keys = Object.keys(errObj);
          msg = ``;
          keys.forEach((key) => {
            msg += `- ${errObj[key]} <br>`;
          });
        }
        new SwalComponent({ type: "error", html: `<p>${msg}</p>` }).show();
      }
    );
  }
  
  getUsersFact() {
    this.userService.getUsersFQ().subscribe(
      (rs: any[]) => {
        this.usersFact = rs;
        //this.admForm.get("branch_office").enable();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  toggleChange(event) {
    if (event.checked) {
      this.docForm.controls["userFact"].enable();
      this.docForm.controls["userFactPassword"].enable();
      this.getUsersFact();
    } else {
      this.docForm.controls["userFact"].disable();
      this.docForm.controls["userFactPassword"].disable();
      this.docForm.get("userFact").setValue(null);
      this.docForm.get("userFactPassword").setValue(null);
    }
  }
}
