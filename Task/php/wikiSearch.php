<?php

    $executionStartTime = microtime(true);


    $url='http://api.geonames.org/wikipediaSearchJSON?q=' . $_REQUEST['q'] . '&maxRows=1&username=' . 'dom_m17';
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

    $output['data']['geonames'] = ($decode["geonames"]);

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

// function getWikiSearch($params) {
//     $q = urlencode($params['q']);

//     try {
//         $url = "http://api.geonames.org/wikipediaSearchJSON?q={$q}&maxRows=1&username=dom_m17";
//         $response = file_get_contents($url);
//         $data = json_decode($response, true);

//         return $data;
//     } catch (Exception $error) {
//         echo 'Error making API call: ' . $error->getMessage();
//     }
// }
