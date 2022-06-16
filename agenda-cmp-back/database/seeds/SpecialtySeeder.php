<?php

use Illuminate\Database\Seeder;
use App\Models\Specialty;

class SpecialtySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      Specialty::insert([["name" => "Cardiología"], ["name" => "Oftalmología"]]);
    }
}
