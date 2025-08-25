# VS Code Block - Syntax Highlighter

A beautiful WordPress plugin that brings the Visual Studio Code dark theme to your code blocks with support for 150+ programming languages.

![WordPress Version](https://img.shields.io/badge/WordPress-6.0%2B-blue)
![PHP Version](https://img.shields.io/badge/PHP-7.0%2B-purple)
![License](https://img.shields.io/badge/license-GPL--2.0%2B-green)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

## 🎨 Features

### Core Features
- **🎯 VS Code Dark Theme**: Authentic Visual Studio Code dark theme appearance
- **🌍 150+ Languages**: Comprehensive syntax highlighting for all major programming languages
- **📦 Multiple Integration Methods**: Gutenberg blocks, Classic Editor, widgets, and shortcodes
- **🚀 Performance Optimized**: Loads assets only where needed with lazy loading support
- **📱 Fully Responsive**: Perfect display on all devices

### Display Options
- ✅ Line numbers with toggle control
- 📋 One-click copy button
- 🏷️ Language labels
- 🎯 Line highlighting for specific lines
- 📁 Filename display
- 🔽 Collapsible code blocks
- 🖥️ Fullscreen view mode
- 🔍 Search within code blocks
- 🎨 Custom scrollbar styling
- 💻 Command line prompt support
- 🔄 Diff highlighting

## 📥 Installation

### From WordPress Admin
1. Download the plugin zip file
2. Navigate to **Plugins → Add New** in your WordPress admin
3. Click **Upload Plugin** and select the zip file
4. Click **Install Now** and then **Activate**

### Manual Installation
1. Download and extract the plugin files
2. Upload the `vs-code-block` folder to `/wp-content/plugins/`
3. Download [Prism.js](https://prismjs.com/download.html) with your desired languages
4. Place `prism.js` in `/wp-content/plugins/vs-code-block/assets/lib/prism/`
5. Activate the plugin through the WordPress admin

## 🚀 Usage

### Gutenberg Block
1. Add a new block in the editor
2. Search for "VS Code Block"
3. Configure your code and settings in the sidebar
4. Customize display options as needed

### Classic Editor
- Click the **VS Code** button in the toolbar
- Or use the keyboard shortcut: `Ctrl+Shift+C`

### Shortcode
```
[vscode language="javascript" filename="script.js" lines="true" copy="true"]
function hello() {
    console.log("Hello, World!");
}
[/vscode]
```

#### Shortcode Parameters
- `language` - Programming language (default: javascript)
- `filename` - Optional filename to display
- `lines` - Show line numbers (true/false)
- `copy` - Show copy button (true/false)
- `label` - Show language label (true/false)
- `highlight` - Highlight specific lines (e.g., "1,3-5,8")
- `collapsible` - Make block collapsible (true/false)
- `collapsed` - Start in collapsed state (true/false)

### Widget
1. Go to **Appearance → Widgets**
2. Add the "VS Code Block" widget to any widget area
3. Configure code and display settings
4. Save and preview

## ⚙️ Configuration

### Global Settings
Navigate to **Settings → VS Code Block** to configure:
- Default programming language
- Default display options (line numbers, copy button, etc.)
- Custom CSS for advanced styling
- Lazy loading preferences

### Per-Block Settings
Each block can be individually customized with:
- Language selection
- Filename
- Line highlighting
- Display toggles
- Collapsible options

## 🎨 Supported Languages

The plugin supports 150+ languages including:

**Popular Languages:**
JavaScript, TypeScript, Python, Java, C#, C++, C, PHP, Ruby, Go, Rust, Swift, Kotlin

**Web Technologies:**
HTML, CSS, SCSS, LESS, JSX, TSX, Vue, React, Angular, Svelte

**Data & Config:**
JSON, XML, YAML, TOML, INI, Markdown

**Databases:**
SQL, PostgreSQL, MySQL, MongoDB

**DevOps:**
Dockerfile, Bash, PowerShell, Shell, Terraform, Kubernetes

**And many more...**

[View full language list](https://prismjs.com/#supported-languages)

## 🛠️ Advanced Features

### Custom Styling
Add custom CSS through the settings page:
```css
.wp-vscode-container {
    --vscode-bg: #1e1e1e;
    --accent-blue: #007acc;
}
```

### API for Developers
```javascript
// Manually initialize blocks
VSCodeBlocks.init();

// Refresh all blocks
VSCodeBlocks.refresh();

// Initialize specific block
VSCodeBlocks.initBlock(element);
```

### Hooks and Filters
```php
// Modify supported languages
add_filter('vscb_languages', function($languages) {
    $languages['custom'] = 'Custom Language';
    return $languages;
});

// Customize block output
add_filter('vscb_block_output', function($output, $attributes) {
    // Modify output
    return $output;
}, 10, 2);
```

## 🎯 Use Cases

- **Technical Blogs**: Share code snippets with professional presentation
- **Documentation Sites**: Display code examples with syntax highlighting
- **Educational Content**: Teach programming with clear, readable code blocks
- **Portfolio Sites**: Showcase code projects with style
- **Developer Communities**: Share code in forums and discussions

## 📋 Requirements

- WordPress 6.0 or higher
- PHP 7.0 or higher
- Modern browser with JavaScript enabled

## 🤝 Compatibility

- ✅ Gutenberg Block Editor
- ✅ Classic Editor
- ✅ Page Builders (Elementor, Divi, Beaver Builder)
- ✅ Widget Block Editor
- ✅ Full Site Editing
- ✅ Multisite Networks
- ✅ RTL Languages

## 🐛 Troubleshooting

### Code not highlighting
1. Ensure Prism.js is properly installed in `/assets/lib/prism/`
2. Check that JavaScript is enabled in your browser
3. Clear your browser cache

### Styles not loading
1. Check for plugin conflicts
2. Ensure theme compatibility
3. Try disabling other syntax highlighting plugins

### Performance issues
1. Enable lazy loading in settings
2. Limit code block size
3. Use collapsible blocks for long code

## 📝 Changelog

### Version 1.0.0
- Initial release
- Full Gutenberg block support
- Classic Editor integration
- Widget functionality
- 150+ language support
- VS Code dark theme
- All display features

## 🔒 Security

This plugin follows WordPress coding standards and security best practices:
- Sanitized inputs
- Escaped outputs
- Nonce verification
- Capability checks

## 📄 License

This plugin is licensed under the GPL v2 or later.

## 👨‍💻 Author

**Vivek Kumar**  
[GitHub Profile](https://github.com/vivek71092)

## 🙏 Credits

- [Prism.js](https://prismjs.com/) - Syntax highlighting library
- [Visual Studio Code](https://code.visualstudio.com/) - Theme inspiration
- WordPress Community - Support and feedback

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💬 Support

For support, please:
1. Check the FAQ section
2. Search existing issues
3. Create a new issue on [GitHub](https://github.com/vivek71092/vs-code-block)

## 🌟 Show Your Support

If you find this plugin helpful, please:
- ⭐ Star the repository on GitHub
- 📝 Leave a review on WordPress.org
- 🐦 Share it on social media
- ☕ Consider buying me a coffee

---

Made with ❤️ for the WordPress community
