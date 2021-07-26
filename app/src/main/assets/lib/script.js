const scene = new THREE.Scene()
const cam = new THREE.PerspectiveCamera(45, innerWidth/innerHeight,.1,1000);
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#scene')})


const mouse = new THREE.Vector2()
const raycaster = new THREE.Raycaster()

cam.position.z = 20;
cam.position.y += 5;
if(innerWidth<=1000){
    cam.position.z=8
}
renderer.setSize(innerWidth, innerHeight);

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.BasicShadowMap

let light = new THREE.PointLight(0xffffff, 2)
light.position.set(0, 40, 60)
let light2 = new THREE.PointLight(0xffffff, 2)
light2.position.set(0, 40, -60)
scene.add(light, light2)

let loaderTexture = new THREE.CubeTextureLoader()
let skyBox = loaderTexture.load([
    'assets/sky/px.png',
    'assets/sky/nx.png',
    'assets/sky/py.png',
    'assets/sky/ny.png',
    'assets/sky/pz.png',
    'assets/sky/nz.png',
])
scene.background = skyBox

// Menambahkan Peta
const loader = new THREE.GLTFLoader()
let peta_object;

loader.load('model/peta.gltf', function(gltf){
    peta_object=gltf.scene
    peta_object.castShadow=true
    scene.add(peta_object)
    peta_object.rotation.x=.6
    peta_object.rotation.z+=.05
    if(innerWidth<=1000){
        peta_object.position.y-=1
        peta_object.position.x+=.9
    }
    peta_object.children.forEach((peta)=>{
        peta.material.color.set('darkgreen')
        peta.castShadow = true
        peta.receiveShadow = true
    })
},undefined,function(err){
    console.error(err);
});

let i = 0;
let modalOpen;
$('#pulau').on('shown.bs.modal',()=>{
    $('#btn-quiz').hide()
    modalOpen = true
})
$('#pulau').on('hidden.bs.modal',()=>{
    $('#btn-quiz').show()
    $('#pilih-pulau').show()
    modalOpen = false
})
setInterval(()=>{
    let aPulau = ['Sumatera','Jawa','Bali_dan_Nusa_Tenggara','Kalimantan','Sulawesi','Papua']
    if(peta_object){
        peta_object.children.forEach(peta=>{
            if(peta.name==aPulau[i]){
                if(!modalOpen){
                    peta.material.color.set('red')
                }
            }else{
                peta.material.color.set('darkgreen')
            }   
        })
    }
    i++
    if(i>5){
        i=0
    }

},940)

let group = new THREE.Group()
group.name = 'Start'
function addStar(){
    let geometry = new THREE.SphereGeometry(.25,45,45);
    let material = new THREE.MeshStandardMaterial({color: 0xffffff});
    let star = new THREE.Mesh(geometry,material);

    let [x,y,z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100));
    star.position.set(x,y,z)
    group.add(star)
}
Array(200).fill().forEach(addStar)
scene.add(group)

const orbitControls = new THREE.OrbitControls(cam, renderer.domElement)
orbitControls.minDistance = 1
orbitControls.maxDistance = 15
orbitControls.minPolarAngle = .65;
orbitControls.maxPolarAngle = 1.8;
orbitControls.enablePan = false
orbitControls.minAzimuthAngle = -.72;
orbitControls.maxAzimuthAngle = .72;

const clock = new THREE.Clock()
let changeCamera;
orbitControls.addEventListener('start',function(e){
    changeCamera=true
})
orbitControls.addEventListener('end',function(e){
    changeCamera=false
})

window.addEventListener('resize',function(){
    let width = this.window.innerWidth
    let height = this.window.innerHeight
    
    renderer.setSize(width, height)
    cam.aspect = width/height;
    cam.updateProjectionMatrix()
})

function animate() {
    orbitControls.update(clock.getDelta())
	requestAnimationFrame( animate );
	renderer.render( scene, cam );
}
animate();

renderer.domElement.addEventListener('click', pilihPulau, false)
renderer.domElement.addEventListener('mousemove', pilihPulau, false)

let selected;
function pilihPulau(event){
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
	raycaster.setFromCamera( mouse, cam );

    if(peta_object){

        const intersects = raycaster.intersectObjects( peta_object.children );
        if(intersects[0]){
            selected=intersects[0].object.name
            if(event.type=='click'){   
                getDataFrom('data/indonesia.json',function({pulau}){
                    let provinsi = where(pulau, 'nama', selected)
                    modalTogggle(provinsi)
                })
            }
        }else{
            selected=''
        }
        peta_object.children.forEach(peta=>{
            if(peta.name==selected){
                if(!changeCamera){
                    peta.material.color.set('green')
                    peta.position.y=0.3
                }
            }else{
                peta.material.color.set('darkgreen')
                peta.material.emissive.set( 0x000000 );
                peta.position.y=0
            }
        });
    }
}