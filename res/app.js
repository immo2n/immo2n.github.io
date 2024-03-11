const initPage = (page)=> {
    if(page === 'about'){
        $("#content").load('pages/about.html');
    }
}
$(document).ready(()=> {
    initPage('about');
    $("#about").click(()=> {
        $("#content").addClass("anim_diamond");
        initPage('about');
    });
});