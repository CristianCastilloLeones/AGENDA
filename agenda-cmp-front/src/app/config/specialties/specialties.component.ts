import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ConfigService } from '../../services/config.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { SpecialtiesDataSource, SpecialtyItem } from './specialties-datasource';
import { MatDialog } from '@angular/material';
import { SpecialtyDetailComponent } from '../../dialogs/specialty-detail/specialty-detail.component';

@Component({
  selector: 'app-specialties',
  templateUrl: './specialties.component.html',
  styleUrls: ['./specialties.component.css']
})
export class SpecialtiesComponent implements OnInit {

  specialty : string;
  price: number;
  specialties:any;
  processing: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() type : 'especialista' | 'paciente' | 'asistente';
  dataSource: SpecialtiesDataSource;
  def : SpecialtiesDataSource;
  backupData:any;

  displayedColumns = ['id', 'name', 'price'];

  constructor(
  	private configService: ConfigService,
    private dialog : MatDialog
  	) { }

  ngOnInit() {
    this.dataSource = new SpecialtiesDataSource(this.paginator, this.sort);
    this.def = new SpecialtiesDataSource(this.paginator, this.sort);
    this.getSpecialties();
  }

  options(r){
    
    let d = this.dialog.open(SpecialtyDetailComponent, {
      data: r
    });
    
    d.afterClosed()
    .subscribe(res => {
      if (res.updated)
        this.getSpecialties();
    }, error => {
      console.log(error);
    });
  }

  applyFilter(filterValue: string) {
    this.def = new SpecialtiesDataSource(this.paginator, this.sort);
    this.def.data = [...this.backupData];
    this.def.data  = [...this.def.filter(filterValue)];
    this.dataSource = this.def;
  }  

  getSpecialties(){
    this.processing = true;
    this.def = new SpecialtiesDataSource(this.paginator, this.sort);    
    this.configService.getSpecialties()
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

  save(){
    let specialty = this.specialty;
    let xprice = this.price;
  	if(specialty.length > 0 && xprice > 0){
      this.processing = true;
  		this.configService.setSpecialties({name:specialty, price: xprice})
  		.subscribe(res => {
        this.processing = false;
  			new SwalComponent({type:'success', toast:true, html:'<p>Datos guardados.</p>', timer:5000}).show();
  			this.specialty = '';
        this.getSpecialties();
  		}, error => {
        this.processing = false;
  			new SwalComponent({type:'error', toast:true, html:'<p>Ha ocurrido un error.</p>', timer:5000}).show();
  		});
  	}
  }

}
