const fs = require('fs');
const filePath = 'public/index.html';

// 读取文件内容
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

let inFunction = false;
let functionStart = -1;
let functionEnd = -1;

// 找到setupTmdbProxy函数的开始和结束位置
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('async setupTmdbProxy(proxyUrl) {')) {
        inFunction = true;
        functionStart = i;
    }
    if (inFunction && line.includes('},') && functionStart !== -1) {
        functionEnd = i;
        break;
    }
}

if (functionStart !== -1 && functionEnd !== -1) {
    // 替换函数内容
    const indentation = lines[functionStart].match(/^\s*/)[0];
    const newFunctionLines = [
        `${indentation}// 设置 TMDB 反代（总是使用配置的代理）`,
        `${indentation}async setupTmdbProxy(proxyUrl) {`,
        `${indentation}    console.log('[TMDB反代] 已启用配置的代理:', proxyUrl);`,
        `${indentation}    TMDB_BASE_URL = proxyUrl + '/3';`,
        `${indentation}    TMDB_IMG_URL = proxyUrl + '/t/p/w342';`,
        `${indentation}    TMDB_BACKDROP_URL = proxyUrl + '/t/p/original';`,
        `${indentation}},`
    ];
    
    // 替换函数
    const newLines = [...lines.slice(0, functionStart - 1), ...newFunctionLines, ...lines.slice(functionEnd + 1)];
    const newContent = newLines.join('\n');
    
    // 写回文件
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('setupTmdbProxy函数修改成功');
    console.log(`函数位置: 从第 ${functionStart} 行到第 ${functionEnd} 行`);
} else {
    console.log('未找到setupTmdbProxy函数');
}