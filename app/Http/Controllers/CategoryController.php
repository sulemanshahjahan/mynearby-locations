<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function add_category(Request $request){
        $Category = new Category();
        $Category->name = $request->name;
        $Category->slug = $request->slug;

        $Category->save();
    }

    public function get_all_categories(){
        $category = Category::all();
        return response()->json([
            'categories' => $category
        ],200);
    }
}
