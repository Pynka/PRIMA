"use strict";
var L04_SnakeControl;
(function (L04_SnakeControl) {
    class SnakeElement {
        constructor(isHead, node, previousElement, nextElement, position) {
            this.isHead = isHead;
            this.node = node;
            this.position = position;
            isHead ? this.previousElement = null : this.previousElement = previousElement;
            isHead ? this.nextElement = null : this.nextElement = nextElement;
            this.create;
        }
    }
    var ƒ = FudgeCore;
    let _snakeHead;
    let _snake = [];
    let _fps = 5;
    let _direction = new ƒ.Vector2(1, 0);
    let _game = new ƒ.Node('Game');
    let _camera = new ƒ.ComponentCamera();
    let _viewport = new ƒ.Viewport();
    window.addEventListener("load", init);
    function init() {
        const canvas = document.querySelector("canvas");
        // add snake head
        let position = new ƒ.Vector2(0, 0);
        let snakeHeadNode = createNode('Snake Head', new ƒ.MeshCube, new ƒ.Material("White", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 1, 1, 1))), new ƒ.Vector2(0, 0), new ƒ.Vector2(0.8, 0.8));
        _snakeHead = new SnakeElement(true, snakeHeadNode, null, null, position);
        _snake.push(_snakeHead);
        _game.appendChild(snakeHeadNode);
        // add elements to snake
        addElement();
        addElement();
        addElement();
        // initialize camera and viewport
        _camera.pivot.translateZ(50);
        _camera.pivot.rotateY(180);
        _viewport.initialize("Viewport", _game, _camera, canvas);
        _viewport.draw();
        // add EventListener and start Loop
        document.addEventListener("keydown", control);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, _fps);
    }
    function update() {
        move();
        _viewport.draw();
    }
    function move() {
        // update position if snake reached border
        if (_snakeHead.position.y >= 20 && _direction.y == 1) {
            _snakeHead.node.cmpTransform.local.translation = new ƒ.Vector2(_snakeHead.position.x, -21).toVector3();
        }
        if (_snakeHead.position.y <= -20 && _direction.y == -1) {
            _snakeHead.node.cmpTransform.local.translation = new ƒ.Vector2(_snakeHead.position.x, 21).toVector3();
        }
        if (_snakeHead.position.x >= 20 && _direction.x == 1) {
            _snakeHead.node.cmpTransform.local.translation = new ƒ.Vector2(-21, _snakeHead.position.y).toVector3();
        }
        if (_snakeHead.position.x <= -20 && _direction.x == -1) {
            _snakeHead.node.cmpTransform.local.translation = new ƒ.Vector2(21, _snakeHead.position.y).toVector3();
        }
        _snakeHead.node.cmpTransform.local.translate(_direction.toVector3());
        let endReached = false;
        let actualElement = _snakeHead;
        while (!endReached) {
            if (actualElement.nextElement == null) {
                endReached = true;
            }
            else {
                actualElement.nextElement.node.cmpTransform.local.translation = actualElement.position.toVector3();
                actualElement = actualElement.nextElement;
            }
        }
        // update positions of each element
        for (let elem of _snake) {
            elem.position = elem.node.cmpTransform.local.translation.toVector2();
        }
    }
    function control(_event) {
        switch (_event.code) {
            case ƒ.KEYBOARD_CODE.ARROW_UP:
                if (_direction.y != -1) {
                    _direction = new ƒ.Vector2(0, 1);
                }
                break;
            case ƒ.KEYBOARD_CODE.ARROW_DOWN:
                if (_direction.y != 1) {
                    _direction = new ƒ.Vector2(0, -1);
                }
                break;
            case ƒ.KEYBOARD_CODE.ARROW_RIGHT:
                if (_direction.x != -1) {
                    _direction = new ƒ.Vector2(1, 0);
                }
                break;
            case ƒ.KEYBOARD_CODE.ARROW_LEFT:
                if (_direction.x != 1) {
                    _direction = new ƒ.Vector2(-1, 0);
                }
                break;
        }
        _viewport.draw();
    }
    function addElement() {
        // create new element
        let node = createNode('Snake Element', new ƒ.MeshCube, new ƒ.Material("White", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 1, 1, 1))), _snakeHead.position, new ƒ.Vector2(0.8, 0.8));
        let newElement = new SnakeElement(false, node, _snakeHead, _snakeHead.nextElement, _snakeHead.position);
        // TO DO: check if else
        if (_snakeHead.nextElement) {
            _snakeHead.nextElement.previousElement = newElement;
            _snakeHead.nextElement = newElement;
        }
        else {
            _snakeHead.nextElement = newElement;
        }
        _game.appendChild(node);
        _snake.push(newElement);
    }
    function createNode(_name, _mesh, _material, _translation, _scaling) {
        let node = new ƒ.Node(_name);
        node.addComponent(new ƒ.ComponentTransform);
        node.addComponent(new ƒ.ComponentMaterial(_material));
        node.addComponent(new ƒ.ComponentMesh(_mesh));
        node.cmpTransform.local.translate(_translation.toVector3());
        node.getComponent(ƒ.ComponentMesh).pivot.scale(_scaling.toVector3());
        return node;
    }
})(L04_SnakeControl || (L04_SnakeControl = {}));
//# sourceMappingURL=Snake.js.map