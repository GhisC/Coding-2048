<?php
require_once('database.php');
header('Content-Type: application/json');

const ERROR_LOG_FILE = "errors.log";

function connect_db($host, $username, $passwd, $port, $dbname) {
    if ((is_null($host)) OR (is_null($username)) OR (is_null($passwd)) OR (is_null($port)) OR (is_null($dbname))) {
        $paramError = "Bad params!\n";
        echo $paramError;
        file_put_contents(ERROR_LOG_FILE, $paramError, FILE_APPEND);
        return 1;
    }

    try {

        $bdd = new PDO('mysql:host='.$host.';port='.$port.';dbname='.$dbname, $username, $passwd);
        return $bdd;

    } catch(PDOException $e) {
        echo 'PDO ERROR: '. $e->getMessage() . " storage in " . ERROR_LOG_FILE . ".\n";
        file_put_contents(ERROR_LOG_FILE, $e->getMessage() . PHP_EOL, FILE_APPEND);
        $paramError = "Error connection to DB\n";
        echo $paramError;
        file_put_contents(ERROR_LOG_FILE, $paramError, FILE_APPEND);
    }
}

$bdd = connect_db(HOST, USERNAME, PASSWORD, PORT, DBNAME);

if (isset($_POST['insert'])) {
    $data = array();
    $data = json_decode($_POST['insert']);
    $player = $data[0];
    $score = $data[1];
    echo "{'status': 'ok', 'player':'" . $player ."', 'score':'". $score ."'}";

    $stmt = $bdd->query("INSERT INTO leaderboard (player, score, created_at) VALUES ('" . $player . "', '" . $score . "', NOW())");
    $data = $stmt->fetchall(PDO::FETCH_ASSOC);
}
else {
    echo "{'status': ' not ok'}";
}
?>