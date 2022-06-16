<?php

namespace App\Http\Controllers\Users;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Events\MailController;
use App\Models\Code;
use App\User;

class CodeController extends Controller
{
    public function create($user){
    	$code = Code::create([
    		"user" => $user,
    		"code" => str_random(6)
    	]);
    	return $code;
    }

    public function update(Request $request){
        $user = User::where("email", "=", $request->mail)
        ->get()->first();
    	$code = Code::where("user", "=", $user->id)
    	->get()->first();
    	$code->code = str_random(5);
    	$code->save();
        $user->code = $code->code;
    	MailController::send(4, $user);
        return response()->json(["resended" => true], 200);
    }

    public function verify(Request $request){
    	$xcode = $request->code;
        $xmail = $request->mail;
        $user = User::where("email", "=", $xmail)->get()->first();
        $code = Code::where("user", "=", $user->id)
        ->where("code", "=", $xcode)
        ->get()->first();
        if(!$code) return response()->json(["status" => false], 400);
        $code->verified = 1;
        $res = $code->save();
        return response()->json(["status" => $res], 200);
    }
}
