//Api
const api_url = "http://localhost:5678/api/";
const btnCategories = document.getElementById('gallery_filter');
const showGallery = document.querySelector(".gallery");
const btnNavLogin = document.getElementById('btnLogin');

const getData = async (api_url, targetKey) => {
  fetch(api_url + targetKey)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if(targetKey === "categories"){displayBtnCategories(data)}
      if(targetKey === "works"){
        displayGalleries(data)
        displayModalGalleries(data)
      }
    }).catch((err) => {
      console.log(err);
    });
}

if (showGallery) { getData(api_url, "works") }


const displayGalleries = (galleries) => {
  for (gallery of galleries) {
    showGallery.insertAdjacentHTML('beforeend', `
        <figure data-category-id="${gallery.category.id}">
          <img src="${gallery.imageUrl}" alt="${gallery.title}">
          <figcaption>${gallery.title}</figcaption>
        </figure>
    `);
  }
}

const displayBtnCategories = (categories) => {
  btnCategories.insertAdjacentHTML('beforeend', `<li class="category__filter category__filter--active" data-category-id="0">Tous</li>`);
    for (category of categories) {
      //console.log(category); 
      btnCategories.insertAdjacentHTML('beforeend', `<li class="category__filter" data-category-id="${category.id}">${category.name}</li>`);
    }
}

btnCategories.addEventListener("click", (event) => {
  const galleries = document.querySelectorAll('figure');
  if(event.target.tagName == 'LI'){
    for (gallery of galleries) {
      if (event.target.dataset.categoryId === "0") {
        gallery.style.display = "";
      } else {
        if (gallery.dataset.categoryId == event.target.dataset.categoryId) {
          gallery.style.display = "";
        } else {
          gallery.style.display = "none";
        }
      };
      //console.log("Boucle gallery:" + gallery.dataset.categoryId);
    }
  }


});



const handleLogout = () => {
  window.localStorage.clear();
  window.location.reload(true);
  window.location.replace('/');
};


if(localStorage.getItem("auth") === "1"){
const adminNav = document.querySelector('body');

adminNav.insertAdjacentHTML("beforebegin", `
<nav class="admin__nav admin__nav--connected">
  <ul>
    <li>Mode édition</li>
    <li>Publier les changements</li>
  </ul>
</nav>
`);

btnNavLogin.innerText = `Logout`;
btnNavLogin.setAttribute('href', '#logout');
btnNavLogin.addEventListener("click", (e)=> {handleLogout()});

const btnPortfolio = document.querySelector('.portfolio__title h2');
btnPortfolio.insertAdjacentHTML('afterend', '<i class="fa-solid fa-pen-to-square"></i><span>Modifier</span>')

}else{
if (btnCategories) { getData(api_url, "categories") }
adminNav.classList.remove('admin__nav--connected')
}




//Modal
const btnPortfolioModify = document.querySelector('.portfolio__title span');
const modal = document.getElementById("portfolioModal");
btnPortfolioModify.addEventListener('click', (e) => {
  modal.style.display = "block";
})

const modalClose = document.getElementsByClassName("portfolio__modal__close")[0];
modalClose.onclick = function() {
  modal.style.display = "none";
}

const displayModalGalleries = (galleries) => {
  const modalGalleries = document.querySelector('.portfolio__modal__galleries');
  for (gallery of galleries) {
    modalGalleries.insertAdjacentHTML('beforeend', `
    <div class="portfolio__modal__gallery">
    <div class="portfolio__modal__gallery__image">
      <div class="portfolio__modal__gallery__icons">
          <i class="fa-regular fa-trash-can" data-gallery-id="${gallery.id}"></i>
          <i class="fa-solid fa-up-down-left-right"></i> 
      </div>
          <img src="${gallery.imageUrl}" alt="${gallery.title}">
    </div>
          <a href="#edit-gallery-id-${gallery.id}">Editer</a>
      </div>
    `);
    
  }
  const modalBtnDeleteGalleries = document.querySelectorAll('.fa-trash-can');
  for( btnDeleteGallery of modalBtnDeleteGalleries){
    const galleryId = btnDeleteGallery.dataset.galleryId;
    btnDeleteGallery.addEventListener('click', (e) =>{
      console.log(galleryId);
    })
  }
}


