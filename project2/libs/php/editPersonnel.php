<?php

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

    // first query

    // $query = $conn->prepare('SELECT `id` FROM `department` WHERE `name` = ?');

	// $query->bind_param("s", $_REQUEST['department']);

	// $query->execute();
	
	// if (false === $query) {

	// 	$output['status']['code'] = "400";
	// 	$output['status']['name'] = "executed";
	// 	$output['status']['description'] = "query failed";	
	// 	$output['data'] = [];

	// 	mysqli_close($conn);

	// 	echo json_encode($output); 

	// 	exit;

	// }

    // $result = $query->get_result();
    // $departmentRow = $result->fetch_assoc();
    // $departmentId = $departmentRow['departmentID'];

	// second query - SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

	// This needs to be a query to the database that will update the information of the selected employee
    $query = $conn->prepare('UPDATE personnel SET firstName = ?, lastName = ?, jobTitle = ?, email = ?, departmentID = ? WHERE id = ?');

    $query->bind_param("ssssii", $_REQUEST['firstName'], $_REQUEST['lastName'], $_REQUEST['jobTitle'], $_REQUEST['email'], $_REQUEST['department'], $_REQUEST['id']);

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
    
	$result = $query->get_result();

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $result;
	
	mysqli_close($conn);

	echo json_encode($output); 