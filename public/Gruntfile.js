//����������� ������� ������ � nodejs
module.exports = function(grunt) {
  // ������������� ������� GruntJS
  grunt.initConfig({

    //��������� ��������� ������� GruntJS, �� ����� �������������� ���������� ����� �������� ������� npm, ��� �������� � ���� package.json ����� �������� npm install

    //���������� ������
      concat: {
          options: {
            separator: ';',
          },
          js: {
            src: ['js/app/controls/controls_mixin.js',
                  'js/app/controls/controls.js',
                  'js/app/controls/listbox.js',
                  'js/app/controls/main_list.js',
                  'js/app/controls/tree.js',
                  'js/app/modals/bootstrap_modal_mixin.js',
                  'js/app/modals/modal.js',
                  'js/app/config.js',
                  'js/app/item_edit.js',
                  'js/app/base_entities.js',
                  'js/app/entities.js',
                  'js/app/cat_tree.js',
                  'js/app/search.js',
                  'js/app/main_window.js',
                  'js/app/index.js'
                  ],
            dest: 'pre_production/js/concant.js',
          },
          css: {
            src: ['css/*.css'],
            dest: 'pre_production/css/style.css',
          },
      },
      //������� �������
      removeLoggingCalls: {
          // the files inside which you want to remove the console statements
           files: ['pre_production/js/concant.js'],         
           options: {
              methods: ['log', 'info', 'assert'], 
              strategy: function(consoleStatement) {
                  return ''; 
              }
          }
      },      
      /*
      removelogging: {
          dist: {
            src: "pre_production/js/concant.js",
            dest: "pre_production/js/concant-clean.js",

            options: {
              // see below for options. this is optional.
            }
          }
      },*/
      //�������� JSX � JS
      react: {
          single_file_output: {
            files: {
              'pre_production/js/jsx_to_js_output.js': '/pre_production/js/concant-clean.js'
            }
          },
      },      
      //�����������     
      uglify: {
          options: {
            mangle: false
          },
          my_target: {
            files: {
              'pre_production/js/jsx_to_js_output.min.js': ['/pre_production/js/jsx_to_js_output.js']
            }
          }
      },
      // ������� � ������������ �����
        cssmin: {
          add_banner: {
            options: {
              banner: '/* Moskit minified ad concatenated css file */'
            },
            files: {
              'production/css/style.css': ['/pre_production/css/style.css']
            }
        }
       },
       obfuscator: {
              files: [
                'pre_production/js/jsx_to_js_output.min.js',
              ],
              entry: 'pre_production/js/jsx_to_js_output.min.js',
              out: 'production/js/app.js',
              strings: true,
              root: __dirname
        }                             
  });

  //�������� �������, ������� �������������� �����������

  grunt.loadNpmTasks('grunt-contrib-concat');
  //grunt.loadNpmTasks('grunt-remove-logging');
  grunt.loadNpmTasks('grunt-remove-logging-calls');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-obfuscator');

  //��� ������� ����� ���������� ����� �� ����� �� � ������� ����������� grunt, � ������� Enter
  grunt.registerTask('default', ['concat', 'removeLoggingCalls',  'react', 'uglify', 'cssmin', 'obfuscator']); //'removelogging',
};