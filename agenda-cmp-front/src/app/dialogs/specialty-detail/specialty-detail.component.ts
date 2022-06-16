import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,  } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'app-specialty-detail',
  templateUrl: './specialty-detail.component.html',
  styleUrls: ['./specialty-detail.component.css']
})
export class SpecialtyDetailComponent{

	canEdit:boolean=false;
	specialtyForm : FormGroup;
	processing:boolean=false;

  constructor(
  	@Inject(MAT_DIALOG_DATA) public specialtyData: any,
  	private dialogRef : MatDialogRef<SpecialtyDetailComponent>,
  	private configService : ConfigService,
  	public formBuilder : FormBuilder
  ) { 
  	console.log(specialtyData);
    this.specialtyForm = this.formBuilder.group({
    	id       : new FormControl({value:specialtyData.id, disabled:true}, [Validators.required]),
			name     : new FormControl({value:specialtyData.name, disabled:true}, [Validators.required]),
			price     : new FormControl({value:specialtyData.price, disabled:true}, [Validators.required]),
    });
   }

	update(){
		if(this.specialtyForm.invalid) return;
		this.processing = true;
		this.configService.updateSpecialty(this.specialtyForm.value)
		.subscribe(res => {
			new SwalComponent({type:'success', toast:true, position:'top-right', html:'<p>Datos actualizados</p>', timer:1500}).show();
			this.processing = false;
			this.dialogRef.close({updated:true});
		}, error => {
			this.processing = false;
			new SwalComponent({type:'error', toast:true, timer:4000, position:'top-right', html:'<p>Ha ocurrido un error al actualizar los datos</p>'}).show();
		});
	}

	toggleChange(event){
		if(event.checked)
			return this.specialtyForm.enable();
		return this.specialtyForm.disable();
	}   

}
