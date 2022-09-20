<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\LocationController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::controller(AuthController::class)->group(function(){
    Route::post('login','login');
    Route::post('register','register');
});

Route::get('/nearby',  function  (Request $request)  {
    $url =  'https://maps.googleapis.com/maps/api/geocode/json?latlng=' . $request->lat. ',' . $request->long. '&key=AIzaSyC7n8dM5sU7EeMwfITFTaM1pRb3lUD1_gM';
    $json = json_decode(file_get_contents($url), true);
    return $json;
 });

 Route::get('/get_all_locations', [LocationController::class , 'get_all_locations']);
 Route::post('/add_location', [LocationController::class, 'add_location']);
 Route::get('/get_edit_location/{id}', [LocationController::class, 'get_edit_location']);
 Route::post('/update_location/{id}', [LocationController::class, 'update_location']);
 Route::get('/delete_location/{id}', [LocationController::class, 'delete_location']);