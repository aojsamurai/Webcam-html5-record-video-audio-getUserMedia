<?php

$blob = $_POST['thefile'];
$filename = $_POST['filename'];

$post_data = file_get_contents('php://input');

error_log('the post data is: '.$post_data);
error_log('the filename is: '.$filename);
$filePath = 'video/doesitwork.webm';
file_put_contents($filePath, $post_data);




?>
