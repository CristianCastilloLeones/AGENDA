<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateScheduleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('schedules', function (Blueprint $table) {
        $table->integer('user')->index()->unsigned();
        $table->foreign('user')->references('id')->on('users');
        $table->integer('time')->index()->unsigned();
        $table->foreign('time')->references('id')->on('timetables');
        $table->integer('dow');
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('schedules');
    }
}
