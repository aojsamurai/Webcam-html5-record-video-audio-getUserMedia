<?php
error_log('audio save called');
$blob = $_POST['thefile'];
$filename = $_POST['filename'];

$post_data = file_get_contents('php://input');

$filePath = 'video/doesitwork.wav';
file_put_contents($filePath, $post_data);




?>
