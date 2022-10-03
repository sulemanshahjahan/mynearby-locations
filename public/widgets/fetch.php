<?php 

    header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: *");

$params = file_get_contents("php://input");
parse_str($params, $paramArray);
$url = $_POST['company_id'];






 


$multiCurl = array();
// data to be returned
$result = array();

$locations = '/api/get_all_locations?api_token=3F5pqknNyeWXNFJwgf1fVT4gHc8C652EmhEU3zBTQ4kdJSg8NMsto4i6zgcm&company_id=' .$url;
$categories = '/api/get_all_categories';

$ids = [$locations , $categories];
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
