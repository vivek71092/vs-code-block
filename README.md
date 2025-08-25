=== VS Code Block - Syntax Highlighter ===
Contributors: vivek71092
Donate link: https://github.com/vivek71092
Tags: syntax highlighting, code block, vscode, code editor, gutenberg
Requires at least: 6.0
Tested up to: 6.8
Stable tag: 1.0.0
Requires PHP: 7.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Beautiful VS Code-themed syntax highlighting for WordPress with support for 150+ programming languages. Perfect for developers, educators, and technical bloggers.

== Description ==

Transform your code blocks into beautiful, VS Code-themed snippets with **VS Code Block - Syntax Highlighter**. This plugin brings the familiar and loved Visual Studio Code dark theme to your WordPress site, making code snippets both beautiful and readable.

= 🎯 Key Features =

* **Authentic VS Code Dark Theme** - Exact replica of Visual Studio Code's popular dark theme
* **150+ Programming Languages** - Comprehensive syntax highlighting for all major languages
* **Multiple Integration Methods** - Works with Gutenberg, Classic Editor, widgets, and shortcodes
* **Performance Optimized** - Loads assets only where needed with lazy loading support
* **Fully Responsive** - Perfect display on all devices and screen sizes

= 📦 Display Features =

* Line numbers with toggle control
* One-click copy to clipboard button
* Language labels and indicators
* Highlight specific lines
* Filename display with icons
* Collapsible/expandable code blocks
* Fullscreen view mode
* Search within code blocks
* Custom scrollbar styling
* Command line prompt support
* Diff highlighting for code changes
* Inline code highlighting

= 🚀 Easy to Use =

**Gutenberg Block Editor:**
Simply add the "VS Code Block" from the block inserter and paste your code. Configure settings in the sidebar.

**Classic Editor:**
Click the VS Code button in the toolbar or use keyboard shortcut Ctrl+Shift+C.

**Shortcode:**
`[vscode language="javascript"]console.log("Hello World!");[/vscode]`

**Widget:**
Add the VS Code Block widget to any widget area for code in sidebars or footers.

= 🎨 Supported Languages =

Popular languages include:
JavaScript, TypeScript, Python, Java, C#, C++, PHP, Ruby, Go, Rust, Swift, Kotlin, HTML, CSS, SCSS, React, Vue, Angular, SQL, Bash, PowerShell, JSON, XML, YAML, Markdown, and 130+ more!

= ⚡ Performance Features =

* Lazy loading for better page speed
* Assets loaded only when code blocks are present
* Optimized for Core Web Vitals
* Lightweight and fast
* No jQuery dependency

= 🔧 Developer Friendly =

* Clean, well-documented code
* Hooks and filters for customization
* WordPress coding standards compliant
* Translation ready
* Multisite compatible
* RTL language support

= 📱 Full Compatibility =

* WordPress 6.0+
* Gutenberg Block Editor
* Classic Editor
* All major page builders (Elementor, Divi, Beaver Builder)
* All modern browsers
* Mobile responsive

== Installation ==

= Automatic Installation =

1. Go to your WordPress admin panel
2. Navigate to Plugins → Add New
3. Search for "VS Code Block"
4. Click "Install Now" and then "Activate"

= Manual Installation =

1. Download the plugin zip file
2. Go to WordPress admin → Plugins → Add New
3. Click "Upload Plugin" and select the downloaded file
4. Click "Install Now" and activate the plugin

= Additional Setup =

After activation:
1. Download Prism.js from https://prismjs.com/download.html with your desired languages
2. Place the prism.js file in the plugin's `/assets/lib/prism/` directory
3. Configure default settings in Settings → VS Code Block

== Frequently Asked Questions ==

= How do I add a code block? =

In Gutenberg, search for "VS Code Block" in the block inserter. In Classic Editor, click the VS Code button in the toolbar. You can also use the [vscode] shortcode anywhere.

= Can I change the theme colors? =

Yes! You can add custom CSS in the plugin settings to override the default VS Code dark theme colors.

= Which programming languages are supported? =

The plugin supports 150+ languages including all popular programming languages, markup languages, configuration files, and more. Full list available at https://prismjs.com/#supported-languages

= How do I highlight specific lines? =

Use the "Highlight Lines" field in the block settings. Enter comma-separated line numbers or ranges like "1,3-5,8".

= Is the plugin compatible with page builders? =

Yes! The plugin works with all major page builders including Elementor, Divi, Beaver Builder, and others through shortcode support.

= Can I use this in widgets? =

Yes! The plugin includes a dedicated widget for adding code blocks to any widget area.

= Does it work with multisite? =

Yes, the plugin is fully compatible with WordPress Multisite networks.

= How do I add a filename to the code block? =

In the block settings, use the "Filename" field. For shortcodes, add the filename parameter: `[vscode filename="script.js"]`

= Is lazy loading supported? =

Yes! Enable lazy loading in Settings → VS Code Block to improve page load performance.

= Can I disable line numbers? =

Yes, you can toggle line numbers on/off for each block individually or set a global default in the plugin settings.

== Screenshots ==

1. VS Code Block in Gutenberg Editor with sidebar settings
2. Beautiful VS Code dark theme display on frontend
3. Classic Editor integration with popup dialog
4. Multiple language syntax highlighting examples
5. Plugin settings page
6. Widget configuration in customizer
7. Collapsible code block with line highlighting
8. Mobile responsive display
9. Fullscreen mode for better code reading
10. Search functionality within code blocks

== Changelog ==

= 1.0.0 =
* Initial release
* Full Gutenberg block support with live preview
* Classic Editor integration via TinyMCE plugin
* Widget functionality for sidebars
* Shortcode support for flexibility
* 150+ programming language support
* VS Code dark theme implementation
* Line numbers with toggle
* Copy button functionality
* Language label display
* Line highlighting feature
* Filename display
* Collapsible blocks
* Fullscreen mode
* Search within code
* Custom scrollbar styling
* Lazy loading support
* Settings page for global configuration
* Translation ready
* RTL support

== Upgrade Notice ==

= 1.0.0 =
Initial release of VS Code Block - Syntax Highlighter. Brings beautiful VS Code-themed syntax highlighting to WordPress.

== Additional Information ==

= Requirements =

* WordPress 6.0 or higher
* PHP 7.0 or higher
* Modern browser with JavaScript enabled
* Prism.js library (instructions provided)

= Privacy Policy =

This plugin does not collect any personal data. All settings are stored locally in your WordPress database.

= Support =

For support, please visit the plugin support forum or create an issue on GitHub at https://github.com/vivek71092/vs-code-block

= Credits =

* Prism.js - Syntax highlighting library
* Visual Studio Code - Theme inspiration
* WordPress Community - Feedback and support

== License ==

This plugin is licensed under the GPLv2 or later.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
