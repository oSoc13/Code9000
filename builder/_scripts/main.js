/**
 * Author: Robbe
 * Copyright: 2013 OKFN
 */

    $(init);

var testJSON = {"objects":[{"category":"ground","type":2,"rotation":0,"position":{"x":70,"y":-210,"z":0}},
    {"category":"building","type":1,"rotation":90,"position":{"x":-200,"y":-75,"z":0}},
    {"category":"building","type":1,"rotation":-270,"position":{"x":-200,"y":-225,"z":0}},
    {"category":"ground","type":2,"rotation":0,"position":{"x":70,"y":-150,"z":0}},
    {"category":"ground","type":2,"rotation":0,"position":{"x":70,"y":-90,"z":0}},
    {"category":"ground","type":2,"rotation":0,"position":{"x":70,"y":-270,"z":0}},
    {"category":"ground","type":4,"rotation":0,"position":{"x":190,"y":-90,"z":0}},
    {"category":"ground","type":1,"rotation":0,"position":{"x":10,"y":-270,"z":0}},
    {"category":"ground","type":1,"rotation":0,"position":{"x":130,"y":-270,"z":0}},
    {"category":"ground","type":1,"rotation":0,"position":{"x":130,"y":-150,"z":0}},
    {"category":"ground","type":1,"rotation":0,"position":{"x":130,"y":-90,"z":0}},
    {"category":"ground","type":1,"rotation":0,"position":{"x":10,"y":-210,"z":0}},
    {"category":"ground","type":1,"rotation":0,"position":{"x":10,"y":-90,"z":0}},
    {"category":"ground","type":1,"rotation":0,"position":{"x":10,"y":-150,"z":0}},
    {"category":"ground","type":4,"rotation":0,"position":{"x":-50,"y":-270,"z":0}},
    {"category":"ground","type":4,"rotation":0,"position":{"x":-50,"y":-210,"z":0}},
    {"category":"ground","type":4,"rotation":0,"position":{"x":-50,"y":-150,"z":0}},
    {"category":"ground","type":4,"rotation":0,"position":{"x":-50,"y":-90,"z":0}},
    {"category":"ground","type":10,"rotation":0,"position":{"x":250,"y":-90,"z":0}},
    {"category":"ground","type":10,"rotation":0,"position":{"x":-110,"y":-270,"z":0}},
    {"category":"ground","type":10,"rotation":0,"position":{"x":-110,"y":-210,"z":0}},
    {"category":"ground","type":10,"rotation":0,"position":{"x":-110,"y":-150,"z":0}},
    {"category":"ground","type":10,"rotation":0,"position":{"x":-110,"y":-90,"z":0}},
    {"category":"tree","type":1,"rotation":0,"position":{"x":255,"y":-80,"z":0}},
    {"category":"tree","type":2,"rotation":0,"position":{"x":-50,"y":-345,"z":0}},
    {"category":"tree","type":2,"rotation":0,"position":{"x":250,"y":-194,"z":0}},
    {"category":"tree","type":2,"rotation":0,"position":{"x":229,"y":-286,"z":0}},
    {"category":"tree","type":2,"rotation":0,"position":{"x":-47,"y":-231,"z":0}},
    {"category":"tree","type":2,"rotation":0,"position":{"x":-45,"y":-108,"z":0}},
    {"category":"ground","type":1,"rotation":0,"position":{"x":130,"y":-210,"z":0}},
    {"category":"ground","type":4,"rotation":0,"position":{"x":190,"y":-210,"z":0}},
    {"category":"ground","type":4,"rotation":0,"position":{"x":190,"y":-150,"z":0}},
    {"category":"ground","type":4,"rotation":0,"position":{"x":190,"y":-270,"z":0}},
    {"category":"ground","type":10,"rotation":0,"position":{"x":250,"y":-150,"z":0}},
    {"category":"ground","type":10,"rotation":0,"position":{"x":250,"y":-210,"z":0}},
    {"category":"ground","type":10,"rotation":0,"position":{"x":250,"y":-270,"z":0}},
    {"category":"tree","type":2,"rotation":-90,"position":{"x":-45,"y":-420,"z":0}}]};


var canvasElement,
    character,
    keys,
    jumpspeed,
    jump,
    densityMap,
    target = null,
    hover = false,
    hoverObjects=[],
    mouseStates = {"create":1, "delete":2, "move":3, "rotate":4, "pan":4},
    mouseState,
    mouseDown,
    mouseStart,
    startOrientation,
    selectedObject = ["building","1"],
    mouseObject = null
    ;

// enumerate mouseStates
Object.freeze(mouseStates);


function init(){
    //preload images
    $("#maincanvas").hide


    var queue = new createjs.LoadQueue();
    queue.addEventListener("complete", handleComplete);
    queue.loadManifest([
        {id: "building", src:"_styles/images/objects/building_1_1.png"},
        {id: "building", src:"_styles/images/objects/building_1_2.png"},
        {id: "building", src:"_styles/images/objects/building_1_3.png"},
        {id: "building", src:"_styles/images/objects/building_1_4.png"},
        {id: "grass", src:"_styles/images/objects/grass_1.png"},
        {id: "grass", src:"_styles/images/objects/grass_2.png"},
        {id: "ground", src:"_styles/images/objects/ground_1.png"},
        {id: "ground", src:"_styles/images/objects/ground_2.png"},
        {id: "ground", src:"_styles/images/objects/ground_3.png"},
        {id: "ground", src:"_styles/images/objects/ground_4.png"},
        {id: "path", src:"_styles/images/objects/path_1.png"},
        {id: "path", src:"_styles/images/objects/path_2.png"},
        {id: "sand", src:"_styles/images/objects/sand.png"},
        {id: "tree", src:"_styles/images/objects/tree_1.png"},
        {id: "tree", src:"_styles/images/objects/tree_2.png"},
        {id: "water", src:"_styles/images/objects/water.png"}
    ]);
    function handleComplete() {
        $("#maincanvas").css("background-color","#FFF").show();
        initButtons();
        initCanvas();
    }

}

function initButtons(){
    $("#createBtn").click(function(){
        $(this).addClass("selected");
        mouseState = mouseStates.create;
        return false;
    });
    $("#deleteBtn").click(function(){
        $(this).addClass("selected");
        mouseState = mouseStates.delete;
        return false;
    });
    $("#moveBtn").click(function(){
        $(this).addClass("selected");
        mouseState = mouseStates.move;
        return false;
    });
    $("#rotateBtn").click(function(){
        $(this).addClass("selected");
        mouseState = mouseStates.rotate;
        return false;
    });
    $("#panBtn").click(function(){
        $(this).addClass("selected");
        mouseState = mouseStates.pan;
        return false;
    })

    $(".selectBtn").click(function(){
        var catType=$(this).attr("id").split("_");
        selectedObject = catType;

        return false;
    })

}

function initCanvas(){
    mouseState = mouseStates.rotate;

    canvasElement = document.getElementById('maincanvas');
    canvasElement.width  = window.innerWidth - 100;
    canvasElement.height = window.innerHeight;
    sheetengine.scene.init(canvasElement, {w:2800,h:1500});

// define some basesheets
    for (var x=-4; x<=4; x++) {
        for (var y=-4; y<=4; y++) {
            var basesheet = new sheetengine.BaseSheet({x:x*200,y:y*200,z:0}, {alphaD:90,betaD:0,gammaD:0}, {w:200,h:200});
            basesheet.color = '#5D7E36';
        }
    }

// add mouseObject to the stage
    var mouseSheet = new sheetengine.Sheet({x:0,y:0,z:0}, {alphaD:90,betaD:00,gammaD:0}, {w:60,h:60});
    mouseSheet.context.fillStyle = "rgba(255, 255, 255, 0)";
    mouseSheet.context.fillRect(0,0,60,60);
    mouseSheet.setDimming(true,true);

    mouseObject = new sheetengine.SheetObject({x:0,y:0,z:0},{alphaD:0,betaD:0,gammaD:0}, [mouseSheet], {w:90,h:80,relu:42,relv:40});



// add objects to stage. and objects array

    getBuildingsJson();
// generate a density map from the sheets
    densityMap = new sheetengine.DensityMap(5);
    densityMap.addSheets(sheetengine.sheets);

    // define a character
    character = defineCharacter({x:110,y:0,z:0});
    sheetengine.scene.setCenter({x:character.centerp.x, y:character.centerp.y, z:0});

// draw initial scene
    sheetengine.calc.calculateAllSheets();
    sheetengine.drawing.drawScene(true);

// keyboard events
    keys = {u:0,d:0,l:0,r:0};
    jumpspeed = 0;
    jump = 0;

// keyboardhandlers
    window.onkeydown = function(event) { setKeys(event, 1); };
    window.onkeyup = function(event) { setKeys(event, 0); };

// mousehandlers
    canvasElement.onmousedown = function(event){
        mouseDown = true;
        // get the mousedown coordinates
        var puv = {
            u:event.clientX - sheetengine.canvas.offsetLeft,
            v:event.clientY - sheetengine.canvas.offsetTop
        };
        var pxy = sheetengine.transforms.inverseTransformPoint({
            u:puv.u + sheetengine.scene.center.u,
            v:puv.v + sheetengine.scene.center.v
        });

        // set startpoint for future reference
        mouseStart = pxy;

        if(target != null){
            startOrientation = target.rot.gammaD;
        }
    }
    canvasElement.onmouseup = function(event){
        mouseDown = false;
        // get the mousup coordinates
        var puv = {
            u:event.clientX - sheetengine.canvas.offsetLeft,
            v:event.clientY - sheetengine.canvas.offsetTop
        };
        var pxy = sheetengine.transforms.inverseTransformPoint({
            u:puv.u + sheetengine.scene.center.u,
            v:puv.v + sheetengine.scene.center.v
        });

        if(mouseState == mouseStates.create){
            var obj;
            switch (selectedObject[0]){
                case "building":
                    obj = objectBuilder.buildBuilding(parseInt(selectedObject[1]),{x:pxy.x,y:pxy.y,z:0},0);
                    break;

                case "ground":
                    obj = objectBuilder.buildGround(parseInt(selectedObject[1]),{x:pxy.x,y:pxy.y,z:0},0);
                    break;
                case "tree":
                    obj = objectBuilder.buildTree(parseInt(selectedObject[1]),{x:pxy.x,y:pxy.y,z:0},0);
                    break;
            }

            hoverObjects.push(obj);
            densityMap.addSheets(obj.sheets);
        }


        if (hover && mouseState == mouseStates.delete && target != null) {

            hover = false;

            for(var i = 0;i<target.sheets.length;i++){
                target.sheets[i].destroy();
                densityMap.removeSheet(target.sheets[i]);
            }

            target.destroy();


            helperFunctions.removeFromArray(target,hoverObjects);

        }

        if(target != null){
            target.setDimming(true,true);
            target = null;

        }

        sheetengine.calc.calculateAllSheets();
        sheetengine.drawing.drawScene();

    }

    canvasElement.onmousemove = function(event) {
        // get the hover coordinates
        var puv = {
            u:event.clientX - sheetengine.canvas.offsetLeft,
            v:event.clientY - sheetengine.canvas.offsetTop
        };
        var pxy = sheetengine.transforms.inverseTransformPoint({
            u:puv.u + sheetengine.scene.center.u,
            v:puv.v + sheetengine.scene.center.v
        });

        pxy.x = Math.round(pxy.x/5)*5;
        pxy.y = Math.round(pxy.y/5)*5;

        if(mouseDown == true && target != null){
            // move the target;
            if(mouseState == mouseStates.move){
                densityMap.removeSheets(target.sheets);
                target.setPosition({x:Math.ceil(pxy.x),y:Math.ceil(pxy.y),z:0})
                densityMap.addSheets(target.sheets);
            }
            else if(mouseState == mouseStates.rotate){
                densityMap.removeSheets(target.sheets);
                var verticalDist = mouseStart.y - pxy.y;
                var angle = Math.round(verticalDist/25)*15;
                target.setOrientation({alphaD:0,betaD:0,gammaD: startOrientation + angle});
                densityMap.addSheets(target.sheets);
            }
        }
        else{
            // hover the target
            var objhovered = isObjectHovered(puv);
            if (objhovered != hover)
                hover = objhovered;

        }
        mouseObject.setPosition({x:pxy.x,y:pxy.y,z:0});
        sheetengine.calc.calculateAllSheets();
        sheetengine.drawing.drawScene();
    }

//  enter frame method
    setInterval(mainloop, 30);
}

//  load buildings from saved file.
function getBuildingsJson(){
    //$.getJSON('ajax/test.json', function(data) {


    for(var i=0;i<testJSON.objects.length;i++){
        var category = testJSON.objects[i].category;
        if(category == "building"){
            hoverObjects.push(objectBuilder.buildBuilding(testJSON.objects[i].type,testJSON.objects[i].position,testJSON.objects[i].rotation));
        }
        else if(category == "ground"){
            hoverObjects.push(objectBuilder.buildGround(testJSON.objects[i].type,testJSON.objects[i].position,testJSON.objects[i].rotation));
        }
        else if(category == "tree"){
            hoverObjects.push(objectBuilder.buildTree(testJSON.objects[i].type,testJSON.objects[i].position,testJSON.objects[i].rotation));
        }
    }
}

//  function for creating a character with a body and 2 legs
function defineCharacter(centerp) {
    // character definition for animation with sheet motion
    var body = new sheetengine.Sheet({x:0,y:0,z:15}, {alphaD:0,betaD:0,gammaD:0}, {w:11,h:14});
    var backhead = new sheetengine.Sheet({x:0,y:-1,z:19}, {alphaD:0,betaD:0,gammaD:0}, {w:8,h:6});
    backhead.context.fillStyle = '#550';
    backhead.context.fillRect(0,0,8,6);
    // legs
    var leg1 = new sheetengine.Sheet({x:-3,y:0,z:4}, {alphaD:0,betaD:0,gammaD:0}, {w:5,h:8});
    leg1.context.fillStyle = '#00F';
    leg1.context.fillRect(0,0,5,10);
    var leg2 = new sheetengine.Sheet({x:3,y:0,z:4}, {alphaD:0,betaD:0,gammaD:0}, {w:5,h:8});
    leg2.context.fillStyle = '#00F';
    leg2.context.fillRect(0,0,5,10);

    // define character object
    var character = new sheetengine.SheetObject(centerp, {alphaD:0,betaD:0,gammaD:90}, [body,backhead,leg1,leg2], {w:300, h:310, relu:10, relv:25});

    character.leg1 = leg1;
    character.leg2 = leg2;

    var ctx = body.context;

    // head
    ctx.fillStyle = '#FF0';
    ctx.fillRect(2,2,7,4);
    ctx.fillStyle = '#550';
    ctx.fillRect(2,0,7,2);
    ctx.fillRect(2,2,1,1);
    ctx.fillRect(8,2,1,1);

    // body
    ctx.fillStyle = '#F0F';
    ctx.fillRect(0,6,11,7);

    // hands
    ctx.fillStyle = '#FF0';
    ctx.fillRect(0,11,1,2);
    ctx.fillRect(10,11,1,2);

    character.animationState = 0;
    character.setDimming(true, true)
    return character;
};

// function for animating character's sheets
function animateCharacter(character) {
    var state = Math.floor( (character.animationState % 8) / 2);
    var dir = (state == 0 || state == 3) ? 1 : -1;

    character.rotateSheet(character.leg1, {x:0,y:0,z:8}, {x:1,y:0,z:0}, dir * Math.PI/8);
    character.rotateSheet(character.leg2, {x:0,y:0,z:8}, {x:1,y:0,z:0}, -dir * Math.PI/8);
}

// sets keys to keycodes
function setKeys(event, val) {
    var keyProcessed = 0;

    if (event.keyCode == '38' || event.keyCode == '87') {
        keys.u = val;
        keyProcessed = 1;
    }
    if (event.keyCode == '37' || event.keyCode == '65') {
        keys.l = val;
        keyProcessed = 1;
    }
    if (event.keyCode == '39' || event.keyCode == '68') {
        keys.r = val;
        keyProcessed = 1;
    }
    if (event.keyCode == '40' || event.keyCode == '83') {
        keys.d = val;
        keyProcessed = 1;
    }

    if (event.keyCode == '32') {
        if (jump == 0 && val == 1) {
            jump = 1;
            jumpspeed = 30;
        }
        keyProcessed = 1;
    }
    if (keyProcessed)
        event.preventDefault();
}


//check if object is hovered.
function isObjectHovered(puv) {
    var tester = false;
    for(var i=0;i<hoverObjects.length;i++){
        var ouv = sheetengine.drawing.getPointuv(hoverObjects[i].centerp);
        var width = hoverObjects[i].canvasSize.w;
        var height = hoverObjects[i].canvasSize.y;
        var relu = hoverObjects[i].canvasSize.relu;;
        var relv = hoverObjects[i].canvasSize.relv;

        if (puv.u > ouv.u - 40&&
            puv.u < ouv.u - 40 + 80 &&
            puv.v > ouv.v - 40 &&
            puv.v < ouv.v - 40 + 80){
            target = hoverObjects[i];
            tester =  true;
        }
    }

    return tester;
}


// main loop
function mainloop() {
    var dx = 0;
    var dy = 0;
    if (keys.u) {
        dy = -10;
        character.setOrientation({alphaD:0,betaD:0,gammaD:180});
    }
    if (keys.d) {
        dy = 10;
        character.setOrientation({alphaD:0,betaD:0,gammaD:0});
    }
    if (keys.l) {
        dx = -10;
        character.setOrientation({alphaD:0,betaD:0,gammaD:270});
    }
    if (keys.r) {
        dx = 10;
        character.setOrientation({alphaD:0,betaD:0,gammaD:90});
    }
    if (dx != 0)
        dy = 0;

    // character constantly falls
    jumpspeed -= 2;

    // get allowed target point. character's height is 20, and character can climb up to 10 pixels
    var targetInfo = densityMap.getTargetPoint(character.centerp, {x:dx, y:dy, z:jumpspeed}, 20, 10);
    var allowMove = targetInfo.allowMove;
    var targetp = targetInfo.targetp;
    var stopFall = targetInfo.stopFall;

    // if character stops falling, reset jump info
    if (stopFall) {
        jumpspeed = 0;
        jump = 0;
    }

    var moved = targetp.x != character.centerp.x || targetp.y != character.centerp.y || targetp.z != character.centerp.z;
    if (moved && allowMove) {
        // move character to target point
        character.setPosition(targetp);

        animateCharacter(character);
        character.animationState++;

        // move center
        sheetengine.scene.setCenter({x:character.centerp.x, y:character.centerp.y, z:0});
        // calculate sheets and draw scene
        sheetengine.calc.calculateAllSheets();
        sheetengine.drawing.drawScene();

    }

    // draw rectangle
    if (hover && mouseState == mouseStates.delete && target != null) {
        var ctx = sheetengine.context;

        sheetengine.drawing.drawScene();
        ctx.save();
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = '#FFF';
        var ouv = sheetengine.drawing.getPointuv(target.centerp);
        ctx.strokeRect(Math.round(ouv.u) - 35, Math.round(ouv.v) - 55, 70, 70);
        ctx.restore();

    }


}

exportAndSaveCanvas = function () {

    // Get the canvas screenshot as PNG
    var screenshot = Canvas2Image.saveAsPNG(canvasElement, true);

    // This is a little trick to get the SRC attribute from the generated <img> screenshot
    canvasElement.parentNode.appendChild(screenshot);
    screenshot.id = "canvasimage";
    data = $('#canvasimage').attr('src');
    canvasElement.parentNode.removeChild(screenshot);


    // Send the screenshot to PHP to save it on the server
    var url = 'upload.php';
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'text',
        data: {
            base64data : data
        }
    });
}

