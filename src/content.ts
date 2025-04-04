interface Shortcut {
  keys: string[];
}

type ShortcutsKeys = typeof SHORTCUTS_KEY[keyof typeof SHORTCUTS_KEY];

const SHORTCUTS_KEY = {
  preview: 'preview'
} as const


const SHORTCUTS: Record<ShortcutsKeys, Shortcut> = {
  preview: { keys: ['⌘', '⇧', 'P'] }
};

const TOOLTIP_ID = 'gh-shortcut-helper-tooltip';

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let tooltipHideTimeoutId: number | null = null;

async function showTooltip(shortcut: ShortcutsKeys) {
  const tooltip = document.getElementById(TOOLTIP_ID)
  if(!tooltip) return
  const keys = SHORTCUTS[shortcut].keys;

  // 閉じてから開き直す
  const isAlreadyShowing = tooltip.classList.contains('show');
  if(isAlreadyShowing) {
    if(tooltipHideTimeoutId) clearTimeout(tooltipHideTimeoutId)
    tooltip.classList.remove('show');
    await wait(500);
  }

  tooltip.innerHTML = keys.map(key => `<kbd>${key}</kbd>`).join(' + ');
  tooltip.classList.add('show');
  tooltipHideTimeoutId = setTimeout(() => {
    tooltip.classList.remove('show');
  }, 8000)
}



function setUpEventListeners() {
  // 1回のクリックで複数のボタンのeventが発生するのを防ぐフラグ
  let isClickProcessing = false;
  // グローバルで全てのボタンのクリックを監視
  document.body.addEventListener('click', (event) => {
    if (isClickProcessing) return;
    isClickProcessing = true;
    const target = event.target as HTMLElement;
  
    // ボタンかリンクをクリックした時に実行
    if (target.tagName === 'BUTTON' || target.tagName === 'A') {
      const parent = target.parentElement;
      if(parent && parent.getAttribute("aria-label") === "Preview") {
        showTooltip(SHORTCUTS_KEY.preview)
      }
    }
  
    // 300ms後にフラグをリセット
    setTimeout(() => {
      isClickProcessing = false;
    }, 300);
  });
}

function createTooltipDom() {
  const tooltip = document.createElement('div');
  tooltip.id = TOOLTIP_ID;
  tooltip.className = 'gh-shortcut-helper-tooltip';
  document.body.appendChild(tooltip);
}

function main() {
  setUpEventListeners()
  createTooltipDom()
  console.log("GitHub Shortcut Helper Started");
}

main()