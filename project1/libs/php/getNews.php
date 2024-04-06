<?php
    $executionStartTime = microtime(true);

    $url = 'https://newsdata.io/api/1/news?apikey=' . 'pub_40331e3cac4871f662972b1d040fd43245acc' . '&q=' . $_REQUEST['data']['countryName'] . '&category=top&language=en';
    // $url = 'https://newsapi.org/v2/everything?q=' . $_REQUEST['data']['countryName'] . '&apiKey=' . '7997c24132174821801bec6bc397bf66'
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Gazetteer');

    $result = curl_exec($ch);

    if ($result === false) {
        $output['status']['code'] = "500";
        $output['status']['name'] = "Internal Server Error";
        $output['status']['description'] = "Failed to retrieve data from external API";
    } else {
        $decode = json_decode($result, true);
        if ($decode === null) {
            $output['status']['code'] = "500";
            $output['status']['name'] = "Internal Server Error";
            $output['status']['description'] = "Failed to decode JSON response from external API";
        } else {
            $output['status']['code'] = "200";
            $output['status']['name'] = "OK";
            $output['status']['description'] = "Success";
            $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
            $output['data'] = $decode;
        }
    }

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);