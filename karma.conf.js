module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'js/app.spec.js'
        ],
        browsers: ['Chrome'],
        singleRun: true
    });
};