const {SlashCommandBuilder, EmbedBuilder, MessageFlags, ButtonBuilder, ButtonStyle, ButtonInteraction, ActionRowBuilder, Embed} = require("discord.js")
const {mongoDBPass} = require('../../config.json');
const {PromoteDemote, needPromote} = require("../../modules/messageModule");
const { Client } = require("undici");
const MongoClient = require("mongodb").MongoClient;
const mongodb = new MongoClient(`mongodb+srv://frostybig1:${mongoDBPass}@cluster1.bdq3w2r.mongodb.net/`);
const db1 = mongodb.db("Admission");
const collection = db1.collection("data");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('need-promote')
    .setDescription("[HR+] Make need-promote log.")
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
            {name: "Apprentice Inspector", value: 'Apprentice Inspector'},
            {name: 'Junior Inspector', value: 'Junior Inspector'},
            {name: 'Inspector', value: 'Inspector'},
            {name: 'Senior Inspector', value: 'Senior Inspector'}
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
    ),


    async execute(interaction){
        const username = interaction.options.getString('username')
        const NewRank = interaction.options.getString('new-rank')
        const OldRank = interaction.options.getString('old-rank')
        const Reason = interaction.options.getString('reason')

        const DeputyministerRole = interaction.member.roles.cache.find(r => r.name === "Deputy Minister")
        const MOARole = interaction.member.roles.cache.find(r => r.name === "Minister of Admissions")
        const HRRole = interaction.member.roles.cache.find(r => r.name === "HR-High Rank")

        if (!HRRole) {
            return interaction.reply({content: "You didn't have permissions to make this.", flags: MessageFlags.Ephemeral})
        }

        await interaction.reply({content: "Success.", flags: MessageFlags.Ephemeral})
        await needPromote(client, username, NewRank, OldRank, Reason)
    }
}
