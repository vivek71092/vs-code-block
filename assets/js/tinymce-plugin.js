    /**
 * VS Code Block - TinyMCE Plugin for Classic Editor
 * Adds VS Code block functionality to the Classic Editor
 */

(function() {
    'use strict';

    tinymce.PluginManager.add('vscode_block', function(editor, url) {
        
        // Available languages (should match main plugin)
        const languages = {
            'bap': 'BAP',
            'actionscript': 'ActionScript 3',
            'ada': 'Ada',
            'apache': 'Apache',
            'apex': 'Apex',
            'apl': 'APL',
            'asm': 'ASM',
            'astro': 'Astro',
            'awk': 'Awk',
            'ballerina': 'Ballerina',
            'batch': 'BAT',
            'berry': 'Berry',
            'c': 'C',
            'clojure': 'Clojure',
            'cmake': 'CMake',
            'cobol': 'COBOL',
            'coffeescript': 'CoffeeScript',
            'cpp': 'C++',
            'crystal': 'Crystal',
            'csharp': 'C#',
            'css': 'CSS',
            'dart': 'Dart',
            'diff': 'Diff',
            'dockerfile': 'Dockerfile',
            'elixir': 'Elixir',
            'elm': 'Elm',
            'erlang': 'Erlang',
            'fsharp': 'F#',
            'go': 'Go',
            'graphql': 'GraphQL',
            'groovy': 'Groovy',
            'haskell': 'Haskell',
            'html': 'HTML',
            'java': 'Java',
            'javascript': 'JavaScript',
            'json': 'JSON',
            'jsx': 'JSX',
            'julia': 'Julia',
            'kotlin': 'Kotlin',
            'latex': 'LaTeX',
            'less': 'LESS',
            'liquid': 'Liquid',
            'lisp': 'Lisp',
            'lua': 'Lua',
            'makefile': 'Makefile',
            'markdown': 'Markdown',
            'matlab': 'MATLAB',
            'nginx': 'Nginx',
            'objectivec': 'Objective-C',
            'ocaml': 'OCaml',
            'pascal': 'Pascal',
            'perl': 'Perl',
            'php': 'PHP',
            'plsql': 'PLSQL',
            'powershell': 'PowerShell',
            'prolog': 'Prolog',
            'pug': 'Pug',
            'python': 'Python',
            'r': 'R',
            'ruby': 'Ruby',
            'rust': 'Rust',
            'sass': 'Sass',
            'scala': 'Scala',
            'scheme': 'Scheme',
            'scss': 'SCSS',
            'bash': 'Bash',
            'shell': 'ShellScript',
            'solidity': 'Solidity',
            'sql': 'SQL',
            'swift': 'Swift',
            'typescript': 'TypeScript',
            'vb': 'VB',
            'verilog': 'Verilog',
            'vhdl': 'VHDL',
            'vue': 'Vue',
            'xml': 'XML',
            'yaml': 'YAML',
            'zig': 'Zig'
        };

        // Add button to toolbar
        editor.addButton('vscode_block', {
            title: 'VS Code Block',
            icon: 'code',
            onclick: function() {
                openDialog();
            }
        });

        // Add menu item
        editor.addMenuItem('vscode_block', {
            text: 'VS Code Block',
            icon: 'code',
            context: 'insert',
            onclick: function() {
                openDialog();
            }
        });

        // Register command
        editor.addCommand('mceVSCodeBlock', function() {
            openDialog();
        });

        // Keyboard shortcut (Ctrl+Shift+C)
        editor.addShortcut('ctrl+shift+c', 'Insert VS Code Block', 'mceVSCodeBlock');

        // Context menu on right-click
        editor.on('contextmenu', function(e) {
            const node = editor.selection.getNode();
            if (node && node.className && node.className.indexOf('vscode-shortcode-wrapper') > -1) {
                e.preventDefault();
                editor.plugins.contextmenu.showMenu(e.clientX, e.clientY, [
                    {
                        text: 'Edit VS Code Block',
                        onclick: function() {
                            editExistingBlock(node);
                        }
                    },
                    {
                        text: 'Remove VS Code Block',
                        onclick: function() {
                            editor.dom.remove(node);
                        }
                    }
                ]);
            }
        });

        /**
         * Open the VS Code Block dialog
         */
        function openDialog(existingData) {
            const data = existingData || {
                code: '',
                language: 'javascript',
                filename: '',
                showLineNumbers: true,
                showCopyButton: true,
                showLanguageLabel: true,
                highlightLines: '',
                collapsible: false
            };

            // Build language options for select
            const languageOptions = [];
            for (let key in languages) {
                languageOptions.push({
                    text: languages[key],
                    value: key
                });
            }

            editor.windowManager.open({
                title: 'Insert VS Code Block',
                minWidth: 600,
                minHeight: 500,
                body: [
                    {
                        type: 'textbox',
                        name: 'code',
                        label: 'Code',
                        multiline: true,
                        minHeight: 300,
                        value: data.code,
                        style: 'font-family: monospace; font-size: 13px;'
                    },
                    {
                        type: 'listbox',
                        name: 'language',
                        label: 'Language',
                        values: languageOptions,
                        value: data.language
                    },
                    {
                        type: 'textbox',
                        name: 'filename',
                        label: 'Filename (optional)',
                        value: data.filename,
                        placeholder: 'e.g., script.js'
                    },
                    {
                        type: 'textbox',
                        name: 'highlightLines',
                        label: 'Highlight Lines',
                        value: data.highlightLines,
                        tooltip: 'Comma-separated line numbers or ranges (e.g., 1,3-5,8)'
                    },
                    {
                        type: 'checkbox',
                        name: 'showLineNumbers',
                        label: 'Show Line Numbers',
                        checked: data.showLineNumbers
                    },
                    {
                        type: 'checkbox',
                        name: 'showCopyButton',
                        label: 'Show Copy Button',
                        checked: data.showCopyButton
                    },
                    {
                        type: 'checkbox',
                        name: 'showLanguageLabel',
                        label: 'Show Language Label',
                        checked: data.showLanguageLabel
                    },
                    {
                        type: 'checkbox',
                        name: 'collapsible',
                        label: 'Make Collapsible',
                        checked: data.collapsible
                    }
                ],
                onsubmit: function(e) {
                    insertVSCodeBlock(e.data);
                }
            });
        }

        /**
         * Insert VS Code Block into editor
         */
        function insertVSCodeBlock(data) {
            if (!data.code) {
                editor.windowManager.alert('Please enter some code');
                return;
            }

            // Build shortcode
            let shortcode = '[vscode';
            
            // Add attributes
            shortcode += ' language="' + data.language + '"';
            
            if (data.filename) {
                shortcode += ' filename="' + data.filename + '"';
            }
            
            shortcode += ' lines="' + (data.showLineNumbers ? 'true' : 'false') + '"';
            shortcode += ' copy="' + (data.showCopyButton ? 'true' : 'false') + '"';
            shortcode += ' label="' + (data.showLanguageLabel ? 'true' : 'false') + '"';
            
            if (data.highlightLines) {
                shortcode += ' highlight="' + data.highlightLines + '"';
            }
            
            if (data.collapsible) {
                shortcode += ' collapsible="true"';
            }
            
            shortcode += ']';
            shortcode += escapeHtml(data.code);
            shortcode += '[/vscode]';

            // Create a preview wrapper
            const preview = createPreview(data);
            
            // Insert into editor
            editor.insertContent(preview + shortcode);
        }

        /**
         * Create preview HTML for the editor
         */
        function createPreview(data) {
            const fileExt = getFileExtension(data.language);
            const filename = data.filename || 'untitled.' + fileExt;
            const langLabel = languages[data.language] || data.language.toUpperCase();
            
            // Escape the code for display
            const escapedCode = escapeHtml(data.code);
            const lines = escapedCode.split('\n');
            
            let lineNumbersHtml = '';
            if (data.showLineNumbers) {
                for (let i = 1; i <= lines.length; i++) {
                    lineNumbersHtml += '<div class="line-number">' + i + '</div>';
                }
            }

            return `
                <div class="vscode-shortcode-wrapper mceNonEditable" contenteditable="false" style="margin: 20px 0;">
                    <div style="background: #212121; color: #fff; border-radius: 8px; overflow: hidden; font-family: monospace; box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
                        <div style="background: #2d2d2d; padding: 8px 15px; border-bottom: 1px solid #555; display: flex; align-items: center;">
                            <span style="display: inline-flex; gap: 8px; margin-right: 15px;">
                                <span style="width: 12px; height: 12px; background: #ff5f57; border-radius: 50%; display: inline-block;"></span>
                                <span style="width: 12px; height: 12px; background: #ffbd2e; border-radius: 50%; display: inline-block;"></span>
                                <span style="width: 12px; height: 12px; background: #28ca42; border-radius: 50%; display: inline-block;"></span>
                            </span>
                            <span style="color: #ccc; font-size: 13px;">Visual Studio Code</span>
                        </div>
                        <div style="background: #3c3c3c; padding: 8px 15px; border-bottom: 1px solid #555; display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="background: #5599ff; color: #212121; padding: 2px 4px; border-radius: 2px; font-size: 10px; font-weight: bold;">
                                    ${fileExt.substring(0, 2).toUpperCase()}
                                </span>
                                <span style="color: #fff; font-size: 13px;">${filename}</span>
                            </div>
                            ${data.showLanguageLabel ? `<span style="background: #2d2d2d; color: #5599ff; padding: 4px 8px; border-radius: 3px; font-size: 11px;">${langLabel}</span>` : ''}
                        </div>
                        <div style="position: relative; padding: 20px; max-height: 400px; overflow: auto;">
                            ${data.showLineNumbers ? `
                                <div style="position: absolute; left: 0; top: 20px; width: 40px; text-align: right; padding-right: 10px; color: #858585; font-size: 14px; line-height: 1.6;">
                                    ${lineNumbersHtml}
                                </div>
                            ` : ''}
                            <pre style="margin: 0; padding: 0 0 0 ${data.showLineNumbers ? '45px' : '0'}; color: #fff; font-size: 14px; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word;">
${escapedCode}
                            </pre>
                        </div>
                    </div>
                </div>
            `;
        }

        /**
         * Edit existing VS Code block
         */
        function editExistingBlock(node) {
            // Find the shortcode after the preview
            const content = node.nextSibling ? node.nextSibling.textContent : '';
            const match = content.match(/\[vscode([^\]]*)\]([\s\S]*?)\[\/vscode\]/);
            
            if (match) {
                const attributes = match[1];
                const code = match[2];
                
                // Parse attributes
                const data = {
                    code: unescapeHtml(code),
                    language: extractAttribute(attributes, 'language') || 'javascript',
                    filename: extractAttribute(attributes, 'filename') || '',
                    showLineNumbers: extractAttribute(attributes, 'lines') !== 'false',
                    showCopyButton: extractAttribute(attributes, 'copy') !== 'false',
                    showLanguageLabel: extractAttribute(attributes, 'label') !== 'false',
                    highlightLines: extractAttribute(attributes, 'highlight') || '',
                    collapsible: extractAttribute(attributes, 'collapsible') === 'true'
                };
                
                // Remove old block
                editor.dom.remove(node);
                if (node.nextSibling) {
                    editor.dom.remove(node.nextSibling);
                }
                
                // Open dialog with existing data
                openDialog(data);
            }
        }

        /**
         * Extract attribute value from shortcode attributes string
         */
        function extractAttribute(attributesString, attributeName) {
            const regex = new RegExp(attributeName + '=["\']([^"\']+)["\']');
            const match = attributesString.match(regex);
            return match ? match[1] : null;
        }

        /**
         * Get file extension for language
         */
        function getFileExtension(language) {
            const extensions = {
                'javascript': 'js',
                'typescript': 'ts',
                'python': 'py',
                'java': 'java',
                'csharp': 'cs',
                'cpp': 'cpp',
                'c': 'c',
                'php': 'php',
                'ruby': 'rb',
                'go': 'go',
                'rust': 'rs',
                'swift': 'swift',
                'kotlin': 'kt',
                'html': 'html',
                'css': 'css',
                'scss': 'scss',
                'sql': 'sql',
                'bash': 'sh',
                'powershell': 'ps1',
                'json': 'json',
                'xml': 'xml',
                'yaml': 'yaml',
                'markdown': 'md'
            };
            return extensions[language] || 'txt';
        }

        /**
         * Escape HTML special characters
         */
        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        }

        /**
         * Unescape HTML special characters
         */
        function unescapeHtml(text) {
            const map = {
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                '&#039;': "'"
            };
            return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) { return map[m]; });
        }

        // Handle the shortcode rendering in visual mode
        editor.on('BeforeSetContent', function(e) {
            if (e.content && e.content.indexOf('[vscode') !== -1) {
                e.content = e.content.replace(/\[vscode([^\]]*)\]([\s\S]*?)\[\/vscode\]/g, function(match, attributes, code) {
                    const data = {
                        code: unescapeHtml(code),
                        language: extractAttribute(attributes, 'language') || 'javascript',
                        filename: extractAttribute(attributes, 'filename') || '',
                        showLineNumbers: extractAttribute(attributes, 'lines') !== 'false',
                        showCopyButton: extractAttribute(attributes, 'copy') !== 'false',
                        showLanguageLabel: extractAttribute(attributes, 'label') !== 'false',
                        highlightLines: extractAttribute(attributes, 'highlight') || '',
                        collapsible: extractAttribute(attributes, 'collapsible') === 'true'
                    };
                    return createPreview(data) + match;
                });
            }
        });

        // Clean up the preview divs when getting content
        editor.on('GetContent', function(e) {
            if (e.content) {
                // Remove preview wrappers, keep only shortcodes
                const temp = document.createElement('div');
                temp.innerHTML = e.content;
                
                const previews = temp.querySelectorAll('.vscode-shortcode-wrapper');
                previews.forEach(function(preview) {
                    preview.parentNode.removeChild(preview);
                });
                
                e.content = temp.innerHTML;
            }
        });

        // Add custom CSS to editor
        const css = `
            .mce-content-body .vscode-shortcode-wrapper {
                margin: 20px 0;
                position: relative;
            }
            .mce-content-body .vscode-shortcode-wrapper:hover {
                outline: 2px solid #0073aa;
                outline-offset: 2px;
            }
            .mce-content-body .vscode-shortcode-wrapper::before {
                content: "VS Code Block (click to edit)";
                position: absolute;
                top: -20px;
                left: 0;
                background: #0073aa;
                color: white;
                padding: 2px 8px;
                font-size: 11px;
                border-radius: 3px;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
            }
            .mce-content-body .vscode-shortcode-wrapper:hover::before {
                opacity: 1;
            }
        `;

        // Add styles to editor
        if (editor.contentStyles) {
            editor.contentStyles.push(css);
        } else {
            editor.on('init', function() {
                const doc = editor.getDoc();
                const style = doc.createElement('style');
                style.type = 'text/css';
                style.innerHTML = css;
                doc.getElementsByTagName('head')[0].appendChild(style);
            });
        }
    });
})();