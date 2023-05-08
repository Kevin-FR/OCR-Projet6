"use strict"
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
    getData(api_url, 'categories');
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
      for (let gallery of dataWorks) {
        showGallery.insertAdjacentHTML('beforeend', `
              <figure data-category-id="${gallery.category.id}">
                <img src="${gallery.imageUrl}" alt="${gallery.title}">
                <figcaption>${gallery.title}</figcaption>
              </figure>
          `);
      }
    } else {
      // Afficher uniquement en fonction de l'id
      for (let gallery of dataWorks) {
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
  
    for (const category of dataCategories) {
      if (categoryID === category.id) {
        btnCategories.insertAdjacentHTML('beforeend', `<li class="category__filter category__filter--active" data-category-id="${category.id}">${category.name}</li>`);
      } else {
        btnCategories.insertAdjacentHTML('beforeend', `<li class="category__filter" data-category-id="${category.id}">${category.name}</li>`);
      }
    }
  }
  








  // Afficher les "works" si on est sur l'index
  if (btnCategories) { displayGalleries() }

  
    // LOGOUT
    const handleLogout = () => {
        window.localStorage.removeItem("auth");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userId");
        window.location.reload(true);
        window.location.replace('/');
      };

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