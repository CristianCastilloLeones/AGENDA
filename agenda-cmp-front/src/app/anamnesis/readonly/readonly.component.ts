import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConsultaService } from '../../services/consulta.service';

@Component({
  selector: 'app-readonly',
  templateUrl: './readonly.component.html',
  styleUrls: ['./readonly.component.css']
})

export class ReadonlyComponent {

  anamnesisForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private consultaService: ConsultaService
  ) {

    this.buildForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this.loadHistory(params.historia);
    }, error => {
      console.log(error);
    });
  }

  loadHistory(id: string | number) {
    this.buildForm();
    this.consultaService.getHistoria(id)
      .subscribe(res => {
        delete res['id'];
        delete res['created_at'];
        delete res['updated_at'];
        this.anamnesisForm.setValue(res);
      }, error => {
        console.log(error);
      });
  }

  buildForm() {

    this.anamnesisForm = this.formBuilder.group({
      patient: new FormControl({ value: 1, disabled: false }, [Validators.required]),
      doctor: new FormControl({ value: 1, disabled: false }, [Validators.required]),
      hcl: new FormControl({ value: 1, disabled: false }, [Validators.required]),
      event: new FormControl({ value: null, disabled: false }, [Validators.required]),
      motivo_a: new FormControl({ value: "-", disabled: false }),
      motivo_b: new FormControl({ value: null, disabled: false }),
      motivo_c: new FormControl({ value: null, disabled: false }),
      motivo_d: new FormControl({ value: null, disabled: false }),

      vacunas: new FormControl({ value: false, disabled: false }),
      enf_alergica: new FormControl({ value: false, disabled: false }),
      enf_neurologica: new FormControl({ value: false, disabled: false }),
      enf_traumatologica: new FormControl({ value: false, disabled: false }),
      tendencia_sex: new FormControl({ value: false, disabled: false }),
      actividad_sex: new FormControl({ value: false, disabled: false }),
      enf_perinatal: new FormControl({ value: false, disabled: false }),
      enf_cardiaca: new FormControl({ value: false, disabled: false }),
      enf_metabolica: new FormControl({ value: false, disabled: false }),
      enf_quirurgica: new FormControl({ value: false, disabled: false }),
      riesgo_social: new FormControl({ value: false, disabled: false }),
      dieta_habitos: new FormControl({ value: false, disabled: false }),
      enf_infancia: new FormControl({ value: false, disabled: false }),
      enf_respiratoria: new FormControl({ value: false, disabled: false }),
      enf_hemo_linf: new FormControl({ value: false, disabled: false }),
      enf_mental: new FormControl({ value: false, disabled: false }),
      riesgo_laboral: new FormControl({ value: false, disabled: false }),
      religion_cultura: new FormControl({ value: false, disabled: false }),
      enf_adolecente: new FormControl({ value: false, disabled: false }),
      enf_digestiva: new FormControl({ value: false, disabled: false }),
      enf_urinaria_x: new FormControl({ value: false, disabled: false }),
      enf_t_sex: new FormControl({ value: false, disabled: false }),
      riesgo_familiar: new FormControl({ value: false, disabled: false }),
      otro: new FormControl({ value: false, disabled: false }),
      antecedente_personales: new FormControl({ value: null, disabled: false }),

      cardiopatia: new FormControl({ value: false, disabled: false }),
      diabetes: new FormControl({ value: false, disabled: false }),
      enf_vasculares: new FormControl({ value: false, disabled: false }),
      hta: new FormControl({ value: false, disabled: false }),
      cancer: new FormControl({ value: false, disabled: false }),
      tuberculosis: new FormControl({ value: false, disabled: false }),
      enf_mental_p: new FormControl({ value: false, disabled: false }),
      enf_infecciosa: new FormControl({ value: false, disabled: false }),
      mal_formacion: new FormControl({ value: false, disabled: false }),
      otro_p: new FormControl({ value: false, disabled: false }),
      antecedentes_familiares: new FormControl({ value: null, disabled: false }),

      enf_problema_actual: new FormControl({ value: null, disabled: false }),

      cp_sentidos: new FormControl({ value: false, disabled: false }),
      sp_sentidos: new FormControl({ value: false, disabled: false }),
      cp_respiratorio: new FormControl({ value: false, disabled: false }),
      sp_respiratorio: new FormControl({ value: false, disabled: false }),
      cp_cardiovascular: new FormControl({ value: false, disabled: false }),
      sp_cardiovascular: new FormControl({ value: false, disabled: false }),
      cp_digestivos: new FormControl({ value: false, disabled: false }),
      sp_digestivos: new FormControl({ value: false, disabled: false }),
      cp_genital: new FormControl({ value: false, disabled: false }),
      sp_genital: new FormControl({ value: false, disabled: false }),
      cp_urinario: new FormControl({ value: false, disabled: false }),
      sp_urinario: new FormControl({ value: false, disabled: false }),
      cp_musculo_esqueletico: new FormControl({ value: false, disabled: false }),
      sp_musculo_esqueletico: new FormControl({ value: false, disabled: false }),
      cp_endocrino: new FormControl({ value: false, disabled: false }),
      sp_endocrino: new FormControl({ value: false, disabled: false }),
      cp_hemo_linfatico: new FormControl({ value: false, disabled: false }),
      sp_hemo_linfatico: new FormControl({ value: false, disabled: false }),
      cp_nervioso: new FormControl({ value: false, disabled: false }),
      sp_nervioso: new FormControl({ value: false, disabled: false }),
      revision_org_sistemas: new FormControl({ value: null, disabled: false }),

      ta: new FormControl({ value: null, disabled: false }),
      fc: new FormControl({ value: null, disabled: false }),
      fr: new FormControl({ value: null, disabled: false }),
      sat02: new FormControl({ value: null, disabled: false }),
      temp_bucal: new FormControl({ value: null, disabled: false }),
      peso: new FormControl({ value: null, disabled: false }),
      glucemia: new FormControl({ value: null, disabled: false }),
      talla: new FormControl({ value: null, disabled: false }),
      gcs_m: new FormControl({ value: null, disabled: false }),
      gcs_o: new FormControl({ value: null, disabled: false }),
      gcs_v: new FormControl({ value: null, disabled: false }),
      signos_vitales: new FormControl({ value: null, disabled: false }),

      cp_r_piel_franeras: new FormControl({ value: false, disabled: false }),
      cp_r_cabeza: new FormControl({ value: false, disabled: false }),
      cp_r_ojos: new FormControl({ value: false, disabled: false }),
      cp_r_oidos: new FormControl({ value: false, disabled: false }),
      cp_r_nariz: new FormControl({ value: false, disabled: false }),
      cp_r_boca: new FormControl({ value: false, disabled: false }),
      cp_r_orofaringe: new FormControl({ value: false, disabled: false }),
      cp_r_cuello: new FormControl({ value: false, disabled: false }),
      cp_r_axilas_mamas: new FormControl({ value: false, disabled: false }),
      cp_r_torax: new FormControl({ value: false, disabled: false }),
      cp_r_abdomen: new FormControl({ value: false, disabled: false }),
      cp_r_columna: new FormControl({ value: false, disabled: false }),
      cp_r_ingle_perine: new FormControl({ value: false, disabled: false }),
      cp_r_miembros_superiores: new FormControl({ value: false, disabled: false }),
      cp_r_miembros: new FormControl({ value: false, disabled: false }),
      cp_s_sentidos: new FormControl({ value: false, disabled: false }),
      cp_s_respiratorio: new FormControl({ value: false, disabled: false }),
      cp_s_cardiovascular: new FormControl({ value: false, disabled: false }),
      cp_s_digestivo: new FormControl({ value: false, disabled: false }),
      cp_s_genital: new FormControl({ value: false, disabled: false }),
      cp_s_urinario: new FormControl({ value: false, disabled: false }),
      cp_s_musculo_esqueletico: new FormControl({ value: false, disabled: false }),
      cp_s_endocrino: new FormControl({ value: false, disabled: false }),
      cp_s_hemolinfaticos: new FormControl({ value: false, disabled: false }),
      cp_s_neurologico: new FormControl({ value: false, disabled: false }),

      sp_r_piel_franeras: new FormControl({ value: false, disabled: false }),
      sp_r_cabeza: new FormControl({ value: false, disabled: false }),
      sp_r_ojos: new FormControl({ value: false, disabled: false }),
      sp_r_oidos: new FormControl({ value: false, disabled: false }),
      sp_r_nariz: new FormControl({ value: false, disabled: false }),
      sp_r_boca: new FormControl({ value: false, disabled: false }),
      sp_r_orofaringe: new FormControl({ value: false, disabled: false }),
      sp_r_cuello: new FormControl({ value: false, disabled: false }),
      sp_r_axilas_mamas: new FormControl({ value: false, disabled: false }),
      sp_r_torax: new FormControl({ value: false, disabled: false }),
      sp_r_abdomen: new FormControl({ value: false, disabled: false }),
      sp_r_columna: new FormControl({ value: false, disabled: false }),
      sp_r_ingle_perine: new FormControl({ value: false, disabled: false }),
      sp_r_miembros_superiores: new FormControl({ value: false, disabled: false }),
      sp_r_miembros: new FormControl({ value: false, disabled: false }),
      sp_s_sentidos: new FormControl({ value: false, disabled: false }),
      sp_s_respiratorio: new FormControl({ value: false, disabled: false }),
      sp_s_cardiovascular: new FormControl({ value: false, disabled: false }),
      sp_s_digestivo: new FormControl({ value: false, disabled: false }),
      sp_s_genital: new FormControl({ value: false, disabled: false }),
      sp_s_urinario: new FormControl({ value: false, disabled: false }),
      sp_s_musculo_esqueletico: new FormControl({ value: false, disabled: false }),
      sp_s_endocrino: new FormControl({ value: false, disabled: false }),
      sp_s_hemolinfaticos: new FormControl({ value: false, disabled: false }),
      sp_s_neurologico: new FormControl({ value: false, disabled: false }),

      examen_fisico: new FormControl({ value: null, disabled: false })
    });
  }

  ant_personales = [
    { name: 'VACUNAS', control: 'vacunas' },
    { name: 'ENF ALÉRGICA', control: 'enf_alergica' },
    { name: 'ENF NEUROLÓGICA', control: 'enf_neurologica' },
    { name: 'ENF TRAUMATOLÓGICA', control: 'enf_traumatologica' },
    { name: 'TENDENDENCIA SEXUAL', control: 'tendencia_sex' },
    { name: 'ACTIVIDAD SEXUAL', control: 'actividad_sex' },

    { name: 'ENF PERINATAL', control: 'enf_perinatal' },
    { name: 'ENF CARDIACA', control: 'enf_cardiaca' },
    { name: 'ENF METABÓLICA', control: 'enf_metabolica' },
    { name: 'ENF QUIRURGICA', control: 'enf_quirurgica' },
    { name: 'RIESGO SOCIAL', control: 'riesgo_social' },
    { name: 'DIETA Y HABITOS', control: 'dieta_habitos' },

    { name: 'ENF INFANCIA', control: 'enf_infancia' },
    { name: 'ENF RESPIRATORIA', control: 'enf_respiratoria' },
    { name: 'ENF HEMO LINF', control: 'enf_hemo_linf' },
    { name: 'ENF MENTAL', control: 'enf_mental' },
    { name: 'RIESGO LABORAL', control: 'riesgo_laboral' },
    { name: 'RELIGION Y CULTURA', control: 'religion_cultura' },

    { name: 'ENF ADOLESCENTE', control: 'enf_adolecente' },
    { name: 'ENF DIGESTIVA', control: 'enf_digestiva' },
    { name: 'ENF URINARIA X', control: 'enf_urinaria_x' },
    { name: 'ENF T SEXUAL', control: 'enf_t_sex' },
    { name: 'RIESGO FAMILIAR', control: 'riesgo_familiar' },
    { name: 'OTRO', control: 'otro' },
  ];

  ant_familiares = [
    { name: 'CARDIOPATIA', control: 'cardiopatia' },
    { name: 'DIABETES', control: 'diabetes' },
    { name: 'ENF VASCULARES', control: 'enf_vasculares' },
    { name: 'HTA', control: 'hta' },
    { name: 'CANCER', control: 'cancer' },
    { name: 'TUBERCULOSIS', control: 'tuberculosis' },
    { name: 'ENF MENTAL', control: 'enf_mental_p' },
    { name: 'ENF INFECCIOSA', control: 'enf_infecciosa' },
    { name: 'MAL FORMACIÓN', control: 'mal_formacion' },
    { name: 'OTRO', control: 'otro_p' },
  ];

  revision_actual = [
    { name: 'ÓRGANOS DE LOS SENTIDOS', cp: 'cp_sentidos', sp: 'sp_sentidos' },
    { name: 'RESPIRATORIO', cp: 'cp_respiratorio', sp: 'sp_respiratorio' },
    { name: 'CARDIOVASCULAR', cp: 'cp_cardiovascular', sp: 'sp_cardiovascular' },
    { name: 'DIGESTIVOS', cp: 'cp_digestivos', sp: 'sp_digestivos' },
    { name: 'GENITAL', cp: 'cp_genital', sp: 'sp_genital' },
    { name: 'URINARIO', cp: 'cp_urinario', sp: 'sp_urinario' },
    { name: 'MÚSCULO ESQUELETICO', cp: 'cp_musculo_esqueletico', sp: 'sp_musculo_esqueletico' },
    { name: 'ENDOCRINO', cp: 'cp_endocrino', sp: 'sp_endocrino' },
    { name: 'HEMO LINFÁTICO', cp: 'cp_hemo_linfatico', sp: 'sp_hemo_linfatico' },
    { name: 'NERVIOSO', cp: 'cp_nervioso', sp: 'sp_nervioso' },
  ];

  signos_vitales = [
    { name: 'T.A', control: 'ta' },
    { name: 'F.C', control: 'fc' },
    { name: 'F.R', control: 'fr' },
    { name: 'SAT 02', control: 'sat02' },
    { name: 'TEMP BUCAL', control: 'temp_bucal' },
    { name: 'PESO', control: 'peso' },
    { name: 'GLUCEMIA', control: 'glucemia' },
    { name: 'TALLA', control: 'talla' },
  ];

  examen_fisico = [
    { name: 'R PIEL Y FANERAS', cp: 'cp_r_piel_franeras', sp: 'sp_r_piel_franeras' },
    { name: 'R CABEZA', cp: 'cp_r_cabeza', sp: 'sp_r_cabeza' },
    { name: 'R OJOS', cp: 'cp_r_ojos', sp: 'sp_r_ojos' },
    { name: 'R OIDOS', cp: 'cp_r_oidos', sp: 'sp_r_oidos' },
    { name: 'R NARIZ', cp: 'cp_r_nariz', sp: 'sp_r_nariz' },
    { name: 'R BOCA', cp: 'cp_r_boca', sp: 'sp_r_boca' },
    { name: 'R OROFARINGE', cp: 'cp_r_orofaringe', sp: 'sp_r_orofaringe' },
    { name: 'R CUELLO', cp: 'cp_r_cuello', sp: 'sp_r_cuello' },
    { name: 'R AXILAS MAMAS', cp: 'cp_r_axilas_mamas', sp: 'sp_r_axilas_mamas' },
    { name: 'R TORAX', cp: 'cp_r_torax', sp: 'sp_r_torax' },
    { name: 'R ABDOMEN', cp: 'cp_r_abdomen', sp: 'sp_r_abdomen' },
    { name: 'R COLUMNA VERTEBRAL', cp: 'cp_r_columna', sp: 'sp_r_columna' },
    { name: 'R INGLE-PERINE', cp: 'cp_r_ingle_perine', sp: 'sp_r_ingle_perine' },
    { name: 'R MIEMBROS SUPERIORES', cp: 'cp_r_miembros_superiores', sp: 'sp_r_miembros_superiores' },
    { name: 'R MIEMBROS', cp: 'cp_r_miembros', sp: 'sp_r_miembros' },
    { name: 'S ORGANOS DE LOS SENTIDOS', cp: 'cp_s_sentidos', sp: 'sp_s_sentidos' },
    { name: 'S RESPIRATORIO', cp: 'cp_s_respiratorio', sp: 'sp_s_respiratorio' },
    { name: 'S CARDIOVASCULAR', cp: 'cp_s_cardiovascular', sp: 'sp_s_cardiovascular' },
    { name: 'S DISGESTIVO', cp: 'cp_s_digestivo', sp: 'sp_s_digestivo' },
    { name: 'S GENITAL', cp: 'cp_s_genital', sp: 'sp_s_genital' },
    { name: 'S URINARIO', cp: 'cp_s_urinario', sp: 'sp_s_urinario' },
    { name: 'S MUSCULO-ESQUELETICO', cp: 'cp_s_musculo_esqueletico', sp: 'sp_s_musculo_esqueletico' },
    { name: 'S ENDOCRINO', cp: 'cp_s_endocrino', sp: 'sp_s_endocrino' },
    { name: 'S HEMOLINFÁTICOS', cp: 'cp_s_hemolinfaticos', sp: 'sp_s_hemolinfaticos' },
    { name: 'S NEUROLÓGICO', cp: 'cp_s_neurologico', sp: 'sp_s_neurologico' },
  ];

}
