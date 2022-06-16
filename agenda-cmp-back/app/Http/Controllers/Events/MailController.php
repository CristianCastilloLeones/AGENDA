<?php
namespace App\Http\Controllers\Events;
 
use App\Http\Controllers\Controller;
use App\Mail\DemoEmail;
use Illuminate\Support\Facades\Mail;
use App\Mail\{EventCreated, EventCanceled, EventDeferred, AccountAct, ResetPassword};

class MailController extends Controller
{
    public static function send($type, $event)
    {

    $receivers = [
    	$event->pat["email"],
    	$event->doc["email"]
    ];


    switch ($type) {
    	case 1:
		Mail::to($receivers)
    	->send(new EventCreated($event));
    	break;
		case 2:
		Mail::to($receivers)
    	->send(new EventDeferred($event));    
		break;    	
		case 3:
	    Mail::to($receivers)
    	->send(new EventCanceled($event));
		break;
        case 4:
        Mail::to([$event->email])
        ->send(new AccountAct($event));
        break;
        case 5:
        Mail::to([$event->email])
        ->send(new ResetPassword($event));
        break;        
    	default:
		return;
		break;
    }

    }
}