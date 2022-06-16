<?php

namespace App;

use App\Schedule;
use App\Models\Role;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\UserRole;
use App\Models\Specialty;
use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
  use Notifiable, HasApiTokens;

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
      'name', 'email', 'password', 'status', 'role', 'dni', 'phone', 'surname', 'origin','branch_office_id','user_fq'
  ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    public function getSchedule(){
        return Schedule::where('user', '=', $this->id)->get();
    }

    public function isActive(){
        return $this->status;
    }
    public function role(){
        return $this->hasMany(UserRole::class, 'users_id', 'id');
    }
    public function doctors(){
        return $this->hasMany(Doctor::class, 'user', 'id');
    }
public function patients(){
        return $this->belongsTo(Patient::class, 'user', 'id');
    }
}
