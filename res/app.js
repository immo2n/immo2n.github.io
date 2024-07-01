$(document).ready(()=> {
    $(".shell-input").on("keypress", (e)=> {
        if (e.which == 13) {
            const cmd = $(e.target).val();
            if(cmd.length == 0) return;
            $(e.target).val("");
            shell(cmd, $("#shell-location"), $("#main"));
        }
    });
    window.bash = (cmd)=> {
        shell(cmd, $("#shell-location"), $("#main"));
    }
});