const tinify = require('tinify');
const fs = require('fs');
const path = require('path');

const filesDir = path.resolve('./');
tinify.key = 'bvR5u6weY6CI1vE9ttXodMStoO2L9wIZ';

// clear files
function deleteDir(path,cb){

    if (!fs.existsSync(path)) return;

    const files = fs.readdirSync(path);
    const rmdirDir = (path) => fs.existsSync(path) && fs.rmdirSync(path);

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

// copy Dir
function copyDir(beforePath, afterPath, cb=()=>{}){
    
    const files = fs.readdirSync(beforePath);
    fs.existsSync(afterPath) || fs.mkdirSync(afterPath);

    if (files.length>0){
        files.map(file =>{
            const status = fs.statSync(`${beforePath}/${file}`);
            if (status.isDirectory()){
                copyDir(`${beforePath}/${file}`, `${afterPath}/${file}`)
            }else{
                console.log(`写入了${afterPath}/${file}`);
                const source = tinify.fromFile(`${beforePath}/${file}`);
                source.toFile(`${afterPath}/${file}`);
            }
        })
    }  
}

fs.readdir(`${filesDir}/imgBox`, (err, files) => {
    if (err) throw err;

    if (!fs.existsSync(`${filesDir}/afterImgBox`)) { fs.mkdirSync(`${filesDir}/afterImgBox`)};

    deleteDir(`${filesDir}/afterImgBox`);
    
    copyDir(`${filesDir}/imgBox`, `${filesDir}/afterImgBox`);
});

