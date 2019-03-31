document.getElementById('js-counter')
.addEventListener('click', () => {
	sessionStorage.setItem("fromAnotherPage", "1"); 
	window.location='products.html';
});