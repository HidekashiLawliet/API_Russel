document.querySelector('form').addEventListener('submit', function (e) {
    const password = document.getElementById('passwordSignup').value;
    const errorDiv = document.getElementById('password-error');

    // Password strength checks
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let errors = [];
    if (password.length < minLength) {
        errors.push('Au moins 8 caractères');
    }
    if (!hasUpperCase) {
        errors.push('Au moins une majuscule');
    }
    if (!hasLowerCase) {
        errors.push('Au moins une minuscule');
    }
    if (!hasNumbers) {
        errors.push('Au moins un chiffre');
    }
    if (!hasSpecialChar) {
        errors.push('Au moins un caractère spécial');
    }

    if (errors.length > 0) {
        e.preventDefault();
        errorDiv.textContent = 'Mot de passe trop faible : ' + errors.join(', ');
        errorDiv.style.display = 'block';
    } else {
        errorDiv.style.display = 'none';
    }
});