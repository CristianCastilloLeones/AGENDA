<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Anamnesis extends Model
{
    protected $fillable = [
        'id',
        'patient',
        'doctor',
        'hcl',
        'motivo_a',
        'motivo_b',
        'motivo_c',
        'motivo_d',
        'vacunas',
        'enf_alergica',
        'enf_neurologica',
        'enf_traumatologica',
        'tendencia_sex',
        'actividad_sex',
        'enf_perinatal',
        'enf_cardiaca',
        'enf_metabolica',
        'enf_quirurgica',
        'riesgo_social',
        'dieta_habitos',
        'enf_infancia',
        'enf_respiratoria',
        'enf_hemo_linf',
        'enf_mental',
        'riesgo_laboral',
        'religion_cultura',
        'enf_adolecente',
        'enf_digestiva',
        'enf_urinaria_x',
        'enf_t_sex',
        'riesgo_familiar',
        'otro',
        'antecendente_personales',
        'cardiopatia',
        'diabetes',
        'enf_vasculares',
        'hta',
        'cancer',
        'tuberculosis',
        'enf_mental_p',
        'enf_infecciosa',
        'mal_formacion',
        'otro_p',
        'antecedentes_familares',
        'enf_problema_actual',
        'cp_sentidos',
        'sp_sentidos',
        'cp_respiratorio',
        'sp_respiratorio',
        'cp_cardiovascular',
        'sp_cardiovascular',
        'cp_digestivos',
        'sp_digestivos',
        'cp_genital',
        'sp_genital',
        'cp_urinario',
        'sp_urinario',
        'cp_musculo_esqueletico',
        'sp_musculo_esqueletico',
        'cp_endocrino',
        'sp_endocrino',
        'cp_hemo_linfatico',
        'sp_hemo_linfatico',
        'cp_nervioso',
        'sp_nervioso',
        'revision_org_sistemas',
        'ta',
        'fc',
        'fr',
        'sat02',
        'temp_bucal',
        'peso',
        'glucemia',
        'talla',
        'gcs_m',
        'gcs_o',
        'gcs_v',
        'signos_vitales',
        'cp_r_piel_franeras',
        'cp_r_cabeza',
        'cp_r_ojos',
        'cp_r_oidos',
        'cp_r_nariz',
        'cp_r_boca',
        'cp_r_orofaringe',
        'cp_r_cuello',
        'cp_r_axilas_mamas',
        'cp_r_torax',
        'cp_r_abdomen',
        'cp_r_columna',
        'cp_r_ingle_perine',
        'cp_r_miembros_superiores',
        'cp_r_miembros',
        'cp_s_sentidos',
        'cp_s_respiratorio',
        'cp_s_cardiovascular',
        'cp_s_digestivo',
        'cp_s_genital',
        'cp_s_urinario',
        'cp_s_musculo_esqueletico',
        'cp_s_endocrino',
        'cp_s_hemolinfaticos',
        'cp_s_neurologico',
        'sp_r_piel_franeras',
        'sp_r_cabeza',
        'sp_r_ojos',
        'sp_r_oidos',
        'sp_r_nariz',
        'sp_r_boca',
        'sp_r_orofaringe',
        'sp_r_cuello',
        'sp_r_axilas_mamas',
        'sp_r_torax',
        'sp_r_abdomen',
        'sp_r_columna',
        'sp_r_ingle_perine',
        'sp_r_miembros_superiores',
        'sp_r_miembros',
        'sp_s_sentidos',
        'sp_s_respiratorio',
        'sp_s_cardiovascular',
        'sp_s_digestivo',
        'sp_s_genital',
        'sp_s_urinario',
        'sp_s_musculo_esqueletico',
        'sp_s_endocrino',
        'sp_s_hemolinfaticos',
        'sp_s_neurologico',
        'examen_fisico'
    ];
}