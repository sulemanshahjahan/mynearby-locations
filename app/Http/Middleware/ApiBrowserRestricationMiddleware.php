<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiBrowserRestricationMiddleware
{
    
    // Blocked IP addresses
    public $restrictedIp = ['54.208.186.182', '54.224.34.30', '54.243.129.215', '34.201.81.34'];
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($request->ip() != '34.201.81.34') {
            return response()->json(['message' => "You are not allowed to access this site."]);
        }
        return $next($request);
    }     
}