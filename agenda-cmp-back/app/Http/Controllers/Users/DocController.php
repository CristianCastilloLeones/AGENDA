<?php

namespace App\Http\Controllers\Users;

use App\User;
use App\Models\Doctor;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Controllers\AuthController;

class DocController extends Controller
{

    public function index(){


        $docs=\DB::table('users as u')
        ->join('user_role as r', 'u.id', '=', 'r.users_id')
        ->join('doctors as d', 'd.user', 'u.id')
        ->join('specialties as s', 'd.specialty', 's.id')
          ->select('u.dni', 's.name as specialty', 'u.name', 'u.surname', 'u.id', 'u.phone', 'u.status', 'u.email','u.branch_office_id','u.user_fq',
           'r.*','d.*')
        ->where('r.role_id', '=', 2)
        ->get();

      foreach ($docs as $doc) {
        $doc->label = "$doc->name $doc->surname - $doc->specialty";
      }
    	return response()->json($docs, 200);
    }

    public function create(Request $request){
      $user = AuthController::createUser($request);
      if($user instanceof User){
        $doctor = Doctor::create([
          "user" => $user->id,
          "specialty" => $request->specialty["id"]
        ]);
        if(!$doctor)$user->delete();
        $roles=$request->role;

           for ($i=0; $i < count($roles); $i++) {
               UserRole::create([
          "users_id" =>  $user->id,
          "role_id" =>  $roles[$i]]);
           }

        return response()->json($doctor, 200);
      }
        return response()->json($user, 400);
    }

    public function get($id){
        $docs = \DB::table('users as u')
        ->join('doctors as d', 'd.user', 'u.id')
        ->where('d.id', '=', $id)
        ->get();
        return response()->json($docs, 200);
    }

    public function getBySpecialty($specialty){
        $docs = \DB::table('users as u')
        ->join('doctors as d', 'd.user', 'u.id')
    	->where('d.specialty', '=', $specialty)
    	->get();
    	return response()->json($docs, 200);
    }

    public function getEvents($id){
    	$events = \DB::table('events as e')
    	->select('e.id', 'e.day', 'time.start', 'time.end', 'u.name', 'u.surname', 'u.name', 'u.phone', 'u.email', 'e.status')
    	->join('timetables as time', 'e.timeblock', 'time.id')
      ->join('users as u', 'e.pat', 'u.id')
    	->where('doc', '=', $id)
    	->get(["start", "end", "day"]);

      foreach ($events as $event) {
        $event->start = $event->day."T".$event->start;
        $event->end   = $event->day."T".$event->end;
        $event->color = self::bgEvent($event->status)[0];
        $event->textColor = self::bgEvent($event->status)[1];
        $event->title = "$event->phone | $event->name $event->surname";
      }

    	return response()->json($events, 200);
    }

    static function bgEvent($status){
      switch ($status) {
        case 1: return ["#3f51b5", "#f2f2f2"]; break;
        case 2: return ["#A10050", "#f2f2f2"]; break;
        case 3: return ["#D6C71C", "#000000"]; break;
        case 4: return ["#5FA910", "#f2f2f2"]; break;
        case 5: return ["#FF0000", "#f2f2f2"]; break;
        default:
          return ["#3f51b5", "#f2f2f2"];
          break;
      }
    }
}
