<?php

function php_includes() {
    require('res/constants.php');
    require('res/lib.php');
    //require('inc/config.php');
}

function get_page_specific($page) {
    // Set defaults.
    $title = 'draftman';
    $res_css = "
        <link rel='stylesheet' href='".URL_CSS_BASE."'>
    ";
    $res_js_head = "
        <script src='".URL_PAPAPARSE_JS."'></script>
        <script src='".URL_DRAFTMANHEAD_JS."'></script>
        <script src='res/js/jquery-2.1.1.min.js'></script>
        <!--<script src='//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js'></script>-->
    ";
    $res_js_body = "
        <script src='".URL_DRAFTMANAPP_JS."'></script>
        
    ";
    
    
    $content = null;
    


    $return = array(
        'title' => $title,
        'res_css' => $res_css,
        'res_js_head' => $res_js_head,
        'res_js_body' => $res_js_body,
        'content' => $content,
    );
    
    return $return;
    
}

function serve_page($page) {

    
    $page_specific = get_page_specific($page);
    $title = $page_specific['title'];
    $res_css = $page_specific['res_css'];
    $res_js_head = $page_specific['res_js_head'];
    $res_js_body = $page_specific['res_js_body'];
    $content = $page_specific['content'];
    
    switch($page) {
        case 'list':
            $content = DIR_PAGE.'list.page.php';
            break;
        case 'index':
        default: 
            $content = DIR_PAGE.'index.page.php';
    
    }
    
    #output
    echo "<!doctype html>
    <html>
    <head>
        <meta charset='utf-8'>
        <title>$title</title>
        $res_css
    </head>
    
    <body id='$page'>";
        
    
        #common
        include(URL_HEADER_INC);
        
        #content
        include(URL_PAGE_INC);        
        
        #js
        echo $res_js_head;
        echo $res_js_body;

        if(isset($content)) {
            include($content); //MORE LIKE JAVASCRIPT CONTENT
        }
        
        #footer
        include(URL_FOOTER_INC);
        
        
        
    
    echo '
    </body>
    </html>';
    
}