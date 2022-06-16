<?php

namespace App\Http\Controllers\Users;

use App\User;
use App\Models\Patient;
use App\Models\UserRole;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Users\DocController;

class PatientController extends Controller
{
    public function index(){
         $patients=User::with('role.rol', 'patients')
        ->where('role', '=', 3)
        ->get();

    	/* $patients = \DB::table('users as u')
        ->select('u.dni', 'u.name', 'u.surname', 'u.id', 'u.phone', 'u.status', 'u.email')
        ->join('patients as p', 'p.user', 'u.id')
    	->get(); */
    	return response()->json($patients, 200);
    }

    public function create(Request $request){
      $user = AuthController::createUser($request);
      if($user instanceof User){
        $patient = Patient::create([
          "user" => $user->id,
          "birthdate" => $request->birthdate,
          "fname" => $request->fname,
          "fphone" => $request->fphone
        ]);
        $roles=$request->role;

           for ($i=0; $i < count($roles); $i++) {
               UserRole::create([
          "users_id" =>  $user->id,
          "role_id" =>  $roles[$i]]);
           }

        return response()->json([
          "dni" => $user->dni,
          "name" => $user->name,
          "surname" => $user->surname,
          "id" => $user->id,
          "user" => $user->id,
          "phone" => $user->phone,
          "status" => $user->status,
          "email" => $user->email
        ], 200);
        if(!$patient) $user->delete();
      }
      return response()->json($user, 400);
    }

    public function get($id){
      $patient = Patient::find($id)->get(["user"]);
      return response()->json($patient, 200);
    }

    public function getEvents($id){
      $events = \DB::table('events as e')
      ->select('e.id', 'e.day', 'time.start', 'time.end', 'u.name', 'u.surname', 'u.name', 'u.phone', 'u.email', 'e.status')
      ->join('timetables as time', 'e.timeblock', 'time.id')
      ->join('users as u', 'e.doc', 'u.id')
      ->where('pat', '=', $id)
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
}
