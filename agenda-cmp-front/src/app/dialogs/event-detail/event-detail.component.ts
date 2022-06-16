import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { ConsultasCreateComponent } from '../../consultas/consultas.create/consultas.create.component';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  constructor(
    private eventService: EventService,
    private dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<EventDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public eventData: any) {
  }

  details: any;
  processing: boolean = false;
  role = <number><any>localStorage.getItem('role');

  statusColor = ['#3a87ad', '#f44336'];

  ngOnInit() {
    console.log(this.eventData);
    this.getEventDetails();
  }

  cancelEvent() {
    new SwalComponent({
      title: '<p>¿Esta seguro de cancelar esta cita?<p>',
      showCancelButton: true,
      cancelButtonText: 'NO',
      confirmButtonText: 'SI',
      input: 'textarea',
      inputPlaceholder: 'Observación'
    })
      .show().then(result => {
        if (result.dismiss) { return; }
        this.processing = true;
        this.eventService.cancel(this.eventData.event.id, result.value)
          .subscribe((res: any) => {
            this.details.status = 2;
            this.processing = false;
            this.details.observation = res.observation;
          }, error => {
            this.processing = false;
            console.log(error);
          });
      }).catch(error => {
        console.log(error);
      });
  }

  getEventDetails() {
    this.processing = true;
    this.eventService.getEvent(this.eventData.event.id)
      .subscribe(res => {
        this.processing = false;
        this.details = res;
      }, error => {
        this.processing = false;
        console.log(error);
      });
  }

  finish() {
    new SwalComponent({
      input: 'checkbox',
      inputValue: 'true',
      inputPlaceholder:
        '¿La consulta se realizó?',
      confirmButtonText:
        'Continuar <i class="fa fa-arrow-right></i>'
    }).show()
      .then((xresult) => {
        if (xresult.dismiss) { return; }
        this.processing = true;
        this.eventService.finalize(this.details.id, { result: xresult.value ? 4 : 5, observation: '' })
          .subscribe(res => {
            this.processing = false;
            this.dialogRef.close({ reload: true });
          }, error => {
            this.processing = false;
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }

  procesar() {
    
    this.details.pat["id_consulta"] = this.details.id;
    this.details.pat["sexo"] = this.details.sexo;
    this.router.navigate(['/consulta'], {
      queryParams: this.details.pat
    });
    this.dialogRef.close();
  }

  reagendar() {
    const d = this.dialog.open(ConsultasCreateComponent, {
      data: { r: true, doc: { user: this.details.doc.id }, event: this.details.id }
    });
    d.afterClosed()
      .subscribe(res => {
        if (res.reagended) {
          new SwalComponent({
            type: 'success', html: '<p>Su cita fue actualizada.</p>',
            toast: true, position: 'top-right', timer: 5000
          }).show();
          this.dialogRef.close({ reload: true });
        }
      }, error => {
        console.log(error);
      });
  }

}
