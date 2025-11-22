//elements DOM
const searchInput= document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const keywords= document.querySelectorAll('.keyword');
const categories = document.querySelectorAll('.categorie');
const gallery = document.getElementById('gallery');
const pagination = document.getElementById('pagination');
const modal= document.getElementById('modal');
const modalImg= document.getElementById('modal-img');
const modalTiltle= document.getElementById('modal-title');
const modalAuthor= document.getElementById('modal-author');
const closeModal= document.getElementById('close-modal');
const prevPhoto= document.getElementById('prev-photo');
const nextPhoto= document.getElementById('next-photo');
//variables globales
let currentCategory='';
let currentPage=1;
let currentQuery='';
let allPhotos=[];
let currentPhotoIndex=0
const accessKey='uru47N7ZvdeLYy2xqLJAZprS5nU9VeLMYmi7oVdecxg';
//initialisation et l'ajout des evenements 
document.addEventListener('DOMContentLoaded',()=>{
    fetchPhotos();//recuperation des photos de la categorie All car elle est selectionnee par defaut
    searchBtn.addEventListener('click',performSearch);//effectuer une recherche en cliquant sur 🔎
    searchInput.addEventListener('keypress',(e)=>{
        if(e.key === 'Enter') performSearch();
    });//effectuer une recherche en click sur l'entrer
    keywords.forEach(keyword => { keyword.addEventListener('click',()=>{
        searchInput.value = keyword.textContent;//recuperation du texte du mot-clé cliqué
        performSearch();//faire la recherche
    });
});
categories.forEach(categorie => {
    categorie.addEventListener('click',() => {
        //reinitialiser la recherche quand on clique sur une categorie
        currentQuery = ''; 
        searchInput.value= '';

        categories.forEach(c => c.classList.remove('active'));//desactiver les categories
        categorie.classList.add('active');//activer la categorie cliquee
        currentCategory = categorie.dataset.category ;//recuperer la categorie cliquee
        currentPage = 1
        fetchPhotos()
    });

});
//fermeture de model en cliquant sur ❌
closeModal.addEventListener('click',()=>{
    modal.classList.remove('active');
});
//
prevPhoto.addEventListener('click',showPrevPhoto);//showPrevPhoto est la fonction qui permet d'afficher la photo précédente en cliquant sur◀️
nextPhoto.addEventListener('click',showNextPhoto);//showNextPhoto est la fonction qui permet d'afficher la photo suivante en cliquant sur▶️
 
});
//fonction pour effectuer une recherche
function performSearch(){
    currentQuery=searchInput.value.trim();//recuperation de la valeur du champ de recherche en sypprimant les espaces au deb et a la fin
    // Réinitialiser la catégorie quand on fait une recherche manuelle
    currentCategory='';//Réinitialiser la catégorie
    categories.forEach(c=>c.classList.remove('active'));
    categories[0].classList.add('active'); // Réactiver "Tous"
    currentPage=1;//Réinitialiser la page à 1
    fetchPhotos();//Récupérer les photos  
}
//fonction pour recupere les photos depuis l'API Unsplash
async function fetchPhotos(){
    try{
        gallery.innerHTML='<div class="loading">chargement des photos...</div>'
        let url;
        if(currentQuery){
            url=`https://api.unsplash.com/search/photos?page=${currentPage}&per_page=20&query=${encodeURIComponent(currentQuery)}`;
        }
        else if(currentCategory){
            url=`https://api.unsplash.com/search/photos?page=${currentPage}&per_page=20&query=${encodeURIComponent(currentCategory)}`;
        }else{
            url=`https://api.unsplash.com/photos?page=${currentPage}&per_page=20&order_by=popular`;
        }
        console.log('url appelée :',url);
        const reponse=await fetch(url,{
            headers:{
                'Authorization':`Client-ID ${accessKey}`
            }
        });
        if(!reponse.ok){
            throw new Error('Erreur lors de la recupereation des photos');
        }
        const data = await reponse.json();
        if(currentCategory || currentQuery){
            allPhotos=data.results;
        }else{
            allPhotos=data;
        }
        displayPhotos();
        setupPagination();
    }catch(error){
        console.error('Erreur :',error);
        gallery.innerHTML='<div class="loading">Erreur lors du chargement des photos.Veuillez réessayer</div>';
    }
}
function displayPhotos(){
    gallery.innerHTML='';
    if(allPhotos.length===0){
        gallery.innerHTML='<div class="loading">Aucun photo trouvee.Essayez une autre recherche.</div>';
        return;
    }
    allPhotos.forEach((photo,index)=>{
        const photoCard=document.createElement('div');
        photoCard.className='photo-card';
        photoCard.innerHTML=`
        <img src="${photo.urls.small}" alt="${photo.alt_description || 'photo Unsplash'}">
        <h3>${photo.alt_description || 'sans titre'}</h3>
        <p>Par ${photo.user.name}</p>
        </div>`;
        photoCard.addEventListener('click',()=>{
            openModal(index);
        });
        gallery.appendChild(photoCard);
    });
}
function setupPagination(){
    pagination.innerHTML='';
    const totalPages=5;
    for(let i=1;i<=totalPages;i++){
        const pageBtn=document.createElement('button');
        pageBtn.className='page-btn';
        if(i===currentPage){
            pageBtn.classList.add('active');
        }
        pageBtn.textContent =i;
        pageBtn.addEventListener('click',()=>{
            currentPage=i;
            fetchPhotos();
        });
        pagination.appendChild(pageBtn);
    }
}
        function openModal(index) {
            currentPhotoIndex = index;
            const photo = allPhotos[currentPhotoIndex];
            
            modalImg.src = photo.urls.regular;
            modalTitle.textContent = photo.alt_description || 'Sans titre';
            modalAuthor.textContent = `Par ${photo.user.name}`;
            
            modal.classList.add('active');
        }

        // Fonction pour afficher la photo précédente
        function showPrevPhoto() {
            currentPhotoIndex = (currentPhotoIndex - 1 + allPhotos.length) % allPhotos.length;
            const photo = allPhotos[currentPhotoIndex];
            
            modalImg.src = photo.urls.regular;
            modalTitle.textContent = photo.alt_description || 'Sans titre';
            modalAuthor.textContent = `Par ${photo.user.name}`;
        }

        // Fonction pour afficher la photo suivante
        function showNextPhoto() {
            currentPhotoIndex = (currentPhotoIndex + 1) % allPhotos.length;
            const photo = allPhotos[currentPhotoIndex];
            
            modalImg.src = photo.urls.regular;
            modalTitle.textContent = photo.alt_description || 'Sans titre';
            modalAuthor.textContent = `Par ${photo.user.name}`;
        }
