<?php
require_once('database.php');
header('Content-Type: application/json');

const ERROR_LOG_FILE = "errors.log";

function connect_db($host, $username, $passwd, $port, $db) {
	if ((is_null($host)) OR (is_null($username)) OR (is_null($passwd)) OR (is_null($port)) OR (is_null($db))) {
		$paramError = "Bad params! Usage: php connect_db.php host username password port db\n";
		echo $paramError;
		file_put_contents(ERROR_LOG_FILE, $paramError, FILE_APPEND);
		return 1;
	}
	else {

		try {

			$bdd = new PDO('mysql:host='.$host.';port='.$port.';dbname='.$db, $username, $passwd);
			//echo "Connection to DB successful\n";
			return $bdd;

		} catch(PDOException $e) {
			echo 'PDO ERROR: '. $e->getMessage() . " storage in " . ERROR_LOG_FILE . ".\n";
			file_put_contents(ERROR_LOG_FILE, $e->getMessage() . PHP_EOL, FILE_APPEND);
			$paramError = "Error connection to DB\n";
			echo $paramError;
			file_put_contents(ERROR_LOG_FILE, $paramError, FILE_APPEND);
		}
	}
}

$bdd = connect_db(HOST, USERNAME, PASSWORD, PORT, DBNAME);
$stmt = $bdd->query("SELECT player, score, created_at FROM leaderboard ORDER BY score ASC LIMIT 10");
$data = $stmt->fetchall();

// if ($data != false) {
echo json_encode($data);
// }

?>