const commandHistory = [];
let historyIndex = -1;

const shell = (cmd, shellLocation, stdOut, shellField, callback) => {
    if (cmd.trim() !== "") {
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;
    }

    async function getFileSize(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}, status: ${response.status}`);
            }
            const size = response.headers.get('content-length');
            return size ? parseInt(size, 10) : 0;
        } catch (error) {
            throw error;
        }
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    stdOut.append(`<div><span class="prompt" style="margin-right:7px">${$(shellLocation).html()}</span>${cmd}</div>`);
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    const rootDir = "this@immo2n.com:~$";
    const resDir = "this@immo2n.com:~/res$";
    const currentDir = $(shellLocation).html();

    const isRoot = currentDir === rootDir;

    const availableCommands = ["clear", "help", "ls", "pwd", "cd", "rm", "nano", "ping", "exit", "restart"];
    if (isRoot) {
        availableCommands.push("./contact");
        availableCommands.push("./about");
        availableCommands.push("./projects");
        availableCommands.push("./skills");
        availableCommands.push("./education");
        availableCommands.push("./experience");
    }

    function getSuggestions(input) {
        const suggestions = availableCommands.filter(command => command.startsWith(input) || command.startsWith(`./${input}`));
        return suggestions.length > 0 ? suggestions : null;
    }

    async function install(url, type, name, leader) {
        if (!url || !type || !name || !leader) {
            stdOut.append(`<div class="red">Error! Package installer is unsatisfied. Use apt install instead!</div>`);
        }
        if (eval('typeof ' + leader) !== 'undefined') {
            stdOut.append(`<div>Package ${name} is already satisfied in this location.</div>`);
            return;
        }
        stdOut.append(`<div><font color="lime"><b>[FETCH]</b></font> Fetching script:${type}-> ${url}</div>`);
        if (type === 'js') {
            const js = document.createElement('script');
            js.src = url;
            document.head.appendChild(js);
            js.onerror = () => {
                stdOut.append(`<div><font color="red"><b>[ERROR]</b></font> Failed to fetch: ${url}</div>`);
            }
            const size = await getFileSize(url);
            stdOut.append(`<div>Fetched successfully(${url})...${formatBytes(size)}</div>`);
            stdOut.append(`<div>Installing... ${url}</div>`);
            if (size == 0) {
                stdOut.append(`<div><font color="blue"><b>[WARNING]</b></font>Potential failure to install package: ${name}. Unusual package size!</div>`);
                stdOut.append(`<div><font color="blue"><b>[WARNING]</b></font>Potential failure to install package: ${name}. Still checking for leader...</div>`);
            }
            let tries = 0;
            function check() {
                setTimeout(() => {
                    if (eval('typeof ' + leader) !== 'undefined') {
                        stdOut.append(`<div class="green">Installed package: ${name}</div>`);
                        if (null != callback) callback();
                        let old = localStorage.getItem('packages');
                        try {
                            if (old) {
                                old = JSON.parse(old);
                            }
                            else {
                                old = [];
                            }
                            if (typeof old !== 'object' || old.indexOf(name) > -1) return;
                            old.push(name);
                            old = JSON.stringify(old);
                            localStorage.setItem('packages', old);
                        }
                        catch {
                            console.log("Can't parse packages history!");
                        }
                        return;
                    }
                    else {
                        check();
                    }
                    tries++;
                    if (tries > 600) {
                        stdOut.append(`<div class="red">Failed to install package: ${name}. Could not probe! Maybe installed? run: ${name}</div>`);
                        return;
                    }
                }, 500);
            }
            check();
        }
    }

    switch (command) {
        case "./education":
            bash("clear", null);
            stdOut.append(`
                <style>
                .c_1 {
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    flex-direction: column;
                    text-align: center
                } </style>
                <div class="c_1" style="margin-bottom:10px">
                <div>
                    <a href="#" class="green" onclick="bash('./about', null)">About</a>
                    <a href="#" class="green" onclick="bash('./skills', null)">Skills</a>
                    <span style="color:lime"><b>Education</b></span>
                    <a href="#" class="green">Projects</a>
                    <a href="#" class="green">Contact</a>
                </div>
                <h2 style="color:lime">Education</h2>
                <div style="margin-bottom:15px">I am studying what I love: Software Engineering.</div>

                <div style="margin-bottom:15px">
                    <h3 style="color: lime">
                    B.Sc. in Software Engineering
                    </h3>
                    <div class="c_1">
                        🏫 Daffodil International University, Savar, Dhaka, Bangladesh
                        <br/> ⌚ Spring 2023 - Present
<pre>
+----------------------------------------------------------+
|                 University Achievements                  |
+----------------------------------------------------------+
| SCGPA 4 in Spring 2023          <a href="/res/spring2023Result.pdf" target="_blank" class="executable">[Open PDF](#spring_2023)</a> |
| SCGPA 4 in Fall 2023            <a href="/res/fall2023Result.pdf" target="_blank" class="executable">[Open PDF](#fall_2023)</a>   |
| Dean's List Award - Fall 2023   <a href="/res/deansListFall23.pdf" target="_blank" class="executable">[Open PDF](#deans_list)</a>  |
| SCGPA 4 in Spring 2024          <a href="#" onclick="alert('immo2n: PDF will be available soon!')" class="blue">[Open PDF](#spring_2024)</a> |
+----------------------------------------------------------+
</pre>
                    </div>

                    <h3 style="color: lime; margin-top: 10px;">
                    HSC in Science
                    </h3>
                    <div class="c_1">
                        🏫 Dinajpur Government College, Dinajpur, Rangpur, Bangladesh
                        <br/> ⌚ 2019 - 2021
<pre>
+----------------------------------------------------------+
|                 College Achievements                     |
+----------------------------------------------------------+
| HSC: GPA 5.00 <span title="Golden: GPA 5.00 in every subject including fourth.">G</span> in 2021 - Science Group (Dinajpur)       |
+----------------------------------------------------------+
                    </div>

                    <h3 style="color: lime; margin-top: 0;">
                    JSC and SSC in Science
                    </h3>
                    <div class="c_1">
                        🏫 Setabgonj Ideal Academy, Setabgonj, Dinajpur, Bangladesh
                        <br/> Elementary - 2019
<pre>
+----------------------------------------------------------+
|                 High School Achievements                 |
+----------------------------------------------------------+
| SSC: GPA 5.00 <span title="Golden: GPA 5.00 in every subject including fourth.">G</span> in 2021 - Science Group (Dinajpur        |
| JSC: GPA 5.00 <span title="Golden GPA 5.00 in every subject including fourth.">G</span> in 2021 - Science Group (Dinajpur)       |
+----------------------------------------------------------+
</pre>
                </div>

                <div style="margin-bottom:15px; margin-top: 10px;">
                    <span style="color:lime"><b>And my father who taught me Mathematics and Physics.</b></span>
                </div>
                
                </div>
            `);
            break;
        case "./skills":
            bash("clear", null);
            stdOut.append(`
                <style>
                .c_1 {
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    flex-direction: column;
                    text-align: center
                } </style>
                <div class="c_1" style="margin-bottom:10px">
                <div>
                    <a href="#" class="green" onclick="bash('./about', null)">About</a>
                    <span style="color:lime"><b>Skills</b></span>
                    <a href="#" class="green" onclick="bash('./education', null)">Education</a>
                    <a href="#" class="green">Projects</a>
                    <a href="#" class="green">Contact</a>
                </div>
                <h2 style="color:lime">Skills</h2>
                <div style="margin-bottom:15px">I am good at developing things, whether it's a native android app, web app or anything else.</div><pre style="margin-bottom:15px">Languages
+----+------------+------------+
| SL | Language   | Experience |
+----+------------+------------+
| 1  | JavaScript | 3   Years  |
| 2  | PHP        | 3   Years  |
| 3  | SQL        | 3   Years  |
| 4  | Java       | 2   Years  |
| 5  | C          | 2.5 Years  |
| 6  | CSS        | 3   Years  |
| 7  | Firebase   | 1   Years  |
+----+------------+------------+
OS: Linux(Arch, RHL), Windows</pre>
                <div style="margin-bottom:15px">⭐ My strongest skill is learning through hands-on experience, enabling me to achieve limitless aspirations.</div>
                <pre>    /$$$$$                              
   |__  $$                              
      | $$  /$$$$$$  /$$    /$$ /$$$$$$ 
      | $$ |____  $$|  $$  /$$/|____  $$
 /$$  | $$  /$$$$$$$ \  $$/$$/  /$$$$$$$
| $$  | $$ /$$__  $$  \  $$$/  /$$__  $$
|  $$$$$$/|  $$$$$$$   \  $/  |  $$$$$$$
 \______/  \_______/    \_/    \_______/</pre>
                <div style="margin-bottom:15px">I learned Java for freelancing and developed many successful Android(native) and Swing desktop apps. Some are listed in the Projects section.</div>

<pre style="font-size:30px">
        /     
   _   /_  _  
  /_)_/ /_/_)_
 /       /    
'       '     
</pre>
                <div style="margin-bottom:15px">I don't usually boast about PHP, but it was my first server language. I've done extensive native PHP coding and frequently use Composer. And honestly, \`php -S localhost:3000\` is a fast and handy local server!</div>

<pre style="font-size:small">
8888888b.           888    888                       
888   Y88b          888    888                       
888    888          888    888                       
888   d88P 888  888 888888 88888b.   .d88b.  88888b. 
8888888P"  888  888 888    888 "88b d88""88b 888 "88b
888        888  888 888    888  888 888  888 888  888
888        Y88b 888 Y88b.  888  888 Y88..88P 888  888
888         "Y88888  "Y888 888  888  "Y88P"  888  888
                888                                  
           Y8b d88P                                  
            "Y88P"                                   
</pre>
                <div style="margin-bottom:15px">I love Python for its simplicity and the wealth of revolutionary libraries it offers. It's my go-to language in the Linux terminal, making it indispensable to learn.</div>

<pre style="font-size:small">
  888888  .d8888b. 
    "88b d88P  Y88b
     888 Y88b.     
     888  "Y888b.  
     888     "Y88b.
     888       "888
     88P Y88b  d88P
     888  "Y8888P" 
   .d88P           
 .d88P"            
888P"              
</pre>

                <div style="margin-bottom:15px">What can I say about JavaScript? It's the GOAT of languages, with millions of libraries and thousands of frameworks just to ship HTML! I love jQuery still—sue me.</div>

<pre>
 ██████╗
██╔════╝
██║     
██║     
╚██████╗
 ╚═════╝
</pre>
                
                <div style="margin-bottom:15px">I am proud to program in C. I love its straightforwardness, versatility, and efficiency. I've created complex CLI projects for my university and often use C for basic tasks.</div>
                
                <div style="margin-bottom:15px">
                <i>
                As a developer more than a programmer, I'm skilled in languages like CSS, HTML (if you consider it one), XML (Java), and SQL, as well as tools like Firebase, NPM, Maven, Composer, and RHL.
                These tools are indispensable to me, and I love working with them.
                </i>
                </div>
                
                <div style="margin-bottom:15px">
                    <span style="color:lime"><b>And learning...</b></span>
                </div>
                
                </div>`);
            break;
        case "./about":
            bash("clear", null);
            stdOut.append(`
                <style>
                .pro_pic {
                    border-radius: 50%;
                    padding: 20px;
                    margin-top: 20px
                }
                .c_1 {
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    flex-direction: column;
                    text-align: center
                } </style>
                <div class="c_1" style="margin-bottom:10px">
                <div>
                    <span style="color:lime"><b>About</b></span>
                    <a href="#" class="green" onclick="bash('./skills', null)">Skills</a>
                    <a href="#" class="green" onclick="bash('./education', null)">Education</a>
                    <a href="#" class="green">Projects</a>
                    <a href="#" class="green">Contact</a>
                </div>
                <img class="pro_pic" src="/img/immo2n.jpg" alt="image: immo2n.jpg" height="200px" width="200px"/>
                <h2 style="color:lime">Md. Monoarul Islam Moon</h2>
                <div style="margin-bottom:15px">Software Engineer, Programmer and Freelancer</div>
                <div style="margin-bottom:15px">
                    <a href="https://www.github.com/immo2n" target="_blank" class="blue">Github</a>
                    <a href="https://www.linkedin.com/in/immo2n/" target="_blank" class="blue">LinkedIn</a>
                    <a href="https://www.facebook.com/immo2n" target="_blank" class="blue">Facebook</a>
                    <a href="mailto:immo2n.work@gmail.com" class="blue">Email</a>
                    <div style="margin-top:20px">
                    handle everywhere: @immo2n
                    </div>
                    <div style="margin-top:20px">
                    I am doing JavaScript, SQL & PHP for 4 Years. Java & C for 2 years.
                    <br/>Shipping android apps and modern web apps!
                    <br/>- Studying Software Engineering at <a href="https://daffodilvarsity.edu.bd/" target="_blank" style="color:lime">DIU</a>.
                    </div>
                </div>
                </div>`);
        break;
        case "whoami":
            var userAgent = navigator.userAgent;
            var browserName;
            if (userAgent.indexOf("Firefox") > -1) {
                browserName = "Mozilla Firefox";
            } else if (userAgent.indexOf("SamsungBrowser") > -1) {
                browserName = "Samsung Internet";
            } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
                browserName = "Opera";
            } else if (userAgent.indexOf("Trident") > -1) {
                browserName = "Microsoft Internet Explorer";
            } else if (userAgent.indexOf("Edge") > -1) {
                browserName = "Microsoft Edge";
            } else if (userAgent.indexOf("Chrome") > -1) {
                browserName = "Google Chrome";
            } else if (userAgent.indexOf("Safari") > -1) {
                browserName = "Safari";
            } else {
                browserName = "Unknown";
            }
            if(!browserName) stdOut.append("<div>this</div>");
            else stdOut.append(`<div>${browserName} (this)</div>`);
            break;
        case "python":
            if (typeof pyscript == 'undefined') {
                stdOut.append("<div>python: command not found</div>");
                stdOut.append("Do you want to install python? run: apt install python");
            }
            else {

            }
            break;
        case "apt":
            if (args.length < 2) {
                stdOut.append("<div>apt: missing argument [command] [package]</div>");
                break;
            }
            if (args[0] === "install") {
                stdOut.append(`<div>apt: installing package ${args[1]}</div>`);
                switch (args[1]) {
                    case "python":
                        stdOut.append(`<div>apt: getting package ${args[1]}</div>`);
                        install('/packages/python.js', 'js', "python", 'pyscript')
                        break;
                    default:
                        stdOut.append(`<div>apt: package ${args[1]} not found</div>`);
                }
            }
            else if (args[0] === "uninstall") {
                let old = localStorage.getItem('packages');
                try {
                    if (old) {
                        old = JSON.parse(old);
                        if (old.length == 0) {
                            stdOut.append(`<div>apt: no external packages found!</div>`);
                        }
                        else {
                            if (old.indexOf(args[1]) == -1) {
                                stdOut.append(`<div>apt: package ${args[1]} is not found!</div>`);
                            }
                            else {
                                old = old.filter(item => item !== args[1]);
                                old = JSON.stringify(old);
                                localStorage.setItem('packages', old);
                                stdOut.append(`<div>apt: uninstalled package ${args[1]}</div>`);
                                stdOut.append('<div class="blue">[INFO] Packages maybe are still loaded in the environment. Please restart. run: restart</div>');
                            }
                        }
                    }
                    else {
                        stdOut.append(`<div>apt: no external packages found!</div>`);
                    }
                }
                catch (e) {
                    stdOut.append(`<div>apt: package list failed to load!</div>`);
                }
            }
            else if (args[0] === "list") {
                if (args[1] === "--installed") {
                    let old = localStorage.getItem('packages');
                    try {
                        old = JSON.parse(old);
                        if (old.length == 0) {
                            stdOut.append(`<div>apt list: no external packages!</div>`);
                        }
                        old.forEach(element => {
                            stdOut.append(`<div>${element}</div>`);
                        })
                    }
                    catch (e) {
                        stdOut.append(`<div>apt list: no external packages!</div>`);
                    }
                }
                else {
                    stdOut.append(`<div>apt list: invalid argument ${args[1]}</div>`);
                }
            }
            else {
                stdOut.append(`<div>apt: invalid argument ${args[0]}</div>`);
            }
            break;
        case "clear":
            stdOut.html("");
            break;
        case "help":
            stdOut.append("<div>apt - install, uninstall or list external packages</div>");
            stdOut.append("<div>apt list - list external packages, --installed: Installed packages</div>");
            stdOut.append("<div>cd [directory] - change directory</div>");
            stdOut.append("<div>clear - clear the screen</div>");
            stdOut.append("<div>exit - exit the shell</div>");
            stdOut.append("<div>help - show this help message</div>");
            stdOut.append("<div>ls - list files in the current directory</div>");
            stdOut.append("<div>nano [file] - open file</div>");
            stdOut.append("<div>ping [host] - ping host</div>");
            stdOut.append("<div>pwd - show current directory path</div>");
            stdOut.append("<div>restart - restart the shell</div>");
            stdOut.append("<div>rm [file] - remove file</div>");
            stdOut.append("<div>whoami - show current user's name</div>");
            break;
        case "ls":
            if (currentDir === resDir) {
                stdOut.append("<div>app.css</div>");
                stdOut.append("<div>app.js</div>");
                stdOut.append("<div>jquery.js</div>");
                stdOut.append("<div>shell.js</div>");
            } else {
                stdOut.append('<div class="executable">about</div>');
                stdOut.append('<div class="executable">contact</div>');
                stdOut.append('<div class="executable">education</div>');
                stdOut.append('<div class="executable">experience</div>');
                stdOut.append('<div class="executable">projects</div>');
                stdOut.append('<div class="executable">skills</div>');
                stdOut.append("<div>index.html</div>");
                stdOut.append('<div class="blue">res</div>');
            }
            break;
        case "pwd":
            stdOut.append(`<div>${currentDir.replace(rootDir, "https://immo2n.com/").replace(/\$$/, "")}</div>`);
            break;
        case "cd":
            if (args.length === 0) {
                $(shellLocation).html(rootDir);
            } else if (args[0] === "res" && isRoot) {
                $(shellLocation).html(resDir);
            } else if (args[0] === "..") {
                if (currentDir !== rootDir) {
                    $(shellLocation).html(rootDir);
                } else {
                    stdOut.append("<div>cd: permission denied</div>");
                }
            } else {
                stdOut.append(`<div>cd: ${args[0]}: No such file or directory</div>`);
            }
            break;
        case "rm":
            if (args.length === 0) {
                stdOut.append("<div>rm: missing argument</div>");
            } else {
                stdOut.append("<div>rm: permission denied</div>");
            }
            break;
        case "nano":
            if (args.length === 0) {
                stdOut.append("<div>nano: missing argument</div>");
            } else {
                const fileName = args[0];
                if (currentDir === resDir && (fileName === "app.css" || fileName === "app.js" || fileName === "jquery.js" || fileName === "shell.js")) {
                    window.open(`/res/${fileName}`, '_blank');
                } else if (currentDir === rootDir && fileName === "index.html") {
                    window.open(`/${fileName}`, '_blank');
                } else {
                    stdOut.append(`<div>nano: ${fileName}: No such file</div>`);
                }
            }
            break;
        case "ping":
            let count = 1;
            let target = "";

            if (args.length === 0) {
                stdOut.append("<div>ping: missing argument</div>");
                break;
            }

            for (let i = 0; i < args.length; i++) {
                if (args[i] === "-c" && i + 1 < args.length) {
                    count = parseInt(args[i + 1], 10);
                    if (isNaN(count) || count <= 0) {
                        stdOut.append(`<div>ping: invalid count value "${args[i + 1]}"</div>`);
                        return;
                    }
                    i++;
                } else {
                    target = args[i];
                }
            }

            const startTime = performance.now();

            const ping = (url) => {
                return new Promise((resolve, reject) => {
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';

                    const onLoadHandler = () => {
                        const endTime = performance.now();
                        const responseTime = endTime - startTime;
                        resolve(responseTime);
                        document.body.removeChild(iframe);
                    };

                    iframe.onload = onLoadHandler;
                    iframe.src = url;
                    document.body.appendChild(iframe);
                });
            };

            const pingRequests = [];
            for (let i = 0; i < count; i++) {
                const pingUrl = `https://${target}`;
                pingRequests.push(ping(pingUrl).then(responseTime => {
                    stdOut.append(`<div>PING ${target}: Response received in ${responseTime.toFixed(2)}ms</div>`);
                }).catch(error => {
                    stdOut.append(`<div>PING ${target}: Error - ${error.message}</div>`);
                }));
            }

            break;
        case "exit":
            stdOut.append("<div>exit: cannot exit shell from this environment. Process id not > 0! Not a parent.</div>");
            break;
        case "restart":
            location.reload();
            break;
        default:
            stdOut.append(`<div>${command}: command not found</div>`);
            const suggestions = getSuggestions(command);
            if (null != suggestions) stdOut.append(`<div>Did you mean: ${suggestions.join(', ')}</div>`);
            break;
    }

};

$(document).ready(() => {
    const shellField = $(".shell-input");
    const shellLocation = $("#shell-location");
    $(shellField).on('keydown', (event) => {
        if (event.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                $(shellField).val(commandHistory[historyIndex]);
            }
            event.preventDefault();
        } else if (event.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                $(shellField).val(commandHistory[historyIndex]);
            } else {
                historyIndex = commandHistory.length;
                $(shellField).val('');
            }
            event.preventDefault();
        } else if (event.key === 'Tab') {
            suggestFileNames(shellField, $(shellLocation).html());
            event.preventDefault();
        }
    });
});

function suggestFileNames(shellField, currentDir) {
    const stdOut = $("#shell-input");
    const userInput = $(shellField).val().trim();
    const parts = userInput.split(/\s+/);
    const lastWord = parts[parts.length - 1];

    let suggestions = [];
    if (currentDir === "this@immo2n.com:~/res$") {
        suggestions = ["app.css", "app.js", "jquery.js", "shell.js"];
    } else if (currentDir === "this@immo2n.com:~$") {
        suggestions = ["index.html", "res"];
    }

    const matchingSuggestions = suggestions.filter(fileName => fileName.startsWith(lastWord));
    if (matchingSuggestions.length === 1) {
        const completedCommand = parts.slice(0, parts.length - 1).join(" ") + " " + matchingSuggestions[0];
        $(shellField).val(completedCommand);
    } else if (matchingSuggestions.length > 1) {
        stdOut.append(`<div>${matchingSuggestions.join(" ")}</div>`);
    }
}