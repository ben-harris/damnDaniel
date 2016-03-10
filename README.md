# damndaniel

using postcss and uglify to make the distributed files

+ install: `npm install -g uglify-js postcss autoprefixer cssnano`

+ js: `uglifyjs js/*.js -o dist/scripts.js`
+ css: `postcss --use autoprefixer --use cssnano css/styles.css -o dist/styles.css`
