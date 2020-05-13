"use strict";
var L06_Snake3D_HeadControl;
(function (L06_Snake3D_HeadControl) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let cubeSize = 9;
    let graph = new ƒ.Node("Game");
    window.addEventListener("load", hndLoad);
    let snake;
    let cosys = new ƒAid.NodeCoordinateSystem("ControlSystem");
    ƒ.RenderManager.initialize(true);
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        ƒ.Debug.log(canvas);
        snake = new L06_Snake3D_HeadControl.Snake();
        graph.addChild(snake);
        cosys.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(10))));
        // graph.addChild(cosys);
        let cube = new ƒAid.Node("Cube", ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(cubeSize)), new ƒ.Material("Cube", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("aqua"))), new ƒ.MeshCube());
        graph.addChild(cube);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(5, 10, 40));
        cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        // cmpCamera.pivot.rotateY(180);
        L06_Snake3D_HeadControl.viewport = new ƒ.Viewport();
        L06_Snake3D_HeadControl.viewport.initialize("Viewport", graph, cmpCamera, canvas);
        ƒ.Debug.log(L06_Snake3D_HeadControl.viewport);
        document.addEventListener("keydown", control);
        spawnFood();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 5);
    }
    function update(_event) {
        snake.move();
        if (isCollision()) {
            alert("You lost the game");
            return;
        }
        eatFood();
        moveCamera();
        L06_Snake3D_HeadControl.viewport.draw();
    }
    function isCollision() {
        let children = snake.getChildren();
        let mtxHeadPosition = children[0].mtxLocal.translation;
        let distance;
        for (let i = 1; i < children.length; i++) {
            distance = getDistance(children[i].mtxLocal.translation, mtxHeadPosition);
            if (distance < 0.01) {
                return true;
            }
        }
        return false;
    }
    function getDistance(p1, p2) {
        return Math.sqrt(Math.pow((p1.x - p2.x), 2) // berechnung des radius 
            + Math.pow((p1.y - p2.y), 2)
            + Math.pow((p1.z - p2.z), 2));
    }
    function moveCamera() {
        let posCamera = snake.head.mtxLocal.translation;
        posCamera.normalize(30);
        L06_Snake3D_HeadControl.viewport.camera.pivot.translation = posCamera;
        L06_Snake3D_HeadControl.viewport.camera.pivot.lookAt(ƒ.Vector3.ZERO());
    }
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    function spawnFood() {
        let randX;
        let randY;
        let randZ;
        let randQubeSide = Math.floor(Math.random() * 6); // Zahl von null - 6 wird dann abgerundet deswegen Zahl von 0-5
        let dimension = Math.round(cubeSize / 2);
        //food kreiren
        let mesh = new ƒ.MeshCube();
        let mtrSolidRed = new ƒ.Material("SolidRed", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("RED")));
        let cmpMaterial = new ƒ.ComponentMaterial(mtrSolidRed);
        let cmpMesh = new ƒ.ComponentMesh(mesh);
        cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.6));
        let food = new ƒ.Node("Food");
        food.addComponent(cmpMesh);
        food.addComponent(cmpMaterial);
        switch (randQubeSide) {
            case 0:
                randX = randomIntFromInterval(-5, 5);
                randY = randomIntFromInterval(-5, 5);
                randZ = dimension;
                break;
            case 1:
                randX = randomIntFromInterval(-5, 5);
                randY = randomIntFromInterval(-5, 5);
                randZ = -dimension;
                break;
            case 2:
                randX = randomIntFromInterval(-5, 5);
                randY = dimension;
                randZ = randomIntFromInterval(-5, 5);
                ;
                break;
            case 3:
                randX = randomIntFromInterval(-5, 5);
                randY = -dimension;
                randZ = randomIntFromInterval(-5, 5);
                ;
                break;
            case 4:
                randX = dimension;
                randY = randomIntFromInterval(-5, 5);
                randZ = randomIntFromInterval(-5, 5);
                ;
                break;
            case 5:
                randX = -dimension;
                randY = randomIntFromInterval(-5, 5);
                randZ = randomIntFromInterval(-5, 5);
                ;
                break;
            default:
            //return;
        }
        food.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(randX, randY, randZ))));
        graph.addChild(food);
    }
    function eatFood() {
        let foodNode = graph.getChildrenByName("Food")[0];
        let distance = getDistance(snake.getChildren()[0].mtxLocal.translation, foodNode.mtxLocal.translation);
        if (distance < 0.01) {
            graph.removeChild(foodNode);
            spawnFood();
            snake.createSegement(1);
            return true;
        }
        return false;
    }
    function control(_event) {
        let rotation = ƒ.Vector3.ZERO();
        switch (_event.code) {
            case ƒ.KEYBOARD_CODE.ARROW_RIGHT:
                rotation = ƒ.Vector3.Y(-90);
                break;
            case ƒ.KEYBOARD_CODE.ARROW_LEFT:
                rotation = ƒ.Vector3.Y(90);
                break;
            case ƒ.KEYBOARD_CODE.SPACE:
                rotation = ƒ.Vector3.Z(-90);
                break;
            default:
                return;
        }
        snake.rotate(rotation);
        // cosys.mtxLocal.rotate(rotation);
    }
})(L06_Snake3D_HeadControl || (L06_Snake3D_HeadControl = {}));
//# sourceMappingURL=Main.js.map