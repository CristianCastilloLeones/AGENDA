import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { EcoDataSource, EcoItem } from './ecografias-datasource';
import { ConsultaService } from '../services/consulta.service';
import { Router } from '@angular/router';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { EventService } from '../services/event.service';
import { generatePDF } from '../dialogs/diag-report/diag-report.component';

@Component({
  selector: 'app-ecografias',
  templateUrl: './ecografias.component.html',
  styleUrls: ['./ecografias.component.css']
})
export class EcografiasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: EcoDataSource;
  def: EcoDataSource;
  backupData: any;
  processing: boolean = false;
  role = localStorage.getItem("role");
  start: string;
  end: string;
  ecograf: string;
  prefact: number = 0;
  searching = false;

  displayedColumns = [
    'id',
    'ecogname',
    'ecogsurname',
    'econame',
    'price',
    'cmp_price',
    'eco_price',
    'date',
    'print'];

  constructor(
    private consultaService: ConsultaService,
    private eventService: EventService,
    public router: Router
  ) { }

  searchEcos(prefact = 0) {
    this.getEcos(prefact, this.start, this.end);
  }

  printEco(id){
    this.eventService.downloadEco(id)
          .subscribe(r => generatePDF(r, "ecografia"), error => console.log(error));
  }

  revoke(row){
    new SwalComponent({
      type:'question',
      html:'<p>¿Eliminar esta ecografía?</p>',
      cancelButtonText:'NO',
      confirmButtonText:'SI',
      showCancelButton:true
    })
      .show()
      .then(res => {
        if(res.dismiss) return;
        else this.doRevoke(row);
      })
      .catch(err => console.log(err));      
  }

  doRevoke(row){

    this.processing = true;
    this.consultaService.revokeEco(row.id)
    .subscribe(res => {
      this.processing = false;
      this.searchEcos(this.prefact);
    }, error => {
      this.processing = false;
      console.log(error);
    });

  }

  ngOnInit() {
    this.dataSource = new EcoDataSource(this.paginator, this.sort);
    this.def = new EcoDataSource(this.paginator, this.sort);
    this.getEcos(this.prefact);
  }

  prefacturar(row) {
    this.processing = true;
    this.consultaService.prefactEco(row.id)
      .subscribe(res => {
        this.processing = false;
        new SwalComponent({type: 'success', toast:true, html:'<p>Procesado correctamente</p>', timer: 1500})
        .show();
        this.getEcos(this.searchEcos(this.prefact));
      }, err => {
        this.processing = false;
        new SwalComponent({type: 'error', toast:true, html:'<p>Error al prefacturar</p>', timer: 1500})
        .show();
        console.log("error");
      });
  }

  applyFilter(filterValue: string) {
    this.def = new EcoDataSource(this.paginator, this.sort);
    this.def.data = [...this.backupData];
    this.def.data = [...this.def.filter(filterValue)];
    this.dataSource = this.def;
  }

  getEcos(prefact, start?, end?) {
    this.processing = true;
    this.searching = true;
    this.def = new EcoDataSource(this.paginator, this.sort);
    this.consultaService.ecoGrafList(prefact, start, end)
      .subscribe((res: EcoItem[]) => {
        this.processing = false;
        this.searching = false;
        let indexes = [];

        res.forEach(value => {
          if (indexes.includes(value.id)) {

          }
        });

        this.def.data = res;
        this.backupData = res;
        this.dataSource = this.def;
      }, error => {
        this.processing = false;
        this.searching = false;
        console.log(error);
      });
  }

  calcPrecio() {
    var total = 0;
    this.def.data.forEach((val) => {
      total += Number.parseFloat(val.price);
    });
    return total.toFixed(2);
  }

  calcEco() {
    var total = 0;
    this.def.data.forEach((val) => {
      total += Number.parseFloat(val.eco_price);
    });
    return total.toFixed(2);
  }

  calcCmp() {
    var total = 0;
    this.def.data.forEach((val) => {
      total += Number.parseFloat(val.cmp_price);
    });
    return total.toFixed(2);
  }

}
