//Api
const api_url = "http://localhost:5678/api/";
const btnCategories = document.getElementById('gallery_filter');
const showGallery = document.querySelector(".gallery");
const btnNavLogin = document.getElementById('btnLogin');
let dataWorks = window.localStorage.getItem("works");
let dataCategories = window.localStorage.getItem("categories");


const getData = async (api_url, api_Name) => {
  fetch(api_url + api_Name)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Suppression des données existantes
      window.localStorage.removeItem(api_Name);
      const jsonData = JSON.stringify(data);
      //Stockage des données
      window.localStorage.setItem(api_Name, jsonData);
    }).catch((err) => {
      console.log(err);
    });
}



// Suppression des données Work et Catégories
const clearData = () => {
  window.localStorage.removeItem('works');
  window.localStorage.removeItem('categories');
  getData(api_url, 'works');
  //dataWorks = JSON.parse(dataWorks);
  getData(api_url, 'categories');
  //dataCategories = JSON.parse(dataCategories);
}

// Get all work
if (!dataWorks || !dataCategories) {
  clearData();
} else {
  dataWorks = JSON.parse(dataWorks)
  dataCategories = JSON.parse(dataCategories)
}

// Supprimer une categorie
const deleteGallery = async (galleryId) => {
  fetch(api_url + 'works/' + galleryId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/Json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then((res) => {
      console.log(res);
      clearData();
    }).catch((err) => {
      console.log(err);
    });
}







// Afficher les Work

const displayGalleries = (idCat = 0) => {
  showGallery.innerHTML = '';
  // Afficher tous
  if (idCat === 0) {
    for (gallery of dataWorks) {
      showGallery.insertAdjacentHTML('beforeend', `
            <figure data-category-id="${gallery.category.id}">
              <img src="${gallery.imageUrl}" alt="${gallery.title}">
              <figcaption>${gallery.title}</figcaption>
            </figure>
        `);
    }
  } else {
    // Afficher uniquement en fonction de l'id
    for (gallery of dataWorks) {
      if (gallery.category.id === idCat) {
        showGallery.insertAdjacentHTML('beforeend', `
                <figure data-category-id="${gallery.category.id}">
                  <img src="${gallery.imageUrl}" alt="${gallery.title}">
                  <figcaption>${gallery.title}</figcaption>
                </figure>
            `);
      }
    }
  }
}

// Afficher les boutons de filtration des catégories 

const displayBtnCategories = (categoryID = 0) => {
  btnCategories.innerHTML = "";
  if (categoryID === 0) {
    btnCategories.insertAdjacentHTML('beforeend', `<li class="category__filter category__filter--active" data-category-id="0">Tous</li>`);
  } else {
    btnCategories.insertAdjacentHTML('beforeend', `<li class="category__filter" data-category-id="0">Tous</li>`);
  }

  for (category of dataCategories) {
    if (categoryID === category.id) {
      btnCategories.insertAdjacentHTML('beforeend', `<li class="category__filter category__filter--active" data-category-id="${category.id}">${category.name}</li>`);
    } else {
      btnCategories.insertAdjacentHTML('beforeend', `<li class="category__filter" data-category-id="${category.id}">${category.name}</li>`);
    }
  }
}



// Afficher les options categories dans la modal
const displayModalCategories = () => {
  const optionModalCategories = document.querySelector('#selectcategory')
  for (category of dataCategories) {
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



// LOGOUT
const handleLogout = () => {
  window.localStorage.removeItem("auth");
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("userId");
  window.location.reload(true);
  window.location.replace('/');
};

// Afficher les "works" si on est sur l'index
if (btnCategories) { displayGalleries() }

// SI Utilisateurs connecter
// Récupération du body pour inserer la Navbar
const adminNav = document.querySelector('body');

if (localStorage.getItem("auth") === "1") {
  adminNav.insertAdjacentHTML("beforebegin", `
  <nav class="admin__nav admin__nav--connected">
    <ul>
      <li>Mode édition</li>
      <li class="btn__publish">Publier les changements</li>
    </ul>
  </nav>
  `);

  btnNavLogin.innerText = `Logout`;
  btnNavLogin.setAttribute('href', '#logout');
  btnNavLogin.addEventListener("click", (e) => { handleLogout() });

  const btnPortfolio = document.querySelector('.portfolio__title h2');
  btnPortfolio.insertAdjacentHTML('afterend', '<i class="fa-solid fa-pen-to-square"></i><span>Modifier</span>')


  // Publier les changements session to db - A FAIRE
  const btnPublish = document.querySelector('btn__publish');


} else {
  // SI utilisateurs déconnecté
  displayBtnCategories();
  adminNav.classList.remove('admin__nav--connected')
}





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
  for (gallery of dataWorks) {
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
  for (btnDeleteGallery of modalBtnDeleteGalleries) {
    const galleryId = btnDeleteGallery.dataset.galleryId;
    btnDeleteGallery.addEventListener('click', (e) => {
      deleteGallery(galleryId);
      displayModalGalleries();
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
  <div class="modal__galleries__add">
    <i class="fa-regular fa-image"></i>
    <label id="image_input_label" for="image_input" class="modal__btn__label__picture">+ Ajouter photo</label>
    <input id="image_input" class="modal__btn__input__picture" type="file" accept="image/jpg, image/jpeg, image/png">
    <span>jpg, png : 4mo max</span>
  </div>
  <div class="modal__gallery__input__form">
    <label for="titleinput">Titre</label> 
    <input id="titleinput" name="titleinput" type="text">
    <label for="selectcategory">Catégorie</label>
    <select id="selectcategory" name="selectcategory" class="form-control">
    </select>
  </div>

  <div class="modal__btn">
  <input id="form_btn_submit" class="modal_btn_validate" type="submit" value="Valider">
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

    // Ajout dans la base de donnée
    const formAddGallery = {
      title: document.querySelector("#titleinput"),
      category: document.querySelector("#selectcategory"),
      submit: document.querySelector("#form_btn_submit")
    };

    formAddGallery.submit.addEventListener("click", (e) => {

      e.preventDefault();
      const addGallery = api_url + "works";

      fetch(addGallery, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          title: formAddGallery.title.value,
          category: formAddGallery.category.value * 1,
          image: imageInput.files[0],
        }),
      })
        .then((response) => { console.log(response); return response.json() })
        .then((data) => {
          console.log(data);
          if (data.error) {
            alert("Erreur dans le formulaire");
          } else {
            clearData();
            displayModalGalleries();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });




  })
}
