<?php

/**
9K ROUTING
---------
# COPYRIGHT
(c) 2013, OKFN Belgium. Some rights reserved.

# AUTHOR
Nico Verbruggen (nico.verb@gmail.com)
*/

/******************************************************************************/
// URLS AND ROUTING
/******************************************************************************/

/* Base URL field (edit this in .htaccess as well if necessary) */
define('BASE_URL_9K', "Code9000");

/* Because of slim.before appendData -> __DIR__ becomes localhost/Code9000 */
define('PATH_WEBROOT', __DIR__);

?>
