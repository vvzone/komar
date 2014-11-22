<?php

$mysqli = new mysqli("localhost", "root", "");

//echo $mysqli->client_info;
echo "<br />";
//echo $mysqli;
//echo $mysqli::stat;
echo $mysqli->character_set_name();
?>
<h1>TEST</h1>

<?php

/*

init_connect='SET collation_connection = utf8_general_ci'
init_connect='SET NAMES utf8'
default-character-set=utf8
character-set-server=utf8
collation-server=utf8_general_ci
skip-character-set-client-handshake


init_connect='SET collation_connection = utf8_general_ci'
init_connect='SET NAMES utf8'

default-character-set=utf8
character-set-server=utf8
*/

// phpinfo();

?>