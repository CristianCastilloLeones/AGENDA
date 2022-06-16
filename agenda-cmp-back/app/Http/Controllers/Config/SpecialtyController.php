<?php

namespace App\Http\Controllers\Config;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\{Specialty, Doctor};

class SpecialtyController extends Controller
{
  public function index(){
  	$specialty = Specialty::all();
  	return response()->json($specialty, 200);
  }

  public function getActiveSpecialties() {
	  $specialties = 
		  \DB::table('specialties as sp')
		  ->join('doctors as doc', 'sp.id', '=', 'doc.specialty')
		  ->select('sp.id', 'sp.name')
		  ->groupBy('sp.id', 'sp.name') 
		  ->get();
	  
		foreach ($specialties as $sp) {
			
		}

	   return response()->json($specialties, 200);
  }

  public function create(Request $request){
  	$sp = Specialty::create([
  		"name" => $request->name
  	]);
  	return response()->json($sp, 200);
  }

  public function delete($id){
	  $sp = Specialty::find($id);
	  $hasDoctors = Doctor::where('specialty', '=', $id)->count();
	  if($hasDoctors > 0) {
		  return response()->json(false, 200);
	  } 
	  $result = $sp->delete();
	  return response()->json($result, 200);
	}

  public function update(Request $request){
  	$sp = Specialty::find($request->id);
  	$sp->name = $request->name;
  	$res = $sp->save();
  	return response()->json([$res], 200);
  }

}
