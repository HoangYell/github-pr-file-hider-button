/**
 * GitHub PR File Hider Button
 * Clean, performant, and maintainable implementation.
 */

function ensureHiddenFilesContainer() {
    let container = document.getElementById('pr-hidden-files-container');
    if (!container) {
        const tree = document.querySelector('file-tree nav ul.ActionList');
        if (!tree) return null;

        // Create container and label
        container = document.createElement('ul');
        container.id = 'pr-hidden-files-container';
        container.className = 'ActionList ActionList--tree ActionList--full';
        container.style.borderTop = '1px solid #eee';

        const label = document.createElement('div');
        label.textContent = 'Hidden Files';
        label.style.fontWeight = 'bold';
        label.style.fontSize = '13px';
        label.style.margin = '20px 0 4px 8px';

        tree.parentNode.appendChild(label);
        tree.parentNode.appendChild(container);
    }
    return container;
}

// Add hide buttons to all file nodes in the tree
function addHideButtonsToFileTree(treeRoot) {
    const nodes = (treeRoot || document).querySelectorAll(
        'li.js-tree-node[data-tree-entry-type="file"]:not([data-hide-btn])'
    );
    nodes.forEach(async fileNode => {
        fileNode.setAttribute('data-hide-btn', '1');
        const filePath = fileNode.querySelector('span[data-filterable-item-text]')?.textContent?.trim();
        if (!filePath) return;

        const btn = document.createElement('button');
        btn.className = 'btn btn-sm hide-tree-file-button';
        btn.style.marginLeft = '8px';
        btn.type = 'button';
        btn.dataset.filePath = filePath;
        btn.textContent = 'Hide';

        const label = fileNode.querySelector('.ActionList-item-label');
        if (label) label.parentNode.appendChild(btn);
    });
}

// Move a file node to the hidden container and update UI
async function hideFileNode(fileNode, btn) {
    const hiddenContainer = ensureHiddenFilesContainer();
    if (hiddenContainer) {
        hiddenContainer.appendChild(fileNode);
        btn.textContent = 'Unhide';
        btn.classList.add('unhide-tree-file-button');
        btn.classList.remove('hide-tree-file-button');
    }
    toggleDiffPanel(fileNode, false);
}

// Move a file node back to the main tree in sorted order and update UI
async function unhideFileNode(fileNode, btn) {
    const mainTree = document.querySelector('file-tree nav ul.ActionList');
    if (!mainTree) return;

    const filePath = fileNode.querySelector('span[data-filterable-item-text]')?.textContent?.trim();
    let inserted = false;

    // Insert in sorted order among direct children
    for (const node of mainTree.children) {
        if (
            node !== fileNode &&
            node.matches &&
            node.matches('li.js-tree-node[data-tree-entry-type="file"]')
        ) {
            const nodePath = node.querySelector('span[data-filterable-item-text]')?.textContent?.trim();
            if (nodePath && filePath && filePath.localeCompare(nodePath) < 0) {
                mainTree.insertBefore(fileNode, node);
                inserted = true;
                break;
            }
        }
    }
    if (!inserted) {
        mainTree.appendChild(fileNode);
    }

    btn.textContent = 'Hide';
    btn.classList.add('hide-tree-file-button');
    btn.classList.remove('unhide-tree-file-button');

    toggleDiffPanel(fileNode, true);
}

// Show or hide the diff panel for a file node
function toggleDiffPanel(fileNode, show) {
    const anchor = fileNode.querySelector('a.ActionList-content');
    if (anchor && anchor.getAttribute('href')?.startsWith('#diff-')) {
        const diffId = anchor.getAttribute('href').slice(1);
        const diffPanel = document.getElementById(diffId);
        if (diffPanel) {
            const fileContainer = diffPanel.closest('.file');
            if (fileContainer) {
                fileContainer.style.display = show ? '' : 'none';
            } else {
                diffPanel.style.display = show ? '' : 'none';
            }
        }
    }
}

// Event delegation for hide/unhide buttons
document.addEventListener('click', async function (e) {
    const btn = e.target;
    if (btn.classList.contains('hide-tree-file-button')) {
        const fileNode = btn.closest('li.js-tree-node[data-tree-entry-type="file"]');
        if (fileNode) await hideFileNode(fileNode, btn);
    } else if (btn.classList.contains('unhide-tree-file-button')) {
        const fileNode = btn.closest('li.js-tree-node[data-tree-entry-type="file"]');
        if (fileNode) await unhideFileNode(fileNode, btn);
    }
});

// Debounced mutation observer for dynamic file trees
let debounceTimer = null;
function debouncedAddButtons(treeRoot) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => addHideButtonsToFileTree(treeRoot), 100);
}

// Observe file tree changes and add buttons as needed
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
                if (
                    node.nodeType === 1 &&
                    node.matches('li.js-tree-node[data-tree-entry-type="file"]')
                ) {
                    debouncedAddButtons(tree);
                }
            });
        }
    }).observe(tree, { childList: true, subtree: true });
}

// Initialize after DOM is ready
setTimeout(observeTreeChanges, 500);