/**
 * [HtmlScript]{@link https://github.com/anarxyfr/jsxscript}
 *
 * @version 1.0.0
 * @author anarxyfr
 * @copyright anarxyfr 2025
 * @license MIT
 */

(function () {
    const scripts = [
        'https://unpkg.com/react@18/umd/react.development.js',
        'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
        'https://unpkg.com/@babel/standalone/babel.min.js'
    ];

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    Promise.all(scripts.map(loadScript))
        .then(() => {
            const jsxTags = document.getElementsByTagName('jsx');
            Array.from(jsxTags).forEach((tag, index) => {
                const jsxCode = tag.textContent;
                const targetId = tag.getAttribute('target') || `jsx-output-${index}`;
                let targetDiv = document.getElementById(targetId);
                if (!targetDiv) {
                    targetDiv = document.createElement('div');
                    targetDiv.id = targetId;
                    tag.parentNode.insertBefore(targetDiv, tag.nextSibling);
                }
                try {
                    const jsCode = Babel.transform(jsxCode, { presets: ['react'] }).code;
                    const renderFunction = new Function('React', 'ReactDOM', jsCode);
                    renderFunction(React, ReactDOM);
                    if (jsCode.includes('return React.createElement')) {
                        ReactDOM.render(
                            eval(jsCode.split('=')[0] + '()'),
                            targetDiv
                        );
                    }
                } catch (error) {
                    console.error(error);
                    targetDiv.innerHTML = 'Error rendering JSX';
                }
            });
        })
        .catch(error => {
            console.error(error);
        });
})();
