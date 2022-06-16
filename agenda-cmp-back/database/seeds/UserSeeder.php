<?php

use Illuminate\Database\Seeder;
use App\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = [
        	[
                "name" => "Admin",
                "surname" => "El Batan",
                "email" => "admin@clinicaelbatan.com",
                "phone" => "+58123456789",
                "password" => bcrypt(123456),
                "dni" => "0000000000",
                "role" => 1
            ],
            [
                "name" => "Leonardo",
                "surname" => "Armijos",
                "email" => "leonardo@oyzecuador.com",
                "phone" => "+593 98 469 1025",
                "password" => bcrypt("quantum@2018admin"),
                "dni" => "0000000001",
                "role" => 1
            ]            
        ];
        foreach ($users as $user) {
        	User::create($user);
        }
    }
}
