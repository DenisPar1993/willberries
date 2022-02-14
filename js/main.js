const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

//caart
const cartButton = document.querySelector('.button-cart');
const modalForm = document.querySelector('#modal-cart');
const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const showAcces = document.querySelector('.show-accessories');
const showClothing = document.querySelector('.show-clothing');
const closeModal = document.querySelector('.modal-close');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');
const cartCount = document.querySelector('.cart-count');
const cartClear = document.querySelector('.cart-clear');





const getGoods = async function (){
	const result = await fetch('db/db.json');
	if(!result.ok){
         throw 'Ошибка'
	}
	return await result.json();
}

const cart = {
	cartGoods: [
		// {
		// 	id: '099',
		// 	name: "Часы Dior",
		// 	price: 99,
		// 	count: 6,
		// },
		// {
		// 	id: '095',
		// 	name: "кеды nike",
		// 	price: 9,
		// 	count: 7,
		// }
	],
	 basketCount(){
		 cartCount.textContent= this.cartGoods.reduce((sum,item) =>{
		return sum +item.count
	   },0 )
	   
	 },

	 clearBasket(){
        this.cartGoods.length = 0;
		this.basketCount();
		this.renderCart();

	 },

	renderCart(){
		cartTableGoods.textContent = '';
		console.log(this);
		this.cartGoods.forEach(({id,name, price, count})=>{
           const trGoods = document.createElement('tr');
		   trGoods.className='cart-item';
		   trGoods.dataset.id=id;

		   trGoods.innerHTML = `
		            <td>${name}</td>
					<td>${price}$</td>
					<td><button class="cart-btn-minus">-</button></td>
					<td>${count}</td>
					<td><button class="cart-btn-plus">+</button></td>
					<td>${price*count}$</td>
					<td><button class="cart-btn-delete">x</button></td>
		   
		   `
		   cartTableGoods.append(trGoods);
		   
	});
	const totalPrice = this.cartGoods.reduce((sum,item)=>{
       return sum + item.price * item.count;
	}, 0)
	cardTableTotal.textContent = totalPrice + '$';
	
},
	deleteGood(id){
		this.cartGoods = this.cartGoods.filter(item => id!== item.id)
		console.log(this);
		this.renderCart();
	},
	minusGood(id){
		for(const item of this.cartGoods){
			console.log(this);
			if (item.id === id){
				if(item.count <=1){
					
					this.deleteGood(id)
				}else{
					item.count--;
					cartCount.textContent--;
				}
				
			}
			this.renderCart();
			this.basketCount();	
			
		}
	},
	plusGood(id){
		for(const item of this.cartGoods){
			if (item.id === id){
				item.count++;
				break;
			}
			
		}
		this.renderCart();
		this.basketCount();
	},
	addCartGoods(id){
		const goodItem = this.cartGoods.find(item => item.id ===id)
		console.log(goodItem);
		if(goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
			.then(data => data.find(item => item.id === id))
			.then(({id,name,price})=> {
				this.cartGoods.push({
					id,
					name,
					price,
					count: 1

				})
				this.basketCount();
			})
			
		}
		
	},
 

}
cartClear.addEventListener('click', ()=> {
	cart.clearBasket()
})



document.body.addEventListener('click', event => {
	const addToCart = event.target.closest('.add-to-cart');
	if(addToCart){
	  cart.addCartGoods(addToCart.dataset.id)

	}
})





cartTableGoods.addEventListener('click',event =>{
const target = event.target;
console.log(target);
if(target.tagName === 'BUTTON'){
	const id = target.closest('.cart-item').dataset.id
	if (target.classList.contains('cart-btn-delete')){
		cart.deleteGood(id);
	}
	if (target.classList.contains('cart-btn-plus')){
		cart.plusGood(id);
	}
	if (target.classList.contains('cart-btn-minus')){
		cart.minusGood(id);
	}
}


})

const offModal = () => {
	modalForm.classList.remove('show');
}

const showModal = ()=> {
	
	modalForm.classList.add('show');
	cart.renderCart();

}

cartButton.addEventListener('click', showModal);
closeModal.addEventListener('click', offModal);


//scroll
{
	const scrollLinks = document.querySelectorAll('a.scroll-link');
	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', event => {
			event.preventDefault();
			let id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				block: 'start',
				behavior: 'smooth',
			})
		})
	}
}


//view all



const createCard = function (objCard) {
  const card = document.createElement('div');
  card.className ='col-lg-3 col-sm-6';
  const {label, img, name, description, id, price} = objCard
  card.innerHTML = `
                        <div class="goods-card">
						${label ?`<span class="label">${label}</span>`: ''}
						<img src="db/${img}" alt="${name}" class="goods-image">
						<h3 class="goods-title">${name}</h3>
						<p class="goods-description">${description}</p>
						<button class="button goods-card-btn add-to-cart" data-id=${id}>
							<span class="button-price">$${price}</span>
						</button>
					</div>
  `
  return card;

}
 const renderCards = function(data){
	 longGoodsList.textContent = '';
	 const cards = data.map(createCard);
	 longGoodsList.append(...cards);
	 document.body.classList.add('show-goods');
 }
 more.addEventListener('click', event =>{
	 event.preventDefault();
	 getGoods().then(renderCards);

 })

 const filterCard = function (field, value){
	 getGoods()
	 .then(data=> data.filter(good=>good[field] === value))
	 .then(renderCards);
 }
//  filterCard('gender', 'Womens');

 navigationLink.forEach(function(link){
     link.addEventListener('click', event=>{
           event.preventDefault();
			const field = link.dataset.field;
			const value = link.textContent;
			if(!field){
				getGoods().then(renderCards)
			}else{
			filterCard(field, value)

		   } 
		   
	 })
 });

showAcces.addEventListener('click', event =>{
	event.preventDefault()
	filterCard("category","Accessories")
})

showClothing.addEventListener('click', event =>{
	event.preventDefault();
	filterCard("category","Clothing");
})

const modaleForm = document.querySelector('.modal-form');
console.log(modaleForm);

const postData = dataUser => fetch('server.php', {
	method: 'POST',
	body: dataUser
});


modaleForm.addEventListener('submit', event =>{
	event.preventDefault();
	const formData = new FormData(modaleForm);
	formData.append('cart', JSON.stringify(cart.cartGoods));
	postData(formData)
	     .then(response =>{
			 if(!response.ok){
				 throw new Error(response.status);
			 }
			 alert('Ваш заказ успекшно отправлен');
		 } )
		 .catch(err => {
			 alert('Произошла ошибка');
			 console.error(err);
		 })
		 .finally(()=>{
			 offModal();
			 modaleForm.reset();
			 cart.cartGoods.length = 0;
		 })
	
})
 