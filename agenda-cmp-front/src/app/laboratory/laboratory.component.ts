import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigService } from '../services/config.service';
import { LabDataSource, LabItem } from './lab-datasource';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { LabEditComponent } from '../dialogs/lab-edit/lab-edit.component';
import { LabCatComponent } from '../dialogs/lab-cat/lab-cat.component';

@Component({
  selector: 'app-laboratory',
  templateUrl: './laboratory.component.html',
  styleUrls: ['./laboratory.component.css']
})
export class LaboratoryComponent implements OnInit {

  labForm: FormGroup;
  processing: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: LabDataSource;
  def: LabDataSource;
  backupData: any;
  catlab: any[];

  displayedColumns = ['id', 'name', 'unit_price', 'labcat_id'];

  constructor(
    public formBuilder: FormBuilder,
    private configService: ConfigService,
    private dialog: MatDialog
  ) {
    this.getLabs();
  }

  save() {
    this.processing = true;
    this.configService.setLabs(this.labForm.value)
      .subscribe(res => {
        this.processing = false;
        new SwalComponent({ type: 'success', toast: true, html: '<p>Datos guardados.</p>', timer: 5000 }).show();
        this.labForm.reset();
        this.getLabs();
      }, error => {
        this.processing = false;
        new SwalComponent({ type: 'error', toast: true, html: '<p>Ha ocurrido un error.</p>', timer: 5000 }).show();
      });
  }

  getCatLabs() {
    this.configService.getCatLab()
      .subscribe((res: any) => {
        this.catlab = res;
      }, error => console.log(error));
  }

  newCat() {
    this.dialog.open(LabCatComponent, {
      width: '550px'
    }).afterClosed()
      .subscribe(res => {
        if(res) this.getCatLabs();
      }, error => {
        console.log(error);
      });
  }

  options(row) {
    this.dialog.open(LabEditComponent, {
      data: row
    }).afterClosed()
      .subscribe(res => {
        if (res) this.getLabs();
      });
  }

  applyFilter(filterValue: string) {
    this.def = new LabDataSource(this.paginator, this.sort);
    this.def.data = [...this.backupData];
    this.def.data = [...this.def.filter(filterValue)];
    this.dataSource = this.def;
  }

  getLabs() {
    this.processing = true;
    this.def = new LabDataSource(this.paginator, this.sort);
    this.configService.getLabs()
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

  buildForm() {
    this.labForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      labcat_id: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    this.dataSource = new LabDataSource(this.paginator, this.sort);
    this.def = new LabDataSource(this.paginator, this.sort);
    this.buildForm();
    this.getCatLabs();
  }

}
