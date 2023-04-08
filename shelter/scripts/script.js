window.addEventListener("DOMContentLoaded", (event) => {
    /**
     * Burger menu bahavior.
     * Open / close menu by clicking on burger-icon.
     * Close menu by clicking outside the menu.
     * Close menu by clicking on menu's link.
     */
    const burgerButton = document.getElementById('burgerButton');
    const menuBlock = document.getElementById('menuBlock');
    const menuLinks = document.querySelectorAll('#menuBlock a');
    const body = document.querySelector('body');

    document.addEventListener('click', (e) => {
        /**
         * Prevent click on active/inactive link or button.
         */
        if (e.target.classList.contains('active') || e.target.classList.contains('inactive')) e.preventDefault();

        const clickedOnMenu = e.composedPath().includes(menuBlock);
        const clickedOnButton = e.composedPath().includes(burgerButton);
        const clickedOnMenuLink = Array.from(menuLinks).includes(e.target);
        const menuIsOpen = menuBlock.classList.contains('open');
        let openClose = false;

        if (clickedOnButton) openClose = true;
        if (!clickedOnMenu && menuIsOpen) openClose = true;
        if (clickedOnMenuLink && menuIsOpen) openClose = true;

        if (openClose) openCloseMenu();

    })

    /**
     * Open / close menu.
     */
    function openCloseMenu () {
        burgerButton.classList.toggle('open');
        menuBlock.classList.toggle('open');
        body.classList.toggle('frozen');
    }
});
