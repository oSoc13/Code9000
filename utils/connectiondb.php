<?php
/**
9K CONNECTION CLASS
---------
# COPYRIGHT
(c) 2013, OKFN Belgium. Some rights reserved.

# AUTHOR
Nico Verbruggen (nico.verb@gmail.com)
Stefaan Christiaens (stefaan.ch@gmail.com)
*/

/** DatabaseConnect($sql) establishes a connection with the database.
 * Note that it returns an array
 * Sample: $db = DatabaseConnect($sql);
 * @return Array results
 */
include_once("config/connectiondetails.php");

/**
 * Connects with database and returns data array
 * @param database connection $sql (inherited from connectiondetails.php)
 * @param array $execute (contains all data for sql query)
 * @return array
 */

function GetDatabaseObj($sql, $execute = ""){
    // CONNECTION WITH DB
    $db = Connection::getInstance();

    try{
            // EXECUTE QUERY
            $stmt = $db->prepare($sql);

            // CHECK FOR EXECUTE
            if ($execute == "")
            {
                    $stmt->execute();
            }
            else
            {
                    $stmt->execute($execute);
            }
            $results = array();
            while($obj = $stmt->fetch(PDO::FETCH_ASSOC)){
                            $results[] = $obj;            
            }

            // CLOSE DATABASE CONNECTION
            $db = null;
    }

    // EXCEPTION HANDLING
    catch(PDOException $ex) {
        echo "Statement is niet correct: " . $ex->getMessage();
    }
    catch(Exception $ex) {
            echo "Er is een fout opgetreden: " . $ex->getMessage();
    }

    // RETURN DATA	
    return $results;
}


class Connection
{
    /**
     * Instatiation of database
     *
     * @staticvar \PDO
     */
    protected static $instance;

    /**
     * Protected instantiation function for connection
     *
     * @throws \ErrorException
     */
    protected function __construct()
    {
        throw new \ErrorException('Creating instance of class disallowed, use <strong>' . get_called_class() . '::getInstance()</strong> instead.');
    }

    /**
     * Prevent cloning
     *
     * @throws \ErrorException
     */
    protected function __clone()
    {
        throw new \ErrorException('Cloning of <strong>' . get_called_class() . '</strong> object disallowed.');
    }

    /**
     * Get connection instance
     *
     * @return \PDO
     */
    public static function getInstance()
    {
        if (!self::$instance) {
            self::createInstance();
        }

        return self::$instance;
    }

    /**
     * Fetch connection properties and create connection
     *
     * @return bool
     * @throws \ErrorException
     */
    protected static function createInstance()
    {
        $hostname = DB_HOST;
        $user = DB_USER;
        $password = DB_PASSWORD;
        $dbname = DB_NAME;
        
        

        try {
            self::$instance  = new PDO ("mysql:host=$hostname;dbname=$dbname","$user","$password");
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
        return true;
    }

}