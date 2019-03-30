let products = [], productsOnCart = [], d = document, maxAmount = 30,
allProductsOnPage = document.getElementsByClassName("unitNewGoods");

/*___________________creating array of all products on page__________________________*/

for (let i=0; i < allProductsOnPage.length; i++) {
    products[i] = {};
    products[i]["unit"] = i+1;
    products[i]["name"] = allProductsOnPage[i].getElementsByClassName("nameNewUnit")[0].innerHTML;
    products[i]["dollars"] = (allProductsOnPage[i].getElementsByClassName("dollars")[0].innerHTML).slice(1,-1);
    products[i]["cents"] = allProductsOnPage[i].getElementsByClassName("cents")[0].innerHTML;
    products[i]["price"] = (Number(products[i]["dollars"])*100 + Number(products[i]["cents"]))/100;
    products[i]["amount"] = 0;
    products[i]["priceAmount"] = 0;
    products[i]["image"] = allProductsOnPage[i].getElementsByClassName("imageProduct")[0].getAttribute('src');
}
/*___________________________________________________________________________________________*/


/*_________________listeners on buttons_______________________________*/
buttons = document.getElementsByClassName("btnAddToCart");
for (let i=0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", addToCart);
}

let cart = document.getElementById("js-counter");
cart.addEventListener("click", createPaymentTable);
let clear = document.getElementById("js-btnClear");
clear.addEventListener("click", clearLocalStorage);
clear.addEventListener("click", orderDisappear);
let close = document.getElementById("js-closeOrderList");
close.addEventListener("click", orderDisappear);
let pay = document.getElementById("js-btnPay");
pay.addEventListener("click", payOrder);
/*_____________________________________________________*/


function createPaymentTable() {
    if (checkEmptyCard()) {showTablePay(); return};
    productsOnCart = products.slice(); 
    let sum = 0, pos, d = document;
    let productsInLocalStorage = localStorage.getItem("cartDataProduct");

    /*__________create array with products added______________*/
    for (let i=0; i < productsOnCart.length; i++) {
        pos = productsInLocalStorage.indexOf(productsOnCart[i]["name"]);
        if (pos > -1) {
            let count = 0;
            while (pos !== -1) {
                count ++;
                pos = productsInLocalStorage.indexOf(productsOnCart[i]["name"], pos + 1);
            };
            productsOnCart[i]["amount"] = count;
            productsOnCart[i]["priceAmount"] =  Math.round(productsOnCart[i]["price"]*100)*count/100;
            sum += productsOnCart[i]["priceAmount"];
        } else productsOnCart[i]["amount"] = 0;
    };
    sum = Math.round(sum*100)/100;
    /*_______________________________________________________*/

    /*_________________create modal window with products added______________*/
    let oldTable = d.getElementById('tablePay');
    if(oldTable) oldTable.remove();
    let table = d.createElement('table');
    table.setAttribute('id', 'tablePay');
    d.getElementById('wrapperTable').appendChild(table);
    
    for (let i=0; i < productsOnCart.length; i++) {
        if (productsOnCart[i]["amount"] > 0) {
            let tr, td0, td1, td2, td3, td4,
                btnDel, spanDel, image, btnInc, btnDec;
            tr = d.createElement('tr');
            td0 = d.createElement('td'); 
                btnDel = d.createElement('button'); 
                spanDel = d.createElement('span');
            td1 = d.createElement('td');
                image = d.createElement('img');
            td2 = d.createElement('td');
            td3 = d.createElement('td'); 
                btnDec = d.createElement('button'); 
                inputAmount = d.createElement('input');
                inputAmount.type = 'number';
                inputAmount.min = '1';
                inputAmount.max = maxAmount;
                inputAmount.title = 'max amount is ' + maxAmount;
                btnInc = d.createElement('button');
            td4 = d.createElement('td');
            
            table.appendChild(tr);
            tr.appendChild(td0); td0.classList.add('tdDelete');
                td0.appendChild(btnDel); btnDel.classList.add('btnDelProduct');
                btnDel.appendChild(spanDel); spanDel.classList.add('delete');
            tr.appendChild(td1); td1.classList.add('tdImage');
                td1.appendChild(image).setAttribute('src', productsOnCart[i]["image"]);
            tr.appendChild(td2); td2.classList.add('tdName'); td2.innerHTML = productsOnCart[i]["name"];
            tr.appendChild(td3); td3.classList.add('tdAmount'); 
                td3.appendChild(btnDec).innerHTML = '-'; btnDec.classList.add('btnDecrease');
                td3.appendChild(inputAmount); inputAmount.classList.add('inputAmount');
                td3.appendChild(inputAmount).value = productsOnCart[i]["amount"];
                td3.appendChild(btnInc).innerHTML = '+'; btnInc.classList.add('btnIncrease');
            tr.appendChild(td4); td4.classList.add('tdPriceAmount');
                td4.innerHTML = '$ ' + (Math.round(productsOnCart[i]["priceAmount"]*100)/100);
        }
    };

    let trLast = d.createElement('tr');
    let td0 = d.createElement('td'); td0.classList.add('tdTotal'); td0.innerHTML = "total";
    let td1 = d.createElement('td');
    let td2 = d.createElement('td');
    let td3 = d.createElement('td');
    let td4 = d.createElement('td'); td4.classList.add('tdSum'); td4.innerHTML = '$ '+sum;
    td0.colSpan = 4;
    table.appendChild(trLast);
    trLast.appendChild(td0);
    trLast.appendChild(td4);

    showTablePay();
    /*_____________________________________________________*/

    /* __________listeners in created modal widow_________________*/
    let decreaseButtons = d.getElementsByClassName('btnDecrease');
    let increaseButtons = d.getElementsByClassName('btnIncrease');
    let deleteButtons = d.getElementsByClassName('btnDelProduct');
    let inputButtons = d.getElementsByClassName('inputAmount');

    for (let i=0; i < decreaseButtons.length; i++) {
        decreaseButtons[i].addEventListener("click", decrease);
        increaseButtons[i].addEventListener("click", increase);
        deleteButtons[i].addEventListener("click", deleteProduct);
        inputButtons[i].addEventListener("input", changeInput);
    }        
    /*________________________________________________________*/

    /* EVENTS in modal window  - change amount in Input, increase 1 product, decrease 1 product, delete product */

    function changeInput(event) {
        event.currentTarget.onkeypress = (e)=> {
            e = e || event;
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            
            let chr = getChar(e);
            if (chr == null) return;
            
            if (chr < '0' || chr > '9') {
                return false;
            }
        }
        if (event.currentTarget.value > maxAmount) event.currentTarget.value = maxAmount;
        if (event.currentTarget.value === '0') event.currentTarget.value = 1;

        let currentProductElement =  event.currentTarget.parentElement.previousElementSibling,
        currentProduct = currentProductElement.innerHTML,
        price, currentAmount = event.currentTarget.value;

        for (let i=0; i<products.length; i++) {
            if(products[i]['name'] == currentProduct) {
                price = products[i]['price'];
                break;
            }
        }
        let amountPriceElement = event.currentTarget.parentElement.nextElementSibling;
        let amountPrice = Number(amountPriceElement.innerHTML.slice(2));
        let excess = Math.round((event.currentTarget.value*price - amountPrice)*100)/100;

        amountPriceElement.innerHTML = '$ '+ Math.round(price*event.currentTarget.value*100)/100;
        let totalSumElement = currentProductElement.parentElement.parentElement.lastChild.lastChild;
        let totalSum = Number(totalSumElement.innerHTML.slice(2)); 
        totalSumElement.innerHTML = '$ '+ Math.round((totalSum + excess)*100)/100;

        let cartLocalDataProduct = localStorage.getItem("cartDataProduct");
        let arrCartLocalDataProduct = cartLocalDataProduct.split(',');
        let arrCartLocalDataProductCopy = arrCartLocalDataProduct.slice();
        arrCartLocalDataProduct = [];
        for (let i=0; i < arrCartLocalDataProductCopy.length; i++) {
            if (arrCartLocalDataProductCopy[i] !== currentProduct) {
                arrCartLocalDataProduct.push(arrCartLocalDataProductCopy[i])
            }
        };
        for (let i=0; i < currentAmount; i++) {
            arrCartLocalDataProduct.push(currentProduct)
        };
        localStorage.setItem("cartDataProduct", arrCartLocalDataProduct.join(','));
        localStorage.setItem("cartData", arrCartLocalDataProduct.length);
        cartContainer.innerText = localStorage.getItem("cartData");
    } 
    
    function getChar(event) {
        if (event.which != 0 && event.charCode != 0) {
        if (event.which < 32) return null;
        return String.fromCharCode(event.which) 
        }
        return null; 
    }

    function decrease() {
        let currentProductElement = this.parentElement.previousElementSibling;
        let currentProduct = currentProductElement.innerHTML;
        let amountElement = this.nextElementSibling;
        let amount = Number(amountElement.value);
        if (amount == 1) return;
        let amountPriceElement = this.parentElement.nextElementSibling;
        let amountPrice = Number(amountPriceElement.innerHTML.slice(2));
        amountPriceElement.innerHTML = '$ '+ Math.round((amountPrice - amountPrice/amount)*100)/100;
        amountElement.value = amount-1;
        let totalSumElement = currentProductElement.parentElement.parentElement.lastChild.lastChild;
        let totalSum = Number(totalSumElement.innerHTML.slice(2)); 
        totalSumElement.innerHTML = '$ '+ Math.round((totalSum - amountPrice/amount)*100)/100;

        let cartLocalData = localStorage.getItem("cartData");
        if (cartLocalData) {
            localStorage.setItem("cartData", Number(cartLocalData)-1);
            cartContainer.innerText = localStorage.getItem("cartData");
        };

        let cartLocalDataProduct = localStorage.getItem("cartDataProduct");
        if (cartLocalDataProduct) {
            let currentProductLength =currentProduct.length;
            let pos1 = cartLocalDataProduct.indexOf(currentProduct);
            let pos2 = pos1 + currentProductLength+1;
            cartLocalDataProduct = cartLocalDataProduct.slice(0, pos1) + cartLocalDataProduct.slice(pos2);
            localStorage.setItem("cartDataProduct", cartLocalDataProduct);
            
        }
    }

    function increase() {
        let currentProductElement = this.parentElement.previousElementSibling;
        let currentProduct = currentProductElement.innerHTML;
        let amountElement = this.previousElementSibling;
        let amount = Number(amountElement.value);
        if (amount == maxAmount) return;
        let amountPriceElement = this.parentElement.nextElementSibling;
        let amountPrice = Number(amountPriceElement.innerHTML.slice(2));
        amountPriceElement.innerHTML = '$ '+ Math.round((amountPrice + amountPrice/amount)*100)/100;
        amountElement.value = amount + 1;
        let totalSumElement = currentProductElement.parentElement.parentElement.lastChild.lastChild;
        let totalSum = Number(totalSumElement.innerHTML.slice(2)); 
        totalSumElement.innerHTML = '$ '+  Math.round((totalSum + amountPrice/amount)*100)/100;

        let cartLocalData = localStorage.getItem("cartData");
        if (cartLocalData) {
            localStorage.setItem("cartData", Number(cartLocalData)+1);
            cartContainer.innerText = localStorage.getItem("cartData");
        };

        let cartLocalDataProduct = localStorage.getItem("cartDataProduct");
        if (cartLocalDataProduct) {
            cartLocalDataProduct = cartLocalDataProduct + ',' + currentProduct;
            localStorage.setItem("cartDataProduct", cartLocalDataProduct);
            
        }
    }

    function deleteProduct() {
        let currentProductElement = this.parentElement.nextElementSibling.nextElementSibling;
        let currentProduct = currentProductElement.innerHTML;
        let amountElement = currentProductElement.nextElementSibling.children[1];
        let amount = Number(amountElement.value);
        let amountPriceElement = currentProductElement.nextElementSibling.nextElementSibling;
        let amountPrice = Number(amountPriceElement.innerHTML.slice(2));
        let totalSumElement = currentProductElement.parentElement.parentElement.lastChild.lastChild;
        let totalSum = Number(totalSumElement.innerHTML.slice(2)); 
        totalSumElement.innerHTML = '$ '+ Math.round((totalSum - amountPrice)*100)/100;

        let cartLocalData = localStorage.getItem("cartData");
        if (cartLocalData) {
            localStorage.setItem("cartData", Number(cartLocalData)-amount);
            cartContainer.innerText = localStorage.getItem("cartData");
        }
    
        let cartLocalDataProduct = localStorage.getItem("cartDataProduct");
        if (cartLocalDataProduct) {
            let arrCurrentLocalStorage = cartLocalDataProduct.split(','),
                flag = 1;
            while (flag == 1) {
                flag = 0;
                for (let i=0; i < arrCurrentLocalStorage.length; i++) {
                    if (arrCurrentLocalStorage[i] == currentProduct) {
                        arrCurrentLocalStorage.splice(i,1);
                        flag = 1;
                        break;
                    }
                }
            }
            localStorage.setItem("cartDataProduct", arrCurrentLocalStorage.join(','));
        }
        

        let table = this.parentElement.parentElement.parentElement,
            rowDelete; 
        if (table.children.length == 2) {
            rowDelete = table.children[0];
            rowDelete.classList.add('flat');
            setTimeout(()=>{
                rowDelete.remove();
                let emptyHeader = d.getElementById('js-empty'),
                buttons = d.getElementById('js-wrapperButtons');
                if (emptyHeader.classList.contains("hideElem")) emptyHeader.classList.remove("hideElem"); 
                if (!buttons.classList.contains("hideElem")) buttons.classList.add("hideElem");
                table.remove();
            }, 500);
        }  
        else {
            for (let i = 0; i < (table.children.length-1); i++) {
                if(table.children[i].children[2].innerHTML == currentProduct) {
                    rowDelete = table.children[i];
                }
            };
            rowDelete.classList.add('flat');
            setTimeout(()=>{
                rowDelete.remove();
            }, 500);
            
        }; cartAnimate (); 
        
    }
    productsOnCart.length = 0;
    
    
};
/*___________end events in modal window____________________________________________________*/

function checkEmptyCard() {
    let emptyHeader = d.getElementById('js-empty'),
        btns = d.getElementById('js-wrapperButtons');
    if ((localStorage.getItem("cartData")) && (localStorage.getItem("cartData")>0)) {
        if (!emptyHeader.classList.contains("hideElem")) emptyHeader.classList.add("hideElem"); 
        if (btns.classList.contains("hideElem")) btns.classList.remove("hideElem");
        return false
    } else {
        if (emptyHeader.classList.contains("hideElem")) emptyHeader.classList.remove("hideElem"); 
        if (!btns.classList.contains("hideElem")) btns.classList.add("hideElem");
        
        return true
    }
}



function addToCart() {
    let localProduct = this.previousElementSibling.previousElementSibling.innerHTML;
    let cartLocalDataProduct = localStorage.getItem("cartDataProduct");
    let cartLocalData = localStorage.getItem("cartData");
    if ((cartLocalData) && (cartLocalDataProduct)) {
        localStorage.setItem("cartData", Number(cartLocalData)+1);
        cartContainer.innerText = localStorage.getItem("cartData");
        localStorage.setItem("cartDataProduct", cartLocalDataProduct + ',' + localProduct);
    } else {
        localStorage.setItem("cartData", 1);
        cartContainer.innerText = localStorage.getItem("cartData")
        localStorage.setItem("cartDataProduct", localProduct);
    }
    cartAnimate ();
};

function clearLocalStorage() {
    if (localStorage) {
        localStorage.clear();
        localStorage.removeItem("cartDataProduct");
        cartContainer.innerText = 0;
    };
    cartAnimate ();
}

function showTablePay() {
    let darkLayer = document.createElement('div');
    darkLayer.id = 'shadow';
    document.body.appendChild(darkLayer);
    let showOrder = document.getElementById('orderList');
    showOrder.style.top = "5vh";
    showOrder.style.transition = "all .4s";
    
}

function orderDisappear() {
    let darkLayer = document.getElementById('shadow');
    document.body.removeChild(darkLayer);
    let showOrder = document.getElementById('orderList');
    showOrder.style.top = "-5000px";
    showOrder.style.transition = "all 1s";
    cartAnimate(); 
}

function payOrder() {
    
    clearLocalStorage();
    orderDisappear();
    let darkLayer = document.createElement('div');
    darkLayer.id = 'shadow';
    document.body.appendChild(darkLayer);
    let apperPayOrder = () => {
        showBuy.style.cssText="top: 0; \
            transform: scale(1); \
            transition: transform 5s; \
            bottom: 0; \
        ";
    }; setTimeout(apperPayOrder, 500);
    
    let showBuy = document.getElementById('buyProducts');
    darkLayer.addEventListener("click", ()=> {
        document.body.removeChild(darkLayer);
        showBuy.style.cssText="top: -5000px; \
        transform: scale(0.1); \
        transition: transform 5s; \
        ";
    });
}

