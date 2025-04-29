# GitHub PR File Hider Button 🚫📄

**Hide files in GitHub PRs like a ninja.**  
Tired of scrolling through endless files in a pull request? Want to focus on what matters and ignore the noise?  
This Chrome extension adds magical "Hide" and "Unhide" buttons to each file in the PR file tree.  
Folders with nothing left? They vanish too. ✨

---

## Features

- 🕵️‍♂️ **Hide/Unhide Files:** Click a button, and the file (and its diff!) disappears from your view.
- 🗂️ **Auto-Hide Empty Folders:** If a folder has no visible files, it’s gone. Recursive, like a good algorithm.
- 👀 **Show All Hidden Files:** One click brings everything back. (No need to beg.)
- 🔗 **Share Hidden State:** Copy a link that preserves your hidden files. Share your focused view with teammates!
- ⚡ **Minimal DOM Changes:** Fast, efficient, and doesn’t break GitHub’s UI.
- 🌐 **Scope:** Works seamlessly on both the commit screen and PR screen.

---

## Installation

1. Clone or download this repo.
2. Go to `chrome://extensions` in Chrome.
3. Enable "Developer mode" (top right).
4. Click "Load unpacked" and select this folder.
5. Open a GitHub PR’s "Files changed" tab.  
   _Behold the new buttons!_

---

## Usage

> ⚠️ **Heads up!**  
> The buttons only appear if you open the Files Changed" page directly (like with [a refresh or direct link](https://github.com/HoangYell/github-pr-file-hider-button/pull/1/files)).  
> If you click to the page from another GitHub tab (using the top navigation), the buttons might not show up.  
> _It's not a bug, it's a feature. I swear!_ 🐞👻

- Click **Hide** next to any file in the file tree to make it disappear (from the tree and the diff).
- Click **Show All Hidden Files** to restore everything.
- Click **Share Hidden State** to copy a link that preserves your hidden files (great for code reviews).

![Hide Buttons](https://github.com/HoangYell/github-pr-file-hider-button/blob/main/images_note/Hide%20Share%20buttons.png)

![Share Hidden Files](https://github.com/HoangYell/github-pr-file-hider-button/blob/main/images_note/Share%20Hidden%20State.png)

![Result](https://github.com/HoangYell/github-pr-file-hider-button/blob/main/images_note/Hidden%20Files.jpg)
---

## FAQ

**Q: Does this delete files?**  
A: No! It only hides them from your view. Your code is safe. (We’re not monsters.)

**Q: Can I hide folders?**  
A: Hide all files in a folder, and the folder will hide itself. Like magic.

**Q: Will this break GitHub?**  
A: Nope. It’s polite and only tweaks what you see.

---

## Contributing

PRs welcome!  
If you can make it faster, cleaner, or more magical, open an issue or PR.

---

## License

MIT.  
Use it, fork it, hide all the files you want.

---

## Privacy Policy

This extension does not collect, store, or transmit any user data.

---

Made with ❤️ by [HoangYell](https://hoangyell.com/) and [contributors](https://github.com/HoangYell/github-pr-file-hider-button/graphs/contributors).
