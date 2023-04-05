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


/**
 * Add listeners.
 */
window.addEventListener("DOMContentLoaded", function () {
    sliderConstruct();
    buttonsHandler();
});
window.addEventListener('resize', sliderConstruct);
visualViewport.addEventListener('resize', sliderConstruct);

/**
 * Construct slider. Dinamycly change it.
 */
function sliderConstruct() {
    sliderContainer = document.getElementById('infiniteSliderContainer');
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

/**
 * Buttons handler.
 */
function buttonsHandler() {
    const prevButton = document.getElementById('infiniteSliderPrev');
    const nextButton = document.getElementById('infiniteSliderNext');

    prevButton.addEventListener('click', function () {
        // Save state.
        nextPetsGroup = currentPetsGroup;
        currentPetsGroup = prevPetsGroup;

        // Add group for prev side.
        let petsArr = shuffle(initialPets.slice(0));
        petsArr = petsArr.filter((item) => !currentPetsGroup.find((element) => element.name === item.name));
        prevPetsGroup = getSidePetsGroup(petsArr, pageNumberOfCards);

        updateSliderHtml();
        animateHorizontalScroll(sliderContainer, scrollEnd * 2, scrollEnd)

    });

    nextButton.addEventListener('click', function () {
        // Save state.
        prevPetsGroup = currentPetsGroup;
        currentPetsGroup = nextPetsGroup;

        // Add group for next side.
        let petsArr = shuffle(initialPets.slice(0));
        petsArr = petsArr.filter((item) => !currentPetsGroup.find((element) => element.name === item.name));
        nextPetsGroup = getSidePetsGroup(petsArr, pageNumberOfCards);

        updateSliderHtml();
        animateHorizontalScroll(sliderContainer, 0, scrollEnd)
    });
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

    return cardElement;
}

/**
 * Animate horizontal scroll for element.
 *
 * @param {*} element
 * @param {*} start
 * @param {*} end
 */
function animateHorizontalScroll(element, start, end) {
    const startTime = performance.now();
    const coefficient = 0.5 * (pageNumberOfCards + 1);

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