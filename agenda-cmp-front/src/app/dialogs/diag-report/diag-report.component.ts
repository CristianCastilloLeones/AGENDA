import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-diag-report',
  templateUrl: './diag-report.component.html',
  styleUrls: ['./diag-report.component.css']
})
export class DiagReportComponent implements OnInit {

  displayedColumns: string[] = ['descripcion', 'pre', 'def'];
  dataSource: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public eventData: any,
    private eventService: EventService,
    private router: Router,
    private dialogRef: MatDialogRef<DiagReportComponent>
  ) {
    this.dataSource = eventData.diagnostico;
  }

  downloadReceta() {
    this.eventService.downloadRecipe(this.eventData.receta.id)
      .subscribe(res => {
        generatePDF(res, 'receta');
      }, error => {
        console.log(error);
      });
  }

  downloadLab() {
    this.eventService.downloadLab(this.eventData.row)
      .subscribe(res => {
        generatePDF(res, 'lab_ex');
      }, error => {
        console.log(error);
      });
  }

  showReceta() {
    this.dialogRef.close();
    this.router.navigate(['/receta'], { queryParams: { receta: this.eventData.receta.id } });
  }

  ngOnInit() {
  }

}

export function generatePDF(res: ArrayBuffer, name = "receta") {
  const _blob = new Blob([res], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(_blob);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.setAttribute('style', 'display: none');
  a.href = url;
  a.target = '_blank';
  a.click();
  //window.URL.revokeObjectURL(url);

}
