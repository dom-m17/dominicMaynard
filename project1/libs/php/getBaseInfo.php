<?php
    $selectedISO_A2 = $_POST['selectedISO_A2'];

    $jsonFile = file_get_contents('./../../resources/countryBorders.geo.json');
    $data = json_decode($jsonFile, true);

    $selectedCountry = null;
    foreach ($data['features'] as $feature) {
        if ($feature['properties']['iso_a2'] === $selectedISO_A2) {
            $selectedCountry = $feature;
            break;
        }
    }

    if ($selectedCountry !== null) {
        echo json_encode($selectedCountry['properties']);
    } else {
        echo json_encode(['error' => 'Country not found']);
    }

