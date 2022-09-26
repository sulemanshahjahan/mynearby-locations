<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('longlat')->unique();
            $table->text('address')->nullable();
            $table->string('category')->nullable();
            $table->string('website')->nullable();
            $table->string('email');
            $table->string('phone'); 
            $table->string('marker_icon')->nullable();
            $table->string('photo')->nullable();
            $table->foreignId('category_id')->constrained();
            $table->string('company_id');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('locations');
    }
};
