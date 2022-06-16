import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ConsultaService } from '../../services/consulta.service';
import { ConfigService } from '../../services/config.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-lab-edit',
  templateUrl: './lab-edit.component.html',
  styleUrls: ['./lab-edit.component.css']
})
export class LabEditComponent implements OnInit {

  name: string;
  price: number;
  labcat_id: any;
  lid: any;
  id: number | string;
  categories: any[] = [];
  @ViewChild(MatSelect) labcatSelect: MatSelect;

  constructor(
    private consultaService: ConsultaService,
    private configService: ConfigService,
    private dialogRef: MatDialogRef<LabEditComponent>,
    @Inject(MAT_DIALOG_DATA) public labData: any
  ) {
    this.id = this.labData.id;
    this.name = this.labData.name;
    this.price = this.labData.price;
    this.lid = this.labData.labcat_id;
  }

  save() {
    this.consultaService.editLab({
      id: this.id,
      name: this.name,
      price: this.price,
      labcat_id: this.labcat_id
    }).subscribe(res => {
      this.dialogRef.close({ updated: true });
    }, error => {
      console.log(error);
    });
  }

  getCategories() {
    this.configService.getCatLab()
      .subscribe((res: any[]) => {
        this.categories = res;
        console.log(res);
        this.labcat_id = res.find(function (v) {
          return v.name === this.labData.labcat_id;
        }.bind(this))["id"];
      }, error => {
        console.log(error);
      });
  }

  ngOnInit() {
    this.getCategories();
  }

}
