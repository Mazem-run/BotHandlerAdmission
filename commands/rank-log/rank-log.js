const {SlashCommandBuilder, EmbedBuilder, MessageFlags, ButtonBuilder, ButtonStyle, ButtonInteraction, ActionRowBuilder, Embed} = require("discord.js")
const {mongoDBPass, promotedemoteChannel} = require('../../config.json');
const {PromoteDemote, needPromote} = require("../../modules/messageModule");
const { Client } = require("undici");
const MongoClient = require("mongodb").MongoClient;
const mongodb = new MongoClient(`mongodb+srv://frostybig1:${mongoDBPass}@cluster1.bdq3w2r.mongodb.net/`);
const db1 = mongodb.db("Admission");
const collection = db1.collection("data");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rank-promote-demote')
    .setDescription("[HR+] Make promote/demote log.")
    .addStringOption(option =>
        option
        .setName('username')
        .setDescription('Write ROBLOX username.')
        .setRequired(true)
    )
    .addStringOption(option =>
        option
        .setName('new-rank')
        .setDescription('Write new rank.')
        .addChoices(
            {name: 'Un-Verified', value: 'Un-Verified'},
            {name: 'Labour Lottery', value: 'Labour Lottery'},
            {name: 'Junior Inspector', value: 'Junior Inspector'},
            {name: 'Inspector', value: 'Inspector'},
            {name: 'Senior Inspector', value: 'Senior Inspector'},
            {name: 'Supervisor [DM+]', value: 'Supervisor'},
            {name: 'Cheif Inspector [DM+]', value: 'Cheif Inspector'},
            {name: 'Head Inspector [DM+]', value: 'Head Inspector'},
            {name: 'Director of Admission [DM+]', value: 'DOA'},
            {name: 'Deputy Minister [MOA+]', value: 'DM'}
        )
        .setRequired(true)
    )
    .addStringOption(option =>
        option
        .setName('old-rank')
        .setDescription('Write old rank.')
        .setRequired(true)
    )

    .addStringOption(option =>
        option
        .setName('reason')
        .setDescription('Write reason.')
        .setRequired(true)
    )

    .addAttachmentOption(option =>
        option
        .setName('proof')
        .setDescription('Please upload proof of Promote/Demote.')
        .setRequired(false)
    ),
    async execute(interaction){
        const username = interaction.options.getString('username')
        const NewRank = interaction.options.getString('new-rank')
        const OldRank = interaction.options.getString('old-rank')
        const attachment = interaction.options.getAttachment('proof')
        const Reason = interaction.options.getString('reason')
        const channel = interaction.guild.channels.cache.get('1358699245556990104');
	
	     const embed = new EmbedBuilder()
	    .setTitle(`${OldRank} - ${NewRank}`)
	    .setDescription(`Details:\n- Username: ${username}\n- Reason: ${Reason}\n- Proof: ` )
	    .setColor('Aqua')
	    .setTimestamp()

        if (attachment?.contentType?.startsWith('image/')) {
            embed
                .setImage(attachment.url)
        } else {
            embed
            .setDescription(`Details:\n- Username: ${username}\n- Reason: ${Reason}\n- Proof: Don't need. ` )
        }

        const DeputyministerRole = interaction.member.roles.cache.find(r => r.name === "Deputy Minister")
        const MOARole = interaction.member.roles.cache.find(r => r.name === "Minister of Admissions")
        const HRRole = interaction.member.roles.cache.find(r => r.name === "HR-High Rank")

        if (!HRRole) {
            return interaction.reply({content: "You didn't have permissions to make this.", flags: MessageFlags.Ephemeral})
        }

        if (NewRank === 'Supervisor' || NewRank === 'Cheif Inspector' || NewRank === 'Head Inspector' || NewRank === 'DOA'){
            if (DeputyministerRole || MOARole) {
               await interaction.reply({content: 'Success.', flags: MessageFlags.Ephemeral})
               return channel.send({embeds: [embed]})
            } else {
                return interaction.reply({content: "You didn't have permissions to make this.", flags: MessageFlags.Ephemeral})
            }
        }

        if (NewRank === 'DM') {
            if (MOARole) {
               await interaction.reply({content: 'Success.', flags: MessageFlags.Ephemeral})
               return channel.send({embeds: [embed]})
            } else {
                return interaction.reply({content: "You didn't have permissions to make this.", flags: MessageFlags.Ephemeral})
            }
        }

        await interaction.reply({content: "Success.", flags: MessageFlags.Ephemeral})
        channel.send({embeds: [embed]})
        console.log('Success')
    }
}
