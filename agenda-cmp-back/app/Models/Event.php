<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\TimeTable;
use Carbon\Carbon;
use App\User;

class Event extends Model
{
    public $table = "events";
    protected $fillable = ["timeblock", "doc", "pat", "day", "status", "observation", "code"];

    public function getTimeblockAttribute($value){
    	return TimeTable::find($value)->id;
    }

    public function getPatAttribute($value){
    	return User::find($value);
    }

    public function getDocAttribute($value){
    	return User::find($value);	
    }

}
