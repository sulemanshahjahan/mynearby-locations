<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth;
use Validator;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function register(Request $request){
        // validation
        $validator = Validator::make($request->all(),[
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'c_password' => 'required|same:password'
        ]);

        if($validator->fails()){
            $response = [
                'success' => false,
                'message' => $validator->errors()
            ];
            return response()->json($response, 400);
        }

     


        return User::create([
            'name' => $request['name'],
            'email' => $request['email'],
            'password' => Hash::make($request['password']),
            'c_password' => Hash::make($request['c_password']),
            'api_token' => Str::random(60)
        ]);


        $success['name'] = $user->name;

        $response = [
            'success' => true,
            'data' => $success,
            'message' => 'User register successfully'
        ];

        return response()->json($response,200);

    }

    public function login(Request $request){
        if(Auth::attempt(['email'=>$request->email,'password'=>$request->password])){
            $user = Auth::user();
            $success['token'] = $user->createToken('MyApp')->plainTextToken;
            $success['name'] = $user->name;
            $success['company_id'] = $user->id;
            $success['api_token'] = $user->api_token;
            $response = [
                'success' => true,
                'data' => $success,
                'message' => 'User login successfully'
            ];
            return response()->json($response,200);
        }else{
            $response = [
                'success' => false,
                'message' => 'Unauthorised'
            ];
            return response()->json($response);
        }
    }

    public function getSetupIntent( Request $request ){
        $user = Auth::user();
        try{
           return $user->createSetupIntent();
        } catch (\Exception $exception) {
            return back()->with('error', $exception->getMessage());
        }
       
    }

    public function postPaymentMethods( Request $request ){
        $user = $request->user();
        $paymentMethodID = $request->get('payment_method');
    
        if( $user->stripe_id == null ){
            $user->createAsStripeCustomer();
        }
    
        $user->addPaymentMethod( $paymentMethodID );
        $user->updateDefaultPaymentMethod( $paymentMethodID );
        
        return response()->json( null, 204 );        
    }

    public function getPaymentMethods( Request $request ){
        $user = $request->user();
    
        $methods = array();
    
        if( $user->hasPaymentMethod() ){
            foreach( $user->paymentMethods() as $method ){
                array_push( $methods, [
                    'id' => $method->id,
                    'brand' => $method->card->brand,
                    'last_four' => $method->card->last4,
                    'exp_month' => $method->card->exp_month,
                    'exp_year' => $method->card->exp_year,
                ] );
            }
        }
    
        return response()->json( $methods );
    }

    public function removePaymentMethod( Request $request ){
        $user = $request->user();
        $paymentMethodID = $request->get('id');
    
        $paymentMethods = $user->paymentMethods();
    
        foreach( $paymentMethods as $method ){
            if( $method->id == $paymentMethodID ){
                $method->delete();
                break;
            }
        }
        
        return response()->json( null, 204 );
    }


    public function cancel_subscription(Request $request){
        $user = $request->user();
        $planID = $request->get('plan');
        $user->subscription('Bronze')->cancelNow( );

        return response()->json( null, 204 );
    }

    public function updateSubscription( Request $request ){
        $user = $request->user();
        $planID = $request->get('plan');
        $paymentID = $request->get('payment');
        $stripeStatus = $request->get('status');
        if( !$user->subscribed('Bronze') ){
            $user->newSubscription( 'Bronze', $planID )
            ->trialUntil(Carbon::now()->addDays(10))
                    ->create( $paymentID );
        }else
        {
           // $user->subscription('Bronze')->swap( $planID );

           if($stripeStatus == 'canceled'){
            $user->newSubscription( 'Bronze', $planID )
            ->trialUntil(Carbon::now()->addDays(10))
                    ->create( $paymentID );
           }else{
            $user->subscription('Bronze')->swap( $planID );
           }
           


        }
        
        return response()->json($stripeStatus);
    }


    public function currentSubscription( Request $request  ){
        $user = $request->user();
        $current = $user->subscription();
        return  response()->json([$user->subscriptions()->first()]);
    }

    public function isSubscribed(Request $request){
        $user = $request->user();

        if ($user->subscriptions()->first()) {
            return response()->json([
                'subscribed' => true
            ]);
        }else{
            return response()->json('400' ); 
        }
    }
}
