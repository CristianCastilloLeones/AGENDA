<?php

namespace App\Http\Controllers\Consultas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\FacturaQ;
use App\Models\Cie;

class CieController extends Controller
{
  public function filter($word){
    $results = Cie::where('descripcion', 'LIKE', "%$word%")
    ->orWhere('cod_cie', 'LIKE', "%$word%")
    ->get(['id', 'cod_cie', 'descripcion']);
    return response()->json($results, 200);
  }

  public function getInventary(){
  	$fq = new FacturaQ();
  	$products = $fq->getInventary();
  	if($products){
  		return response()->json($products, 200);
  	}
  	return response()->json(["asdasd"], 200);
  }
}
