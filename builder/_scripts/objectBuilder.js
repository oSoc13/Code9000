/**
 * Author: Robbe
 * Copyright: 2013 OKFN
 */

//buildings builder class

objectBuilder = (function(){
    //  private variables
    var buildings = null;
    var obj = null;

    //  private functions

    return {

    // public variables

    // public functions

        buildBuilding:function(type,position,rotation){

            switch(type){
                case 1:

                    var leftfront = new sheetengine.Sheet({x:0,y:20,z:20}, {alphaD:0,betaD:0,gammaD:0}, {w:40,h:40});
                    leftfront.context.fillStyle = '#F00';
                    leftfront.context.fillRect(0,0,40,40);
                    var rightFront = new sheetengine.Sheet({x:20,y:0,z:20}, {alphaD:0,betaD:0,gammaD:90}, {w:40,h:40});
                    rightFront.context.fillStyle = '#00FF00';
                    rightFront.context.fillRect(0,0,40,40);
                    var top = new sheetengine.Sheet({x:0,y:00,z:40}, {alphaD:90,betaD:0,gammaD:0}, {w:40,h:40});
                    top.context.fillStyle = '#FFF';
                    top.context.fillRect(0,0,40,40);
                    var backLeft = new sheetengine.Sheet({x:-20,y:00,z:20}, {alphaD:0,betaD:0,gammaD:90}, {w:40,h:40});
                    backLeft.context.fillStyle = '#FFF';
                    backLeft.context.fillRect(0,0,40,40);
                    var backRight = new sheetengine.Sheet({x:0,y:-20,z:20}, {alphaD:0,betaD:0,gammaD:0}, {w:40,h:40});
                    backRight.context.fillStyle = '#00FFFF';
                    backRight.context.fillRect(0,0,40,40);
                    obj = new sheetengine.SheetObject(position, {alphaD:0,betaD:0,gammaD:rotation}, [leftfront,rightFront,top,backLeft,backRight], {w:75,h:80,relu:30,relv:60});
                    obj.data = {"category" : "building", "type" : type, "rotation": obj.rot, "position": obj.centerp};
                    break;
            }

            return obj;
        },

        buildGround:function(type,position,rotation){

            switch(type){
                case 1:
                    var sheet = new sheetengine.Sheet({x:0,y:0,z:0}, {alphaD:90,betaD:00,gammaD:0}, {w:60,h:60});
                    sheet.context.fillStyle = '#FFF';
                    sheet.context.fillRect(0,0,60,60);
                    obj = new sheetengine.SheetObject(position,{alphaD:0,betaD:0,gammaD:rotation}, [sheet], {w:85,h:80,relu:42,relv:40});
                    obj.data = {"category" : "ground", "type" : type, "rotation": obj.rot, "position": obj.centerp};

                    break;
            }

            return obj;
        },

        // loop through all objects on the stage and push them in the json.
        getObjectsJson:function(objectsArr){
            var json = {"objects":[]};
            for(var i = 0; i<objectsArr.length;i++){
                // set the rotation and position to the current values
                objectsArr[i].data.rotation = objectsArr[i].rot;
                objectsArr[i].data.rotation = objectsArr[i].rot;
                json.objects.push(objectsArr[i].data)
            }
            return JSON.stringify(json);
        },

    }
})();