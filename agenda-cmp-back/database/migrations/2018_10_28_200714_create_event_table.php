<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('timeblock')->index()->unsigned();
            $table->foreign('timeblock')->references('id')->on('timetables');
            $table->integer('doc')->index()->unsigned();
            $table->foreign('doc')->references('id')->on('users');
            $table->integer('pat')->index()->unsigned();
            $table->foreign('pat')->references('id')->on('users');
            $table->date('day');
            $table->string('observation')->nullable();
            $table->string('code')->unique();
            $table->integer('status')->default(1);
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
        Schema::dropIfExists('events');
    }
}
