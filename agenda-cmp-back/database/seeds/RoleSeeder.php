<?php

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $roles = [
      	["name" => "admin"],
      	["name" => "medico"],
      	["name" => "paciente"],
      	["name" => "asistente"]
      ];

      foreach ($roles as $role) {
      	Role::create($role);
      }
    }
}