const readline = require('readline');
const mathUtils = require("./mathUtils");
const greeting = require("./greeting");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("--- Chương trình tính toán ---");

rl.question('Nhập số thứ nhất (a): ', (input1) => {
    rl.question('Nhập số thứ hai (b): ', (input2) => {
        
        const a = parseFloat(input1);
        const b = parseFloat(input2);

        console.log("-----------------------");
        
        if (isNaN(a) || isNaN(b)) {
            console.log("Lỗi: Vui lòng nhập đúng định dạng số!");
        } else {
            console.log(`Kết quả phép cộng (${a} + ${b}):`, mathUtils.add(a, b));
            console.log(`Kết quả phép trừ (${a} - ${b}):`, mathUtils.subtract(a, b));
            
            if (mathUtils.multiply) {
                console.log(`Kết quả phép nhân (${a} * ${b}):`, mathUtils.multiply(a, b));
            }
        }

        console.log("-----------------------");
        
        console.log(greeting.sayHello("Vo Van Vi")); 
        console.log(greeting.sayHello("Node.js Class"));

        rl.close();
    });
});