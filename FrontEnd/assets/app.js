//Api
const api_url = "http://localhost:5678/api/";

// Connect API
// POST  -  /users/login   -  email - password
// GET -  /categories     - id - name
// GET -  /works
// POST - / works
// DELETE /works/{id}

const filterCategories = document.getElementById('gallery_filter');
const showGallery = document.querySelector(".gallery");

fetch(api_url + 'categories')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let categories = data;
      filterCategories.insertAdjacentHTML('beforeend', `<li class="category__filter category__filter--active" id="gallery_category_all">Tous</li>`);
        for (category of categories){
            //console.log(category); 
        filterCategories.insertAdjacentHTML('beforeend', `<li class="category__filter" id="gallery_category_`+ category.id + `">` + category.name +`</li>`);
        }

      
    });


    fetch(api_url + 'works')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let galleries = data;
        for (gallery of galleries){
            showGallery.insertAdjacentHTML('beforeend', `
            <figure class="gallery_category_`+ gallery.category.id +`">
              <img src="`+ gallery.imageUrl +`" alt="`+ gallery.title +`">
              <figcaption>`+ gallery.title +`</figcaption>
            </figure>
        `);
        }
    });

    
  filterCategories.addEventListener("click", (event) => {
      const galleries = document.querySelectorAll('figure');
      for(gallery of galleries){
        if(event.target.id === "gallery_category_all"){
          gallery.style.display = "";
        }else{
          if(gallery.getAttribute("class") == event.target.id){
              gallery.style.display = "";
            }else{
              gallery.style.display = "none";
            }
        };
      //console.log("Boucle gallery:" + gallery.getAttribute("class"));
      }
      
      
      //console.log("Click event:" + event.target.id);

    });
//console.log(filterCategories);