<?php

namespace App\Providers;
use App\Models\User;
use Illuminate\Support\ServiceProvider;
use Laravel\Cashier\Cashier;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
         if(config('app.env') === 'production') {
            \URL::forceScheme('https');
        }
        Cashier::useCustomerModel(User::class);
    }
}
