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
const accessKey='uru47N7ZvdeLYy2xqLJAZprS5nU9VeLMYmi7oVdecxg';
//initialisation et l'ajout des evenements 
document.addEventListener('DOMcontentLoaded',()=>{
    fetchPhotos();//recuperation des photos de la categorie All car elle est selectionnee par defaut
    searchBtn.addEventListener('click',performSearch);//effectuer une recherche en cliquant sur 🔎
    searchInput.addEventListener('keypress',(e)=>{
        if(e.key === 'Enter') performSearch();
    });//effectuer une recherche en click sur l'entrer
    keywords.forEach(keyword => { keywords.addEventListener('click',()=>{
        searchInput.value = keyword.textcontent;//recuperation du texte du mot-clé cliqué
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
        currentCategory = category.dataset.category ;//recuperer la categorie cliquee
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

 