let searchvocab = []

function readTextFile5(file)
{
    searchvocab = []
    res = ""
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                let lines = allText.split(/\r?\n/);

                for (let i = 0; i < lines.length; i++) {
                    line = lines[i]
                    if(line.length > 0){
                        searchvocab.push(line)
                    }
                }
            }
        }
    }
    rawFile.send(null);
    return res
}

