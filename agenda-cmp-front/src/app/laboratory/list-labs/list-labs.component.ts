import { Component, OnInit, ViewChild } from '@angular/core';
import { ConsultaService } from '../../services/consulta.service';
import { ExLabDataSource } from './list-labs-datasource';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ExlabComponent } from '../../anamnesis/exlab/exlab.component';
import { generatePDF } from 'src/app/dialogs/diag-report/diag-report.component';
import { EventService } from 'src/app/services/event.service';


@Component({
  selector: 'app-list-labs',
  templateUrl: './list-labs.component.html',
  styleUrls: ['./list-labs.component.css']
})
export class ListLabsComponent implements OnInit {

  processing: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: ExLabDataSource;
  def: ExLabDataSource;
  prefact = 0;
  backupData: any;
  end: any;
  start: any;
  role = localStorage.getItem('role');

  displayedColumns = ['id', 'patname', 'date', 'print'];

  constructor(
    private consultaService: ConsultaService,
    private eventService: EventService,
    public dialog: MatDialog
  ) {
    this.getExLabs();
  }

  applyFilter(filterValue: string) {
    this.def = new ExLabDataSource(this.paginator, this.sort);
    this.def.data = [...this.backupData];
    this.def.data = [...this.def.filter(filterValue)];
    this.dataSource = this.def;
  }

  newLab() {
    this.dialog.open(ExlabComponent, {
      width: '550px'
    }).afterClosed()
      .subscribe(r => {
        if (r) this.getExLabs(this.prefact);
      }, err => console.log(err));

  }

  options(row) {

    this.dialog.open(ExlabComponent, {
      data: { id: row.id, prefact: this.prefact },
      width: '600px'
    }).afterClosed()
      .subscribe(res => {
        if (res) this.getExLabs();
      }, error => {
        console.log(error);
      });

  }

  printLab(id) {
    this.eventService.downloadLab(id)
      .subscribe(r => generatePDF(r, "laboratorio"), error => console.log(error));
  }

  getExLabs(pre = 0) {
    this.processing = true;
    this.def = new ExLabDataSource(this.paginator, this.sort);
    this.consultaService.getExLabs(pre)
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

  ngOnInit() {
    this.dataSource = new ExLabDataSource(this.paginator, this.sort);
    this.def = new ExLabDataSource(this.paginator, this.sort);
  }

}
