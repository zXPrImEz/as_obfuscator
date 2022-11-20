const JavaScriptObfuscator = require("javascript-obfuscator");
const { jsSettings } = require("./utils");
const obfuscateAPIJS = JavaScriptObfuscator.obfuscate;
const { minify } = require("html-minifier");
const css = require("css"),
  CleanCSS = require("clean-css"),
  cssParser = require("./Obfuscation/CSS/cssparser.js");
const { exec } = require("child_process");
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const { aspect, sleep } = require("./utils.js");
const { config, chalk } = require("./utils");

const obfuscate = async (file, code, type, status) => {
  let filename = file.name.split(".")[0];
  let filetype = file.name.split(".")[1];
  let language = filetype.toUpperCase();
  let obfCode = null;
  let html = null;
  let settings = null;
  if (!code == null || !code == "" || !code == " ") {
    code = code.toString("utf8");
  }

  switch (status) {
    case "administration":
      switch (type) {
        case "js":
          settings = jsSettings(status);
          obfCode = obfuscateAPIJS(code, settings);
          obfCode = obfCode.getObfuscatedCode();

          aspect("Watermarking...", language, status);
          await sleep(0.2);
          obfCode = `/* This file was Obfuscated by ascpt.wtf - discord.gg/aspectscripts [${config.General.Version}] */\n\n('aspct.wtf on top', () => {${obfCode}})();`;
          aspect("Watermarked!", language, status);
          return fs.writeFileSync(
            "./temp/" + filename + ".obfuscated." + filetype,
            obfCode
          );
        case "lua":
          exec("lua5.1 ./Obfuscation/Lua/cli.lua --preset Administration ./temp/" + file.name);
          await sleep(1.5);
          obfCode = fs.readFileSync(
            "./temp/" + filename + ".obfuscated." + filetype,
            "utf8"
          );
          aspect("Watermarking...", language, status);
          await sleep(0.05);
          obfCode = `--[[\n\tObfuscated by aspct.wtf [${config.General.Version}] - discord.gg/aspectscripts\n]]--\n\n("aspct.wtf on top"):gsub(".+", function(...)${obfCode}end)`;
          await sleep(0.05);
          aspect("Watermarked!", language, status);
          return fs.writeFileSync(
            "./temp/" + filename + ".obfuscated." + filetype,
            obfCode
          );
        case "html":
          html = code.replace(/([<]+ +[<])/g, "<").replace(/([>]+ +[>])/g, ">");
          await sleep(0.05);
          var result = minify(html, {
            removeAttributeQuotes: true,
            processConditionalComments: false,
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeOptionalTags: true,
          });
          let arrString = [];
          let randNumber = parseInt(Math.random() * 40000);
          for (var i = 0; i < result.length; i++) {
            arrString.push(`x${result.charCodeAt(i) + randNumber}`);
          }
          obfCode = `var s=\`${JSON.stringify(
            arrString
          )}\`;var m="";var mm=JSON.parse(s);for(var i=0;i<mm.length;i++)m+=String.fromCharCode(parseInt(mm[i].substring(1,mm[i].length))-${randNumber});document.write(m);setTimeout(()=>{var sc=document.getElementsByTagName('script');while(sc.length > 0)sc[0].remove();},1000);`;
          aspect("Obfuscating JavaScript...", language, status);
          obfCode = obfuscateAPIJS(obfCode, jsSettings("html"));
          obfCode = obfCode.getObfuscatedCode();
          await sleep(0.05);
          aspect("JavaScript Obfuscated!", language, status);
          obfCode = `<!--\n\n\tThis file was Obfuscated by ascpt.wtf [${config.General.Version}]\n\n-->\n\n<script>${obfCode}</script><noscript>You must enable JavaScript to see this text.</noscript>`;
          await sleep(0.05);
          return fs.writeFileSync(
            "./temp/" + filename + ".obfuscated." + filetype,
            obfCode
          );
        case "css":
          let obj = cssParser(code);
          let newCSSObject = {
            type: "stylesheet",
            stylesheet: { source: undefined, rules: [], parsingErrors: [] },
          };

          obj.stylesheet.rules.forEach((rules) => {
            if (rules.type == "rule") {
              rules.declarations.forEach((declaration) => {
                newCSSObject.stylesheet.rules.push({
                  type: rules.type,
                  selectors: rules.selectors,
                  declarations: [declaration],
                  position: null,
                });
              });
            } else {
              newCSSObject.stylesheet.rules.push(rules);
            }
          });

          obfCode = css.stringify(newCSSObject);
          obfCode = `/*\n*  This file was Obfuscated by ascpt.wtf - discord.gg/aspectscripts [${config.General.Version
            }]\n*/\n\n${new CleanCSS({}).minify(obfCode).styles}`;
          await sleep(0.05);
          return fs.writeFileSync(
            "./temp/" + filename + ".obfuscated." + filetype,
            obfCode
          );
      }
      break;
    case "premium":
      switch (type) {
        case "js":
          settings = jsSettings(status);
          obfCode = obfuscateAPIJS(code, settings);
          obfCode = obfCode.getObfuscatedCode();

          aspect("Watermarking...", language, status);
          await sleep(0.1);
          obfCode = `/* This file was Obfuscated by ascpt.wtf - discord.gg/aspectscripts [${config.General.Version}] */\n\n('aspct.wtf on top', () => {${obfCode}})();`;
          aspect("Watermarked!", language, status);
          return fs.writeFileSync(
            "./temp/" + filename + ".obfuscated." + filetype,
            obfCode
          );
        case "lua":
          exec(
            "lua5.1 ./Obfuscation/Lua/cli.lua --preset Premium ./temp/" +
            file.name
          );
          await sleep(1);
          obfCode = fs.readFileSync(
            "./temp/" + filename + ".obfuscated." + filetype,
            "utf8"
          );
          aspect("Watermarking...", language, status);
          await sleep(0.25);
          obfCode = `--[[\n\tObfuscated by aspct.wtf [${config.General.Version}] - discord.gg/aspectscripts\n]]--\n\n("aspct.wtf on top"):gsub(".+", function(...)${obfCode}end)`;
          await sleep(0.25);
          aspect("Watermarked!", language, status);
          return fs.writeFileSync(
            "./temp/" + filename + ".obfuscated." + filetype,
            obfCode
          );
        case "html":
          html = code.replace(/([<]+ +[<])/g, "<").replace(/([>]+ +[>])/g, ">");
          await sleep(0.05);
          var result = minify(html, {
            removeAttributeQuotes: true,
            processConditionalComments: false,
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeOptionalTags: true,
          });
          let arrString = [];
          let randNumber = parseInt(Math.random() * 40000);
          for (var i = 0; i < result.length; i++) {
            arrString.push(`x${result.charCodeAt(i) + randNumber}`);
          }
          obfCode = `var s=\`${JSON.stringify(
            arrString
          )}\`;var m="";var mm=JSON.parse(s);for(var i=0;i<mm.length;i++)m+=String.fromCharCode(parseInt(mm[i].substring(1,mm[i].length))-${randNumber});document.write(m);setTimeout(()=>{var sc=document.getElementsByTagName('script');while(sc.length > 0)sc[0].remove();},1000);`;
          aspect("Obfuscating JavaScript...", language, status);
          obfCode = obfuscateAPIJS(obfCode, jsSettings("html"));
          obfCode = obfCode.getObfuscatedCode();
          await sleep(0.05);
          aspect("JavaScript Obfuscated!", language, status);
          aspect("Watermarking...", language, status);
          await sleep(0.05);
          obfCode = `<!--\n\n\tThis file was Obfuscated by ascpt.wtf [${config.General.Version}]\n\n-->\n\n<script>${obfCode}</script><noscript>You must enable JavaScript to see this text.</noscript>`;
          await sleep(0.05);
          aspect("Watermarked!", language, status);
          return fs.writeFileSync(
            "./temp/" + filename + ".obfuscated." + filetype,
            obfCode
          );
        case "css":
          let obj = cssParser(code);
          let newCSSObject = {
            type: "stylesheet",
            stylesheet: { source: undefined, rules: [], parsingErrors: [] },
          };

          obj.stylesheet.rules.forEach((rules) => {
            if (rules.type == "rule") {
              rules.declarations.forEach((declaration) => {
                newCSSObject.stylesheet.rules.push({
                  type: rules.type,
                  selectors: rules.selectors,
                  declarations: [declaration],
                  position: null,
                });
              });
            } else {
              newCSSObject.stylesheet.rules.push(rules);
            }
          });

          obfCode = css.stringify(newCSSObject);
          obfCode = `/*\n*  This file was Obfuscated by ascpt.wtf - discord.gg/aspectscripts [${config.General.Version
            }]\n*/\n\n${new CleanCSS({}).minify(obfCode).styles}`;
          await sleep(0.05);
          return fs.writeFileSync(
            "./temp/" + filename + ".obfuscated." + filetype,
            obfCode
          );
      }
      break;
    case "free":
      switch (type) {
        case "js":
          settings = jsSettings(status);
          obfCode = obfuscateAPIJS(code, settings);
          obfCode = obfCode.getObfuscatedCode();

          aspect("Watermarking...", language, status);
          await sleep(0.2);
          obfCode = `/* This file was Obfuscated by ascpt.wtf - discord.gg/aspectscripts [${config.General.Version}] */\n\n('aspct.wtf on top', () => {${obfCode}})();`;
          aspect("Watermarked!", language, status);
          return fs.writeFileSync(
            "./temp/" + filename + ".obfuscated." + filetype,
            obfCode
          );
        case "lua":
          exec(
            "lua5.1 ./Obfuscation/Lua/cli.lua --preset Free ./temp/" + file.name
          );
          await sleep(1);
          obfCode = fs.readFileSync("./temp/" + filename + ".obfuscated." + filetype, "utf8");
          aspect("Watermarking...", language, status);
          await sleep(0.25);
          obfCode = `--[[\n\tObfuscated by aspct.wtf [${config.General.Version}] - discord.gg/aspectscripts\n]]--\n\n("aspct.wtf on top"):gsub(".+", function(...)${obfCode}end)`;
          await sleep(0.25);
          aspect("Watermarked!", language, status);
          return fs.writeFileSync(
            "./temp/" + filename + ".obfuscated." + filetype,
            obfCode
          );
        case "html":
          html = code.replace(/([<]+ +[<])/g, "<").replace(/([>]+ +[>])/g, ">");
          await sleep(0.05);
          var result = minify(html, {
            removeAttributeQuotes: true,
            processConditionalComments: false,
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeOptionalTags: true,
          });
          let arrString = [];
          let randNumber = parseInt(Math.random() * 40000);
          for (var i = 0; i < result.length; i++) {
            arrString.push(`x${result.charCodeAt(i) + randNumber}`);
          }
          obfCode = `var s=\`${JSON.stringify(
            arrString
          )}\`;var m="";var mm=JSON.parse(s);for(var i=0;i<mm.length;i++)m+=String.fromCharCode(parseInt(mm[i].substring(1,mm[i].length))-${randNumber});document.write(m);setTimeout(()=>{var sc=document.getElementsByTagName('script');while(sc.length > 0)sc[0].remove();},1000);`;
          aspect("Watermarking...", language, status);
          await sleep(0.05);
          obfCode = `<!--\n\n\tThis file was Obfuscated by ascpt.wtf [${config.General.Version}]\n\n-->\n\n<script>${obfCode}</script><noscript>You must enable JavaScript to see this text.</noscript>`;
          await sleep(0.05);
          aspect("Watermarked!", language, status);
          return fs.writeFileSync(
            "./temp/" + filename + ".obfuscated." + filetype,
            obfCode
          );
        case "css":
          let obj = cssParser(code);
          let newCSSObject = {
            type: "stylesheet",
            stylesheet: { source: undefined, rules: [], parsingErrors: [] },
          };

          obj.stylesheet.rules.forEach((rules) => {
            if (rules.type == "rule") {
              rules.declarations.forEach((declaration) => {
                newCSSObject.stylesheet.rules.push({
                  type: rules.type,
                  selectors: rules.selectors,
                  declarations: [declaration],
                  position: null,
                });
              });
            } else {
              newCSSObject.stylesheet.rules.push(rules);
            }
          });

          obfCode = css.stringify(newCSSObject);
          obfCode = `/*\n*  This file was Obfuscated by ascpt.wtf - discord.gg/aspectscripts [${config.General.Version
            }]\n*/\n\n${new CleanCSS({}).minify(obfCode).styles}`;
          await sleep(0.05);
          return fs.writeFileSync(
            "./temp/" + filename + ".obfuscated." + filetype,
            obfCode
          );
      }
      break;
  }
};

module.exports = obfuscate;
