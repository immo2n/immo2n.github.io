const tabButtonHanlder = (page) => {
    $("#about").attr("class", (page == "about") ? "active" : "");
    $("#skils").attr("class", (page == "skils") ? "active" : "");
    $("#projects").attr("class", (page == "projects") ? "active" : "");
    $("#education").attr("class", (page == "education") ? "active" : "");
    $("#contact").attr("class", (page == "contact") ? "active" : "");
};
window.PREVIOUS_TAB = null;
const getWaitTime = (page) => {
    if(null == page) page = window.PREVIOUS_TAB;
    //Wait time for a page to show its disapear animation
    let times = {
        about: 500,
        skils: 0
    };
    if(null == window.PREVIOUS_TAB) return 0;
    if(null != times[page]) return times[page];
    else return 0;
};
window.TIMEOUT_PAGINATION = null;
const hadlePagination = (page) => {
    let pagination = $("#pagination");
    pagination.css('display', 'block');
    pagination.css('animation', 'fadeOutDown');
    pagination.css('animation-duration', '3s');
    if(null != window.TIMEOUT_PAGINATION) clearTimeout(window.TIMEOUT_PAGINATION);
    window.TIMEOUT_PAGINATION = setTimeout(() => {
        pagination.css('display', 'none');
    }, 3000);
};
const initPage = (page) => {
    $.get('/pages/'+ page +'.html').done((data) => {
        setTimeout(()=> {
            $("#content").html(data);
            window.PREVIOUS_TAB = page;
            hadlePagination(page);
        }, getWaitTime(null));
    });
    handleTabChangeAmination(page);
    tabButtonHanlder(page);
};
$(document).ready(() => {
    initPage('about');
    $("#about").click(() => {
        initPage('about');
    });
    $("#skils").click(() => {
        initPage('skils');
    });
});
const handleTabChangeAmination = (page) => {
    /*Handles anumation for tab change
    Each page has its own animation for each elements
    */
    if (null == window.PREVIOUS_TAB || page == window.PREVIOUS_TAB) return;
    switch (window.PREVIOUS_TAB) {
        case 'about':
            let hero = $("#hero"),
                social = $("#social");
            hero.css('animation', 'fadeOutDown');
            hero.css('animation-duration', '.8s');
            social.css('animation', 'fadeOut');
            social.css('animation-duration', '.8s');
            break;
    }
};