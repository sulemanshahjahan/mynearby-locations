<?php

namespace App\Http\Controllers\Subscriptions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index() {
        $data = [
            'intent' => auth()->user()->createSetupIntent()
        ];

        return compact($data);
    }

    public function store(Request $request) {

    }
}
