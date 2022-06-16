<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', 'AuthController@login')->middleware('emailverified');
Route::post('verify', 'Users\CodeController@verify');
Route::post('resend_verification', 'Users\CodeController@update');
Route::post('register', 'AuthController@register');
Route::post('passreset', 'AuthController@resetPassword');
Route::post('patient', 'Users\PatientController@create');

Route::group(['middleware' => 'auth:api'], function(){

	Route::post('logout', 'AuthController@logout');

	Route::get('timetables', 'Config\TimeTableController@index');

	Route::get('specialties', 'Config\SpecialtyController@index');
	Route::post('specialty', 'Config\SpecialtyController@create');
	Route::patch('specialty', 'Config\SpecialtyController@update');
	Route::delete('specialty/{id}', 'Config\SpecialtyController@delete');
	Route::get('specialties-availables', 'Config\SpecialtyController@getActiveSpecialties');

	Route::get('schedule/{id}', 'Config\ScheduleController@getWeekly');
	Route::get('schedule/{id}/{dow}', 'Config\ScheduleController@get');
	Route::post('schedule', 'Config\ScheduleController@add');
	Route::delete('schedule/{id}', 'Config\ScheduleController@remove');

	Route::post('holiday', 'Config\HolidayController@create');
	Route::get('holiday', 'Config\HolidayController@index');
	Route::get('holidays', 'Config\HolidayController@get');

	Route::get('event/{doc}/{day}/{month}/{year}', 'Events\EventController@getByDate');
	Route::get('event/{id}', 'Events\EventController@get');
	Route::patch('event/reagendar/{id}', 'Events\EventController@reagendar');
	Route::get('events/{dni}', 'Events\EventController@getByUser');
	Route::get('events', 'Events\EventController@getAllToday');
	Route::post('event', 'Events\EventController@create');
	Route::patch('event/cancel/{id}', 'Events\EventController@cancel');
	Route::patch('event/finalize/{id}', 'Events\EventController@finalize');

	Route::get('charts/evtspermonth/{user?}', 'Events\EventController@eventsPerMonth');
	Route::get('charts/successPercentage/{user?}', 'Events\EventController@successAverage');
	Route::get('charts/usersOrigin', 'Events\EventController@usersOrigin');
	Route::get('charts/eventsCount', 'Events\EventController@eventsCount');
	Route::get('charts/hotSpecialties', 'Events\EventController@hotSpecialties');

	Route::get('users', 'Users\UserController@index');
	Route::patch('user', 'Users\UserController@update');
	Route::patch('user/toggle-status', 'Users\UserController@disable');

	Route::post('assistant', 'Users\UserController@create');
	Route::get('assistant', 'Users\UserController@getAssistants');

	Route::get('patient/{id}/events', 'Users\PatientController@getEvents');
	Route::get('patients', 'Users\PatientController@index');
	Route::get('patient/{id}', 'Users\PatientController@get');

	Route::get('doc/{id}/events', 'Users\DocController@getEvents');
	Route::post('doc/', 'Users\DocController@create');
	Route::get('docs/', 'Users\DocController@index');
	Route::get('doc/{id}', 'Users\DocController@get');
	Route::get('docs/{specialty}', 'Users\DocController@getBySpecialty');

	Route::get('xls/users/{role}', 'Events\XlsController@usersReport');
	Route::get('xls/events/{user?}', 'Events\XlsController@eventsReport');

	Route::post('consulta', 'Consultas\ConsultaController@create');
	Route::get('cie/inventary', 'Consultas\CieController@getInventary');
	Route::get('cie/{word}', 'Consultas\CieController@filter');
	/**
     * ? nuevos roles
     */
	Route::post('admEmpresa/', 'Users\UserController@create');
    Route::get('admEmpresa/', 'Users\UserController@getAdmEmpresa');
    Route::get('roles/', 'Users\UserController@getRoles');

    /**
     * ? 14 sept
     */
    Route::get('companyBranches/', 'Branch\BranchController@index');
    Route::post('admSucursal/', 'Users\UserController@create');
    Route::get('admSucursal/', 'Users\UserController@getAdmSucursal');

    Route::get('enfermero/', 'Users\UserController@getEnfermero');
    Route::get('ecografista/', 'Users\UserController@getEcografista');
    Route::get('laboratorista/', 'Users\UserController@getLaboratorista');
    Route::get('gestorExamenes/', 'Users\UserController@getGestorExamenes');






});

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
