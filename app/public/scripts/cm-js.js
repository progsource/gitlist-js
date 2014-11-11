var myTextArea = document.querySelector('textarea');

var myCodeMirror = CodeMirror(
    CodeMirror(
        function(elt) {
            myTextArea.parentNode.replaceChild(elt, myTextArea);
        }, {
            lineNumbers: true,
            lineWrapping: true,
            mode: myTextArea.getAttribute('data-codemode'),
            readOnly: 'nocursor',
            theme: 'mdn-like',
            value: myTextArea.value
        }
    )
);
