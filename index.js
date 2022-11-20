const Discord = require('discord.js'),
  client = new Discord.Client(),
  fs = require('fs'),
  obfuscate = require('./obfuscate.js'),
  {
    aspect,
    sleep,
    config,
    isLanguageSupported,
    getLanguageDisplay,
    clearTempFolder,
    download,
    EmbedTemplate,
    wait
  } = require('./utils.js'),
  languages = config.languages

aspect('Starting up...')
if (!clearTempFolder()) {
  return
}

process
  .on('ready', (err) => {
    if (err) {
      aspect(err)
    }
  })
  .on('uncaughtException', (err) => {
    aspect('Uncaught Exception: ' + err)
  })
  .on('unhandledRejection', (err) => {
    aspect('Uncaught Rejection: ' + err)
  })
  .on('warning', (err) => {
    aspect('Warning: ' + err)
  })
  .on('exit', (err) => {
    aspect('Exit: ' + err)
  })

client.on('ready', (err) => {
  if (err) {
    aspect(err)
    return
  }
  aspect(`Logged in as ${client.user.tag}!`)
  setInterval(() => {
    const randomLanguage =
      languages[Math.floor(Math.random() * languages.length)]

    client.user.setActivity({
      name: randomLanguage + ' Obfuscator | aspct.wtf',
      type: 'WATCHING',
    })
  }, 5000)
  client.user.setActivity({
    name: 'Obfuscator | aspct.wtf',
    type: 'PLAYING',
  })
})

client.on('message', async (message) => {
  if (message.author.bot) return
  if (message.channel.id != config.General.Channel) return

  if (message.content.startsWith('!obfsetup')) {
    message.delete()

    if (!config.Administration.includes(message.author.id)) {
      return message.author.send({
        embed: EmbedTemplate(
          'Error',
          'You are not whitelisted to use this command!',
        ),
      })
    }

    let Embed = new Discord.MessageEmbed()
      .setAuthor(
        (name = `aspct.wtf › Obfuscator`),
        (iconURL = config.Design.LOGO),
      )
      .setThumbnail(config.Design.LOGO)
      .setImage(config.Design.BANNER)
      .setDescription(
        `> Send a \`file / code-block\` in this channel to obfuscate`,
      )
      .setColor(config.Design.COLOR)
      .setTimestamp()
      .addFields({
        name: '<:as_box:1011065102658699408> Languages',
        value: `\` ${languages
          .map((l) => getLanguageDisplay(l))
          .join(' ` ` ')} \``,
        inline: true,
      })
      .setFooter(
        (text = 'aspct.wtf - obfuscation'),
        (iconURL = config.Design.LOGO),
      )
    return message.channel.send({ embed: Embed })
  }

  if (message.channel.type == 'dm') {
    message.delete()
    return message.author.send({
      embed: EmbedTemplate('Error', "You cant obfuscate in DM's!"),
    })
  }

  if (message.attachments.size === 0) {
    let codeBlock = message.content.substring(3)
    let language = codeBlock.split('\n')[0]
    let code = codeBlock.split('\n').slice(1).join('\n').slice(0, -3)
    if (code.endsWith('\n')) code = code.slice(0, -1)
    let file = {
      name: message.author.id + '.' + language,
    }
    let filename = message.author.id
    let time = Date.now()
    let type = 'FREE'

    if (!fs.existsSync('./temp')) {
      aspect('Directory not found, creating...')
      fs.mkdirSync('./temp')
    }

    if (!isLanguageSupported(language)) {
      message.delete()
      return message.channel.send({
        embed: EmbedTemplate('Error', 'This File Type is not supported'),
      })
    }

    download('./temp/' + file.name, code, 'codeblock')
    await message.delete()
    await sleep(1)

    let DownloadingEmbed = new Discord.MessageEmbed()
      .setAuthor(
        (name = `aspct.wtf › Obfuscator › Downloading`),
        (iconURL = config.Design.LOGO),
      )
      .setThumbnail(config.Design.LOGO)
      .setImage(config.Design.BANNER)
      .setDescription(`> Currently downloading \`CODEBLOCK\``)
      .setColor(config.Design.COLOR)
      .setTimestamp()
      .addFields(
        {
          name: '<:as_loading:1011773268040105995> Language',
          value: `\`LOADING. . .\``,
          inline: true,
        },
        {
          name: '<:as_loading:1011773268040105995> Type',
          value: `\`LOADING. . .\``,
          inline: true,
        },
        {
          name: '<:as_loading:1011773268040105995> Downloading. . .',
          value: `\`LOADING. . .\``,
          inline: true,
        },
      )
      .setFooter(
        (text = 'aspct.wtf - obfuscation'),
        (iconURL = config.Design.LOGO),
      )

    let DownloadedEmbed = new Discord.MessageEmbed()
      .setAuthor(
        (name = `aspct.wtf › Obfuscator › Downloaded`),
        (iconURL = config.Design.LOGO),
      )
      .setThumbnail(config.Design.LOGO)
      .setImage(config.Design.BANNER)
      .setDescription(`> Successfully downloaded \`CODEBLOCK\``)
      .setColor(config.Design.COLOR)
      .setTimestamp()
      .addFields(
        {
          name: '<:as_box:1011065102658699408> Language',
          value: `\`${getLanguageDisplay(language)}\``,
          inline: true,
        },
        {
          name: '<:as_time:1011755546245877820> Download Time',
          value: `\`${(Date.now() - time) / 1000}s\``,
          inline: true,
        },
      )
      .setFooter(
        (text = 'aspct.wtf - obfuscation'),
        (iconURL = config.Design.LOGO),
      )

    let ObfuscateEmbed = (type) => {
      return new Discord.MessageEmbed()
        .setAuthor(
          (name = `aspct.wtf › Obfuscator › Obfuscating`),
          (iconURL = config.Design.LOGO),
        )
        .setThumbnail(config.Design.LOGO)
        .setImage(config.Design.BANNER)
        .setDescription(`> Currently Obfuscating \`CODEBLOCK\``)
        .setColor(config.Design.COLOR)
        .setTimestamp()
        .addFields(
          {
            name: '<:as_loading:1011773268040105995> Language',
            value: `\`LOADING. . .\``,
            inline: true,
          },
          {
            name: '<:as_loading:1011773268040105995> Type',
            value: `\`LOADING. . .\``,
            inline: true,
          },
          {
            name: '<:as_loading:1011773268040105995> Obfuscating. . .',
            value: `\`LOADING. . .\``,
            inline: true,
          },
        )
        .setFooter(
          (text = 'aspct.wtf - obfuscation'),
          (iconURL = config.Design.LOGO),
        )
    }

    let ObfuscatedEmbed = (type, time) => {
      return new Discord.MessageEmbed()
        .setAuthor(
          (name = `aspct.wtf › Obfuscator › Obfuscated`),
          (iconURL = config.Design.LOGO),
        )
        .setThumbnail(config.Design.LOGO)
        .setImage(config.Design.BANNER)
        .setDescription(`> Successfully Obfuscated \`CODEBLOCK\``)
        .setColor(config.Design.COLOR)
        .setTimestamp()
        .addFields(
          {
            name: '<:as_box:1011065102658699408> Language',
            value: `\`${getLanguageDisplay(language)}\``,
            inline: true,
          },
          {
            name: '<:as_discord:1011764345664966656> Type',
            value: `\`${type}\``,
            inline: true,
          },
          {
            name: '<:as_time:1011755546245877820> Compile Time',
            value: `\`${time}\``,
            inline: true,
          },
        )
        .setFooter(
          (text = 'aspct.wtf - obfuscation'),
          (iconURL = config.Design.LOGO),
        )
    }

    let ObfuscateFailedEmbed = new Discord.MessageEmbed()
      .setAuthor(
        (name = `aspct.wtf › Obfuscator › Failed`),
        (iconURL = config.Design.LOGO),
      )
      .setThumbnail(config.Design.LOGO)
      .setImage(config.Design.BANNER)
      .setDescription(
        `> Failed to Obfuscate \`CODEBLOCK\`\n> Reason: \`${language.toUpperCase()} CODE NOT WORKING\``,
      )
      .setColor(config.Design.COLOR)
      .setTimestamp()
      .addFields(
        {
          name: '<:as_failed:1011772850732027964> Language',
          value: `\`COULDN'T LOAD\``,
          inline: true,
        },
        {
          name: '<:as_failed:1011772850732027964> Type',
          value: `\`COULDN'T LOAD\``,
          inline: true,
        },
        {
          name: '<:as_failed:1011772850732027964> Compile Time',
          value: `\`FAILED\``,
          inline: true,
        },
      )
      .setFooter(
        (text = 'aspct.wtf - obfuscation'),
        (iconURL = config.Design.LOGO),
      )

    let Aspect = await message.channel.send({ embed: DownloadingEmbed })
    await sleep(wait(0.4))
    await Aspect.edit({ embed: DownloadedEmbed })

    let fileData = fs.readFileSync('./temp/' + file.name, (err) => {
      if (err) throw err
    })

    time = Date.now()
    if (
      config.Administration.includes(message.author.id) &&
      config.Premium.includes(message.author.id)
    ) {
      type = 'ADMINISTRATION'
      await Aspect.edit({ embed: ObfuscateEmbed(type) })
      aspect(`${message.author.tag} is obfuscating a codeblock`)
      aspect('Obfuscating...', language.toUpperCase())
      if (language == 'js' || language == 'html' || language == 'css') {
        await obfuscate(file, fileData, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      } else {
        await fs.writeFileSync(
          "./temp/" + filename + ".lua",
          fileData
        );
        await sleep(0.5)
        await obfuscate(file, null, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      }
      await sleep(0.1)
      time = (Date.now() - time) / 1000 + 's'
      let DMEmbed = await message.author.send({
        embed: EmbedTemplate('Info', 'Waiting for Data...'),
      })
      await message.author
        .send({ files: ['./temp/' + filename + '.obfuscated.' + language] })
        .then(async () => {
          await Aspect.edit({ embed: ObfuscatedEmbed(type, time) })
          await DMEmbed.edit({
            embed: EmbedTemplate('Success', 'Successfully Obfuscated!'),
          })
          aspect('Obfuscated!', language.toUpperCase())
          await sleep(0.1)
          await clearTempFolder()
          aspect(`${message.author.tag} has obfuscated a codeblock`)
        })
        .catch(async (err) => {
          if (err) {
            console.log(err),
              await DMEmbed.edit({
                embed: EmbedTemplate('Failed', 'Obfuscation Failed!'),
              })
            await Aspect.edit({ embed: ObfuscateFailedEmbed })
            aspect('Obfuscated!', language.toUpperCase())
            await sleep(0.1)
            await clearTempFolder()
            aspect(
              `${message.author.tag
              } hasn't obfuscated a codeblock | Reason: ${language.toUpperCase()} CODE NOT WORKING`,
            )
          }
        })
    }

    if (config.Administration.includes(message.author.id)) {
      type = 'ADMINISTRATION'
      await Aspect.edit({ embed: ObfuscateEmbed(type) })
      aspect(`${message.author.tag} is obfuscating a codeblock`)
      aspect('Obfuscating...', language.toUpperCase())
      if (language == 'js' || language == 'html' || language == 'css') {
        await obfuscate(file, fileData, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      } else {
        await fs.writeFileSync(
          "./temp/" + filename + ".lua",
          fileData
        );
        await sleep(0.5)
        await obfuscate(file, null, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      }
      await sleep(0.1)
      time = (Date.now() - time) / 1000 + 's'
      let DMEmbed = await message.author.send({
        embed: EmbedTemplate('Info', 'Waiting for Data...'),
      })
      await message.author
        .send({ files: ['./temp/' + filename + '.obfuscated.' + language] })
        .then(async () => {
          await Aspect.edit({ embed: ObfuscatedEmbed(type, time) })
          await DMEmbed.edit({
            embed: EmbedTemplate('Success', 'Successfully Obfuscated!'),
          })
          aspect('Obfuscated!', language.toUpperCase())
          await sleep(0.1)
          await clearTempFolder()
          aspect(`${message.author.tag} has obfuscated a codeblock`)
        })
        .catch(async (err) => {
          if (err) {
            console.log(err),
              await DMEmbed.edit({
                embed: EmbedTemplate('Failed', 'Obfuscation Failed!'),
              })
            await Aspect.edit({ embed: ObfuscateFailedEmbed })
            aspect('Obfuscated!', language.toUpperCase())
            await sleep(0.1)
            await clearTempFolder()
            aspect(
              `${message.author.tag
              } hasn't obfuscated a codeblock | Reason: ${language.toUpperCase()} CODE NOT WORKING`,
            )
          }
        })
    }

    if (config.Premium.includes(message.author.id)) {
      type = 'PREMIUM'
      await Aspect.edit({ embed: ObfuscateEmbed(type) })
      aspect(`${message.author.tag} is obfuscating a codeblock`)
      aspect('Obfuscating...', language.toUpperCase())
      if (language == 'js' || language == 'html' || language == 'css') {
        await obfuscate(file, fileData, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      } else {
        await fs.writeFileSync(
          "./temp/" + filename + ".lua",
          fileData
        );
        await sleep(0.5)
        await obfuscate(file, null, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      }
      await sleep(0.1)
      time = (Date.now() - time) / 1000 + 's'
      let DMEmbed = await message.author.send({
        embed: EmbedTemplate('Info', 'Waiting for Data...'),
      })
      await message.author
        .send({ files: ['./temp/' + filename + '.obfuscated.' + language] })
        .then(async () => {
          await Aspect.edit({ embed: ObfuscatedEmbed(type, time) })
          await DMEmbed.edit({
            embed: EmbedTemplate('Success', 'Successfully Obfuscated!'),
          })
          aspect('Obfuscated!', language.toUpperCase())
          await sleep(0.1)
          await clearTempFolder()
          aspect(`${message.author.tag} has obfuscated a codeblock`)
        })
        .catch(async (err) => {
          if (err) {
            console.log(err),
              await DMEmbed.edit({
                embed: EmbedTemplate('Failed', 'Obfuscation Failed!'),
              })
            await Aspect.edit({ embed: ObfuscateFailedEmbed })
            aspect('Obfuscated!', language.toUpperCase())
            await sleep(0.1)
            await clearTempFolder()
            aspect(
              `${message.author.tag
              } hasn't obfuscated a codeblock | Reason: ${language.toUpperCase()} CODE NOT WORKING`,
            )
          }
        })
    }

    if (
      !config.Premium.includes(message.author.id) &&
      !config.Administration.includes(message.author.id)
    ) {
      type = 'FREE'
      await Aspect.edit({ embed: ObfuscateEmbed(type) })
      aspect(`${message.author.tag} is obfuscating a codeblock`)
      aspect('Obfuscating...', language.toUpperCase())
      if (language == 'js' || language == 'html' || language == 'css') {
        await obfuscate(file, fileData, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      } else {
        await fs.writeFileSync(
          "./temp/" + filename + ".lua",
          fileData
        );
        await sleep(0.5)
        await obfuscate(file, null, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      }
      await sleep(0.1)
      time = (Date.now() - time) / 1000 + 's'
      let DMEmbed = await message.author.send({
        embed: EmbedTemplate('Info', 'Waiting for Data...'),
      })
      await message.author
        .send({ files: ['./temp/' + filename + '.obfuscated.' + language] })
        .then(async () => {
          await Aspect.edit({ embed: ObfuscatedEmbed(type, time) })
          await DMEmbed.edit({
            embed: EmbedTemplate('Success', 'Successfully Obfuscated!'),
          })
          aspect('Obfuscated!', language.toUpperCase())
          await sleep(0.1)
          await clearTempFolder()
          aspect(`${message.author.tag} has obfuscated a codeblock`)
        })
        .catch(async (err) => {
          if (err) {
            await DMEmbed.edit({
              embed: EmbedTemplate('Failed', 'Obfuscation Failed!'),
            })
            await Aspect.edit({ embed: ObfuscateFailedEmbed })
            aspect('Obfuscated!', language.toUpperCase())
            await sleep(0.1)
            await clearTempFolder()
            aspect(
              `${message.author.tag
              } hasn't obfuscated a codeblock | Reason: ${language.toUpperCase()} CODE NOT WORKING`,
            )
          }
        })
    }
    return aspect('------------------------------')
  }

  if (message.attachments.first()) {
    let file = message.attachments.first()
    let filename = file.name.split('.')[0]
    let filetype = file.name.split('.')[1]
    let language = filetype
    let obfuscated = null
    let time = Date.now()
    let type = "Could'nt Load"

    if (!fs.existsSync('./temp')) {
      aspect('Directory not found, creating...')
      fs.mkdirSync('./temp')
    }

    if (!isLanguageSupported(filetype)) {
      message.delete()
      return message.channel.send({
        embed: EmbedTemplate('Error', 'This File Type is not supported'),
      })
    }

    download(message.attachments.first().url, file, 'file')
    message.delete()
    await sleep(1)

    await sleep(wait(1.1))

    let DownloadingEmbed = new Discord.MessageEmbed()
      .setAuthor(
        (name = `aspct.wtf › Obfuscator › Downloading`),
        (iconURL = config.Design.LOGO),
      )
      .setThumbnail(config.Design.LOGO)
      .setImage(config.Design.BANNER)
      .setDescription(`> Currently downloading \`${file.name}\``)
      .setColor(config.Design.COLOR)
      .setTimestamp()
      .addFields(
        {
          name: '<:as_loading:1011773268040105995> Language',
          value: `\`LOADING. . .\``,
          inline: true,
        },
        {
          name: '<:as_loading:1011773268040105995> Type',
          value: `\`LOADING. . .\``,
          inline: true,
        },
        {
          name: '<:as_loading:1011773268040105995> Downloading. . .',
          value: `\`LOADING. . .\``,
          inline: true,
        },
      )
      .setFooter(
        (text = 'aspct.wtf - obfuscation'),
        (iconURL = config.Design.LOGO),
      )

    let DownloadedEmbed = new Discord.MessageEmbed()
      .setAuthor(
        (name = `aspct.wtf › Obfuscator › Downloaded`),
        (iconURL = config.Design.LOGO),
      )
      .setThumbnail(config.Design.LOGO)
      .setImage(config.Design.BANNER)
      .setDescription(`> Successfully downloaded \`${file.name}\``)
      .setColor(config.Design.COLOR)
      .setTimestamp()
      .addFields(
        {
          name: '<:as_box:1011065102658699408> Language',
          value: `\`${getLanguageDisplay(language)}\``,
          inline: true,
        },
        {
          name: '<:as_time:1011755546245877820> Download Time',
          value: `\`${(Date.now() - time) / 1000}s\``,
          inline: true,
        },
      )
      .setFooter(
        (text = 'aspct.wtf - obfuscation'),
        (iconURL = config.Design.LOGO),
      )

    let ObfuscateEmbed = (type) => {
      return new Discord.MessageEmbed()
        .setAuthor(
          (name = `aspct.wtf › Obfuscator › Obfuscating`),
          (iconURL = config.Design.LOGO),
        )
        .setThumbnail(config.Design.LOGO)
        .setImage(config.Design.BANNER)
        .setDescription(`> Currently Obfuscating \`${file.name}\``)
        .setColor(config.Design.COLOR)
        .setTimestamp()
        .addFields(
          {
            name: '<:as_loading:1011773268040105995> Language',
            value: `\`LOADING. . .\``,
            inline: true,
          },
          {
            name: '<:as_loading:1011773268040105995> Type',
            value: `\`LOADING. . .\``,
            inline: true,
          },
          {
            name: '<:as_loading:1011773268040105995> Obfuscating. . .',
            value: `\`LOADING. . .\``,
            inline: true,
          },
        )
        .setFooter(
          (text = 'aspct.wtf - obfuscation'),
          (iconURL = config.Design.LOGO),
        )
    }

    let ObfuscatedEmbed = (type, time) => {
      return new Discord.MessageEmbed()
        .setAuthor(
          (name = `aspct.wtf › Obfuscator › Obfuscated`),
          (iconURL = config.Design.LOGO),
        )
        .setThumbnail(config.Design.LOGO)
        .setImage(config.Design.BANNER)
        .setDescription(`> Successfully Obfuscated \`${file.name}\``)
        .setColor(config.Design.COLOR)
        .setTimestamp()
        .addFields(
          {
            name: '<:as_box:1011065102658699408> Language',
            value: `\`${getLanguageDisplay(language)}\``,
            inline: true,
          },
          {
            name: '<:as_discord:1011764345664966656> Type',
            value: `\`${type}\``,
            inline: true,
          },
          {
            name: '<:as_time:1011755546245877820> Compile Time',
            value: `\`${time}\``,
            inline: true,
          },
        )
        .setFooter(
          (text = 'aspct.wtf - obfuscation'),
          (iconURL = config.Design.LOGO),
        )
    }

    let ObfuscateFailedEmbed = new Discord.MessageEmbed()
      .setAuthor(
        (name = `aspct.wtf › Obfuscator › Failed`),
        (iconURL = config.Design.LOGO),
      )
      .setThumbnail(config.Design.LOGO)
      .setImage(config.Design.BANNER)
      .setDescription(
        `> Failed to Obfuscate \`${file.name}\`\n> Reason: \`${language.toUpperCase()} CODE NOT WORKING\``,
      )
      .setColor(config.Design.COLOR)
      .setTimestamp()
      .addFields(
        {
          name: '<:as_failed:1011772850732027964> Language',
          value: `\`COULDN'T LOAD\``,
          inline: true,
        },
        {
          name: '<:as_failed:1011772850732027964> Type',
          value: `\`COULDN'T LOAD\``,
          inline: true,
        },
        {
          name: '<:as_failed:1011772850732027964> Compile Time',
          value: `\`FAILED\``,
          inline: true,
        },
      )
      .setFooter(
        (text = 'aspct.wtf - obfuscation'),
        (iconURL = config.Design.LOGO),
      )

    let Aspect = await message.channel.send({ embed: DownloadingEmbed })
    await sleep(wait(0.7))
    await Aspect.edit({ embed: DownloadedEmbed })

    let fileData = fs.readFileSync('./temp/' + file.name, (err) => {
      if (err) throw err
    })

    time = Date.now()
    if (
      config.Administration.includes(message.author.id) &&
      config.Premium.includes(message.author.id)
    ) {
      type = 'ADMINISTRATION'
      await Aspect.edit({ embed: ObfuscateEmbed(type) })
      aspect(`${message.author.tag} is obfuscating ${file.name}`)
      aspect('Obfuscating...', language.toUpperCase())
      if (language == 'js' || language == 'html' || language == 'css') {
        await obfuscate(file, fileData, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      } else {
        await fs.writeFileSync(
          "./temp/" + filename + ".lua",
          fileData
        );
        await sleep(0.5)
        await obfuscate(file, null, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      }
      await sleep(wait(0.1))
      time = (Date.now() - time) / 1000 + 's'
      let DMEmbed = await message.author.send({
        embed: EmbedTemplate('Info', 'Waiting for Data...'),
      })
      await message.author
        .send({ files: ['./temp/' + filename + '.obfuscated.' + language] })
        .then(async () => {
          await Aspect.edit({ embed: ObfuscatedEmbed(type, time) })
          await DMEmbed.edit({
            embed: EmbedTemplate('Success', 'Successfully Obfuscated!'),
          })
          aspect('Obfuscated!', language.toUpperCase())
          await sleep(wait(0.1))
          await clearTempFolder()
          aspect(`${message.author.tag} has obfuscated ${file.name}`)
        })
        .catch(async (err) => {
          if (err) {
            await DMEmbed.edit({
              embed: EmbedTemplate('Failed', 'Obfuscation Failed!'),
            })
            await Aspect.edit({ embed: ObfuscateFailedEmbed })
            aspect('Obfuscated!', language.toUpperCase())
            await sleep(wait(0.1))
            await clearTempFolder()
            aspect(
              `${message.author.tag
              } hasn't obfuscated ${file.name} | Reason: ${language.toUpperCase()} CODE NOT WORKING`,
            )
          }
        })
    }

    if (config.Administration.includes(message.author.id)) {
      type = 'ADMINISTRATION'
      await Aspect.edit({ embed: ObfuscateEmbed(type) })
      aspect(`${message.author.tag} is obfuscating ${file.name}`)
      aspect('Obfuscating...', language.toUpperCase())
      if (language == 'js' || language == 'html' || language == 'css') {
        await obfuscate(file, fileData, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      } else {
        await fs.writeFileSync(
          "./temp/" + filename + ".lua",
          fileData
        );
        await sleep(0.5)
        await obfuscate(file, null, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      }
      await sleep(wait(0.1))
      time = (Date.now() - time) / 1000 + 's'
      let DMEmbed = await message.author.send({
        embed: EmbedTemplate('Info', 'Waiting for Data...'),
      })
      await message.author
        .send({ files: ['./temp/' + filename + '.obfuscated.' + language] })
        .then(async () => {
          await Aspect.edit({ embed: ObfuscatedEmbed(type, time) })
          await DMEmbed.edit({
            embed: EmbedTemplate('Success', 'Successfully Obfuscated!'),
          })
          aspect('Obfuscated!', language.toUpperCase())
          await sleep(wait(0.1))
          await clearTempFolder()
          aspect(`${message.author.tag} has obfuscated ${file.name}`)
        })
        .catch(async (err) => {
          if (err) {
            await DMEmbed.edit({
              embed: EmbedTemplate('Failed', 'Obfuscation Failed!'),
            })
            await Aspect.edit({ embed: ObfuscateFailedEmbed })
            aspect('Obfuscated!', language.toUpperCase())
            await sleep(wait(0.1))
            await clearTempFolder()
            aspect(
              `${message.author.tag
              } hasn't obfuscated ${file.name} | Reason: ${language.toUpperCase()} CODE NOT WORKING`,
            )
          }
        })
    }

    if (config.Premium.includes(message.author.id)) {
      type = 'PREMIUM'
      await Aspect.edit({ embed: ObfuscateEmbed(type) })
      aspect(`${message.author.tag} is obfuscating ${file.name}`)
      aspect('Obfuscating...', language.toUpperCase())
      if (language == 'js' || language == 'html' || language == 'css') {
        await obfuscate(file, fileData, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      } else {
        await fs.writeFileSync(
          "./temp/" + filename + ".lua",
          fileData
        );
        await sleep(0.5)
        await obfuscate(file, null, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      }
      await sleep(wait(0.1))
      time = (Date.now() - time) / 1000 + 's'
      let DMEmbed = await message.author.send({
        embed: EmbedTemplate('Info', 'Waiting for Data...'),
      })
      await message.author
        .send({ files: ['./temp/' + filename + '.obfuscated.' + language] })
        .then(async () => {
          await Aspect.edit({ embed: ObfuscatedEmbed(type, time) })
          await DMEmbed.edit({
            embed: EmbedTemplate('Success', 'Successfully Obfuscated!'),
          })
          aspect('Obfuscated!', language.toUpperCase())
          await sleep(wait(0.1))
          await clearTempFolder()
          aspect(`${message.author.tag} has obfuscated ${file.name}`)
        })
        .catch(async (err) => {
          if (err) {
            await DMEmbed.edit({
              embed: EmbedTemplate('Failed', 'Obfuscation Failed!'),
            })
            await Aspect.edit({ embed: ObfuscateFailedEmbed })
            aspect('Obfuscated!', language.toUpperCase())
            await sleep(wait(0.1))
            await clearTempFolder()
            aspect(
              `${message.author.tag
              } hasn't obfuscated ${file.name} | Reason: ${language.toUpperCase()} CODE NOT WORKING`,
            )
          }
        })
    }

    if (
      !config.Premium.includes(message.author.id) &&
      !config.Administration.includes(message.author.id)
    ) {
      type = 'FREE'
      await Aspect.edit({ embed: ObfuscateEmbed(type) })
      aspect(`${message.author.tag} is obfuscating ${file.name}`)
      aspect('Obfuscating...', language.toUpperCase())
      if (language == 'js' || language == 'html' || language == 'css') {
        await obfuscate(file, fileData, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      } else {
        await obfuscate(file, null, language, 'administration').catch(
          async (err) => {
            if (err) console.log(err), await Aspect.edit({ embed: ObfuscateFailedEmbed })
          },
        )
      }
      await sleep(wait(0.1))
      time = (Date.now() - time) / 1000 + 's'
      let DMEmbed = await message.author.send({
        embed: EmbedTemplate('Info', 'Waiting for Data...'),
      })
      await message.author
        .send({ files: ['./temp/' + filename + '.obfuscated.' + language] })
        .then(async () => {
          await Aspect.edit({ embed: ObfuscatedEmbed(type, time) })
          await DMEmbed.edit({
            embed: EmbedTemplate('Success', 'Successfully Obfuscated!'),
          })
          aspect('Obfuscated!', language.toUpperCase())
          await sleep(wait(0.1))
          await clearTempFolder()
          aspect(`${message.author.tag} has obfuscated ${file.name}`)
        })
        .catch(async (err) => {
          if (err) {
            await DMEmbed.edit({
              embed: EmbedTemplate('Failed', 'Obfuscation Failed!'),
            })
            await Aspect.edit({ embed: ObfuscateFailedEmbed })
            aspect('Obfuscated!', language.toUpperCase())
            await sleep(wait(0.1))
            await clearTempFolder()
            aspect(
              `${message.author.tag
              } hasn't obfuscated ${file.name} | Reason: ${language.toUpperCase()} CODE NOT WORKING`,
            )
          }
        })
    }
    return aspect('------------------------------')
  }
})
client.login(config.General.Token)