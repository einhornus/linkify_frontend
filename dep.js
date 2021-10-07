let std_langs = ["en", "es", "de", "fr", "ru", "pt", "it", "nl", "zh"]
let std_langs_full = ["English", "Spanish", "German", "French", "Russian", "Portuguese", "Italian", "Dutch", "Mandarin"]

let main_lang = 4
let native_lang = 0
let authorized_tier = 0
let the_login = null
let the_password = null
let generated_pass = null
let __urlParams = null

last_word_loaded = null

function init_native_lang() {
    if (navigator.languages != undefined) {
        for (let j = 0; j < std_langs.length; j++) {
            for (let i = 0; i < navigator.languages.length; i++) {
                let lng = navigator.languages[i];
                if (lng.indexOf(std_langs[j]) != -1 && j != main_lang) {
                    native_lang = j
                    break
                }
            }
        }
    }

    natcookie = getCookie_("nat")
    if(natcookie != null && natcookie !== '' && natcookie != undefined){
        native_lang = parseInt(natcookie)
    }

    if(native_lang === undefined){
        native_lang = 'en'
    }

    if (main_lang == 8) {
        console.log("Set English")
        native_lang = 0
    }

    if(main_lang == 0 && native_lang == 0){
        native_lang = 4
    }

    //const __queryString = window.location.search;
    //__urlParams = new URLSearchParams(__queryString);


    let _login = urlParams.get('login')
    let _pass = urlParams.get('password')

    if (_login != null && _login.length > 0) {
        the_login = _login
        the_password = _pass
    }


    if (main_lang != 4) {
        if (document.getElementById("demonstrative") != null) {
            document.getElementById("demonstrative").style.fontFamily = "Roboto"
        }

        if (document.getElementById("content") != null) {
            document.getElementById("content").style.fontFamily = "Roboto"
        }

        if (document.getElementById("text") != null) {
            document.getElementById("text").style.fontFamily = "Roboto"
        }
    }

    if (main_lang == 4) {
        //document.getElementById("speaking_practice").hidden = false
        if (document.getElementById("text") != null) {
            document.getElementById("text").style.fontFamily = "Verdana"
        }

        if (document.getElementById("demonstrative") != null) {
            document.getElementById("demonstrative").style.fontFamily = "Verdana"
        }

        if (document.getElementById("content") != null) {
            document.getElementById("content").style.fontFamily = "Verdana"
        }
    }
}


function accept_lang() {
    __queryString2 = window.location.search;
    urlParams6 = new URLSearchParams(__queryString2);

    let lang = urlParams6.get("lang")
    if (lang != null) {
        if (lang != "en") {

            try {
                document.getElementById("listening_button_thingie").hidden = true;
                document.getElementById("vocab_button_thingie").hidden = true;
            } catch (error) {

            }
        } else {
            try {

                document.getElementById("listening_button_thingie").hidden = true;
                document.getElementById("vocab_button_thingie").hidden = true;
            } catch (error) {

            }
        }

        if (lang == "nl") {
            main_lang = 7
            document.querySelector("link[rel='icon']").href = "images/flags/nl.svg";
        }

        if (lang == "fr") {
            main_lang = 3

            document.querySelector("link[rel='icon']").href = "images/flags/fr.svg";
            try {

                document.getElementById("listening_button_thingie").hidden = true;
                //document.getElementById("vocab_button_thingie").style.visibility = "hidden";
            } catch
                (error) {

            }
        }

        if (lang == "en") {
            main_lang = 0
            document.querySelector("link[rel='icon']").href = "images/flags/en.svg";
        }

        if (lang == "de") {
            main_lang = 2
            document.querySelector("link[rel='icon']").href = "images/flags/de.svg";

            try {

                document.getElementById("listening_button_thingie").hidden = true;
            } catch (error) {

            }

        }

        if (lang == "zh") {
            main_lang = 8
            document.querySelector("link[rel='icon']").href = "images/flags/zh.svg";
            //document.getElementById("listening_button_thingie").style.visibility = "hidden";
            try {
                document.getElementById("listening_button_thingie").hidden = true
                document.getElementById("vocab_button_thingie").hidden = true
            } catch
                (error) {

            }
        }
    }

    init_native_lang()
}


function log_out() {
    document.getElementById("login_name").value = the_login
    document.getElementById("login_pass").value = the_password
    document.getElementById("login_pass").type = "text"

    setCookie_("last_login", "", 100000)
    setCookie_("last_password", "", 100000)
    thingie1 = document.getElementById("container1")
    thingie2 = document.getElementById("container2")
    greet = document.getElementById("grr")

    thingie1.hidden = false
    thingie2.hidden = true

    is_auhorized = false
    authorized_tier = 0

    the_login = null
    the_password = null
}

function try_register() {
    window.open("signup.html?lang=" + std_langs[main_lang], '_blank');

    /*
    login = document.getElementById("login_name").value
    password = document.getElementById("login_pass").value

    ___api_register(login, password, function (result){
        if(result == "0"){
            try_authorize()
        }
        if(result == "1"){
            alert("User with this login already registered")
        }
    })
     */
}

function try_register2() {
    login = document.getElementById("login_name2").value
    password = generated_pass//document.getElementById("login_pass2").value
    key = document.getElementById("login_key2").value

    if (login.length < 2) {
        alert("Login is too short")
        return
    }

    if (password.length <= 4) {
        alert("Password is too short")
        return
    }

    if (login.indexOf(" ") != -1) {
        alert("Login can't contain spaces. Please remove them")
        return
    }

    if (password.indexOf(" ") != -1) {
        alert("Password can't contain spaces. Please remove them")
        return
    }

    ___api_register(login, password, key, function (result) {
        if (result == "0") {
            window.open("index.htm?login=" + login + "&password=" + password + "&lang=" + std_langs[main_lang], '_blank');
            //window.open("linkify.html", '_blank');
        }

        if (result == "1") {
            alert("User with this login already registered")
        }

        if (result == "-1") {
            alert("The key is invalid")
        }

        if (result != '0' && result != '1' && result != "-1") {
            alert("Please remove spaces from the login and the password")
        }
    })
}

function init_start() {
    let txt = __urlParams.get("text")
    if (txt != null) {
        document.getElementById("text").value = txt
        f()
    }
}

function try_authorize(l = null, p = null) {
    if (l == null) {
        login = document.getElementById("login_name").value
    } else {
        login = l
    }

    if (p == null) {
        password = document.getElementById("login_pass").value
    } else {
        password = p
    }

    if (login.length < 1) {
        alert("Login is too short")
        return
    }

    if (password.length <= 4) {
        alert("Password is too short")
        return
    }

    ___api_authorize(login, password, function (result) {
        if (result == "None") {
            setCookie_("last_login", "", 100000)
            setCookie_("last_password", "", 100000)
            alert("Wrong login or password")
        }

        if (result == "1" || result == "2" || result == "3") {
            thingie1 = document.getElementById("container1")
            thingie2 = document.getElementById("container2")
            greet = document.getElementById("grr")

            //thingie1.hidden = true
            //thingie2.hidden = false

            greet.innerText = "Hello, " + login
            is_auhorized = true

            authorized_tier = parseInt(result)
            the_login = login
            the_password = password

            ___api_encrypt(password, function (encrypto) {
                setCookie_("last_password", encrypto, 100000)
            })

            setCookie_("last_login", login, 100000)
            init_start()
        }

        if (result == "0") {
            alert("Your premium access has been deactivated since you're no longer a Patreon supporter. You can get it back (premium activation/deactivation based on current patrons list happens once a day)")
        }
    })
}

let cont = null
let ety = null
let prono = null
