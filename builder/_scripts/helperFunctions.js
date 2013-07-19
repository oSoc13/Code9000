/**
 * Author: Robbe
 * Copyright: 2013 OKFN
 */

//buildings builder class

helperFunctions = (function(){
    //  private variables
    //var privateVar = "private";

    //  private functions
    /*
     function privateFunction(){

     return privateVar;
     }
     */

    return {

        // public variables
        //publicVar: "public",

        // public functions
        /*
         publicFunction:function(){
         return privateVar;
         }
         */

        removeFromArray:function(string,array){
            for (var i=array.length-1; i>=0; i--) {
                if (array[i] === string) {
                    array.splice(i, 1);
                    // break;       //<-- Uncomment  if only the first term has to be removed
                }
            }
            return array;
        }


    }
})();