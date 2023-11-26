// CREATE STEPS
const setupSteps = document.querySelector('.setup-steps')
const stepDiv = document.querySelector('.setup-step')
const stepButton2 = stepDiv.querySelector('.setup-step__button2')

const steps = [
    {
        title: 'Customize your online store',
        description: 'Choose a theme and add your logo, colors, and images to reflect your brand.',
        action1: 'Customize theme',
        image: 'https://crushingit.tech/hackathon-assets/customise-store.png',
    },
    {
        title: 'Add your first product',
        description: 'Write a description, add photos, and set pricing for the products you plan to sell.',
        action1: 'Add product',
        action2: 'Import product',
        image: 'https://crushingit.tech/hackathon-assets/product.png'
    },
    {
        title: 'Add a custom domain',
        description: 'Your current domain is 222219.myshopify.com but you can add a custom domain to help customers find your online store.',
        action1: 'Add domain',
        image: 'https://crushingit.tech/hackathon-assets/website.png'
    },
    {
        title: 'Name your store',
        description: 'Your temporary store name is currently Davii collections. The store name appears in your admin and your online store.',
        action1: 'Name store',
        image: 'https://crushingit.tech/hackathon-assets/name-store.png'
    },
    {
        title: 'Set up a payment provider',
        description: 'Choose a payment provider to start accepting payments. You’ll need to create an account with the payment provider and set it up with your Shopify store.',
        action1: 'Set up payment',
        image: 'https://crushingit.tech/hackathon-assets/payment.png'
    }
];

// Remove the default step from HTML
setupSteps.innerHTML = '';

// array of step nodes for later reference; populated as nodes are being created
let stepTemplates = [];

steps.forEach((step, index) => { 
    // create step node
    const stepTemplate = stepDiv.cloneNode(true);    
    const stepTitle = stepTemplate.querySelector('.setup-step__title');
    const stepDescriptionParagraph = stepTemplate.querySelector('.setup-step__description p');
    const stepButton = stepTemplate.querySelector('.setup-step__button');
    const stepImage = stepTemplate.querySelector('.setup-step__image');

    stepTitle.innerText = step.title;
    stepDescriptionParagraph.innerText = step.description;
    stepButton.innerText = step.action1;
    stepImage.src = step.image;
    
    // append step node to parent
    setupSteps.appendChild(stepTemplate);

    // after creating step node, push step node to stepTemplates array and add default styles(closed) to step node
    // add event listenr to toggle step node visibility(open and close)
    
    stepTemplates.push(stepTemplate);
    if (index != 0) stepTemplate.classList.add('setup-step--closed');
    stepTemplate.style.transition = 'ease 0.3s'
    stepTitle.addEventListener('click', () => {
        accord(index);
    })
});


/** TOGGLE VISIBILITY OF SETUP GUIDE */
const setupGuideToggleIcon = document.querySelector('.setup-guide__toggle-icon')
setupGuideToggleIcon.addEventListener('click', () => {
    setupSteps.style.transition = 'ease 0.2s';
    setupGuideToggleIcon.style.transition = 'ease 0.3s'
    if (setupSteps.style.opacity != '0') {
        setupSteps.style.transform = 'translateY(-10px)'; 
        setupSteps.style.opacity = '0'; 
        setupGuideToggleIcon.style.transform = 'rotateX(180deg)'
        setTimeout(() => {
            setupSteps.style.height = '0';

        }, 50);
    } else {
        setupSteps.style.height = '';
        setTimeout(() => {
            setupSteps.style.transform = ''; 
            setupSteps.style.opacity = ''; 
            setupGuideToggleIcon.style.transform = ''
        }, 50);
    }
})

/** accordion functionality
 * close the rest of the steps and open the step whose index is passed into this function
*/
function accord (idx) {
    stepTemplates.forEach((stepTemplate, index) => {
        if (index != idx) stepTemplate.classList.add('setup-step--closed');
    })
    stepTemplates[idx].classList.remove('setup-step--closed');
};


/** PROGRESS BAR AND COMPLETED STEPS */
const progressInnerBar = document.querySelector('.setup-progress__bar--inner-bar')
const completedSteps = document.querySelector('.setup-progress__completed-steps')
const checkBoxes = setupSteps.querySelectorAll('input[type="checkbox"]');
let progress = 0;
checkBoxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            progress++;
            if (index != checkBoxes.length -1) {
                let accordIdx = index + 1;
                // check if neighbor step is checked then move to next incomplete step
                while(checkBoxes[accordIdx].checked) accordIdx++;
                accord(accordIdx);
            } 
        } else {
            progress--;
            accord(index);
        }
        progressInnerBar.style.width = progress * 20;
        completedSteps.innerText = progress; 
    })
});

// CLOSE BANNER 
const banner = document.querySelector('.plan-banner');
const bannerCloseIcon = document.querySelector('.plan-banner__close-icon');
bannerCloseIcon.addEventListener('click', () => {
    document.body.style.transition = 'ease 0.3s';
    banner.style.transition = 'ease 0.2s';
    banner.style.scale = '0'  
})

// TOGGLE NOTIFICATIONS PANEL
const notificationPanelControl = document.querySelector('#notification-panel-control');
const notificationPanel = document.querySelector('#notification-panel');
notificationPanelControl.addEventListener('click', () => {
    // close profile menu and open notification panel
    profileMenu.classList.add('menu--closed');
    profileMenuControl.classList.remove('header__badge--active');
    notificationPanel.classList.toggle('menu--closed');
    notificationPanelControl.classList.toggle('notification-panel__control--active')
    const isExpanded = notificationPanelControl.attributes['aria-expanded'].value;
    if (isExpanded == 'true') {
        notificationPanelControl.attributes['aria-expanded'].value = 'false';
    } else {
        notificationPanelControl.attributes['aria-expanded'].value  = 'true';
    };
})

// TOGGLE POPOVER MENU
const profileMenuControl = document.querySelector('.header__badge');
const profileMenu = document.querySelector('#profile-menu');
profileMenuControl.addEventListener('click', () => {
    // close notification panel and open profile menu
    notificationPanel.classList.add('menu--closed');
    notificationPanelControl.classList.remove('notification-panel__control--active')
    profileMenu.classList.toggle('menu--closed');
    profileMenuControl.classList.toggle('header__badge--active');
    const isExpanded = profileMenuControl.attributes['aria-expanded'].value;
    if (isExpanded == 'true') {
        profileMenuControl.attributes['aria-expanded'].value = 'false';
    } else {
        profileMenuControl.attributes['aria-expanded'].value  = 'true';
    };


})


// SECOND MENU LIST ITEMS
const menuSecondList = profileMenu.querySelector('.menu__second-list')
const menuSecondListItems = ['Help Center', 'Changelog', 'Community forums', 'Hire a Shopify Partner', 'Keyboard shortcuts']

menuSecondListItems.forEach(item => {
    let listItem = document.createElement('li'); 
    let buttonItem = document.createElement('button');

    buttonItem.innerText = item;
    buttonItem.setAttribute('role', 'menuitem');

    listItem.appendChild(buttonItem);
    menuSecondList.appendChild(listItem);
});




