console.log("100/100\n- Вёрстка страницы Main соответствует макету при ширине экрана 1280px: +14\n- Вёрстка страницы Main соответствует макету при ширине экрана 768px: +14\n- Вёрстка страницы Main соответствует макету при ширине экрана 320px: +14\n- Вёрстка страницы Pets соответствует макету при ширине экрана 1280px: +6\n- Вёрстка страницы Pets соответствует макету при ширине экрана 768px: +6\n- Вёрстка страницы Pets соответствует макету при ширине экрана 320px: +6\n- Ни на одном из разрешений до 320px включительно не появляется горизонтальная полоса прокрутки, справа от отдельных блоков не появляются белые поля. Весь контент страницы при этом сохраняется: не обрезается и не удаляется: +20\n- нет полосы прокрутки при ширине страницы Main от 1280рх до 768рх: +5\n- нет полосы прокрутки при ширине страницы Main от 768рх до 320рх: +5\n- нет полосы прокрутки при ширине страницы Pets от 1280рх до 768рх: +5\n- нет полосы прокрутки при ширине страницы Pets от 768рх до 320рх: +5\n- Верстка резиновая: при плавном изменении размера экрана от 1280px до 320px верстка подстраивается под этот размер, элементы верстки меняют свои размеры и расположение, не наезжают друг на друга, изображения могут менять размер, но сохраняют правильные пропорции: +8\n- При ширине экрана меньше 768px на обеих страницах меню в хедере скрывается, появляется иконка бургер-меню: +4\n- Верстка обеих страниц валидная: +8");

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
