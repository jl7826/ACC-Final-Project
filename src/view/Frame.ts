import { Clock, CubeTextureLoader, MeshStandardMaterial, PerspectiveCamera, Scene, WebGLRenderer, PlaneGeometry, Vector2, Color, Mesh, Fog, UniformsUtils, UniformsLib, AmbientLight } from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import vertexShader from '../../resources/shaders/shader.vert?raw';
import fragmentShader from '../../resources/shaders/shader.frag?raw';
import { ShaderMaterial } from 'three';

export class Frame {

	scene: Scene;
	camera: PerspectiveCamera;
	renderer: WebGLRenderer;
	cubeTextureLoader: CubeTextureLoader;
	environmentMapTexture: any;
	gltfLoader: GLTFLoader;

	model: any;

	gltfMaterial : MeshStandardMaterial
	waterMaterial : ShaderMaterial

	constructor(model: any, renderer: WebGLRenderer) {

		this.scene = new Scene();

		this.scene.fog = new Fog( '#262837', 10, 50 );

		this.cubeTextureLoader = new CubeTextureLoader()
		this.gltfLoader = new GLTFLoader()

		this.gltfMaterial = new MeshStandardMaterial({
			color: "#b15dea",
			metalness: 0.7,
			roughness: 0.05
		})

		const waterGeometry = new PlaneGeometry(100, 100, 512, 512)

		this.waterMaterial = new ShaderMaterial({
			uniforms: UniformsUtils.merge([
				UniformsLib[ 'fog' ],
				{
					// we need to control the time when animating the waves
					uTime: {value: 0},
					uElevation: { value : 0.6 },
					uFrequency: { value : new Vector2(0.2, 0.6) },
					uColor1 : { value: new Color('#0081b8')},
					uColor2 : { value: new Color('#9ae0e5')}
				}
			]),
			vertexShader : vertexShader,
			fragmentShader : fragmentShader,
			fog: true
		})

		const water = new Mesh(waterGeometry, this.waterMaterial)
		water.rotation.x = - Math.PI * 0.5
		water.position.y -= 5
		this.scene.add(water)

		// Lights
		const ambientLight = new AmbientLight(0xffffff, 1)
		this.scene.add(ambientLight)

		this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight,0.1, 1000);
		this.camera.position.x = 6.806689642189527
		this.camera.position.y = 2.113939267592109
		this.camera.position.z = 2.515051595867642
		this.camera.rotateX(-1.156588906217377)
		this.camera.rotateY(0.9212520435389125)
		this.camera.rotateZ(1.0663686948479207)
		this.renderer = renderer;
		this.model = model;
		
	}

	//@ts-ignore
	update(clock: Clock): void {
		const time = clock.getElapsedTime()
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}