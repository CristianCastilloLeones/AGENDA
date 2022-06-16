<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\TimeTable;

class Schedule extends Model
{
    public $table = "schedules";
    public $timestamps = false;
    protected $fillable = ["user", "time", "dow"];

    public function getTimeAttribute($value){
    	return TimeTable::find($value);
    }
}
