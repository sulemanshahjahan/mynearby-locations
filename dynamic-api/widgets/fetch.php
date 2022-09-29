<?php 

    header('Content-Type: application/json');

$params = file_get_contents("php://input");
parse_str($params, $paramArray);
if($params){
    $urls = $paramArray['check'];
}

error_reporting(E_ERROR | E_PARSE);





 

$url = 'http://localhost:8000/api/get_all_locations?api_token=DrBpXs0VkSPKD6tQCEyMtMGMOwomdYfXgxpWWQlovkAaJuZWaNNpgSpuoG7C&company_id=1';

$headers = array(
    "Accept: application/json",
     'Content-Type: application/json'
 );
 
 $ch = curl_init();
 $options = array(
     CURLOPT_URL => $url, 
     CURLOPT_HTTPHEADER => $headers , 
     CURLOPT_RETURNTRANSFER => 1 
 );
 
 curl_setopt_array($ch, $options);
 
 $result = curl_exec($ch);
 
 $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
                               
 curl_close($ch);

 echo $result; 
