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
            var topImage2;
            var roof = false;
            var roofSize = 50;

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
                    roof = false;

                    bh = 140;
                    bw = 110;
                    bd = 90;
                    boxSize = {w:250,h:300,relu:130,relv:245};
                    frontImage = '_styles/images/objects/building_2_1.png';
                    sideImage = '_styles/images/objects/building_2_2.png';
                    backImage = '_styles/images/objects/building_2_3.png';
                    topImage = '_styles/images/objects/building_2_4.png';

                    break;

                case 3:
                    roof = true;
                    bh = 160;
                    bw = 111;
                    bd = 105;
                    boxSize = {w:250,h:300,relu:130,relv:245};
                    frontImage = '_styles/images/objects/building_3_1.png';
                    sideImage = '_styles/images/objects/building_3_2.png';
                    backImage = '_styles/images/objects/building_3_3.png';
                    topImage = '_styles/images/objects/building_3_4.png';
                    topImage2 = '_styles/images/objects/building_3_5.png';
                    break;

                case 4:
                    roof = true;
                    roofSize = 100;
                    bh = 280;
                    bw = 300;
                    bd = 280;
                    boxSize = {w:550,h:550,relu:280,relv:375};
                    frontImage = '_styles/images/objects/building_4_1.png';
                    sideImage = '_styles/images/objects/building_4_2.png';
                    backImage = '_styles/images/objects/building_4_3.png';
                    topImage = '_styles/images/objects/building_4_4.png';
                    topImage2 = '_styles/images/objects/building_4_5.png';
                    break;

                case 5:
                    roof = false;
                    bh = 200;
                    bw = 300;
                    bd = 300;
                    boxSize = {w:550,h:550,relu:280,relv:375};
                    frontImage = '_styles/images/objects/building_5_1.png';
                    sideImage = '_styles/images/objects/building_5_2.png';
                    backImage = '_styles/images/objects/building_5_3.png';
                    topImage = '_styles/images/objects/building_5_4.png';
                    break;
            }

            var angle = Math.atan2(roofSize,(bw/2)) * 180/Math.PI;
            console.log(angle);
            var leftFront = new sheetengine.Sheet({x:0,y:bd/2,z:bh/2}, {alphaD:0,betaD:0,gammaD:0}, {w:bw,h:bh});

            if(roof){
                leftFront.context.fillStyle = '#FFF';
                leftFront.context.fillRect(0,roofSize,bw,bh);
                leftFront.context.moveTo(0, roofSize); // give the (x,y) coordinates
                leftFront.context.lineTo(bw/2, 0);
                leftFront.context.lineTo(bw, roofSize);
                leftFront.context.lineTo(0, roofSize);

                leftFront.context.closePath();
                leftFront.context.fill();
            }
            else{
                leftFront.context.fillStyle = '#FFF';
                leftFront.context.fillRect(0,0,bw,bh);
            }

            var img = new Image();
            img.onload = function() {
                leftFront.context.drawImage(img,0,0);

                // draw the scene
                sheetengine.calc.calculateAllSheets();
                sheetengine.drawing.drawScene(true);
            };
            img.src = frontImage;
            var rightFront = new sheetengine.Sheet({x:bw/2,y:0,z:(roof == true ? bh/2-roofSize : bh/2)}, {alphaD:0,betaD:0,gammaD:90}, {w:bd,h:bh});
            rightFront.context.fillStyle = '#FFF';
            rightFront.context.fillRect(0,0,bd,(roof == true ? bh-roofSize : bh));
            var img2 = new Image();
            img2.onload = function() {
                rightFront.context.drawImage(img2, 0,0);

                // draw the scene
                sheetengine.calc.calculateAllSheets();
                sheetengine.drawing.drawScene(true);
            };
            img2.src = sideImage;

            if (roof){
                var topw = Math.sqrt(Math.pow(roofSize,2)+Math.pow(bw/2,2));
                var top = new sheetengine.Sheet({x:-bw/4,y:0,z:bh-roofSize/2}, {alphaD:90,betaD:0,gammaD:angle}, {w:topw,h:bd});
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
                var top2 = new sheetengine.Sheet({x:bw/4,y:0,z:bh-roofSize/2}, {alphaD:90,betaD:0,gammaD:-angle}, {w:topw,h:bd});
                top2.context.fillStyle = '#FFF';
                top2.context.fillRect(0,0,topw,bd);
                var img3_2 = new Image();
                img3_2.onload = function() {
                    top2.context.drawImage(img3_2, 0,0);

                    // draw the scene
                    sheetengine.calc.calculateAllSheets();
                    sheetengine.drawing.drawScene(true);
                };
                img3_2.src = topImage2;
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

            var backLeft = new sheetengine.Sheet({x:-bw/2,y:00,z:(roof == true ? bh/2-roofSize : bh/2)}, {alphaD:0,betaD:0,gammaD:-90}, {w:bd,h:bh});
            backLeft.context.fillStyle = '#FFF';
            backLeft.context.fillRect(0,0,bd,(roof == true ? bh-roofSize : bh));

            var img4 = new Image();
            img4.onload = function() {

                backLeft.context.drawImage(img4, 0,0);

                // draw the scene
                sheetengine.calc.calculateAllSheets();
                sheetengine.drawing.drawScene(true);
            };
            img4.src = sideImage;

            var backRight = new sheetengine.Sheet({x:0,y:-bd/2,z:bh/2}, {alphaD:0,betaD:0,gammaD:0}, {w:bw,h:bh});

            if(roof){
                backRight.context.fillStyle = '#FFF';
                backRight.context.fillRect(0,roofSize,bw,bh);
                backRight.context.moveTo(0, roofSize); // give the (x,y) coordinates
                backRight.context.lineTo(bw/2, 0);
                backRight.context.lineTo(bw, roofSize);
                backRight.context.lineTo(0, roofSize);

                backRight.context.closePath();
                backRight.context.fill();
            }
            else{
                backRight.context.fillStyle = '#FFF';
                backRight.context.fillRect(0,0,bw,bh);
            }

            var img5 = new Image();
            img5.onload = function() {

                backRight.context.drawImage(img5, 0,0);

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
                    imgLink = "_styles/images/objects/ground_5.png";
                    break;
                case 6:
                    imgLink = "_styles/images/objects/ground_6.png";
                    break;
                case 7:
                    imgLink = "_styles/images/objects/water.png";
                    break;
                case 8:
                    imgLink = "_styles/images/objects/sand.png";
                    break;
                case 9:
                    imgLink = "_styles/images/objects/grass_1.png";
                    break;
                case 10:
                    imgLink = "_styles/images/objects/grass_2.png";
                    break;
                case 10:
                    imgLink = "_styles/images/objects/grass_3.png";
                    break;
                case 10:
                    imgLink = "_styles/images/objects/grass_4.png";
                    break;
                case 11:
                    imgLink = "_styles/images/objects/path_1.png";
                    break;
                case 12:
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
            obj.setDimming(false, false)
            return obj;
        },

        buildTree:function(type,position,rotation){
            var imgLink = "_styles/images/objects/tree_"+type+".png";

            var sheet = new sheetengine.Sheet({x:0,y:0,z:60}, {alphaD:00,betaD:00,gammaD:0}, {w:86,h:120});
            sheet.context.fillStyle = '#FFF';
            sheet.context.fillRect(40,20,6,100);
            var sheet2 = new sheetengine.Sheet({x:0,y:0,z:60}, {alphaD:00,betaD:00,gammaD:90}, {w:86,h:120});
            sheet2.context.fillStyle = '#FFF';
            sheet2.context.fillRect(40,20,6,100);
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
            obj.setDimming(false, false)
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