var require = {
    baseUrl: '/scripts/vendor',
    paths: {
        "requirejs-codemirror": '/scripts/vendor/requirejs-codemirror/src/code-mirror.js'
    },
    cm: {
        // baseUrl to CodeMirror dir
        baseUrl: '/scripts/vendor/CodeMirror/',
        // path to CodeMirror lib
        path: 'lib/codemirror.js',
        // path to CodeMirror css file
        css: 'lib/codemirror.css',
        // define themes
        themes: {
            monokai: 'theme/monokai.css',
            ambiance: 'theme/ambiance.css',
            eclipse: 'theme/eclipse.css'
        },
        modes: {
            // modes dir structure
            path: 'mode/{mode}/{mode}'
        }
    }
};
