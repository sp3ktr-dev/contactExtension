let action, participantsList, readingIndex;

const start = () => {
    action = "start";
    readingIndex = 0;
    sendAction(action);
};

const getContacts = () => {
    action = "getContacts";
    if (readingIndex < participantsList.length) {
        chrome.tabs.query({ currentWindow: true }, function (tab) {
            chrome.tabs.update(tab[0].id, {
                url: participantsList[readingIndex].link,
            });
        });
    } else {
        sendAction("showResult", participantsList);
    }
};

const sendAction = (action, data = false) => {
    chrome.tabs.query({ currentWindow: true }, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, { action, data });
    });
};

//SEND WORK MSG TO TAB
chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.PageStatus === "pageLoaded" && action === "getContacts") {
        sendAction("readContacts");
    }
});

//FINISHED ACTIONS RESPONSES
chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.type == "participantsList") {
        participantsList = request.data;
        getContacts();
    } else if (request.type == "contactsList") {
        participantsList[readingIndex].contacts = request.data;
        readingIndex++;
        getContacts();
    }
});

chrome.browserAction.onClicked.addListener(function () {
    start();
});
