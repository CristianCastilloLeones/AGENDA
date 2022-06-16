<?php

namespace App\Http\Controllers\Config;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Schedule;

class ScheduleController extends Controller
{

    public function get($id, $dow){
      $schedule = Schedule::where("user", "=", $id)
      ->where("dow", '=', $dow)
      ->get(["time"]);
      return response()->json($schedule ?: [], $schedule ? 200 : 404);
    }

    public function getWeekly($id){
      $schedule = Schedule::where("user", "=", $id)
      ->get(["time", "dow"]);
      return response()->json($schedule ?: [], $schedule ? 200 : 404);
    }

    public function add(Request $request){
      Schedule::where('user', '=', $request->user)->delete();
      foreach ($request->time as $times) {
        foreach ($times as $time) {
          Schedule::create([
            "user" => $request->user,
            "time" => $time["time"],
            "dow" => $time["dow"]
          ]);
        }
      }
    	
      return response()->json([], 200);
    }

    public function remove($id){
    	$res = Schedule::find($id)->delete();
    	return response()->json(["success" => $res], $res ? 200 : 500);
    }
}
