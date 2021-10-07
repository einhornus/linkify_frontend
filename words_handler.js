let history = []
let poses = []
let nietpushen = false

let pics = null
let plainwordlist = []


function handleback() {
    if (history.length <= 1) {

    } else {
        history.pop()
        nietpushen = true
        hndwrd(history[history.length - 1])
        document.documentElement.scrollTop = poses[history.length - 1]
    }

    if (poses <= 1) {

    } else {
        document.documentElement.scrollTop = poses[poses.length - 1]
        poses.pop()
    }
}

document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
    } else if (e.keyCode == '83') {
        if(!(document.activeElement == document.getElementById("text")) && !(document.activeElement == document.getElementById("searchfield"))) {
            speak(getSelectionText())
        }
    } else if (e.keyCode == '37') {
        handleback()
    } else if (e.keyCode == '82') {
        if(!(document.activeElement == document.getElementById("text")) && !(document.activeElement == document.getElementById("searchfield"))) {
            randomShortPhrase()
        }
    }


}

function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
        (activeElTagName == "textarea") || (activeElTagName == "input" &&
        /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
        (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}

let last_exception = ""

function randomShortPhrase() {
    ___api_speaking_phrase(0, "", function (res) {
        sepa = res.split("^^^")
        document.getElementById("text").value = sepa[0]
        translations_hash[sepa[0]] = sepa[1]
        last_exception = sepa[1]
        console.log("Speaking", sepa[0], "=", sepa[1], sepa)
        f();
    })
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const input = urlParams.get('lang')

if (input != undefined) {
    for (let ___qq = 0; ___qq < std_langs.length; ___qq++) {
        if (std_langs[___qq] == input) {
            main_lang = ___qq
            __real_lang = input
        }
    }
}

function reload_cookies() {
    __mt = getCookie_("mt")
    if (__mt == "") {
        setCookie_("mt", "1", 1000)
    }

    __inf = getCookie_("inf")
    if (__inf == "") {
        setCookie_("inf", "0", 1000)
    }

    __rt = getCookie_("rt")
    if (__rt == "") {
        setCookie_("rt", "0", 1000)
    }

    __un = getCookie_("un")
    if (__un == "") {
        setCookie_("un", "0", 1000)
    }

    __syn = getCookie_("syn")
    if (__syn == "") {
        setCookie_("syn", "0", 1000)
    }

    __rel = getCookie_("rel")
    if (__rel == "") {
        setCookie_("rel", "0", 1000)
    }

    __der = getCookie_("der")
    if (__der == "") {
        setCookie_("der", "0", 1000)
    }
}

function _dosearch(index, www) {
    stuff = ""
    if (index == 1) {
        stuff = ___api_search_(www, "word")
    } else {
        stuff = ___api_search_(www, "distance")
    }

    putText2(stuff, false, "$" + index + www)
}

function dosearch(index) {
    word = document.getElementById("searchfield").value
    //stuff = ___api_search_(www, "word")
    d1 = document.getElementById("demonstrative")
    if(d1.innerHTML.indexOf("Just put some text into the box")!=-1){
        d1.innerHTML = ""
    }

    /*
    if(main_lang != 0) {
        _dosearch(index, word)
    }
    else{
        hndwrd(word)
    }
     */

    _dosearch(index, word)
}

function f() {
    //const et2 = document.getElementById("translation_toggle");
    //et2.checked = false

    var inputVal = document.getElementById("text").value;
    var p = document.getElementById("demonstrative");
    //document.getElementById("trans_button").hidden = true
    handleText(inputVal, function (txt) {
        if (translatedStage) {
            ___api_translate(inputVal, std_langs[main_lang],
                function (rs) {
                    ppp = document.getElementById("demonstrative")

                    html = "<table class='center'>"
                    html += "<td>"
                    html += txt
                    html += "</td>"
                    html += "<td>"
                    html += rs
                    html += "</td>"
                    html += "</table>"

                    p.innerHTML = html;
                }, the_login, the_password
            )


        } else {
            p.innerHTML = txt;
        }

        s1 = document.getElementById("demonstrative").innerHTML;
        s2 = "hndwrd(";
        stt = s1.split(s2)


        if (stt.length == 2) {
            word_itself = stt[1].substr(1, stt[1].indexOf(")") - 2)
            hndwrd(word_itself)
        }
    });
    //p.style.lineHeight = 1
    i_see_joke = false

    if (alignmentStage == 1) {
        p.style.lineHeight = ""
        p.style.fontSize = "16px"
        alignmentStage = 0
    }

    //translatedStage = 0
    //sc.hidden = true
}

function do_align() {
    if (authorized_tier == 0) {
        try_register();
        return
    }

    if (authorized_tier == 1) {
        alert("You're currently a Silver tier supporter. This feature is only available for the Gold tier supporters")
        return
    }

    var p = document.getElementById("demonstrative");
    if (alignmentStage == 0) {
        var inputVal = document.getElementById("text").value;
        //document.getElementById("trans_button").hidden = true
        p.innerHTML = handleTextAlign(inputVal, function (txt) {
            p.innerHTML = txt;
            p.style.lineHeight = 2.5
            p.style.fontSize = "20px"
        });
        //i_see_joke = true
        alignmentStage = 1
    } else {
        f()
        initialTranslationStuff = ""
        translatedStage = 0
        //i_see_joke = true
        p.style.lineHeight = ""
        p.style.fontSize = "16px"
        alignmentStage = 0
    }

    //sc.hidden = true
}

function handleText(text, cb) {
    striped_ccb = text
    return ___api_handle_text(text, cb, the_login, the_password);
}

function handleTextSearch(text, cb) {
    res = ___api_handle_text(text, cb, the_login, the_password, true);
    return res
}

function handleTextAlign(text, cb) {
    return ___api_handle_text_align(text, cb, the_login, the_password);
}

function putText(text, hndl) {
    if (hndl) {
        handled = handleText(text)
    } else {
        handled = text
    }
    //var p = cont
    //cont.innerHTML = handled;

    document.getElementById("demonstrative").innerHTML = handled;

    /*
    if (!nietpushen) {
        history.push(handled)

        if (history.length > 1) {
            poses.push(document.documentElement.scrollTop)
        }
    }

    nietpushen = false
     */


}

function putText2(text, hndl, name) {
    if (hndl) {
        handled = handleText(text)
    } else {
        handled = text
    }
    var p = cont
    p.innerHTML = handled;

    ety.innerHTML = "";
    prono.innerHTML = "";


    if (!nietpushen) {
        history.push(name)

        if (history.length > 1) {
            poses.push(document.documentElement.scrollTop)
        }
    }

    nietpushen = false
}


function langtable(pc, word) {
    picstuff = ___api_search_(word, "word")
    if (!(picstuff == "No results found")) {
        if (getCookie_("mt") != "2") {
            pc.innerHTML = picstuff;
        } else {
            pc.innerHTML = "";
        }
    }
}

function put_info(link, intitial_form, form_type) {
    last_word_loaded = [link, intitial_form, form_type]

    if (intitial_form.indexOf("@") == 0) {
        rareword = intitial_form.substr(1)
        if (confirm(rareword + ' is a rare word. You need to register to access the full vocabulary. Register now?')) {
            try_register();
            return;
        } else {
            return;
        }
    }

    reload_cookies();

    //var content1 = cont
    //var prono = prono
    //var ety = ety

    prono.innerHTML = "";
    ety.innerHTML = "";

    conto = ___api_get_article_(link, the_login, the_password, last_exception);//+"|||||"+___api_get_reverso(link, the_login, the_password)
    //conto = ___api_get_reverso(link, the_login, the_password)


    _parts = conto.split("|||||")

    /*
    _parts[2] = _parts[2].replace("<h", "                <a href=\"#\" onclick=\"handleback()\">\n" +
        "                    <img src=\"images/prev.svg\" title=\"Previous article (left arrow key)\"\n" +
        "                         style=\"width:30px;height:30px;\">\n" +
        "                </a><h");
     */
    let ppp2 = _parts[2]


    let newppp2 = ""

    let ooo = true

    for (let i = 0; i < ppp2.length; i++) {
        if (i < ppp2.length - 5 && ppp2[i + 0] == '<' && ppp2[i + 1] == '$' && ppp2[i + 2] == '!' && ppp2[i + 3] == '$' && ppp2[i + 4] == '!') {
            indl = ppp2[i + 5]

            if (indl == "e" && __inf == "2") {
                ooo = false
            }

            if (indl == "u" && __un == "2") {
                ooo = false
            }

            if (indl == "s" && __syn == "2") {
                ooo = false
            }

            if (indl == "r" && __rel == "2") {
                ooo = false
            }

            if (indl == "d" && __der == "2") {
                ooo = false
            }
        }

        if (i < ppp2.length - 4 && ppp2[i] == '$' && ppp2[i + 1] == '!' && ppp2[i + 2] == '$' && ppp2[i + 3] == '$') {
            ooo = true
        }

        if (ooo) {
            newppp2 += ppp2[i]
        }
    }


    //_parts[4] = _parts[4].replaceAll("<br />", ", ")
    //_parts[4] = _parts[4].replaceAll("<br />", ", ")


    if (!examplesStage) {
        if (__rt == "0") {
            cont.innerHTML = newppp2;
        }

        /*
        if (__rt == "1") {
            let asd = _parts[3];
            let ssdf = newppp2;
            ssdf += asd;
            cont.innerHTML += ssdf;
        }

        if (__rt == "2") {
            cont.innerHTML += _parts[3];
        }
        */

    } else {
        cont.innerHTML = _parts[_parts.length - 1];
    }

    //content1.innerHTML += _parts[3];

    //_parts[4] =  _parts[4].replaceAll("float:right; ", "")
    _parts[0] = _parts[0].replace("(1)", "")

    pre = ""
    if (form_type != "canonical") {
        if (!form_type.indexOf(" form") == -1) {
            pre = intitial_form + " is " + form_type + " form of <br>"
        } else {
            pre = intitial_form + " is " + form_type + " of <br>"
        }
    }

    console.log(pre + _parts[0])
    prono.innerHTML = pre + _parts[0];
    ety.innerHTML = crop_table(_parts[4]);
}

function crop_table(content) {
    content = content.replace("clear:", "width:70%; clear:")
    if (content.indexOf("Пр. действ.") != -1) {
        let __bef = content.substring(0, content.indexOf("Пр. действ."))
        let ___bef = __bef.substring(0, __bef.lastIndexOf("</tr>"))
        let res = ___bef + "</tbody></table> "
        return res;
    } else {

        return content
    }
}

current_word_handled = null

history2 = []

function read_history(){
    myStorage = window.localStorage;
    text = myStorage.getItem("history")
    history2 = text.split(';')
    console.log("current hisotry ", history2)
    //history2 = []
}

function write_history(){
    text = history2.join(";")
    myStorage = window.localStorage;
    myStorage.setItem("history", text)
}



function hndwrd(wrd) {
    scrollToSave = document.documentElement.scrollTop
    if (wrd[0] != "$") {
        current_word_handled = wrd.substring(wrd.lastIndexOf('=') + 1)
        if (wrd.indexOf("=") == -1) {
            wrd = wrd + "=canonical=" + wrd
        }
    }

    if (wrd.indexOf('=') != 0) {
        tw = wrd.substring(0, wrd.indexOf('='))
        console.log('Word = ', wrd)
        console.log("To write = ", tw)
        history2.push(tw)
        write_history()
    }


    prono = document.getElementById("prono_part");
    ety.innerHTML = document.getElementById("ety_part");
    cont.innerHTML = document.getElementById("content");

    //let old_scroll = document.documentElement.scrollTop;
    //console.log("Old scroll", old_scroll)

    console.log("NP",)

    if (!(wrd == undefined)) {
        if (!nietpushen) {
            history.push(wrd)

            if (history.length > 1) {
                poses.push(scrollToSave)
            }
        }

        if (wrd[0] == "$") {
            type = parseInt(wrd[1])
            www = wrd.substring(2)
            _dosearch(type, www)
        } else {
            prono.innerHTML = "";
            ety.innerHTML = "";
            cont.innerHTML = ""

            if (wrd.indexOf("|") != -1) {
                contt = "<h1>Disambiguation</h1> <br> <ol>"
                eqs = wrd.split("|")
                for (let j = 0; j < eqs.length; j++) {
                    spl = eqs[j].split("=")
                    contt += "<li>" + spl[0] + " is " + spl[1] + " form of <a href=\"#\" onclick=\"hndwrd('" + spl[2] + "=canonical=" + spl[2] + "')\">" + spl[2] + "</a></li>"
                }
                contt += "<ul>"
                cont.innerHTML = contt;
            } else {
                parts = wrd.split("=")
                //langtable(cont, wrd)
                put_info(parts[2], parts[0], parts[1])
            }
        }

        /*
        if(nietpushen){
            poses.pop()
            newScroll = poses[poses.length - 1]
            document.documentElement.scrollTop = newScroll;
            nietpushen = false
        }

         */

        /*
        console.log("Poses before", poses)
        //poses.pop()
        newScroll = poses[poses.length - 2]
        console.log("Poses after", poses)

        console.log("Apply pos", newScroll)

        document.documentElement.scrollTop = newScroll;
        */

        if (!nietpushen) {
            document.documentElement.scrollTop = 0;
        }

        nietpushen = false

        return false;
    }
}