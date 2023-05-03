const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const ravendb = require("croxydb");

module.exports = (client) => {
    client.on("interactionCreate", async interaction => {  
        const arr = ["emindeil", "emin", "soru1", "soru2", "soru3", "soru4", "soru5"];
        const database = await ravendb.get("system");
        
        const { embed, config } = interaction.client;
        
        if (!database.active && arr.includes(interaction.customId)) {
            return interaction.update({
                components: [],
                embeds: [              
                    client.embed(interaction, "Yetkili alım sistemi kapatıldığı için bu işlem iptal edildi.", "red")        
                ]
            })
        }
   
        if (interaction.customId === "join") {
            return interaction.reply({ 
                ephemeral: true,
                embeds: [
                client.embed(
                    interaction, 
                    "Bu işleme devam etmek istediğinizden emin misiniz? Gereksiz yere açılan istekler cezalandırılıcaktır.",
                    "info")
                ],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setCustomId("emin")
                        .setLabel("Eminim")
                        .setStyle(ButtonStyle.Success),
                        
                        new ButtonBuilder()
                        .setCustomId("emindeil")
                        .setLabel("Hayır")
                        .setStyle(ButtonStyle.Danger)
                    )
                ]
            })
        };
        
        if (interaction.customId === "emindeil") {
            return interaction.update({ components: [], embeds: [client.embed(interaction, "İşleminiz iptal edilmiştir.", "red")]})
        };
        
        if (interaction.customId === "emin") {       
            const database = await ravendb.get(`başvuru-${interaction.user.id}`);
            
            if (database) {
                if (database?.bitirdi) {
                    return interaction.update({
                        ephemeral: true,
                        components: [],
                        embeds: [embed(interaction, "Zaten başvuru yapmışsınız.", "red")]
                    })
                } else {
                    return interaction.update({
                        ephemeral: true,
                        components: [],
                        embeds: [embed(interaction, "Zaten devam eden bir başvurunuz bulunuyor.", "red")]
                    })
                }
            }
            
            const embeds = new EmbedBuilder()
            .setTitle("Yeni başvuru başlatıldı.")
            .setColor("Yellow")
            .setThumbnail(interaction.user.displayAvatarURL({dynamic:true}))
            .setDescription("Soru 1: -\nSoru 2: -\nSoru 3: -\nSoru 4: -\nSoru 5: -")
            .addFields(
                { name: "Kullanıcı İsmi", value: interaction.user.tag.toString(), inline: true },
                { name: "Kullanıcı ID", value: interaction.user.id.toString(), inline: true },
                { name: "Kullanıcı Oluşturulma", value: "<t:" + Math.floor(interaction.user.createdTimestamp / 1000).toString() + ":f>", inline: true }
            )
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({dynamic:true}) })
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({dynamic:true}) })
            .setTimestamp()
            
            interaction.update({ 
                components: [],                              
                embeds: [
                client.embed(
                    interaction,
                    "DM kutunuzu kontrol ediniz. Eğer mesaj gelmemişse, mesaj isteklerini açıp tekrar başvuru yapın.",
                    "green")
                ]
            })
            
            const soru1 = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription("Merhaba, Raven sunucumuz için yetkili başvurusu yaptığınızı görüyorum. Size soracağım soruları cevaplayarka başvurunuzu yetkililere ileteceğim.\n\n**1.** Hangi yazılım dillerini biliyorsunuz?")
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({dynamic:true}) })
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({dynamic:true}) })
            
            const soru1row = new ActionRowBuilder().addComponents(           
                new StringSelectMenuBuilder()			
                .setCustomId('soru1')			
                .setPlaceholder('Kullandığınız yazılım dillerini seçiniz.')		
                .setMinValues(1)
			    .setMaxValues(9)
                .addOptions(				
                    new StringSelectMenuOptionBuilder()			
                    .setLabel('C++')
                    .setEmoji('<:cpp:1096712817492631582>')
					.setValue('cpp'),		
                    new StringSelectMenuOptionBuilder()
					.setLabel('C#')
                    .setEmoji('<:cs:1096713222112944138>')
					.setValue('cs'),
				    new StringSelectMenuOptionBuilder()
					.setLabel('C')
					.setEmoji('<:codec:1096712108097425438>')
					.setValue('c'),
                    new StringSelectMenuOptionBuilder()			
                    .setLabel('Java')
                    .setEmoji('<:java:1096714513656578158>')
					.setValue('java'),		
                    new StringSelectMenuOptionBuilder()
					.setLabel('JavaScript')
                    .setEmoji('<:javascript:1096709270852096081>')
					.setValue('js'),
				    new StringSelectMenuOptionBuilder()
					.setLabel('TypeScript')
					.setEmoji('<:typescript:1096713777891790848>')
					.setValue('ts'),  
                    new StringSelectMenuOptionBuilder()			
                    .setLabel('Lua')
                    .setEmoji('<:luna:1096715173336727592>')
					.setValue('lua'),		
                    new StringSelectMenuOptionBuilder()
					.setLabel('PHP')
                    .setEmoji('<:php:1096710458997735534>')
					.setValue('php'),
				    new StringSelectMenuOptionBuilder()
					.setLabel('Python')
					.setEmoji('<:python:1096709911305523260>')
					.setValue('python'),                  
                )
			);
            
            interaction.user.send({ embeds: [soru1], components: [soru1row] }).catch(() => {})
            const msg = await client.channels.cache.get(config.system.log).send({ embeds: [embeds] })
            ravendb.set(`başvuru-${interaction.user.id}`, { soru1: "-", soru2: "-", soru3: "-", soru4: "-", soru5: "-", başvurdu: true, bitirdi: false, logmsg: msg.id })
            return interaction.user.send({ embeds: [soru1], components: [soru1row] }).catch(() => {})
        }
        
        if (interaction.customId === "soru1") {
            const selection = interaction.values;
     
            await update(interaction, interaction.user.id, "1", selection.join(', '))      
            
            const soru2 = EmbedBuilder.from(interaction.message.embeds[0]).setDescription("**2.** <#1096085224854651038> kanalında kullanıcalara yardım edebilmek için kod yazma seviyeniz nedir?")
                     
            const soru2row = new ActionRowBuilder().addComponents(           
                new StringSelectMenuBuilder()			
                .setCustomId('soru2')			
                .setPlaceholder('Kod bilgi seviyeniz nedir?.')		
                .setMinValues(1)
			    .setMaxValues(1)
                .addOptions(				
                    new StringSelectMenuOptionBuilder()			
                    .setLabel('%0')
					.setValue('%0'),             
                    
                    new StringSelectMenuOptionBuilder()			
                    .setLabel('%25')
					.setValue('%25'),              
                    
                    new StringSelectMenuOptionBuilder()			
                    .setLabel('%50')
					.setValue('%50'),              
                    
                    new StringSelectMenuOptionBuilder()			
                    .setLabel('%75')
					.setValue('%75'),              
                    
                    new StringSelectMenuOptionBuilder()			
                    .setLabel('%100')
					.setValue('%100'),              
                )              
            )
            
            interaction.update({ embeds: [soru2], components: [soru2row] })
        }
        
        if (interaction.customId === "soru2") {
            const selection = interaction.values[0];
     
            await update(interaction, interaction.user.id, "2", selection)      
            
            const soru3 = EmbedBuilder.from(interaction.message.embeds[0]).setDescription("**3.** Size hitap edilmesi için isim ve yaşınız nedir?")
                 
            const modal = new ModalBuilder()
			.setCustomId('soru3')
			.setTitle('İsminiz ve yaşınız nedir?');
            
            const isim = new TextInputBuilder()
			.setCustomId('isim')
			.setLabel("İsminiz nedir?")
            .setRequired(true)
            .setMinLength(3)
            .setMaxLength(10)
			.setStyle(TextInputStyle.Short);
            
            const yas = new TextInputBuilder()
			.setCustomId('yas')
			.setLabel("Yaşınız nedir?")
            .setRequired(true)
            .setMinLength(2)
            .setMaxLength(2)
			.setStyle(TextInputStyle.Short);
           
            const firstActionRow = new ActionRowBuilder().addComponents(isim)		
            const secondActionRow = new ActionRowBuilder().addComponents(yas);		
            modal.addComponents(firstActionRow, secondActionRow);	
            await interaction.showModal(modal);
            
            interaction.message.edit({ embeds: [soru3], components: [] })
        }  
        
        if (interaction.customId === "soru3") {                       
            const isim = interaction.fields.getTextInputValue('isim');
	        const yas = interaction.fields.getTextInputValue('isim');
            await update(interaction, interaction.user.id, "3", isim + "/" + yas)     
                                    
            const soru4 = EmbedBuilder.from(interaction.message.embeds[0]).setDescription("**4.** 1 Günde ne kadar aktifsiniz? Sunucumuzda aktifliğ, sağlamak için aktif yetkililere ihtiyacımız var.")
            
             const soru4row = new ActionRowBuilder().addComponents(           
                new StringSelectMenuBuilder()			
                .setCustomId('soru4')			                          
                .setPlaceholder('Ne kadar süre aktifsiniz?')		
                .setMinValues(1)
			    .setMaxValues(1)
                .addOptions(				
                    new StringSelectMenuOptionBuilder()			
                    .setLabel('0-2 Saat')
					.setValue('0-2_Saat'),             
                    new StringSelectMenuOptionBuilder()			
                    .setLabel('2-5 Saat')
					.setValue('2-5_Saat'), 
                    new StringSelectMenuOptionBuilder()			
                    .setLabel('5-7 Saat')
					.setValue('5-7_Saat'),             
                    new StringSelectMenuOptionBuilder()			
                    .setLabel('+7 Saat')
					.setValue('+7_Saat'),             
                    new StringSelectMenuOptionBuilder()			
                    .setLabel('Gece Boyu')
					.setValue('Gece_Boyu'),                                
                )                
             )
             
             interaction.update({ embeds: [soru4], components: [soru4row] })
        }
        
        if (interaction.customId === "soru4") {
            const selection = interaction.values[0];
     
            await update(interaction, interaction.user.id, "4", selection)
            
            const soru5 = EmbedBuilder.from(interaction.message.embeds[0]).setDescription("**5.** Neden sunucumuzda yetkili olmak istiyorsunuz? Bizi tercih etmeninizin sebebinini kısaca açıklayın.")
                 
            const modal = new ModalBuilder()
			.setCustomId('soru5')
			.setTitle('Neden yetkili olmak istiyorsunuz?');
            
            const neden = new TextInputBuilder()
			.setCustomId('neden')	
            .setLabel("Neden yetkili olmak istiyorsunuz, açıklayın.")
            .setRequired(true)
            .setMinLength(3)
            .setMaxLength(100)
			.setStyle(TextInputStyle.Paragraph);
            
            modal.addComponents(new ActionRowBuilder().addComponents(neden));	
            await interaction.showModal(modal);
            
            interaction.message.edit({ embeds: [soru5], components: [] })
        }
        
        if (interaction.customId === "soru5") {
            const neden = interaction.fields.getTextInputValue('neden');
            await update(interaction, interaction.user.id, "5", neden) 
            
            const embed = EmbedBuilder.from(interaction.message.embeds[0]).setDescription("Tebrikler! Yetkili olma formunu başarıyla tammaladınız. Yakında yetkililerimiz sizinle iletişime geçecektir. İyi günler!").setColor("Green")
            
            interaction.update({ embeds: [embed], components: [] })
        }
    })
}

async function update(interaction, userId, question, answer) {
    const database = await ravendb.get(`başvuru-${userId}`)
    const message = await interaction.client.channels.cache.get(interaction.client.config.system.log)?.messages?.fetch(database.logmsg)
    const description = message?.embeds[0]?.data?.description;
   
    const desc = description.replace(`Soru ${question}: -`, `Soru ${question}: ${answer}`)

    if (question === "5") {            
        var embed = EmbedBuilder.from(message.embeds[0]).setDescription(desc.toString()).setTitle("Başvuru tamamlandı.").setColor("Green")
    } else {          
        var embed = EmbedBuilder.from(message.embeds[0]).setDescription(desc.toString())
    }

    message.edit({ embeds: [embed] })
}
              