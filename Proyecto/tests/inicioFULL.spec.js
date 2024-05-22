
test('El formulario de inicio de sesión no debería tener un campo de contraseña para usuarios autenticados', () => {
    // Arrange
    const isAuthenticated = true;
    const passwordInput = document.getElementById('password');
    
    // Assert
    if (isAuthenticated) {
        expect(passwordInput).toBeFalsy();
    } else {
        expect(passwordInput.type).toEqual('password');
    }
});