// Afficher les options categories dans la modal
const displayModalCategories = () => {
    const optionModalCategories = document.querySelector('#selectcategory')
    for (let category of dataCategories) {
      optionModalCategories.insertAdjacentHTML('beforeend', `<option value="${category.id}">${category.name}</option>`);
    }
  }
  
  // Récupération des boutons "catégories" pour filter les "works"
  btnCategories.addEventListener("click", (event) => {
    const galleries = document.querySelectorAll('figure');
    if (event.target.tagName == 'LI') {
      displayGalleries(event.target.dataset.categoryId * 1);
      displayBtnCategories(event.target.dataset.categoryId * 1);
    }
  });



  
  /////////////////////////////////
  // MODAL
  /////////////////////////////////
  // Bouton sniffer pour ouvrir la modal
  const btnPortfolioModify = document.querySelector('.portfolio__title span');
  // Partie d'insertion de la modal
  const modal = document.getElementById("Modal");
  // Afficher la modale en cliquant sur modifier
  if (btnPortfolioModify) {
    btnPortfolioModify.addEventListener('click', (e) => {
      modal.style.display = "block";
      displayModalGalleries();
    })
  }
  
  // Fermeture de la modal
  const modalClose = document.getElementsByClassName("modal__close")[0];
  modalClose.onclick = function () {
    modal.style.display = "none";
    window.location.reload();
  }
  // Afficher la structure de la gallerie - modal
  const modalContent = document.querySelector('.modal__content');
  
  const displayModalGalleries = () => {
    modalContent.innerHTML = '';
    modalContent.insertAdjacentHTML('beforeend', `
    <h2>Galerie photo</h2>
    <div class="modal__galleries"></div>
    <div class="modal__btn">
      <button class="modal_btn_add">Ajouter une photo</button>
      <a class="modal_btn_delete">Supprimer la galerie</a>
  </div>
    `);
    // Afficher le contenue de la gallerie - modal
    const modalGalleries = document.querySelector('.modal__galleries');
    for (let gallery of dataWorks) {
      modalGalleries.insertAdjacentHTML('beforeend', `
  
      <div class="modal__gallery">
      <div class="modal__gallery__image">
        <div class="modal__gallery__icons">
            <i class="fa-regular fa-trash-can" data-gallery-id="${gallery.id}"></i>
            <i class="fa-solid fa-up-down-left-right"></i> 
        </div>
            <img src="${gallery.imageUrl}" alt="${gallery.title}">
      </div>
            <a href="#edit-gallery-id-${gallery.id}">Editer</a>
        </div>
      `);
  
    }
    // Supprimer une gallery puis reload
    const modalBtnDeleteGalleries = document.querySelectorAll('.fa-trash-can');
    for (let btnDeleteGallery of modalBtnDeleteGalleries) {
      const galleryId = btnDeleteGallery.dataset.galleryId;
      btnDeleteGallery.addEventListener('click', (e) => {
        deleteGallery(galleryId);
        btnDeleteGallery.parentNode.parentNode.parentNode.remove(btnDeleteGallery);
      })
    }
  
    //Afficher le formulaire
    const modal__btn__add = document.querySelector('.modal_btn_add');
    modal__btn__add.addEventListener('click', (e) => {
      modalContent.innerHTML = '';
      modalContent.insertAdjacentHTML('beforeend', `
    <i class="fa-solid fa-arrow-left modal__arrow__left"></i>
    <h2>Ajout photo</h2>
    <div class="modal__galleries__preview">
      <image id="image_input_preview">
    </div>
    <form>
    <div class="modal__galleries__add">
      <i class="fa-regular fa-image"></i>
      <label id="image_input_label" for="image_input" class="modal__btn__label__picture">+ Ajouter photo</label>
      <input id="image_input" class="modal__btn__input__picture" name="image" type="file" accept="image/jpg, image/jpeg, image/png">
      <span>jpg, png : 4mo max</span>
    </div>
    <div class="modal__gallery__input__form">
      <label for="titleinput">Titre</label> 
      <input id="titleinput" name="title" type="text">
      <label for="selectcategory">Catégorie</label>
      <select id="selectcategory" name="category" class="form-control">
      </select>
    </div>
  
    <div class="modal__btn">
    <input id="form_btn_submit" class="modal_btn_validate" type="submit" value="Valider">
    </form>
  </div>
    `);
      // Afficher les options dans le formulaire
      displayModalCategories();
  
      //Fleche de retour
      const backArrow = document.querySelector('.modal__arrow__left');
      if (backArrow) {
        backArrow.addEventListener('click', (e) => {
          displayModalGalleries();
        })
      }
  
      // Preview de l'image
      let imageInput = document.querySelector('#image_input');
      let imagePreview = document.querySelector('#image_input_preview');
      let modalGalleriesAdd = document.querySelector(".modal__galleries__add");
      let modalPreview = document.querySelector(".modal__galleries__preview");
  
      imageInput.onchange = () => {
        modalGalleriesAdd.style.display = 'none';
        modalPreview.style.display = 'block';
        imagePreview.src = URL.createObjectURL(imageInput.files[0]);
      }
  
      
      

      const formSubmit = document.querySelector("#form_btn_submit");
      formSubmit.addEventListener("click", (e) => {
        // Ajout dans la base de donnée
      const formAddGallery = document.querySelector('.modal__content form');
      e.preventDefault();
      const addGallery = api_url + "works";
      let formData = new FormData(formAddGallery);
      console.log(formData);

      fetch(addGallery, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body:formData,
      })
        .then((response) => { 
          console.log(response);
          return response.json() })
        .then((data) => {
          console.log(data);
          if (data.error) {
            alert("Erreur - Merci compléter tout le formulaire");
          } else {
            clearData();
            setTimeout(function(){
                window.location.reload();
             }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      });
  
    })
  }
  