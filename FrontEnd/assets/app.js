//Api
const api_url = "http://localhost:5678/api/";
const btnCategories = document.getElementById('gallery_filter');
const showGallery = document.querySelector(".gallery");

const getData = async (api_url, targetKey) => {
  fetch(api_url + targetKey)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if(targetKey === "categories"){displayBtnCategories(data)}
      if(targetKey === "works"){displayGalleries(data)}
    }).catch((err) => {
      console.log(err);
    });
}

if (btnCategories) { getData(api_url, "categories") }
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
  


  //console.log("Click event:" + event.target.id);

});
//console.log(btnCategories);






