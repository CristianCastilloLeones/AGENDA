import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConsultaService } from '../../services/consulta.service';

@Component({
  selector: 'app-ecograf-edit',
  templateUrl: './ecograf-edit.component.html',
  styleUrls: ['./ecograf-edit.component.css']
})
export class EcografEditComponent implements OnInit {

  ecografia: string;
  price: number;
  eco_price: number;
  eco_value: number;
  id: number | string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public ecoData: any,
    private dialogRef: MatDialogRef<EcografEditComponent>,
    private consultaService: ConsultaService
  ) {
    this.ecografia = ecoData.name;
    this.price = ecoData.price;
    this.eco_value = ecoData.eco_price;
    this.id = ecoData.id;
  }

  save(){
    this.consultaService.editEco({
      id: this.id,
      name: this.ecografia,
      price: this.price,
      eco_price: this.eco_value
    }).subscribe(res => {
      this.dialogRef.close({updated:true});
    }, error => {
      console.log(error);
    });
  }

  getPercentage() {
    if (this.price > 0) {
      let val = this.price * (this.eco_price / 100);
      this.eco_value = <number><any>val.toFixed(2);
      return val.toFixed(2);
    }
    return 0;
  }

  ngOnInit() {
  }

}
