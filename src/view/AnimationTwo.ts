import { BoxGeometry, Mesh, MeshBasicMaterial, WebGLRenderer, Color, SphereGeometry, Group } from "three"
import { Frame } from "./Frame"
import gsap from 'gsap';

export class AnimationTwo extends Frame {

	tl : any
	tlSettings : any

	constructor(model: any, renderer: WebGLRenderer) {
		super(model, renderer)

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
            '/resources/models/scene.gltf',
            (gltf) =>{

				this.environmentMapTexture = this.cubeTextureLoader.load([
					'./resources/textures/environmentMaps/4/px.png',
					'./resources/textures/environmentMaps/4/nx.png',
					'./resources/textures/environmentMaps/4/py.png',
					'./resources/textures/environmentMaps/4/ny.png',
					'./resources/textures/environmentMaps/4/pz.png',
					'./resources/textures/environmentMaps/4/nz.png',
				])
				this.scene.environment = this.environmentMapTexture
				
				// PYRAMIDS
				const pyramids = new Group()
				const pyramid : any = gltf.scene.children[1].children[0]
				pyramid.material = this.gltfMaterial
				pyramid.scale.set(0.1 * 6, 0.125 * 6, 0.1 * 6)
				
				const myPyramid = pyramid.clone()
				myPyramid.rotateZ(Math.PI)

				// Offset
				pyramid.position.y += 0.75

				pyramid.position.y += 0.8
				myPyramid.position.y -= 0.8

				pyramids.add(myPyramid)
				pyramids.add(pyramid)
				this.scene.add(pyramids)

				const trapezoid : any = gltf.scene.children[0].children[0]
				trapezoid.material = this.gltfMaterial
				trapezoid.scale.set(0.1 * 2, 0.08 * 2, 0.1 * 2)

				const myTrapezoid = trapezoid.clone()
				const myTrapezoid2 = trapezoid.clone()
				myTrapezoid.rotateZ(Math.PI)
				const myTrapezoid3 = myTrapezoid.clone()

				myTrapezoid.position.y = -0.1
				trapezoid.position.y += 0.75

				myTrapezoid2.position.y += 1
				myTrapezoid3.position.y = -0.5
				
				this.scene.add(myTrapezoid2)
				this.scene.add(myTrapezoid3)
				this.scene.add(myTrapezoid)
				this.scene.add(trapezoid)

				const diamond : any = gltf.scene.children[2].children[0]
				diamond.material = this.gltfMaterial
				diamond.scale.set(0.1 * 2, 0.125 * 0.5, 0.1 * 2)
				const diamond2 = diamond.clone()
				diamond2.position.y = 0.7
				const diamond3 = diamond2.clone()
				const diamond4 = diamond.clone()
				this.scene.add(diamond2)
				this.scene.add(diamond)
				this.scene.add(diamond3)
				this.scene.add(diamond4)

				this.tl.fromTo(trapezoid.scale, { x: 0, y: 0, z : 0 }, {x : 0.1 * 3, y: 0.08 * 3, z: 0.1 * 3, duration: 5, ease: 'expo.in'}, 1)
				this.tl.fromTo(myTrapezoid.scale, { x: 0, y: 0, z : 0 }, {x : 0.1 * 3, y: 0.08 * 3, z: 0.1 * 3, duration: 5, ease: 'expo.in'}, 1)
				this.tl.fromTo(myTrapezoid2.scale, { x: 0, y: 0, z : 0 }, {x : 0.1 * 4, y: 0.08 * 4, z: 0.1 * 4, duration: 5, ease: 'expo.in'}, 1)
				this.tl.fromTo(myTrapezoid3.scale, { x: 0, y: 0, z : 0 }, {x : 0.1 * 4, y: 0.08 * 4, z: 0.1 * 4, duration: 5, ease: 'expo.in'}, 1)

				this.tl.fromTo(diamond.scale, { x: 0, y: 0, z : 0 }, {x : 0.1 * 2, y: 0.125 * 0.5, z: 0.1 * 2, duration: 5, ease: 'expo.in'}, 1)
				this.tl.fromTo(diamond2.scale, { x: 0, y: 0, z : 0 }, {x : 0.1 * 2, y: 0.125 * 0.5, z: 0.1 * 2, duration: 5, ease: 'expo.in'}, 1)

				this.tl.fromTo(diamond3.scale, { x: 0, y: 0, z : 0 }, {x : 0.1 * 5, y: 0.125 * 2, z: 0.1 * 5, duration: 5, ease: 'expo.in'}, 1)
				this.tl.fromTo(diamond4.scale, { x: 0, y: 0, z : 0 }, {x : 0.1 * 5, y: 0.125 * 2, z: 0.1 * 5, duration: 5, ease: 'expo.in'}, 1)

				this.tl.fromTo(pyramid.rotation, {y:0}, {y:Math.PI * 8,duration: 8, ease: 'expo.in'}, 1)  
				this.tl.fromTo(myPyramid.rotation, {y:0}, {y:-Math.PI * 8,duration: 8, ease: 'expo.in'}, 1)
				this.tl.to(pyramid.position, {y : 4, duration: 5, ease: 'expo.in'}, 1)
				this.tl.to(myPyramid.position, {y : -4, duration: 5, ease: 'expo.in'}, 1)

				this.tl.fromTo(myTrapezoid2.rotation, {y:1}, {y:Math.PI * 8,duration: 8, ease: 'expo.in'}, 1)  
				this.tl.fromTo(myTrapezoid3.rotation, {y:3}, {y:Math.PI * 8,duration: 8, ease: 'expo.in'}, 1)
				this.tl.to(myTrapezoid2.position, {y : 2, duration: 5, ease: 'expo.in'}, 1)
				this.tl.to(myTrapezoid3.position, {y : -2, duration: 5, ease: 'expo.in'}, 1)

				this.tl.fromTo(trapezoid.rotation, {y:2}, {y:Math.PI * 8,duration: 8, ease: 'expo.in'}, 1)  
				this.tl.fromTo(myTrapezoid.rotation, {y:7}, {y:Math.PI * 8,duration: 8, ease: 'expo.in'}, 1)
				this.tl.to(trapezoid.position, {y : 1.5, duration: 5, ease: 'expo.in'}, 1)
				this.tl.to(myTrapezoid.position, {y : -1.5, duration: 5, ease: 'expo.in'}, 1)

				this.tl.fromTo(diamond.rotation, {y:6}, {y:Math.PI * 8,duration: 8, ease: 'expo.in'}, 1)  
				this.tl.fromTo(diamond2.rotation, {y:4}, {y:Math.PI * 8,duration: 8, ease: 'expo.in'}, 1)
				this.tl.to(diamond2.position, {y : 0.5, duration: 5, ease: 'expo.in'}, 1)
				this.tl.to(diamond.position, {y : -0.5, duration: 5, ease: 'expo.in'}, 1)
				this.tl.fromTo(diamond3.rotation, {y:6}, {y:Math.PI * 8,duration: 8, ease: 'expo.in'}, 1)  
				this.tl.fromTo(diamond4.rotation, {y:4}, {y:Math.PI * 8,duration: 8, ease: 'expo.in'}, 1)
				this.tl.to(diamond3.position, {y : 3, duration: 5, ease: 'expo.in'}, 1)
				this.tl.to(diamond4.position, {y : -3, duration: 5, ease: 'expo.in'}, 1)

				this.tl.fromTo(diamond.rotation, {y:6}, {y:Math.PI * 8,duration: 8}, 8)  
				this.tl.fromTo(diamond2.rotation, {y:4}, {y:Math.PI * 8,duration: 8}, 8)
				this.tl.fromTo(diamond3.rotation, {y:6}, {y:Math.PI * 8,duration: 8}, 8)  
				this.tl.fromTo(diamond4.rotation, {y:4}, {y:Math.PI * 8,duration: 8}, 8)

				this.tl.to(diamond.scale, {x: 0, y: 0 , z:0, duration: 3},8)
				this.tl.to(diamond2.scale, {x: 0, y: 0 , z:0, duration: 3},8)
				this.tl.to(diamond3.scale, {x: 0, y: 0 , z:0, duration: 3},8)
				this.tl.to(diamond4.scale, {x: 0, y: 0 , z:0, duration: 3},8)

				this.tl.to(diamond.position, {y: 0, duration: 3},8)
				this.tl.to(diamond2.position, {y: 0, duration: 3},8)
				this.tl.to(diamond3.position, {y: 0, duration: 3},8)
				this.tl.to(diamond4.position, {y: 0, duration: 3},8)

				this.tl.fromTo(trapezoid.rotation, {y:6}, {y:Math.PI * 8,duration: 8}, 8)  
				this.tl.fromTo(myTrapezoid.rotation, {y:4}, {y:Math.PI * 8,duration: 8}, 8)
				this.tl.fromTo(myTrapezoid2.rotation, {y:6}, {y:Math.PI * 8,duration: 8}, 8)  
				this.tl.fromTo(myTrapezoid3.rotation, {y:4}, {y:Math.PI * 8,duration: 8}, 8)

				this.tl.to(trapezoid.scale, {x: 0, y: 0 , z:0, duration: 3},8)
				this.tl.to(myTrapezoid.scale, {x: 0, y: 0 , z:0, duration: 3},8)
				this.tl.to(myTrapezoid2.scale, {x: 0, y: 0 , z:0, duration: 3},8)
				this.tl.to(myTrapezoid3.scale, {x: 0, y: 0 , z:0, duration: 3},8)

				this.tl.to(trapezoid.position, {y: 0, duration: 3},8)
				this.tl.to(myTrapezoid.position, {y: 0, duration: 3},8)
				this.tl.to(myTrapezoid2.position, {y: 0, duration: 3},8)
				this.tl.to(myTrapezoid3.position, {y: 0, duration: 3},8)

				this.tl.fromTo(pyramid.rotation, {y:0}, {y:Math.PI * 8,duration: 8}, 8)  
				this.tl.fromTo(myPyramid.rotation, {y:5}, {y:Math.PI * 8,duration: 8}, 8)
				this.tl.to(pyramid.position, {y : 1.2, duration: 5}, 8)
				this.tl.to(myPyramid.position, {y : -1.2, duration: 5}, 8)

				const sphere = new Mesh(
				    new SphereGeometry(0.09,16,16),
				    this.gltfMaterial.clone()
				)
				sphere.material.color = new Color('red')
				sphere.position.y = 0 
				this.scene.add(sphere)
			
			})

	}

	restartTl(){
		this.tl.restart()
	}

	//@ts-ignore
	update(clock: Clock): void {

		const time = clock.getElapsedTime()
		this.waterMaterial.uniforms.uTime.value = time
	}
}                                                                                                                                                                                                                                                                                                    