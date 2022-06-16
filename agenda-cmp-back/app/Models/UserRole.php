<?php

namespace App\Models;

use App\User;
use App\Models\Role;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    protected $fillable = [
      'users_id', 'role_id'
  ];
    public $table = "user_role";
    public $timestamps = false;
    public function rol(){
    	return $this->hasMany(Role::class, 'id', 'role_id');

    }
    public function users(){
    	return $this->hasMany(User::class, 'id', 'users_id');

    }
}
