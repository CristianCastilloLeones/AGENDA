<?php

namespace App\Http\Controllers\Events;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use PhpOffice\PhpSpreadsheet\Writer\Xls;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class XlsController extends Controller
{

    public function usersReport($role){
    	$spreadsheet = new Spreadsheet();
    	$spreadsheet->getProperties()->setCreator('Clinica el Batan')
	    ->setLastModifiedBy('Clinica el Batan')
	    ->setTitle('Clinica el Batan - Reporte de pacientes')
	    ->setSubject('Reporte de pacientes')
	    ->setDescription('Reporte de usuarios (pacientes) Clinica el Batan')
	    ->setKeywords('pacientes reporte clinica batan excel')
	    ->setCategory('Reporte');

			$spreadsheet->setActiveSheetIndex(0);
			$spreadsheet->getActiveSheet()
	    ->setCellValue('A1', 'Cedula')
	    ->setCellValue('B1', 'Nombre')
	    ->setCellValue('C1', 'Apellido')
	    ->setCellValue('D1', 'Telefono')
	    ->setCellValue('E1', 'Email');

	    $users = \DB::table("users as u")
	    ->select('u.name', 'u.surname', 'u.dni', 'u.phone', 'u.email')
	    ->where('role', '=', $role)
	    ->get();

	    foreach ($users as $key => $user) {
	    	$idx = $key+2;
	    	$spreadsheet->getActiveSheet()
		    ->setCellValue("A$idx", $user->dni)
		    ->setCellValue("B$idx", $user->name)
		    ->setCellValue("C$idx", $user->surname)
		    ->setCellValue("D$idx", $user->phone)
		    ->setCellValue("E$idx", $user->email);	    	
	    }
			$spreadsheet->getActiveSheet()->getStyle('A1:E1')
			->getFont()->setSize(15);
			$spreadsheet->getActiveSheet()->getStyle('A1:E1')
			->getFont()->setBold(true);

			ob_clean();
			header('Content-Type: application/vnd.ms-excel');
			header('Cache-Control: max-age=0');
			$writer = new Xls($spreadsheet);
			$path = storage_path().DIRECTORY_SEPARATOR.time().'.xls';
			$writer->save($path);
			return response()->download($path, time().'xls')->deleteFileAfterSend(true);
    }

    public function eventsReport($user=null){
    	$spreadsheet = new Spreadsheet();
    	$spreadsheet->getProperties()->setCreator('Clinica el Batan')
	    ->setLastModifiedBy('Clinica el Batan')
	    ->setTitle('Clinica el Batan - Reporte de citas')
	    ->setSubject('Reporte de citas')
	    ->setDescription('Reporte de citas Clinica el Batan')
	    ->setKeywords('citas reporte clinica batan excel')
	    ->setCategory('Reporte');

			$spreadsheet->setActiveSheetIndex(0);
			$spreadsheet->getActiveSheet()
	    ->setCellValue('A1', 'Id')
	    ->setCellValue('B1', 'Especialidad')
	    ->setCellValue('C1', 'Hora')
	    ->setCellValue('D1', 'Medico')
	    ->setCellValue('E1', 'Paciente')
	    ->setCellValue('F1', 'Estatus')
	    ->setCellValue('G1', 'Observación');

	    if(!isset($user)){
		    $events = \DB::table("events as e")
		    ->select('e.id', 't.start as timeblock', 'd.name as dname', 'd.surname as dsurname', 'p.name as pname', 'p.surname as psurname', 'e.status', 'e.observation', 's.name as specialty')
		    ->join('timetables as t', 'e.timeblock', 't.id')
		    ->join('users as d', 'e.doc', 'd.id')
		    ->join('users as p', 'e.pat', 'p.id')
		    ->join('doctors as doc', 'e.doc', 'doc.user')
		    ->join('specialties as s', 'doc.specialty', 's.id')
	 	    ->get();
 	    }else{
 	    	$events = \DB::table("events as e")
		    ->select('e.id', 't.start as timeblock', 'd.name as dname', 'd.surname as dsurname', 'p.name as pname', 'p.surname as psurname', 'e.status', 'e.observation', 's.name as specialty')
		    ->join('timetables as t', 'e.timeblock', 't.id')
		    ->join('users as d', 'e.doc', 'd.id')
		    ->join('users as p', 'e.pat', 'p.id')
		    ->join('doctors as doc', 'e.doc', 'doc.user')
		    ->join('specialties as s', 'doc.specialty', 's.id')
	 	    ->where('e.doc', '=', $user)
	 	    ->get();
 	    }

	    foreach ($events as $key => $event) {
	    	$idx = $key+2;
	    	$spreadsheet->getActiveSheet()
		    ->setCellValue("A$idx", $event->id)
		    ->setCellValue("B$idx", $event->specialty)
		    ->setCellValue("C$idx", $event->timeblock)
		    ->setCellValue("D$idx", ($event->dname . " " . $event->dsurname))
		    ->setCellValue("E$idx", ($event->pname . " " . $event->psurname))
		    ->setCellValue("F$idx", self::getStatus($event->status))
		    ->setCellValue("G$idx", $event->observation);	    	
	    }
			$spreadsheet->getActiveSheet()->getStyle('A1:G1')
			->getFont()->setSize(15);
			$spreadsheet->getActiveSheet()->getStyle('A1:G1')
			->getFont()->setBold(true);
			ob_clean();
			header('Content-Type: application/vnd.ms-excel');
			header('Cache-Control: max-age=0');
			$writer = new Xls($spreadsheet);
			$path = storage_path().DIRECTORY_SEPARATOR.time().'.xls';
			$writer->save($path);
			return response()->download($path, time().'xls')->deleteFileAfterSend(true);
    }    

    static function getStatus($status){
    	switch ($status) {
    		case 1:return "agendada";break;
    		case 2:return "cancelada";break;
    		case 3:return "reagendada";break;
    		case 4:return "realizada";break;
    		case 5:return "paciente no asistio";break;
   		default:
    			return "desconocido";
    			break;
    	}
    }

}