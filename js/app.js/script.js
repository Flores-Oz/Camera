const videoCover = document.getElementById('videoCover');
const lenses = document.querySelectorAll('.lens'); // Agrega esta línea
const camera = document.querySelector('.camera');
const video = document.getElementById('video');
const shutterButton = document.getElementById('shutterButton');
const backSection = document.getElementById('backSection');
const captureButton = document.getElementById('captureButton');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const frame = new Image();
frame.crossOrigin = "anonymous";  // Intenta evitar restricciones CORS
frame.src = "https://flores-oz.github.io/Camera/marco.png"; 


frame.onload = function() {
    tempCanvas.width = frame.width;
    tempCanvas.height = frame.height;
    tempContext.drawImage(frame, 0, 0);
    const dataURL = tempCanvas.toDataURL(); // Convertir a Data URL

    const frameImage = new Image();
    frameImage.src = dataURL;
    frameImage.onload = function() {
        context.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
    };
}

let isFlipped = false; // Variable para saber el estado de la cámara
let stream;

//
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
    video.style.display = 'block';
    console.log("Cámara iniciada correctamente");
})
.catch(error => console.error('Error accediendo a la cámara:', error));



captureButton.addEventListener('click', () => {
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
context.drawImage(video, 0, 0, canvas.width, canvas.height);

 // Espera antes de detener la cámara
setTimeout(() => {
if (stream) {
    stream.getTracks().forEach(track => track.stop());
}
}, 100); 

})
//

// Cuando la imagen del marco esté completamente cargada
frame.onload = () => {
    captureButton.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement('video');
            video.srcObject = stream;
            
            await new Promise(resolve => {
                video.onloadedmetadata = () => {
                    video.play(); // Asegurar que el video comience
                    resolve();
                };
            })

            await new Promise(resolve => setTimeout(resolve, 500)); // Esperar a que la cámara se active

            // Configurar el canvas con el tamaño del video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Dibujar el video en el canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Detener el stream de la cámara
            stream.getTracks().forEach(track => track.stop());

            // Aquí agregamos el marco solo como borde
            const frameWidth = canvas.width;
            const frameHeight = canvas.height;
            context.drawImage(frame, 0, 0, frameWidth, frameHeight); // El marco como borde, no fondo

              // Detener la cámara después de capturar
           //stream.getTracks().forEach(track => track.stop());
        
            // Convertir el canvas a un archivo PNG y descargarlo
            canvas.toBlob(blob => {
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob); // Crear un objeto URL
                link.href = url;
                link.download = 'captura_con_marco.png';
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    document.body.removeChild(link); // Eliminar el enlace temporal después de la descarga
                    window.URL.revokeObjectURL(url); // Liberar el objeto URL
                }, 0);
            }, 'image/png');
        } catch (error) {
            console.error('Error al capturar la foto:', error);
        } 
    });  
};
       // Función para alternar la vista

// Iniciar la cámara al cargar la página
navigator.mediaDevices.getUserMedia({ video: true })
.then(userStream => {
stream = userStream;
video.srcObject = stream;
video.style.display = 'block';
})
.catch(error => console.error('Error accediendo a la cámara:', error));

// Alternar la vista con animación
shutterButton.addEventListener('click', () => {
isFlipped = !isFlipped; // Alternar estado
camera.classList.toggle('flipped'); // Activar animación de volteo

if (isFlipped) {
// Esperar la animación antes de mostrar la back-section y ocultar la cámara
setTimeout(() => {
backSection.style.display = 'block';
video.style.display = 'none';
lenses.forEach(lens => lens.style.display = 'none');
videoCover.style.display = 'block'; 
stopCamera(); // Detener la cámara
}, 1000); // Tiempo de la animación
} else {
// Ocultar la back-section y mostrar la cámara después de la animación
setTimeout(() => {
backSection.style.display = 'none';
video.style.display = 'block';
lenses.forEach(lens => lens.style.display = 'block');
videoCover.style.display = 'none'; // Oculta el cuadro negro
startCamera(); // Reiniciar la cámara
}, 1000); // Tiempo de la animación
}
});

// Función para detener la cámara
function stopCamera() {
if (stream) {
stream.getTracks().forEach(track => track.stop());
}
}

// Función para reiniciar la cámara
function startCamera() {
navigator.mediaDevices.getUserMedia({ video: true })
.then(userStream => {
stream = userStream;
video.srcObject = stream;
console.log("Cámara iniciada correctamente");
})
.catch(error => console.error('Error accediendo a la cámara:', error));
}


//Imagenes
const images = ["Diend.png", "marco.png", "imagenes/img3.jpg"]; 
let currentIndex = 0;
const carouselImage = document.getElementById("carouselImage");

function prevImage() {
currentIndex = (currentIndex - 1 + images.length) % images.length;
carouselImage.src = images[currentIndex];
}

function nextImage() {
currentIndex = (currentIndex + 1) % images.length;
carouselImage.src = images[currentIndex];
}
