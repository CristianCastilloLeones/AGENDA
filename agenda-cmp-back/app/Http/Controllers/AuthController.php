<?php

namespace App\Http\Controllers;

use App\User;
use App\Models\UserRole;
use Lcobucci\JWT\Parser;
use Illuminate\Http\Request;
use App\Http\Controllers\Users\CodeController;
use App\Http\Controllers\Events\MailController;

class AuthController extends Controller
{
    public function login(){
      if(\Auth::attempt(['email' => request('email'), 'password' => request('password')])){
          $user = \Auth::user();
          if ($user->isActive()) {
              $user->token =  $user->createToken('SISCOR')->accessToken;

              return response()->json([
                  "usuario" => $user,
                  //"permissions" => $user->getPermissions(),
              ], 200);
          }else{
              return response()->json(['error' => 'Usuario inactivo'], 401);
          }
      }else{
          return response()->json(['error'=>'No encontrado'], 404);
      }
    }

    public function register(Request $request){
      $newUser = self::createUser($request);
      $newUser->token = $newUser->createToken('AM')->accessToken;
      return response()->json(["user" => $newUser], 200);
    }

    public static function createUser(Request $request)
    {

	      $validator = \Validator::make($request->all(), [
	        'name' => 'required',
          'surname' => 'required',
          'dni' => 'required|unique:users',
          'phone' => 'required',
	        'email' =>    'required|unique:users',
	        'password' => 'required',
	        'c_password' => 'required|same:password',
          'role' => 'required',
          'branch_office' => 'required',
	      ], [
          'name.required' => "El campo nombre es requerido.",
          'surname.required' => "El campo apellido es requerido.",
          'dni.unique'     => "Ya existe un registro con esta cedula.",
          'dni.required'     => "El campo cedula es requerido.",
          'phone.required'   => "El campo telefono es requerido.",
          'email.required'   => "El campo email es requerido",
          'branch_office.required' => "El campo sucursal es obligatorio",
          'email.unique'   => "Este email ya esta siendo usado.",
          'password.required'=> "Debe indicar una contraseña",
          'c_password.same' => "Las contraseñas deben coincidir",

        ]);

	  		if ($validator->fails()) {
	  		    return response()->json(['error'=>$validator->errors()], 400);
	  		}

        $user  = User::create([
          "name" =>  $request->name,
          "dni" => $request->dni,
          "surname" => $request->surname,
          "phone" => $request->phone,
          "email"    =>  $request->email,
          "password" =>  bcrypt($request->password),
          "role" => $request->role[0],
          "origin" => $request->origin ?: -1,
          "branch_office_id" => $request->branch_office,
          "user_fq" => $request->userFact ?: 0

        ]);

        if($request->role == 3 && $user instanceof User && $request->origin == 5){
          $cc = new CodeController;
          $code = $cc->create($user->id)->code;
          $user->code = $code;
          MailController::send(4, $user);
        }

		    return $user;
    }

    public function resetPassword(Request $request){
      $user = User::where('email', '=', $request->email)->get()->first();
      if(!isset($user)){
        return response()->json(["message" => "not_found"], 404);
      }
      $new_pass = strtolower(str_random(6));
      $user->password = bcrypt($new_pass);
      $res = $user->save();

      $user->code = $new_pass;

      if($res)
        MailController::send(5, $user);
      return response()->json([], 200);

    }

    public function logout(Request $request){
      $value = $request->bearerToken();
      $id = (new Parser())->parse($value)->getHeader('jti');
      $token = \Auth::user()->tokens->find($id);
      $token->delete();
      return response()->json([
          "logout" => true
      ], 200);
    }
}
