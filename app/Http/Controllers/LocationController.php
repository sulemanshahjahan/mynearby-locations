<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Locations;
use Image;

class LocationController extends Controller
{
    public function get_all_locations(){
        $locations = Locations::all();
        return response()->json([
            'locations' => $locations
        ],200);
    }

    public function add_location(Request $request){
        $location = new Locations();
        $location->title = $request->title;
        $location->address = $request->address;
        $location->longlat = $request->longlat;
        $location->email = $request->email;
        $location->phone = $request->phone;
        $location->website = $request->website;

        if($request->photo != ""){
            $strpos = strpos($request->photo, ';');
            $sub = substr($request->photo,0,$strpos);
            $ex = explode('/',$sub)[1];
            $name = time().".".$ex;
            $img = Image::make($request->photo)->resize(200,200);
            $upload_path = public_path()."/upload/";
            $img->save($upload_path.$name);
            $location->photo = $name;
        }else{
            $location->photo = "image.png";
        }

        
        $location->save();
    }
    
    public function get_edit_location($id){
        $location = Locations::find($id);
        return response()->json([
            'location' => $location
        ],200);
    }

    public function update_location(Request $request, $id){
        $location = Locations::find($id);

        $location->title = $request->title;
        $location->address = $request->address;
        $location->longlat = $request->longlat;
        $location->email = $request->email;
        $location->phone = $request->phone;
        $location->website = $request->website;

        if($location->photo != $request->photo){
            $strpos = strpos($request->photo, ';');
            $sub = substr($request->photo,0,$strpos);
            $ex = explode('/',$sub)[1];
            $name = time().".".$ex;
            $img = Image::make($request->photo)->resize(200,200);
            $upload_path = public_path()."/upload/";
            $image = $upload_path. $location->photo;
            $img->save($upload_path.$name);
            if(file_exists($image)){
                @unlink($image);
            }
        }else{
            $name = $location->photo;
        }

        $location->photo = $name;
        $location->save();

    }

    public function delete_location($id){
        $location = Locations::findOrFail($id);
        $image_path = public_path()."/upload/";
        $image = $image_path . $location->photo;
        if(file_exists($image)){
            @unlink($image);
        }

        $location->delete();
    }
}
