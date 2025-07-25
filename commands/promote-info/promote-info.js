const {SlashCommandBuilder, EmbedBuilder, MessageFlags, embedLength} = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
    .setName('promote-info')
    .setDescription('[LR] See information about promote for your next rank.'),
    async execute(interaction) {
        const UV = interaction.member.roles.cache.find(r => r.name === "Un-Verified")
        const LL = interaction.member.roles.cache.find(r => r.name === 'Labour Lottery')
        const AI = interaction.member.roles.cache.find(r => r.name === "Apprentice Inspector")
        const JI = interaction.member.roles.cache.find(r => r.name === "Junior Inspector")
        const I = interaction.member.roles.cache.find(r => r.name === "Inspector")
        const SI = interaction.member.roles.cache.find(r => r.name === "Senior Inspector")
        const RankPrevention = interaction.member.roles.cache.find(r => r.name === "Rank Prevention")

        const AIEMbed = new EmbedBuilder()
        .setTitle('Apprentice Inspector - Junior Inspector')
        .setDescription('To advance to the next rank, you need to do the following:\n```You need work on a shift for 300 minutes.```')
        .setColor('Aqua')
        .setFooter({text: 'Admission Federation'})

        const UVEmbed = new EmbedBuilder()
        .setTitle('Un-Verified - Labour Lottery')
        .setDescription('To advance to the next rank, you need to do the following:\n```You need pass interview or application.```')
        .setColor('Aqua')
        .setFooter({text: 'Admission Federation'})

        const LLEmbed = new EmbedBuilder()
        .setTitle('Labour Lottery - Apprentice Inspector')
        .setDescription('To advance to the next rank, you need to do the following:\n```You need pass LL Training.```')
        .setColor('Aqua')
        .setFooter({text: 'Admission Federation'})

        const JIEmbed = new EmbedBuilder()
        .setTitle('Junior Inspector - Inspector')
        .setDescription('To advance to the next rank, you need to do the following:\n```You need work on a shift for 1 hours and 30 minutes.\nComplete 1 drill.```')
        .setColor('Aqua')
        .setFooter({text: 'Admission Federation'})

        const IEmbed = new EmbedBuilder()
        .setTitle('Inspector - Senior Inspector')
        .setDescription('To advance to the next rank, you need to do the following:\n```You need work on a shift for 2 hours.\nComplete 3 drills.```')
        .setColor('Aqua')
        .setFooter({text: 'Admission Federation'})

        const SIEmbed = new EmbedBuilder()
        .setTitle('Senior Inspector')
        .setDescription('This final rank of LRs, if you want get SV academy be active!')
        .setColor('Aqua')
        .setFooter({text: 'Admission Federation'})
        
        const RankPreventionEmbed = new EmbedBuilder()
        .setTitle('Rank Prevention')
        .setDescription("Hello! You now have have role Rank Prevention, with this role you can't up your rank. In order to lose this role, you need:\n```Pass T-Shirt owner rank```")
        .setColor('Aqua')
        .setFooter({text: 'Admission Federation'})


        if (RankPrevention){
            return await interaction.reply({embeds: [RankPreventionEmbed], flags: MessageFlags.Ephemeral})
        }
        if (AI) {
            return await interaction.reply({embeds: [AIEMbed], flags: MessageFlags.Ephemeral})
        } else if (JI) {
            return await interaction.reply({embeds: [JIEmbed], flags: MessageFlags.Ephemeral})
        } else if (I) {
            return await interaction.reply({embeds: [IEmbed], flags: MessageFlags.Ephemeral})
        } else if (SI) {
            return await interaction.reply({embeds: [SIEmbed], flags: MessageFlags.Ephemeral})
        } else if (UV) {
            return await interaction.reply({embeds: [UVEmbed], flags: MessageFlags.Ephemeral})
        } else if (LL) {
            return await interaction.reply({embeds: [LLEmbed], flags: MessageFlags.Ephemeral})
        }

    }

}
