<?php

use Illuminate\Database\Seeder;
use App\Models\Doctor;
use App\User;

class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $doc1 = User::create([
        	'name' => "Juan",
            'surname' => "Perez",
            'phone' => "+12123465798",
        	'email' => "juan@gmail.com",
        	'password' => bcrypt("password"),
            "dni" => "24237705",
        	'role' => 2
        ]);

        $doc2 = User::create([
            'name' => "Miguel",
            'surname' => "Martinez",
            'phone' => "+12123465298",
            'email' => "miguel@gmail.com",
            'password' => bcrypt("password"),
            "dni" => "24237700",
            'role' => 2
        ]);        

        Doctor::create(["user" => $doc1->id, "specialty" => 1]);
        Doctor::create(["user" => $doc2->id, "specialty" => 2]);
    }
}
