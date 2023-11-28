// CREATE STEPS
const setupSteps = document.querySelector('#setup-guide')
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
    if (!step.action2) {
        stepTemplate.querySelector('.setup-step__button2').style.display = 'none';
    }
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


// TOGGLE VISIBILITY OF SETUP GUIDE 
const setupGuideControl = document.querySelector('#setup-guide-control')
setupGuideControl.addEventListener('click', () => {
    setupSteps.style.transition = 'ease 0.2s';
    setupGuideControl.style.transition = 'ease 0.3s'
  
    setupSteps.classList.toggle('setup-guide--closed');
    setupGuideControl.classList.toggle('setup-guide__control--closed')

    const isExpanded = setupGuideControl.getAttribute('aria-expanded') === 'true';
    setupGuideControl.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
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


// PROGRESS BAR AND COMPLETED STEPS 
const progressInnerBar = document.querySelector('.setup-progress__bar--inner-bar')
const completedSteps = document.querySelector('.setup-progress__completed-steps')
const checkBoxButtons = setupSteps.querySelectorAll('#checkbox-button');
const checkBoxes = setupSteps.querySelectorAll('input[type="checkbox"]');
let progress = 0;
checkBoxButtons.forEach((checkBoxButton, index) => {
    const notCompletedIcon = checkBoxButton.querySelector('#not-completed-icon');
    const loadingSpinnerIcon = checkBoxButton.querySelector('#loading-spinner-icon');
    const completedIcon = checkBoxButton.querySelector('#completed-icon');
    const icons = [notCompletedIcon, loadingSpinnerIcon, completedIcon];
    const checkbox = checkBoxButton.querySelector('input[type="checkbox"]');
    checkBoxButton.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked 
        if (checkbox.checked) {
            progress++;
            handleMarkAsDone(...icons).then(() => {
                // accordIdx is index to be passed to accord function
                let accordIdx = index;
                // iterate all steps while box currently being iterated is checked, this moves to the next incomplete step
                // if index is that of the last checkbox, increasing accordIdx in order to move to next box would give an undefined index, reset accordIdx to 0 to start from top
                // if accordIdx equals current index during iteration break loop to avoid infinite loop because all checkboxes have been checked
                while(checkBoxes[accordIdx].checked) {
                    accordIdx < 4 ? ++accordIdx : accordIdx = 0;
                    if (accordIdx == index) break;
                }
                // if accordIdx equals index after exiting loop, all steps are completed, close final step
                if (accordIdx == index) stepTemplates[index].classList.add('setup-step--closed')
                // else open next incomplete step
                else accord(accordIdx);
            })
        } else {
            // when checkbox is unchecked, reopen unchecked step
            progress--;
            handleMarkAsNotDone(...icons).then(() => {
                accord(index);
            })
        }
        progressInnerBar.style.width = progress * 20;
        completedSteps.innerText = progress; 
    });
});

// CLOSE BANNER 
const banner = document.querySelector('#banner');
const bannerCloseIcon = document.querySelector('#banner-close-button');
const selectPlanButton = banner.querySelector('#select-plan');
selectPlanButton.addEventListener('click', () => {
    window.location.href = 'https://shopify.com/pricing'
})
bannerCloseIcon.addEventListener('click', () => {
    banner.classList.add('trial-callout--closed');
})

// TOGGLE NOTIFICATIONS PANEL
const notificationPanelControl = document.querySelector('#notification-panel-control');
const notificationPanel = document.querySelector('#notification-panel');
notificationPanelControl.addEventListener('click', () => {
  toggleNotificationPanel();
});
notificationPanelControl.addEventListener('keyup', (e) => {
    closeNoticationPanel(e);
});
function toggleNotificationPanel () {
    // close profile menu and open notification panel
    profileMenu.classList.add('menu--closed');
    // profileMenuControl.classList.remove('profile-menu-control--active');
    notificationPanel.classList.toggle('menu--closed');
    // notificationPanelControl.classList.toggle('notification-panel__control--active')
    profileMenuControl.ariaExpanded = 'false';
    
    if (notificationPanelControl.getAttribute('aria-expanded') === 'true') {
        notificationPanelControl.setAttribute('aria-expanded', 'false');
        notificationPanelControl.focus();
    } else if (notificationPanelControl.getAttribute('aria-expanded') === 'false') {
        notificationPanelControl.setAttribute('aria-expanded', 'true');
    }
};
function closeNoticationPanel (e) {
    if (e.key == 'Escape') {
        notificationPanel.classList.add('menu--closed')
        notificationPanelControl.focus()
        notificationPanelControl.setAttribute('aria-expanded', 'false');
    };
};


// PROFILE MENU

// all menu items
const profileMenu = document.querySelector('#profile-menu');
const allMenuItems = profileMenu.querySelectorAll('[role="menuitem"]');

allMenuItems.forEach((item, index) => {
    // item.addEventListener('click', () => window.location.href = 'https://admin.shopify.com');
    item.addEventListener('keyup', (e) => handleMenuItemArrowKeyPress(e, index));
});
function handleMenuItemArrowKeyPress (e, index) {
    const isLastMenuItem = index == allMenuItems.length - 1;
    const isFirstMenuItem = index == 0;
    const nextMenuItem = allMenuItems.item(index + 1);
    const prevMenuItem = allMenuItems.item(index - 1);
    if (e.key == 'ArrowRight' || e.key == 'ArrowDown') {
        if (isLastMenuItem) {
            allMenuItems.item(0).focus();
        } else {
            nextMenuItem.focus()
        };
    };
    
    if (e.key == 'ArrowLeft' || e.key == 'ArrowUp') {
        if (isFirstMenuItem) {
            allMenuItems.item(allMenuItems.length - 1).focus();
        } else {
            prevMenuItem.focus();
        };
    };
};

// toggle profile menu
const profileMenuControl = document.querySelector('#profile-menu-control');
profileMenuControl.addEventListener('click', () => {
   toggleProfileMenu();
})
profileMenuControl.addEventListener('keyup', (e) => {
    closeProfileMenu(e);
});
profileMenu.addEventListener('keyup', (e) => {
    closeProfileMenu(e);
});

function toggleProfileMenu () {
    // close notification panel and open profile menu
    notificationPanel.classList.add('menu--closed');
    // notificationPanelControl.classList.remove('notification-panel__control--active')
    profileMenu.classList.toggle('menu--closed');
    // profileMenuControl.classList.toggle('profile-menu-control--active');
    notificationPanelControl.ariaExpanded = 'false';
    
    const allMenuItems = profileMenu.querySelectorAll('[role="menuitem"]');
    if (profileMenuControl.getAttribute('aria-expanded') === 'true') {
        profileMenuControl.setAttribute('aria-expanded', 'false');
        profileMenuControl.focus();
    } else if (profileMenuControl.getAttribute('aria-expanded') === 'false') {
        profileMenuControl.setAttribute('aria-expanded', 'true');
        allMenuItems.item(0).focus();
    }
}

function closeProfileMenu (e) {
    if (e.key == 'Escape') {
        profileMenu.classList.add('menu--closed')
        profileMenuControl.focus()
        profileMenuControl.ariaExpanded = 'false'
    };
}

const HIDDEN_CLASS = 'hidden';
const MARKED_AS_DONE_ClASS = 'check-box-done';

function handleMarkAsDoneOrNotDone () {
    // const markedAsDone = checkBoxButton.classList.contains(MARKED_AS_DONE_ClASS);
    // if (markedAsDone) {
    //     handleMarkAsNotDone();
    // } else {
    //     handleMarkAsDone();
    // }
}  

function handleMarkAsDone (notCompletedIcon, loadingSpinnerIcon, completedIcon) {
    return new Promise((resolve) => {
        notCompletedIcon.classList.add(HIDDEN_CLASS);
        loadingSpinnerIcon.classList.remove(HIDDEN_CLASS);
        setTimeout(() => {
            loadingSpinnerIcon.classList.add(HIDDEN_CLASS);
            completedIcon.classList.remove(HIDDEN_CLASS);
            resolve();
        }, 100);
    })
};

function handleMarkAsNotDone (notCompletedIcon, loadingSpinnerIcon, completedIcon) {
    return new Promise((resolve) => {
        completedIcon.classList.add(HIDDEN_CLASS);
        loadingSpinnerIcon.classList.remove(HIDDEN_CLASS);
        setTimeout(() => {
            loadingSpinnerIcon.classList.add(HIDDEN_CLASS);
            notCompletedIcon.classList.remove(HIDDEN_CLASS);
            resolve();
        }, 100);
    });
};


// SEARCH BAR FOCUS
const searchBarLabel = document.querySelector('#search-bar-label');
const searchBar = searchBarLabel.querySelector('#search-bar');
searchBar.addEventListener('focus', () => searchBarLabel.classList.add('search-bar-focus'))
searchBar.addEventListener('blur', () => searchBarLabel.classList.remove('search-bar-focus'));


// CLOSE MENU WHEN USER CLICKS OUTSIDE OF MENU
window.addEventListener('click', (e) => {
    const isClickInsideProfileMenu = profileMenu.contains(e.target) || profileMenuControl.contains(e.target);
    const isClickInsideNotificationPanel = notificationPanel.contains(e.target) || notificationPanelControl.contains(e.target);
    // Close the profile menu if the click is outside of it
    if (!isClickInsideProfileMenu && !profileMenu.classList.contains('menu--closed')) {
        profileMenu.classList.add('menu--closed');
        // profileMenuControl.classList.remove('profile-menu-control--active');
        profileMenuControl.setAttribute('aria-expanded', 'false');
    }

    // Close the notification panel if the click is outside of it
    if (!isClickInsideNotificationPanel && !notificationPanel.classList.contains('menu--closed')) {
        notificationPanel.classList.add('menu--closed');
        // notificationPanelControl.classList.remove('notification-panel__control--active');
        notificationPanelControl.setAttribute('aria-expanded', 'false');
    }
});


