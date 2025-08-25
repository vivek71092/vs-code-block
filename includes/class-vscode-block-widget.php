<?php
/**
 * VS Code Block Widget Class
 *
 * @package VS_Code_Block
 * @since 1.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * VS Code Block Widget
 */
class VS_Code_Block_Widget extends WP_Widget {

	/**
	 * Constructor
	 */
	public function __construct() {
		$widget_options = array(
			'classname'   => 'vscode_block_widget',
			'description' => __( 'Display code with VS Code-themed syntax highlighting', 'vs-code-block' ),
			'customize_selective_refresh' => true,
		);

		parent::__construct(
			'vscode_block_widget',
			__( 'VS Code Block', 'vs-code-block' ),
			$widget_options
		);

		// Add widget-specific styles
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_widget_assets' ) );
	}

	/**
	 * Enqueue widget assets
	 */
	public function enqueue_widget_assets() {
		if ( is_active_widget( false, false, $this->id_base, true ) ) {
			// Assets are already enqueued by main plugin if needed
			if ( ! wp_script_is( 'vscb-frontend', 'enqueued' ) ) {
				wp_enqueue_style(
					'vscb-block-style',
					VSCB_PLUGIN_URL . 'assets/css/vs-code-theme.css',
					array(),
					VSCB_VERSION
				);

				wp_enqueue_script(
					'prismjs',
					VSCB_PLUGIN_URL . 'assets/lib/prism/prism.js',
					array(),
					'1.29.0',
					true
				);

				wp_enqueue_script(
					'vscb-frontend',
					VSCB_PLUGIN_URL . 'assets/js/frontend.js',
					array( 'prismjs' ),
					VSCB_VERSION,
					true
				);
			}
		}
	}

	/**
	 * Front-end display of widget
	 *
	 * @param array $args     Widget arguments.
	 * @param array $instance Saved values from database.
	 */
	public function widget( $args, $instance ) {
		// Get widget settings
		$title            = ! empty( $instance['title'] ) ? $instance['title'] : '';
		$code             = ! empty( $instance['code'] ) ? $instance['code'] : '';
		$language         = ! empty( $instance['language'] ) ? $instance['language'] : 'javascript';
		$filename         = ! empty( $instance['filename'] ) ? $instance['filename'] : '';
		$show_line_nums   = isset( $instance['show_line_numbers'] ) ? $instance['show_line_numbers'] : true;
		$show_copy        = isset( $instance['show_copy_button'] ) ? $instance['show_copy_button'] : true;
		$show_lang_label  = isset( $instance['show_language_label'] ) ? $instance['show_language_label'] : true;
		$highlight_lines  = ! empty( $instance['highlight_lines'] ) ? $instance['highlight_lines'] : '';
		$max_height       = ! empty( $instance['max_height'] ) ? $instance['max_height'] : '400';

		// Don't display if no code
		if ( empty( $code ) ) {
			return;
		}

		echo $args['before_widget'];

		if ( ! empty( $title ) ) {
			echo $args['before_title'] . apply_filters( 'widget_title', $title ) . $args['after_title'];
		}

		// Get file extension
		$file_ext = $this->get_file_extension( $language );

		// Generate unique ID
		$widget_id = 'vscb-widget-' . wp_generate_uuid4();

		?>
		<div id="<?php echo esc_attr( $widget_id ); ?>" class="wp-vscode-container widget-vscode" data-language="<?php echo esc_attr( $language ); ?>">
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
				<div class="code-content" style="max-height: <?php echo esc_attr( $max_height ); ?>px;">
					<?php if ( $show_copy ) : ?>
						<button class="copy-button" aria-label="<?php esc_attr_e( 'Copy code to clipboard', 'vs-code-block' ); ?>">
							<span class="copy-icon">📋</span>
							<span class="copy-text"><?php esc_html_e( 'Copy', 'vs-code-block' ); ?></span>
						</button>
					<?php endif; ?>

					<pre class="code-pre" data-highlight-lines="<?php echo esc_attr( $highlight_lines ); ?>"><code class="language-<?php echo esc_attr( $language ); ?>"><?php echo esc_html( $code ); ?></code></pre>

					<?php if ( $show_line_nums ) : ?>
						<div class="line-numbers-wrapper"></div>
					<?php endif; ?>
				</div>
			</div>
		</div>

		<style>
			#<?php echo esc_attr( $widget_id ); ?> .code-content {
				max-height: <?php echo esc_attr( $max_height ); ?>px !important;
				overflow: auto;
			}
		</style>
		<?php

		echo $args['after_widget'];
	}

	/**
	 * Back-end widget form
	 *
	 * @param array $instance Previously saved values from database.
	 */
	public function form( $instance ) {
		// Set default values
		$defaults = array(
			'title'              => '',
			'code'               => '',
			'language'           => 'javascript',
			'filename'           => '',
			'show_line_numbers'  => true,
			'show_copy_button'   => true,
			'show_language_label' => true,
			'highlight_lines'    => '',
			'max_height'         => '400',
		);

		$instance = wp_parse_args( (array) $instance, $defaults );

		// Get supported languages
		$languages = $this->get_supported_languages();

		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>">
				<?php esc_html_e( 'Title:', 'vs-code-block' ); ?>
			</label>
			<input 
				class="widefat" 
				id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" 
				name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" 
				type="text" 
				value="<?php echo esc_attr( $instance['title'] ); ?>" 
			/>
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'code' ) ); ?>">
				<?php esc_html_e( 'Code:', 'vs-code-block' ); ?>
			</label>
			<textarea 
				class="widefat" 
				id="<?php echo esc_attr( $this->get_field_id( 'code' ) ); ?>" 
				name="<?php echo esc_attr( $this->get_field_name( 'code' ) ); ?>" 
				rows="10"
				style="font-family: monospace; font-size: 12px;"
			><?php echo esc_textarea( $instance['code'] ); ?></textarea>
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'language' ) ); ?>">
				<?php esc_html_e( 'Language:', 'vs-code-block' ); ?>
			</label>
			<select 
				class="widefat" 
				id="<?php echo esc_attr( $this->get_field_id( 'language' ) ); ?>" 
				name="<?php echo esc_attr( $this->get_field_name( 'language' ) ); ?>"
			>
				<?php foreach ( $languages as $key => $label ) : ?>
					<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $instance['language'], $key ); ?>>
						<?php echo esc_html( $label ); ?>
					</option>
				<?php endforeach; ?>
			</select>
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'filename' ) ); ?>">
				<?php esc_html_e( 'Filename (optional):', 'vs-code-block' ); ?>
			</label>
			<input 
				class="widefat" 
				id="<?php echo esc_attr( $this->get_field_id( 'filename' ) ); ?>" 
				name="<?php echo esc_attr( $this->get_field_name( 'filename' ) ); ?>" 
				type="text" 
				value="<?php echo esc_attr( $instance['filename'] ); ?>" 
				placeholder="e.g., script.js"
			/>
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'highlight_lines' ) ); ?>">
				<?php esc_html_e( 'Highlight Lines:', 'vs-code-block' ); ?>
			</label>
			<input 
				class="widefat" 
				id="<?php echo esc_attr( $this->get_field_id( 'highlight_lines' ) ); ?>" 
				name="<?php echo esc_attr( $this->get_field_name( 'highlight_lines' ) ); ?>" 
				type="text" 
				value="<?php echo esc_attr( $instance['highlight_lines'] ); ?>" 
				placeholder="e.g., 1,3-5,8"
			/>
			<small><?php esc_html_e( 'Comma-separated line numbers or ranges', 'vs-code-block' ); ?></small>
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'max_height' ) ); ?>">
				<?php esc_html_e( 'Maximum Height (px):', 'vs-code-block' ); ?>
			</label>
			<input 
				class="small-text" 
				id="<?php echo esc_attr( $this->get_field_id( 'max_height' ) ); ?>" 
				name="<?php echo esc_attr( $this->get_field_name( 'max_height' ) ); ?>" 
				type="number" 
				min="100"
				max="1000"
				value="<?php echo esc_attr( $instance['max_height'] ); ?>" 
			/>
		</p>

		<p>
			<strong><?php esc_html_e( 'Display Options:', 'vs-code-block' ); ?></strong>
		</p>

		<p>
			<input 
				class="checkbox" 
				type="checkbox" 
				id="<?php echo esc_attr( $this->get_field_id( 'show_line_numbers' ) ); ?>" 
				name="<?php echo esc_attr( $this->get_field_name( 'show_line_numbers' ) ); ?>" 
				value="1" 
				<?php checked( $instance['show_line_numbers'], true ); ?>
			/>
			<label for="<?php echo esc_attr( $this->get_field_id( 'show_line_numbers' ) ); ?>">
				<?php esc_html_e( 'Show line numbers', 'vs-code-block' ); ?>
			</label>
		</p>

		<p>
			<input 
				class="checkbox" 
				type="checkbox" 
				id="<?php echo esc_attr( $this->get_field_id( 'show_copy_button' ) ); ?>" 
				name="<?php echo esc_attr( $this->get_field_name( 'show_copy_button' ) ); ?>" 
				value="1" 
				<?php checked( $instance['show_copy_button'], true ); ?>
			/>
			<label for="<?php echo esc_attr( $this->get_field_id( 'show_copy_button' ) ); ?>">
				<?php esc_html_e( 'Show copy button', 'vs-code-block' ); ?>
			</label>
		</p>

		<p>
			<input 
				class="checkbox" 
				type="checkbox" 
				id="<?php echo esc_attr( $this->get_field_id( 'show_language_label' ) ); ?>" 
				name="<?php echo esc_attr( $this->get_field_name( 'show_language_label' ) ); ?>" 
				value="1" 
				<?php checked( $instance['show_language_label'], true ); ?>
			/>
			<label for="<?php echo esc_attr( $this->get_field_id( 'show_language_label' ) ); ?>">
				<?php esc_html_e( 'Show language label', 'vs-code-block' ); ?>
			</label>
		</p>

		<div style="padding: 10px; background: #f0f0f0; border-radius: 4px; margin-top: 10px;">
			<p style="margin: 0; font-size: 12px;">
				<strong><?php esc_html_e( 'Tip:', 'vs-code-block' ); ?></strong>
				<?php esc_html_e( 'For better widget display, consider using shorter code snippets or adjusting the maximum height.', 'vs-code-block' ); ?>
			</p>
		</div>
		<?php
	}

	/**
	 * Sanitize widget form values as they are saved
	 *
	 * @param array $new_instance Values just sent to be saved.
	 * @param array $old_instance Previously saved values from database.
	 *
	 * @return array Updated safe values to be saved.
	 */
	public function update( $new_instance, $old_instance ) {
		$instance = array();

		// Sanitize text inputs
		$instance['title']           = ( ! empty( $new_instance['title'] ) ) ? sanitize_text_field( $new_instance['title'] ) : '';
		$instance['code']            = ( ! empty( $new_instance['code'] ) ) ? $new_instance['code'] : ''; // Don't sanitize code
		$instance['language']        = ( ! empty( $new_instance['language'] ) ) ? sanitize_text_field( $new_instance['language'] ) : 'javascript';
		$instance['filename']        = ( ! empty( $new_instance['filename'] ) ) ? sanitize_text_field( $new_instance['filename'] ) : '';
		$instance['highlight_lines'] = ( ! empty( $new_instance['highlight_lines'] ) ) ? sanitize_text_field( $new_instance['highlight_lines'] ) : '';
		$instance['max_height']      = ( ! empty( $new_instance['max_height'] ) ) ? absint( $new_instance['max_height'] ) : 400;

		// Sanitize checkboxes
		$instance['show_line_numbers']   = isset( $new_instance['show_line_numbers'] ) ? (bool) $new_instance['show_line_numbers'] : false;
		$instance['show_copy_button']    = isset( $new_instance['show_copy_button'] ) ? (bool) $new_instance['show_copy_button'] : false;
		$instance['show_language_label'] = isset( $new_instance['show_language_label'] ) ? (bool) $new_instance['show_language_label'] : false;

		return $instance;
	}

	/**
	 * Get file extension for language
	 *
	 * @param string $language Language key.
	 * @return string File extension.
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
	 * Get supported languages
	 *
	 * @return array Supported languages.
	 */
	private function get_supported_languages() {
		// Return a subset of languages for widget to keep UI manageable
		return array(
			'javascript'   => 'JavaScript',
			'typescript'   => 'TypeScript',
			'python'       => 'Python',
			'java'         => 'Java',
			'csharp'       => 'C#',
			'cpp'          => 'C++',
			'c'            => 'C',
			'php'          => 'PHP',
			'ruby'         => 'Ruby',
			'go'           => 'Go',
			'rust'         => 'Rust',
			'swift'        => 'Swift',
			'kotlin'       => 'Kotlin',
			'html'         => 'HTML',
			'css'          => 'CSS',
			'scss'         => 'SCSS',
			'sql'          => 'SQL',
			'bash'         => 'Bash',
			'shell'        => 'Shell',
			'powershell'   => 'PowerShell',
			'json'         => 'JSON',
			'xml'          => 'XML',
			'yaml'         => 'YAML',
			'markdown'     => 'Markdown',
			'dockerfile'   => 'Dockerfile',
			'graphql'      => 'GraphQL',
			'jsx'          => 'JSX',
			'tsx'          => 'TSX',
			'vue'          => 'Vue',
			'react'        => 'React',
			'angular'      => 'Angular',
			'svelte'       => 'Svelte',
			'lua'          => 'Lua',
			'perl'         => 'Perl',
			'r'            => 'R',
			'matlab'       => 'MATLAB',
			'latex'        => 'LaTeX',
			'haskell'      => 'Haskell',
			'elixir'       => 'Elixir',
			'erlang'       => 'Erlang',
			'clojure'      => 'Clojure',
			'scala'        => 'Scala',
			'dart'         => 'Dart',
			'julia'        => 'Julia',
			'nim'          => 'Nim',
			'crystal'      => 'Crystal',
			'zig'          => 'Zig',
			'solidity'     => 'Solidity',
			'terraform'    => 'Terraform',
			'nginx'        => 'Nginx',
			'apache'       => 'Apache',
			'toml'         => 'TOML',
			'ini'          => 'INI',
			'diff'         => 'Diff',
			'makefile'     => 'Makefile',
			'cmake'        => 'CMake',
			'gradle'       => 'Gradle',
		);
	}
}