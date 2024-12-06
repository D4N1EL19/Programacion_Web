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