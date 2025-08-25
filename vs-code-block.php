<?php
/**
 * Plugin Name: VS Code Block - Syntax Highlighter
 * Plugin URI: https://github.com/vivek71092/vs-code-block
 * Description: Beautiful VS Code-themed syntax highlighting for WordPress with support for 150+ languages
 * Version: 1.0.0
 * Author: Vivek Kumar
 * Author URI: https://github.com/vivek71092
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: vs-code-block
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 7.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin constants.
define( 'VSCB_VERSION', '1.0.0' );
define( 'VSCB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'VSCB_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'VSCB_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Main plugin class.
 */
class VS_Code_Block {

	/**
	 * Instance of this class.
	 *
	 * @var VS_Code_Block
	 */
	private static $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @return VS_Code_Block
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		$this->init_hooks();
	}

	/**
	 * Initialize hooks.
	 */
	private function init_hooks() {
		// Load plugin textdomain.
		add_action( 'init', array( $this, 'load_textdomain' ) );

		// Register block.
		add_action( 'init', array( $this, 'register_block' ) );

		// Enqueue block editor assets.
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );

		// Enqueue frontend assets only when needed.
		add_action( 'wp_enqueue_scripts', array( $this, 'maybe_enqueue_frontend_assets' ) );

		// Add settings menu.
		add_action( 'admin_menu', array( $this, 'add_settings_menu' ) );

		// Register settings.
		add_action( 'admin_init', array( $this, 'register_settings' ) );

		// Add Classic Editor button.
		add_filter( 'mce_buttons', array( $this, 'add_tinymce_button' ) );
		add_filter( 'mce_external_plugins', array( $this, 'add_tinymce_plugin' ) );

		// Add shortcode support.
		add_shortcode( 'vscode', array( $this, 'render_shortcode' ) );

		// Widget support.
		add_action( 'widgets_init', array( $this, 'register_widget' ) );
	}

	/**
	 * Load plugin textdomain.
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'vs-code-block', false, dirname( VSCB_PLUGIN_BASENAME ) . '/languages' );
	}

	/**
	 * Register Gutenberg block.
	 */
	public function register_block() {
		register_block_type(
			'vs-code-block/code',
			array(
				'editor_script'   => 'vscb-block-editor',
				'editor_style'    => 'vscb-block-editor',
				'style'           => 'vscb-block-style',
				'render_callback' => array( $this, 'render_block' ),
				'attributes'      => array(
					'code'           => array(
						'type'    => 'string',
						'default' => '',
					),
					'language'       => array(
						'type'    => 'string',
						'default' => 'javascript',
					),
					'filename'       => array(
						'type'    => 'string',
						'default' => '',
					),
					'showLineNumbers' => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'showCopyButton' => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'showLanguageLabel' => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'highlightLines' => array(
						'type'    => 'string',
						'default' => '',
					),
					'collapsible'    => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'collapsed'      => array(
						'type'    => 'boolean',
						'default' => false,
					),
				),
			)
		);
	}

	/**
	 * Enqueue block editor assets.
	 */
	public function enqueue_block_editor_assets() {
		wp_enqueue_script(
			'vscb-block-editor',
			VSCB_PLUGIN_URL . 'assets/js/block-editor.js',
			array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n' ),
			VSCB_VERSION,
			true
		);

		wp_enqueue_style(
			'vscb-block-editor',
			VSCB_PLUGIN_URL . 'assets/css/block-editor.css',
			array( 'wp-edit-blocks' ),
			VSCB_VERSION
		);

		// Load Prism.js in editor.
		wp_enqueue_script(
			'prismjs',
			VSCB_PLUGIN_URL . 'assets/lib/prism/prism.js',
			array(),
			'1.29.0',
			true
		);

		wp_enqueue_style(
			'prismjs-theme',
			VSCB_PLUGIN_URL . 'assets/css/vs-code-theme.css',
			array(),
			VSCB_VERSION
		);

		// Localize script.
		wp_localize_script(
			'vscb-block-editor',
			'vscb_data',
			array(
				'languages' => $this->get_supported_languages(),
				'nonce'     => wp_create_nonce( 'vscb_nonce' ),
			)
		);
	}

	/**
	 * Maybe enqueue frontend assets.
	 */
	public function maybe_enqueue_frontend_assets() {
		// Check if current post/page has our block.
		if ( ! is_singular() ) {
			return;
		}

		$post = get_post();
		if ( ! $post ) {
			return;
		}

		// Check for our block or shortcode.
		if ( has_block( 'vs-code-block/code', $post ) || 
		     has_shortcode( $post->post_content, 'vscode' ) ) {
			$this->enqueue_frontend_assets();
		}
	}

	/**
	 * Enqueue frontend assets.
	 */
	public function enqueue_frontend_assets() {
		// Main styles.
		wp_enqueue_style(
			'vscb-block-style',
			VSCB_PLUGIN_URL . 'assets/css/vs-code-theme.css',
			array(),
			VSCB_VERSION
		);

		// Prism.js core.
		wp_enqueue_script(
			'prismjs',
			VSCB_PLUGIN_URL . 'assets/lib/prism/prism.js',
			array(),
			'1.29.0',
			true
		);

		// Frontend script.
		wp_enqueue_script(
			'vscb-frontend',
			VSCB_PLUGIN_URL . 'assets/js/frontend.js',
			array( 'prismjs' ),
			VSCB_VERSION,
			true
		);

		// Custom CSS from settings.
		$custom_css = get_option( 'vscb_custom_css', '' );
		if ( ! empty( $custom_css ) ) {
			wp_add_inline_style( 'vscb-block-style', $custom_css );
		}
	}

	/**
	 * Render block callback.
	 */
	public function render_block( $attributes ) {
		// Ensure assets are loaded.
		if ( ! wp_script_is( 'vscb-frontend', 'enqueued' ) ) {
			$this->enqueue_frontend_assets();
		}

		$code            = isset( $attributes['code'] ) ? $attributes['code'] : '';
		$language        = isset( $attributes['language'] ) ? $attributes['language'] : 'javascript';
		$filename        = isset( $attributes['filename'] ) ? $attributes['filename'] : '';
		$show_line_nums  = isset( $attributes['showLineNumbers'] ) ? $attributes['showLineNumbers'] : true;
		$show_copy       = isset( $attributes['showCopyButton'] ) ? $attributes['showCopyButton'] : true;
		$show_lang_label = isset( $attributes['showLanguageLabel'] ) ? $attributes['showLanguageLabel'] : true;
		$highlight_lines = isset( $attributes['highlightLines'] ) ? $attributes['highlightLines'] : '';
		$collapsible     = isset( $attributes['collapsible'] ) ? $attributes['collapsible'] : false;
		$collapsed       = isset( $attributes['collapsed'] ) ? $attributes['collapsed'] : false;

		// Generate unique ID.
		$block_id = 'vscb-' . wp_generate_uuid4();

		// Get file extension.
		$file_ext = $this->get_file_extension( $language );

		// Build the HTML.
		ob_start();
		?>
		<div id="<?php echo esc_attr( $block_id ); ?>" class="wp-vscode-container" data-language="<?php echo esc_attr( $language ); ?>">
			<div class="vscode-container">
				<!-- Title Bar -->
				<div class="title-bar">
					<div class="traffic-lights">
						<div class="traffic-light close"></div>
						<div class="traffic-light minimize"></div>
						<div class="traffic-light maximize"></div>
					</div>
					<div class="title-text">Visual Studio Code</div>
				</div>

				<!-- Tab Bar -->
				<div class="tab-bar">
					<div class="tab">
						<div class="file-icon"><?php echo esc_html( strtoupper( substr( $file_ext, 0, 2 ) ) ); ?></div>
						<span><?php echo esc_html( $filename ?: 'untitled.' . $file_ext ); ?></span>
					</div>
					<?php if ( $show_lang_label ) : ?>
						<div class="lang-indicator"><?php echo esc_html( strtoupper( $language ) ); ?></div>
					<?php endif; ?>
				</div>

				<!-- Code Content -->
				<div class="code-content <?php echo $collapsible ? 'collapsible' : ''; ?> <?php echo $collapsed ? 'collapsed' : ''; ?>">
					<?php if ( $show_copy ) : ?>
						<button class="copy-button" data-code="<?php echo esc_attr( $code ); ?>" aria-label="<?php esc_attr_e( 'Copy code to clipboard', 'vs-code-block' ); ?>">
							<span class="copy-icon">📋</span>
							<span class="copy-text"><?php esc_html_e( 'Copy', 'vs-code-block' ); ?></span>
						</button>
					<?php endif; ?>

					<?php if ( $collapsible ) : ?>
						<button class="collapse-button" aria-label="<?php esc_attr_e( 'Toggle code visibility', 'vs-code-block' ); ?>">
							<span class="collapse-icon">▼</span>
						</button>
					<?php endif; ?>

					<pre class="code-pre" data-highlight-lines="<?php echo esc_attr( $highlight_lines ); ?>"><code class="language-<?php echo esc_attr( $language ); ?>"><?php echo esc_html( $code ); ?></code></pre>

					<?php if ( $show_line_nums ) : ?>
						<div class="line-numbers-wrapper"></div>
					<?php endif; ?>
				</div>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get file extension for language.
	 */
	private function get_file_extension( $language ) {
		$extensions = array(
			'javascript' => 'js',
			'typescript' => 'ts',
			'python'     => 'py',
			'java'       => 'java',
			'csharp'     => 'cs',
			'cpp'        => 'cpp',
			'c'          => 'c',
			'php'        => 'php',
			'ruby'       => 'rb',
			'go'         => 'go',
			'rust'       => 'rs',
			'swift'      => 'swift',
			'kotlin'     => 'kt',
			'html'       => 'html',
			'css'        => 'css',
			'scss'       => 'scss',
			'sql'        => 'sql',
			'bash'       => 'sh',
			'powershell' => 'ps1',
			'json'       => 'json',
			'xml'        => 'xml',
			'yaml'       => 'yaml',
			'markdown'   => 'md',
		);

		return isset( $extensions[ $language ] ) ? $extensions[ $language ] : 'txt';
	}

	/**
	 * Get supported languages.
	 */
	private function get_supported_languages() {
		return array(
			'bap' => 'BAP',
			'actionscript' => 'ActionScript 3',
			'ada' => 'Ada',
			'ansi' => 'ANSI',
			'apache' => 'Apache',
			'apex' => 'Apex',
			'apl' => 'APL',
			'ara' => 'Ara',
			'asm' => 'ASM',
			'astro' => 'Astro',
			'awk' => 'Awk',
			'ballerina' => 'Ballerina',
			'batch' => 'BAT',
			'berry' => 'Berry',
			'bibtex' => 'BibTeX',
			'bicep' => 'BICEP',
			'blade' => 'Blade',
			'c' => 'C',
			'cadence' => 'Cadence',
			'clarity' => 'Clarity',
			'clojure' => 'Clojure',
			'cmake' => 'CMake',
			'cobol' => 'COBOL',
			'codeql' => 'CodeQL',
			'coffeescript' => 'CoffeeScript',
			'cpp' => 'C++',
			'crystal' => 'Crystal',
			'csharp' => 'C#',
			'css' => 'CSS',
			'cue' => 'CUE',
			'cypher' => 'Cypher',
			'd' => 'D',
			'dart' => 'Dart',
			'dax' => 'DAX',
			'diff' => 'Diff',
			'dockerfile' => 'Dockerfile',
			'dreammaker' => 'DreamMaker',
			'elixir' => 'Elixir',
			'elm' => 'Elm',
			'erb' => 'ERB',
			'erlang' => 'Erlang',
			'fish' => 'Fish',
			'fsharp' => 'F#',
			'gdresource' => 'GDResource',
			'gdscript' => 'GDScript',
			'gdshader' => 'GDShader',
			'gherkin' => 'Gherkin',
			'glsl' => 'GLSL',
			'glimmer-js' => 'Glimmer JS',
			'glimmer-ts' => 'Glimmer TS',
			'gnuplot' => 'Gnuplot',
			'go' => 'Go',
			'graphql' => 'GraphQL',
			'groovy' => 'Groovy',
			'hack' => 'Hack',
			'haml' => 'HAML',
			'handlebars' => 'Handlebars',
			'haskell' => 'Haskell',
			'hcl' => 'HCL',
			'hlsl' => 'HLSL',
			'html' => 'HTML',
			'http' => 'HTTP',
			'ini' => 'INI',
			'imba' => 'Imba',
			'java' => 'Java',
			'javascript' => 'JavaScript',
			'jinja-html' => 'Jinja HTML',
			'jison' => 'Jison',
			'json' => 'JSON',
			'json5' => 'JSON5',
			'jsonc' => 'JSONC',
			'jsonl' => 'JSONL',
			'jsonnet' => 'JSONnet',
			'jssm' => 'JSSM',
			'jsx' => 'JSX',
			'julia' => 'Julia',
			'kotlin' => 'Kotlin',
			'kusto' => 'Kusto',
			'latex' => 'LaTeX',
			'less' => 'LESS',
			'ledger' => 'Ledger',
			'liquid' => 'Liquid',
			'lisp' => 'Lisp',
			'logo' => 'Logo',
			'lua' => 'Lua',
			'makefile' => 'Makefile',
			'markdown' => 'Markdown',
			'marko' => 'Marko',
			'matlab' => 'MATLAB',
			'mdc' => 'MDC',
			'mdx' => 'MDX',
			'mermaid' => 'Mermaid',
			'mojo' => 'Mojo',
			'narrat' => 'Narrat',
			'nextflow' => 'Nextflow',
			'nginx' => 'Nginx',
			'nim' => 'Nim',
			'nix' => 'Nix',
			'objectivec' => 'Objective-C',
			'objectivecpp' => 'Objective-C++',
			'ocaml' => 'OCaml',
			'pascal' => 'Pascal',
			'perl' => 'Perl',
			'php' => 'PHP',
			'plsql' => 'PLSQL',
			'postcss' => 'PostCSS',
			'powerquery' => 'Power Query',
			'powershell' => 'PowerShell',
			'prisma' => 'Prisma',
			'prolog' => 'Prolog',
			'protobuf' => 'Protocol Buffers',
			'pug' => 'Pug',
			'puppet' => 'Puppet',
			'purescript' => 'PureScript',
			'python' => 'Python',
			'r' => 'R',
			'raku' => 'Raku',
			'razor' => 'Razor',
			'reg' => 'Windows Registry',
			'rel' => 'Rel',
			'riscv' => 'RISC-V',
			'rst' => 'RST',
			'ruby' => 'Ruby',
			'rust' => 'Rust',
			'sas' => 'SAS',
			'sass' => 'Sass',
			'scala' => 'Scala',
			'scheme' => 'Scheme',
			'scss' => 'SCSS',
			'splunk' => 'Splunk SPL',
			'bash' => 'Bash',
			'shell' => 'ShellScript',
			'zsh' => 'Zsh',
			'shellsession' => 'ShellSession',
			'smalltalk' => 'Smalltalk',
			'solidity' => 'Solidity',
			'sparql' => 'SPARQL',
			'sql' => 'SQL',
			'ssh-config' => 'SSH Config',
			'stata' => 'Stata',
			'stylus' => 'Stylus',
			'svelte' => 'Svelte',
			'swift' => 'Swift',
			'systemverilog' => 'SystemVerilog',
			'tasl' => 'TASL',
			'tcl' => 'TCL',
			'tex' => 'TeX',
			'toml' => 'TOML',
			'tsx' => 'TSX',
			'turtle' => 'Turtle',
			'twig' => 'Twig',
			'typescript' => 'TypeScript',
			'v' => 'V',
			'vb' => 'VB',
			'verilog' => 'Verilog',
			'vhdl' => 'VHDL',
			'viml' => 'VimL',
			'vue-html' => 'Vue HTML',
			'vue' => 'Vue',
			'vyper' => 'Vyper',
			'wasm' => 'WASM',
			'wenyan' => 'Wenyan',
			'wgsl' => 'WGSL',
			'wolfram' => 'Wolfram',
			'xml' => 'XML',
			'xsl' => 'XSL',
			'yaml' => 'YAML',
			'zenscript' => 'ZenScript',
			'zig' => 'Zig',
		);
	}

	/**
	 * Add settings menu.
	 */
	public function add_settings_menu() {
		add_options_page(
			__( 'VS Code Block Settings', 'vs-code-block' ),
			__( 'VS Code Block', 'vs-code-block' ),
			'manage_options',
			'vs-code-block-settings',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Register settings.
	 */
	public function register_settings() {
		register_setting( 'vscb_settings', 'vscb_default_language' );
		register_setting( 'vscb_settings', 'vscb_show_line_numbers' );
		register_setting( 'vscb_settings', 'vscb_show_copy_button' );
		register_setting( 'vscb_settings', 'vscb_show_language_label' );
		register_setting( 'vscb_settings', 'vscb_custom_css' );
		register_setting( 'vscb_settings', 'vscb_lazy_load' );
	}

	/**
	 * Render settings page.
	 */
	public function render_settings_page() {
		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			<form action="options.php" method="post">
				<?php
				settings_fields( 'vscb_settings' );
				?>
				<table class="form-table">
					<tr>
						<th scope="row">
							<label for="vscb_default_language"><?php esc_html_e( 'Default Language', 'vs-code-block' ); ?></label>
						</th>
						<td>
							<select name="vscb_default_language" id="vscb_default_language">
								<?php
								$current = get_option( 'vscb_default_language', 'javascript' );
								foreach ( $this->get_supported_languages() as $key => $label ) {
									printf(
										'<option value="%s" %s>%s</option>',
										esc_attr( $key ),
										selected( $current, $key, false ),
										esc_html( $label )
									);
								}
								?>
							</select>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Default Options', 'vs-code-block' ); ?></th>
						<td>
							<fieldset>
								<label>
									<input type="checkbox" name="vscb_show_line_numbers" value="1" <?php checked( get_option( 'vscb_show_line_numbers', true ) ); ?> />
									<?php esc_html_e( 'Show line numbers', 'vs-code-block' ); ?>
								</label><br>
								<label>
									<input type="checkbox" name="vscb_show_copy_button" value="1" <?php checked( get_option( 'vscb_show_copy_button', true ) ); ?> />
									<?php esc_html_e( 'Show copy button', 'vs-code-block' ); ?>
								</label><br>
								<label>
									<input type="checkbox" name="vscb_show_language_label" value="1" <?php checked( get_option( 'vscb_show_language_label', true ) ); ?> />
									<?php esc_html_e( 'Show language label', 'vs-code-block' ); ?>
								</label><br>
								<label>
									<input type="checkbox" name="vscb_lazy_load" value="1" <?php checked( get_option( 'vscb_lazy_load', true ) ); ?> />
									<?php esc_html_e( 'Enable lazy loading', 'vs-code-block' ); ?>
								</label>
							</fieldset>
						</td>
					</tr>
					<tr>
						<th scope="row">
							<label for="vscb_custom_css"><?php esc_html_e( 'Custom CSS', 'vs-code-block' ); ?></label>
						</th>
						<td>
							<textarea name="vscb_custom_css" id="vscb_custom_css" rows="10" cols="50" class="large-text code"><?php echo esc_textarea( get_option( 'vscb_custom_css', '' ) ); ?></textarea>
							<p class="description"><?php esc_html_e( 'Add custom CSS to customize the appearance of code blocks.', 'vs-code-block' ); ?></p>
						</td>
					</tr>
				</table>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	/**
	 * Add TinyMCE button for Classic Editor.
	 */
	public function add_tinymce_button( $buttons ) {
		array_push( $buttons, 'vscode_block' );
		return $buttons;
	}

	/**
	 * Add TinyMCE plugin.
	 */
	public function add_tinymce_plugin( $plugins ) {
		$plugins['vscode_block'] = VSCB_PLUGIN_URL . 'assets/js/tinymce-plugin.js';
		return $plugins;
	}

	/**
	 * Render shortcode.
	 */
	public function render_shortcode( $atts, $content = '' ) {
		$atts = shortcode_atts(
			array(
				'language'    => get_option( 'vscb_default_language', 'javascript' ),
				'filename'    => '',
				'lines'       => get_option( 'vscb_show_line_numbers', true ),
				'copy'        => get_option( 'vscb_show_copy_button', true ),
				'label'       => get_option( 'vscb_show_language_label', true ),
				'highlight'   => '',
				'collapsible' => false,
				'collapsed'   => false,
			),
			$atts,
			'vscode'
		);

		$attributes = array(
			'code'             => $content,
			'language'         => $atts['language'],
			'filename'         => $atts['filename'],
			'showLineNumbers'  => filter_var( $atts['lines'], FILTER_VALIDATE_BOOLEAN ),
			'showCopyButton'   => filter_var( $atts['copy'], FILTER_VALIDATE_BOOLEAN ),
			'showLanguageLabel' => filter_var( $atts['label'], FILTER_VALIDATE_BOOLEAN ),
			'highlightLines'   => $atts['highlight'],
			'collapsible'      => filter_var( $atts['collapsible'], FILTER_VALIDATE_BOOLEAN ),
			'collapsed'        => filter_var( $atts['collapsed'], FILTER_VALIDATE_BOOLEAN ),
		);

		return $this->render_block( $attributes );
	}

	/**
	 * Register widget.
	 */
	public function register_widget() {
		require_once VSCB_PLUGIN_PATH . 'includes/class-vscode-block-widget.php';
		register_widget( 'VS_Code_Block_Widget' );
	}
}

// Initialize the plugin.
add_action( 'plugins_loaded', array( 'VS_Code_Block', 'get_instance' ) );

// Activation hook.
register_activation_hook( __FILE__, 'vscb_activate' );
function vscb_activate() {
	// Set default options.
	add_option( 'vscb_default_language', 'javascript' );
	add_option( 'vscb_show_line_numbers', true );
	add_option( 'vscb_show_copy_button', true );
	add_option( 'vscb_show_language_label', true );
	add_option( 'vscb_lazy_load', true );
	add_option( 'vscb_custom_css', '' );
}

// Deactivation hook.
register_deactivation_hook( __FILE__, 'vscb_deactivate' );
function vscb_deactivate() {
	// Clean up if needed.
	flush_rewrite_rules();
}