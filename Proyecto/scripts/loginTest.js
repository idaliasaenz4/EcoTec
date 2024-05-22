document.addEventListener('DOMContentLoaded', function() {
    var form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Evitar el envío del formulario

            // Obtener el valor del correo electrónico
            var emailInput = document.getElementById('username');
            var email = emailInput.value;

            // Verificar si el correo electrónico termina con "@delicias.tecnm.mx"
            if (email.endsWith('@delicias.tecnm.mx')) {
                // Si la validación es exitosa, puedes continuar con el envío del formulario o realizar otras acciones
                console.log('El correo electrónico es válido:', email);

                // Obtener el valor de la contraseña
                var password = document.getElementById('password').value;

                // Mostrar los datos en la consola
                console.log('Contraseña:', password);

                // Eliminar el mensaje de error si existe
                removeErrorMessage();

                // Aquí podrías continuar con el envío del formulario si es necesario
                // form.submit(); // Descomenta esta línea si quieres enviar el formulario después de la validación
            } else {
                // Si el correo electrónico no cumple con la validación, muestra un mensaje de error en la página
                var errorMessage = 'El correo electrónico debe terminar con "@delicias.tecnm.mx"';
                var errorElement = document.createElement('div');
                errorElement.textContent = errorMessage;
                errorElement.classList.add('error-message');
                errorElement.style.color = 'white'; // Aplicar estilo para el color blanco

                // Insertar el mensaje de error después del campo de entrada del correo electrónico
                emailInput.parentNode.insertBefore(errorElement, emailInput.nextSibling);

                // Agregar evento de clic al botón "Ingresar" para eliminar el mensaje de error si se hace clic y el correo es válido
                var submitButton = document.querySelector('button[type="submit"]');
                submitButton.addEventListener('click', function() {
                    if (email.endsWith('@delicias.tecnm.mx')) {
                        removeErrorMessage();
                    }
                });
            }
        });
    } else {
        console.error('No se encontró ningún formulario en el documento.');
    }

    // Función para eliminar el mensaje de error
    function removeErrorMessage() {
        var errorMessage = document.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.parentNode.removeChild(errorMessage);
        }
    }
});