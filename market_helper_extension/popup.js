// popup.js
// This script runs in the popup window. When the user clicks the
// "Open in Market Helper" button it parses the currently active
// market page, stores the parsed data in chrome.storage and opens
// a helper page to explore and filter the results.

// Encapsulate the logic for parsing the page and opening the helper into a separate function
async function runMarketHelper() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      alert('No active tab found.');
      return;
    }
    // Inject a parsing function into the active tab and return the results. The injected
    // function is asynchronous so that it can auto‑scroll the page before parsing
    // modules.
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async () => {
        // Auto‑scroll to the bottom of the page to load all results. The page shows
        // a spinner/loader when additional results are being fetched. We scroll
        // repeatedly until the number of items stops increasing for a few cycles
        // AND any visible loader element disappears.
        async function autoScroll() {
          const loaderSelector = '[class*=\"loader\"], [class*=\"loading\"], [class*=\"spinner\"]';
          return new Promise(resolve => {
            let lastItemCount = 0;
            let stableCount = 0;
            const interval = setInterval(() => {
              const items = document.querySelectorAll('.items .item');
              const currentCount = items.length;
              // Scroll down to trigger lazy loading
              window.scrollTo(0, document.body.scrollHeight);
              // Determine whether a loader/spinner is visible
              const loaderEl = document.querySelector(loaderSelector);
              const loaderVisible = loaderEl && loaderEl.offsetParent !== null;
              if (currentCount === lastItemCount) {
                stableCount++;
              } else {
                stableCount = 0;
                lastItemCount = currentCount;
              }
              // If there are no new items for several cycles and no loader is visible, finish
              if (stableCount >= 3 && !loaderVisible) {
                clearInterval(interval);
                resolve();
              }
            }, 700);
          });
        }
        function parseModules() {
          // Support parsing both ancestor and trigger modules by delegating to
          // specialized helper functions. Each helper returns a module object
          // containing a common set of fields used by the helper UI. Ancestor
          // modules include socket type and required rank, whereas trigger
          // modules omit those fields and treat all stats as neutral.

          function parseAncestor(item) {
            const getText = (selector) => {
              const el = item.querySelector(selector);
              return el ? el.textContent.trim() : '';
            };
            const name = getText('.row-wrapper .name') || getText('.module-name');
            const category = getText('.row-wrapper .type');
            // Socket type can be found either in ancestor-info or item__info
            let socketType = '';
            const socketInfo = item.querySelector('.ancestor-info .socket-type');
            if (socketInfo) {
              socketType = socketInfo.textContent.trim();
            } else {
              const socketInfo2 = item.querySelector('.item__info .socket-type');
              if (socketInfo2) socketType = socketInfo2.textContent.trim();
            }
            const requiredRank = getText('.ancestor-info .required-rank span');
            const platform = getText('.seller .platform');
            const rerollCount = getText('.seller .reroll span');
            // Seller name and status
            let sellerName = '';
            let sellerStatus = '';
            const nickEl = item.querySelector('.seller .nickname');
            if (nickEl) {
              if (nickEl.childNodes && nickEl.childNodes.length > 0) {
                const firstNode = nickEl.childNodes[0];
                if (firstNode.nodeType === Node.TEXT_NODE) {
                  sellerName = firstNode.textContent.trim();
                } else {
                  sellerName = nickEl.textContent.trim();
                }
              }
              const stateEl = nickEl.querySelector('i');
              if (stateEl) {
                sellerStatus = stateEl.textContent.trim();
              }
            }
            const sellerRank = getText('.seller .rank span');
            const priceEl = item.querySelector('.price');
            let price = '';
            if (priceEl) {
              // The price node contains text nodes and a span for the currency
              price = Array.from(priceEl.childNodes)
                .filter(n => n.nodeType === Node.TEXT_NODE)
                .map(n => n.textContent.trim())
                .join(' ');
            }
            const attributes = [];
            const stats = [];
            const optionSpans = item.querySelectorAll('.item__details .option-name');
            optionSpans.forEach(optSpan => {
              const lines = optSpan.textContent.split(/\r?\n/);
              lines.forEach(line => {
                let raw = line.trim();
                if (!raw) return;
                const positive = raw.startsWith('(+)');
                const negative = raw.startsWith('(-)');
                // Extract attribute name for filtering: remove sign and value range
                let attrName = raw.replace(/^\(\+\)|^\(\-\)/, '').split('[')[0].trim();
                if (attrName && !attributes.includes(attrName)) {
                  attributes.push(attrName);
                }
                stats.push({ raw, positive, negative });
              });
            });
            const regDate = getText('.information .date span');
            return {
              name,
              category,
              socketType,
              requiredRank,
              price,
              platform,
              rerollCount,
              sellerName,
              sellerStatus,
              sellerRank,
              regDate,
              attributes,
              stats
            };
          }

          function parseTrigger(item) {
            const getText = (selector) => {
              const el = item.querySelector(selector);
              return el ? el.textContent.trim() : '';
            };
            const name = getText('.row-wrapper .name') || getText('.module-name');
            const category = getText('.row-wrapper .type');
            // Trigger modules do not include a socket type in the UI
            const socketType = '';
            // Attempt to extract a required mastery rank if available; many trigger
            // listings omit this field. We look for elements commonly used on
            // ancestor items and fall back to an empty string.
            let requiredRank = '';
            const reqSpan = item.querySelector('.item__info .required-mastery-rank span, .item__info .required-rank span');
            if (reqSpan && reqSpan.textContent) {
              requiredRank = reqSpan.textContent.trim();
            }
            const platform = getText('.seller .platform');
            const rerollCount = getText('.seller .reroll span');
            let sellerName = '';
            let sellerStatus = '';
            const nickEl = item.querySelector('.seller .nickname');
            if (nickEl) {
              if (nickEl.childNodes && nickEl.childNodes.length > 0) {
                const firstNode = nickEl.childNodes[0];
                if (firstNode.nodeType === Node.TEXT_NODE) {
                  sellerName = firstNode.textContent.trim();
                } else {
                  sellerName = nickEl.textContent.trim();
                }
              }
              const stateEl = nickEl.querySelector('i');
              if (stateEl) {
                sellerStatus = stateEl.textContent.trim();
              }
            }
            const sellerRank = getText('.seller .rank span');
            const priceEl = item.querySelector('.price');
            let price = '';
            if (priceEl) {
              price = Array.from(priceEl.childNodes)
                .filter(n => n.nodeType === Node.TEXT_NODE)
                .map(n => n.textContent.trim())
                .join(' ');
            }
            const attributes = [];
            const stats = [];
            const optionEls = item.querySelectorAll('.item__details .option');
            optionEls.forEach(opt => {
              const nameEl = opt.querySelector('.option-name');
              const valueEl = opt.querySelector('.option-value');
              const labelText = nameEl ? nameEl.textContent.trim() : '';
              const valueText = valueEl ? valueEl.textContent.trim() : '';
              // Extract attribute name for filtering by removing the range in parentheses
              let attrName = labelText.split('(')[0].trim();
              if (attrName && !attributes.includes(attrName)) {
                attributes.push(attrName);
              }
              const raw = labelText + ' ' + valueText;
              // Trigger stats are neutral (no positive/negative colours)
              stats.push({ raw, positive: false, negative: false });
            });
            const regDate = getText('.information .date span');
            return {
              name,
              category,
              socketType,
              requiredRank,
              price,
              platform,
              rerollCount,
              sellerName,
              sellerStatus,
              sellerRank,
              regDate,
              attributes,
              stats
            };
          }

          const modules = [];
          const itemNodes = document.querySelectorAll('.items .item');
          itemNodes.forEach(item => {
            // Determine module type from category; triggers contain the word 'trigger'
            const typeEl = item.querySelector('.row-wrapper .type');
            const category = typeEl ? typeEl.textContent.trim() : '';
            const isTrigger = category.toLowerCase().includes('trigger');
            const mod = isTrigger ? parseTrigger(item) : parseAncestor(item);
            modules.push(mod);
          });
          return modules;
        }
        try {
          // Wait until all items have been loaded via auto‑scroll
          await autoScroll();
          return parseModules();
        } catch (err) {
          return { error: err.toString() };
        }
      }
    });
    if (result && result.error) {
      alert('Error parsing page: ' + result.error);
      return;
    }
    // Save the parsed modules to chrome.storage
    await chrome.storage.local.set({ marketData: result });
    // Open the helper page in a new tab
    const url = chrome.runtime.getURL('market_helper.html');
    chrome.tabs.create({ url });
    // Close the popup window after launching the helper
    window.close();
  } catch (err) {
    console.error(err);
    alert('Failed to run Market Helper: ' + err.message);
  }
}

// Show confirmation container when the button is clicked
const openBtn = document.getElementById('open-helper');
const confirmContainer = document.getElementById('confirm-container');
const proceedBtn = document.getElementById('confirm-proceed');
const cancelBtn = document.getElementById('confirm-cancel');

openBtn.addEventListener('click', () => {
  if (confirmContainer) {
    // Hide open button and show confirmation container
    openBtn.style.display = 'none';
    confirmContainer.classList.remove('hidden');
  } else {
    // Fallback: directly run the helper if confirmation container not found
    runMarketHelper();
  }
});

// When user proceeds, run the helper and close popup
if (proceedBtn) {
  proceedBtn.addEventListener('click', () => {
    // Hide confirmation box and show a loading message while the auto‑scroll runs
    if (confirmContainer) confirmContainer.classList.add('hidden');
    // Hide the open helper button
    openBtn.style.display = 'none';
    const loadingCont = document.getElementById('loading-container');
    if (loadingCont) loadingCont.classList.remove('hidden');
    runMarketHelper();
  });
}

// When user cancels, hide confirmation and show open button again
if (cancelBtn) {
  cancelBtn.addEventListener('click', () => {
    if (confirmContainer) confirmContainer.classList.add('hidden');
    // Show the open helper button again
    openBtn.style.display = 'block';
  });
}