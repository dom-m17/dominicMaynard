<?php

    $executionStartTime = microtime(true);


    $url='http://api.geonames.org/findNearestAddressJSON?lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['lng'] . '&username=' . 'dom_m17';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);

    $result=curl_exec($ch);
    curl_close($ch);

    $decode = json_decode($result,true);	


    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    $output['data']['address'] = ($decode["address"]);

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output); 


// function getNearestAddress($params) {
//     $lat = $params['lat'];
//     $lng = $params['lng'];

//     try {
//         $url = "http://api.geonames.org/findNearestAddressJSON?lat={$lat}&lng={$lng}&username=dom_m17";
//         $response = file_get_contents($url);
//         $data = json_decode($response, true);

//         return $data;
//     } catch (Exception $error) {
//         echo 'Error making API call: ' . $error->getMessage();
//     }
// }

// $params = ['lat' => 40.7128, 'lng' => -74.0060];
// $result = getNearestAddress($params);
