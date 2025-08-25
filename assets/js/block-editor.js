/**
 * VS Code Block - Gutenberg Block Editor Script
 */

(function (blocks, element, blockEditor, components, i18n) {
    const el = element.createElement;
    const { registerBlockType } = blocks;
    const { PlainText, InspectorControls, BlockControls } = blockEditor;
    const { PanelBody, SelectControl, TextControl, ToggleControl, ToolbarGroup, ToolbarButton } = components;
    const { __ } = i18n;

    // Get languages from localized data
    const languages = window.vscb_data ? window.vscb_data.languages : {};

    // Convert languages object to select options
    const languageOptions = Object.keys(languages).map(key => ({
        value: key,
        label: languages[key]
    }));

    // Register the block
    registerBlockType('vs-code-block/code', {
        title: __('VS Code Block', 'vs-code-block'),
        description: __('Beautiful VS Code-themed syntax highlighting block', 'vs-code-block'),
        icon: 'editor-code',
        category: 'formatting',
        keywords: [
            __('code', 'vs-code-block'),
            __('syntax', 'vs-code-block'),
            __('highlight', 'vs-code-block'),
            __('vscode', 'vs-code-block'),
            __('programming', 'vs-code-block')
        ],
        attributes: {
            code: {
                type: 'string',
                default: ''
            },
            language: {
                type: 'string',
                default: 'javascript'
            },
            filename: {
                type: 'string',
                default: ''
            },
            showLineNumbers: {
                type: 'boolean',
                default: true
            },
            showCopyButton: {
                type: 'boolean',
                default: true
            },
            showLanguageLabel: {
                type: 'boolean',
                default: true
            },
            highlightLines: {
                type: 'string',
                default: ''
            },
            collapsible: {
                type: 'boolean',
                default: false
            },
            collapsed: {
                type: 'boolean',
                default: false
            }
        },
        example: {
            attributes: {
                code: 'function hello() {\n    console.log("Hello, World!");\n}\n\nhello();',
                language: 'javascript',
                filename: 'hello.js',
                showLineNumbers: true,
                showCopyButton: true,
                showLanguageLabel: true
            }
        },
        supports: {
            html: false,
            className: true,
            anchor: true
        },

        edit: function (props) {
            const { attributes, setAttributes, className } = props;
            const {
                code,
                language,
                filename,
                showLineNumbers,
                showCopyButton,
                showLanguageLabel,
                highlightLines,
                collapsible,
                collapsed
            } = attributes;

            // Get file extension for the current language
            const getFileExtension = (lang) => {
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
                return extensions[lang] || 'txt';
            };

            const fileExt = getFileExtension(language);
            const displayFilename = filename || `untitled.${fileExt}`;

            // Toolbar controls
            const toolbarControls = el(
                BlockControls,
                null,
                el(
                    ToolbarGroup,
                    null,
                    el(
                        ToolbarButton,
                        {
                            icon: 'editor-ul',
                            label: __('Toggle Line Numbers', 'vs-code-block'),
                            onClick: () => setAttributes({ showLineNumbers: !showLineNumbers }),
                            isActive: showLineNumbers
                        }
                    ),
                    el(
                        ToolbarButton,
                        {
                            icon: 'admin-page',
                            label: __('Toggle Copy Button', 'vs-code-block'),
                            onClick: () => setAttributes({ showCopyButton: !showCopyButton }),
                            isActive: showCopyButton
                        }
                    ),
                    el(
                        ToolbarButton,
                        {
                            icon: 'tag',
                            label: __('Toggle Language Label', 'vs-code-block'),
                            onClick: () => setAttributes({ showLanguageLabel: !showLanguageLabel }),
                            isActive: showLanguageLabel
                        }
                    )
                )
            );

            // Inspector controls (sidebar)
            const inspectorControls = el(
                InspectorControls,
                null,
                el(
                    PanelBody,
                    { title: __('Code Settings', 'vs-code-block'), initialOpen: true },
                    el(
                        SelectControl,
                        {
                            label: __('Language', 'vs-code-block'),
                            value: language,
                            options: languageOptions,
                            onChange: (value) => setAttributes({ language: value })
                        }
                    ),
                    el(
                        TextControl,
                        {
                            label: __('Filename', 'vs-code-block'),
                            value: filename,
                            placeholder: `untitled.${fileExt}`,
                            onChange: (value) => setAttributes({ filename: value })
                        }
                    ),
                    el(
                        TextControl,
                        {
                            label: __('Highlight Lines', 'vs-code-block'),
                            value: highlightLines,
                            placeholder: __('e.g., 1,3-5,8', 'vs-code-block'),
                            help: __('Comma-separated line numbers or ranges', 'vs-code-block'),
                            onChange: (value) => setAttributes({ highlightLines: value })
                        }
                    )
                ),
                el(
                    PanelBody,
                    { title: __('Display Options', 'vs-code-block'), initialOpen: false },
                    el(
                        ToggleControl,
                        {
                            label: __('Show Line Numbers', 'vs-code-block'),
                            checked: showLineNumbers,
                            onChange: (value) => setAttributes({ showLineNumbers: value })
                        }
                    ),
                    el(
                        ToggleControl,
                        {
                            label: __('Show Copy Button', 'vs-code-block'),
                            checked: showCopyButton,
                            onChange: (value) => setAttributes({ showCopyButton: value })
                        }
                    ),
                    el(
                        ToggleControl,
                        {
                            label: __('Show Language Label', 'vs-code-block'),
                            checked: showLanguageLabel,
                            onChange: (value) => setAttributes({ showLanguageLabel: value })
                        }
                    ),
                    el(
                        ToggleControl,
                        {
                            label: __('Make Collapsible', 'vs-code-block'),
                            checked: collapsible,
                            onChange: (value) => setAttributes({ collapsible: value })
                        }
                    ),
                    collapsible && el(
                        ToggleControl,
                        {
                            label: __('Start Collapsed', 'vs-code-block'),
                            checked: collapsed,
                            onChange: (value) => setAttributes({ collapsed: value })
                        }
                    )
                )
            );

            // Calculate line numbers
            const lineCount = code ? code.split('\n').length : 1;
            const lineNumbers = [];
            for (let i = 1; i <= lineCount; i++) {
                lineNumbers.push(el('div', { key: i, className: 'line-number' }, i));
            }

            // Editor preview
            const editorPreview = el(
                'div',
                { className: 'wp-vscode-container editor-preview' },
                el(
                    'div',
                    { className: 'vscode-container' },
                    // Title Bar
                    el(
                        'div',
                        { className: 'title-bar' },
                        el(
                            'div',
                            { className: 'traffic-lights' },
                            el('div', { className: 'traffic-light close' }),
                            el('div', { className: 'traffic-light minimize' }),
                            el('div', { className: 'traffic-light maximize' })
                        ),
                        el('div', { className: 'title-text' }, 'Visual Studio Code')
                    ),
                    // Tab Bar
                    el(
                        'div',
                        { className: 'tab-bar' },
                        el(
                            'div',
                            { className: 'tab' },
                            el(
                                'div',
                                { className: 'file-icon' },
                                fileExt.substring(0, 2).toUpperCase()
                            ),
                            el('span', null, displayFilename)
                        ),
                        showLanguageLabel && el(
                            'div',
                            { className: 'lang-indicator' },
                            language.toUpperCase()
                        )
                    ),
                    // Code Content
                    el(
                        'div',
                        { className: 'code-content' },
                        showCopyButton && el(
                            'button',
                            { 
                                className: 'copy-button',
                                disabled: true
                            },
                            el('span', { className: 'copy-icon' }, '📋'),
                            el('span', { className: 'copy-text' }, __('Copy', 'vs-code-block'))
                        ),
                        showLineNumbers && el(
                            'div',
                            { className: 'line-numbers-wrapper' },
                            lineNumbers
                        ),
                        el(
                            PlainText,
                            {
                                className: 'code-editor-textarea',
                                value: code,
                                onChange: (value) => setAttributes({ code: value }),
                                placeholder: __('Enter your code here...', 'vs-code-block'),
                                'aria-label': __('Code', 'vs-code-block')
                            }
                        )
                    )
                )
            );

            return el(
                'div',
                { className: className },
                toolbarControls,
                inspectorControls,
                editorPreview
            );
        },

        save: function () {
            // Server-side rendering
            return null;
        }
    });

    // Add format type for inline code
    const { registerFormatType, toggleFormat } = wp.richText;
    const { RichTextToolbarButton } = blockEditor;

    registerFormatType('vs-code-block/inline-code', {
        title: __('Inline Code', 'vs-code-block'),
        tagName: 'code',
        className: 'vscb-inline-code',
        edit: ({ isActive, value, onChange }) => {
            return el(
                RichTextToolbarButton,
                {
                    icon: 'editor-code',
                    title: __('Inline Code', 'vs-code-block'),
                    onClick: () => {
                        onChange(toggleFormat(value, { type: 'vs-code-block/inline-code' }));
                    },
                    isActive: isActive
                }
            );
        }
    });

    // Add custom block styles
    const customStyles = `
        .wp-block-vs-code-block-code .code-editor-textarea {
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            background: #212121;
            color: #ffffff;
            border: none;
            outline: none;
            resize: none;
            padding: 20px;
            padding-left: ${showLineNumbers ? '60px' : '20px'};
            width: 100%;
            min-height: 200px;
            line-height: 1.6;
            font-size: 16px;
        }
        
        .wp-block-vs-code-block-code .editor-preview {
            margin: 0;
        }
        
        .wp-block-vs-code-block-code .line-numbers-wrapper {
            position: absolute;
            left: 0;
            top: 20px;
            width: 50px;
            text-align: right;
            padding-right: 15px;
            user-select: none;
            color: #858585;
            font-size: 16px;
            line-height: 1.6;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
        }
        
        .vscb-inline-code {
            background: #2d2d2d;
            color: #ce9178;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            font-size: 0.9em;
        }
    `;

    // Inject custom styles
    if (!document.getElementById('vscb-editor-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'vscb-editor-styles';
        styleElement.textContent = customStyles;
        document.head.appendChild(styleElement);
    }

})(
    window.wp.blocks,
    window.wp.element,
    window.wp.blockEditor,
    window.wp.components,
    window.wp.i18n
);