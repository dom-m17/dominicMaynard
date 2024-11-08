<?php

    $executionStartTime = microtime(true);


    $url='http://api.geonames.org/oceanJSON?lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['lng'] . '&username=' . 'dom_m17' . '&style=full';
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

    $output['data']['ocean'] = ($decode["ocean"]);

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output); 

    // function getOcean($params) {
    //     $lat = $params['lat'];
    //     $lng = $params['lng'];
    
    //     try {
    //         $url = "http://api.geonames.org/oceanJSON?lat={$lat}&lng={$lng}&username=dom_m17";
    //         $response = file_get_contents($url);
    //         $data = json_decode($response, true);
    
    //         return $data;
    //     } catch (Exception $error) {
    //         echo 'Error making API call: ' . $error->getMessage();
    //     }
    // }
