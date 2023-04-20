//Api
const api_url = "http://localhost:5678/api/";

// Connect API
// POST  -  /users/login   -  email - password
// GET -  /categories     - id - name
// GET -  /works
// POST - / works
// DELETE /works/{id}

const filterCategories = document.getElementById('gallery_filter');

fetch(api_url + 'categories')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let categories = data;
      filterCategories.insertAdjacentHTML('beforeend', `<div class="category__filter" id="category__filter__all">Tous</div>`);
        for (category of categories){
            console.log(category); 
        filterCategories.insertAdjacentHTML('beforeend', `<div class="category__filter" id="category__filter__`+ category.id + `">` + category.name +`</div>`);
        }

      
    })





// Show filter - 
// Get -> categories puis générer les btn des cats 

/*const showFilterCategories = () =>{
    filterCategories.insertAdjacentHTML('beforeend', "");


}
*/
//console.log(filterCategories);