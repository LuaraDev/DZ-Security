<?php
  $ip = $_GET['ip'];
  $token = $_GET['t'];
  $resource = $_GET['r'];
  $servername = "localhost";
  $username = "root";
  $password = "";
  $dbname = "security";
  $conn = new mysqli($servername, $username, $password, $dbname);

  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

  $sql = "SELECT `ip`, `token`, `resource` FROM `tokens` Where `ip` = '$ip' AND `token` = '$token' AND `resource` = '$resource'";
  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
      echo "200";
    }
  } else {
    echo "404";
  }
  $conn->close();
?>