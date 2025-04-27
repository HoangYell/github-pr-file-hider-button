function addHideButtonsToFileTree(treeRoot) {
    // Only add buttons to file nodes that don't have one yet
    (treeRoot || document).querySelectorAll('li.js-tree-node[data-tree-entry-type="file"]:not([data-hide-btn])').forEach(fileNode => {
        fileNode.setAttribute('data-hide-btn', '1');
        const filePath = fileNode.querySelector('span[data-filterable-item-text]')?.textContent?.trim();
        if (!filePath) return;

        const btn = document.createElement('button');
        btn.textContent = 'Hide File';
        btn.className = 'btn btn-sm hide-tree-file-button';
        btn.style.marginLeft = '8px';
        btn.type = 'button';
        btn.dataset.filePath = filePath;
        // No per-button event listener!
        const label = fileNode.querySelector('.ActionList-item-label');
        if (label) label.parentNode.appendChild(btn);
    });
}

// Event delegation for all hide buttons
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('hide-tree-file-button')) {
        e.preventDefault();
        e.stopPropagation();
        const btn = e.target;
        const fileNode = btn.closest('li.js-tree-node[data-tree-entry-type="file"]');
        if (fileNode) fileNode.style.display = 'none';

        // Hide the diff panel on the right
        const anchor = fileNode.querySelector('a.ActionList-content');
        if (anchor && anchor.getAttribute('href')?.startsWith('#diff-')) {
            const diffId = anchor.getAttribute('href').slice(1);
            const diffPanel = document.getElementById(diffId);
            if (diffPanel) {
                let fileContainer = diffPanel.closest('.file');
                if (fileContainer) {
                    fileContainer.style.display = 'none';
                } else {
                    diffPanel.style.display = 'none';
                }
            }
        }
    }
});

// Debounced mutation observer
let debounceTimer = null;
function debouncedAddButtons(treeRoot) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => addHideButtonsToFileTree(treeRoot), 100);
}

function observeTreeChanges() {
    const tree = document.querySelector('file-tree nav ul.ActionList');
    if (!tree) {
        setTimeout(observeTreeChanges, 500);
        return;
    }
    addHideButtonsToFileTree(tree);
    new MutationObserver(mutations => {
        for (const m of mutations) {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches('li.js-tree-node[data-tree-entry-type="file"]')) {
                    debouncedAddButtons(tree);
                }
            });
        }
    }).observe(tree, {childList: true, subtree: true});
}

setTimeout(observeTreeChanges, 500);