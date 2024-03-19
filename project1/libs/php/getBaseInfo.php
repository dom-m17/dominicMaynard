<?php

    $selectedISO_A2 = $_POST['selectedISO_A2'];

    $jsonFile = file_get_contents('./../../resources/countryBorders.geo.json');

    if ($jsonFile === false) {
        echo json_encode(['error' => 'Failed to read GeoJSON file']);
        exit;
    }

    $data = json_decode($jsonFile, true);

    if ($data === null) {
        echo json_encode(['error' => 'Failed to decode GeoJSON data']);
        exit;
    }

    $selectedCountry = null;
    foreach ($data['features'] as $feature) {
        if (isset($feature['properties']['iso_a2']) && $feature['properties']['iso_a2'] === $selectedISO_A2) {
            $selectedCountry = $feature;
            break;
        }
    }

    if ($selectedCountry !== null) {
        echo json_encode($selectedCountry['properties']);
    } else {
        echo json_encode(['error' => 'Country not found']);
    }
