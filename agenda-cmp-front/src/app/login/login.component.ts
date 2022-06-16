import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { MatDialog } from '@angular/material';
import { NewPatientComponent } from '../dialogs/new-patient/new-patient.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;
  processing: boolean = false;

  constructor(
    public _formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loginFormGroup = this._formBuilder.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  login() {
    let creds = {
      "email": this.loginFormGroup.get('email').value,
      "password": this.loginFormGroup.get('password').value
    };
    this.processing = true;
    this.authService.login(creds)
      .subscribe((res: { usuario: any }) => {
        this.processing = false;
        this.setSession(res.usuario);
        this.router.navigate(['/citas']);
      }, error => {
        this.processing = false;
        console.log(error.status);
        if (error.status === 404) {
          new SwalComponent({ type: 'error', position: 'top-right', html: '<p>Verifique sus datos.</p>', toast: true, timer: 5000 }).show();
        } else if (error.status === 401) {
          this.verifyCode();
        } else {
          new SwalComponent({ type: 'error', position: 'top-right', html: '<p>Error inesperado.</p>', toast: true, timer: 10000 }).show();
        }
      });
  }

  verifyCode() {
    new SwalComponent({
      type: 'info', input: 'text',
      showCancelButton: true,
      cancelButtonText: "Reenviar codigo de verificación.",
      html: '<p>Verifique su cuenta.</p><p>Ingrese el codigo que fue enviado a su email.</p>'
    })
      .show()
      .then(result => {
        if (result.dismiss == "overlay") return;

        let mail = this.loginFormGroup.get('email').value;

        if (result.dismiss == "cancel") {
          this.authService.resendCode(mail)
            .subscribe(res => {
              new SwalComponent({ type: 'success', position: 'top-right', html: '<p>Codigo reenviado.</p>', toast: true, timer: 10000 }).show();
            }, error => {
              new SwalComponent({ type: 'error', position: 'top-right', html: '<p>Error inesperado.</p>', toast: true, timer: 10000 }).show();
            });
        } else {

          this.authService.verifyCode(result.value, mail)
            .subscribe(res => {
              new SwalComponent({ type: 'success', position: 'center', html: '<p>Codigo verificado.</p>', toast: true, timer: 4000 }).show();
            }, error => {
              new SwalComponent({ type: 'error', position: 'center', html: '<p>El codigo ingresado es invalido.</p>', toast: true, timer: 5000 }).show();
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  register() {
    let d = this.dialog.open(NewPatientComponent);
    d.afterClosed()
      .subscribe(res => {
        console.log(res);
      }, error => {
        console.log(error);
      });
  }

  resetPassword() {
    new SwalComponent({
      type: 'info', input: 'text',
      showCancelButton: true,
      cancelButtonText: "Cancelar.",
      html: '<p>Ingrese el email con el cual se registró.</p>'
    })
      .show()
      .then(result => {
        if (result.dismiss) return;

        this.authService.resetPassword(result.value)
          .subscribe(res => {
            new SwalComponent({ type: 'success', position: 'center', html: '<p>Le ha sido enviado a su correo una clave temporal.</p>' }).show();
          }, error => {
            new SwalComponent({ type: 'error', position: 'center', html: '<p>Email no encontrado. Por favor intentelo nuevamente con un email valido.</p>', toast: true, timer: 5000 }).show();
          });
      })
      .catch(error => {
        console.log("Error");
      });
  }

  setSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    let user = {
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      dni: data.dni,
      id: data.id,
      user: data.id,
      branch_office: data.branch_office
    };
    localStorage.setItem("user", JSON.stringify(user));
  }

}
