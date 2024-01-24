<?php

    $base = $_REQUEST["data"];

    $app_id = '6f4cdf6ea1d34d9986cf3a541169e140';
    $oxr_url = "https://openexchangerates.org/api/latest.json?app_id=" . $app_id;

    // Open CURL session:
    $ch = curl_init($oxr_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    // Get the data:
    $json = curl_exec($ch);
    curl_close($ch);

    // Decode JSON response:
    $decode = json_decode($json,true);	

    $output['data'] = ($decode["rates"][$base]);

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output); 
