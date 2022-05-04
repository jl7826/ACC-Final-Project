import './style.scss';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as DAT from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let model = {
	activeView: 0,
	diamondParams:{
		stretchIn: 4.299615859985352,
		stretchOut: -4.299615859985352,
		stretchUp: 3,
		stretchDown: -3
	},
	envColors:{
		oceanColorOne: '#0081b8',
		oceanColorTwo: '#9ae0e5',
		fogColor: '#6a93a8'
	}
}

let renderer: THREE.WebGLRenderer;
let clock = new THREE.Clock();

let controls: OrbitControls;
let controlsTwo : OrbitControls;
let stats: any;

let animationOne: AnimationOne;
let animationTwo: AnimationTwo;

let views: Frame[] = [];
import { Frame } from './view/Frame';
import { AnimationOne } from './view/AnimationOne'
import { AnimationTwo } from './view/AnimationTwo';


let gui: DAT.GUI;

const loader = new GLTFLoader();

function main() {
	initScene();
	initStats();
	initGUI();
	initListeners();
}

function initStats() {
	stats = new (Stats as any)();
	document.body.appendChild(stats.dom);
}

function initGUI() {
	gui = new DAT.GUI();
	updateGUI()
}

function updateGUI() {

	console.log(gui.__folders);
	if (gui.__folders.animation1) {
		gui.removeFolder(gui.__folders.animation1);
		gui.removeFolder(gui.__folders.timeline);
	}

	if (gui.__folders.animation2) {
		gui.removeFolder(gui.__folders.animation2);
		gui.removeFolder(gui.__folders.timeline2);
	}

	switch (model.activeView) {
		case 0:
			const diamondControl = gui.addFolder('animation1');
			diamondControl.open()
			diamondControl
				.add(model.diamondParams, 'stretchIn').min(4.299616813659668).max(45).step(0.01)
				.onChange(()=>{animationOne.updateGui()})

			diamondControl
				.add(model.diamondParams, 'stretchOut').min(-45).max(-4.299616813659668).step(0.01)
				.onChange(()=>{animationOne.updateGui()})

			diamondControl
				.add(model.diamondParams, 'stretchUp').min(3).max(45).step(0.01)
				.onChange(()=>{animationOne.updateGui()})
				
			diamondControl
				.add(model.diamondParams, 'stretchDown').min(-45).max(-3).step(0.01)
				.onChange(()=>{animationOne.updateGui()})

			const tlControls = gui.addFolder('timeline')
			tlControls.open()
			tlControls.add(animationOne.tlSettings, "position").min(0).max(20).step(0.01).onChange((val)=>{
				animationOne.tl.pause()
				animationOne.tl.seek(val)
			}).name('Timeline')
			tlControls.add(animationOne.tlSettings, "play").name('Play')
			tlControls.add(animationOne.tlSettings, "pause").name('Pause')
			tlControls.add(animationOne.tlSettings, "restart").name('Restart')
			break;

		case 1:
			const animeTwoControls = gui.addFolder('animation2');
			animeTwoControls.open()

			const tlControls2 = gui.addFolder('timeline2')
			tlControls2.open()
			tlControls2.add(animationTwo.tlSettings, "position").min(0).max(20).step(0.01).onChange((val)=>{
				animationTwo.tl.pause()
				animationTwo.tl.seek(val)
			}).name('Timeline')
			tlControls2.add(animationTwo.tlSettings, "play").name('Play')
			tlControls2.add(animationTwo.tlSettings, "pause").name('Pause')
			tlControls2.add(animationTwo.tlSettings, "restart").name('Restart')
			break;
	
		default:
			break;
	}
}

function initScene() {

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('#262837')

	document.body.appendChild(renderer.domElement);

	animationOne = new AnimationOne(model, renderer);
	views.push(animationOne);

	animationTwo = new AnimationTwo(model, renderer);
	views.push(animationTwo);

	controls = new OrbitControls(animationOne.camera, renderer.domElement);
	controlsTwo = new OrbitControls(animationTwo.camera, renderer.domElement);

	// // Init animation
	animate();
}

function initListeners() {
	window.addEventListener('resize', onWindowResize, false);

	// window.addEventListener('pointermove', onPointerMove);

	window.addEventListener('keydown', (event) => {
		const { key } = event;
		console.log(key);

		switch (key) {
			case 'ArrowRight':
				model.activeView = (model.activeView + 1) % views.length
				updateGUI()
				break;

			case 'ArrowLeft':
				model.activeView = (model.activeView - 1)
				if (model.activeView < 0) {
					model.activeView = views.length - 1;
				}
				updateGUI()
				break;

			default:
				break;
		}
	});
}

function onWindowResize() {
	animationOne.onWindowResize();
}

// function onPointerMove(event: any) {
// 	model.pointerPosition.x = (event.clientX / window.innerWidth) * 2 - 1;
// 	model.pointerPosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
// }

function animate() {
	requestAnimationFrame(() => {
		animate();
	});

	let delta = clock.getDelta();

	switch (model.activeView) {
		case 0:
			animationOne.update(clock);
			break;

		case 1:
			animationTwo.update(clock);
			break;

		default:
			break;
	}
	
	if (stats) stats.update();

	if (controls) controls.update();
	if (controlsTwo) controlsTwo.update();

	renderer.render(views[model.activeView].scene, views[model.activeView].camera);
}

main();


interface MeshObj extends THREE.Object3D<THREE.Event> {
	material: THREE.MeshPhongMaterial;
}

interface gltfMesh extends THREE.Object3D<THREE.Event> {
	material: THREE.Material;
}

interface ColorMaterial extends THREE.Material {
	color: THREE.Color;
}
