const initialPets = [
    {
      "name": "Jennifer",
      "img": "../assets/pets-jennifer.png",
      "type": "Dog",
      "breed": "Labrador",
      "description": "Jennifer is a sweet 2 months old Labrador that is patiently waiting to find a new forever home. This girl really enjoys being able to go outside to run and play, but won't hesitate to play up a storm in the house if she has all of her favorite toys.",
      "age": "2 months",
      "inoculations": ["none"],
      "diseases": ["none"],
      "parasites": ["none"]
    },
    {
      "name": "Sophia",
      "img": "../assets/pets-sophia.png",
      "type": "Dog",
      "breed": "Shih tzu",
      "description": "Sophia here and I'm looking for my forever home to live out the best years of my life. I am full of energy. Everyday I'm learning new things, like how to walk on a leash, go potty outside, bark and play with toys and I still need some practice.",
      "age": "1 month",
      "inoculations": ["parvovirus"],
      "diseases": ["none"],
      "parasites": ["none"]
    },
    {
      "name": "Woody",
      "img": "../assets/pets-woody.png",
      "type": "Dog",
      "breed": "Golden Retriever",
      "description": "Woody is a handsome 3 1/2 year old boy. Woody does know basic commands and is a smart pup. Since he is on the stronger side, he will learn a lot from your training. Woody will be happier when he finds a new family that can spend a lot of time with him.",
      "age": "3 years 6 months",
      "inoculations": ["adenovirus", "distemper"],
      "diseases": ["right back leg mobility reduced"],
      "parasites": ["none"]
    },
    {
      "name": "Scarlett",
      "img": "../assets/pets-scarlet.png",
      "type": "Dog",
      "breed": "Jack Russell Terrier",
      "description": "Scarlett is a happy, playful girl who will make you laugh and smile. She forms a bond quickly and will make a loyal companion and a wonderful family dog or a good companion for a single individual too since she likes to hang out and be with her human.",
      "age": "3 months",
      "inoculations": ["parainfluenza"],
      "diseases": ["none"],
      "parasites": ["none"]
    },
    {
      "name": "Katrine",
      "img": "../assets/pets-katrine.png",
      "type": "Cat",
      "breed": "British Shorthair",
      "description": "Katrine is a beautiful girl. She is as soft as the finest velvet with a thick lush fur. Will love you until the last breath she takes as long as you are the one. She is picky about her affection. She loves cuddles and to stretch into your hands for a deeper relaxations.",
      "age": "6 months",
      "inoculations": ["panleukopenia"],
      "diseases": ["none"],
      "parasites": ["none"]
    },
    {
      "name": "Timmy",
      "img": "../assets/pets-timmy.png",
      "type": "Cat",
      "breed": "British Shorthair",
      "description": "Timmy is an adorable grey british shorthair male. He loves to play and snuggle. He is neutered and up to date on age appropriate vaccinations. He can be chatty and enjoys being held. Timmy has a lot to say and wants a person to share his thoughts with.",
      "age": "2 years 3 months",
      "inoculations": ["calicivirus", "viral rhinotracheitis"],
      "diseases": ["kidney stones"],
      "parasites": ["none"]
    },
    {
      "name": "Freddie",
      "img": "../assets/pets-freddie.png",
      "type": "Cat",
      "breed": "British Shorthair",
      "description": "Freddie is a little shy at first, but very sweet when he warms up. He likes playing with shoe strings and bottle caps. He is quick to learn the rhythms of his human’s daily life. Freddie has bounced around a lot in his life, and is looking to find his forever home.",
      "age": "2 months",
      "inoculations": ["rabies"],
      "diseases": ["none"],
      "parasites": ["none"]
    },
    {
      "name": "Charly",
      "img": "../assets/pets-charly.png",
      "type": "Dog",
      "breed": "Jack Russell Terrier",
      "description": "This cute boy, Charly, is three years old and he likes adults and kids. He isn’t fond of many other dogs, so he might do best in a single dog home. Charly has lots of energy, and loves to run and play. We think a fenced yard would make him very happy.",
      "age": "8 years",
      "inoculations": ["bordetella bronchiseptica", "leptospirosis"],
      "diseases": ["deafness", "blindness"],
      "parasites": ["lice", "fleas"]
    }
];

const cardWidth = 270;
const scrollDuration = 400;

let sliderContainer;
let pageNumberOfCards = 0;
let currentPetsGroup, prevPetsGroup, nextPetsGroup;
let sliderScrollWidth = 0;
let scrollEnd = 0;
let sliderGapForMobile = 40;
let ourPetsMultiplier = 8;
let ourPetsCount = ourPetsMultiplier * initialPets.length;
let ourPetsSliderContainer;
let pageNumberOfOurPetsColumns = 0;
let ourPetsSliderGap = 40;
const ourPetsArr = formOurPetsArray();
let ourPetsSliderCurrentPage = 1;


/**
 * Add listeners.
 */
window.addEventListener("DOMContentLoaded", function () {
    sliderConstruct();
    buttonsHandler();
    popupHandler();
    ourPetsSliderConstruct();
});
window.addEventListener('resize', function () {
    sliderConstruct();
    ourPetsSliderConstruct();
});
visualViewport.addEventListener('resize', function () {
    sliderConstruct();
    ourPetsSliderConstruct();
});

/**
 * Construct slider. Dinamycly change it.
 */
function sliderConstruct() {
    sliderContainer = document.getElementById('infiniteSliderContainer');

    if (sliderContainer) {
        let currentNumberOfCards = Math.floor(sliderContainer.clientWidth / cardWidth);
        let currentGap = currentNumberOfCards > 1 ? (sliderContainer.clientWidth % cardWidth) / (currentNumberOfCards - 1) : sliderGapForMobile;
        let petsArr = shuffle(initialPets.slice(0)); // Get new randomly shuffled array.
        sliderScrollWidth = sliderContainer.clientWidth * 3;
        scrollEnd = (cardWidth + currentGap) * currentNumberOfCards;

        // Initialize the slider or reinitialize on viewport/window width change.
        if (currentNumberOfCards === 0 || currentNumberOfCards !== pageNumberOfCards) {
            pageNumberOfCards = currentNumberOfCards; // Save number of cards state.

            currentPetsGroup = getCurrentPetsGroup(petsArr, currentNumberOfCards);
            prevPetsGroup = getSidePetsGroup(petsArr, currentNumberOfCards);
            nextPetsGroup = getSidePetsGroup(petsArr, currentNumberOfCards);

            updateSliderHtml();
        }

        sliderContainer.scrollLeft = scrollEnd;
    }
}

/**
 * Buttons handler.
 */
function buttonsHandler() {
    const prevButton = document.getElementById('infiniteSliderPrev');
    const nextButton = document.getElementById('infiniteSliderNext');

    if (prevButton) {
        prevButton.addEventListener('click', function () {
            // Save state.
            nextPetsGroup = currentPetsGroup;
            currentPetsGroup = prevPetsGroup;

            // Add group for prev side.
            let petsArr = shuffle(initialPets.slice(0));
            petsArr = petsArr.filter((item) => !currentPetsGroup.find((element) => element.name === item.name));
            prevPetsGroup = getSidePetsGroup(petsArr, pageNumberOfCards);

            updateSliderHtml();
            animateHorizontalScroll(sliderContainer, scrollEnd * 2, scrollEnd, 0.5 * (pageNumberOfCards + 1))

        });
    }


    if (nextButton) {
        nextButton.addEventListener('click', function () {
            // Save state.
            prevPetsGroup = currentPetsGroup;
            currentPetsGroup = nextPetsGroup;

            // Add group for next side.
            let petsArr = shuffle(initialPets.slice(0));
            petsArr = petsArr.filter((item) => !currentPetsGroup.find((element) => element.name === item.name));
            nextPetsGroup = getSidePetsGroup(petsArr, pageNumberOfCards);

            updateSliderHtml();
            animateHorizontalScroll(sliderContainer, 0, scrollEnd, 0.5 * (pageNumberOfCards + 1))
        });
    }
}

/**
 * Popup handler.
 */
function popupHandler() {
    const popup = document.querySelector('.card-description-popup');
    const body = document.querySelector('body');
    const overlay = document.querySelector('.overlay');


    document.addEventListener('click', (e) => {
        const closePopupBtn = document.getElementById('closePopupBtn');
        const clickedOnOverlay = e.composedPath().includes(overlay);
        const clickedOnCloseButton = e.composedPath().includes(closePopupBtn);
        const popupIsOpen = popup ? popup.classList.contains('open') : false;

        if (popupIsOpen && (clickedOnOverlay || clickedOnCloseButton)) closePopup();

    })

    /**
     * Open / close menu.
     */
    function closePopup() {
        popup.classList.toggle('open');
        body.classList.toggle('frozen');
    }
};

/**
 * Construct slider. Dinamycly change it.
 */
function ourPetsSliderConstruct() {
    ourPetsSliderContainer = document.getElementById('ourPetsSliderContainer');


    if (ourPetsSliderContainer) {
        let currentNumberOfOurPetsColumns = Math.floor(ourPetsSliderContainer.clientWidth / cardWidth);

        // Initialize the slider or reinitialize on viewport/window width change.
        if (currentNumberOfOurPetsColumns !== pageNumberOfOurPetsColumns) {
            let prevPageNumberOfOurPetsColumns = pageNumberOfOurPetsColumns;
            pageNumberOfOurPetsColumns = currentNumberOfOurPetsColumns; // Save number of cards state.
            // Calculate cards to offset.
            let offset = prevPageNumberOfOurPetsColumns > 0 ? (ourPetsSliderCurrentPage - 1) * getOurPetsNumberOfCardsPerPage(prevPageNumberOfOurPetsColumns) : 0;
            ourPetsSliderCurrentPage = Math.floor(offset / getOurPetsNumberOfCardsPerPage()) + 1;

            updateOurPetsSliderHtml();
            updateOurPetsSliderControls();
        }
    }
}

/**
 * Shuffle array,
 *
 * @param {*} arr
 * @returns
 */
function shuffle(arr){
	let j, temp;

    for (let i = arr.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}

    return arr;
}

/**
 * Get current pets group for one page.
 *
 * @param {*} petsArr
 * @param {*} cardsPerPage
 * @returns
 */
function getCurrentPetsGroup(petsArr, cardsPerPage) {
    let petsGroup = [];

    for (let i = 0; i < cardsPerPage; i++) {
        petsGroup.push(petsArr.shift());
    }

    return petsGroup;
}

/**
 * Get side pets group for one page.
 *
 * @param {*} petsArr
 * @param {*} cardsPerPage
 * @returns
 */
function getSidePetsGroup(petsArr, cardsPerPage) {
    let petsGroup = [];
    let petsArrShuffled = shuffle(petsArr.slice(0));

    for (let i = 0; i < cardsPerPage; i++) {
        petsGroup.push(petsArrShuffled.shift());
    }

    return petsGroup;
}

/**
 * Append petsGroupToSlider.
 *
 * @param {*} sliderContainer
 * @param {*} petsGroup
 */
function appendPetsGroupToSlider(sliderContainer, petsGroup) {
    for (let i = 0; i < petsGroup.length; i++) {
        sliderContainer.append(formHtmlSliderCard(petsGroup[i]));
    }
}

/**
 * Form slider card.
 *
 * @param {*} petObj
 * @returns
 */
function formHtmlSliderCard(petObj) {
    let cardElement = document.createElement('div');
    cardElement.classList.add('child-item', 'slider-card');

    cardElement.innerHTML = `<div class="card-image"><img src="${petObj.img}" alt="Pet Katrine"></div>
                             <div class="card-info">
                                <div class="card-name">${petObj.name}</div>
                                <button class="button-secondary">Learn more</button>
                             </div>`;

    // Show popup on click on card.
    cardElement.addEventListener('click', function () {
        let popup = document.querySelector('.card-description-popup');
        let body = document.querySelector('body');

        if (popup) {
            popup.innerHTML = `<div class="card-description">
                                    <div class="child-item card-description-img"><img src="${petObj.img}" alt="Pet ${petObj.img}"></div>
                                    <div class="child-item card-description-info">
                                        <div class="child-item pet-name-type">
                                            <h3>${petObj.name}</h3>
                                            <h4>${petObj.type} - ${petObj.breed}</h4>
                                        </div>
                                        <div class="child-item pet-description">${petObj.description}</div>
                                        <div class="child-item">
                                            <ul class="pet-options-list">
                                                <li><h5><b>Age:</b> ${petObj.age}</h5></li>
                                                <li><h5><b>Inoculations:</b> ${petObj.inoculations.join(', ')}</h5></li>
                                                <li><h5><b>Diseases:</b> ${petObj.diseases.join(', ')}</h5></li>
                                                <li><h5><b>Parasites:</b> ${petObj.parasites.join(', ')}</h5></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <button class="button-secondary button-round button-close" id="closePopupBtn"></button>`;

            popup.classList.toggle('open');
            body.classList.toggle('frozen');
        }
    });

    return cardElement;
}

/**
 * Animate horizontal scroll for element.
 *
 * @param {*} element
 * @param {*} start
 * @param {*} end
 */
function animateHorizontalScroll(element, start, end, coefficient = 0.5) {
    const startTime = performance.now();

    function scroll() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / (scrollDuration * coefficient), 1);

        element.scrollLeft = start + progress * (end - start);

        if (progress < 1) {
            requestAnimationFrame(scroll);
        }
    }

    requestAnimationFrame(scroll);
}

/**
 * Update inner html for slider.
 */
function updateSliderHtml() {
    sliderContainer.innerHTML = '';

    appendPetsGroupToSlider(sliderContainer, prevPetsGroup);
    appendPetsGroupToSlider(sliderContainer, currentPetsGroup);
    appendPetsGroupToSlider(sliderContainer, nextPetsGroup);
}

/**
 * Form Our Pets array.
 */
function formOurPetsArray() {
    let resultArr = [];
    let tail = [];
    let groupBy = 6;

    for (let i=0; i < ourPetsMultiplier; i++) {
        let petsArr = shuffle(initialPets.slice(0));

        switch (tail.length) {
            case 0: {
                resultArr = resultArr.concat(petsArr.splice(0, 6));
                tail = petsArr;
                break;
            }
            case 6: {
                resultArr = resultArr.concat(tail);
                tail = [];
                break;
            }
            default: {
                let head = [];

                for (let j = 0; j < petsArr.length && head.length < (groupBy - tail.length); j++) {
                    const petObj = petsArr[j];
                    if (!tail.some((el) => petObj.name === el.name)) {
                        head.push(petObj);
                        petsArr.splice(j, 1);
                        j--;
                    }
                }
                resultArr = [...resultArr, ...tail, ...head];
                tail = petsArr;
                break;
            }
        }
    }

    return resultArr;
}

/**
 * Update inner html for slider.
 */
function updateOurPetsSliderHtml() {
    ourPetsSliderContainer.innerHTML = '';
    let currentNumberOfOurPetsPerPage = getOurPetsNumberOfCardsPerPage();
    let ourPetsArrCopy = ourPetsArr.slice(0);
    let page = 1;

    while(ourPetsArrCopy.length) {
        let pageElement = document.createElement('div');
        pageElement.classList.add('page');
        pageElement.id = `page-${page}`;

        for (let i = 0; i < currentNumberOfOurPetsPerPage; i++) {
            pageElement.append(formHtmlSliderCard(ourPetsArrCopy.shift()));
        }

        ourPetsSliderContainer.append(pageElement);
        page++;
    }

    const pageToShow = ourPetsSliderContainer.querySelector(`#page-${ourPetsSliderCurrentPage}`);
    let start = ourPetsSliderContainer.scrollLeft;
    let end = pageToShow.offsetLeft - ourPetsSliderContainer.offsetLeft;
    animateHorizontalScroll(ourPetsSliderContainer, start, end, 0.5 * (pageNumberOfOurPetsColumns + 1));
}

/**
 * Update controls for Our Pets slider.
 */
function updateOurPetsSliderControls() {
    let ourPetsSliderControlsContainer = document.getElementById('ourPetsSliderControls');
    let pagesCount = ourPetsSliderContainer.getElementsByClassName('page').length;

    if (ourPetsSliderControlsContainer) {
        let buttonClassList = 'button button-round button-secondary';
        let prevInactive = ourPetsSliderCurrentPage === 1 ? 'inactive' : '';
        let nextInactive = ourPetsSliderCurrentPage === pagesCount ? 'inactive' : '';
        let prevPageNumber = ourPetsSliderCurrentPage === 1 ? ourPetsSliderCurrentPage : ourPetsSliderCurrentPage - 1;
        let nextPageNumber = ourPetsSliderCurrentPage === pagesCount ? ourPetsSliderCurrentPage : ourPetsSliderCurrentPage + 1;

        ourPetsSliderControlsContainer.innerHTML = '';
        ourPetsSliderControlsContainer.innerHTML += `<div class="child-item"><a class="${buttonClassList} ${prevInactive}" data-page="1">&lt;&lt;</a></div>`;
        ourPetsSliderControlsContainer.innerHTML += `<div class="child-item"><a class="${buttonClassList} ${prevInactive}" data-page="${prevPageNumber}">&lt;</a></div>`;

        ourPetsSliderControlsContainer.innerHTML += `<div class="child-item"><a class="${buttonClassList} active" data-page="${ourPetsSliderCurrentPage}"><h4>${ourPetsSliderCurrentPage}</h4></a></div>`;

        ourPetsSliderControlsContainer.innerHTML += `<div class="child-item"><a class="${buttonClassList} ${nextInactive}" data-page="${nextPageNumber}">&gt;</a></div>`;
        ourPetsSliderControlsContainer.innerHTML += `<div class="child-item"><a class="${buttonClassList} ${nextInactive}" data-page="${pagesCount}">&gt;&gt;</a></div>`;

        let buttons = ourPetsSliderControlsContainer.getElementsByTagName('a');
        [...buttons].forEach(function(element, index) {
            element.addEventListener('click', function (e) {
                let choosenPage = +this.getAttribute('data-page');

                if (choosenPage && choosenPage !== ourPetsSliderCurrentPage) {
                    const pageToShow = ourPetsSliderContainer.querySelector(`#page-${choosenPage}`);
                    let start = ourPetsSliderContainer.scrollLeft;
                    let end = pageToShow.offsetLeft - ourPetsSliderContainer.offsetLeft;
                    animateHorizontalScroll(ourPetsSliderContainer, start, end, 0.5 * (pageNumberOfOurPetsColumns + 1));

                    ourPetsSliderCurrentPage = choosenPage;
                    updateOurPetsSliderControls()
                }
            });
        });

    }

}

/**
 * Get number of cards per page.
 *
 * @param {*} columns
 * @returns
 */
function getOurPetsNumberOfCardsPerPage(columns = pageNumberOfOurPetsColumns) {
    switch (columns) {
        case 4: return 8;
        case 2: return 6;
        default: return 3;
    }
}