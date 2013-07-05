<?php

/** DatabaseConnect($sql) establishes a connection with the 'publicity' database.
 * Note that it returns an array
 * Sample: $db = DatabaseConnect($sql);
 * @return Array results
 */
include_once("/Code9000/config/connectiondetails.php");


function GetDatabaseObj($sql,$execute = ""){
    // CONNECTION WITH DB
    $db = Connection::getInstance();

    try{
            // EXECUTE SUERY
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
     * Instantie van de databaseconnectie.
     *
     * @staticvar \PDO
     */
    protected static $instance;

    /**
     * Magische methode voor de constructor. Hier is deze methode protected, omdat
     * instatiëren via getInstance() moeten gebeuren
     *
     * @throws \ErrorException
     */
    protected function __construct()
    {
        throw new \ErrorException('Creating instance of class disallowed, use <strong>' . get_called_class() . '::getInstance()</strong> instead.');
    }

    /**
     * Magische methode aangeroepen tijdens klonen. Moet klonen voorkomen.
     *
     * @throws \ErrorException
     */
    protected function __clone()
    {
        throw new \ErrorException('Cloning of <strong>' . get_called_class() . '</strong> object disallowed.');
    }

    /**
     * Geeft de instantie terug, en maakt zo nodig een instantie aan.
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
     * Haalt de configuratie op en maakt een connectie met de databaseserver.
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



?>