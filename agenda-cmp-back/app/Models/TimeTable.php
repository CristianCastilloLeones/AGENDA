<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeTable extends Model
{
    public $table = "timetables";
    protected $fillable = ["id", "start", "end", "inning"];
    public $timestamps = false;
}
