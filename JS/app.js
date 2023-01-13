let bannerRef = document.getElementById('banner');
let productListRef = document.getElementById('productList');
let cartCountRef = document.getElementById('cartCount');
let modal = document.getElementById('myModal');
let btn = document.getElementById('myBtn');
let span = document.getElementsByClassName('close')[0];
let cartItemsRef = document.getElementById('cartItems');
let totalPriceRef = document.getElementById('totalPrice');

let apiKey = '156fc1cbb7msh6a09f6c30732e6fp18eb6fjsnc25b04a66295';
let domain = 'https://asos2.p.rapidapi.com/';
let productList = [];
let arr = [
  {
    id: 1,
    image: 'banner1',
  },
  {
    id: 2,
    image: 'banner2',
  },
  {
    id: 3,
    image: 'banner3',
  },
  {
    id: 1,
    image: 'banner4',
  },
];

let cartItems = [];

let currImageCount = 0;
updateBanner();
getProductList();

$('#leftArr').click(function () {
  if (currImageCount) {
    currImageCount--;
    updateBanner();
  }
});

$('#RightArr').click(function () {
  if (currImageCount <= 3) {
    currImageCount++;
    updateBanner();
  }
});

function updateBanner() {
  $('#bannerImage').fadeOut(200);
  $('#bannerImage').fadeIn(200);
  $('#bannerImage').attr(
    'src',
    `./assets/images/${arr[currImageCount].image}.png`
  );
}

// function updateCart() {

// }

function getProductList() {
  fetch(
    `${domain}products/v2/list?store=US&offset=0&categoryId=4209&limit=15&country=US&sort=freshness&currency=USD&sizeSchema=US&lang=en-US`,
    {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'asos2.p.rapidapi.com',
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      generateProductList(data?.products);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function generateProductList(products) {
  productListRef.innerHTML = '';
  let temp = null;
  productList = products;
  products.forEach((element, i) => {
    temp = element;
    productListRef.innerHTML += ` <li class="product">
    <img class="img" src="https://${element.imageUrl}" />
    <h3 class="title-info">
        <div class="title">${element.name}</div>
    </h3>
    <div class="desc-container">
      <div class="desc-section">
        <p class="desc">${element.brandName}</p>
        <div class="rating"><img src="./assets/images/rating-final.png"></div>
      </div>
      <div class="price">${element.price.current.text}</div>
    </div>
    <div class="addToCart">
        <button type="button" onclick="updateCart('${i}');">Add to cart</button>
    </div>
</li>`;
  });
}

function updateCart(index) {
  cartItems.push(productList[index]);
  cartCountRef.innerHTML = `(${cartItems.length})`;
}

function clearCartItem(index) {
  cartItems.splice(index, 1);
  generateCardUI();
}

function clearAllCart() {
  cartItems = [];
  generateCardUI();
}

cartCountRef.onclick = function () {
  modal.style.display = 'block';
  generateCardUI();
};

span.onclick = function () {
  modal.style.display = 'none';
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

function generateCardUI() {
  cartItemsRef.innerHTML = !cartItems.length
    ? `<span>Please add items in your cart</span>`
    : '';
  cartItems.forEach((element, i) => {
    cartItemsRef.innerHTML += `<li class="product">
    <div class="image">
        <img src="https://${element.imageUrl}" />
    </div>
    <div class="info">
        <h3 class="title">${element.name}</h3>
        <p class="desc">${element.brandName}</p>
        <div class="price">${element.price.current.text}</div>
    </div>
    <div class="remove" onclick= "clearCartItem(${i})">x</div>
  </li>`;
  });
  totalCartPrice();
}

function totalCartPrice() {
  totalPriceRef.innerHTML = '$0';
  let totalCount = 0;
  cartItems.forEach((element, i) => {
    totalCount += element.price.current.value;
  });
  totalPriceRef.innerHTML = '$' + totalCount;
}
