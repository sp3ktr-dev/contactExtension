let action, readingId;

const start = () => {
    action = 'start';
    sendAction(action);
};

const getContacts = (participant) => {
    action = 'getContacts';
    readingId = participant.id;
    chrome.tabs.query({ currentWindow: true }, function (tab) {
        chrome.tabs.update(tab[0].id, {
            url: participant.link,
        });
    });
};

const loadParticipant = () => {
    fetch('http://127.0.0.1:5000/getparticipant').then((response) => response.json()).then((participant) => {
        getContacts(participant);
    });
};

const saveParticipants = (json) => {
    fetch('http://127.0.0.1:5000/createparticipants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
    });
};

const saveContacts = (json) => {
    fetch(`http://127.0.0.1:5000/updatecontacts/${readingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
    }).then(() => {
        loadParticipant();
    });
};

const sendAction = (action, data = false) => {
    chrome.tabs.query({ currentWindow: true }, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, { action, data });
    });
};

//FINISHED ACTIONS RESPONSES
chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.type == 'participantsList') {
        saveParticipants(request.data);
    } else if (request.type == 'contactsList') {
        saveContacts(request.data);
    } else if (request.type == 'listLoaded') {
        loadParticipant();
    } else if (request.type == 'doReadContacts') {
        loadParticipant();
    } else if (request.type == 'pageLoaded' && action === 'getContacts') {
        sendAction('readContacts');
    }
});

chrome.browserAction.onClicked.addListener(function () {
    start();
});