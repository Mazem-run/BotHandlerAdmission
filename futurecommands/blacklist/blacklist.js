const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const { token, needPromotechannel, mongoDBPass } = require('/config.json');
const MongoClient = require("mongodb").MongoClient;
const mongodb = new MongoClient(`mongodb+srv://frostybig1:${mongoDBPass}@cluster1.bdq3w2r.mongodb.net/`);
const db = mongodb.db("Admission");
const coll = db.collection('Blacklists')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('[SHR+] Add user to blacklist.')
    .addSubcommand(subcommand =>
        subcommand
        .setName('add')
        .setDescription('[SHR+] Add blacklist to user.')
        .addMentionableOption(option =>
            option
            .setName('user')
            .setDescription('Provide user.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName('reason')
            .setDescription('Provide reason of blacklist')
            .setRequired(true)
        )
        .addAttachmentOption(option =>
            option
            .setName('proof')
            .setDescription('Provide proofs.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('remove')
        .setDescription('[SHR+] Remove blacklist from user.')
        .addMentionableOption(option =>
            option
            .setName('user')
            .setDescription('Provide user.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName('reason')
            .setDescription('Provide reason of blacklist.')
            .setRequired(true)
        )
    ),
    async execute(interaction){
        if (interaction.options.getSubcommand() === 'add') {
            const write = {
                
            }
        }
    }
}