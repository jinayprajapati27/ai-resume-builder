document.addEventListener('DOMContentLoaded', () => {
    // This file now only handles global UI interactions for the landing page.
    // Form handling and Preview rendering have been moved to form.ejs and preview.ejs
    // to avoid script conflicts.

    const formModal = document.getElementById('formModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            formModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            formModal.classList.remove('active');
            document.body.style.overflow = 'unset';
        });
    }
});
