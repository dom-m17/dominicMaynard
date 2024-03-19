<?php
    $base = $_REQUEST["data"];
    $app_id = '6f4cdf6ea1d34d9986cf3a541169e140';
    $oxr_url = "https://openexchangerates.org/api/latest.json?app_id=" . $app_id;

    $ch = curl_init($oxr_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $json = curl_exec($ch);

    if ($json === false) {
        $output['status']['code'] = "500";
        $output['status']['name'] = "Internal Server Error";
        $output['status']['description'] = "Failed to retrieve data from external API";
    } else {
        $decode = json_decode($json, true);

        if ($decode === null || !isset($decode["rates"][$base])) {
            $output['status']['code'] = "500";
            $output['status']['name'] = "Internal Server Error";
            $output['status']['description'] = "Failed to decode JSON response from external API or missing data";
        } else {
            $output['status']['code'] = "200";
            $output['status']['name'] = "OK";
            $output['status']['description'] = "Success";
            $output['data'] = $decode["rates"][$base];
        }
    }

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
