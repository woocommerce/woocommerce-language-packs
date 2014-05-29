/* jshint node:true */
module.exports = function( grunt ){
	'use strict';

	grunt.initConfig({
		wget: {
			resources: {
				files: {
					'resources/woocommerce.pot': 'https://raw.githubusercontent.com/woothemes/woocommerce/master/i18n/languages/woocommerce.pot',
					'resources/woocommerce-admin.pot': 'https://raw.githubusercontent.com/woothemes/woocommerce/master/i18n/languages/woocommerce-admin.pot'
				}
			}
		},

		shell: {
			options: {
				stdout: true,
				stderr: true
			},
			txpush: {
				command: 'tx push -s' // push the resources
			},
			txpull: {
				command: 'tx pull -a -f' // pull the .po files
			},
			generatemos: {
				command: [
					'cd languages',
					'for i in *.po; do msgfmt $i -o ${i%%.*}.mo; done'
				].join( '&&' )
			}
		}
	});

	// Load NPM tasks to be used here
	grunt.loadNpmTasks( 'grunt-shell' );
	grunt.loadNpmTasks( 'grunt-wget' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-compress' );

	// Register tasks
	grunt.registerTask( 'default', [

	]);

	grunt.registerTask( 'update_resources', [
		'wget:resources',
		'shell:txpush'
	]);

	grunt.registerTask( 'update_translations', [
		'shell:txpull',
		'shell:generatemos'
	]);

};
