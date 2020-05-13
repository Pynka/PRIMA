namespace L04_SnakeControl {

  class SnakeElement {

    //create variables to use them universally
    isHead: boolean;
    node: ƒ.Node;
    previousElement: SnakeElement;
    nextElement: SnakeElement;
    position: ƒ.Vector2;

    constructor(isHead: boolean, node: ƒ.Node, previousElement: SnakeElement, nextElement: SnakeElement, position: ƒ.Vector2) {
        this.isHead = isHead;
        this.node = node;
        this.position = position;
        isHead ? this.previousElement = null : this.previousElement = previousElement;
        isHead ? this.nextElement = null : this.nextElement = nextElement;
        this.create;
    }
  }

    import ƒ = FudgeCore;

    let _snakeHead: SnakeElement;
    let _snake: SnakeElement[] = [];
    let _fps: number = 5;
    let _direction: ƒ.Vector2 = new ƒ.Vector2(1, 0);

    let _game: ƒ.Node = new ƒ.Node('Game');
    let _camera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    let _viewport: ƒ.Viewport = new ƒ.Viewport();
  
    window.addEventListener("load", init);

    function init(): void {
      const canvas: HTMLCanvasElement = document.querySelector("canvas");

      // add snake head
      let position: ƒ.Vector2 = new ƒ.Vector2(0, 0);
      let snakeHeadNode: ƒ.Node = createNode('Snake Head', new ƒ.MeshCube, new ƒ.Material("White", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 1, 1, 1))), new ƒ.Vector2(0, 0), new ƒ.Vector2(0.8, 0.8));
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
      ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
      ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, _fps);
    }

    function update(): void {
      move();
      _viewport.draw();
    }

    function move(): void {

      // update position if snake reached border
      if (_snakeHead.position.y >= 20 && _direction.y == 1) {_snakeHead.node.cmpTransform.local.translation = new ƒ.Vector2(_snakeHead.position.x, -21).toVector3();}
      if (_snakeHead.position.y <= -20 && _direction.y == -1) {_snakeHead.node.cmpTransform.local.translation = new ƒ.Vector2(_snakeHead.position.x, 21).toVector3();}
      if (_snakeHead.position.x >= 20 && _direction.x == 1) {_snakeHead.node.cmpTransform.local.translation = new ƒ.Vector2(-21, _snakeHead.position.y).toVector3();}
      if (_snakeHead.position.x <= -20 && _direction.x == -1) {_snakeHead.node.cmpTransform.local.translation = new ƒ.Vector2(21, _snakeHead.position.y).toVector3();}
  
      _snakeHead.node.cmpTransform.local.translate(_direction.toVector3());
      let endReached: boolean = false;
      let actualElement: SnakeElement = _snakeHead;
  
      while (!endReached) {
        if (actualElement.nextElement == null) {
          endReached = true;
        } else {
          actualElement.nextElement.node.cmpTransform.local.translation = actualElement.position.toVector3();
          actualElement = actualElement.nextElement;
        }
      }

      // update positions of each element
      for (let elem of _snake) {
        elem.position = elem.node.cmpTransform.local.translation.toVector2();
      }
    }

    function control(_event: KeyboardEvent): void {

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

    function addElement(): void {

      // create new element
      let node: ƒ.Node = createNode('Snake Element', new ƒ.MeshCube, new ƒ.Material("White", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 1, 1, 1))), _snakeHead.position, new ƒ.Vector2(0.8, 0.8));
      let newElement: SnakeElement = new SnakeElement(false, node, _snakeHead, _snakeHead.nextElement, _snakeHead.position);
      
      // TO DO: check if else
      if (_snakeHead.nextElement) {
        _snakeHead.nextElement.previousElement = newElement;
        _snakeHead.nextElement = newElement;
      } else {
        _snakeHead.nextElement = newElement;
      }

      _game.appendChild(node);
      _snake.push(newElement);
    }

    function createNode(_name: string, _mesh: ƒ.Mesh, _material: ƒ.Material, _translation: ƒ.Vector2, _scaling: ƒ.Vector2): ƒ.Node {

      let node: ƒ.Node = new ƒ.Node(_name);
      node.addComponent(new ƒ.ComponentTransform);
      node.addComponent(new ƒ.ComponentMaterial(_material));
      node.addComponent(new ƒ.ComponentMesh(_mesh));
      node.cmpTransform.local.translate(_translation.toVector3());
      node.getComponent(ƒ.ComponentMesh).pivot.scale(_scaling.toVector3());
      
      return node;
    }
  }