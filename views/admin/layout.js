//layout for administration side of project

//obj with prop content received from templates
module.exports = ({ content}) => {
    return `
    <DOCTYPE html
    <html>
        <head>
        </head>
        <body>
            ${content}
        </body>
    </html>
    `
};