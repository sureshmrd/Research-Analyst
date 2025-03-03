document.addEventListener('DOMContentLoaded',() => {
    chrome.storage.local.get(['researchNotes'],function(result){
        if(result.researchNotes) {
            document.getElementById('notes').value = result.researchNotes;
        }
    });

    document.getElementById('summarizeBtn').addEventListener('click',summarizeText);

    document.getElementById('saveNotesBtn').addEventListener('click',saveNotes);

    document.getElementById('suggestBtn').addEventListener('click',suggestContent);

    document.getElementById('generateQues').addEventListener('click',generateQuestions);
});

function formatText(inputText) {
    // Remove double asterisks
    let cleanedText = inputText.replace(/\*\*/g, "");

    // Convert single asterisks followed by a space into bullet points
    cleanedText = cleanedText.replace(/\* (.+)/g, "<li>$1</li>");

    // Wrap in <ul> for better display
    return "<ul>" + cleanedText + "</ul>";
}

async function generateQuestions() {
    try{

        const [tab] = await chrome.tabs.query({active:true,currentWindow: true})
        const [{result}] = await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: () => window.getSelection().toString()
        });
        if(!result){
            showResult('Please Select Some Text first');
            return;
        }

        const response = await fetch('http://localhost:8080/api/research/process',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({content:result,operation:'generateQuestions'})
        });

        if(!response.ok){
            throw new Error(`API Error: ${response.status}`)
        }

        let text = await response.text();
        text = formatText(text);
        showResult(text);
    }catch(error){
        showResult('Error: ' + error.message);
    }
}

async function suggestContent() {
    try{

        const [tab] = await chrome.tabs.query({active:true,currentWindow: true})
        const [{result}] = await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: () => window.getSelection().toString()
        });
        if(!result){
            showResult('Please Select Some Text first');
            return;
        }

        const response = await fetch('http://localhost:8080/api/research/process',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({content:result,operation:'suggest'})
        });

        if(!response.ok){
            throw new Error(`API Error: ${response.status}`)
        }

        let text = await response.text();
        text = formatText(text);
        showResult(text);
    }catch(error){
        showResult('Error: ' + error.message);
    }
}

async function summarizeText() {
    try{
        const [tab] = await chrome.tabs.query({active:true,currentWindow: true})
        const [{result}] = await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: () => window.getSelection().toString()
        });


        if(!result){
            showResult('Please Select some text first');
            return;
        }

        const response = await fetch('http://localhost:8080/api/research/process',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({content:result,operation:'summarize'})
        });

        if(!response.ok){
            throw new Error(`API Error: ${response.status}`)
        }

        const text = await response.text();
        showResult(text.replace(/\n/g,'<br>'));
    }catch(error){
        showResult('Error: ' + error.message);
    }
}

async function saveNotes(){
    const notes  = document.getElementById('notes').value;
    chrome.storage.local.set({'researchNotes':notes},function(){
        alert('Notes saved Successfully');
    });
}


function showResult(content){
    document.getElementById('results').innerHTML =`<div class="result-item"><div class="result-content">${content}</div></div>`;
}