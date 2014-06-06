function Terrain(detail) {
  this.size = Math.pow(2, detail) + 1;
  this.max = this.size - 1;
  this.map = new Float32Array(this.size * this.size);
}
var colourBG = 0xEEEEEE;

$(function () {

	// Setting up the scene, camera and renderer -
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	var renderer = new THREE.WebGLRenderer();

	// Render details including the background colour (yes, I'm English, get over it) -
	renderer.setClearColor(colourBG);
	renderer.setSize(window.innerWidth, window.innerHeight);

	// Addng axes in, just to make this project look cooler than any that's come before it -
	var axes = new THREE.AxisHelper( 20 );
	scene.add(axes);

	// Setting up the plane object and hoping to alter the height map at some point -
	var planeGeometry = new THREE.PlaneGeometry(60,60,100,100);
	var planeMaterial = new THREE.MeshBasicMaterial(
		{color: 0xcccccc, wireframe: true}
	);
	var ground = new THREE.Mesh(planeGeometry,planeMaterial);
	ground.dynamic = true;
	ground.rotation.x=-0.5*Math.PI;
	ground.position.x = 15;
	ground.position.y = 0;
	ground.position.z = 0;
	ground.name = "Terrain";
	ground.geometry.vertices[0].z =10;
	for(i=0, il = ground.geometry.vertices.length; i< il; i++){
		ground.geometry.vertices[i].z = Math.floor((Math.random()*10) + 1);
	}
	scene.add(ground);
	//alterGround(ground);

	// Setting the position of the camera -
	camera.position.x = -30;
	camera.position.y = 40;
	camera.position.z = 30;
	camera.lookAt(scene.position);

	// Appending to html region -
	$("#three-region").append(renderer.domElement);

	// Render this sucker -
	renderer.render(scene, camera);
	console.log(ground);
	console.log(ground.geometry.vertices[0]);
});
