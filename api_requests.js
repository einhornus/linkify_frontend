
let ___debug = true

let articles_hash = {}
let reverso_hash = {}

let search_hash = {}
let handle_text_hash = {}
let handle_text_align_hash = {}
let translations_hash = {}
let mainPort = 8085

function ___api_get_root(port){
    if(___debug){
        return "http://localhost:"+port+"/api/"
    }
    else {
        return "http://174.138.15.163:"+port+"/api/"
        //return "http://link-ify:"+port+"/api/"
    }
}

function ___api_get_article_(word, login = null, password = null, exception="")
{
    ns = ""
    for(let i = 0; i<exception.length; i++){
        if(exception[i] >= 'a' && exception[i] <= 'z'){
            ns += exception[i]
        }

        if(exception[i] >= 'A' && exception[i] <= 'Z'){
            ns += exception[i]
        }
    }

    if(ns.length > 80){
        ns = ""
    }

    if(articles_hash[word] != undefined){
        console.log("From hash ", word)
        return articles_hash[word]
    }

    repl = word.replaceAll(" ", "989")

    nll = std_langs[native_lang]

    article_mode = "0"
    cook = getCookie_("articles")
    console.log("Article mode = ", cook)
    if(cook != ""){
        article_mode = cook
    }

    res = ""
    var rawFile = new XMLHttpRequest();
    if(login == null) {
        rawFile.open("GET", ___api_get_root(mainPort) + "article?lang=" + std_langs[main_lang] + "&word=" + repl+"&drop=1"+"&nat="+nll+"&am="+article_mode+"&exception="+ns, false);
    }
    else{
        rawFile.open("GET", ___api_get_root(mainPort) + "article?lang=" + std_langs[main_lang] + "&word=" + repl+"&login="+login+"&password="+password+"&am="+article_mode+"&drop=1"+"&nat="+nll+"&exception="+ns, false);
    }
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                res = allText
                articles_hash[word] = allText
                console.log("Hashed article", word)
                return res
            }
        }
    }
    rawFile.send(null);
    return res
}




function ___api_get_reverso(word, login = null, password = null)
{

    if(reverso_hash[word] != undefined){
        console.log("From hash ", word)
        return reverso_hash[word]
    }

    repl = word.replaceAll(" ", "989")

    res = ""
    var rawFile = new XMLHttpRequest();

    nll = std_langs[native_lang]
    if(nll == "en" && std_langs[main_lang] == "en"){
        nll = "de";
    }

    if(login == null) {
        rawFile.open("GET", ___api_get_root(mainPort) + "reverso?lang=" + std_langs[main_lang] + "&word=" + repl+"&nat="+nll, false);
    }
    else{
        rawFile.open("GET", ___api_get_root(mainPort) + "reverso?lang=" + std_langs[main_lang] + "&word=" + repl+"&nat="+nll, false);
    }
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                res = allText
                reverso_hash[word] = allText
                console.log("Hashed reverso", word)
                return res
            }
        }
    }
    rawFile.send(null);
    return res
}





function ___api_send_audio2(blob, hash, callback, login = null, password = null){
    var rawFile = new XMLHttpRequest();

    nt = "en"
    if (std_langs[main_lang] == "en"){
        nt = "ru"
    }

    if(login == null) {
        rawFile.open("POST", ___api_get_root(mainPort) + "send_audio?lang=" + std_langs[main_lang] + "&hash=" + hash + "&nat="+nt, true);
    }
    else{
        rawFile.open("POST", ___api_get_root(mainPort) + "send_audio?lang=" + std_langs[main_lang] + "&hash=" + hash + "&nat="+nt+"&login="+login+"&password="+password, true);
    }
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var res = rawFile.responseText;
                callback(res)
            }
        }
    }
    rawFile.send(blob);
}



function ___api_randomize_audio(level, callback){

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", ___api_get_root(mainPort)+"randsnd?lang="+std_langs[main_lang]+"&level="+level+"&nat="+std_langs[native_lang], true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var res = rawFile.responseText;
                callback(res)
            }
        }
    }
    rawFile.send(null);
}



function ___api__stuff( callback){

    var rawFile = new XMLHttpRequest();
    rawFile.open("POST", ___api_get_root(5000), true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var res = rawFile.responseText;
                callback(res)
            }
        }
    }
    rawFile.send(JSON.stringify({
        q: "Hello!",
        source: "en",
        target: "es"
    }));
}



function ___api_send_audio(base64, callback){
    var rawFile = new XMLHttpRequest();
    rawFile.open("POST", ___api_get_root(mainPort)+"send_audio?lang="+std_langs[main_lang], true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var res = rawFile.responseText;
                callback(res)
            }
        }
    }
    rawFile.send(base64);
}



function ___api_search_(word, type)
{
    if(search_hash[word+type] != undefined){
        console.log("From hash ", word)
        return search_hash[word+type]
    }

    word = word.trim()
    word = word.toLowerCase()
    word = word.replaceAll(" ", "989")

    res = ""
    var rawFile = new XMLHttpRequest();
    if(main_lang != 0) {
        rawFile.open("GET", ___api_get_root(mainPort) + "search?lang=" + std_langs[main_lang] + "&word=" + word + "&native=" + std_langs[native_lang] + "&type=" + type, false);
    }
    else{
        rawFile.open("GET", ___api_get_root(mainPort) + "search?lang=" + std_langs[main_lang] + "&word=" + word + "&type=" + type+"&source="+std_langs[native_lang], false);

    }
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                res = allText
                search_hash[word+type] = allText
                console.log("Hashed ", word)
                return res
            }
        }
    }
    rawFile.send(null);
    return res
}



function ___api_handle_text(text, callback, login = null, password = null, reverse=false)
{
    if(handle_text_hash[text] != undefined){
        callback(handle_text_hash[text])
        return handle_text_hash[text]
    }

    lng = std_langs[main_lang]
    if(reverse){
        lng = "en";// std_langs[native_lang]
    }

    res = ""
    var rawFile = new XMLHttpRequest();
    if(login != null) {
        rawFile.open("POST", ___api_get_root(mainPort) + "linkify?align=0&lang=" + lng+"&login="+login+"&password="+password, true);
    }
    else{
        rawFile.open("POST", ___api_get_root(mainPort) + "linkify?align=0&lang=" + lng, true);
    }
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                res = allText
                handle_text_hash[text] = allText
                callback(res)
            }
        }
    }
    rawFile.send(text);
    return text
}



function ___api_handle_text(text, callback, login = null, password = null, reverse=false)
{
    if(handle_text_hash[text] != undefined){
        callback(handle_text_hash[text])
        return handle_text_hash[text]
    }

    lng = std_langs[main_lang]
    if(reverse){
        lng = "en";// std_langs[native_lang]
    }

    res = ""
    var rawFile = new XMLHttpRequest();
    if(login != null) {
        rawFile.open("POST", ___api_get_root(mainPort) + "linkify?align=0&lang=" + lng+"&login="+login+"&password="+password, true);
    }
    else{
        rawFile.open("POST", ___api_get_root(mainPort) + "linkify?align=0&lang=" + lng, true);
    }
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                res = allText
                handle_text_hash[text] = allText
                callback(res)
            }
        }
    }
    rawFile.send(text);
    return text
}



function ___api_speaking_phrase(difficulty, history, callback)
{
    res = ""
    var rawFile = new XMLHttpRequest();

    nat = "en"
    if (std_langs[main_lang] == "en" || true){
        nat = std_langs[native_lang]
    }
    console.log("My nat", nat)

    rawFile.open("POST", ___api_get_root(mainPort)+"speaking/phrase?lang="+std_langs[main_lang]+"&nat="+nat+"&difficulty="+difficulty, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                callback(allText)
            }
        }
    }
    rawFile.send(history);
}



function ___api_translate(text, lang, callback, login = null, password = null)
{
    if(translations_hash[text] != undefined){
        callback(translations_hash[text])
        return translations_hash[text]
    }

    res = ""
    var rawFile = new XMLHttpRequest();

    if(login != null) {
        rawFile.open("POST", ___api_get_root(mainPort) + "trans?lang=" + std_langs[main_lang] + "&login=" + login + "&password=" + password+"&nat="+std_langs[native_lang], true);
    }
    else{
        rawFile.open("POST", ___api_get_root(mainPort) + "trans?lang=" + std_langs[main_lang]+"&nat="+std_langs[native_lang], true);
    }


    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                res = allText
                translations_hash[text] = allText
                callback(res)
            }
        }
    }
    rawFile.send(text);
    return text
}



function ___api_get_listen(level, callback)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", ___api_get_root(mainPort)+"sound/lis?level="+level+"&lang="+std_langs[main_lang], true);


    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                console.log("Listened", allText)
                callback(allText)
            }
        }
    }

    rawFile.send(null);
    return;
}


function ___api_register(login, password, key, callback)
{
    //login = login.replace(' ', '5')
    //password = password.replace(' ', '5')

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", ___api_get_root(mainPort)+"register?login="+login+"&password="+password+"&key="+key, true);

    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                callback(allText)
            }
        }
    }

    rawFile.send(null);
    return;
}



function ___api_authorize(login, password, callback)
{
    login = login.replace(' ', '5')
    password = password.replace(' ', '5')


    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", ___api_get_root(mainPort)+"authorize?login="+login+"&password="+password, true);

    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                callback(allText)
            }
        }
    }

    rawFile.send(null);
    return;
}


function ___api_encrypt(text, callback)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", ___api_get_root(mainPort)+"encrypt?text="+text, true);

    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                callback(allText)
                return allText
            }
        }
    }

    rawFile.send(null);
    return;
}


function ___api_decrypt(text, callback)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", ___api_get_root(mainPort)+"decrypt?text="+text, true);

    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                callback(allText)
                return allText
            }
        }
    }

    rawFile.send(null);
    return;
}


function ___api_get_vocabtest(fr)
{
    allText = ""
    var rawFile = new XMLHttpRequest();

    link = ___api_get_root(mainPort)+"vocabtest?lang="+std_langs[main_lang]+"&native="+std_langs[native_lang]+"&freq="+fr
    rawFile.open("GET", link, false);

    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                return allText
            }
        }
    }

    rawFile.send(null);
    return allText;
}
