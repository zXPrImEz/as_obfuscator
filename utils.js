const config = as_obfuscator = require("./config.js"), Discord = require("discord.js"), chalk = require("chalk"), request = require('request'), fs = require("fs"), languages = config.languages

const aspect = (msg, language, status) => {
    if (!status == " " || !status == "" || !status == null || !status == undefined) {
        if (language) {
            console.log(chalk.magenta("[ASPECT]") + " >> " + chalk.blue(`[${language.toUpperCase()}]`) + " >> " + chalk.red(`[${status.toUpperCase()}]`) + " >> " +  chalk.white(msg));
        } else if (language == "Error") {
            console.log(chalk.magenta("[ASPECT]") + " >> " + chalk.red(`[${language.toUpperCase()}]`) + " >> " + chalk.red(`[${status.toUpperCase()}]`) + " >> " +  chalk.white(msg));
        } else if (language == "Success") {
            console.log(chalk.magenta("[ASPECT]") + " >> " + chalk.green(`[${language.toUpperCase()}]`) + " >> " + chalk.red(`[${status.toUpperCase()}]`) + " >> " +  chalk.white(msg));
        } else {
            console.log(chalk.magenta("[ASPECT]") + " >> " + chalk.red(`[${status.toUpperCase()}]`) + " >> " + chalk.white(msg));
        }
    } else {
        if (language) {
            console.log(chalk.magenta("[ASPECT]") + " >> " + chalk.blue(`[${language}]`) + " >> " +  chalk.white(msg));
        } else if (language == "Error") {
            console.log(chalk.magenta("[ASPECT]") + " >> " + chalk.red(`[${language}]`) + " >> " +  chalk.white(msg));
        } else if (language == "Success") {
            console.log(chalk.magenta("[ASPECT]") + " >> " + chalk.green(`[${language}]`) + " >> " +  chalk.white(msg));
        } else {
            console.log(chalk.magenta("[ASPECT]") + " >> " + chalk.white(msg));
        }
    }
}

const sleep = (ms) => {
    ms = ms * 1000
    return new Promise(resolve => setTimeout(resolve, ms));
}

wait = (max) => {
    return Math.floor(Math.random() * (max * 100 - 1 * 100) + 1 * 100) / (1*100);
}

const download = (url, file, type) => {
    switch (type) {
        case "file":
            return request.get(url).on('error', console.error).pipe(fs.createWriteStream('./temp/' + file.name));
        case "codeblock":
            return fs.writeFileSync(url, file);
    }
}

const isLanguageSupported = (extension) => {
    return languages.filter(language => language === extension).length > 0;
}

const getLanguageDisplay = (extension) => {
    switch (extension) {
        case 'js':
            return 'JAVASCRIPT';
        case 'lua':
            return 'LUA';
        case 'html':
            return 'HTML';
        case 'css':
            return 'CSS';
        case 'json':
            return 'JSON';
        case 'txt':
            return 'TEXT';
        case 'md':
            return 'MARKDOWN';
        case 'yml':
            return 'YAML';
        case 'yaml':
            return 'YAML';
        case 'xml':
            return 'XML';
        case 'sql':
            return 'SQL';
        case 'php':
            return 'PHP';
        case 'py':
            return 'PYTHON';
        case 'rb':
            return 'RUBY';
        case 'c':
            return 'C';
        case 'cpp':
            return 'CPP';
        case 'cs':
            return 'CSHARP';
        case 'java':
            return 'JAVA';
        case 'go':
            return 'GO';
        case 'hs':
            return 'HASKELL';
        case 'jsx':
            return 'JSX';
        case 'ts':
            return 'TYPESCRIPT';
        case 'tsx':
            return 'TSX';
        case 'vue':
            return 'VUE';
        default:
            return extension.toUpperCase();
    }
}

const EmbedTemplate = (type, description) => {
    if (type == "" || type == null) {
        type = "Info";
    }
    const Embed = new Discord.MessageEmbed()
        .setAuthor(name = `aspct.wtf › Obfuscator › ${type}`, iconURL = config.Design.LOGO)
        .setThumbnail(config.Design.LOGO)
        .setImage(config.Design.BANNER)
        .setTitle("aspct.wtf - obfuscation")
        .setDescription("> " + description)
        .setColor(config.Design.COLOR)
        .setTimestamp()
        .setFooter(text = 'aspct.wtf - obfuscation', iconURL = config.Design.LOGO);
    return Embed;
}

const clearTempFolder = async () => {
    const files = await fs.readdirSync("./temp/");
    const languagess = await languages.map(l => "." + l)

    await aspect("Scanning for files...", "Info");
    await sleep(Math.random() * (1 - 0.1) + 0.1);
    if (files.length == 0) {
        await aspect("No temporary files found", "Info");
        return false;
    }

    await aspect("Files: " + files.map(f => f).join(", ") + " found", "Info");
    for await (const file of files) {
        for await (const language of languagess) {
            if (file.endsWith(language)) {
                await aspect("Deleting temporary file: " + file, "Info");
                await fs.unlinkSync("./temp/" + file);
            }
        }
    }
}

const jsSettings = (type) => {
    let settings = null;

    switch (type) {
        case "administration":
            settings = {
                optionsPreset: 'high-obfuscation',
                target: 'browser',
                seed: 0,
                stringArray: true,
                stringArrayRotate: true,
                stringArrayShuffle: true,
                identifiersPrefix: 'aspect_',
            
                stringArrayThreshold: 0.05,
                stringArrayIndexShift: true,
                stringArrayIndexesType: ['hexadecimal-number'],
            
                stringArrayCallsTransform: true,
                stringArrayCallsTransformThreshold: 0.1,
                stringArrayWrappersCount: 100,
                stringArrayWrappersType: 'function',
                stringArrayWrappersChainedCalls: true,
                stringArrayWrappersParametersMaxCount: 100,
            
                selfDefending: true,
                debugProtection: true,
                disableConsoleOutput: false,
            
                debugProtectionInterval: 4000,
                ignoreImports: false,
            
                stringArrayEncoding: ['none', 'rc4', 'base64'],
                splitStrings: true,
                splitStringsChunkLength: 5,
                unicodeEscapeSequence: true,
            
                identifierNamesGenerator: 'hexadecimal',
                renameGlobals: true,
                compact: true,
                simplify: true,
                transformObjectKeys: true,
                numbersToExpressions: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 1,
            }
            return settings
        case "premium":
            settings = {
                optionsPreset: 'medium-obfuscation',
                target: 'browser',
                seed: 0,
                stringArray: true,
                stringArrayRotate: true,
                stringArrayShuffle: true,
                identifiersPrefix: 'aspect_premium_',
            
                stringArrayThreshold: 0.05,
                stringArrayIndexShift: true,
                stringArrayIndexesType: ['hexadecimal-number'],
            
                stringArrayCallsTransform: true,
                stringArrayCallsTransformThreshold: 0.1,
                stringArrayWrappersCount: 100,
                stringArrayWrappersType: 'variable',
                stringArrayWrappersChainedCalls: true,
                stringArrayWrappersParametersMaxCount: 100,
            
                selfDefending: false,
                debugProtection: false,
                disableConsoleOutput: false,
            
                debugProtectionInterval: 4000,
                ignoreImports: false,
            
                stringArrayEncoding: ['none', 'rc4'],
                splitStrings: true,
                splitStringsChunkLength: 5,
                unicodeEscapeSequence: true,
            
                identifierNamesGenerator: 'hexadecimal',
                renameGlobals: true,
                compact: true,
                simplify: true,
                transformObjectKeys: true,
                numbersToExpressions: true,
                controlFlowFlattening: false,
                controlFlowFlatteningThreshold: 1,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 1,
            }
            return settings
        case "free":
            settings = {
                optionsPreset: 'low-obfuscation',
                target: 'browser',
                seed: 0,
                stringArray: true,
                stringArrayRotate: true,
                stringArrayShuffle: true,
                identifiersPrefix: 'aspect_free_',
            
                stringArrayThreshold: 1,
                stringArrayIndexShift: true,
                stringArrayIndexesType: ['hexadecimal-number'],
            
                stringArrayCallsTransform: true,
                stringArrayCallsTransformThreshold: 1,
                stringArrayWrappersCount: 5,
                stringArrayWrappersType: 'variable',
                stringArrayWrappersChainedCalls: true,
                stringArrayWrappersParametersMaxCount: 5,
            
                selfDefending: true,
                debugProtection: false,
                disableConsoleOutput: false,
            
                debugProtectionInterval: 4000,
                ignoreImports: false,
            
                stringArrayEncoding: ['none'],
                splitStrings: true,
                splitStringsChunkLength: 5,
                unicodeEscapeSequence: true,
            
                identifierNamesGenerator: 'hexadecimal',
                renameGlobals: false,
                compact: true,
                simplify: true,
                transformObjectKeys: true,
                numbersToExpressions: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 1,
            }
            return settings
        case "html":
            settings = {
                optionsPreset: 'low-obfuscation',
                target: 'browser',
                seed: 0,
                stringArray: true,
                stringArrayRotate: true,
                stringArrayShuffle: true,
                identifiersPrefix: 'aspect_html_',
            
                stringArrayThreshold: 1,
                stringArrayIndexShift: true,
                stringArrayIndexesType: ['hexadecimal-number'],
            
                stringArrayCallsTransform: true,
                stringArrayCallsTransformThreshold: 1,
                stringArrayWrappersCount: 5,
                stringArrayWrappersType: 'variable',
                stringArrayWrappersChainedCalls: true,
                stringArrayWrappersParametersMaxCount: 5,
            
                selfDefending: false,
                debugProtection: false,
                disableConsoleOutput: false,
            
                debugProtectionInterval: 4000,
                ignoreImports: false,
            
                stringArrayEncoding: ['none'],
                splitStrings: true,
                splitStringsChunkLength: 5,
                unicodeEscapeSequence: true,
            
                identifierNamesGenerator: 'hexadecimal',
                renameGlobals: false,
                compact: true,
                simplify: true,
                transformObjectKeys: true,
                numbersToExpressions: true,
                controlFlowFlattening: false,
                controlFlowFlatteningThreshold: 1,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 1,
            }
            return settings
    }
}

module.exports = {
    aspect,
    sleep,
    download,
    isLanguageSupported,
    getLanguageDisplay,
    EmbedTemplate,
    jsSettings,
    config,
    clearTempFolder,
    chalk,
    wait
}