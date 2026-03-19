const fs = require('fs');
const zlib = require('zlib');
const { pipeline } = require('stream'); 

const nenFile = (inputFile, outputFile) => {
  const source = fs.createReadStream(inputFile);
  const destination = fs.createWriteStream(outputFile);
  const gzip = zlib.createGzip(); 

  pipeline(source, gzip, destination, (err) => {
    if (err) {
      console.error(' Lỗi khi nén:', err);
    } else {
      console.log(` Đã nén thành công: ${outputFile}`);
    }
  });
};

const giaiNenFile = (inputFile, outputFile) => {
  const source = fs.createReadStream(inputFile);
  const destination = fs.createWriteStream(outputFile);
  const gunzip = zlib.createGunzip(); 

  pipeline(source, gunzip, destination, (err) => {
    if (err) {
      console.error(' Lỗi khi giải nén:', err);
    } else {
      console.log(` Đã giải nén thành công: ${outputFile}`);
    }
  });
};
