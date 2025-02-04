import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
 
document.addEventListener('DOMContentLoaded', () => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(4, 5, 11);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.minPolarAngle = 0.5;
    controls.maxPolarAngle = 1.5;
    controls.autoRotate = false;
    controls.target = new THREE.Vector3(0, 1, 0);
    controls.update();
    const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
    groundGeometry.rotateX(-Math.PI / 2);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.castShadow = false;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);
    const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
    spotLight.position.set(0, 30, 0);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    scene.add(spotLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color, Intensity
    scene.add(ambientLight);
    let mesh;
    const loader = new GLTFLoader().setPath('./time_machine/');
    loader.load('scene.gltf', (gltf) => {
        console.log('loading model');
        mesh = gltf.scene;
        mesh.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(0xd4af37);
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        mesh.rotation.y = 110 * Math.PI / 180;
        mesh.position.set(0, 1.05, -1);
        mesh.scale.set(0.075, 0.075, 0.075); // Initial scale value
        scene.add(mesh);
        document.getElementById('progress-container').style.display = 'none';
        updateModelScale(); // Initial call to set scale based on window size
    }, (xhr) => {
        console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
    }, (error) => {
        console.error(error);
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        updateModelScale(); // Update scale on window resize
    });
    let targetRotation = 110 * Math.PI / 180;
    let shouldRotate = false;
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        if (mesh && shouldRotate) {
            mesh.rotation.y += (targetRotation - mesh.rotation.y) * 0.05; 
        }
        renderer.render(scene, camera);
    }
    animate();   

    const yearSelect = document.getElementById('year');
    const flipCards = document.querySelectorAll('.flip-card');
    let lastSelectedCard = null;
    // Event listener for year selection
    yearSelect.addEventListener('click', (event) => {
        const selectedYear = event.target.dataset.year;       
        if (!selectedYear) return; // Ensure a year is selected
        console.log(`Selected year: ${selectedYear}`);
        // Hide the dropdown content
        yearSelect.style.display = 'none';
        flipCards.forEach(card => {
            if (card.id === `flip-card-${selectedYear}`) {
                card.style.display = 'block'; 
                if (window.innerWidth < 600){
                    card.style.width = '70px';
                    card.style.height = '100px';
                    card.style.fontSize = '5px';
                   
                }
                else if (window.innerWidth > 600 && window.innerWidth < 900){
                    card.style.width = '80px';
                    card.style.height = '120px';
                    card.style.fontSize = '6px';
                   
                }
                else{  
                card.style.width = '100px';
                card.style.height = '150px';
                card.style.fontSize = '7px'; 
                } 
               card.style.position='absolute';
               card.style.animationPlayState = 'running';
               card.style.top = '';
               card.style.left = '';
               card.style.transform = '';
               card.dataset.clicked = 'false'; 
               lastSelectedCard = card; 
            }
            else {
                card.style.display = 'none'; // Hide flip card for other years
            }
        });
        if (mesh) {
            shouldRotate = true; // Allow rotation
            if (selectedYear === '1931' || selectedYear === '1997' || selectedYear === '1998') {
                targetRotation += 2 * Math.PI;
            } else if (selectedYear === '1954' || selectedYear === '1980-January'||selectedYear === '1980-July') {
                targetRotation += 4 * Math.PI;
            } else if (selectedYear === '1960' || selectedYear === '1969' || selectedYear === '1980') {
                targetRotation += 6 * Math.PI;
            } else if (selectedYear === '2002-2007' || selectedYear === '1999-2001' || selectedYear === '1992-1999') {
                targetRotation += 8 * Math.PI;
            } else if (selectedYear === '2014' || selectedYear === '2015') {
                targetRotation += 10 * Math.PI;
            }
        }
    });
    // Event listener for toggling dropdown visibility
    const dropdownButton = document.querySelector('.dropbtn');
    dropdownButton.addEventListener('click', () => {
        if (yearSelect.style.display === 'block') {
            yearSelect.style.display = 'none';
        } else {
            yearSelect.style.display = 'block';
        }
    });
    flipCards.forEach(card => {
        let clicked = false;
        // Add touchstart event listener to simulate hover on touch devices
        card.addEventListener('touchstart', function() {
            if (!card.classList.contains('touch')) {
                card.classList.add('touch');
        }});
        // Remove touch class when touch ends
        card.addEventListener('touchend', function() {
            card.classList.remove('touch');
        });
        // Mouse hover and touch start
        card.addEventListener('mouseover', () => {
            if (!clicked) {
                card.style.animationPlayState = 'paused';
            }});
        card.addEventListener('touchstart', () => {
            if (!clicked) {
                card.style.animationPlayState = 'paused';
            }});
        // Mouse out and touch end
        card.addEventListener('mouseout', () => {
            if (!clicked) {
                card.style.animationPlayState = 'running';
        }}); 
        card.addEventListener('touchend', () => {
            if (!clicked) {
                card.style.animationPlayState = 'running';
        }});       
        // Click or tap event
        card.addEventListener('click', () => {
            var h1 = card.querySelector('h1');
            if (!clicked) {
                // Adjust card size and position based on screen width
                      if (window.innerWidth < 600) {
                          card.style.width = '150px';
                          card.style.height = '100px';
                          card.style.fontSize = '10px';                         
                          if (h1) {
                              h1.style.fontSize = '12px';
                         }
                      } 
                      else if (window.innerWidth >= 600 && window.innerWidth < 900) {
                          card.style.width = '250px';
                          card.style.height = '180px';
                          card.style.fontSize = '18px';
                          if (h1) {
                            h1.style.fontSize = '18px';
                       }
                      } 
                      else {
                          card.style.width = '400px';
                          card.style.height = '200px';
                          card.style.fontSize = '25px';
                          if (h1) {
                            h1.style.fontSize = '20px';
                       }
                      }
                      card.style.animationPlayState = 'paused';
                      clicked = true;
            } 
            else {
                // Handle second click  to hide the card
                    card.style.display = 'none';
                    clicked = false;
            }
        });
    });
        // Function to update model scale based on window size
        function updateModelScale() {
           if (mesh) {
            const scaleFactor = Math.min(window.innerWidth, window.innerHeight) / 650; 
            mesh.scale.set(0.075 * scaleFactor, 0.075 * scaleFactor, 0.075 * scaleFactor);
           }
        }  
});