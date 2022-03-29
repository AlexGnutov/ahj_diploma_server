const Router = require('@koa/router');
const path = require("path");
const fs = require("fs");
const fileStorage = path.join(__dirname, '../public/files');

class FilesRouter {
    constructor(messageService) {
        this.messageService = messageService;
        this.router = new Router();

        // Downloading file according to filename
        this.router.get('/api/files/download/:filename', async (ctx, next) => {
            const {filename} = ctx.request.params;
            const fileName = path.join(__dirname, `../public/files/${filename}`);

            try {
                if (fs.existsSync(fileName)) {
                    ctx.response.set({
                       'Content-Disposition': `attachment; filename="${filename}"`
                    });
                    ctx.body = fs.createReadStream(fileName);
                    ctx.attachment(fileName);
                } else {
                    ctx.throw(400, "Requested file was not found on server");
                }
            } catch(error) {
                ctx.throw(500, error);
            }
        });

        // Uploading file or several files (in separate fields)
        this.router.post('/api/files/upload',
            async (ctx) => {
                const files = ctx.request.files;
                console.log(files);
                const links = [];
                const contentTypes = [];

                if (Object.keys(files).length === 0) {
                    ctx.response.status = 400;
                    ctx.response.body = JSON.stringify({
                        status: 'error',
                        message: 'No files were sent!',
                    });
                    return;
                }

                function saveFile({tempPath, fileName, newPath, fileType}) {
                    return new Promise((resolve, reject) => {
                        const errorCallback = (error) => {
                            console.log('error callback!', error)
                            reject(error);
                        }
                        const readStream = fs.createReadStream(tempPath);
                        const writeStream = fs.createWriteStream(newPath);
                        readStream.on('error', errorCallback);
                        writeStream.on('error', errorCallback);

                        readStream.on('close', () => {
                            fs.unlink(tempPath, errorCallback);
                            links.push(fileName);
                            contentTypes.push(fileType);
                            resolve(fileName);
                        });
                        readStream.pipe(writeStream);
                    });
                }

                const taskArray = [];

                for (let fieldName in files) {
                    const tempPath = files[fieldName].path;
                    const fileName = files[fieldName].name;
                    const fileType = files[fieldName].type;
                    const newPath = path.join(fileStorage, fileName);
                    taskArray.push({
                        tempPath,
                        fileName,
                        newPath,
                        fileType,
                    });
                }

                await Promise.all(taskArray.map((task) => saveFile(task)))
                    .then(() => {
                        ctx.response.body = {
                            status: 'success',
                            fileNames: links,
                            fileTypes: contentTypes,
                        };
                    })
                    .catch((err) => {
                        console.log(err.message);
                        ctx.response.status = 500;
                        ctx.response.body = {
                            status: 'error',
                            message: 'Unable to save file(s)',
                        };
                    });
            },
        );
    }
}

module.exports = FilesRouter;
