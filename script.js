document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-galerie');
    const modalImage = modal.querySelector('.modal-image');
    const modalCompteur = modal.querySelector('.modal-compteur');
    const btnPrecedent = modal.querySelector('.modal-precedent');
    const btnSuivant = modal.querySelector('.modal-suivant');

    let imagesCourantes = [];
    let indexCourant = 0;
    let dernierElementFocus = null;

    function afficherImage() {
        modalImage.src = imagesCourantes[indexCourant];
        modalImage.alt = `Photo ${indexCourant + 1} sur ${imagesCourantes.length}`;
        modalCompteur.textContent = `${indexCourant + 1} / ${imagesCourantes.length}`;

        const plusieursImages = imagesCourantes.length > 1;
        btnPrecedent.hidden = !plusieursImages;
        btnSuivant.hidden = !plusieursImages;
    }

    function imageSuivante() {
        indexCourant = (indexCourant + 1) % imagesCourantes.length;
        afficherImage();
    }

    function imagePrecedente() {
        indexCourant = (indexCourant - 1 + imagesCourantes.length) % imagesCourantes.length;
        afficherImage();
    }

    function ouvrirModal(images, indexDepart, elementDeclencheur) {
        imagesCourantes = images;
        indexCourant = indexDepart;
        dernierElementFocus = elementDeclencheur;

        afficherImage();
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        modal.querySelector('.modal-fermer').focus();
    }

    function fermerModal() {
        modal.hidden = true;
        document.body.style.overflow = '';
        if (dernierElementFocus) {
            dernierElementFocus.focus();
        }
    }

    // Ouverture de la galerie au clic sur l'image d'une carte
    document.querySelectorAll('.carte').forEach((carte) => {
        const bouton = carte.querySelector('.carte-image-btn');
        if (!bouton) return;

        const imagesAttr = carte.dataset.images;
        const images = imagesAttr
            ? imagesAttr.split(',').map((src) => src.trim()).filter(Boolean)
            : [carte.querySelector('img').src];

        bouton.addEventListener('click', () => ouvrirModal(images, 0, bouton));
    });

    // Navigation
    btnSuivant.addEventListener('click', imageSuivante);
    btnPrecedent.addEventListener('click', imagePrecedente);

    // Fermeture (bouton fermer + clic sur le fond)
    modal.querySelectorAll('[data-fermer]').forEach((el) => {
        el.addEventListener('click', fermerModal);
    });

    // Clavier : flèches gauche/droite, Echap
    document.addEventListener('keydown', (evenement) => {
        if (modal.hidden) return;

        if (evenement.key === 'Escape') fermerModal();
        if (evenement.key === 'ArrowRight') imageSuivante();
        if (evenement.key === 'ArrowLeft') imagePrecedente();
    });

    // Glisser au doigt sur mobile/tactile
    let positionDepartX = null;

    modal.addEventListener('touchstart', (evenement) => {
        positionDepartX = evenement.changedTouches[0].clientX;
    });

    modal.addEventListener('touchend', (evenement) => {
        if (positionDepartX === null) return;

        const positionFinX = evenement.changedTouches[0].clientX;
        const difference = positionFinX - positionDepartX;

        if (Math.abs(difference) > 40) {
            difference < 0 ? imageSuivante() : imagePrecedente();
        }

        positionDepartX = null;
    });

    // ---------- Barre de recherche ----------
    const barreRecherche = document.getElementById('recherche-produit');
    const cartes = document.querySelectorAll('.carte'); // il manquait le "." devant carte

    barreRecherche.addEventListener('input', () => {
        const terme = barreRecherche.value.toLowerCase();

        cartes.forEach((carte) => {
            const texte = carte.textContent.toLowerCase();

            // "flex" et pas "block" : c'est l'affichage utilisé par .carte dans le CSS,
            // "block" cassait la mise en page interne de la carte (photo/titre/prix/bouton empilés).
            carte.style.display = texte.includes(terme) ? 'flex' : 'none';
        });
    });
});