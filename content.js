// Utility: Get file tree root for PR or commit screen
function getFileTreeRoot() {
    // PR: file-tree nav ul.ActionList
    let tree = document.querySelector('file-tree nav ul.ActionList');
    if (tree) return tree;
    // Commit: .js-diff-progressive-container > .ActionList
    tree = document.querySelector('.js-diff-progressive-container > ul.ActionList');
    if (tree) return tree;
    // Commit (old layout fallback): .toc-diff-stats + .ActionList
    tree = document.querySelector('.toc-diff-stats + ul.ActionList');
    return tree;
}

/**
 * GitHub PR File Hider Button
 * Toggle file visibility in PR file tree, minimal DOM changes.
 */

// Add "Show All Hidden Files" button
function addShowAllButton() {
    if (document.getElementById('show-all-hidden-files-btn')) return;
    const tree = getFileTreeRoot();
    if (!tree) return;
    const btn = Object.assign(document.createElement('button'), {
        id: 'show-all-hidden-files-btn',
        textContent: 'Show All Hidden Files',
        className: 'btn btn-sm',
        style: 'margin:8px 0 8px 8px'
    });
    btn.onclick = () => {
        tree.querySelectorAll('li.js-tree-node[data-tree-entry-type="file"]').forEach(fileNode => {
            fileNode.style.display = '';
            const hideBtn = fileNode.querySelector('.unhide-tree-file-button, .hide-tree-file-button');
            if (hideBtn) {
                hideBtn.textContent = 'Hide';
                hideBtn.classList.add('hide-tree-file-button');
                hideBtn.classList.remove('unhide-tree-file-button');
            }
            toggleDiffPanel(fileNode, true);
        });
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
    // Find the ActionList-content <a>
    const anchor = fileNode.querySelector('a.ActionList-content');
    if (anchor) {
        // Insert the button after the anchor
        anchor.insertAdjacentElement('afterend', btn);
    } else {
        // fallback: append to fileNode
        fileNode.appendChild(btn);
    }
}

// Add hide buttons to all file nodes
function addHideButtonsToFileTree(treeRoot) {
    (treeRoot || document)
        .querySelectorAll('li.js-tree-node[data-tree-entry-type="file"]')
        .forEach(addHideButtonToFileNode);
}

// Toggle file node and diff panel visibility
function toggleFileNode(fileNode, btn, hide) {
    fileNode.style.display = hide ? 'none' : '';
    btn.textContent = hide ? 'Unhide' : 'Hide';
    btn.classList.toggle('hide-tree-file-button', !hide);
    btn.classList.toggle('unhide-tree-file-button', hide);
    toggleDiffPanel(fileNode, !hide);
}

// Show or hide the diff panel for a file node
function toggleDiffPanel(fileNode, show) {
    const anchor = fileNode.querySelector('a.ActionList-content');
    const href = anchor?.getAttribute('href');
    if (!href?.startsWith('#diff-')) return;
    const diffPanel = document.getElementById(href.slice(1));
    const fileContainer = diffPanel?.closest('.file');
    (fileContainer || diffPanel).style.display = show ? '' : 'none';
}

// Event delegation for hide/unhide buttons
document.addEventListener('click', e => {
    const btn = e.target.closest('.hide-tree-file-button, .unhide-tree-file-button');
    if (!btn) return;
    const fileNode = btn.closest('li.js-tree-node[data-tree-entry-type="file"]');
    if (!fileNode) return;
    toggleFileNode(fileNode, btn, btn.classList.contains('hide-tree-file-button'));
});

// Observe file tree changes and add buttons as needed
function observeTreeChanges() {
    const tree = getFileTreeRoot();
    if (!tree) return setTimeout(observeTreeChanges, 500);
    addHideButtonsToFileTree(tree);
    addShowAllButton();
    let debounce;
    new MutationObserver(() => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            addHideButtonsToFileTree(tree);
            addShowAllButton();
        }, 100);
    }).observe(tree, { childList: true, subtree: true });
}

// Initialize after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(observeTreeChanges, 500));
} else {
    setTimeout(observeTreeChanges, 500);
}