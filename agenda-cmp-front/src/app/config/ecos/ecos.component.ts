import { Component, OnInit, ViewChild } from '@angular/core';
import { EcosDataSource, EcogItem } from './ecos-datasource';
import { MatPaginator, MatSort } from '@angular/material';
import { ConfigService } from '../../services/config.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { MatDialog } from '@angular/material';
import { EcografEditComponent } from '../../dialogs/ecograf-edit/ecograf-edit.component';

@Component({
  selector: 'app-ecos',
  templateUrl: './ecos.component.html',
  styleUrls: ['./ecos.component.css']
})
export class EcosComponent implements OnInit {

  ecografia: string;
  price: number;
  eco_price: number;
  eco_value: number;
  specialties: any;
  processing: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: EcosDataSource;
  def: EcosDataSource;
  backupData: any;

  displayedColumns = ['id', 'name', 'price', 'eco_price'];

  constructor(
    private configService: ConfigService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource = new EcosDataSource(this.paginator, this.sort);
    this.def = new EcosDataSource(this.paginator, this.sort);
    this.getEcografias();
  }


  options(r) {

    let d = this.dialog.open(EcografEditComponent, {
      data: r
    });

    d.afterClosed()
      .subscribe(res => {
        if (res.updated)
          this.getEcografias();
      }, error => {
        console.log(error);
      });
  }


  applyFilter(filterValue: string) {
    this.def = new EcosDataSource(this.paginator, this.sort);
    this.def.data = [...this.backupData];
    this.def.data = [...this.def.filter(filterValue)];
    this.dataSource = this.def;
  }

  getEcografias() {
    this.processing = true;
    this.def = new EcosDataSource(this.paginator, this.sort);
    this.configService.getEcografias()
      .subscribe((res: any) => {
        this.processing = false;
        this.def.data = res;
        this.backupData = res;
        this.dataSource = this.def;
      }, error => {
        this.processing = false;
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

  save() {
    let ecografia = this.ecografia;
    let xprice = this.price;
    let xeco_value = this.eco_value;
    console.log({ name: ecografia, price: xprice, eco_price: xeco_value });
    if (ecografia.length > 0 && xprice > 0 && xeco_value > 0) {
      this.processing = true;
      this.configService.setEcografias({ name: ecografia, price: xprice, eco_price: xeco_value })
        .subscribe(res => {
          this.processing = false;
          new SwalComponent({ type: 'success', toast: true, html: '<p>Datos guardados.</p>', timer: 5000 }).show();
          this.ecografia = '';
          this.getEcografias();
        }, error => {
          this.processing = false;
          new SwalComponent({ type: 'error', toast: true, html: '<p>Ha ocurrido un error.</p>', timer: 5000 }).show();
        });
    }
  }

}
