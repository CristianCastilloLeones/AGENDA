import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConsultaService } from 'src/app/services/consulta.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'app-papnicolaou-detail',
  templateUrl: './papnicolaou-detail.component.html',
  styleUrls: ['./papnicolaou-detail.component.css']
})
export class PapnicolaouDetailComponent implements OnInit {

  processing: boolean;
  role = localStorage.getItem("role");

  constructor(
    private dialogRef: MatDialogRef<PapnicolaouDetailComponent>,
    private consultaService: ConsultaService,
    @Inject(MAT_DIALOG_DATA) public papaData: any
  ) {
    console.log(papaData);
  }

  prefacturar() {
    this.consultaService.preFactPapa(this.papaData.id, this.papaData.price)
      .subscribe(res => {
        this.processing = false;
        new SwalComponent({ type: 'success', toast: true, html: '<p>Procesado correctamente</p>', timer: 1500 })
          .show();
        this.dialogRef.close(res);
      }, err => {
        this.processing = false;
        new SwalComponent({ type: 'error', toast: true, html: '<p>Error al prefacturar</p>', timer: 1500 })
          .show();
        console.log("error");
      });
  }

  fillMuestra() {
    this.processing = true;
    this.consultaService.fillPapa(this.papaData.id)
      .subscribe(res => { 
        this.papaData = res;
        this.processing = false;
        new SwalComponent({ type: 'success', toast: true, html: '<p>Procesado correctamente</p>', timer: 1500 })
          .show();
      }, error => { console.log(error) });
  }

  deliveryMuestra(){
    this.processing = true;
    this.consultaService.deliveryMuestra(this.papaData.id)
    .subscribe(res => { 
      this.papaData = res;
      this.processing = false;
      new SwalComponent({ type: 'success', toast: true, html: '<p>Procesado correctamente</p>', timer: 1500 })
        .show();
    }, error => { console.log(error) });

  }

  ngOnInit() {

  }

}
