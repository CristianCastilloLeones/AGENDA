<?php 

namespace App\Services;

use GuzzleHttp\Client;
use Cookie;

class FacturaQ{

    public $creds;
    protected $http;
    const AUTH_ROUTE = '/authenticate';
    const CLIENTS_ROUTE = '/clientCompany/';
    const INVENTARY_ROUTE = '/inventary/getProduct/';
    const CREATE_CLIENT_ROUTE = '/client';

    public function __construct(){
        $this->http = new Client();
        $API = env('FACTURAQ_API');
        $faq_user = env('FACTURAQ_USER');
        $faq_pass = env('FACTURAQ_PASSWORD');
    
        $response = $this->http->post($API . self::AUTH_ROUTE, [
          'headers' => [
            ['Content-Type' => 'application/json']
          ],
          'json' => [
            'email' => $faq_user,
            'password' => $faq_pass
          ]
        ]);
    
        if($response->getStatusCode() != 200){
          return response()->json([
            "message" => "Ha ocurrido un error en el proceso de facturacion."
          ], 500);
        };
    
        $this->creds = json_decode($response->getBody()->getContents());
    }

    public function getClients(){
        $API = env('FACTURAQ_API');
        $clients = $this->http->get($API . self::CLIENTS_ROUTE . $this->creds->company, [
            'headers' => [
                ['Access-Control-Allow-Origin' => true,
                'Content-Type' => 'application/json']
            ]
        ]);
        
        return json_decode($clients->getBody()->getContents());
    }

    public function getInventary(){
        $API = env('FACTURAQ_API');
        $products = $this->http->get($API . self::INVENTARY_ROUTE . $this->creds->company .'/'.$this->creds->branch_office, [
            'headers' => [
                ['Access-Control-Allow-Origin' => true,
                'Content-Type' => 'application/json']
            ]
        ]);
    
        if($products->getStatusCode() != 200){
          return [
            "message" => "Ha ocurrido un error en el proceso de facturacion."
          ];
        };        

        return json_decode($products->getBody()->getContents());
    }

}