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
                stdOut.append(`<div class="red">Failed to install package: ${name}. Unusual package size!</div>`);
                return;
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
            stdOut.append("<div>Email: contact@immo2n.com</div>");
            stdOut.append("<div>LinkedIn: linkedin.com/in/immo2n</div>");
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