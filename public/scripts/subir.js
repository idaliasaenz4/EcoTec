document.addEventListener("DOMContentLoaded", function() {
    const uploadButton = document.querySelector('.upload-evidence');
    const imageUpload = document.querySelectorAll('.image-upload');

    uploadButton.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png, image/jpeg'; // Solo permitir archivos de imagen PNG o JPEG

        input.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e) {
                    const image = new Image();
                    image.src = e.target.result;

                    // Mostrar la imagen en los botones del div .image-upload
                    const imageButtons = document.querySelectorAll('.image-upload button');
                    for (let i = 0; i < imageButtons.length; i++) {
                        if (!imageButtons[i].querySelector('img')) {
                            const imgElement = document.createElement('img');
                            imgElement.src = image.src;
                            imageButtons[i].innerHTML = ''; // Limpiar el contenido existente
                            imageButtons[i].appendChild(imgElement);
                            break;
                        }
                    }
                }
            }
        };

        input.click(); // Simular clic en el input file
    });

    // Evento de clic para eliminar la imagen
    imageUpload.forEach(function(container) {
        const removeButton = container.querySelector('.remove-image');
        removeButton.addEventListener('click', function() {
            const imageButton = container.querySelector('button');
            imageButton.innerHTML = '&#128247;'; // Restablecer el contenido del botón
            const img = container.querySelector('img');
            if (img) {
                img.remove(); // Eliminar la imagen si existe
            }
        });
    });
});
