import {
	WebGLRenderer,
	Clock,
	AmbientLight,
	MeshStandardMaterial,
	Mesh,
	AxesHelper,
	Scene,
	Group
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Frame } from "./Frame";
import gsap from 'gsap';

export class AnimationOne extends Frame{

	smallDiamonds : any
	smallDiamonds2 : any
	smallDiamonds3: any
	faceInArr : any
	faceOutArr : any
	faceDownArr : any
	faceUpArr : any
	tlSettings : any
	tl : any
	tlParam : any
	diaGroup : Group

	constructor(model: any, renderer: WebGLRenderer){
		super(model, renderer);

		this.environmentMapTexture = this.cubeTextureLoader.load([
			'./resources/textures/environmentMaps/4/px.png',
			'./resources/textures/environmentMaps/4/nx.png',
			'./resources/textures/environmentMaps/4/py.png',
			'./resources/textures/environmentMaps/4/ny.png',
			'./resources/textures/environmentMaps/4/pz.png',
			'./resources/textures/environmentMaps/4/nz.png',
		])
		// this.scene.background = this.environmentMapTexture
		this.scene.environment = this.environmentMapTexture

		this.smallDiamonds = []
		this.smallDiamonds2 = []
		this.smallDiamonds3 = []
		this.faceInArr = []
		this.faceOutArr = []
		this.faceDownArr = []
		this.faceUpArr = []
		this.tlSettings = {}

		this.diaGroup = new Group()

		this.tl = gsap.timeline()

		this.tlSettings = {
			position: 0,
			play: () => { this.tl.play() },
			pause: () => { this.tl.pause() },
			restart: () => 
			{
				this.tl.pause()
				this.tl.seek(0)
				this.tl.play()
			}
		}

        this.gltfLoader.load(
            './resources/models/scene.gltf',
            (gltf) =>
            {


				const diamond : any = gltf.scene.children[2].children[0]
				diamond.material = this.gltfMaterial
		
				const faceIn = {
					x: 9.999999974752427e-7,
					y: 0,
					z: 4.299615859985352
				}

				const faceOut = {
					x: 0,
					y: 0,
					z: -4.299615859985352
				}
		
				const faceDown = {
					x: 0,
					y: -3,
					z: -9.999999974752427e-7
				}
		
				const faceUp = {
					x: 9.999999974752427e-7,
					y: 3,
					z: 0
				}
		
				for (let i = 0; i < 10; i++) {
					const smallDiaGeo = diamond.geometry.clone()
					const smallDiamond = new Mesh(smallDiaGeo,this.gltfMaterial)
					smallDiamond.scale.set(0, 0, 0)
					smallDiamond.position.x += Math.cos((i/10) * Math.PI * 2) * 1
					smallDiamond.position.z += Math.sin((i/10) * Math.PI * 2) * 1 
					smallDiamond.lookAt(diamond.position)
					this.diaGroup.add(smallDiamond)
		
					this.smallDiamonds.push(smallDiamond)
				}

				for (let i = 0; i < 10; i++) {
					const smallDiaGeo = diamond.geometry.clone()
					const smallDiamond = new Mesh(smallDiaGeo,this.gltfMaterial)
					smallDiamond.scale.set(0, 0, 0)
					smallDiamond.position.x += Math.cos((i/10) * Math.PI * 2) * 1
					smallDiamond.position.z += Math.sin((i/10) * Math.PI * 2) * 1 
					smallDiamond.lookAt(diamond.position)
					this.diaGroup.add(smallDiamond)
		
					this.smallDiamonds2.push(smallDiamond)
				}

				for (let i = 0; i < 10; i++) {
					const smallDiaGeo = diamond.geometry.clone()
					const smallDiamond = new Mesh(smallDiaGeo,this.gltfMaterial)
					smallDiamond.scale.set(0, 0, 0)
					smallDiamond.position.x += Math.cos((i/10) * Math.PI * 2) * 12
					smallDiamond.position.z += Math.sin((i/10) * Math.PI * 2) * 12
					smallDiamond.lookAt(diamond.position)
					this.diaGroup.add(smallDiamond)
		
					this.smallDiamonds3.push(smallDiamond)
				}
		
				const testArr = this.smallDiamonds[0].geometry.attributes.position.array
				for (let i = 0; i < testArr.length; i++){
					if (testArr[i] === faceIn.x && testArr[i+1] === faceIn.y && testArr[i+2] === faceIn.z){
						this.faceInArr.push(i)
					}
				}

				for (let i = 0; i < testArr.length; i++){
					if (testArr[i] === faceOut.x && testArr[i+1] === faceOut.y && testArr[i+2] === faceOut.z){
						this.faceOutArr.push(i)
					}
				}

				for (let i = 0; i < testArr.length; i++){
					if (testArr[i] === faceUp.x && testArr[i+1] === faceUp.y && testArr[i+2] === faceUp.z){
						this.faceUpArr.push(i)
					}
				}

				for (let i = 0; i < testArr.length; i++){
					if (testArr[i] === faceDown.x && testArr[i+1] === faceDown.y && testArr[i+2] === faceDown.z){
						this.faceDownArr.push(i)
					}
				}

				diamond.scale.set(0.1 * 8, 0.125 * 8, 0.1 * 8)
       			this.scene.add(diamond)

				this.scene.add(this.diaGroup)

				this.tlParam = 
				{
					stretchIn : 4.299615859985352
				}

				this.tl.to(this.diaGroup.rotation, { y: Math.PI * 6, duration: 18 }, 0)
					   
				this.tl.to(diamond.scale,  {x:0.1, z: 0.1 ,duration: 2, ease: 'expo.out'}, 0.5) 

				for (let i = 0; i < this.smallDiamonds.length; i++) {
					this.tl.to(this.smallDiamonds[i].scale, {
						x: 0.1,
						y: 0.125,
						z: 0.1,
						duration: 3,
						ease: 'expo.out'
					}, '<')

					this.tl.to(this.smallDiamonds[i].position, { 
						x: Math.cos((i/10) * Math.PI * 2) * 7,
						z: Math.sin((i/10) * Math.PI * 2) * 7,
						duration: 3,
						ease: 'expo.out'
					}, '<')
				}

				for (let i = 0; i < this.smallDiamonds2.length; i++) {
					this.tl.to(this.smallDiamonds2[i].scale, {
						x: 0.1 * 1.5,
						y: 0.125 * 1.5,
						z: 0.1 * 1.5,
						duration: 3,
						ease: 'expo.out'
					}, '<')

					this.tl.to(this.smallDiamonds2[i].position, { 
						x: Math.cos((i/10) * Math.PI * 2) * 8.2,
						z: Math.sin((i/10) * Math.PI * 2) * 8.2,
						duration: 3,
						ease: 'expo.out'
					}, '<')
				}

				for (let i = 0; i < this.smallDiamonds2.length; i++) {
					this.tl.to(this.smallDiamonds2[i].scale, {
						x: 0,
						y: 0,
						z: 0,
						duration: 2,
						ease: 'expo.out'
					}, 3)
				}

				this.tl.to(diamond.scale, {y:0.125 ,duration: 1}, 3) 

				this.tl.to(this.model.diamondParams, {
					stretchOut: -45, 
					duration: 1, 
					ease: 'expo.out',
					onUpdate: () => {this.updateGui()}
				}, 4)

				for (let i = 0; i < this.smallDiamonds3.length; i++) {
					this.tl.to(this.smallDiamonds3[i].scale, {
						x: 0.1 * 1.5,
						y: 0.125 * 1.5,
						z: 0.1 * 1.5,
						duration: 3,
						ease: 'expo.out'
					}, 5)
				}

				for (let i = 0; i < this.smallDiamonds.length; i++) {
					this.tl.to(this.smallDiamonds[i].position, { 
						x: Math.cos((i/10) * Math.PI * 2) * 12,
						z: Math.sin((i/10) * Math.PI * 2) * 12,
						duration: 3,
						ease: 'expo.out'
					}, 6)
				}

				this.tl.to(this.model.diamondParams, {
					stretchOut: -4.299615859985352, 
					duration: 1, 
					ease: 'expo.out',
					onUpdate: () => {this.updateGui()}
				}, 6)

				this.tl.to(this.model.diamondParams, {
					stretchIn: 50, 
					duration: 1, 
					ease: 'expo.out',
					onUpdate: () => {this.updateGui()}
				}, 7)

				for (let i = 0; i < this.smallDiamonds.length; i++) {
					this.tl.to(this.smallDiamonds[i].position, { 
						x: Math.cos((i/10) * Math.PI * 2) * 6,
						z: Math.sin((i/10) * Math.PI * 2) * 6,
						duration: 3,
						ease: 'expo.out'
					}, 7)
				}

				for (let i = 0; i < this.smallDiamonds3.length; i++) {
					this.tl.to(this.smallDiamonds3[i].scale, {
						x: 0,
						y: 0,
						z: 0,
						duration: 3,
						ease: 'expo.out'
					}, 7)
				}

				for (let i = 0; i < this.smallDiamonds.length; i++) {
					this.tl.to(this.smallDiamonds[i].position, { 
						x: Math.cos((i/10) * Math.PI * 2) * 1,
						z: Math.sin((i/10) * Math.PI * 2) * 1,
						duration: 3,
						ease: 'expo.out'
					}, 8)
				}

				this.tl.to(this.model.diamondParams, {
					stretchOut: -50, 
					duration: 1, 
					ease: 'expo.out',
					onUpdate: () => {this.updateGui()}
				}, 8)

				this.tl.to(this.model.diamondParams, {
					stretchUp: 1, 
					duration: 2, 
					ease: 'expo.out',
					onUpdate: () => {this.updateGui()}
				}, 10)

				this.tl.to(this.model.diamondParams, {
					stretchDown: -1, 
					duration: 2, 
					ease: 'expo.out',
					onUpdate: () => {this.updateGui()}
				}, 10)

				for (let i = 0; i < this.smallDiamonds3.length; i++) {
					this.tl.to(this.smallDiamonds3[i].position, { 
						x: Math.cos((i/10) * Math.PI * 2) * 8,
						z: Math.sin((i/10) * Math.PI * 2) * 8,
						duration: 0.5,
						ease: 'expo.out'
					}, 11)
				}

				for (let i = 0; i < this.smallDiamonds3.length; i++) {
					this.tl.to(this.smallDiamonds3[i].scale, {
						x: 0.1,
						y: 0.125,
						z: 0.1,
						duration:1 ,
						ease: 'expo.out'
					}, 12)
				}

				for (let i = 0; i < this.smallDiamonds3.length; i++) {
					this.tl.to(this.smallDiamonds3[i].position, { 
						x: Math.cos((i/10) * Math.PI * 2) * 3,
						z: Math.sin((i/10) * Math.PI * 2) * 3,
						duration: 0.5,
						ease: 'expo.out'
					}, 12)
				}

				for (let i = 0; i < this.smallDiamonds.length; i++) {
					this.tl.to(this.smallDiamonds[i].position, { 
						x: Math.cos((i/10) * Math.PI * 2) * 9,
						z: Math.sin((i/10) * Math.PI * 2) * 9,
						duration: 0.5,
						ease: 'expo.out'
					}, 12)
				}

				this.tl.to(this.model.diamondParams, {
					stretchIn: 4.299615859985352, 
					duration: 1, 
					ease: 'expo.out',
					onUpdate: () => {this.updateGui()}
				}, 12)

				this.tl.to(this.model.diamondParams, {
					stretchOut: -4.299615859985352, 
					duration: 1, 
					ease: 'expo.out',
					onUpdate: () => {this.updateGui()}
				}, 12)

				this.tl.to(this.model.diamondParams, {
					stretchUp: 3, 
					duration: 2, 
					ease: 'expo.out',
					onUpdate: () => {this.updateGui()}
				}, 12)

				this.tl.to(this.model.diamondParams, {
					stretchDown: -3, 
					duration: 2, 
					ease: 'expo.out',
					onUpdate: () => {this.updateGui()}
				}, 12)

				this.tl.to(this.model.diamondParams, {
					stretchUp: 35, 
					duration: 2, 
					ease: 'expo.out',
					onUpdate: () => {this.updateGui()}
				}, 13)

				this.tl.to(this.model.diamondParams, {
					stretchDown: -35, 
					duration: 2, 
					ease: 'expo.out',
					onUpdate: () => {this.updateGui()}
				}, 14)

				this.tl.to(this.model.diamondParams, {
					stretchUp: 3, 
					duration: 2, 
					ease: 'expo.out',
					onUpdate: () => {this.updateGui()}
				}, 15)

				this.tl.to(this.model.diamondParams, {
					stretchDown: -3, 
					duration: 2, 
					ease: 'expo.out',
					onUpdate: () => {this.updateGui()}
				}, 16)



				for (let i = 0; i < this.smallDiamonds.length; i++) {
					this.tl.to(this.smallDiamonds[i].scale, {
						x: 0,
						y: 0,
						z: 0,
						duration:1 ,
						ease: 'expo.out'
					}, 17)
				}

				for (let i = 0; i < this.smallDiamonds3.length; i++) {
					this.tl.to(this.smallDiamonds3[i].scale, {
						x: 0,
						y: 0,
						z: 0,
						duration:1 ,
						ease: 'expo.out'
					}, 17)
				}
	
				this.tl.to(diamond.scale,  {x:0.1 * 8, y: 0.125 * 8, z: 0.1 * 8 ,duration: 2, ease: 'expo.out'}, 17) 
            })

		
		// Lights
		const ambientLight = new AmbientLight(0xffffff, 1)
		this.scene.add(ambientLight)

	}

	update(clock: Clock): void {
		const time = clock.getElapsedTime()

		// this.diaGroup.rotation.y += 0.01
		this.waterMaterial.uniforms.uTime.value = time

	}

	restartTl(){
		this.tl.restart()
	}

	updateGui(){
		// @ts-expect-error
		this.smallDiamonds.forEach(smallDiamond => {
			// @ts-expect-error
			this.faceInArr.forEach(xCoordinate=> {
				smallDiamond.geometry.attributes.position.array[xCoordinate + 2] = this.model.diamondParams.stretchIn
			})
			smallDiamond.geometry.attributes.position.needsUpdate = true
		});

		// @ts-expect-error
		this.smallDiamonds.forEach(smallDiamond => {
			// @ts-expect-error
			this.faceOutArr.forEach(xCoordinate=> {
				smallDiamond.geometry.attributes.position.array[xCoordinate + 2] = this.model.diamondParams.stretchOut
			})
			smallDiamond.geometry.attributes.position.needsUpdate = true
		});


		// @ts-expect-error
		this.smallDiamonds.forEach(smallDiamond => {
			// @ts-expect-error
			this.faceUpArr.forEach(xCoordinate=> {
				smallDiamond.geometry.attributes.position.array[xCoordinate + 1] = this.model.diamondParams.stretchUp
			})
			smallDiamond.geometry.attributes.position.needsUpdate = true
		});


		// @ts-expect-error
		this.smallDiamonds.forEach(smallDiamond => {
			// @ts-expect-error
			this.faceDownArr.forEach(xCoordinate=> {
				smallDiamond.geometry.attributes.position.array[xCoordinate + 1] = this.model.diamondParams.stretchDown
			})
			smallDiamond.geometry.attributes.position.needsUpdate = true
		});
	}
}