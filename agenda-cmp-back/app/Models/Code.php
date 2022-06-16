<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Code extends Model
{
    public $table = "codes";
    protected $fillable = ["user", "code", "verified"];
    public $timestamps = false;
}
