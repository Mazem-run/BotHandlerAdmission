const {SlashCommandBuilder, EmbedBuilder, MessageFlags} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('drill')
    .setDescription('[MR+] Command for control drill.')
    .addSubcommand(option =>
        option
        .setName('announce')
        .setDescription('[MR+] Announcing drill in channel.')
        .addStringOption(option =>
            option
            .setName('type')
            .setDescription('Select what you want announce.')
            .addChoices(
                {name: 'Poll', value: 'Poll'},
                {name: 'Drill', value: 'Drill'}
            )
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option
            .setName('time')
            .setDescription('How long before the training starts. [JUST WRITE MINUTES, NO WORDS]')
            .setRequired(true)
        )
    )
    .addSubcommand(option =>
        option
        .setName('result')
        .setDescription('[MR+] Send a drill result.')
        .addStringOption(option =>
            option
            .setName('host')
            .setDescription('Enter the host roblox username.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName('co-host')
            .setDescription('Enter the co-host roblox username. [If have]')
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName('helper')
            .setDescription('Enter the helper(s) username(s). [If have]')
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName('supervisor')
            .setDescription('Enter the supervisor roblox username. [If have]')
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option
            .setName('number-of-attendees')
            .setDescription('Enter the number of attendees.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName('passers')
            .setDescription('Enter the passers roblox username.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName('note')
            .setDescription('Enter the note of session.')
            .setRequired(true)
        )
        .addAttachmentOption(option =>
            option
            .setName('proof')
            .setDescription('Provide proof of drill.')
            .setRequired(true)
        )
    )
    .addSubcommand(option =>
        option
        .setName('status')
        .setDescription('[MR+] Change drill status.')
        .addStringOption(option =>
            option
            .setName('messageid')
            .setDescription('Enter the message id.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName('status')
            .setDescription('Select status of dril.')
            .setRequired(true)
            .addChoices(
                {name: 'Cancelled', value: 'Cancelled'},
                {name: 'In progress', value: 'In progress'},
                {name: 'Completed', value: 'Completed'}
            )
        )
    ),
    async execute(interaction){
        if (interaction.options.getSubcommand() === 'announce') {
            const AccessRole = interaction.member.roles.cache.find(r => r.name === "MR-Middle Rank")
            const what = interaction.options.getString('type')
            const starttime = interaction.options.getInteger('time')
            const channel = interaction.guild.channels.cache.get('1272919466979758145');
            const PolLChannel = interaction.guild.channels.cache.get('1272919466979758145'); // NEED USE DRILL CHANNEL +
            if (!AccessRole) {
               return interaction.reply({content: "You didn't have permissions to use this command.", flags: MessageFlags.Ephemeral})
            }

            if (what === 'Poll') {
                const message = await channel.send('```Starting poll```' + '\n' + `**Host:** ${interaction.member.nickname}\n**Drill start in: **${starttime} minutes\n*React** <:Approved:1272931638170484848> **if you attend the training, or** <:Denied:1272931163698364458> **if you can't**.\n**Ping:** <LR PING>`)
                message.react('<:Approved:1272931638170484848>')
                message.react('<:Denied:1272931163698364458>')
                await interaction.reply({content: 'Success.', flags: MessageFlags.Ephemeral})
            } else if (what === 'Drill') {
                await channel.send('```Training starting```' + '\n\nJoin Altan to join the Training. PTS (Permission To Talk) is active. STS at the Statue and wait until the Training starts.\n' +`\n**Host:** ${interaction.member.nickname}\n**Drill start in: **${starttime} minutes\n**Link:** https://www.roblox.com/games/2024140489/Altan#!/game-instances\n` + '\n**Ping:** <@&1272919464693989536>\nStatus: Starting')
                await interaction.reply({content: 'Success.', flags: MessageFlags.Ephemeral})
            }
        } else if(interaction.options.getSubcommand() === 'status') {
            const AccessRole = interaction.member.roles.cache.find(r => r.name === "MR-Middle Rank")
            const Hr = interaction.member.roles.cache.find(r => r.name === "HR-High Rank")
            const messageId = interaction.options.getString('messageid');
            const newStatus = interaction.options.getString('status')

            if (!AccessRole || !Hr) {
                return interaction.reply({content: "You didn't have permissions to use this command.", flags: MessageFlags.Ephemeral})
            }

            try {
                const message = await interaction.channel.messages.fetch(messageId);
                const oldContent = message.content;
                
                // Шаблон для поиска строки статуса (регистронезависимый)
                const statusPattern = /(Status:)\s*(Starting|In progress|Cancalled|Completed)/i;
                
                
                // Заменяем статус, сохраняя оригинальное написание "Статус:" или "Status:"
                const newContent = oldContent.replace(statusPattern, (match, prefix) => {
                    return `${prefix} ${newStatus}`;
                });
                
                await message.edit(newContent);
                
                await interaction.reply({ 
                    content: `Session status changed to: ${newStatus}`, 
                    ephemeral: true 
                });
                
            } catch (error) {
                console.error(error);
                if (error.code === 10008) {
                    await interaction.reply({ 
                        content: 'Message not found, please check again ID message.', 
                        ephemeral: true 
                    });
                } else {
                    await interaction.reply({ 
                        content: 'Occurred Error, please report this error to omg0162.' + error.message, 
                        ephemeral: true 
                    });
                }
            }
        
        } else if(interaction.options.getSubcommand() === 'result') {
            const host = interaction.options.getString('host');
            const coHost = interaction.options.getString('co-host');
            const helper = interaction.options.getString('helper'); 
            const supervisor = interaction.options.getString('supervisor');
            const numberOfAttendees = interaction.options.getInteger('number-of-attendees');
            const passers = interaction.options.getString('passers');
            const note = interaction.options.getString('note');
            const proof = interaction.options.getAttachment('proof');
            const channel = interaction.guild.channels.cache.get('1272919465625129042'); // NEED USE DRILL CHANNEL +
            if (!AccessRole) {
                return interaction.reply({content: "You didn't have permissions to use this command.", flags: MessageFlags.Ephemeral})
             }

            await channel.send('```Drill results```' + '\n' + '\n' + '\n' + `**Host:** ${host}\n\n**Co-Host:** ${coHost}\n\n**Helper(s):** ${helper}\n\n**Supervisor:** ${supervisor}\n\n**Number of attendees:** ${numberOfAttendees}\n\n**Passed:** ${passers}\n\n**Note:** ${note}\n\n**Proof:**`)
            await channel.send({files: [proof.url]})
            await interaction.reply({content: 'Success', flags: MessageFlags.Ephemeral})
        }
    }
}
