import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { UserService } from "../../services/users.service";
import { ConfigService } from "../../services/config.service";
import { SwalComponent } from "@toverux/ngx-sweetalert2";

@Component({
  selector: "app-user-options",
  templateUrl: "./user-options.component.html",
  styleUrls: ["./user-options.component.css"],
})
export class UserOptionsComponent implements OnInit {
  canEdit: boolean = false;
  userForm: FormGroup;
  processing: boolean = false;
  boffices: any[];
  BRANCH_OFFICES = [
    { id: 17, name: "Guasmo" },
    { id: 16, name: "Suburbio" },
  ];
  INSURANCES: any[];
  idTypes: any[];
  role: any = [];
  selectedRoles = [];
  myArray = [];
  usersFact: any[];
  haveFQ: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public userData: any,
    private dialogRef: MatDialogRef<UserOptionsComponent>,
    private userService: UserService,
    private configService: ConfigService,
    public formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      id: new FormControl({ value: userData.id, disabled: true }, [
        Validators.required,
      ]),
      dni: new FormControl({ value: userData.dni, disabled: true }, [
        Validators.required,
      ]),
      name: new FormControl({ value: userData.name, disabled: true }, [
        Validators.required,
      ]),
      surname: new FormControl({ value: userData.surname, disabled: true }, [
        Validators.required,
      ]),
      phone: new FormControl({ value: userData.phone, disabled: true }, [
        Validators.required,
      ]),
      email: new FormControl({ value: userData.email, disabled: true }, [
        Validators.required,
      ]),
      password: new FormControl({ value: "", disabled: true }),
      brithdate: new FormControl({ value: "", disabled: true }),
      // fq_user: new FormControl({ value: userData.fq_user, disabled: true }),
      // fq_pass: new FormControl({ value: userData.fq_pass, disabled: true }),
      userFact: new FormControl({ value: userData.factuser, disabled: true }, [
        Validators.required,
      ]),
      userFactPassword: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
    });

    if (this.userData.type != "paciente") {
      
      this.userForm.addControl(
        "role",
        new FormControl({ value: [this.userData.role_id], disabled: true }, [
          Validators.required,
        ])
      );
      this.userForm.addControl(
        "branch_office",
        new FormControl(
          { value: this.userData.branch_office, disabled: true },
          [Validators.required]
        )
      );
      //this.selectedRoles.push(this.userData.role.rol.id);
    }

    if (this.userData.type == "paciente") {
      this.getInsurances();
      this.userForm.addControl(
        "role",
        new FormControl({ value: [3], disabled: true }, [
          Validators.required,
        ])
      );
      this.userForm.addControl(
        "insurance",
        new FormControl({ value: this.userData.insurance, disabled: true })
      );
      this.userForm.addControl(
        "address",
        new FormControl({ value: this.userData.address, disabled: true }, [
          Validators.required,
        ])
      );
      this.userForm.addControl(
        "birthdate",
        new FormControl({ value: this.userData.birthdate, disabled: true }, [
          Validators.required,
        ])
      );

      //FACTURACION

      this.userForm.addControl(
        "fq_address",
        new FormControl(
          {
            value: this.userData.fq_address,
            disabled: true,
          },
          [Validators.required]
        )
      );
      this.userForm.addControl(
        "fq_comercial_name",
        new FormControl(
          {
            value: this.userData.fq_comercial_name,
            disabled: true,
          },
          [Validators.required]
        )
      );
      this.userForm.addControl(
        "fq_email",
        new FormControl(
          {
            value: this.userData.fq_email,
            disabled: true,
          },
          [Validators.required]
        )
      );
      this.userForm.addControl(
        "fq_identification_number",
        new FormControl(
          {
            value: this.userData.fq_identification_number,
            disabled: true,
          },
          [Validators.required]
        )
      );
      this.userForm.addControl(
        "fq_identification_type_id",
        new FormControl(
          {
            value: this.userData.fq_identification_type_id,
            disabled: true,
          },
          [Validators.required]
        )
      );
      this.userForm.addControl(
        "fq_phone",
        new FormControl(
          {
            value: this.userData.fq_phone,
            disabled: true,
          },
          [Validators.required]
        )
      );
      this.userForm.addControl(
        "fq_social_reason",
        new FormControl(
          {
            value: this.userData.fq_social_reason,
            disabled: true,
          },
          [Validators.required]
        )
      );
    }
  }
  update() {
    //if (this.userForm.invalid) return;
    this.processing = true;
    console.log(this.userForm)
    //comprobar usuario y contrasena facturacion
    // if (this.userForm.get("userFact").value != null) {
    //   let creds = {
    //     id: this.userForm.get("userFact").value,
    //     password: this.userForm.get("userFactPassword").value,
    //   };
    //   console.log(creds);
    //   this.userService.checkUserFQ(creds).subscribe(
    //     (res) => {
    //       console.log(res);
    //       this.updateUser();
    //     },
    //     (error) => {
    //       this.processing = false;
    //       let msg = "Ha ocurrido un error desconocido.";
    //       console.log(error.status);
    //       if (error.status == 401) {
    //         msg = `Credenciales de usuario de facturación incorrectas`;
    //       } else if (error.status == 500) {
    //         msg = `Error de la aplicación`;
    //       }
    //       new SwalComponent({ type: "error", html: `<p>${msg}</p>` }).show();
    //     }
    //   );
    // } else {
      this.updateUser();
    //}
  }

  updateUser() {
     this.userService.updateUser(this.userForm.value).subscribe(
      (res) => {
        new SwalComponent({
          type: "success",
          toast: true,
          position: "top-right",
          html: "<p>Datos actualizados</p>",
          timer: 1500,
        }).show();
        this.processing = false;
        this.dialogRef.close({ updated: true });
      },
      (error) => {
        console.log(error);
        this.processing = false;
        new SwalComponent({
          type: "error",
          toast: true,
          timer: 4000,
          position: "top-right",
          html: "<p>Ha ocurrido un error al actualizar los datos</p>",
        }).show();
      }
    );
  }

  disableUser() {
    new SwalComponent({
      type: "question",
      html: `<p>¿Desea ${
        this.userData.status ? "deshabilitar" : "habilitar"
      } a este usuario?</p>`,
      showCancelButton: true,
      cancelButtonText: "No",
      confirmButtonText: "Si",
    })
      .show()
      .then((result) => {
        if (result.dismiss) return;
        this.userService.disableUser({ id: this.userData.id }).subscribe(
          (res) => {
            this.dialogRef.close({ updated: true });
          },
          (error) => {
            console.log(error);
          }
        );
      });
  }

  getIdTypes() {
    this.configService.getIdentificationTypes().subscribe((id_types: any[]) => {
      this.idTypes = id_types;
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

  toggleChange(event) {
    if (event.checked){
      this.userForm.enable();
      console.log(this.userData);
      this.userForm.controls["userFact"].disable();
      this.userForm.controls["userFactPassword"].disable();
    }else{
      this.userForm.disable();
    }

  }

  ngOnInit() {
    this.getIdTypes();
    //this.getBo();
    this.getUsersFact();
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
      },
      (error) => {
        console.log(error);
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
  toggleChangeFact(event) {
    if (event.checked) {
      this.userForm.controls["userFact"].enable();
      this.userForm.controls["userFactPassword"].enable();
      this.getUsersFact();
    } else {
      this.userForm.controls["userFact"].disable();
      this.userForm.controls["userFactPassword"].disable();
      this.userForm.get("userFact").setValue(null);
      this.userForm.get("userFactPassword").setValue(null);
    }
  }
}
