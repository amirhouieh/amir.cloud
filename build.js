const { inlineSource } = require('inline-source');
const fs = require('fs');
const path = require('path');
const HTML_PATH = path.resolve('dist/index.html');

(async ()=>{

    try{
        const html = await inlineSource(HTML_PATH, {
            compress: false,
            rootpath: path.resolve('')
        });

    }catch (e) {
        console.log(e);
    }

})();
