<?php

    $executionStartTime = microtime(true);

    $url="http://api.openweathermap.org/data/2.5/weather?q=" . $_REQUEST["data"] . "&appid=" . "35942d8d5701a5f9be6ebbebc92bd9a2";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);

    $result=curl_exec($ch);
    curl_close($ch);

    $decode = json_decode($result,true);

    $output['data'] = ($decode);

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output); 