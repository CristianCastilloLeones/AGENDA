<?php

namespace App\Http\Controllers\Config;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Holiday;

class HolidayController extends Controller
{

		private $months = [
			'Enero',
			'Febrero',
			'Marzo',
			'Abril',
			'Mayo',
			'Junio',
			'Julio',
			'Agosto',
			'Septiembre',
			'Octubre',
			'Noviembre',
			'Diciembre'
		];

    public function create(Request $request){
    	Holiday::truncate();
    	$insert = Holiday::insert($request->days);
    	return response()->json($insert, 200);
    }

    public function get(){
    	$holidays = \DB::table('holidays as h')->select("h.day", "h.month")->get();
    	return response()->json($holidays, 200);
    }

    public function index(){
    	$holidays = \DB::table('holidays as h')->select("h.day", "h.month")->get();
    	foreach ($holidays as $holiday) {
    		$holiday->value = ["day" => $holiday->day, "month" => $holiday->month];
    		$holiday->label = $this->months[$holiday->month]."-".$holiday->day;
    	}
    	return response()->json($holidays, 200);
    }
}
