let scene, camera, renderer, controls;
let model;
const container = document.getElementById('three-container');

function init() {
    scene = new THREE.Scene();
    scene.background = null; 

    const fov = 75;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 1000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 1, 3); 

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); 
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true; 
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.target.set(0, 0.5, 0); 
    controls.update();
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7.5); 
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    loadModel();

    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function loadModel() {
    const loader = new THREE.GLTFLoader();
    
    loader.load(
        'IMG/Carro3.glb', 
        function (gltf) {
            model = gltf.scene;
            
            model.scale.set(1.5, 1.5, 1.5); 
            
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            scene.add(model);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% carregado');
        },
        function (error) {
            console.error('Um erro ocorreu ao carregar o modelo GLB', error);
        }
    );
}

function animate() {
    requestAnimationFrame(animate);

    controls.update(); 
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

init();