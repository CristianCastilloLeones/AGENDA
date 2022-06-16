<?php

namespace App\Http\Controllers\Users;

use App\User;
use App\Models\Role;
use App\Models\UserRole;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\AuthController;

class UserController extends Controller
{
    public function index(){
    	$u = User::where('role', '!=', '1')->get([
    		"id",
    		"name",
    		"surname",
    		"phone",
    		"email",
    		"dni",
            "status",
            "branch_office_id"
    	]);
    	return response()->json($u, 200);
    }

    public function disable(Request $request){
        $u = User::find($request->id);
        $u->status = !$u->status;
        $res = $u->save();
        return response()->json(["success" => $res], 200);
    }

    public function getAssistants(){
        $users=\DB::table('users as u')
        ->join('user_role as r', 'u.id', '=', 'r.users_id')
          ->select('u.*', 'r.*')
        ->where('r.role_id', '=', 4)
        ->get();

      return response()->json($users, 200);
    }

    public function create(Request $request){

      $user = AuthController::createUser($request);


      if($user instanceof User){
          //$roles=explode(",",$request->role);
          $roles=$request->role;

           for ($i=0; $i < count($roles); $i++) {
              UserRole::create([
          "users_id" =>  $user->id,
          "role_id" =>  $roles[$i]]);

          }
           /* foreach ($roles as $rol) {
              $rol = json_decode($rol);
              UserRole::create([
          "users_id" =>  $user->id,
          "role_id" =>  $rol->id]);
          } */

        return response()->json($user, 200);

      }

      return response()->json($user, 400);
    }

    public function update(Request $request){
      $u = User::find($request->id);
      $u->name = $request->name;
      $u->surname = $request->surname;
      $u->phone = $request->phone;
      $u->email = $request->email;
      $u->dni = $request->dni;
      $u->branch_office_id = $request->branch_office;
      $u->user_fq = $request->userFact ?: 0;

      if(strlen($request->password) > 3){
        $u->password = bcrypt($request->password);
      }

      $res = $u->save();

      $roles =  $request->role; //request
        $notDeleteRole =array();
        for ($i=0; $i < count($roles); $i++) { //recorre los roles del formulario

            $notDeleteRole[] =  $roles[$i];
            $arr = [
                    ['users_id', $request->id],
                    ['role_id', $roles[$i]]
                ];
            $userRole = UserRole::where($arr)->get(); //select * from user_role where users_id=$id and role_id=$rol->id
            if (count($userRole)==0) { //si no retorna nada es decir no existe ese rol LO CREA
                UserRole::create([
                    'users_id' => $request->id,
                        'role_id'  => $roles[$i]
                ]);
            }

        }
        UserRole::where('users_id', $request->id)->whereNotIn('role_id', $notDeleteRole)->delete(); //elimina todos excepto los que envia por formulario

      return response()->json(["success" => $res], 200);
    }
    /**
     * ? 11 septiembre
     */
    public function getAdmEmpresa(){
         /* $users=User::with('role.rol')
         ->join('user_role', 'users.id', '=', 'user_role.users_id')
        ->where('user_role.role_id', '=', 8)
        ->get(); */
         $users=\DB::table('users as u')
        ->join('user_role as r', 'u.id', '=', 'r.users_id')
          ->select('u.*', 'r.*')
        ->where('r.role_id', '=', 8)
        ->get();
      return response()->json($users, 200);
    }
    public function getRoles(){
      $arr = [
            ['status', 1],
            ['id', "NOT LIKE", 1]
        ];
            $roles = Role::where($arr)->get();

      return response()->json($roles, 200);
    }
    /**
     * 14 sept
     */
    public function getAdmSucursal(){
        $users=\DB::table('users as u')
        ->join('user_role as r', 'u.id', '=', 'r.users_id')
		  ->select('u.*', 'r.*')
        ->where('r.role_id', '=', 9)
        ->get();
      return response()->json($users, 200);
    }
    public function getEnfermero(){

$users=\DB::table('users as u')
        ->join('user_role as r', 'u.id', '=', 'r.users_id')
          ->select('u.*', 'r.*')
        ->where('r.role_id', '=', 5)
        ->get();

      return response()->json($users, 200);
    }
    public function getEcografista(){

$users=\DB::table('users as u')
        ->join('user_role as r', 'u.id', '=', 'r.users_id')
          ->select('u.*', 'r.*')
        ->where('r.role_id', '=', 6)
        ->get();

      return response()->json($users, 200);
    }
    public function getLaboratorista(){

$users=\DB::table('users as u')
        ->join('user_role as r', 'u.id', '=', 'r.users_id')
          ->select('u.*', 'r.*')
        ->where('r.role_id', '=', 7)
        ->get();

      return response()->json($users, 200);
    }
    public function getGestorExamenes(){

$users=\DB::table('users as u')
        ->join('user_role as r', 'u.id', '=', 'r.users_id')
          ->select('u.*', 'r.*')
        ->where('r.role_id', '=', 10)
        ->get();

      return response()->json($users, 200);
    }
}
