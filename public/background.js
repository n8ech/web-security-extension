let currentTabUrl = null;

function updateActiveTabUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0] && tabs[0].url) {
      currentTabUrl = tabs[0].url;
      handleMagicAuthPath(currentTabUrl);
    }
  });
}

chrome.tabs.onActivated.addListener(updateActiveTabUrl);
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    currentTabUrl = changeInfo.url;
    handleMagicAuthPath(currentTabUrl);
  }
});
chrome.windows.onFocusChanged.addListener(updateActiveTabUrl);

// Initialisation
updateActiveTabUrl();

// Fonction utilitaire pour extraire le NDD et le chemin
function extractDomainAndPath(url) {
  try {
    const u = new URL(url);
    return {
      domain: u.hostname,
      path: u.pathname + u.search + u.hash
    };
  } catch (e) {
    return { domain: null, path: null };
  }
}

function handleMagicAuthPath(url) {
  const { domain, path } = extractDomainAndPath(url);
  if (domain === 'adapting-sloth-tightly.ngrok-free.app' && path.startsWith('/auth/magic/')) {
    // On récupère la chaîne après '/auth/magic/'
    const value = path.substring('/auth/magic/'.length);
    // On stocke dans chrome.storage.local
    chrome.storage.local.set({ 'set-password': value }, () => {
      console.log('[background] set-password enregistré dans chrome.storage.local:', value);
    });
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === 'GET_ACTIVE_TAB_URL') {
    sendResponse({ url: currentTabUrl });
    return true;
  }
  if (message && message.type === 'GET_ACTIVE_TAB_DOMAIN') {
    const { domain } = extractDomainAndPath(currentTabUrl);
    sendResponse({ domain });
    return true;
  }
  if (message && message.type === 'GET_ACTIVE_TAB_PATH') {
    const { path } = extractDomainAndPath(currentTabUrl);
    sendResponse({ path });
    return true;
  }
  // Indique que la réponse est synchrone
  return true;
}); 