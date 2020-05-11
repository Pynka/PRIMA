"use strict";
var L03_SnakeMove;
(function (L03_SnakeMove) {
    var ƒ = FudgeCore;
    window.addEventListener("load", hndLoad);
    let snake;
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        ƒ.Debug.log(canvas);
        snake = new L03_SnakeMove.Snake();
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translateZ(40);
        cmpCamera.pivot.rotateY(180);
        L03_SnakeMove.viewport = new ƒ.Viewport();
        L03_SnakeMove.viewport.initialize("Viewport", snake, cmpCamera, canvas);
        ƒ.Debug.log(L03_SnakeMove.viewport);
        document.addEventListener("keydown", control);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 5);
    }
    function update(_event) {
        L03_SnakeMove.viewport.draw();
        snake.move();
        console.log("Loop");
    }
    function control(_event) {
        let direction;
        direction = ƒ.Keyboard.mapToValue(ƒ.Vector3.Y(), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]);
        direction.add(ƒ.Keyboard.mapToValue(ƒ.Vector3.Y(-1), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]));
        if (direction.y == 0) {
            direction = ƒ.Keyboard.mapToValue(ƒ.Vector3.X(), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
            direction.add(ƒ.Keyboard.mapToValue(ƒ.Vector3.X(-1), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]));
        }
        if (!direction.equals(ƒ.Vector3.ZERO()))
            snake.direction = direction;
    }
})(L03_SnakeMove || (L03_SnakeMove = {}));
//# sourceMappingURL=Main.js.map