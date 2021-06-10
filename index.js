// CONFIGS

const AUTHORIZATION_ENDPOINT = "/oauth/authorize";
const REVOKE_ENDPOINT = "/oauth/revoke";
const SERVICE_DASHOARD_ENDPOINT = "/oauth/status";
const TOKEN_STR_ENDPOINT = "/oauth/tokenstring";
const API_AUT_SERVICE_PATH = "/oauthy";
const DEFAULT_BASE_URI = "http://localhost:8080";
const TIMEOUT_SEC = 15;

const refreshBtn = document.querySelector("#btnRefreshDashboard");
const btnTestConnectionEl = document.querySelector("#btnTestConnection");
const connectionInfoTableEl = document.querySelector("#connection-table");
const btnSwitchLocalDevEnv = document.querySelector(".input-local-env");

const inputPortEl = document.querySelector("#inp-port");
const portDividerEl = document.querySelector("#inp-port-divider");
const inputHostnameEl = document.querySelector("#inp-hostname");
const inputProtoclEl = document.querySelector("#inp-protocol");

// HELPERS
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const AJAX = async function (url, uploadData = undefined) {
  try {
    console.log(`URL is ${url}`);
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    console.log(res);
    const data = await res.json();
    console.log(`data is`, data);

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

// MODEL
class Model {
  constructor() {
    this._state = {
      isConnected: undefined,
    };
  }

  set isConnected(isConnected) {
    this._state.isConnected = isConnected;
  }

  get isConnected() {
    return this._state.isConnected;
  }
}

const model = new Model();
// VIEWS

// CONTROLLERS

const renderDashboard = function (data) {
  const tblHeaderHtml = `<tr>
      <th></th><th></th><th></th><th></th><th></th><th><small>ENTITY</small></th><th><small>EXPIRY</small></th><th></th>
    </tr>`;
  const dashboardEl = document.querySelector("#connection-table");
  dashboardEl.innerHTML = "";
  const tblRowsHtml = data.map((con) => renderConnectionRow(con)).join("");
  dashboardEl.innerHTML = tblHeaderHtml + tblRowsHtml;
};

const hideDashboardError = function () {
  const dashboardEl = document.querySelector(".connection-error-area");
  dashboardEl.classList.add("visually-hidden");
};
const showDashboardError = function () {
  const dashboardEl = document.querySelector(".connection-error-area");
  dashboardEl.classList.remove("visually-hidden");
};

const utilParseTimestamp = function (timestamp) {
  var d = timestamp / 1000; // delta
  var r = {}; // result
  var s = {
    // structure
    year: 31536000,
    month: 2592000,
    week: 604800, // uncomment row to ignore
    day: 86400, // feel free to add your own row
    hour: 3600,
    minute: 60,
    second: 1,
  };

  Object.keys(s).forEach(function (key) {
    r[key] = Math.floor(d / s[key]);
    d -= r[key] * s[key];
  });

  return r;
};

const formatCoundownDate = function (expiryTimestamp) {
  const curDate = Date.now();

  const { day, month, hour, minute, second } = utilParseTimestamp(
    expiryTimestamp - curDate
  );
  return `${month > 0 ? month + " months," : ""} ${
    day > 0 ? day + " day," : ""
  }  ${hour > 0 ? hour + " hrs," : ""}  ${minute > 0 ? minute + " mins" : ""}`;
};

const renderConnectionRow = function (data) {
  const expiryTimeMs = data.expires * 1000;
  const expiryTimeSec = data.expires;

  const expiresIn = expiryTimeMs === 0 ? 0 : Date.now() - expiryTimeMs;
  console.log(expiresIn);

  let formattedDateHtml = "";
  let formattedCountdownHtml = "";

  if (expiryTimeSec > 0) {
    formattedDateOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };

    const formattedDate = Intl.DateTimeFormat(
      navigator.language,
      formattedDateOptions
    ).format(new Date(expiryTimeMs));

    formattedCountdownHtml = formatCoundownDate(new Date(expiryTimeMs));

    formattedDateHtml = `<small>${formattedDate}</small>`;
  }

  if (expiresIn > 0) {
    formattedDateHtml = `<code class="bg-text-danger">EXPIRED</code>`;
    formattedCountdownHtml = "-";
  }

  if (expiresIn === 0) {
    formattedCountdownHtml = "-";
    formattedDateHtml = `<pre class="bg-text-secondary">INACTIVE</pre>`;
  }

  if (expiresIn === 0 && data.status === "active") {
    formattedCountdownHtml = "-";
    formattedDateHtml = `<pre class="bg-text-secondary">NON-EXPIRING</pre>`;
  }

  const cssStatus =
    data.status === "inactive"
      ? "danger"
      : data.status === "pending"
      ? "warning"
      : data.status === "active"
      ? "success"
      : "muted";

  const btnText =
    data.status === "inactive"
      ? "authorize"
      : data.status === "pending"
      ? "re-authorize"
      : data.status === "active"
      ? "revoke"
      : "";

  return `
  <tr data-platform="${data.name}" class="text-${
    data.status === "active" ? "light" : "muted"
  } container">
    <td class="col-1">
      <div class="icon icon-logo icon-logo-${data.name}${
    data.status === "active" ? "-active" : ""
  } " >
          
      </div>   
    </td>
    
    <td class="col-1">
    <div class="bg-text-${cssStatus} bg-outline-${cssStatus} icon icon-status-${
    data.status
  }" >        
    </div>
    </td>
    
    <td data-action="${
      data.status !== "active" ? "authorize" : "revoke"
    }" class="col-1" ><code class="btn-code-msg-danger d-flex flex-wrap"><button class="btn" data-bs-toggle="tooltip" data-bs-placement="left" title="${
    data.status !== "active" ? "Authorize" : "Revoke"
  }"><div class="icon ${
    data.status !== "active"
      ? "icon-authorize-inactive"
      : "icon-revoke-inactive"
  }"></code></div></button></td>
  <td class="col-1"  data-action="copy-token"><button class="btn btn-copy-token" data-bs-toggle="tooltip" data-bs-placement="left" title="Copy access token"><div class="icon icon-file-lock-inactive"></div></button></td>
    <td class="col-1" data-action="refresh-entity"><button class="btn btn-connected-entity" data-bs-toggle="tooltip" data-bs-placement="left" title="Refresh entity details"><div class="icon icon-connected-entity-inactive"></div></button></td>
    <td class="col-3">${data.connectedEntity}</td>
    <td class="col">${formattedDateHtml}</td>
    <td class="col">${formattedCountdownHtml}</td>

  </tr>`;
};

const connectionAuthorize = function (platform) {
  const url = `${buildBaseUri()}/${platform}${AUTHORIZATION_ENDPOINT}`;
  window.open(url);
};

connectionInfoTableEl.addEventListener("click", async function (e) {
  try {
    const clickedCell = e.target.closest("td");
    const platform = clickedCell.closest("tr").dataset.platform;
    if (clickedCell.dataset.action === "copy-token") {
      const tokenStr = await getAccessTokenStr(platform);
      navigator.clipboard.writeText(tokenStr);
      renderAlert("Copied to clipboard", "success");
      return;
    }
    if (clickedCell.dataset.action === "authorize") {
      connectionAuthorize(platform);
      return;
    }
    if (clickedCell.dataset.action === "revoke") {
      renderAlert("Revoking access token", "warning");
      revokeToken(platform);

      return;
    }
  } catch (err) {
    renderAlert(err, "warning");
  }
});

const getPort = function () {
  const port = document.querySelector("#inp-port").value;
  return ":" + port;
};

const getHostname = function () {
  const hostname = document.querySelector("#inp-hostname").value;
  return hostname;
};

const getProtocol = function () {
  const isCloudHosted = btnSwitchLocalDevEnv.checked;
  const protocol = isCloudHosted ? "https://api." : "http://";
  return protocol;
};

const buildBaseUri = function () {
  const protocol = getProtocol();
  const host = getHostname();
  const port = getPort();

  const url = `${protocol}${host}${port}${API_AUT_SERVICE_PATH}`;
  return url;
};

const refreshDashboardData = async function () {
  try {
    const baseUrl = buildBaseUri();

    const url = `${baseUrl}${SERVICE_DASHOARD_ENDPOINT}`;
    const dashboardData = await AJAX(url, undefined);

    renderDashboard(dashboardData);
    hideDashboardError();

    // if (model.isConnected !== true) hideDashboardError();
  } catch (err) {
    console.error(err);
    if (model.isConnected) {
      // showDashboardError();

      renderAlert("Failed to retrieve dashboard data!", "danger");
    }
  }
};

const getAccessTokenStr = async function (systemName) {
  try {
    const url = `${buildBaseUri()}/${systemName}${TOKEN_STR_ENDPOINT}`;
    const tokenStr = await AJAX(url, undefined);
    console.log(tokenStr);
    return tokenStr;
  } catch (err) {
    renderAlert(err, "warning");
    console.error(err);
  }
};

const revokeToken = async function (systemName) {
  try {
    const url = `${buildBaseUri()}/${systemName}${REVOKE_ENDPOINT}`;
    const res = await AJAX(url);
    console.log(res);
    renderAlert(res, "info");
  } catch (err) {
    renderAlert(err, "warning");
    console.error(err);
  }
};

const renderConnectionStatus = function (status = undefined) {
  const connectionStatusEl = document.querySelector("#connectionStatusIcon");
  connectionStatusEl.innerHTML = "";
  const connStatusWords = document.querySelector(".connection-status-words");
  connStatusWords.innerHTML = "";
  // Not connected
  if (!status || !status === "connected") {
    console.log("rendering disconnected");
    connectionStatusEl.innerHTML = `
    <div class="icon icon-disconnected-active">
    
    </div>`;
    connStatusWords.classList.toggle("code-success");
    connStatusWords.textContent = "DISCONNECTED";
  }

  if (status) {
    console.log("rendering disconnected");
    connectionStatusEl.innerHTML = `
    <div class="icon icon-connected-active">
    
    </div>`;
    connStatusWords.textContent = "CONNECTED";
    connStatusWords.classList.toggle("code-success");
    // if (connectionStatusEl.classList.contains("btn-danger"))
    //   connectionStatusEl.classList.remove("btn-danger");
    // connectionStatusEl.classList.add("btn-success");
  }
};

const renderAlert = function (msg, type) {
  const html = `<div class="alert alert-${type} d-flex align-items-center alert-dismissible fade show" role="alert">
    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="${type}:"><use xlink:href="#${type}-icon"/></svg>
    <div>
     <small>${msg}</small>
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`;

  const alertSection = document.querySelector(".server-alert-section");
  alertSection.innerHTML = "";
  alertSection.insertAdjacentHTML("afterbegin", html);
};

const testConnection = async function () {
  try {
    const url = `${buildBaseUri()}/ping`;

    const connectionStatus = await AJAX(url);
    return !connectionStatus ? undefined : true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// refreshBtn.addEventListener("click", async function (e) {
//   e.preventDefault();
//   refreshDashboardData();
// });
const controlConnectionTest = async function () {
  try {
    const connected = await testConnection();
    model.isConnected = connected;
    renderConnectionStatus(model.isConnected);
    renderAlert("Connection established!", "success");
    refreshDashboardData();
  } catch (err) {
    renderAlert("Test connection could not be established!", "danger");
    if (model.isConnected) {
      renderAlert("Connection could not be established!", "danger");
      renderConnectionStatus();
      refreshDashboardData();
    }
  }
};

btnSwitchLocalDevEnv.addEventListener("click", function (e) {
  const isCloudHosted = btnSwitchLocalDevEnv.checked;
  if (isCloudHosted) {
    // Switch protocol to HTTPS
    inputProtoclEl.textContent = "https://api.";
    inputHostnameEl.value = "";
    inputHostnameEl.classList.toggle("text-light");
    inputHostnameEl.toggleAttribute("disabled");

    inputHostnameEl.classList.toggle("selected");
    inputHostnameEl.classList.toggle("text-muted");

    inputPortEl.value = ".linx.twenty57.net";
    // inputPortEl.classList.toggle("text-muted");
    inputPortEl.classList.toggle("selected");
    inputPortEl.toggleAttribute("disabled");

    portDividerEl.textContent = "";
    portDividerEl.classList.toggle("d-none");

    // inputPortEl.setAttribute("disabled", "true");
  }

  if (!isCloudHosted) {
    // Switch protocol to HTTPS
    inputProtoclEl.textContent = "http://";

    inputHostnameEl.value = "localhost";
    inputHostnameEl.classList.toggle("text-light");
    inputHostnameEl.toggleAttribute("disabled");
    inputHostnameEl.classList.toggle("selected");
    inputHostnameEl.classList.toggle("text-muted");

    portDividerEl.textContent = ":";
    portDividerEl.classList.toggle("d-none");

    inputPortEl.value = "8080";
    inputPortEl.toggleAttribute("disabled");
    inputPortEl.classList.toggle("selected");
  }
});

btnTestConnectionEl.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("test clicked");
  controlConnectionTest();
});

// Event handlers

// Monitor server connection
const monitorServerConnection = async function () {
  try {
    const connected = await testConnection();
    refreshDashboardData();
    if (connected && !model.isConnected) {
      model.isConnected = true;
      renderAlert("Connection established!", "success");
      renderConnectionStatus("connected");
      hideDashboardError();
    }
  } catch (err) {
    if (model.isConnected) {
      model.isConnected = undefined;
      renderAlert("Connection cound not be established!", "danger");
      renderConnectionStatus(undefined);
      refreshDashboardData();
      showDashboardError();
    }
  }
};

const init = async function () {
  try {
    const connected = await testConnection();
    model.isConnected = connected;
    renderConnectionStatus(connected);
    refreshDashboardData();
  } catch (err) {
    console.error(err);
    renderConnectionStatus();
    renderAlert("Connection could not be established!", "danger");
  }
};

init();

// setInterval(monitorServerConnection, 10000);
// setInterval(refreshDashboardData, 60000);
