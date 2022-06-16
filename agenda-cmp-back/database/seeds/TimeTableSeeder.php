<?php

use App\Models\TimeTable;
use Illuminate\Database\Seeder;

class TimeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $timetable = [
            ["start" => "06:00:00", "end" => "06:29:59", "inning" => 1],
            ["start" => "06:30:00", "end" => "06:59:59", "inning" => 1],
            ["start" => "07:00:00", "end" => "07:29:59", "inning" => 1],
            ["start" => "07:30:00", "end" => "07:59:59", "inning" => 1],
            ["start" => "08:00:00", "end" => "08:29:59", "inning" => 1],
            ["start" => "08:30:00", "end" => "08:59:59", "inning" => 1],
            ["start" => "09:00:00", "end" => "09:29:59", "inning" => 1],
            ["start" => "09:30:00", "end" => "09:59:59", "inning" => 1],
            ["start" => "10:00:00", "end" => "10:29:59", "inning" => 1],
            ["start" => "10:30:00", "end" => "10:59:59", "inning" => 1],
            ["start" => "11:00:00", "end" => "11:29:59", "inning" => 1],
            ["start" => "11:30:00", "end" => "11:59:59", "inning" => 1],
            ["start" => "12:00:00", "end" => "12:29:59", "inning" => 1],
            ["start" => "12:30:00", "end" => "12:59:59", "inning" => 1],

            ["start" => "13:00:00", "end" => "13:29:59", "inning" => 2],
            ["start" => "13:30:00", "end" => "13:59:59", "inning" => 2],
            ["start" => "14:00:00", "end" => "14:29:59", "inning" => 2],
            ["start" => "14:30:00", "end" => "14:59:59", "inning" => 2],
            ["start" => "15:00:00", "end" => "15:29:59", "inning" => 2],
            ["start" => "15:30:00", "end" => "15:59:59", "inning" => 2],
            ["start" => "16:00:00", "end" => "16:29:59", "inning" => 2],
            ["start" => "16:30:00", "end" => "16:59:59", "inning" => 2],
            ["start" => "17:00:00", "end" => "17:29:59", "inning" => 2],
            ["start" => "17:30:00", "end" => "17:59:59", "inning" => 2],
            ["start" => "18:00:00", "end" => "18:29:59", "inning" => 2],
            ["start" => "18:30:00", "end" => "18:59:59", "inning" => 2],
            ["start" => "19:00:00", "end" => "19:29:59", "inning" => 2],
            ["start" => "19:30:00", "end" => "19:59:59", "inning" => 2],
            ["start" => "20:00:00", "end" => "20:29:59", "inning" => 2],
            ["start" => "20:30:00", "end" => "20:59:59", "inning" => 2],

            ["start" => "21:00:00", "end" => "21:29:59", "inning" => 2],
            ["start" => "21:30:00", "end" => "21:59:59", "inning" => 2],

            ["start" => "22:00:00", "end" => "22:29:59", "inning" => 2],
            ["start" => "22:30:00", "end" => "22:59:59", "inning" => 2],

            ["start" => "23:00:00", "end" => "23:29:59", "inning" => 2],
            ["start" => "23:30:00", "end" => "23:59:59", "inning" => 2],

        ];
        TimeTable::insert($timetable);

    }
}
