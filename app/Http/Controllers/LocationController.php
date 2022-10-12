<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use App\Models\Locations;
use App\Models\Category;
use Image;

class LocationController extends Controller
{
    public function get_all_locations(Request $request){
        return response()->json(['locations' => Locations::where('company_id', $request->company_id)->paginate(2)], 200);
    }

    public function add_location(Request $request){
        $location = new Locations();
        $location->title = $request->title;
        $location->address = $request->address;
        $location->longlat = $request->longlat;
        $location->email = $request->email;
        $location->phone = $request->phone;
        $location->website = $request->website;
        $location->category_id = $request->category_id;
        $location->company_id = $request->company_id;

        if($request->marker_icon != ""){
            $strpos = strpos($request->marker_icon, ';');
            $sub = substr($request->marker_icon,0,$strpos);
            $ex = explode('/',$sub)[1];
            $names = time().".".$ex;
            $img = Image::make($request->marker_icon)->resize(50,50);
            $upload_path = public_path()."/upload/";
            $img->save($upload_path.$names);
            $location->marker_icon = $names;
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
        
        try {
            $location->save();
        }catch(\Illuminate\Database\QueryException $ex){ 
            abort(300,  'Could not create cl or assign it to administrator');
             // Note any method of class PDOException can be called on $ex.
           }
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
        $location->category_id = $request->category_id;


        if($location->marker_icon != $request->marker_icon){
            $strpos = strpos($request->marker_icon, ';');
            $sub = substr($request->marker_icon,0,$strpos);
            $ex = explode('/',$sub)[1];
            $marker_name = time().".".$ex;
            $img = Image::make($request->marker_icon)->resize(200,200);
            $upload_path = public_path()."/upload/";
            $image_for_marker = $upload_path. $location->marker_icon;
            $img->save($upload_path.$marker_name);
            if(file_exists($image_for_marker)){
                @unlink($image_for_marker);
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
        $image_delete = $image_path . $location->photo;
        $marker_image_delete = $image_path . $location->marker_icon;
        if(file_exists($image_delete)){
            @unlink($image_delete);
        }
        if(file_exists($marker_image_delete)){
            @unlink($marker_image_delete);
        }

        $location->delete();
    }

    public function get_single_location($id){
        $location = Locations::find($id);
        return response()->json([
            'location' => $location
        ],222);
    }

    public function get_close_locations(Request $request, $idArray){

       // $location = Locations::whereIn('id', [$id])->get();
       $array = explode('-', $idArray);
       $categories = explode(',', $request->category_type);

       if($request->category_type){
        $location = Locations::whereIn('id', $array)->whereIn('category_id', $categories)->get();
       }else{
        $location = Locations::whereIn('id', $array)->get();
       }
        
       
       
       
       
       return response()->json([
           'location' => $location
       ],222);
    }
}
