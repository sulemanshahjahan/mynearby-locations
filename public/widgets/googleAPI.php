<?php 

    header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: *");
$params = file_get_contents("php://input");
parse_str($params, $paramArray);


error_reporting(E_ERROR | E_PARSE);





 


$multiCurl = array();
// data to be returned
$result = array();

$ids = ['https://maps.googleapis.com/maps/api/geocode/json?latlng=24.8689338,66.9927378&key=AIzaSyC7n8dM5sU7EeMwfITFTaM1pRb3lUD1_gM'];
// multi handle
$mh = curl_multi_init();
foreach ($ids as $i => $id) {
  // URL from which data will be fetched
  $fetchURL = $id;
  $multiCurl[$i] = curl_init();
  curl_setopt($multiCurl[$i], CURLOPT_URL,$fetchURL);
  curl_setopt($multiCurl[$i], CURLOPT_HEADER,0);
  curl_setopt($multiCurl[$i], CURLOPT_RETURNTRANSFER,1);
  curl_multi_add_handle($mh, $multiCurl[$i]);
}
$index=null;
do {
  curl_multi_exec($mh,$index);
} while($index > 0);
// get content and remove handles
foreach($multiCurl as $k => $ch) {
  $result[$k] = curl_multi_getcontent($ch);
  curl_multi_remove_handle($mh, $ch);
}
// close
curl_multi_close($mh);



echo json_encode($result);
