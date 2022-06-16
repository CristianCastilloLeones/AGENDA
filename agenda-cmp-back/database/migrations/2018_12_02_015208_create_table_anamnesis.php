<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableAnamnesis extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('anamnesis', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('patient')->index()->unsigned();
            $table->foreign('patient')->references('id')->on('users');
            $table->integer('doctor')->index()->unsigned();
            $table->foreign('doctor')->references('id')->on('users');
            $table->string('hcl');
            $table->string('motivo_a');
            $table->string('motivo_b');
            $table->string('motivo_c');
            $table->string('motivo_d');
            $table->boolean('vacunas')->default(false);
            $table->boolean('enf_alergica')->default(false);
            $table->boolean('enf_neurologica')->default(false);
            $table->boolean('enf_traumatologica')->default(false);
            $table->boolean('tendencia_sex')->default(false);
            $table->boolean('actividad_sex')->default(false);
            $table->boolean('enf_perinatal')->default(false);
            $table->boolean('enf_cardiaca')->default(false);
            $table->boolean('enf_metabolica')->default(false);
            $table->boolean('enf_quirurgica')->default(false);
            $table->boolean('riesgo_social')->default(false);
            $table->boolean('dieta_habitos')->default(false);
            $table->boolean('enf_infancia')->default(false);
            $table->boolean('enf_respiratoria')->default(false);
            $table->boolean('enf_hemo_linf')->default(false);
            $table->boolean('enf_mental')->default(false);
            $table->boolean('riesgo_laboral')->default(false);
            $table->boolean('religion_cultura')->default(false);
            $table->boolean('enf_adolecente')->default(false);
            $table->boolean('enf_digestiva')->default(false);
            $table->boolean('enf_urinaria_x')->default(false);
            $table->boolean('enf_t_sex')->default(false);
            $table->boolean('riesgo_familiar')->default(false);
            $table->boolean('otro')->default(false);

            $table->mediumText('antecendente_personales')->nullable();
            $table->boolean('cardiopatia')->default(false);
            $table->boolean('diabetes')->default(false);
            $table->boolean('enf_vasculares')->default(false);
            $table->boolean('hta')->default(false);
            $table->boolean('cancer')->default(false);
            $table->boolean('tuberculosis')->default(false);
            $table->boolean('enf_mental_p')->default(false);
            $table->boolean('enf_infecciosa')->default(false);
            $table->boolean('mal_formacion')->default(false);
            $table->boolean('otro_p')->default(false);
            $table->mediumText('antecedentes_familares')->nullable();

            $table->mediumText('enf_problema_actual')->nullable();

            $table->boolean('cp_sentidos')->default(false);
            $table->boolean('sp_sentidos')->default(false);
            $table->boolean('cp_respiratorio')->default(false);
            $table->boolean('sp_respiratorio')->default(false);
            $table->boolean('cp_cardiovascular')->default(false);
            $table->boolean('sp_cardiovascular')->default(false);
            $table->boolean('cp_digestivos')->default(false);
            $table->boolean('sp_digestivos')->default(false);
            $table->boolean('cp_genital')->default(false);
            $table->boolean('sp_genital')->default(false);
            $table->boolean('cp_urinario')->default(false);
            $table->boolean('sp_urinario')->default(false);
            $table->boolean('cp_musculo_esqueletico')->default(false);
            $table->boolean('sp_musculo_esqueletico')->default(false);
            $table->boolean('cp_endocrino')->default(false);
            $table->boolean('sp_endocrino')->default(false);
            $table->boolean('cp_hemo_linfatico')->default(false);
            $table->boolean('sp_hemo_linfatico')->default(false);
            $table->boolean('cp_nervioso')->default(false);
            $table->boolean('sp_nervioso')->default(false);
            $table->mediumText('revision_org_sistemas')->nullable();

            $table->text('ta')->nullable();
            $table->text('fc')->nullable();
            $table->text('fr')->nullable();
            $table->text('sat02')->nullable();
            $table->text('temp_bucal')->nullable();
            $table->text('peso')->nullable();
            $table->text('glucemia')->nullable();
            $table->text('talla')->nullable();
            $table->text('gcs_m')->nullable();
            $table->text('gcs_o')->nullable();
            $table->text('gcs_v')->nullable();
            $table->mediumText('signos_vitales')->nullable();

            $table->boolean('cp_r_piel_franeras')->default(false);
            $table->boolean('cp_r_cabeza')->default(false);
            $table->boolean('cp_r_ojos')->default(false);
            $table->boolean('cp_r_oidos')->default(false);
            $table->boolean('cp_r_nariz')->default(false);
            $table->boolean('cp_r_boca')->default(false);
            $table->boolean('cp_r_orofaringe')->default(false);
            $table->boolean('cp_r_cuello')->default(false);
            $table->boolean('cp_r_axilas_mamas')->default(false);
            $table->boolean('cp_r_torax')->default(false);
            $table->boolean('cp_r_abdomen')->default(false);
            $table->boolean('cp_r_columna')->default(false);
            $table->boolean('cp_r_ingle_perine')->default(false);
            $table->boolean('cp_r_miembros_superiores')->default(false);
            $table->boolean('cp_r_miembros')->default(false);
            $table->boolean('cp_s_sentidos')->default(false);
            $table->boolean('cp_s_respiratorio')->default(false);
            $table->boolean('cp_s_cardiovascular')->default(false);
            $table->boolean('cp_s_digestivo')->default(false);
            $table->boolean('cp_s_genital')->default(false);
            $table->boolean('cp_s_urinario')->default(false);
            $table->boolean('cp_s_musculo_esqueletico')->default(false);
            $table->boolean('cp_s_endocrino')->default(false);
            $table->boolean('cp_s_hemolinfaticos')->default(false);
            $table->boolean('cp_s_neurologico')->default(false);

            $table->boolean('sp_r_piel_franeras')->default(false);
            $table->boolean('sp_r_cabeza')->default(false);
            $table->boolean('sp_r_ojos')->default(false);
            $table->boolean('sp_r_oidos')->default(false);
            $table->boolean('sp_r_nariz')->default(false);
            $table->boolean('sp_r_boca')->default(false);
            $table->boolean('sp_r_orofaringe')->default(false);
            $table->boolean('sp_r_cuello')->default(false);
            $table->boolean('sp_r_axilas_mamas')->default(false);
            $table->boolean('sp_r_torax')->default(false);
            $table->boolean('sp_r_abdomen')->default(false);
            $table->boolean('sp_r_columna')->default(false);
            $table->boolean('sp_r_ingle_perine')->default(false);
            $table->boolean('sp_r_miembros_superiores')->default(false);
            $table->boolean('sp_r_miembros')->default(false);
            $table->boolean('sp_s_sentidos')->default(false);
            $table->boolean('sp_s_respiratorio')->default(false);
            $table->boolean('sp_s_cardiovascular')->default(false);
            $table->boolean('sp_s_digestivo')->default(false);
            $table->boolean('sp_s_genital')->default(false);
            $table->boolean('sp_s_urinario')->default(false);
            $table->boolean('sp_s_musculo_esqueletico')->default(false);
            $table->boolean('sp_s_endocrino')->default(false);
            $table->boolean('sp_s_hemolinfaticos')->default(false);
            $table->boolean('sp_s_neurologico')->default(false);

            $table->mediumText('examen_fisico')->nullable();

            $table->timestamps();
        });        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
