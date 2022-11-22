const countLoaded = () => {
    return document.getElementsByClassName('participant-wrapper').length;
};
const loadMore = (loaded) => {
    window.scrollTo(0, document.body.scrollHeight);
    const waitNewRecord = setInterval(() => {
        const nowLoaded = countLoaded();
        if (nowLoaded > loaded) {
            clearInterval(waitNewRecord);
            console.log(nowLoaded);
            parseList();
        }
    }, 200);
};
const parseParticipant = (index) => {
    const participant = {};
    const target = document.getElementsByClassName('participant-wrapper')[index];
    participant.name = target.getElementsByClassName('participant-name')[0].innerText;
    participant.link = target.getElementsByClassName('participant-name')[0].href;
	participant.type = target.getElementsByClassName('feature-filter-label')[0] ? target.getElementsByClassName('feature-filter-label')[0].innerText : 'unknown';
    participant.job = target.getElementsByClassName('participant-job-title')[0] ? target.getElementsByClassName('participant-job-title')[0].innerText : '';
    participant.company = target.getElementsByClassName('participant-org')[0].getElementsByTagName('a')[0].innerText;
    participant.location = target.getElementsByClassName('participant-country')[0].innerText;
    return participant;
};
const parseList = () => {
    const loadedParticipants = countLoaded();
    const participants = [];
    for (i = readedParticipants; i < loadedParticipants; i++) {
        participants.push(parseParticipant(i));
        readedParticipants = i;
    }
    chrome.runtime.sendMessage({ type: 'participantsList', data: participants });
    if (loadedParticipants < totalExisting) {
        loadMore(loadedParticipants);
    } else {
        chrome.runtime.sendMessage({ type: 'listLoaded' });
        console.log('List loaded');
    }
};
const parseContacts = () => {
	const contacts = [];
	const values = document.getElementsByClassName('value colored');
	for(i=0; i < values.length; i++) {
        if (!contacts.includes(values[i].innerText)) {
            contacts.push(values[i].innerText);
        }
	}
	return contacts;
}

let totalExisting = 0;
let readedParticipants = 0;

window.addEventListener('load', function (e)  {
	chrome.extension.onMessage.addListener(
		function (request, sender){
			if (request.action === 'start') {
                if (document.getElementsByClassName('total-records').length) {
                    totalExisting = parseInt(document.getElementsByClassName('total-records')[0].getElementsByTagName('span')[0].innerText);
                    parseList();
                } else {
                    chrome.runtime.sendMessage({ type: 'doReadContacts' });
                }
			} else if (request.action === 'readContacts') {
				const waitContacts = setInterval(() => {
					if (parseContacts().length !== 0) {
						clearInterval(waitContacts);
						chrome.runtime.sendMessage({ type: 'contactsList', data: parseContacts() });
					}
				}, 500);
			} else if (request.action === 'showResult') {
				console.log(JSON.stringify(request.data));
			}
	}); 
	
	chrome.runtime.sendMessage({ type: "pageLoaded" });

}, false);