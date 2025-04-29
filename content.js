/**
 * GitHub PR File Hider Button
 * Toggle file visibility in PR file tree, minimal DOM changes.
 */

// CSS class for hiding nodes
const HIDDEN_CLASS = 'gh-pr-file-hidden';

// Utility: Get file tree root for PR or commit screen (cached)
let cachedTreeRoot = null;
function getFileTreeRoot(force = false) {
    if (!cachedTreeRoot || force) {
        cachedTreeRoot = document.querySelector('file-tree nav ul.ActionList')
            || document.querySelector('.js-diff-progressive-container > ul.ActionList')
            || document.querySelector('.toc-diff-stats + ul.ActionList')
            || null;
    }
    return cachedTreeRoot;
}

// Add CSS for hidden class once (now only for hiding, rest is in styles.css)
(function injectHideStyle() {
    if (!document.getElementById('gh-pr-file-hider-style')) {
        const style = document.createElement('style');
        style.id = 'gh-pr-file-hider-style';
        style.textContent = `.${HIDDEN_CLASS} { display: none !important; }`;
        document.head.appendChild(style);
    }
})();

// Hide empty directories in the file tree (recursive, bottom-up)
function hideEmptyDirectories(treeRoot = document) {
    const dirNodes = Array.from(treeRoot.querySelectorAll('li.js-tree-node[data-tree-entry-type="directory"]'))
        .sort((a, b) => b.querySelectorAll('li.js-tree-node[data-tree-entry-type="directory"]').length - a.querySelectorAll('li.js-tree-node[data-tree-entry-type="directory"]').length);

    dirNodes.forEach(dirNode => {
        const hasVisibleChild = Array.from(dirNode.querySelectorAll(':scope > ul > li.js-tree-node:not(.' + HIDDEN_CLASS + ')')).length > 0;
        dirNode.classList.toggle(HIDDEN_CLASS, !hasVisibleChild);
    });
}

// Add "Show All Hidden Files" button
function addShowAllButton() {
    if (document.getElementById('show-all-hidden-files-btn')) return;
    const tree = getFileTreeRoot();
    if (!tree || !tree.parentNode) return;
    const btn = Object.assign(document.createElement('button'), {
        id: 'show-all-hidden-files-btn',
        textContent: 'Show All Hidden Files',
        className: 'btn btn-sm hide-tree-file-button',
    });
    let isProcessing = false;
    btn.onclick = async () => {
        if (isProcessing) return;
        isProcessing = true;
        btn.disabled = true;
        tree.querySelectorAll('li.js-tree-node[data-tree-entry-type="file"].' + HIDDEN_CLASS).forEach(fileNode => {
            fileNode.classList.remove(HIDDEN_CLASS);
            const hideBtn = fileNode.querySelector('.unhide-tree-file-button, .hide-tree-file-button');
            if (hideBtn) {
                hideBtn.textContent = 'Hide';
                hideBtn.classList.add('hide-tree-file-button');
                hideBtn.classList.remove('unhide-tree-file-button');
            }
            toggleDiffPanel(fileNode, true);
        });
        hideEmptyDirectories(tree);
        await new Promise(r => setTimeout(r, 100)); // debounce for UI update
        btn.disabled = false;
        isProcessing = false;
    };
    tree.parentNode.insertBefore(btn, tree);
}

// Add hide/unhide button to a file node if not present
function addHideButtonToFileNode(fileNode) {
    if (fileNode.querySelector('.hide-tree-file-button, .unhide-tree-file-button')) return;
    const btn = Object.assign(document.createElement('button'), {
        className: 'btn btn-sm hide-tree-file-button',
        type: 'button',
        textContent: 'Hide'
    });
    let isProcessing = false;
    btn.onclick = async (e) => {
        e.stopPropagation();
        if (isProcessing) return;
        isProcessing = true;
        btn.disabled = true;
        toggleFileNode(fileNode, btn, btn.classList.contains('hide-tree-file-button'));
        await new Promise(r => setTimeout(r, 100)); // debounce for UI update
        btn.disabled = false;
        isProcessing = false;
    };
    const anchor = fileNode.querySelector('a.ActionList-content');
    (anchor ? anchor : fileNode).insertAdjacentElement(anchor ? 'afterend' : 'beforeend', btn);
}

// Add hide buttons to all file nodes and hide empty directories
function addHideButtonsToFileTree(treeRoot) {
    (treeRoot || document)
        .querySelectorAll('li.js-tree-node[data-tree-entry-type="file"]')
        .forEach(addHideButtonToFileNode);
    hideEmptyDirectories(treeRoot);
}

// Show or hide the diff panel for a file node
function toggleDiffPanel(fileNode, show) {
    const anchor = fileNode.querySelector('a.ActionList-content');
    const href = anchor?.getAttribute('href');
    if (!href?.startsWith('#diff-')) return;
    const diffPanel = document.getElementById(href.slice(1));
    const fileContainer = diffPanel?.closest('.file');
    if (fileContainer || diffPanel) (fileContainer || diffPanel).style.display = show ? '' : 'none';
}

// Toggle file node and diff panel visibility
function toggleFileNode(fileNode, btn, hide) {
    if (fileNode.classList.contains(HIDDEN_CLASS) !== hide) {
        fileNode.classList.toggle(HIDDEN_CLASS, hide);
        btn.textContent = hide ? 'Unhide' : 'Hide';
        btn.classList.toggle('hide-tree-file-button', !hide);
        btn.classList.toggle('unhide-tree-file-button', hide);
        toggleDiffPanel(fileNode, !hide);
        hideEmptyDirectories(getFileTreeRoot());
    }
}

// Event delegation for hide/unhide buttons (fallback for dynamically added buttons)
document.addEventListener('click', e => {
    const btn = e.target.closest('.hide-tree-file-button, .unhide-tree-file-button');
    if (!btn) return;
    if (btn.disabled) return; // Prevent race on rapid clicks
    const fileNode = btn.closest('li.js-tree-node[data-tree-entry-type="file"]');
    if (!fileNode) return;
    btn.disabled = true;
    toggleFileNode(fileNode, btn, btn.classList.contains('hide-tree-file-button'));
    setTimeout(() => { btn.disabled = false; }, 100); // debounce
});

// Add "Share Hidden State" button
function addShareButton() {
    if (document.getElementById('share-hidden-files-btn')) return;
    const tree = getFileTreeRoot();
    if (!tree) return;
    const btn = Object.assign(document.createElement('button'), {
        id: 'share-hidden-files-btn',
        textContent: 'Share Hidden State',
        className: 'btn btn-sm hide-tree-file-button'
    });
    let isProcessing = false;
    btn.onclick = async () => {
        if (isProcessing) return;
        isProcessing = true;
        btn.disabled = true;
        const hiddenFiles = [];
        tree.querySelectorAll('li.js-tree-node[data-tree-entry-type="file"]').forEach((fileNode, idx) => {
            if (fileNode.classList.contains(HIDDEN_CLASS)) hiddenFiles.push(idx);
        });
        const url = new URL(window.location.href);
        url.hash = 'hide=' + hiddenFiles.join(',');
        try {
            await navigator.clipboard.writeText(url.toString());
            btn.textContent = 'Link Copied!';
            setTimeout(() => { btn.textContent = 'Share Hidden State'; }, 1500);
        } catch (e) {
            btn.textContent = 'Copy Failed!';
            setTimeout(() => { btn.textContent = 'Share Hidden State'; }, 1500);
        }
        btn.disabled = false;
        isProcessing = false;
    };
    tree.parentNode.insertBefore(btn, tree.nextSibling);
}

function restoreHiddenStateFromParams() {
    const tree = getFileTreeRoot();
    if (!tree) return;
    let hideParam = sessionStorage.getItem('github-pr-hide');
    if (!hideParam && window.location.hash.startsWith('#hide=')) {
        hideParam = window.location.hash.replace('#hide=', '');
    }
    if (!hideParam) return;
    const indices = hideParam.split(',').map(Number).filter(n => !isNaN(n));
    const fileNodes = Array.from(tree.querySelectorAll('li.js-tree-node[data-tree-entry-type="file"]'));
    if (
        !fileNodes.length ||
        fileNodes.some(node => !node.querySelector('.hide-tree-file-button, .unhide-tree-file-button'))
    ) {
        setTimeout(restoreHiddenStateFromParams, 200); // Wait for buttons to be ready
        return;
    }
    indices.forEach(idx => {
        const fileNode = fileNodes[idx];
        if (fileNode && !fileNode.classList.contains(HIDDEN_CLASS)) {
            const btn = fileNode.querySelector('.hide-tree-file-button, .unhide-tree-file-button');
            if (btn) {toggleFileNode(fileNode, btn, true);} // No alert, just skip if not found
        }
    });
}

// Observe file tree changes and add buttons as needed
let treeObserver = null;
function observeTreeChanges() {
    cachedTreeRoot = null;
    if (treeObserver) {
        treeObserver.disconnect();
        treeObserver = null;
    }
    const tree = getFileTreeRoot(true);
    if (!tree) return setTimeout(observeTreeChanges, 500);
    addHideButtonsToFileTree(tree);
    addShowAllButton();
    addShareButton();
    let debounce;
    treeObserver = new MutationObserver(() => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            addHideButtonsToFileTree(tree);
            addShowAllButton();
            addShareButton();
        }, 100);
    });
    treeObserver.observe(tree, { childList: true, subtree: true });
    restoreHiddenStateFromParams();
}

// Robust initialization for SPA navigation and race conditions
function initFileHider() {
    setTimeout(observeTreeChanges, 500);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFileHider);
} else {
    initFileHider();
}
document.addEventListener('pjax:end', initFileHider);
document.addEventListener('turbo:render', initFileHider);
document.addEventListener('turbo:load', initFileHider);