<?php

#development 
ini_set('display_errors', true);
error_reporting(E_ALL);

#master include
include('res/serve.php');
php_includes();

$get = validate_input_get();
$page = 'index';

if(isset($get['page'])) {
    $page = $get['page'];
}

serve_page($page);