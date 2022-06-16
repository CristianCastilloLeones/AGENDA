<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Code;
use App\User;
use Illuminate\Support\Facades\Auth;

class CheckEmailVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = User::where("email", "=" , $request->email)
        ->get()->first();
        if($user->origin == 5 && $user->role == 3){
            $code = Code::where("user", '=', $user->id)->get()->first();
            if($code->verified == 0){
                return response()->json(["msg" => "not_verified"], 401);
            }else{
                return $next($request);    
            }
        }
        return $next($request);
    }
}
