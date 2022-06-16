<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePatientTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('patients', function (Blueprint $table) {
        $table->increments('id');
        $table->integer('user')->index()->unsigned();
        $table->foreign('user')->references('id')->on('users');
        $table->string('fname')->nullable();
        $table->string('fphone')->nullable();
        $table->date('birthdate')->nullable();
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
        Schema::dropIfExists('patients');
    }
}
