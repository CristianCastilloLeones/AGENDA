<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Specialty;

class Doctor extends Model
{
    public $table = "doctors";
    protected $fillable = ["user", "specialty"];

    public function getSpecialtyAttribute($value){
    	return Specialty::find($value);
    }
    
    public function specialties(){
        return $this->hasMany(Specialty::class, 'id', 'specialty');
    }
}
