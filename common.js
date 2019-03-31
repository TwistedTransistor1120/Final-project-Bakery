let d = document,
    headerActiveClass = document.getElementById("nav");

document.getElementById ("jsBurger")
  .addEventListener("click", function() {
      headerActiveClass.classList.toggle("nav_mobile");
  });

window.addEventListener("resize", function() {
    if(window.innerWidth >= 510) {
        headerActiveClass.classList.remove("nav_mobile")
    }
});

let cartContainer = document.getElementById('js-cart');
    cart = document.getElementById('js-counter');
    cartInitialValue = localStorage.getItem("cartData");    
if(cartInitialValue) {
    cartContainer.innerText = cartInitialValue;
} else cartContainer.innerText = 0;

cartAnimate();

function cartAnimate() {
    if (cartContainer.innerText !== '0') {
        cart.style.animation = 'cartAnim 7s infinite';
        cart.children[1].style.color = 'red';
        cart.children[1].style.fontWeight = 'bold';
    } else {
        cart.style.animation = 'none';
        cart.children[1].style.color = 'black';
        cart.children[1].style.fontWeight = '';
        
    }
};

