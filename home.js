document.getElementById('js-counter')
.addEventListener('click', () => {
    window.location='products.html';
});



/* S L I D E R________________________________________________________________________________ */
let widthItem = document.body.clientWidth,
	currentWidthItem = widthItem,
	currentLeft,
	transitionSpeed = 1000,
	sliderContainer = document.getElementById('js-sliderContainer'),
	sliderWrapper = document.getElementById('js-sliderWrapper'),
	sliderCount = document.querySelectorAll('.slider__item').length,
	sliderNav = document.createElement('div'),
	sliderLeftButton = document.createElement('button'),
	sliderRightButton = document.createElement('button'),
	cloneFirst = sliderWrapper.querySelectorAll('.slider__item')[0].cloneNode(true),
	cloneLast = sliderWrapper.querySelectorAll('.slider__item')[sliderCount - 1].cloneNode(true),
	currentSlide = 1;

sliderWrapper.style.width = widthItem * (sliderCount+2) + 'px';
sliderWrapper.appendChild(cloneFirst);
sliderWrapper.insertBefore(cloneLast, sliderWrapper.firstChild);
for(let i=0; i < document.querySelectorAll('.slider__item').length; i++) {
	document.querySelectorAll('.slider__item')[i].style.width = widthItem + 'px';
}
sliderWrapper.style.left = -widthItem + 'px';

/*_______________________response slider________________________________*/

window.addEventListener("resize", ()=> {
	widthItem = Math.round(document.body.clientWidth*10000)/10000;
	let computedStyleWrapper = getComputedStyle(sliderWrapper);
	currentLeftWrapper = parseFloat(computedStyleWrapper.left);
	currentLeftWrapper = Math.round((currentLeftWrapper/currentWidthItem))*widthItem;
	sliderWrapper.style.left = currentLeftWrapper + 'px';
    for(let i=0; i < document.querySelectorAll('.slider__item').length; i++) {
        document.querySelectorAll('.slider__item')[i].style.width = widthItem + 'px';
    }
    sliderWrapper.style.width = widthItem*(sliderCount+2) + 'px';
	currentWidthItem = widthItem;

});
/*____________________________________________________________________*/

function init() {
	sliderNav.classList = 'slider__nav';
	let sliderNavButton = document.createElement('button');
	sliderNavButton.classList = 'slider__nav-button';

	sliderLeftButton.innerText = '<';
	sliderLeftButton.classList = 'slider__left-button';

	sliderRightButton.innerText = '>';
	sliderRightButton.classList = 'slider__right-button';

	for(let i = 0; i < sliderCount; i++) {
		let sliderNavButton = document.createElement('button');
		if (i==0) sliderNavButton.classList = 'slider__nav-button slider__nav-button--active'
		else sliderNavButton.classList = 'slider__nav-button';
		sliderNavButton.addEventListener('click', clickOnNavButtons);
		sliderNav.appendChild(sliderNavButton);
	}

	sliderContainer.appendChild(sliderLeftButton);
	sliderLeftButton.addEventListener('click', () => {
		if(!sliderWrapper.classList.contains('isAnimating')) {
			if(sliderWrapper.style.left === 0 + 'px') {
				sliderWrapper.style.transition = '';
				sliderWrapper.style.left = -currentWidthItem*sliderCount + 'px';
			}
			currentSlide--;
			if (currentSlide === 0) currentSlide = sliderCount;
			setTimeout(() => {
				let signLeft = '+';
				clickOnButton(signLeft);
			}, 10);
		}	
	}, false);
	
	sliderContainer.appendChild(sliderRightButton);
	sliderRightButton.addEventListener('click', () => {
		if(!sliderWrapper.classList.contains('isAnimating')) {
			if(sliderWrapper.style.left === -currentWidthItem*(sliderCount+1) + 'px') {
				sliderWrapper.style.transition = '';
				sliderWrapper.style.left = -currentWidthItem + 'px';
			} 
			currentSlide++;
			if (currentSlide === sliderCount+1) currentSlide = 1
			setTimeout(() => {
				let signRight = '-';
				clickOnButton(signRight);
			}, 10);
		}	
	}, false);

	sliderContainer.appendChild(sliderNav);
	let allNavButtons = document.getElementsByClassName('slider__nav-button');
	for(let i = 0; i < allNavButtons.length; i++) {
		allNavButtons[i].setAttribute('data-number', i+1);
		allNavButtons[i].dataset.number;
	} 
}



function clickOnButton(x) {
	sliderWrapper.style.transition = 'left ' + transitionSpeed/1000 + 's';
	currentLeft = parseFloat(sliderWrapper.style.left);
	if (x == '+') sliderWrapper.style.left = currentLeft + currentWidthItem + 'px';
	if (x == '-') sliderWrapper.style.left = currentLeft - currentWidthItem + 'px';
	sliderWrapper.classList.add('isAnimating');
	setTimeout(() => {
		sliderWrapper.style.transition = '';
		sliderWrapper.classList.remove('isAnimating');
	}, transitionSpeed);
	currentWidthItem = widthItem;
	setDot();
};

function setDot() {
	let allNavButtons = document.getElementsByClassName('slider__nav-button');
	for(let i = 0; i < allNavButtons.length; i++) {
		allNavButtons[i].classList.remove('slider__nav-button--active');
	};
	allNavButtons[currentSlide-1].classList.add('slider__nav-button--active');
}


function clickOnNavButtons(event) {
	let allNavButtons = document.getElementsByClassName('slider__nav-button');
	for(let i = 0; i < allNavButtons.length; i++) {
		allNavButtons[i].classList.remove('slider__nav-button--active');
	}
	event.target.closest('.slider__nav-button').classList.add('slider__nav-button--active');
	currentSlide = event.target.closest('.slider__nav-button').dataset.number;
	sliderWrapper.style.left = -currentSlide*widthItem + 'px';
	sliderWrapper.style.transition = 'left ' + transitionSpeed/1000 + 's';
}

init();

/*_______end slider______________________________________________*/ 


let allYears = document.getElementsByClassName('year'),
	allContents = document.getElementsByClassName('content');

for (let i=0; i<allYears.length; i++) {
	allYears[i].addEventListener('mouseover', ()=> {
		
		for (let j=0; j<allYears.length; j++) {
			allYears[j].classList.remove('year__active');
			allContents[j].classList.remove('content__active');
		}
		allYears[i].classList.add('year__active');
		allContents[i].classList.add('content__active')
	})
};


