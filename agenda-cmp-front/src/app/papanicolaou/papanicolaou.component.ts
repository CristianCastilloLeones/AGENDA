import { Component, OnInit, ViewChild } from '@angular/core';
import { ConsultaService } from '../services/consulta.service';
import { PapaDataSource, PapaItem } from './papanicolaou-datasource';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { PapnicolaouDetailComponent } from '../dialogs/papnicolaou-detail/papnicolaou-detail.component';
import { PapanicolaouCreateComponent } from './papanicolaou-create/papanicolaou-create.component';
import { generatePDF } from '../dialogs/diag-report/diag-report.component';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-papanicolaou',
  templateUrl: './papanicolaou.component.html',
  styleUrls: ['./papanicolaou.component.css']
})
export class PapanicolaouComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: PapaDataSource;
  def: PapaDataSource;
  backupData: any;
  processing: boolean = false;
  role = localStorage.getItem("role");
  papanicolaou: string;
  prefact = true;
  searching = false;
  price: number | string;
  muestra = false;

  displayedColumns = [
    'id',
    'patient',
    'doctor',
    'price',
    'muestra',
    'created_at',
    'print'
  ];
  total: number;

  constructor(
    private consultaService: ConsultaService,
    private eventService: EventService,
    private dialog: MatDialog
  ) { }

  newPapa() {
    this.dialog.open(PapanicolaouCreateComponent, {
      width: '600px'
    })
      .afterClosed()
      .subscribe(r => {
        if (r)
          this.getPapa(this.prefact);
      }, er => console.log(er));
  }

  setPrice() {
    this.consultaService.getPapaPrice()
      .subscribe(res => {
        this.price = res["price"];
      }, error => {
        console.log(error);
      });
  }

  printPapa(id: number) {
    this.eventService.downloadPapa(id)
      .subscribe(res => generatePDF(res, "papanicolaou"),
        error => {
          new SwalComponent({ type: 'error', html: '<p>Ha ocurrido un error</p>', toast: true, timer: 5000 }).show();
        });
  }

  options(row) {
    this.dialog.open(PapnicolaouDetailComponent, {
      width: '600px',
      data: row
    }).afterClosed()
      .subscribe(r => {
        this.getPapa(this.prefact);
      });
  }

  updatePrice() {

    this.consultaService.updatePapaPrice({ price: this.price })
      .subscribe(res => {
        new SwalComponent({ type: 'success', html: '<p>Precio actualizado</p>', toast: true, timer: 2000 })
          .show();
      }, error => {
        new SwalComponent({ type: 'error', html: '<p>Ha ocurrido un error</p>', toast: true, timer: 2000 })
          .show();
      });

  }


  ngOnInit() {
    this.dataSource = new PapaDataSource(this.paginator, this.sort);
    this.def = new PapaDataSource(this.paginator, this.sort);
    this.getPapa(this.prefact);
    this.setPrice();
  }

  formatLabel(value: number | null) {
 
    if (value == 0) {
      return 'SM';
    }
    if (value == 1) {
      return 'MR';
    }
    if (value == 2) {
      return 'ME';
    }

    return value;
  }

  muestraChange() {
    this.def = new PapaDataSource(this.paginator, this.sort);
    this.def.data = this.backupData.filter(function (v) {
      return v.muestra == this.muestra;
    }.bind(this));
    let t = 0;
    this.def.data.forEach(function(p){
      t += Number.parseFloat(p.price);
    }.bind(this));
    this.total = t; 
    this.dataSource = this.def;
  }

  applyFilter(filterValue: string) {
    this.def = new PapaDataSource(this.paginator, this.sort);
    this.def.data = [...this.backupData];
    this.def.data = [...this.def.filter(filterValue)];
    let t = 0;
    this.def.data.forEach(function(p){
      t += Number.parseFloat(p.price);
    }.bind(this));
    this.total = t; 
    this.dataSource = this.def;
  }

  getPapa(prefact = this.prefact) {
    this.processing = true;
    this.searching = true;
    this.def = new PapaDataSource(this.paginator, this.sort);
    this.consultaService.getPapa(prefact)
      .subscribe((res: PapaItem[]) => {
        let t = 0;
        res.forEach(function(p){
          t += Number.parseFloat(p.price);
        }.bind(this));
        this.total = t; 
        this.processing = false;
        this.searching = false;
        this.def.data = res;
        this.backupData = res;
        this.dataSource = this.def;
      }, error => {
        this.processing = false;
        this.searching = false;
        console.log(error);
      });
  }

}
