/* eslint-disable no-undef */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let model; // Declare model variable globally

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3d-container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// Clock for animation timing
const clock = new THREE.Clock();

// Animation mixer
let mixer;

// Mouse tracking
let mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Load the GLTF model
const loader = new GLTFLoader();
loader.load(
  './assets/shop.glb', // Ensure this path is correct
  (gltf) => {
    model = gltf.scene;
    scene.add(model);

    // Compute the bounding box of the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Center the model
    model.position.x += model.position.x - center.x;
    model.position.y += model.position.y - center.y;
    model.position.z += model.position.z - center.z;

    // Determine the maximum dimension of the model
    const maxDim = Math.max(size.x, size.y, size.z);

    // Calculate the distance the camera needs to be to fit the model
    const fov = camera.fov * (Math.PI / 180); // Convert vertical FOV to radians
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

    cameraZ *= 1.5; // Add some extra space (optional)
    camera.position.z = cameraZ;

    // Ensure the camera is looking at the center of the scene
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Initialize the mixer and play animations
    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });

    animate();
  },
  undefined,
  (error) => {
    console.error('An error occurred while loading the model:', error);
  },
);

// Handle window resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  if (model) {
    // Calculate target rotations based on mouse position
    const targetRotationX = mouse.y * 0.5; // Adjust the multiplier for sensitivity
    const targetRotationY = mouse.x * 0.5;

    // Smoothly interpolate to the target rotation
    model.rotation.x += (targetRotationX - model.rotation.x) * 0.1;
    model.rotation.y += (targetRotationY - model.rotation.y) * 0.1;
  }

  renderer.render(scene, camera);
}
