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
            src: src: ['/js/app/*.js', 'js/app/**/*.js'],
            dest: '../pre_production/js/concant.js',
          },
          css: {
            src: ['/css/*.css'],
            dest: '../pre_production/css/style.css',
          },
      },
      //������� �������
      removelogging: {
          dist: {
            src: "../pre_production/js/concant.js",
            dest: "../pre_production/js/concant-clean.js",

            options: {
              // see below for options. this is optional.
            }
          }
      },
      //�������� JSX � JS
      react: {
          single_file_output: {
            files: {
              '../pre_production/js/jsx_to_js_output.js': '../pre_production/js/concant-clean.js'
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
              '../pre_production/js/jsx_to_js_output.min.js': ['../pre_production/js/jsx_to_js_output.js']
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
              '../production/css/style.css': ['../pre_production/css/style.css']
            }
       },
       obfuscator: {
            files: '../pre_production/js/jsx_to_js_output.min.js',
            entry: '../pre_production/js/jsx_to_js_output.min.js',
            out: '../production/obfuscated.js',
            strings: true,
            root: __dirname
          }         
       }        
      

  });

  //�������� �������, ������� �������������� �����������

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-remove-logging');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-obfuscator');

  //��� ������� ����� ���������� ����� �� ����� �� � ������� ����������� grunt, � ������� Enter
  grunt.registerTask('default', ['concat', 'removelogging', 'react', 'uglify', 'cssmin', 'obfuscator']);
};