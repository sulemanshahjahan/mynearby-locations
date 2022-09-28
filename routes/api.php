<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\CategoryController;
use APP\Http\Middleware\ApiBrowserRestricationMiddleware;


header('Access-Control-Allow-Origin: http://localhost:8000');

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
 Route::get('/no_permission_location',  function  (Request $request)  {
    $url =  'https://www.geolocation-db.com/json/';
    $json = json_decode(file_get_contents($url), true);
    return $json;
 });

 

 Route::get('/get_all_locations', [LocationController::class , 'get_all_locations'])->middleware('ajaxx');
 Route::get('/get_close_locations/{idArray}', [LocationController::class, 'get_close_locations']);
 Route::post('/add_location', [LocationController::class, 'add_location'])->middleware('auth:api');
 Route::get('/get_single_location/{id}', [LocationController::class, 'get_single_location'])->middleware('auth:api');
 Route::get('/get_edit_location/{id}', [LocationController::class, 'get_edit_location'])->middleware('auth:api');
 Route::post('/update_location/{id}', [LocationController::class, 'update_location']);
 Route::get('/delete_location/{id}', [LocationController::class, 'delete_location']);

 Route::post('/add_category', [CategoryController::class, 'add_category']);
 Route::get('/get_all_categories', [CategoryController::class, 'get_all_categories']);
 //Route::get('/add_category', [LocationController::class, 'add_location']);
 //Route::post('/add_category', [LocationController::class, 'add_location']);