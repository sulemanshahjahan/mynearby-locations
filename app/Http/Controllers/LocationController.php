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

        if($request->marker_icon != ""){
            $strpos = strpos($request->marker_icon, ';');
            $sub = substr($request->marker_icon,0,$strpos);
            $ex = explode('/',$sub)[1];
            $name = time().".".$ex;
            $img = Image::make($request->marker_icon)->resize(50,50);
            $upload_path = public_path()."/upload/";
            $img->save($upload_path.$name);
            $location->marker_icon = $name;
        }else{
            $location->marker_icon = "marker.png";
        }

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

        if($location->marker_icon != $request->marker_icon){
            $strpos = strpos($request->marker_icon, ';');
            $sub = substr($request->marker_icon,0,$strpos);
            $ex = explode('/',$sub)[1];
            $marker_name = time().".".$ex;
            $img = Image::make($request->marker_icon)->resize(200,200);
            $upload_path = public_path()."/upload/";
            $image = $upload_path. $location->marker_icon;
            $img->save($upload_path.$name);
            if(file_exists($image)){
                @unlink($image);
            }
        }else{
            $marker_name = $location->marker_icon;
        }

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
        $location->marker_icon = $marker_name;
        $location->save();

    }

    public function delete_location($id){
        $location = Locations::findOrFail($id);
        $image_path = public_path()."/upload/";
        $image = $image_path . $location->photo;
        $marker_image = $image_path . $location->marker_icon;
        if(file_exists($image)){
            @unlink($image);
        }
        if(file_exists($marker_image)){
            @unlink($marker_image);
        }

        $location->delete();
    }

    public function get_single_location($id){
        $location = Locations::find($id);
        return response()->json([
            'location' => $location
        ],222);
    }

    public function get_close_locations($idArray){

       // $location = Locations::whereIn('id', [$id])->get();
       $array = explode('-', $idArray);
       $location = Locations::whereIn('id', $array)->get();
       return response()->json([
           'location' => $location
       ],222);
    }
}
