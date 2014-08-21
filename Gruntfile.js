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
			}
		},

		potomo: {
			dist: {
			options: {
				poDel: false
			},
			files: [{
					expand: true,
					cwd: 'languages/',
					src: ['*.po'],
					dest: 'languages/',
					ext: '.mo',
					nonull: true
				}]
			}
		}
	});

	// Load NPM tasks to be used here
	grunt.loadNpmTasks( 'grunt-shell' );
	grunt.loadNpmTasks( 'grunt-wget' );
	grunt.loadNpmTasks( 'grunt-potomo' );

	// Register tasks
	grunt.registerTask( 'default', function () {
		grunt.log.writeln( "\n ################################################# " );
		grunt.log.writeln( " ###### WooCommerce Language Pack Generator ###### " );
		grunt.log.writeln( " ################################################# \n" );
		grunt.log.writeln( " # Commands: \n" );
		grunt.log.writeln( " grunt compile    =  Gets the Transifex translations, compiles the .mo files and generates zip files " );
		grunt.log.writeln( " grunt resources  =  Gets the WooCommerce core .pot files and pushes on Transifex " );
	});

	grunt.registerTask( 'resources', [
		'wget:resources',
		'shell:txpush'
	]);

	grunt.registerTask( 'update_translations', [
		'shell:txpull',
		'potomo'
	]);

	grunt.registerTask( 'compress', function () {
		var fs    = require( 'fs' ),
			files = fs.readdirSync( 'languages/' ),
			done  = this.async();

		files.forEach( function ( file ) {
			var lang = file.replace( /(^woocommerce-admin-)(.+)(.po)/, '$2' );
			if ( lang !== file ) {
				var dest = 'packages/' + lang + '.zip';
				var zip  = new require('node-zip')();
				zip.file( 'woocommerce-' + lang + '.po', fs.readFileSync( 'languages/woocommerce-' + lang + '.po' ) );
				zip.file( 'woocommerce-' + lang + '.mo', fs.readFileSync( 'languages/woocommerce-' + lang + '.mo' ) );
				zip.file( 'woocommerce-admin-' + lang + '.po', fs.readFileSync( 'languages/woocommerce-admin-' + lang + '.po' ) );
				zip.file( 'woocommerce-admin-' + lang + '.mo', fs.readFileSync( 'languages/woocommerce-admin-' + lang + '.mo' ) );
				var data = zip.generate({
					base64: false,
					compression: 'DEFLATE'
				});
				fs.writeFileSync( dest, data, 'binary' );
				grunt.log.writeln( ' -> ' + lang + ': ' + dest + ' file created successfully' );
			}
		});

		done();
	});

	grunt.registerTask( 'compile', [
		'update_translations',
		'compress'
	]);

};
