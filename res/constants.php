<?php
#Application settings
define('APP_ROOT', 'fof-draftman');
define('APP_NAME', 'draftman');
define('DIR_ROOT', $_SERVER['DOCUMENT_ROOT'].'/'.APP_ROOT.'/');
define('URL_ROOT', substr($_SERVER['PHP_SELF'], 0, - (strlen($_SERVER['SCRIPT_FILENAME']) - strlen(DIR_ROOT))));
define('HTTP_ROOT','');


#Directories
define('DIR_PAGE', HTTP_ROOT.'page/');
define('DIR_RES', HTTP_ROOT.'res/');
define('DIR_INC', HTTP_ROOT.'inc/');
define('DIR_IMG', HTTP_ROOT.'res/img/');
define('DIR_CSS', DIR_RES.'css/');
define('DIR_JS', DIR_RES.'js/');

#URLs
define('URL_HEADER_INC', DIR_INC.'header.inc.php');
define('URL_FOOTER_INC', DIR_INC.'footer.inc.php');
define('URL_PAGE_INC', DIR_INC.'page.inc.php');
define('URL_MSG_INC', DIR_INC.'msg.inc.php');
define('URL_CSS_BASE', DIR_CSS.'screen.base.css');
define('URL_PAPAPARSE_JS', DIR_JS.'papaparse.min.js');
define('URL_DRAFTMANAPP_JS', DIR_JS.'draftman.app.js');
define('URL_DRAFTMANHEAD_JS', DIR_JS.'draftman.head.js');
define('URL_DRAFTMAN_PAGE', DIR_PAGE.'draftman.page.php');
