import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js';
import { STLLoader }     from 'https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/controls/OrbitControls.js';

// renderer
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x202040);
document.body.appendChild(renderer.domElement);

// scene & camera
const scene   = new THREE.Scene();
const camera  = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 5000);
camera.position.set(0,0,300);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AxesHelper(50));
scene.add(new THREE.HemisphereLight(0xffffff,0x444444,1));

function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);}animate();

document.getElementById('file').addEventListener('change', e => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const geo = new STLLoader().parse(ev.target.result);
    const mat = new THREE.MeshStandardMaterial({color:0xff6633});
    const mesh= new THREE.Mesh(geo,mat);
    [...scene.children].forEach(o=>{ if(o.isMesh) scene.remove(o);} );
    scene.add(mesh);

    geo.computeBoundingBox();
    const size = geo.boundingBox.getSize(new THREE.Vector3()).length();
    geo.center();

    camera.position.set(0,0,size*2);
    controls.target.set(0,0,0);
    controls.update();
  };
  reader.readAsArrayBuffer(file);
});
