namespace L06_Snake3D_HeadControl {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  window.addEventListener("load", hndLoad);
  export let viewport: ƒ.Viewport;
  let snake: Snake;
  let cosys: ƒAid.NodeCoordinateSystem = new ƒAid.NodeCoordinateSystem("ControlSystem");
  ƒ.RenderManager.initialize(true);

  function hndLoad(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    ƒ.Debug.log(canvas);

    let graph: ƒ.Node = new ƒ.Node("Game");
    snake = new Snake();
    graph.addChild(snake);
    cosys.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(10))));
    // graph.addChild(cosys);

    let cube: ƒAid.Node = new ƒAid.Node(
      "Cube", ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(9)),
      new ƒ.Material("Cube", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("aqua"))),
      new ƒ.MeshCube()
    );
    graph.addChild(cube);

    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    cmpCamera.pivot.translate(new ƒ.Vector3(5, 10, 40));
    cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
    // cmpCamera.pivot.rotateY(180);

    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", graph, cmpCamera, canvas);
    ƒ.Debug.log(viewport);

    document.addEventListener("keydown", control);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 5);
  }

  function update(_event: ƒ.Eventƒ): void {
    snake.move();
    if (isCollision){
      alert("You lost the game");
      return;
    }
    moveCamera();
    viewport.draw();
  }

  function isCollision() : boolean {
    let children: ƒ.Node[] = snake.getChildren();
    let mtxHeadPosition: ƒ.Vector3 = children [0].mtxLocal.translation;
    let distance;
    for (let i = 1; i<children.length; i++){
     distance =  Math.sqrt(Math.pow((children[i].mtxLocal.translation.x -mtxHeadPosition.x), 2) // berechnung des radius 
      + Math.pow((children[i].mtxLocal.translation.y -mtxHeadPosition.y), 2)
      + Math.pow((children[i].mtxLocal.translation.z -mtxHeadPosition.z), 2));
     let childRadius = children[i].cmpTransform.local.scaling.x / 2
      if(distance < childRadius + childRadius){
        console.log("Spiel beendet");
        return true;
      }
      return false;
    }
  }

  function moveCamera(): void {
    let posCamera: ƒ.Vector3 = snake.head.mtxLocal.translation;
    posCamera.normalize(30);
    viewport.camera.pivot.translation = posCamera;
    viewport.camera.pivot.lookAt(ƒ.Vector3.ZERO());
  }


  function control(_event: KeyboardEvent): void {
    // let direction: ƒ.Vector3;
    // direction = ƒ.Keyboard.mapToValue(ƒ.Vector3.Y(), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.W]);
    // direction.add(ƒ.Keyboard.mapToValue(ƒ.Vector3.Y(-1), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.S]));

    // if (direction.y == 0) {
    //   direction = ƒ.Keyboard.mapToValue(ƒ.Vector3.X(), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.D]);
    //   direction.add(ƒ.Keyboard.mapToValue(ƒ.Vector3.X(-1), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.A]));
    // }

    // if (!direction.equals(ƒ.Vector3.ZERO()))
    //   snake.direction = direction;

    let rotation: ƒ.Vector3 = ƒ.Vector3.ZERO();

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
}