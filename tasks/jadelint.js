var _ = require('lodash');
var jadelint = require('jadelint/Linter');

module.exports = function(grunt) {
    grunt.registerMultiTask('jadelint', 'Validate Jade code', function() {
        var options = this.options({
            configFile: '.jadelintrc',
            config: {}
        });

        if (options.configFile) {
            var config = grunt.file.readJSON(options.configFile);
            options.config = _.extend({}, config, options.config);
        }

        var success = true;
        this.filesSrc.forEach(function(file) {
            var linter = new jadelint(file, grunt.file.read(file));
            _.forEach(linter.lint(), function(error) {
                if (error.level === 'error') {
                    success = false;
                }

                if (error.level && error.level !== 'ignore') {
                    grunt.log.error(error.filename + ':' + error.line + '\n    ' + error.name);
                    console.log();
                }
            });
        });

        return success;
    });
};
