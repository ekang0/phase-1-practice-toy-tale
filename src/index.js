let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  //Add Toy Info to the Card
  function toyCardCreate(toy) {
    const toyCollection = document.getElementById('toy-collection');
    //take out for of because caused issue when creating/adding a new toy. Instead add a foreach into the initial fetch of the toys to create the cards. 
    //for (const toy of data) {
      //console.log(toy);
      const toyCreate = document.createElement('div');
      toyCreate.className = 'card';
      //h2 tag with the toy's name
      const toyNameCreate = document.createElement('h2');
      toyNameCreate.innerText = toy.name;
      toyCreate.appendChild(toyNameCreate);
      //img tag with the src of the toy's image attribute and the class name "toy-avatar"
      const imageCreate = document.createElement('img');
      imageCreate.src = toy.image;
      imageCreate.className = 'toy-avatar';
      toyCreate.appendChild(imageCreate);
      //p tag with how many likes that toy has
      const likes = document.createElement('p');
      likes.id = toy.name;
      let toyLikes = toy.likes;
      if (toyLikes > 1) {
        likes.innerText = `${toyLikes} likes`;
      } else if (toyLikes === 1){
        likes.innerText = `${toyLikes} like`;
      } else if (toyLikes === 0){
        likes.innerText = `${toyLikes} likes`;
      };
      toyCreate.appendChild(likes);
      //button tag with a class "like-btn" and an id attribute set to the toy's id number
      const likeBtn = document.createElement('button');
      likeBtn.className = 'like-btn';
      likeBtn.id = toy.id;
      likeBtn.innerText = 'like';
      likeBtn.addEventListener('click', (e) => {
        //console.log('working event listener likeBtn');
        const id = e.target.id;
        const toyElement = likeBtn.parentElement;
        const currentLikes = toyElement.querySelector('p').innerText;
        const likeNumber = currentLikes.split(' ')[0];
        const addNewLike = parseInt(likeNumber) + 1 ;
        let newLikeTotal = {
          likes: addNewLike
        }
        //console.log(toyCreate);
        patchAddLike(id, newLikeTotal)
      });


      toyCreate.appendChild(likeBtn);
      //add ike function
      //addLike(likeBtn);
      toyCollection.appendChild(toyCreate);
  };

  //Fetch Andy's Toys
  fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(data => {
    //console.log(data);
    //console.log(typeof data);
    //Add Toy Info to the Card
    data.forEach(toy => toyCardCreate(toy))
  });

  //Add a New Toy
  const addToyForm = document.querySelector('form');
  //console.log(addToyForm);
  addToyForm.addEventListener('submit', (e) => {
    //e.preventDefault();
    //console.log(e.target);
    const nameInput = document.querySelector('input[name="name"]');
    //console.log(nameInput);
    const imageInput = document.querySelector('input[name="image"]');
    //console.log(imageInput.value);
    let toyObj = {
      name: nameInput.value,
      image: imageInput.value,
      likes: 0
    };
    //POST function
    newAnimalPostFetch(toyObj);
  });

  function newAnimalPostFetch(toyObj){
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(toyObj)
    })
    .then(response => response.json())
    .then(data => {
      //console.log(data)
      //console.log(typeof data)
      toyCardCreate(data)
    })
  };
  


//PATCH request to update likes
function patchAddLike(id, newLikeTotal){
  //console.log(id);
  //console.log(newLikeTotal);
  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(newLikeTotal)
  })
  .then(response => response.json())
  .then(data => {
    //console.log(data);
    //wasn't working at first because I was grabbing the first p so it was only updating woody. I had to update updateParaLikes to select the correct p for the specified id. I added an id to the para at p creation and then updateParaLikes to the ID of the correct toy character. 
    //const updateParaLikes = document.querySelector('div.card p');
    const updateParaLikes = document.getElementById(data.name);
    //console.log(updateParaLikes);
    //console.log(data.likes)
    let currentNumberLikesString = updateParaLikes.innerText.split(' ')[0];
    let currentNumberLikesStringToNum = parseInt(currentNumberLikesString) ;
    currentNumberLikesStringToNum = data.likes;
    //let newUpdatedNumLikes = currentNumberLikesStringToNum.toString();
    //currentNumberLikesString = newUpdatedNumLikes;
    let toyLikes = currentNumberLikesStringToNum;
    if (toyLikes > 1) {
      updateParaLikes.innerText = `${toyLikes} likes`;
    } else if (toyLikes === 1){
      updateParaLikes.innerText = `${toyLikes} like`;
    } else if (toyLikes === 0){
      updateParaLikes.innerText = `${toyLikes} likes`;
    };
  })
};

});

