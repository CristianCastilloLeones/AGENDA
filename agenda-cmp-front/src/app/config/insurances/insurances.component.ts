import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ConfigService } from '../../services/config.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { InsuranceDataSource, InsuranceItem } from './insrances-datasource';
import { MatDialog } from '@angular/material';
import { InsuranceEditComponent } from '../../dialogs/insurance-edit/insurance-edit.component';
import { NewInsuranceComponent } from 'src/app/dialogs/new-insurance/new-insurance.component';

@Component({
  selector: 'app-insurances',
  templateUrl: './insurances.component.html',
  styleUrls: ['./insurances.component.css']
})
export class InsurancesComponent implements OnInit {

  insurances: any;
  processing: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: InsuranceDataSource;
  def : InsuranceDataSource;
  backupData:any;

  displayedColumns = ['id', 'comercial_name', "identification_number", "mail", "phone"];

  constructor(
  	private configService: ConfigService,
    private dialog : MatDialog
  	) { }

  ngOnInit() {
    this.dataSource = new InsuranceDataSource(this.paginator, this.sort);
    this.def = new InsuranceDataSource(this.paginator, this.sort);
    this.getInsurances();
  }

  newInsurance(){
    let d = this.dialog.open(NewInsuranceComponent, {

    });

    d.afterClosed()
      .subscribe(res => {
        this.getInsurances();
      });
  }

  options(r){
    
    let d = this.dialog.open(InsuranceEditComponent, {
      data: r
    });
    
    d.afterClosed()
    .subscribe(res => {
      if (res.updated)
        this.getInsurances();
    }, error => {
      console.log(error);
    });
  }

  applyFilter(filterValue: string) {
    this.def = new InsuranceDataSource(this.paginator, this.sort);
    this.def.data = [...this.backupData];
    this.def.data  = [...this.def.filter(filterValue)];
    this.dataSource = this.def;
  }  

  getInsurances(){
    this.processing = true;
    this.def = new InsuranceDataSource(this.paginator, this.sort);    
    this.configService.getInsurances()
      .subscribe((res:any) => {
        this.processing = false;
        this.def.data = res;
        this.backupData = res;
        this.dataSource = this.def;        
      }, error => {
        this.processing = false;
        console.log(error);
      });
  }

}
