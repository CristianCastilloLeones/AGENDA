import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/users.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { ConfigService } from "../../services/config.service";

@Component({
  selector: "app-new-assistant",
  templateUrl: "./new-assistant.component.html",
  styleUrls: ["./new-assistant.component.css"],
})
export class NewAssistantComponent {
  assistantForm: FormGroup;
  processing: boolean = false;
  boffices: any[];
  role: any[];
  usersFact: any[];
  canEdit: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NewAssistantComponent>,
    private userService: UserService,
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public eventData: any
  ) {
    this.assistantForm = this.formBuilder.group({
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
      branch_office: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      email: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      password: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      c_password: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      role: new FormControl(
        { value: this.eventData.role || [4], disabled: false },
        [Validators.required]
      ),
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
        this.assistantForm.get("branch_office").enable();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  create() {
    this.processing = true;
    //comprobar usuario y contrasena facturacion
    if (this.assistantForm.get("userFact").value != null) {
      let creds = {
        id: this.assistantForm.get("userFact").value,
        password: this.assistantForm.get("userFactPassword").value,
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
    this.userService.createAssistant(this.assistantForm.value).subscribe(
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
      this.assistantForm.controls["userFact"].enable();
      this.assistantForm.controls["userFactPassword"].enable();
      this.getUsersFact();
    } else {
      this.assistantForm.controls["userFact"].disable();
      this.assistantForm.controls["userFactPassword"].disable();
      this.assistantForm.get("userFact").setValue(null);
      this.assistantForm.get("userFactPassword").setValue(null);
    }
  }
}
