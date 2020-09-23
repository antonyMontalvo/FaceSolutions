// faceapi.loadTinyFaceDetectorModel('/models'),
//   faceapi.loadFaceLandmarkTinyModel('/models'),   
//   faceapi.loadFaceRecognitionModel('/models'),
//   faceapi.loadSsdMobilenetv1Model('/models'),
//   faceapi.loadFaceLandmarkModel('/models'),
//   faceapi.loadFaceRecognitionModel('/models')


let dato = null;
let ayuda = [];
let cantidad = 0;
let numImages = null;
let idUser = null;
let endAnalysis = false;

const formularioPostulante = document.getElementById('formularioPostulante');
const loading = document.getElementById('loading');
const video = document.getElementById('video');
const botonR = document.getElementById('redir');

function CodigoValidacion(codigo, numFotos, id) {
    if (codigo != null) {
        formularioPostulante.classList.add('d-none');
        formularioPostulante.classList.remove('wrapper');

        loading.classList.remove('d-none');
        // video.classList.remove('d-none');
        dato = codigo;
        numImages = Number(numFotos);
        idUser = Number(id);
    }
    llamarPromise();
}

function llamarPromise() {
    console.log("entro");
    Promise.all([
        faceapi.loadTinyFaceDetectorModel('/models'),
        faceapi.loadFaceLandmarkTinyModel('/models'),
        faceapi.loadFaceRecognitionModel('/models'),
        faceapi.loadSsdMobilenetv1Model('/models'),
        faceapi.loadFaceLandmarkModel('/models')
    ]).then(startVideo)
}

async function startVideo() {
    console.log("star video");
    // est es diferente para cada navegador asi que ponemos para todos los navegadores
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);


    try {
        // Recuperar informacion de la cámara web
        let stream = await navigator.mediaDevices.getUserMedia({video: {}})
        video.srcObject = stream
    } catch (e) {
        console.log(e)
    }

    console.log('entro video');
    loading.classList.add('d-none');
    video.classList.remove('d-none');
    botonR.classList.remove('d-none');
}

// navigator.getUserMedia( ,nos devuelve el stream de video que vamos a capturar y se lo enviamos a src de video, aca vemos los errore)

// startVideo();

// Abrir la webCam cuando se reconoce a todos los modelos

// faceapi.nets.tinyFaceDetector.loadFromUri('/models') =>Detectar las caras
// faceLandmark68Net => PAra reconocimiento de las caras

video.addEventListener('play', async () => {
    // ******************************
    //AQUI SE ALMACENA LOS DATOS DE LA IMG 
    const labeledFaceDescriptors = await loadLabeledImages(dato);
    //DEFINIMOS LA CANTIDAD DE PARTICIONES DEL ROSTRO
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
    alert('Análisis Realizado,iniciando escaneo');
    // *****************************

    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    // dibujamos el objeto
    const displaySize = {width: video.width, height: video.height};
    // El video tendria el canvas poe encima con el mismo tamaño
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        if (endAnalysis == false) {
            if (cantidad <= 20) {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();

                // ahora redireccionamos el tamaño del Canvas
                const resizedDetections = await faceapi.resizeResults(detections, displaySize);

                // -----------------------------------------------------
                // limpiar
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                // Pintamos
                faceapi.draw.drawDetections(canvas, resizedDetections);
                // faceapi.draw.drawFaceLandmarks(canvas,resizedDetections);
                // -----------------------------------------------------

                const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));

                results.forEach((result, i) => {
                    const box = resizedDetections[i].detection.box;
                    const drawBox = new faceapi.draw.DrawBox(box, {label: result.toString()});
                    drawBox.draw(canvas);
                    ayuda = drawBox.options.label.split(' (');
                    console.log(ayuda)
                    if (dato == ayuda[0]) {
                        cantidad++;
                    } else {
                        alert('No se le llego a reconocer completamente, vuelva a intentarlo')
                        cantidad = 0;
                    }
                });
            } else {
                endAnalysis = true;
                const acept = confirm('Inicio de sesión exitoso');
                if (acept) {
                    document.getElementById('submit-button').click();
                }
                // await fetch(`http://127.0.0.1:3000/login_camera`, {
                //     method: 'POST', // or 'PUT'
                //     headers: {'Content-Type': 'application/json'},
                //     body: JSON.stringify({id: idUser})
                // }).then(res => res.json())
                //     .catch(error => console.error('Error:', error))
                //     .then((response) => {
                //         console.log(response)
                //         if (response.message) {
                //             window.location.href = '/';
                //         } else {
                //             cantidad=0;
                //             endAnalysis++;
                //             alert('Ocurrio un error el usuario no se encontro')
                //         }
                //     })
            }
        }

    }, 100);
});

// console.log(newCant)
// if (this.newCant > 20) {
//     console.log('ssss')
//     // video.removeEventListener('play', coreFunction)
//
// }

function detenerVideo() {
    document.getElementById('id01').style.display = 'none';
}


// ***************************
function loadLabeledImages(dato) {
    console.log(dato)
    // const labels = ['Roberto Carlos','Luis Fernando','Elvis Pernia']
    const labels = [dato]
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= numImages; i++) {
                const img = await faceapi.fetchImage(`/perfiles/${label}/${i}.jpg`);
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                descriptions.push(detections.descriptor);
            }

            return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
    )
}
