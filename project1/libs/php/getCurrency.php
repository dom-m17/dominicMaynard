<?php

if (!isset($_REQUEST["data"])) {
    $output['error'] = 'Data parameter is missing';
    echo json_encode($output);
    exit;
}

$base = $_REQUEST["data"];

$app_id = '6f4cdf6ea1d34d9986cf3a541169e140';

$oxr_url = "https://openexchangerates.org/api/currencies.json";

$ch = curl_init($oxr_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$json = curl_exec($ch);

if ($json === false) {
    $output['error'] = 'cURL request failed: ' . curl_error($ch);
    echo json_encode($output);
    exit;
}

curl_close($ch);

$decode = json_decode($json, true);

if ($decode === null) {
    $output['error'] = 'Failed to decode JSON response';
    echo json_encode($output);
    exit;
}

if (!isset($decode[$base])) {
    $output['error'] = 'Base currency not found';
    echo json_encode($output);
    exit;
}

$output['data'] = $decode[$base];
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
