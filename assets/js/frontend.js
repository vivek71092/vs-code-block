/**
 * VS Code Block - Frontend JavaScript
 * Handles interactive features like copy button, search, collapsible blocks, etc.
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVSCodeBlocks);
    } else {
        initVSCodeBlocks();
    }

    function initVSCodeBlocks() {
        // Initialize all VS Code blocks on the page
        const blocks = document.querySelectorAll('.wp-vscode-container');
        blocks.forEach(initBlock);

        // Initialize lazy loading if enabled
        if (typeof IntersectionObserver !== 'undefined') {
            initLazyLoading();
        }
    }

    function initBlock(container) {
        // Initialize Prism.js syntax highlighting
        initSyntaxHighlighting(container);

        // Initialize line numbers
        initLineNumbers(container);

        // Initialize copy button
        initCopyButton(container);

        // Initialize collapsible functionality
        initCollapsible(container);

        // Initialize fullscreen button
        initFullscreen(container);

        // Initialize search functionality
        initSearch(container);

        // Initialize line highlighting
        initLineHighlighting(container);

        // Initialize command line prompt
        initCommandLine(container);
    }

    /**
     * Initialize syntax highlighting with Prism.js
     */
    function initSyntaxHighlighting(container) {
        const codeElement = container.querySelector('pre code');
        if (!codeElement) return;

        // Check if Prism is loaded
        if (typeof Prism !== 'undefined') {
            // Ensure language class is set
            const language = container.dataset.language || 'javascript';
            codeElement.className = 'language-' + language;

            // Highlight the code
            Prism.highlightElement(codeElement);
        }
    }

    /**
     * Initialize line numbers
     */
    function initLineNumbers(container) {
        const wrapper = container.querySelector('.line-numbers-wrapper');
        const codeElement = container.querySelector('pre code');
        
        if (!wrapper || !codeElement) return;

        // Clear existing line numbers
        wrapper.innerHTML = '';

        // Get the code text and count lines
        const code = codeElement.textContent || '';
        const lines = code.split('\n');
        const lineCount = lines.length;

        // Add line numbers
        for (let i = 1; i <= lineCount; i++) {
            const lineNumber = document.createElement('div');
            lineNumber.className = 'line-number';
            lineNumber.textContent = i;
            wrapper.appendChild(lineNumber);
        }

        // Add class to container for styling
        container.classList.add('has-line-numbers');
    }

    /**
     * Initialize copy button functionality
     */
    function initCopyButton(container) {
        const copyButton = container.querySelector('.copy-button');
        if (!copyButton) return;

        copyButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const codeElement = container.querySelector('pre code');
            if (!codeElement) return;

            // Get the plain text code
            const code = codeElement.textContent || '';

            // Copy to clipboard
            copyToClipboard(code).then(() => {
                // Success feedback
                copyButton.classList.add('copied');
                const copyText = copyButton.querySelector('.copy-text');
                const copyIcon = copyButton.querySelector('.copy-icon');
                
                if (copyText) {
                    const originalText = copyText.textContent;
                    copyText.textContent = 'Copied!';
                    
                    if (copyIcon) {
                        const originalIcon = copyIcon.textContent;
                        copyIcon.textContent = '✓';
                        
                        // Reset after 2 seconds
                        setTimeout(() => {
                            copyButton.classList.remove('copied');
                            copyText.textContent = originalText;
                            copyIcon.textContent = originalIcon;
                        }, 2000);
                    }
                }
            }).catch(err => {
                console.error('Failed to copy code:', err);
                alert('Failed to copy code. Please select and copy manually.');
            });
        });
    }

    /**
     * Copy text to clipboard
     */
    function copyToClipboard(text) {
        // Modern approach using Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        
        // Fallback for older browsers
        return new Promise((resolve, reject) => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            
            try {
                textarea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);
                
                if (success) {
                    resolve();
                } else {
                    reject(new Error('Copy command failed'));
                }
            } catch (err) {
                document.body.removeChild(textarea);
                reject(err);
            }
        });
    }

    /**
     * Initialize collapsible functionality
     */
    function initCollapsible(container) {
        const collapseButton = container.querySelector('.collapse-button');
        const codeContent = container.querySelector('.code-content');
        
        if (!collapseButton || !codeContent) {
            // Create collapse button if container is marked as collapsible
            if (codeContent && codeContent.classList.contains('collapsible')) {
                createCollapseButton(container);
            }
            return;
        }

        collapseButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const isCollapsed = codeContent.classList.toggle('collapsed');
            const icon = collapseButton.querySelector('.collapse-icon');
            
            if (icon) {
                icon.style.transform = isCollapsed ? 'rotate(-90deg)' : 'rotate(0)';
            }
            
            // Update aria-expanded
            collapseButton.setAttribute('aria-expanded', !isCollapsed);
        });
    }

    /**
     * Create collapse button dynamically
     */
    function createCollapseButton(container) {
        const codeContent = container.querySelector('.code-content');
        if (!codeContent) return;

        const button = document.createElement('button');
        button.className = 'collapse-button';
        button.setAttribute('aria-label', 'Toggle code visibility');
        button.setAttribute('aria-expanded', !codeContent.classList.contains('collapsed'));
        
        const icon = document.createElement('span');
        icon.className = 'collapse-icon';
        icon.textContent = '▼';
        icon.style.display = 'inline-block';
        icon.style.transition = 'transform 0.3s ease';
        
        if (codeContent.classList.contains('collapsed')) {
            icon.style.transform = 'rotate(-90deg)';
        }
        
        button.appendChild(icon);
        codeContent.appendChild(button);
        
        // Initialize the event listener
        initCollapsible(container);
    }

    /**
     * Initialize fullscreen functionality
     */
    function initFullscreen(container) {
        // Check if fullscreen button exists or create it
        let fullscreenButton = container.querySelector('.fullscreen-button');
        
        if (!fullscreenButton) {
            // Create fullscreen button
            fullscreenButton = document.createElement('button');
            fullscreenButton.className = 'fullscreen-button';
            fullscreenButton.setAttribute('aria-label', 'Toggle fullscreen');
            fullscreenButton.innerHTML = '<span class="fullscreen-icon">⛶</span>';
            
            const codeContent = container.querySelector('.code-content');
            if (codeContent) {
                codeContent.appendChild(fullscreenButton);
            }
        }

        fullscreenButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const isFullscreen = container.classList.toggle('fullscreen');
            
            if (isFullscreen) {
                // Add ESC key listener
                document.addEventListener('keydown', handleEscKey);
                fullscreenButton.innerHTML = '<span class="fullscreen-icon">✕</span>';
                
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
            } else {
                // Remove ESC key listener
                document.removeEventListener('keydown', handleEscKey);
                fullscreenButton.innerHTML = '<span class="fullscreen-icon">⛶</span>';
                
                // Restore body scroll
                document.body.style.overflow = '';
            }
            
            function handleEscKey(event) {
                if (event.key === 'Escape') {
                    container.classList.remove('fullscreen');
                    document.removeEventListener('keydown', handleEscKey);
                    fullscreenButton.innerHTML = '<span class="fullscreen-icon">⛶</span>';
                    document.body.style.overflow = '';
                }
            }
        });
    }

    /**
     * Initialize search functionality
     */
    function initSearch(container) {
        const codeContent = container.querySelector('.code-content');
        if (!codeContent) return;

        // Create search box if it doesn't exist
        let searchBox = container.querySelector('.search-box');
        if (!searchBox) {
            searchBox = createSearchBox();
            codeContent.appendChild(searchBox);
        }

        // Create search button
        const searchButton = document.createElement('button');
        searchButton.className = 'search-button';
        searchButton.setAttribute('aria-label', 'Search in code');
        searchButton.innerHTML = '<span class="search-icon">🔍</span>';
        searchButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: ${container.querySelector('.fullscreen-button') ? '190px' : '100px'};
            background: var(--vscode-sidebar);
            border: 1px solid var(--vscode-border);
            color: var(--vscode-text);
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 10;
        `;
        codeContent.appendChild(searchButton);

        // Toggle search box
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            searchBox.classList.toggle('active');
            
            if (searchBox.classList.contains('active')) {
                const searchInput = searchBox.querySelector('.search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            } else {
                clearSearchHighlights(container);
            }
        });

        // Handle search input
        const searchInput = searchBox.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function(e) {
                const searchTerm = e.target.value;
                performSearch(container, searchTerm);
            }, 300));

            // Handle ESC key in search
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    searchBox.classList.remove('active');
                    clearSearchHighlights(container);
                }
            });
        }
    }

    /**
     * Create search box element
     */
    function createSearchBox() {
        const searchBox = document.createElement('div');
        searchBox.className = 'search-box';
        searchBox.innerHTML = `
            <input type="text" class="search-input" placeholder="Search..." aria-label="Search in code">
            <span class="search-count"></span>
        `;
        return searchBox;
    }

    /**
     * Perform search in code
     */
    function performSearch(container, searchTerm) {
        clearSearchHighlights(container);
        
        if (!searchTerm || searchTerm.length < 2) return;

        const codeElement = container.querySelector('pre code');
        if (!codeElement) return;

        const content = codeElement.innerHTML;
        const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
        let matches = 0;

        // Highlight matches
        const highlighted = content.replace(regex, function(match) {
            matches++;
            return `<span class="search-highlight">${match}</span>`;
        });

        if (matches > 0) {
            codeElement.innerHTML = highlighted;
            
            // Update search count
            const searchCount = container.querySelector('.search-count');
            if (searchCount) {
                searchCount.textContent = `${matches} match${matches !== 1 ? 'es' : ''}`;
            }

            // Highlight first match as current
            const firstMatch = container.querySelector('.search-highlight');
            if (firstMatch) {
                firstMatch.classList.add('current');
                firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    /**
     * Clear search highlights
     */
    function clearSearchHighlights(container) {
        const codeElement = container.querySelector('pre code');
        if (!codeElement) return;

        // Remove highlight spans
        const highlights = codeElement.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const text = document.createTextNode(highlight.textContent);
            highlight.parentNode.replaceChild(text, highlight);
        });

        // Clear search count
        const searchCount = container.querySelector('.search-count');
        if (searchCount) {
            searchCount.textContent = '';
        }

        // Re-highlight syntax
        if (typeof Prism !== 'undefined') {
            Prism.highlightElement(codeElement);
        }
    }

    /**
     * Initialize line highlighting
     */
    function initLineHighlighting(container) {
        const codeContent = container.querySelector('.code-content');
        const preElement = container.querySelector('pre');
        
        if (!codeContent || !preElement) return;

        const highlightLines = preElement.dataset.highlightLines;
        if (!highlightLines) return;

        const lines = parseLineNumbers(highlightLines);
        if (lines.length === 0) return;

        const codeElement = preElement.querySelector('code');
        if (!codeElement) return;

        // Apply highlighting after Prism has processed
        setTimeout(() => {
            const codeLines = codeElement.innerHTML.split('\n');
            const highlightedCode = codeLines.map((line, index) => {
                const lineNumber = index + 1;
                if (lines.includes(lineNumber)) {
                    return `<span class="line-highlight">${line}</span>`;
                }
                return line;
            }).join('\n');

            codeElement.innerHTML = highlightedCode;
        }, 100);
    }

    /**
     * Parse line numbers from string (e.g., "1,3-5,8")
     */
    function parseLineNumbers(str) {
        const lines = [];
        const parts = str.split(',');

        parts.forEach(part => {
            part = part.trim();
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(n => parseInt(n, 10));
                for (let i = start; i <= end; i++) {
                    lines.push(i);
                }
            } else {
                const lineNum = parseInt(part, 10);
                if (!isNaN(lineNum)) {
                    lines.push(lineNum);
                }
            }
        });

        return lines;
    }

    /**
     * Initialize command line prompt
     */
    function initCommandLine(container) {
        const codeElement = container.querySelector('pre code');
        if (!codeElement) return;

        const language = container.dataset.language;
        if (!['bash', 'shell', 'shellscript', 'zsh', 'powershell'].includes(language)) return;

        // Add command line class
        const preElement = container.querySelector('pre');
        if (preElement) {
            preElement.classList.add('command-line');
            
            // Add prompt to each line that starts with $ or >
            const lines = codeElement.innerHTML.split('\n');
            const processedLines = lines.map(line => {
                if (line.trim().startsWith('$') || line.trim().startsWith('>')) {
                    return `<span class="command-line-prompt"></span>${line}`;
                }
                return line;
            });
            
            codeElement.innerHTML = processedLines.join('\n');
        }
    }

    /**
     * Initialize lazy loading
     */
    function initLazyLoading() {
        const lazyBlocks = document.querySelectorAll('.wp-vscode-container[data-lazy="true"]');
        
        if (lazyBlocks.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const container = entry.target;
                    
                    // Load and initialize the block
                    container.classList.add('loading');
                    
                    // Simulate loading (in real scenario, you might load code asynchronously)
                    setTimeout(() => {
                        container.classList.remove('loading');
                        initBlock(container);
                        observer.unobserve(container);
                    }, 100);
                }
            });
        }, {
            rootMargin: '100px'
        });

        lazyBlocks.forEach(block => observer.observe(block));
    }

    /**
     * Utility: Debounce function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utility: Escape RegExp special characters
     */
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Re-initialize on AJAX content load (for page builders, infinite scroll, etc.)
    document.addEventListener('vscb-refresh', initVSCodeBlocks);
    
    // Support for WordPress block editor preview
    if (window.wp && window.wp.domReady) {
        window.wp.domReady(initVSCodeBlocks);
    }

    // Expose API for manual initialization
    window.VSCodeBlocks = {
        init: initVSCodeBlocks,
        initBlock: initBlock,
        refresh: function() {
            document.dispatchEvent(new Event('vscb-refresh'));
        }
    };

})();