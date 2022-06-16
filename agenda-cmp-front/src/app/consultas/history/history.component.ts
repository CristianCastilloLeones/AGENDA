import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ConsultaService } from '../../services/consulta.service';
import { EventService } from '../../services/event.service';
import { EventsDataSource, EventItem } from './history-datasource';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DiagReportComponent } from '../../dialogs/diag-report/diag-report.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: EventsDataSource;
  def: EventsDataSource;
  @Input('dni') inputDni: string;
  backupData: any;
  processing: boolean = false;
  dni: string;
  role = localStorage.getItem('role');
  start: any;
  end: any;
  hideInputs = true;

  displayedColumns = [
    'id', 'pname', 'psurname', 'dname',
    'dsurname', 'specialty', 'day', 'historia',
    'status'];

  constructor(
    private consultaService: ConsultaService,
    private actRoute: ActivatedRoute,
    private eventService: EventService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource = new EventsDataSource(this.paginator, this.sort);
    this.def = new EventsDataSource(this.paginator, this.sort);
    this.actRoute.queryParams.subscribe(params => {
      let dni = params.dni || undefined;
      if (dni && (this.role != '3') || ( this.role != '2')) {
        this.dni = dni;
        this.getHistorial(dni);
      } else {
        this.getHistorial(null);
      }
    }, err => {
      console.log(err);
    });

  }

  InEvent() {
    if(this.inputDni) {
      this.getHistorial(this.inputDni);
    } else {
      this.hideInputs = false;
    }
  }

  applyFilter(value) {
    console.log(value);
  }

  getData(row: string | number) {
    if(this.processing) return;
    this.processing = true;
    this.eventService.getDiag(row)
      .subscribe((res: { diagnostico: any[], receta: { id: number | string } }) => {
        res.diagnostico = res.diagnostico.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.descripcion === thing.descripcion
          )));
        this.processing = false;
        res["row"] = row;
        this.dialog.open(DiagReportComponent, {
          data: res,
          width: '700px'
        });
      }, error => {
        this.processing = false;
        console.log(error);
      });
  }

  uniq(a: any[]) {
    var seen = {};
    return a.filter((item) => {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  }

  search() {
    this.getHistorial(this.dni || null, this.start, this.end);
  }

  colorizeStatus(status: number | string) {
    let color = "";
    switch (status) {
      case 1: color = 'espera'; break;
      case 2: color = 'canceladap'; break;
      case 3: color = 'diferida'; break;
      case 4: color = 'procesada'; break;
      case 5: color = 'noasistio'; break;
      default: color = 'default'; break;
    }
    return color;
  }

  getHistorial(dni, start?, end?) {
    //console.log(dni)
    this.processing = true;
    this.def = new EventsDataSource(this.paginator, this.sort);
    this.consultaService.getHistorial(dni, start, end)
      .subscribe((res: EventItem[]) => {
        console.log(res)
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
