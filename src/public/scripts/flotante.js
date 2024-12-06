const openModal = document.getElementById('open-modal');
const closeModal = document.getElementById('close-modal');
const modal = document.getElementById('modal');
const background = document.getElementById('background');

openModal.addEventListener('click', () => {
    modal.classList.remove('hidden');
    background.classList.add('blur-md');
});

closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    background.classList.remove('blur-md');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
    modal.classList.add('hidden');
    background.classList.remove('blur-md');
    }
});

document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error || 'Error en el inicio de sesión');
        } else {
            window.location.href = '/mantenimiento';
        }
    } catch (error) {
        alert('Error al conectar con el servidor');
    }
});
