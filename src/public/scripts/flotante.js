const openModal = document.getElementById('open-modal');
const closeModal = document.getElementById('close-modal');
const modal = document.getElementById('modal');
const background = document.getElementById('background');

const subscribeButton = document.getElementById('subscribe-btn');
const subscriptionCont = document.getElementById('subscription-cont');
const closeSub = document.getElementById("closeSuscripcion");

subscribeButton.addEventListener('click', () => {
    subscriptionCont.classList.remove('hidden');
    subscriptionCont.classList.add('flex');
});

subscriptionCont.addEventListener('click', (e)=>{
    if (e.target === subscriptionCont) {
        subscriptionCont.classList.add('hidden');
        subscriptionCont.classList.remove('flex');
    }
});

closeSub.addEventListener('click', ()=>{
    subscriptionCont.classList.add('hidden');
    subscriptionCont.classList.remove('flex');
    limpiarFormulario();
});


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

function limpiarFormulario() {
    const inputs = document.querySelectorAll('form input, form select');

    inputs.forEach(input => {
      if(input.type === "checkbox" || input.type === "radio") {
        input.checked = false;
      }else if(input.tagName.toLowerCase() === 'select') {
        input.selectedIndex = 0;
      }
      else {
        input.value = ''; 
      }
    });
}

function validarFormulario(event) {
    const inputs = document.querySelectorAll('form input, form select');
  
    let esValido = true;
    let mensajeError = '';
    let password = '';
    let confirmarPassword = '';
  
    inputs.forEach(input => {
        esValido = true;
        input.style.borderColor = ''; 

        if (input.tagName.toLowerCase() === 'input') {
            if (input.value.trim() === '') {
            esValido = false;
            mensajeError = 'Por favor, complete todos los campos.';
            input.style.borderColor = 'red'; 
            }
        }

        if (input.name === 'cvv' && input.value.length !== 3) {
            esValido = false;
            mensajeError = 'El CVV debe tener exactamente 3 dígitos.';
            input.style.borderColor = 'red';
        }
    
        if (input.name === 'numero_tarjeta' && input.value.length !== 16) {
            esValido = false;
            mensajeError = 'El número de tarjeta debe tener exactamente 16 dígitos.';
            input.style.borderColor = 'red'; 
        }
    
        if (input.name === 'codigo_postal' && input.value.length !== 5) {
            esValido = false;
            mensajeError = 'El código postal debe tener exactamente 5 dígitos.';
            input.style.borderColor = 'red';
        }
    
        if (input.name === 'password') {
            password = input.value;
            if (input.value.length < 8) {
            esValido = false;
            mensajeError = 'La contraseña debe tener al menos 8 caracteres.';
            input.style.borderColor = 'red'; 
            }
        }
    
        if (input.name === 'confirmPassword') {
            confirmarPassword = input.value;
            if (confirmarPassword && confirmarPassword !== password) {
            esValido = false;
            mensajeError = 'Las contraseñas no coinciden.';
            input.style.borderColor = 'red'; 
            }
        }

        input.addEventListener('focus', () => {
            input.style.borderColor = '';
        });
        
        if (input.tagName.toLowerCase() === 'select') {
            if (input.value.trim() === '' || input.options[0].selected) {
                esValido = false;
                input.style.borderColor = 'red';
            }
        }

        input.addEventListener('focus', () => {
            input.style.borderColor = '';
        });
    });
  
    if (!esValido) {
      event.preventDefault();
      alert(mensajeError);
    }
  }
  


async function validarLogin(event){
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
};
