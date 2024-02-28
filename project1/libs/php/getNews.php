<?php

$executionStartTime = microtime(true);

$url = 'https://newsapi.org/v2/everything?q=' . $_REQUEST['data']['countryName'] . '&from=' . $_REQUEST['data']['today'] .'8&sortBy=popularity&apiKey=' . '7997c24132174821801bec6bc397bf66';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

curl_setopt($ch, CURLOPT_USERAGENT, 'Gazetteer');

$result = curl_exec($ch);
curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);