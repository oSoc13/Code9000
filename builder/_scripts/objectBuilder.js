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

            // set variables to default values
            var bh = 200;
            var bw = 150;
            var bd = 120;
            var boxSize = {w:300,h:310,relu:130,relv:255};
            var frontImage = '_styles/images/objects/building_1_1.png';
            var sideImage = '_styles/images/objects/building_1_2.png';
            var backImage = '_styles/images/objects/building_1_3.png';
            var topImage = '_styles/images/objects/building_1_4.png';
            var roof = false;

            switch(type){

                case 1:
                    bh = 200;
                    bw = 150;
                    bd = 120;
                    boxSize = {w:300,h:310,relu:130,relv:255};
                    frontImage = '_styles/images/objects/building_1_1.png';
                    sideImage = '_styles/images/objects/building_1_2.png';
                    backImage = '_styles/images/objects/building_1_3.png';
                    topImage = '_styles/images/objects/building_1_4.png';

                    break;

                case 2 :
                    roof = true;

                    bh = 200;
                    bw = 150;
                    bd = 120;
                    boxSize = {w:300,h:350,relu:130,relv:285};
                    frontImage = '_styles/images/objects/building_1_1.png';
                    sideImage = '_styles/images/objects/building_1_2.png';
                    backImage = '_styles/images/objects/building_1_3.png';
                    topImage = '_styles/images/objects/building_1_4.png';

                    roof = true;

                    break;
            }

            var leftFront = new sheetengine.Sheet({x:0,y:bd/2,z:(roof == true ? (bh+50)/2 : bh/2)}, {alphaD:0,betaD:0,gammaD:0}, {w:bw,h:(roof == true ? bh+50 : bh)});

            if(roof){
                leftFront.context.fillStyle = '#FFF';
                leftFront.context.fillRect(0,50,bw,bh);
                leftFront.context.moveTo(0, 50); // give the (x,y) coordinates
                leftFront.context.lineTo(bw/2, 0);
                leftFront.context.lineTo(bw, 50);
                leftFront.context.lineTo(0, 50);

                leftFront.context.closePath();
                leftFront.context.fill();
            }
            else{
                leftFront.context.fillStyle = '#FFF';
                leftFront.context.fillRect(0,0,bw,bh);
            }

            var img = new Image();
            img.onload = function() {
                if(roof){
                    leftFront.context.drawImage(img, 0,50);
                }
                else{
                    leftFront.context.drawImage(img,0,0);
                }

                // draw the scene
                sheetengine.calc.calculateAllSheets();
                sheetengine.drawing.drawScene(true);
            };
            img.src = frontImage;
            var rightFront = new sheetengine.Sheet({x:bw/2,y:0,z:bh/2}, {alphaD:0,betaD:0,gammaD:90}, {w:bd,h:bh});
            rightFront.context.fillStyle = '#FFF';
            rightFront.context.fillRect(0,0,bd,bh);
            var img2 = new Image();
            img2.onload = function() {
                rightFront.context.drawImage(img2, 0,0);

                // draw the scene
                sheetengine.calc.calculateAllSheets();
                sheetengine.drawing.drawScene(true);
            };
            img2.src = sideImage;

            if (roof){
                var topw = Math.sqrt(Math.pow(50,2)+Math.pow(bw/2,2));
                var top = new sheetengine.Sheet({x:-bw/4,y:0,z:bh+26}, {alphaD:90,betaD:0,gammaD:34}, {w:topw,h:bd});
                top.context.fillStyle = '#FFF';
                top.context.fillRect(0,0,topw,bd);
                var img3 = new Image();
                img3.onload = function() {
                    top.context.drawImage(img3, 0,0);

                    // draw the scene
                    sheetengine.calc.calculateAllSheets();
                    sheetengine.drawing.drawScene(true);
                };
                img3.src = topImage;
                var top2 = new sheetengine.Sheet({x:bw/4,y:0,z:bh+26}, {alphaD:90,betaD:0,gammaD:-34}, {w:topw,h:bd});
                top2.context.fillStyle = '#FFF';
                top2.context.fillRect(0,0,topw,bd);
                var img3_2 = new Image();
                img3_2.onload = function() {
                    top2.context.drawImage(img3_2, 0,0);

                    // draw the scene
                    sheetengine.calc.calculateAllSheets();
                    sheetengine.drawing.drawScene(true);
                };
                img3_2.src = topImage;
            }
            else{
                var top = new sheetengine.Sheet({x:0,y:0,z:bh}, {alphaD:90,betaD:90,gammaD:0}, {w:bd,h:bw});
                top.context.fillStyle = '#FFF';
                top.context.fillRect(0,0,bd,bw);
                var img3 = new Image();
                img3.onload = function() {
                    top.context.drawImage(img3, 0,0);

                    // draw the scene
                    sheetengine.calc.calculateAllSheets();
                    sheetengine.drawing.drawScene(true);
                };
                img3.src = topImage;
            }

            var backLeft = new sheetengine.Sheet({x:-bw/2,y:00,z:bh/2}, {alphaD:0,betaD:0,gammaD:-90}, {w:bd,h:bh});
            backLeft.context.fillStyle = '#FFF';
            backLeft.context.fillRect(0,0,bd,bh);

            var img4 = new Image();
            img4.onload = function() {
                backLeft.context.drawImage(img4, 0,0);

                // draw the scene
                sheetengine.calc.calculateAllSheets();
                sheetengine.drawing.drawScene(true);
            };
            img4.src = sideImage;

            var backRight = new sheetengine.Sheet({x:0,y:-bd/2,z:(roof == true ? (bh+50)/2 : bh/2)}, {alphaD:0,betaD:0,gammaD:0}, {w:bw,h:(roof == true ? bh+50 : bh)});

            if(roof){
                backRight.context.fillStyle = '#FFF';
                backRight.context.fillRect(0,50,bw,bh);
                backRight.context.moveTo(0, 50); // give the (x,y) coordinates
                backRight.context.lineTo(bw/2, 0);
                backRight.context.lineTo(bw, 50);
                backRight.context.lineTo(0, 50);

                backRight.context.closePath();
                backRight.context.fill();
            }
            else{
                backRight.context.fillStyle = '#FFF';
                backRight.context.fillRect(0,0,bw,bh);
            }

            var img5 = new Image();
            img5.onload = function() {
                if(roof){
                    backRight.context.drawImage(img5, 0,50);
                }
                else{
                    backRight.context.drawImage(img5, 0,0);
                }
                // draw the scene
                sheetengine.calc.calculateAllSheets();
                sheetengine.drawing.drawScene(true);
            };
            img5.src = backImage;

            if(roof){
                obj = new sheetengine.SheetObject(position, {alphaD:0,betaD:0,gammaD:rotation}, [leftFront,rightFront,top,top2,backLeft,backRight], boxSize);
            }
            else{
                obj = new sheetengine.SheetObject(position, {alphaD:0,betaD:0,gammaD:rotation}, [leftFront,rightFront,top,backLeft,backRight], boxSize);
            }
            obj.data = {"category" : "building", "type" : type, "rotation": obj.rot, "position": obj.centerp};
            obj.setDimming(false, false)
            return obj;
        },

        buildGround:function(type,position,rotation){

            var imgLink = "_styles/images/objects/ground_1.png";

            switch(type){
                case 1:
                    imgLink = "_styles/images/objects/ground_1.png";
                    break;
                case 2:
                    imgLink = "_styles/images/objects/ground_2.png";
                    break;
                case 3:
                    imgLink = "_styles/images/objects/ground_3.png";
                    break;
                case 4:
                    imgLink = "_styles/images/objects/ground_4.png";
                    break;
                case 5:
                    imgLink = "_styles/images/objects/water.png";
                    break;
                case 6:
                    imgLink = "_styles/images/objects/sand.png";
                    break;
                case 7:
                    imgLink = "_styles/images/objects/grass_1.png";
                    break;
                case 8:
                    imgLink = "_styles/images/objects/grass_2.png";
                    break;
                case 9:
                    imgLink = "_styles/images/objects/path_1.png";
                    break;
                case 10:
                    imgLink = "_styles/images/objects/path_2.png";
                    break;
            }

            var sheet = new sheetengine.Sheet({x:0,y:0,z:0}, {alphaD:90,betaD:00,gammaD:0}, {w:60,h:60});
            sheet.context.fillStyle = '#FFF';
            sheet.context.fillRect(0,0,60,60);
            var img = new Image();
            img.onload = function() {
                sheet.context.drawImage(img, 0,0);
                // draw the scene
                sheetengine.calc.calculateAllSheets();
                sheetengine.drawing.drawScene(true);
            };
            img.src = imgLink;
            obj = new sheetengine.SheetObject(position,{alphaD:0,betaD:0,gammaD:rotation}, [sheet], {w:90,h:80,relu:42,relv:40});
            obj.data = {"category" : "ground", "type" : type, "rotation": obj.rot, "position": obj.centerp};

            return obj;
        },

        buildTree:function(type,position,rotation){
            var imgLink = "_styles/images/objects/tree_1.png";

            switch(type){
                case 1:
                    imgLink = "_styles/images/objects/tree_1.png";
                    break;
                case 2:
                    imgLink = "_styles/images/objects/tree_2.png";
                    break;

            }

            var sheet = new sheetengine.Sheet({x:0,y:0,z:60}, {alphaD:00,betaD:00,gammaD:0}, {w:60,h:120});
            sheet.context.fillStyle = '#FFF';
            sheet.context.fillRect(27.5,20,5,100);
            var sheet2 = new sheetengine.Sheet({x:0,y:0,z:60}, {alphaD:00,betaD:00,gammaD:90}, {w:60,h:120});
            sheet2.context.fillStyle = '#FFF';
            sheet2.context.fillRect(27.5,20,5,100);
            var img = new Image();
            img.onload = function() {
                sheet.context.drawImage(img, 0,0);
                sheet2.context.drawImage(img, 0,0);
                // draw the scene
                sheetengine.calc.calculateAllSheets();
                sheetengine.drawing.drawScene(true);
            };
            img.src = imgLink;
            obj = new sheetengine.SheetObject(position,{alphaD:0,betaD:0,gammaD:rotation}, [sheet,sheet2], {w:90,h:200,relu:42,relv:150});
            obj.data = {"category" : "tree", "type" : type, "rotation": obj.rot, "position": obj.centerp};

            return obj;
        },

        // loop through all objects on the stage and push them in the json.
        getObjectsJson:function(objectsArr){
            var json = {"objects":[]};
            for(var i = 0; i<objectsArr.length;i++){
                // set the rotation and position to the current values
                objectsArr[i].data.rotation = objectsArr[i].rot.gammaD;
                json.objects.push(objectsArr[i].data)
            }
            return JSON.stringify(json);
        },

    }
})();