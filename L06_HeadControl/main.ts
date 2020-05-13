namespace L06_Snake3D_HeadControl {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  let cubeSize: number = 9;
  let graph: ƒ.Node = new ƒ.Node("Game");

  window.addEventListener("load", hndLoad);
  export let viewport: ƒ.Viewport;
  let snake: Snake;
  let cosys: ƒAid.NodeCoordinateSystem = new ƒAid.NodeCoordinateSystem("ControlSystem");
  ƒ.RenderManager.initialize(true);

  function hndLoad(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    ƒ.Debug.log(canvas);

    snake = new Snake();
    graph.addChild(snake);
    cosys.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(10))));
    // graph.addChild(cosys);

    let cube: ƒAid.Node = new ƒAid.Node(
      "Cube", ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(cubeSize)),
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

    spawnFood();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 5);
  }

  function update(_event: ƒ.Eventƒ): void {
    snake.move();
    if (isCollision()){
      alert("You lost the game");
      return;
    }
    eatFood();
    moveCamera();
    viewport.draw();
  }

  function isCollision() : boolean {
    let children: ƒ.Node[] = snake.getChildren();
    let mtxHeadPosition: ƒ.Vector3 = children [0].mtxLocal.translation;
    let distance : number;

    for (let i :number = 1; i<children.length; i++){
     distance = getDistance(children[i].mtxLocal.translation, mtxHeadPosition)
     
     if(distance < 0.01){
        return true;
      }
    }
    return false
  }

  function getDistance(p1: ƒ.Vector3, p2: ƒ.Vector3): number {
    return Math.sqrt(Math.pow((p1.x -p2.x), 2) // berechnung des radius 
    + Math.pow((p1.y -p2.y), 2)
    + Math.pow((p1.z -p2.z), 2));
  }

  function moveCamera(): void {
    let posCamera: ƒ.Vector3 = snake.head.mtxLocal.translation;
    posCamera.normalize(30);
    viewport.camera.pivot.translation = posCamera;
    viewport.camera.pivot.lookAt(ƒ.Vector3.ZERO());
  }
  
  function randomIntFromInterval(min : number , max : number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
    }
  
    function spawnFood() : void {
    let randX: number ;
    let randY: number ;
    let randZ: number ;
    let randQubeSide: number = Math.floor(Math.random() * 6); // Zahl von null - 6 wird dann abgerundet deswegen Zahl von 0-5
    let dimension: number = Math.round(cubeSize/2);
   
    //food kreiren
    let mesh: ƒ.MeshCube = new ƒ.MeshCube();
    let mtrSolidRed: ƒ.Material = new ƒ.Material("SolidRed", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("RED")));
    let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidRed);
    let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh); 
    cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.6));


    let food: ƒ.Node = new ƒ.Node("Food");
    food.addComponent(cmpMesh);
    food.addComponent(cmpMaterial);
    
    switch (randQubeSide) {
      case 0:
        randX = randomIntFromInterval(-5, 5); 
        randY = randomIntFromInterval(-5, 5); 
        randZ= dimension;
        break;
      
      case 1:
        randX = randomIntFromInterval(-5, 5); 
        randY = randomIntFromInterval(-5, 5); 
        randZ= -dimension;
        
        break;
      
      case 2:
        randX = randomIntFromInterval(-5, 5); 
        randY = dimension; 
        randZ= randomIntFromInterval(-5, 5);
        ;
        break;
      
      case 3:
        randX = randomIntFromInterval(-5, 5); 
        randY = -dimension;
        randZ= randomIntFromInterval(-5, 5); 
        ;
        break;
      
       case 4:
        randX = dimension; 
        randY = randomIntFromInterval(-5, 5); 
        randZ= randomIntFromInterval(-5, 5);
        ;
        break;
        
      case 5:
        randX =-dimension;
        randY = randomIntFromInterval(-5, 5); 
        randZ=  randomIntFromInterval(-5, 5); 
        ;
        break;
      
      default:
        //return;
    }
    food.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(randX, randY, randZ))));
    graph.addChild(food);
  }

  function eatFood() : boolean {
    let foodNode : ƒ.Node = graph.getChildrenByName("Food")[0];
    let distance : number = getDistance(snake.getChildren()[0].mtxLocal.translation, foodNode.mtxLocal.translation);
   
    if (distance < 0.01){
      graph.removeChild(foodNode);
      spawnFood();
      snake.createSegement(1);
     return true;

    }
    return false;


  }

  function control(_event: KeyboardEvent): void {

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