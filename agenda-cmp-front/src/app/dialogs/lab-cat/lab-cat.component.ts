import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-lab-cat',
  templateUrl: './lab-cat.component.html',
  styleUrls: ['./lab-cat.component.css']
})
export class LabCatComponent implements OnInit {

  catGroup: FormGroup;

  constructor(
    private builder: FormBuilder,
    private configService: ConfigService,
    private ref: MatDialogRef<LabCatComponent>
  ) { }

  buildForm() {
    this.catGroup = this.builder.group({
      name: new FormControl(null, [Validators.required])
    });
  }

  save() {
    this.configService.setCatLab(this.catGroup.value)
      .subscribe(res => {
        new SwalComponent({ type: 'success', toast: true, html: '<p>Procesado exitosamente</p>', timer: 2000 })
          .show();
          this.ref.close(true);
      }, error => {
        new SwalComponent({ type: 'error', toast: true, html: '<p>Ha ocurrido un error</p>', timer: 2000 })
          .show();
      });
  }

  ngOnInit() {
    this.buildForm();
  }

}
