# GitHub PR File Hider Button 🚫📄  
**Hide noisy files in pull requests for faster, cleaner code reviews.**

- Overwhelmed by too many files in a pull request or commit?
- Need to focus on just the important changes and filter out distractions?
- Want to guide a teammate to review only specific parts of a large PR?
- Need a "MagicLink" to share so your teammates see the same focused files?

This Chrome extension helps you focus by hiding irrelevant files — so you can review what matters most and share a filtered view with your team.

---

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Browser Support](#browser-support)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)
- [Privacy Policy](#privacy-policy)

---

## Features

- 🕵️‍♂️ **Hide Files:** Click a button, and the file (and its diff) disappears from your view.
- 🗂️ **Auto-Hide Empty Folders:** Folders with no visible files vanish automatically. Recursive, like a good algorithm.
- 👀 **Restore View Instantly:** Click one button to bring everything back. (No begging required.)
- 🔗 **Share a MagicLink:** Copy a link that preserves your hidden file state — perfect for team reviews.
- ⚡ **Fast & Non-Intrusive:** Minimal DOM changes. Fast, efficient, and doesn’t break GitHub’s UI.
- 🌐 **Scope:** Works on both [commit screens](https://github.com/HoangYell/github-pr-file-hider-button/pull/2/commits/b6a8ebd86b49c781dd3ce7b418a1e86da9561eb5) and [PR screens](https://github.com/HoangYell/github-pr-file-hider-button/pull/2/files).

---

## Installation

### 🧪 Manual (Development Mode)
1. Clone or download this repo.
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the folder you just downloaded.
5. Navigate to a GitHub PR’s **Files changed** tab.  
   You’ll see new **Hide** and **Share** buttons appear next to each file.

### 🧪 Chrome Web Store
- [**Install from the Chrome Web Store**](https://chromewebstore.google.com/detail/github-pr-file-hider-butt/mojhgeodfmcdjaphhknepogemmkneejh?utm_source=item-share-cb)
---

## Usage

- 🔘 Click **Hide** next to any file in the file tree to make it disappear (from the tree and the diff).
- 🔘 Click **Show All Hidden Files** to bring everything back.
- 🔘 Click **Share Hidden State** to copy a link that preserves your hidden file state—perfect for team reviews.

### 📸 Screenshots

![Hide Buttons](https://github.com/HoangYell/github-pr-file-hider-button/blob/main/images/Hide%20Share%20buttons.png)

![Share Hidden Files](https://github.com/HoangYell/github-pr-file-hider-button/blob/main/images/Share%20Hidden%20State.png)

![Result](https://github.com/HoangYell/github-pr-file-hider-button/blob/main/images/Hidden%20Files.jpg)

> [Watch the video tutorial](https://www.youtube.com/watch?v=6-ynBo6dB8E) for a quick demo of how to use the extension.

---

## Browser Support

| Browser | Supported |
|---------|-----------|
| Chrome  | ✅ Yes (via manual install) |
| Edge    | 🟡 Untested (may work) |
| Firefox | ❌ Not yet |
| Safari  | ❌ Not yet |

---

## FAQ

**Q: Does this delete files?**  
A: No! It only hides them from your view in the browser. Your code stays untouched.

**Q: Can I hide folders?**  
A: If you hide all files in a folder, the folder will hide itself automatically. Like magic.

**Q: Will this break GitHub?**  
A: Nope. It makes minimal, safe changes to the DOM — GitHub continues working as expected.

**Q: Can I use this to onboard teammates?**  
A: Yes! Use the Share button to create a link showing only the relevant files.

---

## Contributing

PRs welcome!  
If you can make it faster, cleaner, or more magical — feel free to [open an issue](https://github.com/HoangYell/github-pr-file-hider-button/issues) or submit a PR.

---

## License

MIT.  
Use it, fork it, hide all the files you want. ✨

---

## Privacy Policy

This extension does **not** collect, store, or transmit any user data.  
No telemetry, no tracking, no ads.

---

Made with ❤️ by [HoangYell](https://hoangyell.com/) and [contributors](https://github.com/HoangYell/github-pr-file-hider-button/graphs/contributors).
