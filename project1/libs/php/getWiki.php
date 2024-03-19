<?php
    $executionStartTime = microtime(true);

    $url = 'http://api.geonames.org/wikipediaBoundingBoxJSON?north=' . $_REQUEST['data']['north'] . '&south=' . $_REQUEST['data']['south'] . '&east=' . $_REQUEST['data']['east'] . '&west=' . $_REQUEST['data']['west'] . '&username=' . 'dom_m17';    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

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
            $output['status']['description'] = "Unexpected response format from external API";
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