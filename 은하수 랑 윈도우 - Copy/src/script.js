import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui'
import * as Tone from 'tone'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/Addons.js'
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
//import WindowManager from './WindowManager.js'


// Debug
const gui = new GUI()


// Canvas
const canvas = document.querySelector('canvas.webgl') //Render the 3D graphics

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true // 안티앨리어싱 활성화
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Scene
const scene = new THREE.Scene()

// Camara
// Base camera
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200)
camera.position.x = 8
camera.position.y = 2
camera.position.z = 15
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const params = {
    red: 1.0,
    green: 1.0,
    blue: 1.0,
    threshold: 0.1, 
    strength: 0.4, 
    radius: 0.4
}

renderer.outputColorSpace = THREE.SRGBColorSpace;

const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window,innerHeight),1, 0.2, 0.1);
bloomPass.threshold = params.threshold; 
bloomPass.strength = params.strength; 
bloomPass.radius = params.radius; 

const bloomComposer = new EffectComposer(renderer);
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const outputPass = new OutputPass
bloomComposer.addPass(outputPass); 

const audioFiles = [
    //'./BACK2BACK.mp3',
    //'./Phonkha x SKETS - RAVEN.mp3', //첫번쨰
    //'./Metrik - We Are The Energy.mp3',
    //./KUTE TECHNO KILLA.mp3'
    //'./FALLING.mp3',
    //'./Hensonn - Sahara.mp3', 
    './KUTE AVOID ME.mp3',
    './PlayaPhonk - Keraunos.mp3',//phonk 
    './KUTE TECHNO KILLA.mp3', //phonk
    './Raffaella Carrà - Pedro (Jaxomy & Agatino Romero Remix).mp3', //techno
    './Creeds - Push Up.mp3', //techno
    './Mahalo & Josh Charm - Missing You.mp3', //house
    './Martin Garrix & Seth Hills - Biochemical.mp3', //Basshouse
    './Maurice West - Rollin.mp3', //psytrance
    './Carnage X Timmy Trumpet - Psy or Die.mp3', //psytrance
    './REAPER & Calivania - BLACK FIRES.mp3', //DNB
    './Ship Wrek, Dillon Francis - Its My House.mp3', //house
    './Travi$ Scott ft. Young Thug - Skyfall (RL Grime & Salva Remix).mp3', //trap
    './Camila Cabello - Shouldve Said It (SVRRIC & Yonexx Remix).mp3', //future
    './PhaseOne - The Risen (feat. Sleep Waker) [VIBEMENT Remix].mp3', //dubstep
    './Elley Duhé - MIDDLE OF THE NIGHT (Riminirs Remix).mp3', //dance
    './Billie Eilish - bad guy.mp3',

    './SCXR SOUL x Sx1nxwy DEMONS IN MY SOUL.mp3',
    './Dxrk ダーク - RAVE.mp3',
    './KORDHELL - KILLERS FROM THE NORTHSIDE.mp3',
    //'./Eliminate - Snake Bite (VIP) (VIP).mp3',
    './Virtual Riot, NGHTMRE - Teardrop (feat. Marlhy) (Original Mix Wav).wav'
    
    //'./bass.wav',
    //'./bass2.wav'

];

const player = new Tone.Player().toDestination();
player.loop = true;

let currentTrackIndex = 0; 

const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

function loadAudio(index) {
    const track = audioFiles[index];
    audioLoader.load(track, function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(1);
        playAudio();
    });
}

function playAudio() {
    if(listener.context.state === 'suspended') {
        listener.context.resume();
}
sound.stop();
sound.play();
}

window.addEventListener('mousedown', function(event) {
    // 마우스 중간 버튼이 클릭되었는지 확인
    if (event.button === 1) {
        event.preventDefault(); // 브라우저의 기본 동작(스크롤 등)을 막습니다.
        // 다음 트랙으로 이동
        console.log('Middle mouse button clicked');
        currentTrackIndex = (currentTrackIndex + 1) % audioFiles.length;
        loadAudio(currentTrackIndex);
    }
});

window.addEventListener('keydown', function(event) {
    if (event.key === 's' || event.key === 'S') {
        sound.stop();  // Stop the sound playback
        console.log('Sound stopped by pressing "S"');
    }
});


const analyser = new THREE.AudioAnalyser(sound, 2048);

const colorsFolder = gui.addFolder('Color');
colorsFolder.add(params, 'red', 0, 1).onChange(function(value) {
    uniforms.u_red.value = Number(value); 
}); 
colorsFolder.add(params, 'green', 0, 1).onChange(function(value) {
    uniforms.u_green.value = Number(value); 
}); 
colorsFolder.add(params, 'blue', 0, 1).onChange(function(value) {
    uniforms.u_blue.value = Number(value); 
}); 
colorsFolder.close();


const bloomFolder = gui.addFolder('bloom');
bloomFolder.add(params, 'threshold', 0, 1).onChange(function(value) {
    bloomPass.threshold = Number(value); 
}); 
bloomFolder.add(params, 'strength', 0, 1).onChange(function(value) {
    bloomComposer.strength = Number(value); 
}); 
bloomFolder.add(params, 'radius', 0, 1).onChange(function(value) {
    bloomPass.radius = Number(value); 
}); 
bloomFolder.close();

/*
const axesHelper = new THREE.AxesHelper(10);  // 축 길이를 5 단위로 설정
scene.add(axesHelper);
*/

const clock1 = new THREE.Clock();



//Galaxy or Blossom


/*
// WindowManager 인스턴스 생성
windowManager = new WindowManager();
windowManager.setWinShapeChangeCallback(updateGalaxyBasedOnWindow);
windowManager.setWinChangeCallback(updateGalaxyBasedOnWindow);
windowManager.init({
    metaData: { description: "Galaxy simulation window" }
});


function updateGalaxyBasedOnWindow() {
    // 윈도우의 형태가 변경될 때 호출될 함수
    // 카메라, 렌더러 설정을 업데이트하고 은하를 재생성합니다.
    const winShape = windowManager.getThisWindowData().shape;
    camera.aspect = winShape.w / winShape.h;
    camera.updateProjectionMatrix();
    renderer.setSize(winShape.w, winShape.h);
    generateGalaxy(); // 윈도우 변화에 따라 은하 재생성
}


window.addEventListener('resize', () => {
    // WindowManager에 윈도우 상태 업데이트
    windowManager.update();


    // 윈도우 크기에 따른 설정 변경
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


    // 은하 재생성
    generateGalaxy();
});
*/

//Models
const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/prom_suit/scene.gltf', (gltf) => {
    gltf.scene.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            // 반사율, 거칠기, 금속성 설정
            child.material.reflectivity = 1;   // 반사율 최대로 설정
            child.material.roughness = 0.2;      // 표면 거칠기 최소로 설정
            
        }
    });

    // 모델의 크기 및 위치 조정
    gltf.scene.scale.set(0.32, 0.3, 0.3);
    gltf.scene.position.set(0, -52, 0);
    scene.add(gltf.scene);
});
/*
gltfLoader.load(
    '/models/space/scene.gltf', // 파일 경로
    (gltf) => { // 로드 성공 시 실행될 콜백
        gltf.scene.scale.set(1, 1, 1)
        gltf.scene.position.set(6, -5.8, -1.5);
        scene.add(gltf.scene)
    }
);
*/
let eyeMesh

gltfLoader.load(
    '/models/eye/scene.gltf', // 모델 파일 경로
    (gltf) => {
        // 모델이 성공적으로 로드되면 실행되는 콜백
        gltf.scene.traverse(function(child) {
            if (child.isMesh) {
                child.scale.set(0.04, 0.04, 0.04);  // 크기를 10%로 조정
            }
        });
        gltf.scene.rotation.y = 3 * Math.PI /2; 

        eyeMesh = gltf.scene;  // 로드된 모델의 참조 저장
        scene.add(eyeMesh);  // 조정된 모델을 씬에 추가
        console.log('Model loaded, scaled down, and rotated.');
    },
);







/*
const gltfLoader = new GLTFLoader();
gltfLoader.load(
    '/models/Animated/glTF/scene.gltf', // 파일 경로
    (gltf) => { // 로드 성공 시 실행될 콜백
        gltf.scene.scale.set(0.1, 0.1, 0.1)
        scene.add(gltf.scene)
    }
)
*/

const al = new THREE.PointLight('hsl(0, 100%, 50%)', 5); // 빨간색
al.intensity = 100; // 기본값보다 높게 설정하여 더 밝게 만듭니다.

// 조명의 위치 설정
al.position.set(0, 5, 6); // x, y, z 좌표를 설정하여 조명의 위치를 변경합니다.
scene.add(al);


const playBTN = document.getElementById("play-btn");
const synth = new Tone.Synth().toDestination();


playBTN.addEventListener("click", () =>{
   if(Tone.context.state != "running") {
    Tone.start();
   }
   synth.triggerAttackRelease("C3", "8n");
});

/*
const loader = new THREE.TextureLoader
const earthGeometry = new THREE.IcosahedronGeometry(1, 12);
const earthMaterial = new THREE.MeshStandardMaterial({
    //map: loader.load("./textures/00_earthlights1k.jpg")
    color: 0xffff00
});


const earthMesh = new  THREE.Mesh(earthGeometry, earthMaterial);

earthMesh.position.set(0, 4, -5);
*/

const spaceObjects = new THREE.Group();
scene.add(spaceObjects);

/*
const geometry1 = new THREE.PlaneGeometry(10, 10); // 평면 지오메트리 생성 (정사각형)
const wireframe = new THREE.WireframeGeometry(geometry1); // 와이어프레임 지오메트리로 변환

const material1 = new THREE.LineBasicMaterial({ color: 'red' }); // 레드 컬러의 라인 재질
const line = new THREE.LineSegments(wireframe, material1); // 와이어프레임 라인 객체 생성
scene.add(line); // 씬에 라인 객체 추가
*/

const parameters = {}
parameters.count = 100000
parameters.size = 0.001
parameters.radius = 5000
parameters.branches = 1
parameters.spin = 1
parameters.randomness = 100
parameters.randomnessPower = 10
//parameters.insideColor = '#ff6030'
//parameters.outsideColor = '#1b3984'
parameters.rotationSpeed = 0.001;

let geometry = null
let material = null
let points = null

const generateGalaxy = () =>{
    // Destroy old galaxy
    if(points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }


    //Geometry


    geometry = new THREE.BufferGeometry()


    const positions = new Float32Array(parameters.count * 3) //xyz
    const colors = new Float32Array(parameters.count * 3)


    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)


    for(let i = 0; i < parameters.count; i++) {
        //Position
        const i3 = i * 3; //Index for the positions array (x, y, z for each star)
   
        //Calculate the radius for this star from the galaxy center
        const radius = Math.random() * parameters.radius;
   
        //Calculate the spin angle, affecting how far around the galaxy center the star is placed
        const spinAngle = radius * parameters.spin * 100;
   
        //Determine the branch (spiral arm) the star belongs to and its angle within that branch
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
       
        //Random offsets for x, y, z to add variability to star positions, making the galaxy appear more natural
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
   
        //Calculate final position for this star within the galaxy
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX; // x-coordinate
        positions[i3 + 1] = randomY; // y-coordinate
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; // z-coordinate


        /* Color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)
       
        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b */
    }


    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    //geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))


    //Material
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.NoBlending,
        //vertexColors: true
        color: 'red' //별 색깔
    })
    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    spaceObjects.add(points)
    //spaceObjects.add(earthMesh);
}

const uniforms = {
    u_time: {type: 'f', value: 0.0},
    u_frequency: {type: 'f', value: 0.0},
    u_red: {type: 'f', value: 1.0},
    u_green: {type: 'f', value: 1.0},
    u_blue: {type: 'f', value: 1.0}


};

const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent
});

const geo = new THREE.IcosahedronGeometry(4, 30);
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

mesh.material.wireframe = true;

const geometryFolder = gui.addFolder('Stars'); 
geometryFolder.close(); 

geometryFolder.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
geometryFolder.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
geometryFolder.add(parameters, 'spin').min(- 5).max(5).step(0.001).onFinishChange(generateGalaxy)
geometryFolder.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
geometryFolder.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
geometryFolder.add(parameters, 'randomness').min(0).max(10).step(0.001).onFinishChange(generateGalaxy)
geometryFolder.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
geometryFolder.add(parameters, 'rotationSpeed').min(-0.01).max(0.01).step(0.0001).name('Rotation Speed');

/*
const renderScene = new RenderPass(scene, camera);
*/

generateGalaxy()

//Sizes//
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight


    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()


    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//Animate

const clock = new THREE.Clock()

let lastTrackIndex = 0;
let lightnessStartTime = 0;

function updateLightness() {
    // 현재 시간
    const currentTime = clock1.getElapsedTime();

    // 트랙이 바뀌었는지 확인
    if (currentTrackIndex !== lastTrackIndex) {
        lastTrackIndex = currentTrackIndex;
        lightnessStartTime = currentTime;  // lightness 계산을 위한 시작 시간 리셋
    }

    // lightness 계산 (0에서 50까지 10초 동안)
    const elapsedTime = currentTime - lightnessStartTime;
    const duration = 10;  // 10초 동안 lightness가 변화
    let lightness = (elapsedTime / duration) * 50;
    if (elapsedTime > duration) {
        lightness = 50;
    }

    return lightness;
}

function animate() {
    const elapsedTime = clock.getElapsedTime();


    // Update controls
    controls.update();
    
    const customAxis = new THREE.Vector3(1, 0, 0).normalize(); // 정규화는 중요합니다.

    if (eyeMesh) {
        // 매 프레임마다 customAxis 축을 기준으로 0.01 라디안씩 회전합니다.
        eyeMesh.rotateOnAxis(customAxis, 0.001);
    }

    // 은하 회전 업데이트
    if(points !== null) {
        points.rotation.y += parameters.rotationSpeed;
    }
    const averageFreq = analyser.getAverageFrequency();
    const maxFrequency = 50;
    const normalizedFreq = averageFreq / maxFrequency;

    uniforms.u_time.value = clock1.getElapsedTime()
    uniforms.u_frequency.value = analyser.getAverageFrequency(); 
    
    if (averageFreq === 0) {  // 오디오가 재생되지 않을 때
        // 검은색 설정
        uniforms.u_red.value = 0;
        uniforms.u_green.value = 0;
        uniforms.u_blue.value = 0;
    } else {
        // 노래 재생 중일 때 색상 변화
        const hue = normalizedFreq * 360;
        const saturation = 100;
        const lightness = updateLightness();

        const color = new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        uniforms.u_red.value = color.r;
        uniforms.u_green.value = color.g;
        uniforms.u_blue.value = color.b;
    }
    // Render
    bloomComposer.render();
}

renderer.setAnimationLoop(animate);


