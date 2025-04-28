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

// Add CSS for hidden class once
(function injectHideStyle() {
    if (!document.getElementById('gh-pr-file-hider-style')) {
        const style = document.createElement('style');
        style.id = 'gh-pr-file-hider-style';
        style.textContent = `.${HIDDEN_CLASS} { display: none !important; }`;
        document.head.appendChild(style);
    }
})();

// Hide empty directories in the file tree
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
        className: 'btn btn-sm',
        style: 'margin:8px 0 8px 8px'
    });
    btn.onclick = () => {
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
    };
    tree.parentNode.insertBefore(btn, tree);
}

// Add hide/unhide button to a file node if not present
function addHideButtonToFileNode(fileNode) {
    if (fileNode.querySelector('.hide-tree-file-button, .unhide-tree-file-button')) return;
    const btn = Object.assign(document.createElement('button'), {
        className: 'btn btn-sm hide-tree-file-button',
        type: 'button',
        textContent: 'Hide',
        style: 'margin-left:8px;font-size:12px'
    });
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

// Event delegation for hide/unhide buttons
document.addEventListener('click', e => {
    const btn = e.target.closest('.hide-tree-file-button, .unhide-tree-file-button');
    if (!btn) return;
    const fileNode = btn.closest('li.js-tree-node[data-tree-entry-type="file"]');
    if (!fileNode) return;
    toggleFileNode(fileNode, btn, btn.classList.contains('hide-tree-file-button'));
});

// Add "Share Hidden State" button
function addShareButton() {
    if (document.getElementById('share-hidden-files-btn')) return;
    const tree = getFileTreeRoot();
    if (!tree) return;
    const btn = Object.assign(document.createElement('button'), {
        id: 'share-hidden-files-btn',
        textContent: 'Share Hidden State',
        className: 'btn btn-sm',
        style: 'margin:8px 0 8px 8px'
    });
    btn.onclick = () => {
        const hiddenFiles = [];
        tree.querySelectorAll('li.js-tree-node[data-tree-entry-type="file"]').forEach((fileNode, idx) => {
            if (fileNode.classList.contains(HIDDEN_CLASS)) hiddenFiles.push(idx);
        });
        const url = new URL(window.location.href);
        url.hash = 'hide=' + hiddenFiles.join(',');
        navigator.clipboard.writeText(url.toString()).then(() => {
            btn.textContent = 'Link Copied!';
            setTimeout(() => { btn.textContent = 'Share Hidden State'; }, 1500);
        });
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
        alert('Not all file nodes/buttons are ready. Try again in a moment.');
        return;
    }
    indices.forEach(idx => {
        const fileNode = fileNodes[idx];
        if (fileNode && !fileNode.classList.contains(HIDDEN_CLASS)) {
            const btn = fileNode.querySelector('.hide-tree-file-button, .unhide-tree-file-button');
            if (btn) {toggleFileNode(fileNode, btn, true)} else {alert('Button not found!'); return; };
        }
    });
}

// Observe file tree changes and add buttons as needed
function observeTreeChanges() {
    const tree = getFileTreeRoot(true);
    if (!tree) return setTimeout(observeTreeChanges, 500);
    addHideButtonsToFileTree(tree);
    addShowAllButton();
    addShareButton();
    let debounce;
    new MutationObserver(() => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            addHideButtonsToFileTree(tree);
            addShowAllButton();
            addShareButton();
        }, 100);
    }).observe(tree, { childList: true, subtree: true });
    restoreHiddenStateFromParams();
}

// Initialize after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(observeTreeChanges, 500));
} else {
    setTimeout(observeTreeChanges, 500);
}