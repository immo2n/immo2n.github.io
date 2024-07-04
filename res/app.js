const app = ()=> {
    if(typeof $ !== 'function' || typeof shell !== 'function'){
        setTimeout(() => {
            app();
        }, 200);
        return;
    }
    $(document).ready(()=> {
        $(".shell-input").on("keypress", (e)=> {
            $(".content").animate({ scrollTop: 10e10}, 0);
            if (e.which == 13) {
                const cmd = $(e.target).val();
                if(cmd.length == 0) return;
                $(e.target).val("");
                shell(cmd, $("#shell-location"), $("#main"));
            }
        });
        window.bash = (cmd, callback)=> {
            shell(cmd, $("#shell-location"), $("#main"), null, callback);
        }
    });
};
app();