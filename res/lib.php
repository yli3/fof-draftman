<?php
function validate_input_get() {
    
    $options = array('regexp' => '/^[a-zA-Z0-9_]+$/');
    
    $filtered_get = array();
    
    foreach ($_GET as $key=>$value) {
        $filtered_get[$key] = filter_input(INPUT_GET,$key,FILTER_VALIDATE_REGEXP,
            array('options'=>$options));
    }
    
    
    return $filtered_get;
}