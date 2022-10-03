<?php

namespace App\Http\Controllers\Subscriptions;

use App\Models\Plans;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index() {
        $plans = Plans::get();

        return response()->json([
            'plans' => $plans
        ],200);

       
    }
}

