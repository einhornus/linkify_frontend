let jokes = []
let tm = null
let menu = null
let slider = null
let output = null
let parts = null
let sc = null
let jkname = ""
let ppp = ""

let joke_mode = 0

let parts_main = null
let parts_translated = null

let lastHandle = new Date().getTime();

let translatedStage = 0
let alignmentStage = 0

let examplesStage = false;

let initialTranslationStuff = ""
let i_see_joke = false

was_trans = false
was_al = false

oldVal = null

function dojoke() {
    menu.hidden = !menu.hidden
}

striped_ccb = ""

function ccb(tx) {
    oldVal = tx
    //document.getElementById("p").innerHTML = tx;

    if (translatedStage && parts_translated[slider.value - 1] != undefined) {
        html = "<table class='center'>"
        html += "<td>"
        html += oldVal
        html += "</td>"
        html += "<td>"
        html += parts_translated[slider.value - 1];
        html += "</td>"
        html += "</table>"
        ppp.innerHTML = html;
    } else {
        if (translatedStage) {
            ___api_translate(striped_ccb, std_langs[main_lang],
                function (rs) {
                    ppp = document.getElementById("demonstrative")

                    html = "<table class='center'>"
                    html += "<td>"
                    html += oldVal
                    html += "</td>"
                    html += "<td>"
                    html += rs
                    html += "</td>"
                    html += "</table>"

                    ppp.innerHTML = html;
                }, the_login, the_password
            )
        } else {
            ppp.innerHTML = oldVal;
        }
    }

    newjk = tx
    newjk = newjk.replaceAll("</br>", "\n")
    newjk = newjk.replaceAll("<br />", "\n")
    newjk = newjk.replaceAll("<br>", "\n")
    output.innerHTML = "Page " + slider.value + "/" + slider.max;
    setCookie_(jkname, (slider.value - 1), 10000)

    /*
    if (was_al) {
        do_align()
        was_al = false
    }
    else {
        if (was_trans) {
            do_translate()
            was_trans = false
        }
    }

     */
}

function update_slider() {
    if (translatedStage != 0) {
        was_trans = true
    }

    if (alignmentStage != 0) {
        was_al = true
    }

    //translatedStage = 0
    alignmentStage = 0
    initialTranslationStuff = ""

    ppp = document.getElementById("demonstrative")
    var jk = parts_main[slider.value - 1];
    document.getElementById("text").value = jk
    ppp.style.lineHeight = ""
    ppp.style.fontSize = "16px"

    handleText(jk, ccb);
    //document.getElementById("trans_button").hidden = true

    if (parts_translated.length > 0) {
        //document.getElementById("trans_button").hidden = false;
    }

    cont.innerHTML = ""
    prono.innerHTML = ""
    ety.innerHTML = ""
    i_see_joke = true

    //convert_translation()
}

function convert_translation() {
    oldVal = ppp.innerHTML

    if (translatedStage) {
        ppp = document.getElementById("demonstrative")

        html = "<table class='center'>"
        html += "<td>"
        html += oldVal
        html += "</td>"
        html += "<td>"
        html += parts_translated[slider.value - 1];
        html += "</td>"
        html += "</table>"

        ppp.innerHTML = html
    } else {

    }
}

function dofwd() {
    if (slider.value != slider.max) {
        slider.value++;
    }
    update_slider()
}

function doback() {
    if (slider.value != slider.min) {
        slider.value--;
    }
    update_slider()
}

function setCookie_(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie_(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function do_translate() {

    if (authorized_tier == 0) {
        try_register();
        return
    }

    if (authorized_tier == 1) {
        alert("You're currently a Silver tier supporter. This feature is only available for the Gold tier supporters")
        return
    }

    if (parts_translated != null && parts_translated.length > 0 && i_see_joke) {

    } else {
        const et2 = document.getElementById("translation_toggle");
        et2.hidden = true
    }

    //if(joke_mode == 0) {

    if (translatedStage == 0) {
        initialTranslationStuff = document.getElementById("text")
        trans_thing = document.getElementById("text").value

        if (parts_translated != null && parts_translated.length > 0 && i_see_joke) {
            ppp = document.getElementById("demonstrative")

            html = "<table class='center'>"
            html += "<td>"
            html += ppp.innerHTML
            html += "</td>"
            html += "<td>"
            html += parts_translated[slider.value - 1];
            html += "</td>"
            html += "</table>"

            ppp.innerHTML = html
            //i_see_joke = true
            //joke_mode = 1;
        } else {
            /*
            ___api_translate(trans_thing, std_langs[main_lang],
                function (rs) {
                    ppp = document.getElementById("demonstrative")

                    html = "<table class='center'>"
                    html += "<td>"
                    html += ppp.innerHTML
                    html += "</td>"
                    html += "<td>"
                    html += rs
                    html += "</td>"
                    html += "</table>"

                    ppp.innerHTML = html;
                }, the_login, the_password
            )
             */
        }

        translatedStage = 1
        return
    }

    if (translatedStage == 1) {
        f()
        initialTranslationStuff = ""
        translatedStage = 0
        //i_see_joke = true
        return;
    }
}


function show_joke(index) {
    let __parts = {}

    path = jokes[index][2]
    if (path[0] != '$') {
        __parts["main"] = get_text_parts("texts\\" + jokes[index][2] + "_" + std_langs[main_lang])
        __parts["native"] = get_text_parts("texts\\" + jokes[index][2] + "_" + std_langs[native_lang])
        __parts["english"] = get_text_parts("texts\\" + jokes[index][2] + "_" + "en")
        parts_main = __parts["main"]
        parts_translated = __parts["native"]

        if (__parts["native"].length == 0 && main_lang != 0) {
            parts_translated = __parts["english"]
        }
    } else {
        txt = window.localStorage.getItem(path.substring(1))
        parts_main = splitBook(txt)
        parts_translated = []
    }


    //document.getElementById("trans_button").hidden = true

    jkname = jokes[index][1]

    let prevPage = getCookie_(jkname)
    if (prevPage == "") {
        prevPage = 0;
    }

    slider.max = parts_main.length
    slider.value = 1
    output.innerHTML = "Page 1";

    var c = getCookie_("lockbar")

    if (c != "true") {
        slider.onchange = function () {
            update_slider()
        }
    } else {
        slider.hidden = true
    }

    //menu.hidden = true;
    sc.hidden = false

    slider.value = parseInt(prevPage) + 1;
    update_slider()
}

function level_to_string(lvl) {
    ar = [
        "Complete beginner",
        "Beginner",
        "A0",
        "A1",
        "A2",
        "B1",
        "B2",
        "C1",
        "Unknown"
    ]
    return ar[lvl]
}


function translation_to_string(trans) {
    if (trans == "mt") {
        return "<img src=\"images//google.svg\" title=\"Google Translate\" style=\"width:50px;height:50px;\">"
    } else {
        return "<img src=\"images//flags//" + trans + ".svg\" title=\"" + trans + "\" style=\"width:50px;height:50px;\">"
    }
}


function getImage(im, size) {
    return "<img src='" + im + "' style=\"width:" + size + "px;height:" + size + "px;\">"
}


function make_tree(list, category) {
    res = ""
    res += "<a href=\"#\" onclick=\"make_menu()\">\n" +
        "                    <img src=\"images/prev.svg\" alt=\"Random joke\" title=\"Read texts\"\n" +
        "                         style=\"width:60px;height:60px;\">" +
        "                </a>"
    res += "<h1>" + "Books in category '" + category + "'</h1>"
    res += "<table class = 'center'>"


    res += "<tr>"
    res += "<td style='text-align: center' ><h1>" + "Title" + "</h1></td>"
    res += "<td style='text-align: center'><h1>" + "Level" + "</h1></td>"
    res += "<td style='text-align: center'><h1>" + "Translation" + "</h1></td>"
    res += "<tr>"

    for (let i = 0; i < list.length; i++) {
        if (list[i][0] == category) {
            res += "<tr>"
            res += "<td style='text-align: center'> <a href=\"#\" onclick=\"show_joke(" + i + ")\">" + list[i][1] + "</a></td>"
            res += "<td style='text-align: center'>" + level_to_string(list[i][4]) + "</td>"
            res += "<td style='text-align: center'>" + translation_to_string(list[i][3]) + "</td>"

            res += "</tr>"
        }
    }
    res += "</table>"
    return res

}

function load_category(cat) {
    let html = make_tree(jokes, cat)
    cont.innerHTML = html
    prono.innerHTML = ""
    ety.innerHTML = ""
}

function make_menu() {
    const et2 = document.getElementById("translation_toggle");
    et2.checked = false;

    parsejokes()
    menu = document.getElementById("menudiv")
    sc = document.getElementById("sld")
    //menu.hidden = true;
    sc.hidden = true;
    i_see_joke = false;
    translatedStage = 0;
    alignmentStage = 0;
    let html = make_categories_pane()//make_tree(jokes, "Fairy tales")
    slider = document.getElementById("myRange");
    output = document.getElementById("demo");
    output.innerHTML = "";
    cont.innerHTML = html
    prono.innerHTML = ""
    ety.innerHTML = ""
}

function parsejokes() {
    jokes = []
    already_loaded = new Set()

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "lang_libs//" + std_langs[main_lang] + ".txt", false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;

                let lines = allText.split(/\r?\n/);
                prev = ""
                for (let i = 0; i < lines.length; i++) {
                    line = lines[i];

                    if (line.length > 0) {
                        split = line.split(';')

                        path = split[0]
                        nm = split[1]
                        bookname = split[2]
                        translated = split[3]
                        lvl = parseInt(split[4])

                        if (translated == std_langs[native_lang] || translated == "mt") {
                            jokes.push([path, nm, bookname, translated, lvl])
                            already_loaded.add(nm)
                        }

                        if (translated == "en" && native_lang != 0) {
                            //if(!already_loaded.has(nm)){
                            jokes.push([path, nm, bookname, translated, lvl])
                            //}
                        }
                    }
                }

                cook = getCookie_("added_books")
                splc = cook.split("$")
                for (let i = splc.length-1; i >= 0; i--) {
                    titleLang = splc[i].split("^")
                    title = titleLang[1]
                    lnnn = parseInt(titleLang[0])
                    if (title.length > 0 && lnnn == main_lang) {
                        jokes.push(["My books", title, "$" + splc[i], "mt", 8])
                    }
                }

                return jokes
            }
        }
    }

    rawFile.send(null);
}

function addCustomBook(title, text) {
    parts_main = splitBook(text)
    parts_translated = []

    jkname = title

    let prevPage = getCookie_(jkname)
    if (prevPage == "") {
        prevPage = 0;
    }

    slider.max = parts_main.length
    slider.value = 1
    output.innerHTML = "Page 1";

    var c = getCookie_("lockbar")

    if (c != "true") {
        slider.onchange = function () {
            update_slider()
        }
    } else {
        slider.hidden = true
    }

    //i_see_joke = true
    //menu.hidden = true;
    sc.hidden = false

    slider.value = parseInt(prevPage) + 1;
    update_slider();

    unique_name = main_lang+"^"+title
    oldv = getCookie_("added_books")
    newv = oldv + "$" + unique_name
    setCookie_("added_books", newv, 10000)

    myStorage = window.localStorage;
    myStorage.setItem(unique_name, text)
}

function splitBook(text) {
    res = []
    limit = 100
    if (main_lang == 8) {
        limit = 10
    }
    badChars = ['.', '?', '!', '。', '！', '？', '\n', '\r']

    last = ""
    for (let i = 0; i < text.length; i++) {
        last += text[i]

        ibc = false

        for (let j = 0; j < badChars.length; j++) {
            if (text[i] == badChars[j]) {
                ibc = true
            }
        }

        if (last.length > limit && ibc) {
            last = last.replaceAll("\n", "")
            last = last.replaceAll("\r", "")
            res.push(last)
            last = ""
        }
    }

    if (last.length > 0) {
        last = last.replaceAll("\n", "")
        last = last.replaceAll("\r", "")
        res.push(last);
    }
    return res
}

function make_categories_pane() {
    res = "<h1>Book categories</h1>"
    res += "<table>"

    res += "<tr>"
    res += "<td>" + "<a href=\"#\" onclick=\"load_category('My books')\">" + getImage("images//book.svg", 120) + "</a></td>"
    res += "<td>" + "<a href=\"#\" onclick=\"load_category('Humor')\">" + getImage("images//humor.svg", 120) + "</a></td>"
    res += "<td>" + "<a href=\"#\" onclick=\"load_category('Fairy tales')\">" + getImage("images//fairytale.svg", 120) + "</a></td>"
    res += "<td>" + "<a href=\"#\" onclick=\"load_category('Fantasy')\">" + getImage("images//dragon.svg", 120) + "</a></td>"
    res += "<td>" + "<a href=\"#\" onclick=\"load_category('Bible')\">" + getImage("images//bible.svg", 120) + "</a></td>"
    res += "<tr>"

    res += "<tr>"
    res += "<td>" + "<a href=\"#\" onclick=\"load_category('My books')\"><h1>My books</h1></a>" + "</td>"
    res += "<td>" + "<a href=\"#\" onclick=\"load_category('Humor')\"><h1>Humor</h1></a>" + "</td>"
    res += "<td>" + "<a href=\"#\" onclick=\"load_category('Fairy tales')\"><h1>Fairy tales</h1></a>" + "</td>"
    res += "<td>" + "<a href=\"#\" onclick=\"load_category('Fantasy')\"><h1>Fantasy</h1></a>" + "</td>"
    res += "<td>" + "<a href=\"#\" onclick=\"load_category('Bible')\"><h1>Bible</h1></a>" + "</td>"
    res += "<tr>"

    res += "</table>"
    return res
}

function get_text_parts(name) {
    let __parts = []
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", name, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;

                let lines = allText.split(/\r?\n/);
                prev = null
                for (let i = 0; i < lines.length; i++) {
                    line = lines[i];
                    //line = line.replace(" ", " ");
                    //line = line.replace(" ", "-");

                    if (line != undefined) {
                        if (line.length > 0) {
                            if (line.indexOf("***") == -1) {
                                prev += line + "<br>"
                            } else {
                                if (prev != null) {
                                    prev = prev.replaceAll("<br><br><br>", "<br>")
                                    prev = prev.replaceAll("<br><br>", "<br>")
                                    if (prev.indexOf("<br>") == 0) {
                                        prev = prev.substring(4)
                                    }
                                    __parts.push(prev)
                                }
                                prev = ""
                            }
                        }
                    }
                }

                //return __parts
            }
        }
    }

    rawFile.send(null);
    return __parts
}


function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}
