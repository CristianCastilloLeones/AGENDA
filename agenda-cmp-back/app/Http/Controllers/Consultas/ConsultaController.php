<?php

namespace App\Http\Controllers\Consultas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Anamnesis;

class ConsultaController extends Controller
{
    public function create(Request $request){
        $result = Anamnesis::create($request->all());
        return response()->json(["message" => "creado"], 200);
    }

    public function get($id){
        //
    }
}
