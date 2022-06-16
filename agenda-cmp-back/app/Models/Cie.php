<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cie extends Model
{
    protected $fillable = ['cod_cie', 'descripcion', 'estado'];
    protected $table = 'cie';
}
