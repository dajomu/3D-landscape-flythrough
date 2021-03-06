function Terrain(detail) {
  this.size = Math.pow(2, detail) + 1;
  this.max = this.size - 1;
  this.map = new Float32Array(this.size * this.size);
}
var colourBG = 0xEEEEEE;

// These two variables dictate the animation -
var angularSpeed = 0.1; 
var lastTime = 0;

xTerrainSize = 100;
yTerrainSize = 100;
xHalfTerrainSize = xTerrainSize/2;
yHalfTerrainSize = yTerrainSize/2;

// This loads a keyboard listener object -
var keyboard = new THREEx.KeyboardState();

$(function () {

	// Setting up the scene, camera and renderer -
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	var renderer = new THREE.WebGLRenderer();

	controls = new THREE.TrackballControls( camera );

	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;

	controls.noZoom = false;
	controls.noPan = false;

	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

	controls.keys = [ 65, 83, 68 ];

	controls.addEventListener( 'change', render );

	function animate(){
		// update
		var time = (new Date()).getTime();
		var timeDiff = time - lastTime;
		var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
		//ground.rotation.z += angleChange;
		lastTime = time;

		controls.update();

		// render
		renderer.render(scene, camera);

		// request new frame
		requestAnimationFrame(function(){
		    animate();
		});
	}

	function render(){
		renderer.render( scene, camera );
	}

	// Render details including the background colour (yes, I'm English, get over it) -
	renderer.setClearColor(colourBG);
	renderer.setSize(window.innerWidth, window.innerHeight);

	updateVertices = function(x,y,i){
		var z = 0;
		//if(x === 0 && y ===0){z = Math.floor((Math.random()*3) + 1);}
		//z = 2*Math.floor(Math.sin(((x*x)+(y*y))/3));//Math.floor((Math.random()*2) + 1);
		z = 5*Math.sin(((x*x)+(y*y))/20);
		return z;
	}
	updateVerticesTerrain = function(x,y,i){
		var z = 0;
		//if(x === 0 && y ===0){z = Math.floor((Math.random()*3) + 1);}
		//z = 2*Math.floor(Math.sin(((x*x)+(y*y))/3));//Math.floor((Math.random()*2) + 1);
		//z = 5*Math.sin(((x*x)+(y*y))/20);
		z = planeGeometry.vertices[i].z;
		
		//if (i<200){console.log(x + "," + y + "," + i)};
		
		if(y === yHalfTerrainSize){
			if(x === -xHalfTerrainSize){
				z = Math.floor((Math.random()*5) + 1);
			}
			else{
				var oldZ = planeGeometry.vertices[i-1].z
				z = oldZ + ((Math.random()*6) -3);
			}
		}
		else if(x === -xHalfTerrainSize){
			var oldZ = planeGeometry.vertices[i-xTerrainSize -1].z;
			z = oldZ + ((Math.random()*6) -3);
			//console.log(i-xTerrainSize-1 + "," + z);
		}
		else{
			//var oldZ = planeGeometry.vertices[i-xTerrainSize -3].z;
			oldZ = (planeGeometry.vertices[i-xTerrainSize -2].z + planeGeometry.vertices[i-xTerrainSize -1].z + planeGeometry.vertices[i-1].z)/3
			z = oldZ + ((Math.random()*6) -3);
			//if (i<200){console.log(i-xTerrainSize-1 + "," + z)};
		}
		return z;
	}

	// Addng axes in, just to make this project look cooler than any that's come before it -
	var axes = new THREE.AxisHelper( 20 );
	scene.add(axes);

	// Setting up the plane object and hoping to alter the height map at some point -
	var planeGeometry = new THREE.PlaneGeometry(xTerrainSize,yTerrainSize,xTerrainSize,yTerrainSize);
	for(i=0, il = planeGeometry.vertices.length; i< il; i++){
		planeGeometry.vertices[i].z = updateVerticesTerrain(planeGeometry.vertices[i].x,planeGeometry.vertices[i].y, i);
	}
	console.log(planeGeometry);
	var planeMaterial1 = new THREE.MeshLambertMaterial(
		{color: 0xcccccc}
	);
	var planeMaterial2 = new THREE.MeshBasicMaterial(
		{color: 0x000000, wireframe: true}
	);
	var planeMaterial = [planeMaterial1, planeMaterial2 ];
	
	// Add lights
	//var ambientLight = new THREE.AmbientLight(0xdddddd);
    //scene.add(ambientLight);
	
	var directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(1, 1, 1).normalize();
      scene.add(directionalLight);
	
	var ground = THREE.SceneUtils.createMultiMaterialObject(planeGeometry.clone(), planeMaterial);
	ground.dynamic = true;
	ground.rotation.x=-0.5*Math.PI;
	ground.position.x = 15;
	ground.position.y = 0;
	ground.position.z = 0;
	ground.name = "Terrain";
	ground.castShadow = true;
	ground.receiveShadow = true;
	//ground.geometry.vertices[0].z =10;
	/*for(i=0, il = ground.geometry.vertices.length; i< il; i++){
		ground.geometry.vertices[i].z = updateVertices(ground.geometry.vertices[i].x,ground.geometry.vertices[i].y);
	}*/
	scene.add(ground);
	//alterGround(ground);

	// Setting the position of the camera -
	camera.position.x = -60;
	camera.position.y = 80;
	camera.position.z = 60;
	camera.lookAt(scene.position);

	// Appending to html region -
	$("#three-region").append(renderer.domElement);

	// Render this sucker -
	renderer.render(scene, camera);
	console.log(ground);
	animate();
	//console.log(ground.geometry.vertices[0]);
});
