<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Locations;

class LocationController extends Controller
{
    public function get_all_locations(){
        $locations = Locations::all();
        return response()->json([
            'locations' => $locations
        ],200);
    }
}
