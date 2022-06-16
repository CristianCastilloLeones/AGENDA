<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    public $table = "patients";
    protected $fillable = ["user", "birthdate", "fname", "fphone"];

    public function getUserAttribute($value){
    	return \DB::table('users')->where('id', '=', $value)->get(["id", "name", "email"]);
    }
}