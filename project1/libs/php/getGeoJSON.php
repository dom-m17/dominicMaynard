<?php

// Handle the AJAX request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the selected ISO_A2 code from the POST data
    $selectedISO_A2 = $_POST['selectedISO_A2'] ?? null;
    
    if ($selectedISO_A2 !== null) {
        // Load the GeoJSON data from the file
        $geojsonData = file_get_contents('./../../resources/countryBorders.geo.json');
        
        if ($geojsonData !== false) {
            // Parse the GeoJSON data
            $geojson = json_decode($geojsonData, true);
            
            // Find the selected country
            $selectedCountry = null;
            foreach ($geojson['features'] as $feature) {
                if (isset($feature['properties']['iso_a2']) && $feature['properties']['iso_a2'] === $selectedISO_A2) {
                    $selectedCountry = $feature;
                    break;
                }
            }
            
            if ($selectedCountry !== null) {
                // Return the selected country as JSON
                echo json_encode(['status' => 'success', 'data' => $selectedCountry]);
                exit;
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Selected country not found in GeoJSON data']);
                exit;
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error reading GeoJSON file']);
            exit;
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Selected ISO_A2 parameter is missing']);
        exit;
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Unsupported request method']);
    exit;
}