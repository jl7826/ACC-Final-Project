var O=Object.defineProperty;var k=(l,e,a)=>e in l?O(l,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):l[e]=a;var r=(l,e,a)=>(k(l,typeof e!="symbol"?e+"":e,a),a);import{S as V,F as W,C as q,G as _,M as R,P as j,a as H,U as N,b as Z,V as K,c as D,d as w,A as C,e as X,f as S,g as A,h as Y,i as $,j as B,W as J,O as E,k as Q}from"./vendor.1423bf1b.js";const tt=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))d(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const u of o.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&d(u)}).observe(document,{childList:!0,subtree:!0});function a(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerpolicy&&(o.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?o.credentials="include":i.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function d(i){if(i.ep)return;i.ep=!0;const o=a(i);fetch(i.href,o)}};tt();var et=`uniform float uElevation;
uniform vec2 uFrequency;
uniform float uTime;
varying float vElevation;

#include <fog_pars_vertex>

// Classic Perlin 3D Noise 
// by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}
vec3 fade(vec3 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
}
// -------------------
void main()
{

    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Where manipulation happens
    // Elevation based on x value * height controlled by elevation uniform
    float elevation =  sin(modelPosition.x * uFrequency.x) * uElevation * 
                        sin(modelPosition.z * uFrequency.y) * uElevation;
 
    elevation -= abs(cnoise(vec3(modelPosition.x * 0.2, modelPosition.z * 0.2, uTime))) * 0.5;

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Varyings
    // Sending things from vertex to frag
    vElevation = elevation;
}`,ot=`uniform vec3 uColor1;
uniform vec3 uColor2;
#include <fog_pars_fragment>

varying float vElevation;

void main()
{
    float strength = (vElevation + 0.3) * 1.7;
    vec3 color = mix(uColor1, uColor2, strength);
    gl_FragColor = vec4(color, 1.0);
    #include <fog_fragment>
}`;class L{constructor(e,a){r(this,"scene");r(this,"camera");r(this,"renderer");r(this,"cubeTextureLoader");r(this,"environmentMapTexture");r(this,"gltfLoader");r(this,"model");r(this,"gltfMaterial");r(this,"waterMaterial");this.scene=new V,this.scene.fog=new W("#262837",10,50),this.cubeTextureLoader=new q,this.gltfLoader=new _,this.gltfMaterial=new R({color:"#b15dea",metalness:.7,roughness:.05});const d=new j(100,100,512,512);this.waterMaterial=new H({uniforms:N.merge([Z.fog,{uTime:{value:0},uElevation:{value:.6},uFrequency:{value:new K(.2,.6)},uColor1:{value:new D("#0081b8")},uColor2:{value:new D("#9ae0e5")}}]),vertexShader:et,fragmentShader:ot,fog:!0});const i=new w(d,this.waterMaterial);i.rotation.x=-Math.PI*.5,i.position.y-=5,this.scene.add(i);const o=new C(16777215,1);this.scene.add(o),this.camera=new X(75,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.x=6.806689642189527,this.camera.position.y=2.113939267592109,this.camera.position.z=2.515051595867642,this.camera.rotateX(-1.156588906217377),this.camera.rotateY(.9212520435389125),this.camera.rotateZ(1.0663686948479207),this.renderer=a,this.model=e}update(e){e.getElapsedTime()}onWindowResize(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)}}class it extends L{constructor(e,a){super(e,a);r(this,"smallDiamonds");r(this,"smallDiamonds2");r(this,"smallDiamonds3");r(this,"faceInArr");r(this,"faceOutArr");r(this,"faceDownArr");r(this,"faceUpArr");r(this,"tlSettings");r(this,"tl");r(this,"tlParam");r(this,"diaGroup");this.environmentMapTexture=this.cubeTextureLoader.load(["./resources/textures/environmentMaps/4/px.png","./resources/textures/environmentMaps/4/nx.png","./resources/textures/environmentMaps/4/py.png","./resources/textures/environmentMaps/4/ny.png","./resources/textures/environmentMaps/4/pz.png","./resources/textures/environmentMaps/4/nz.png"]),this.scene.environment=this.environmentMapTexture,this.smallDiamonds=[],this.smallDiamonds2=[],this.smallDiamonds3=[],this.faceInArr=[],this.faceOutArr=[],this.faceDownArr=[],this.faceUpArr=[],this.tlSettings={},this.diaGroup=new S,this.tl=A.timeline(),this.tlSettings={position:0,play:()=>{this.tl.play()},pause:()=>{this.tl.pause()},restart:()=>{this.tl.pause(),this.tl.seek(0),this.tl.play()}},this.gltfLoader.load("./resources/models/scene.gltf",i=>{const o=i.scene.children[2].children[0];o.material=this.gltfMaterial;const u={x:9999999974752427e-22,y:0,z:4.299615859985352},h={x:0,y:0,z:-4.299615859985352},x={x:0,y:-3,z:-9999999974752427e-22},f={x:9999999974752427e-22,y:3,z:0};for(let t=0;t<10;t++){const p=o.geometry.clone(),n=new w(p,this.gltfMaterial);n.scale.set(0,0,0),n.position.x+=Math.cos(t/10*Math.PI*2)*1,n.position.z+=Math.sin(t/10*Math.PI*2)*1,n.lookAt(o.position),this.diaGroup.add(n),this.smallDiamonds.push(n)}for(let t=0;t<10;t++){const p=o.geometry.clone(),n=new w(p,this.gltfMaterial);n.scale.set(0,0,0),n.position.x+=Math.cos(t/10*Math.PI*2)*1,n.position.z+=Math.sin(t/10*Math.PI*2)*1,n.lookAt(o.position),this.diaGroup.add(n),this.smallDiamonds2.push(n)}for(let t=0;t<10;t++){const p=o.geometry.clone(),n=new w(p,this.gltfMaterial);n.scale.set(0,0,0),n.position.x+=Math.cos(t/10*Math.PI*2)*12,n.position.z+=Math.sin(t/10*Math.PI*2)*12,n.lookAt(o.position),this.diaGroup.add(n),this.smallDiamonds3.push(n)}const s=this.smallDiamonds[0].geometry.attributes.position.array;for(let t=0;t<s.length;t++)s[t]===u.x&&s[t+1]===u.y&&s[t+2]===u.z&&this.faceInArr.push(t);for(let t=0;t<s.length;t++)s[t]===h.x&&s[t+1]===h.y&&s[t+2]===h.z&&this.faceOutArr.push(t);for(let t=0;t<s.length;t++)s[t]===f.x&&s[t+1]===f.y&&s[t+2]===f.z&&this.faceUpArr.push(t);for(let t=0;t<s.length;t++)s[t]===x.x&&s[t+1]===x.y&&s[t+2]===x.z&&this.faceDownArr.push(t);o.scale.set(.1*8,.125*8,.1*8),this.scene.add(o),this.scene.add(this.diaGroup),this.tlParam={stretchIn:4.299615859985352},this.tl.to(this.diaGroup.rotation,{y:Math.PI*6,duration:18},0),this.tl.to(o.scale,{x:.1,z:.1,duration:2,ease:"expo.out"},.5);for(let t=0;t<this.smallDiamonds.length;t++)this.tl.to(this.smallDiamonds[t].scale,{x:.1,y:.125,z:.1,duration:3,ease:"expo.out"},"<"),this.tl.to(this.smallDiamonds[t].position,{x:Math.cos(t/10*Math.PI*2)*7,z:Math.sin(t/10*Math.PI*2)*7,duration:3,ease:"expo.out"},"<");for(let t=0;t<this.smallDiamonds2.length;t++)this.tl.to(this.smallDiamonds2[t].scale,{x:.1*1.5,y:.125*1.5,z:.1*1.5,duration:3,ease:"expo.out"},"<"),this.tl.to(this.smallDiamonds2[t].position,{x:Math.cos(t/10*Math.PI*2)*8.2,z:Math.sin(t/10*Math.PI*2)*8.2,duration:3,ease:"expo.out"},"<");for(let t=0;t<this.smallDiamonds2.length;t++)this.tl.to(this.smallDiamonds2[t].scale,{x:0,y:0,z:0,duration:2,ease:"expo.out"},3);this.tl.to(o.scale,{y:.125,duration:1},3),this.tl.to(this.model.diamondParams,{stretchOut:-45,duration:1,ease:"expo.out",onUpdate:()=>{this.updateGui()}},4);for(let t=0;t<this.smallDiamonds3.length;t++)this.tl.to(this.smallDiamonds3[t].scale,{x:.1*1.5,y:.125*1.5,z:.1*1.5,duration:3,ease:"expo.out"},5);for(let t=0;t<this.smallDiamonds.length;t++)this.tl.to(this.smallDiamonds[t].position,{x:Math.cos(t/10*Math.PI*2)*12,z:Math.sin(t/10*Math.PI*2)*12,duration:3,ease:"expo.out"},6);this.tl.to(this.model.diamondParams,{stretchOut:-4.299615859985352,duration:1,ease:"expo.out",onUpdate:()=>{this.updateGui()}},6),this.tl.to(this.model.diamondParams,{stretchIn:50,duration:1,ease:"expo.out",onUpdate:()=>{this.updateGui()}},7);for(let t=0;t<this.smallDiamonds.length;t++)this.tl.to(this.smallDiamonds[t].position,{x:Math.cos(t/10*Math.PI*2)*6,z:Math.sin(t/10*Math.PI*2)*6,duration:3,ease:"expo.out"},7);for(let t=0;t<this.smallDiamonds3.length;t++)this.tl.to(this.smallDiamonds3[t].scale,{x:0,y:0,z:0,duration:3,ease:"expo.out"},7);for(let t=0;t<this.smallDiamonds.length;t++)this.tl.to(this.smallDiamonds[t].position,{x:Math.cos(t/10*Math.PI*2)*1,z:Math.sin(t/10*Math.PI*2)*1,duration:3,ease:"expo.out"},8);this.tl.to(this.model.diamondParams,{stretchOut:-50,duration:1,ease:"expo.out",onUpdate:()=>{this.updateGui()}},8),this.tl.to(this.model.diamondParams,{stretchUp:1,duration:2,ease:"expo.out",onUpdate:()=>{this.updateGui()}},10),this.tl.to(this.model.diamondParams,{stretchDown:-1,duration:2,ease:"expo.out",onUpdate:()=>{this.updateGui()}},10);for(let t=0;t<this.smallDiamonds3.length;t++)this.tl.to(this.smallDiamonds3[t].position,{x:Math.cos(t/10*Math.PI*2)*8,z:Math.sin(t/10*Math.PI*2)*8,duration:.5,ease:"expo.out"},11);for(let t=0;t<this.smallDiamonds3.length;t++)this.tl.to(this.smallDiamonds3[t].scale,{x:.1,y:.125,z:.1,duration:1,ease:"expo.out"},12);for(let t=0;t<this.smallDiamonds3.length;t++)this.tl.to(this.smallDiamonds3[t].position,{x:Math.cos(t/10*Math.PI*2)*3,z:Math.sin(t/10*Math.PI*2)*3,duration:.5,ease:"expo.out"},12);for(let t=0;t<this.smallDiamonds.length;t++)this.tl.to(this.smallDiamonds[t].position,{x:Math.cos(t/10*Math.PI*2)*9,z:Math.sin(t/10*Math.PI*2)*9,duration:.5,ease:"expo.out"},12);this.tl.to(this.model.diamondParams,{stretchIn:4.299615859985352,duration:1,ease:"expo.out",onUpdate:()=>{this.updateGui()}},12),this.tl.to(this.model.diamondParams,{stretchOut:-4.299615859985352,duration:1,ease:"expo.out",onUpdate:()=>{this.updateGui()}},12),this.tl.to(this.model.diamondParams,{stretchUp:3,duration:2,ease:"expo.out",onUpdate:()=>{this.updateGui()}},12),this.tl.to(this.model.diamondParams,{stretchDown:-3,duration:2,ease:"expo.out",onUpdate:()=>{this.updateGui()}},12),this.tl.to(this.model.diamondParams,{stretchUp:35,duration:2,ease:"expo.out",onUpdate:()=>{this.updateGui()}},13),this.tl.to(this.model.diamondParams,{stretchDown:-35,duration:2,ease:"expo.out",onUpdate:()=>{this.updateGui()}},14),this.tl.to(this.model.diamondParams,{stretchUp:3,duration:2,ease:"expo.out",onUpdate:()=>{this.updateGui()}},15),this.tl.to(this.model.diamondParams,{stretchDown:-3,duration:2,ease:"expo.out",onUpdate:()=>{this.updateGui()}},16);for(let t=0;t<this.smallDiamonds.length;t++)this.tl.to(this.smallDiamonds[t].scale,{x:0,y:0,z:0,duration:1,ease:"expo.out"},17);for(let t=0;t<this.smallDiamonds3.length;t++)this.tl.to(this.smallDiamonds3[t].scale,{x:0,y:0,z:0,duration:1,ease:"expo.out"},17);this.tl.to(o.scale,{x:.1*8,y:.125*8,z:.1*8,duration:2,ease:"expo.out"},17)});const d=new C(16777215,1);this.scene.add(d)}update(e){const a=e.getElapsedTime();this.waterMaterial.uniforms.uTime.value=a}restartTl(){this.tl.restart()}updateGui(){this.smallDiamonds.forEach(e=>{this.faceInArr.forEach(a=>{e.geometry.attributes.position.array[a+2]=this.model.diamondParams.stretchIn}),e.geometry.attributes.position.needsUpdate=!0}),this.smallDiamonds.forEach(e=>{this.faceOutArr.forEach(a=>{e.geometry.attributes.position.array[a+2]=this.model.diamondParams.stretchOut}),e.geometry.attributes.position.needsUpdate=!0}),this.smallDiamonds.forEach(e=>{this.faceUpArr.forEach(a=>{e.geometry.attributes.position.array[a+1]=this.model.diamondParams.stretchUp}),e.geometry.attributes.position.needsUpdate=!0}),this.smallDiamonds.forEach(e=>{this.faceDownArr.forEach(a=>{e.geometry.attributes.position.array[a+1]=this.model.diamondParams.stretchDown}),e.geometry.attributes.position.needsUpdate=!0})}}class nt extends L{constructor(e,a){super(e,a);r(this,"tl");r(this,"tlSettings");this.environmentMapTexture=this.cubeTextureLoader.load(["./resources/textures/environmentMaps/4/px.png","./resources/textures/environmentMaps/4/nx.png","./resources/textures/environmentMaps/4/py.png","./resources/textures/environmentMaps/4/ny.png","./resources/textures/environmentMaps/4/pz.png","./resources/textures/environmentMaps/4/nz.png"]),this.scene.environment=this.environmentMapTexture,this.tl=A.timeline(),this.tlSettings={position:0,play:()=>{this.tl.play()},pause:()=>{this.tl.pause()},restart:()=>{this.tl.pause(),this.tl.seek(0),this.tl.play()}},this.gltfLoader.load("./resources/models/scene.gltf",d=>{const i=new S,o=d.scene.children[1].children[0];o.material=this.gltfMaterial,o.scale.set(.1*6,.125*6,.1*6);const u=o.clone();u.rotateZ(Math.PI),o.position.y+=.75,o.position.y+=.8,u.position.y-=.8,i.add(u),i.add(o),this.scene.add(i);const h=d.scene.children[0].children[0];h.material=this.gltfMaterial,h.scale.set(.1*2,.08*2,.1*2);const x=h.clone(),f=h.clone();x.rotateZ(Math.PI);const s=x.clone();x.position.y=-.1,h.position.y+=.75,f.position.y+=1,s.position.y=-.5,this.scene.add(f),this.scene.add(s),this.scene.add(x),this.scene.add(h);const t=d.scene.children[2].children[0];t.material=this.gltfMaterial,t.scale.set(.1*2,.125*.5,.1*2);const p=t.clone();p.position.y=.7;const n=p.clone(),P=t.clone();this.scene.add(p),this.scene.add(t),this.scene.add(n),this.scene.add(P),this.tl.fromTo(h.scale,{x:0,y:0,z:0},{x:.1*3,y:.08*3,z:.1*3,duration:5,ease:"expo.in"},1),this.tl.fromTo(x.scale,{x:0,y:0,z:0},{x:.1*3,y:.08*3,z:.1*3,duration:5,ease:"expo.in"},1),this.tl.fromTo(f.scale,{x:0,y:0,z:0},{x:.1*4,y:.08*4,z:.1*4,duration:5,ease:"expo.in"},1),this.tl.fromTo(s.scale,{x:0,y:0,z:0},{x:.1*4,y:.08*4,z:.1*4,duration:5,ease:"expo.in"},1),this.tl.fromTo(t.scale,{x:0,y:0,z:0},{x:.1*2,y:.125*.5,z:.1*2,duration:5,ease:"expo.in"},1),this.tl.fromTo(p.scale,{x:0,y:0,z:0},{x:.1*2,y:.125*.5,z:.1*2,duration:5,ease:"expo.in"},1),this.tl.fromTo(n.scale,{x:0,y:0,z:0},{x:.1*5,y:.125*2,z:.1*5,duration:5,ease:"expo.in"},1),this.tl.fromTo(P.scale,{x:0,y:0,z:0},{x:.1*5,y:.125*2,z:.1*5,duration:5,ease:"expo.in"},1),this.tl.fromTo(o.rotation,{y:0},{y:Math.PI*8,duration:8,ease:"expo.in"},1),this.tl.fromTo(u.rotation,{y:0},{y:-Math.PI*8,duration:8,ease:"expo.in"},1),this.tl.to(o.position,{y:4,duration:5,ease:"expo.in"},1),this.tl.to(u.position,{y:-4,duration:5,ease:"expo.in"},1),this.tl.fromTo(f.rotation,{y:1},{y:Math.PI*8,duration:8,ease:"expo.in"},1),this.tl.fromTo(s.rotation,{y:3},{y:Math.PI*8,duration:8,ease:"expo.in"},1),this.tl.to(f.position,{y:2,duration:5,ease:"expo.in"},1),this.tl.to(s.position,{y:-2,duration:5,ease:"expo.in"},1),this.tl.fromTo(h.rotation,{y:2},{y:Math.PI*8,duration:8,ease:"expo.in"},1),this.tl.fromTo(x.rotation,{y:7},{y:Math.PI*8,duration:8,ease:"expo.in"},1),this.tl.to(h.position,{y:1.5,duration:5,ease:"expo.in"},1),this.tl.to(x.position,{y:-1.5,duration:5,ease:"expo.in"},1),this.tl.fromTo(t.rotation,{y:6},{y:Math.PI*8,duration:8,ease:"expo.in"},1),this.tl.fromTo(p.rotation,{y:4},{y:Math.PI*8,duration:8,ease:"expo.in"},1),this.tl.to(p.position,{y:.5,duration:5,ease:"expo.in"},1),this.tl.to(t.position,{y:-.5,duration:5,ease:"expo.in"},1),this.tl.fromTo(n.rotation,{y:6},{y:Math.PI*8,duration:8,ease:"expo.in"},1),this.tl.fromTo(P.rotation,{y:4},{y:Math.PI*8,duration:8,ease:"expo.in"},1),this.tl.to(n.position,{y:3,duration:5,ease:"expo.in"},1),this.tl.to(P.position,{y:-3,duration:5,ease:"expo.in"},1),this.tl.fromTo(t.rotation,{y:6},{y:Math.PI*8,duration:8},8),this.tl.fromTo(p.rotation,{y:4},{y:Math.PI*8,duration:8},8),this.tl.fromTo(n.rotation,{y:6},{y:Math.PI*8,duration:8},8),this.tl.fromTo(P.rotation,{y:4},{y:Math.PI*8,duration:8},8),this.tl.to(t.scale,{x:0,y:0,z:0,duration:3},8),this.tl.to(p.scale,{x:0,y:0,z:0,duration:3},8),this.tl.to(n.scale,{x:0,y:0,z:0,duration:3},8),this.tl.to(P.scale,{x:0,y:0,z:0,duration:3},8),this.tl.to(t.position,{y:0,duration:3},8),this.tl.to(p.position,{y:0,duration:3},8),this.tl.to(n.position,{y:0,duration:3},8),this.tl.to(P.position,{y:0,duration:3},8),this.tl.fromTo(h.rotation,{y:6},{y:Math.PI*8,duration:8},8),this.tl.fromTo(x.rotation,{y:4},{y:Math.PI*8,duration:8},8),this.tl.fromTo(f.rotation,{y:6},{y:Math.PI*8,duration:8},8),this.tl.fromTo(s.rotation,{y:4},{y:Math.PI*8,duration:8},8),this.tl.to(h.scale,{x:0,y:0,z:0,duration:3},8),this.tl.to(x.scale,{x:0,y:0,z:0,duration:3},8),this.tl.to(f.scale,{x:0,y:0,z:0,duration:3},8),this.tl.to(s.scale,{x:0,y:0,z:0,duration:3},8),this.tl.to(h.position,{y:0,duration:3},8),this.tl.to(x.position,{y:0,duration:3},8),this.tl.to(f.position,{y:0,duration:3},8),this.tl.to(s.position,{y:0,duration:3},8),this.tl.fromTo(o.rotation,{y:0},{y:Math.PI*8,duration:8},8),this.tl.fromTo(u.rotation,{y:5},{y:Math.PI*8,duration:8},8),this.tl.to(o.position,{y:1.2,duration:5},8),this.tl.to(u.position,{y:-1.2,duration:5},8);const I=new w(new Y(.09,16,16),this.gltfMaterial.clone());I.material.color=new D("red"),I.position.y=0,this.scene.add(I)})}restartTl(){this.tl.restart()}update(e){const a=e.getElapsedTime();this.waterMaterial.uniforms.uTime.value=a}}let c={activeView:1,diamondParams:{stretchIn:4.299615859985352,stretchOut:-4.299615859985352,stretchUp:3,stretchDown:-3},envColors:{oceanColorOne:"#0081b8",oceanColorTwo:"#9ae0e5",fogColor:"#6a93a8"}},g,T=new Q,b,G,M,y,v,z=[],m;new _;function at(){lt(),st(),rt(),dt()}function st(){M=new $,document.body.appendChild(M.dom)}function rt(){m=new B,U()}function U(){switch(console.log(m.__folders),m.__folders.animation1&&(m.removeFolder(m.__folders.animation1),m.removeFolder(m.__folders.timeline)),m.__folders.animation2&&(m.removeFolder(m.__folders.animation2),m.removeFolder(m.__folders.timeline2)),c.activeView){case 0:const l=m.addFolder("animation1");l.open(),l.add(c.diamondParams,"stretchIn").min(4.299616813659668).max(45).step(.01).onChange(()=>{y.updateGui()}),l.add(c.diamondParams,"stretchOut").min(-45).max(-4.299616813659668).step(.01).onChange(()=>{y.updateGui()}),l.add(c.diamondParams,"stretchUp").min(3).max(45).step(.01).onChange(()=>{y.updateGui()}),l.add(c.diamondParams,"stretchDown").min(-45).max(-3).step(.01).onChange(()=>{y.updateGui()});const e=m.addFolder("timeline");e.open(),e.add(y.tlSettings,"position").min(0).max(20).step(.01).onChange(i=>{y.tl.pause(),y.tl.seek(i)}).name("Timeline"),e.add(y.tlSettings,"play").name("Play"),e.add(y.tlSettings,"pause").name("Pause"),e.add(y.tlSettings,"restart").name("Restart");break;case 1:m.addFolder("animation2").open();const d=m.addFolder("timeline2");d.open(),d.add(v.tlSettings,"position").min(0).max(20).step(.01).onChange(i=>{v.tl.pause(),v.tl.seek(i)}).name("Timeline"),d.add(v.tlSettings,"play").name("Play"),d.add(v.tlSettings,"pause").name("Pause"),d.add(v.tlSettings,"restart").name("Restart");break}}function lt(){g=new J,g.setPixelRatio(window.devicePixelRatio),g.setSize(window.innerWidth,window.innerHeight),g.setClearColor("#262837"),document.body.appendChild(g.domElement),y=new it(c,g),z.push(y),v=new nt(c,g),z.push(v),b=new E(y.camera,g.domElement),G=new E(v.camera,g.domElement),F()}function dt(){window.addEventListener("resize",ht,!1),window.addEventListener("keydown",l=>{const{key:e}=l;switch(console.log(e),e){case"ArrowRight":c.activeView=(c.activeView+1)%z.length,U();break;case"ArrowLeft":c.activeView=c.activeView-1,c.activeView<0&&(c.activeView=z.length-1),U();break}})}function ht(){y.onWindowResize()}function F(){switch(requestAnimationFrame(()=>{F()}),T.getDelta(),c.activeView){case 0:y.update(T);break;case 1:v.update(T);break}M&&M.update(),b&&b.update(),G&&G.update(),g.render(z[c.activeView].scene,z[c.activeView].camera)}at();
