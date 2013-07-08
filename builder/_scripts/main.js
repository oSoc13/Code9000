/**
 * Author: Robbe
 * Copyright: 2013 OKFN
 */

    $(init);


var testJSON = {"objects":[{"category":"ground","type":1,"rotation":{"alpha":0,"beta":0,"gamma":0,"alphaD":0,"betaD":0,"gammaD":31},"position":{"x":28,"y":0,"z":0}},{"category":"ground","type":1,"rotation":{"alpha":0,"beta":0,"gamma":0.4363323129985824,"alphaD":0,"betaD":0,"gammaD":25},"position":{"x":-40,"y":50,"z":0}},{"category":"building","type":1,"rotation":{"alpha":0,"beta":0,"gamma":0.26529004630313807,"alphaD":0,"betaD":0,"gammaD":15.2},"position":{"x":48,"y":190,"z":0}},{"category":"building","type":1,"rotation":{"alpha":0,"beta":0,"gamma":0,"alphaD":0,"betaD":0,"gammaD":0},"position":{"x":0,"y":-150,"z":0}}]};

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
    startOrientation
    ;

// enumerate mouseStates
Object.freeze(mouseStates);


function init(){
    initButtons();
    initCanvas();
}

function initButtons(){
    $("#createButton").click(function(){
        $(this).addClass("selected");
        mouseState = mouseStates.create;
        return false;
    });
    $("#deleteButton").click(function(){
        $(this).addClass("selected");
        mouseState = mouseStates.delete;
        return false;
    });
    $("#moveButton").click(function(){
        $(this).addClass("selected");
        mouseState = mouseStates.move;
        return false;
    });
    $("#rotateButton").click(function(){
        $(this).addClass("selected");
        mouseState = mouseStates.rotate;
        return false;
    });
    $("#panButton").click(function(){
        $(this).addClass("selected");
        mouseState = mouseStates.pan;
        return false;
    })

}

function initCanvas(){
    mouseState = mouseStates.pan;

    canvasElement = document.getElementById('maincanvas');
    sheetengine.scene.init(canvasElement, {w:2000,h:2000});

// define some basesheets
    for (var x=-2; x<=2; x++) {
        for (var y=-2; y<=2; y++) {
            var basesheet = new sheetengine.BaseSheet({x:x*200,y:y*200,z:0}, {alphaD:90,betaD:0,gammaD:0}, {w:200,h:200});
            basesheet.color = '#5D7E36';
        }
    }

// add objects to stage. and objects array
    /*
    hoverObjects.push(objectBuilder.buildGround(1,{x:28,y:0,z:0},0));
    hoverObjects.push(objectBuilder.buildGround(1,{x:-40,y:50,z:0},25));

    hoverObjects.push(objectBuilder.buildBuilding(1,{x:48,y:190,z:0},23));
    hoverObjects.push(objectBuilder.buildBuilding(1,{x:0,y:-150,z:0},0));
    */

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

        sheetengine.calc.calculateChangedSheets();
        sheetengine.drawing.drawScene();

        if (hover && mouseState == mouseStates.delete && target != null) {

            hover = false;
            target.destroy();
            for(var i = 0;i<target.sheets.length;i++){
                target.sheets[i].destroy();
                densityMap.removeSheet(target.sheets[i]);
            }

            sheetengine.calc.calculateChangedSheets();
            sheetengine.drawing.drawScene(true);
            helperFunctions.removeFromArray(target,hoverObjects);

        }

        else if(mouseState == mouseStates.create){
            var obj = objectBuilder.buildBuilding(1,{x:pxy.x,y:pxy.y,z:0},0)
            hoverObjects.push(obj);
            densityMap.addSheets(obj.sheets);
            sheetengine.calc.calculateChangedSheets();
            sheetengine.drawing.drawScene();
        }

        target = null;

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

        if(mouseDown == true && target != null){
            // move the target;
            if(mouseState == mouseStates.move){
                densityMap.removeSheets(target.sheets);
                target.setPosition({x:pxy.x,y:pxy.y,z:0})
                densityMap.addSheets(target.sheets);
                sheetengine.calc.calculateChangedSheets();
                sheetengine.drawing.drawScene();
            }
            else if(mouseState == mouseStates.rotate){
                densityMap.removeSheets(target.sheets);
                var verticalDist = mouseStart.y - pxy.y;
                var angle = (verticalDist/5);
                target.setOrientation({alphaD:0,betaD:0,gammaD: startOrientation + angle});
                console.log(target)
                densityMap.addSheets(target.sheets);
                sheetengine.calc.calculateChangedSheets();
                sheetengine.drawing.drawScene();
            }
        }
        else{
            // hover the target
            var objhovered = isObjectHovered(puv);
            if (objhovered != hover)
                hover = objhovered;
        }
    }

//  enter frame method
    setInterval(mainloop, 30);
}

//  load buildings from saved file.
function getBuildingsJson(){
    //$.getJSON('ajax/test.json', function(data) {


    for(var i=0;i<testJSON.objects.length;i++){
        console.log(testJSON.objects[i]);
        var category = testJSON.objects[i].category;
        if(category == "building"){
            hoverObjects.push(objectBuilder.buildBuilding(testJSON.objects[i].type,testJSON.objects[i].position,testJSON.objects[i].rotation.gammaD));
        }
        else if(category == "ground"){
            hoverObjects.push(objectBuilder.buildGround(testJSON.objects[i].type,testJSON.objects[i].position,testJSON.objects[i].rotation.gammaD));
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
    var character = new sheetengine.SheetObject(centerp, {alphaD:0,betaD:0,gammaD:90}, [body,backhead,leg1,leg2], {w:70, h:110, relu:10, relv:25});

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
            jumpspeed = 15;
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

        if (puv.u > ouv.u - 20 &&
            puv.u < ouv.u - 20 + 40 &&
            puv.v > ouv.v - 30 &&
            puv.v < ouv.v - 30 + 40){
            target = hoverObjects[i];
            tester =  true;
        }
        else{

        }
    }

    return tester;
}


// main loop
function mainloop() {
    var dx = 0;
    var dy = 0;
    if (keys.u) {
        dy = -5;
        character.setOrientation({alphaD:0,betaD:0,gammaD:180});
    }
    if (keys.d) {
        dy = 5;
        character.setOrientation({alphaD:0,betaD:0,gammaD:0});
    }
    if (keys.l) {
        dx = -5;
        character.setOrientation({alphaD:0,betaD:0,gammaD:270});
    }
    if (keys.r) {
        dx = 5;
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
        sheetengine.calc.calculateChangedSheets();
        sheetengine.drawing.drawScene();
    }

    // draw rectangle
    if (hover && mouseState == mouseStates.delete && target != null) {
        var ctx = sheetengine.context;

        ctx.save();
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = '#FFF';
        var ouv = sheetengine.drawing.getPointuv(target.centerp);
        ctx.strokeRect(Math.round(ouv.u) - 35, Math.round(ouv.v) - 55, 70, 70);
        ctx.restore();

    }

};

