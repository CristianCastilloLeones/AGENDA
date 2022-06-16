<?php

use Illuminate\Database\Seeder;
use App\Models\Patient;
use App\User;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $u = User::create([
        	'name' => "Jose",
            'surname' => "Martinez",
            'phone' => "+55897841254",
        	'email' => "jose@gmail.com",
        	'password' => bcrypt("password"),
            "dni" => "24237707",
            "origin" => 0,
        	'role' => 3
        ]);
        Patient::create(["user" => $u->id, "fname" => "Julia Martinez", "fphone" => "+55798465132", "birthdate" => "1992-10-11"]);
    }
}
