<?php

namespace App\Http\Controllers\Events;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Users\{DocController, PatientController};
use App\Models\Event;
use App\Models\Schedule;
use App\Models\Specialty;
use App\Models\TimeTable;
use App\Models\Doctor;
use App\User;
use Carbon\Carbon;
use App\Http\Controllers\Events\MailController;

class EventController extends Controller
{

	public function get($id){
		$event = Event::find($id);
		return response()->json($event);
	}

  public function getAllToday(){
    $events = \DB::table('events as e')
    ->select('e.id', 'e.day', 'time.start', 'time.end', 'u.name', 'u.surname', 'u.name', 'u.phone', 'u.email', 'e.status')
    ->join('timetables as time', 'e.timeblock', 'time.id')
    ->join('users as u', 'e.pat', 'u.id')
    ->get(["start", "end", "day"]);

    foreach ($events as $event) {
      $event->start = $event->day."T".$event->start;
      $event->end   = $event->day."T".$event->end;
      $event->color = DocController::bgEvent($event->status)[0];
      $event->textColor = DocController::bgEvent($event->status)[1];
      $event->title = "$event->phone | $event->name $event->surname";
    }
    
    return response()->json($events, 200);
  }

  public function cancel($id, Request $request){
    $event = Event::find($id);
    $event->status = 2;
    $event->observation = $request->observation ?: null;
    $res = $event->save();
    $event->day = $request->day;

    //$specialty = Doctor::find($event->doc["id"])->specialty->name;
    
    //$event->specialty = $specialty;
    
    MailController::send(3, $event);

    return response()->json([
     "success" => $res,
     "observation" => $event->observation], 200);
  }

  public function finalize($id, Request $request){
    $event = Event::find($id);
    $event->status = $request->result;
    $event->observation = $request->observation;
    $res = $event->save();
    return response()->json([
     "success" => $res], 200);    
  }

  public function getByDate($doc, $day, $month, $year){

    $day = $day < 10 ? '0'.$day : $day;
    $month = $month < 10 ? '0'.$month : $month;
		
		$daySchedule = $this->getBlocks($doc, $day, $month, $year);  	

  	$event = Event::where('doc', '=', $doc)
  	->where('day', '=', "$year-$month-$day")
  	->whereIn('timeblock', $daySchedule)
  	->get(["timeblock"]);

    $takenBlocks = array_map(function($el){
      return $el["timeblock"];
    }, $event->toArray());
    
    $availableBlocks = Schedule::where('user', '=', $doc)
    ->where('dow', '=',date("N", strtotime("$day-$month-$year")))
    ->whereNotIn('time', $takenBlocks)
    ->get(["time"]);

    $isToday = Carbon::now()->timezone('America/Guayaquil')->format('Y-m-d') == "$year-$month-$day";

    if($isToday){
      $available = array_filter($availableBlocks->toArray(), function ($value){
        $now = Carbon::now()->timezone('America/Guayaquil')->format('H:s:i');
        error_log($now);
        error_log($value["time"]["start"]);
        if($now < $value["time"]["start"]) return $value;
      });
    }else{
      $available = $availableBlocks;
    }

  	return response()->json($available, 200);

  }

  public function reagendar($id, Request $request){
    $day = $request->day . " 00:00:00";
    $event = Event::find($id);
    
    $checkDoc = Event::where("day", "=", $day)
    ->where("doc", '=', $event->doc->id)
    ->where("timeblock", "=", $request->timeblock)
    ->get();

    $checkPat = Event::where("day", "=", $day)
    ->where("pat", '=', $event->pat->id)
    ->where("timeblock", "=", $request->timeblock)
    ->get();

    if(sizeof($checkDoc) > 0 || sizeof($checkPat) > 0) return response()->json(["alreadytaken" => true], 409);

    $event->day = $day;
    $event->timeblock= $request->timeblock;
    $event->observation = $request->observation;
    $event->status = 3;
    $res = $event->save();

    $event->day = $request->day;

    $timeblock = TimeTable::find($request->timeblock)->start;
    //$specialty = Doctor::find($event->doc["id"])->specialty->name;
    
    //$event->specialty = $specialty;
    $event->hour = $timeblock;

    if($res){
      MailController::send(2, $event);    
      return response()->json(["success" => $res, "event" => $event], 200);
    }
    return response()->json(["success" => false, "event" => $event], 400);
  }

  public function create(Request $request){

  	$day = $request->day . " 00:00:00";
    
  	$checkDoc = Event::where("day", "=", $day)
    ->where("doc", '=', $request->doc)
    ->where("timeblock", "=", $request->timeblock)
    ->get();

    $checkPat = Event::where("day", "=", $day)
    ->where("pat", '=', $request->patient)
    ->where("timeblock", "=", $request->timeblock)
    ->get();

  	if(sizeof($checkDoc) > 0 || sizeof($checkPat) > 0) return response()->json(["alreadytaken" => true], 409);

  	$event  = Event::create([
  		"doc" => $request->doc,
  		"pat" => $request->patient,
      "observation" => $request->observation,
  		"day" => $day,
      "code" => str_random(5).str_replace("-", "", $request->day),
  		"timeblock" => $request->timeblock
  	]);
    $event->day = $request->day;
    
    if(!$event) return response()->json(["success" => false], 400);

    $timeblock = TimeTable::find($request->timeblock)->start;

    /*  
    $specialty = Doctor::find($event->doc["id"]);
    if (!$specialty) {
      return response()->json($event->doc["id"], 200);
    }
    $specialty = $specialty->specialty["name"];
    
    $event->specialty = $specialty;
    */

    $event->hour = $timeblock;

    MailController::send(1, $event);

    return response()->json($event, 200);
  }

  public function getByUser($dni){
    $u = User::where("dni", "=", $dni)->get(["id", "role"])->first();
    if(!$u) return response()->json(["not found"], 404);
    if($u->role == 2) {
      $doc = new DocController();
      return response()->json($doc->getEvents($u->id)->original, 200);
    }
    if($u->role == 3) {
      $pat = new PatientController();
      return response()->json($pat->getEvents($u->id)->original, 200);
    }
    return response()->json(["not found"], 404);
  }

  public function getBlocks($user, $day, $month, $year){
		$dow = date("N", strtotime("$day-$month-$year"));
		
  	$schedule = Schedule::where('dow', '=', $dow)
  	->where('user', '=', $user)
  	->get(["time"]);

  	$schedule = array_map(function ($value){
  		return $value["time"]["id"];
  	}, $schedule->toArray());
  	
  	return $schedule;
  }

  /** Charts methods */

  public function hotSpecialties(){
    $hotSpecialties = \DB::table('events as e')
    ->select(\DB::raw('count(*) as `data`'), 's.name as sp')
    ->join('doctors as doc', 'e.doc', 'doc.user')
    ->join('specialties as s', 's.id', 'doc.specialty')
    ->orderBy('data', 'desc')
    ->groupBy('sp')
    ->limit(5)
    ->get();
    return response()->json($hotSpecialties, 200);
  }

  public function eventsPerMonth($user=null){
    if(!isset($user)){
      $evts = Event::select(\DB::raw('count(*) as `data`'), 'status', 'day')
      ->whereIn('status', [4,5,2])
      ->where(\DB::raw("DATE_FORMAT(day, '%m-%Y')"), '=', date('m-Y'))
      ->groupby('day', 'status')
      ->get();
    }else {
      $evts = Event::select(\DB::raw('count(*) as `data`'), 'status', 'day')
      ->whereIn('status', [4,5,2])
      ->where(\DB::raw("DATE_FORMAT(day, '%m-%Y')"), '=', date('m-Y'))
      ->where('doc', '=', $user)
      ->groupby('day', 'status')
      ->get();
    }
    return response()->json($evts, 200);
  }

  public function usersOrigin(){
      $users = \DB::table('users')
                 ->select('origin', \DB::raw('count(*) as total'))
                 ->whereIn('origin', [5,2,4])
                 ->where('role', '=', 3)
                 ->groupBy('origin')
                 ->get();
    return response()->json($users, 200);    
  }

  public function eventsCount(){
    $events = \DB::table('events')
                 ->select('status', \DB::raw('count(*) as total'))
                 ->groupBy('status')
                 ->get();
    return response()->json($events, 200);
  }

  public function successAverage($user=null){
    if(!$user){
      $success = \DB::table('events')
                   ->select('status')
                   ->where('status', '=', '4')
                   ->get()->count('*');
      $all = \DB::table('events')
                   ->select('status')
                   ->where('status', '!=', '1')
                   ->where('status', '!=', '3')
                   ->where('status', '!=', '5')
                   ->get()->count('*');
    }else{
      $success = \DB::table('events')
                   ->select('status')
                   ->where('status', '=', '4')
                   ->where('doc', '=', $user)
                   ->get()->count('*');
      $all = \DB::table('events')
                   ->select('status')
                   ->where('status', '!=', '1')
                   ->where('status', '!=', '3')
                   ->where('status', '!=', '5')
                   ->where('doc', '=', $user)
                   ->get()->count('*');

    }
    if($all < 1) $average = 0;
    else $average = ($success / $all) * 100;

    return response()->json(["avg" => $average], 200);
  }

}