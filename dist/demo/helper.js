function checkDynamicRoomURL() {
  if(window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const dynamicRoomUrl = params.get('roomUrl');

    if(dynamicRoomUrl) {
      ROOM_URL = dynamicRoomUrl;

      loadRoom();
      showScreen('.room-frame');
    }
  }
}

var showLogs = false;
function toggleLogs() {
  const logList = document.querySelector('.log-list');

  if(!logList) {
    return;
  }

  const logsToggle = document.querySelector('.logs-toggle');
  showLogs = !showLogs;

  logsToggle.innerHTML = showLogs ? 'hide logs' : 'show logs';
  logList.style.display = showLogs ? 'block' : 'none'

}

function showScreen(target) {
  const activeScreen = document.querySelector('.screen.show');
  const frameScreen = document.querySelector('.screen'+target);
  activeScreen.className = activeScreen.className.replace(' show', '');
  frameScreen.className += ' show';
}


function updateError(message) {
  const errorElement = document.querySelector('.room-url-error');
  errorElement.innerHTML = message;
  errorElement.style.display = 'block'
}

function onURLChange() {
  const errorElement = document.querySelector('.room-url-error');
  errorElement.style.display = 'none';
}

function initializeLogs() {
  const sidebar = document.querySelector('.sidebar');
  if(!sidebar) {
    return;
  }

  const logsParent = document.createElement('div');
  logsParent.className = 'logs';

  sidebar.appendChild(logsParent);

  const logsToggle = document.createElement('button')
  logsToggle.className = 'logs-toggle';
  logsToggle.type = 'button';
  logsToggle.innerHTML = 'show logs';
  logsToggle.onclick = toggleLogs;

  logsParent.appendChild(logsToggle);

  const logList = document.createElement('div');
  logList.style.display = 'none';
  logList.className = 'log-list sidebar-block';
  logsParent.appendChild(logList);
}


function addJoiningHint(roomURL) {
  const sidebar = document.querySelector('.sidebar');
  if(!sidebar) {
    return;
  }

  const hintParent = document.createElement('div');
  hintParent.className = 'joining-hint sidebar-block';

  sidebar.appendChild(hintParent);

  hintParent.innerHTML = `
    <p class="hint-title">Others can join your room by using this link:</p>
    <p class="hint-link-url">${roomURL}</p>
    <a href="${roomURL}" target="_blank" rel="noopener nofollow">open in new tab</a>
   `
}


function vbStateToInitState(originalConfig){
  if(!originalConfig) return undefined;

  return {
    [originalConfig.type]: originalConfig.value,
    enforce: originalConfig.enforce
  }
}


function initializeParticipantList() {
  //
  const sidebar = document.querySelector('.sidebar');
  if(!sidebar) {
    return;
  }

  const participantsList = document.createElement('div');
  participantsList.className = 'participants sidebar-block';

  sidebar.appendChild(participantsList);
}

function logRoomLoad() {
  try {
    const [team, room] = `${ROOM_URL}`.replace(/\?.+/, '').replace('https://', '').split('.digitalsamba.com/');

    plausible('Room loaded', {props: {team, room}});
  } catch(e) {
    // ignore if something went wrong;
  }
}


const createRoom = async () => {
  const res = await fetch("https://api.digitalsamba.com/api/public/rooms", { method: 'POST' });

  return res.json();
}

function showCustomRoomForm() {
  const form = document.querySelector('.custom-room-url-form');
  const currentForm = document.querySelector('.dynamic-room-block');

  if(currentForm) {
    currentForm.style.display = 'none';
  }
  if(form) {
    form.className += ' show';
  }
}
