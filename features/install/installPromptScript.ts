/**
 * Inline script that runs before React loads. Browsers fire `beforeinstallprompt` very early,
 * often before hydration, so it is captured here and read later by `usePwaInstall`.
 */
export const INSTALL_PROMPT_EVENT = 'gcs-install-ready'
export const INSTALL_PROMPT_KEY = '__gcsInstallPrompt'

export const installPromptScript = `
window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  window.${INSTALL_PROMPT_KEY} = e;
  window.dispatchEvent(new Event('${INSTALL_PROMPT_EVENT}'));
});
window.addEventListener('appinstalled', function () {
  window.${INSTALL_PROMPT_KEY} = null;
  window.dispatchEvent(new Event('${INSTALL_PROMPT_EVENT}'));
});
`
