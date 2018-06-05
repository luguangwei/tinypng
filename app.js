const tinify = require('tinify');
const fs = require('fs');
const path = require('path');

const filesDir = path.resolve('./');
tinify.key = 'bvR5u6weY6CI1vE9ttXodMStoO2L9wIZ';

// clear files
function deleteDir(path,cb){

    if (!fs.existsSync(path)) return;

    const files = fs.readdirSync(path);
    const rmdirDir = (path) => fs.rmdirSync(path);

    if (files.length > 0){
        files.map(file =>{
            const filePath = `${path}/${file}`;
            const status = fs.statSync(filePath);
            if (status.isDirectory()){
                // 回调来删除已经被删空的空文件夹
                deleteDir(filePath, (filePath) => rmdirDir(filePath));
            }else{
                fs.unlinkSync(filePath);
                console.log(`删除了${filePath}`);
            }
        })
    }else{
        rmdirDir(path);
    }
    cb && cb(path);
}

fs.readdir(`${filesDir}/imgBox`, (err, files) => {
    if (err) throw err;

    deleteDir(`${filesDir}/afterImgBox`);
    if (!fs.existsSync(`${filesDir}/afterImgBox`)) { fs.mkdirSync(`${filesDir}/afterImgBox`)};
   
    files.map( fileName =>{
        const source = tinify.fromFile(`${filesDir}/imgBox/${fileName}`);
        source.toFile(`${filesDir}/afterImgBox/${fileName}`);
    })
});

