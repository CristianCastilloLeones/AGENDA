<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    public $timestamps = false;
    public $table = "holidays";
    protected $fillable = ["day", "month"];
}
