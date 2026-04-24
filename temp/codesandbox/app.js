  let ROOM_URL = "https://localhost:3000/Public";

  var sambaEmbedded;

  // defaults for pre-configured state;
  var initialSettings = {
    muteFrame: false,
    username: "",
    audioEnabled: true,
    videoEnabled: true,
    showToolbar: false,
    showTopbar: false,
    showCaptions: false,
    layoutMode: "auto",
    // virtualBackground: {
    //   image: "woman",
    //   enforce: false,
    //   // thumbnailUrl: "https://res.cloudinary.com/dvgipbnfm/image/upload/v1741950102/cld-sample.jpg"
    // },
    appLanguage: undefined,
    requireRemoveUserConfirmation: true,
    mediaDevices: {},
    // replaceVirtualBackgrounds: true,
    virtualBackgrounds: [
      {
        id: "woman",
        type: "image",
        value: "https://res.cloudinary.com/dvgipbnfm/image/upload/v1741950102/cld-sample.jpg",
        thumbnail: "https://res.cloudinary.com/dvgipbnfm/image/upload/v1741950102/cld-sample.jpg",
        label: "Woman with a dog"
      },
      {
        id: "mountains",
        type: "image",
        value: "https://res.cloudinary.com/dvgipbnfm/image/upload/v1741950102/cld-sample-2.jpg",
        thumbnail: "https://res.cloudinary.com/dvgipbnfm/image/upload/v1741950102/cld-sample-2.jpg",
        label: "Mountains"
      },
      {
        id: "video-motion",
        type: "video",
        value: "https://res.cloudinary.com/dvgipbnfm/video/upload/v1742312045/Motion_Graphic_1280x720_jbvjxl.mp4",
        thumbnail: "https://res.cloudinary.com/dvgipbnfm/image/upload/v1746190151/motion_video_thumbnail_wlnsn8.jpg",
        label: "Video motion "
      },
      {
        id: 'balanced-blur',
        type: 'blur',
        value: 'balanced',
        label: 'Light Blur',
      },
    ]
  };

  var VBstate = {
    type: "blur",
    value: "balanced",
    enforce: false
  };

  var VBvalues = {
    blur: "balanced",
    image: "office",
    imageUrl: "string",
    video: "vbg1",
    videoUrl: "string"
  };

  const fillDeviceOptions = (availableDevices) => {
    availableDevices.forEach(device => {
      const select = document.querySelector("#" + device.kind);
      if (select) {
        const deviceLabel = device.label || `Device (${device.deviceId || device.kind})`;
        select.innerHTML += `<option value="${deviceLabel}">${deviceLabel}</option>`;
      }
    });
  };

  try {
    navigator.mediaDevices.getUserMedia({audio: true, video: true}).then((stream) => {
      navigator.mediaDevices.enumerateDevices().then((availableDevices) => {
        fillDeviceOptions(availableDevices);
      });

      stream.getTracks()?.forEach(track => track.stop());
    });
  } catch (e) {
    console.error("could not request user devices, error", e);

    navigator.mediaDevices.enumerateDevices().then((availableDevices) => {
      fillDeviceOptions(availableDevices);
    });
  }

  // if room is predefined in search params, skip room URL field;
  checkDynamicRoomURL();

  async function loadDynamicRoom() {
    const roomUrlResponse = await createRoom();
    ROOM_URL = roomUrlResponse.room_url;

    initialSettings.virtualBackground = vbStateToInitState(initialSettings.virtualBackground);

    loadRoom();
  }

  function loadCustomRoom() {
    const input = document.querySelector("#custom-room-url");

    if (input.value) {
      ROOM_URL = input.value;

      initialSettings.virtualBackground = vbStateToInitState(initialSettings.virtualBackground);

      loadRoom();
    } else {
      updateError("Please enter room URL");
    }
  }

  async function loadRoom() {
    try {
      const parent = document.querySelector(".frame-parent");
      parent.innerHTML = null;

      // create pre-configured controller instance using given URL;
      // if no frame specified, this pre-creates a frame but doesn't load it yet;
      // other init strategies are available, along with more detailed customization
      // see https://docs.digitalsamba.com/reference/sdk/digitalsambaembedded-class
      sambaEmbedded = DigitalSambaEmbedded.createControl(
        {
          url: ROOM_URL, root: parent,
          // apply predefined room settings
          roomSettings: initialSettings
        },
        {reportErrors: true}
      );

      // controller instance exposes the frame, so we can customize it a little bit
      sambaEmbedded.frame.width = 1000;
      sambaEmbedded.frame.height = 700;
      sambaEmbedded.frame.style.border = "5px solid #f06859";
      sambaEmbedded.frame.style.borderRadius = "8px";

      // load samba frame
      sambaEmbedded.load();
      logRoomLoad();

      addJoiningHint(ROOM_URL);
      initializeLogs();

      // after loading, controller will start emitting events
      // event listeners can be set up prior to loading;
      setupCustomEventListeners();

      showScreen(".room-frame");
    } catch (e) {
      updateError(e.message);
    }
  }

  function setupCustomEventListeners() {
    // catch all events. Useful for logging or debugging;
    sambaEmbedded.on("*", (data) => {
      const logList = document.querySelector(".log-list");

      console.log('SDK Event:', data)

      if (logList) {
        logList.innerHTML += `<div>
            <p>[${(new Date).toLocaleTimeString()}] event: <b>${data?.type}</b></p>
            ${data.data ? `<p>payload: ${JSON.stringify(data.data)}</p>` : ""}
          </div>`;

        logList.scrollTop = logList.scrollHeight;
      }
    });

    // `roomJoined` is fired when local user has joined the room
    // this listener is used to display media device controls after joining
    sambaEmbedded.on("roomJoined", () => {
      const controls = document.querySelector(".frame-controls");

      controls.style.display = "flex";
    });
  }

  function toggleVirtualBackground(shouldEnable) {
    const vbOptions = document.querySelector(".vb-options");

    if (shouldEnable) {
      initialSettings.virtualBackground = VBstate;
      vbOptions.style.display = "block";
    } else {
      initialSettings.virtualBackground = undefined;
      vbOptions.style.display = "none";
    }
  }

  function updateVBType(newType) {
    VBstate.type = newType;
    const currentOption = document.querySelector(".vb-value.show");
    const newOption = document.querySelector(".vb-value-" + newType);
    currentOption.className = currentOption.className.replace(" show", "");
    newOption.className += " show";

    VBstate.value = VBvalues[newType];
  }
