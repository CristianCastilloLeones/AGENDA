<?php

namespace App\Http\Controllers\Config;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\TimeTable;

class TimeTableController extends Controller
{
    public function index(){
    	return response()->json(TimeTable::all(), 200);
    }
}
