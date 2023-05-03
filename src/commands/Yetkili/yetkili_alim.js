const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ravendb = require("croxydb")
const fs = require("node:fs");

module.exports.data = {
    name: "yetkili",
    description: "yetkili",
    options: [
        {
            name: "alım",
            description: "alım",
            type: 2,
            options: [
                {
                    name: "ayarla",
                    description: "Yetkili alım sistemini ayarlarsın.",
                    type: 1,
                    options: [                                
                        {                       
                            name: "kanal",
                            description: "Yetkili alımın yapılcağı kanal.", 
                            type: 7,
                            channel_types: [0],
                            required: true
                        }
                    ]                                  
                },
                {
                    name: "aç",
                    description: "Yetkili alım sistemini açarsınız.",
                    type: 1
                },
                {
                    name: "kapat",
                    description: "Yetkili alım sistemini kapatırsın.",
                    type: 1             
                }
            ]
        }
    ],
    cooldown: 10,
    dev: true,
    async execute(interaction, client) {
        const command = interaction.options.getSubcommand();
        const { embed, config } = client;
        if (command === "ayarla") {
                                  
            const database = await ravendb.get("system");
            const data_channel = await client.channels.cache.get(database?.channel);
            const message = await data_channel?.messages?.fetch(database?.message).catch(()=>{});
            const channel = interaction.options.getChannel("kanal");
            
            if (channel === data_channel) return interaction.reply({
                ephemeral: true,
                embeds: [embed(interaction, "Seçtiğiniz kanal ile veritabanımdaki kanal aynı, bu yüzde işlem iptal edildi.", "red")]
            })
            
            if (database && message) {
                message.delete()
            };
            
            const source = src(interaction);
            const msg = await channel.send({ embeds: [source.embed], components: [source.row] })
            await ravendb.set("system", { channel: channel.id, message: msg.id, active: true })
            if (config.system.everyone) {
                const everyone = await channel.send({ content: "@everyone" });
                await everyone.delete()
            };
            
            interaction.reply({
                ephemeral: true,
                embeds: [embed(interaction, "Sistem başarıyla ayarlandı.", "green")]
            })
 
        } else if (command === "aç") {
            const database = await ravendb.get("system");
            const data_channel = await client.channels.cache.get(database?.channel);
            const message = await data_channel?.messages?.fetch(database?.message).catch(()=>{});
            
            if (!database || !data_channel || !message) return interaction.reply({
                ephemeral: true,
                embeds: [embed(interaction, "Veritabanımda eksiklikler bulunuyor lütfen tekrar ayarlayın.", "red")]
            });
            
            if (database.active) return interaction.reply({
                ephemeral: true,
                embeds: [embed(interaction, "Yetkili sistemi halihazırda açık, bu yüzden işlem iptal edildi.", "red")]
            });
            
            interaction.reply({
                ephemeral: true,
                embeds: [embed(interaction, "Sistem başarıyla açıldı.", "green")]
            })
            
            const source = src(interaction, false)
            message.edit({ embeds: [source.embed], components: [source.row] })
            ravendb.set("system", { channel: database.channel, message: database.message, active: true })
            if (config.system.everyone) {
                const everyone = await data_channel.send({ content: "@everyone" });
                await everyone.delete()
            }
            
        } else if (command === "kapat") {
            const database = await ravendb.get("system");
            const data_channel = await client.channels.cache.get(database?.channel);
            const message = await data_channel?.messages?.fetch(database?.message).catch(()=>{});
            if (!database || !data_channel || !message) return interaction.reply({
                ephemeral: true,
                embeds: [embed(interaction, "Veritabanımda eksiklikler bulunuyor lütfen tekrar ayarlayın.", "red")]
            });
            
            if (!database.active) return interaction.reply({
                ephemeral: true,
                embeds: [embed(interaction, "Yetkili sistemi halihazırda kapalı, bu yüzden işlem iptal edildi.", "red")]
            });
            
            interaction.reply({
                ephemeral: true,
                embeds: [embed(interaction, "Sistem başarıyla kapatıldı.", "green")]
            })
            
            const source = src(interaction, true)
            message.edit({ embeds: [source.embed], components: [source.row] })
            ravendb.set("system", { channel: database.channel, message: database.message, active: false })           
        }
    }
}

function src(interaction, enabled = false) {                 
    const embed = new EmbedBuilder()               
    .setColor("Blurple")              
    .setTitle("Raven sunucusunun yeni yetkililere ihtiyacı var!")                
    .setDescription("Sunucumuz yeni yetkililere ihtiyacı var.\n\nKendini <#1096085224854651038> insanlara yardım edebilcek hissdiyorsan aşşağıdaki **Katıl** butonuna basabilirsin.\nKullanıcılarımızı için daha hızlı ve etkili hizmet sunmak için yeni yetkililer almalıyız. Bu işten bir kârınız olmayacak fakat kod bilginizi geliştirme fırsatı bulabilirsiniz.\nAşşağıdaki butona tıkladıktan sonra **DM** kutunuza gelen soruları cevaplayarak başvuru yapabilirsiniz.\nLütfen **deneme** veya gereksiz amaçlarla aşşağıdaki butona tıklamayınız. Aksi halde cezalandırılırsınız.")                
    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({dynamic:true}) })               
    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({dynamic:true}) })
                                
    const row = new ActionRowBuilder().addComponents(                                
        new ButtonBuilder()                
        .setCustomId("join")                  
        .setLabel("Katıl")  
        .setDisabled(enabled)
        .setStyle(ButtonStyle.Success)                                 
    )
    
    return {
        embed,
        row
    };
}

async function update(type) {    
    if (type) {             
        await writeFile(`${process.cwd()}/.env`, (await readFile(`${process.cwd()}/.env`, 'utf-8')).replace(/ENABLED_SYSTEM=false/, 'ENABLED_SYSTEM=true'));
    } else {           
        await writeFile(`${process.cwd()}/.env`, (await readFile(`${process.cwd()}/.env`, 'utf-8')).replace(/ENABLED_SYSTEM=true/, 'ENABLED_SYSTEM=false'));   
    }
} 