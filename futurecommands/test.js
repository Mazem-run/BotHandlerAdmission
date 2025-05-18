const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, EmbedBuilder, MessageFlags, messageLink, User} = require("discord.js")
const {needPromote} = require("../../modules/messageModule")
const {mongoDBPass} = require('../../config.json');
const MessageModule = require('../../modules/messageModule');
const MongoClient = require("mongodb").MongoClient;
const mongodb = new MongoClient(`mongodb+srv://frostybig1:${mongoDBPass}@cluster1.bdq3w2r.mongodb.net/`);
const db1 = mongodb.db("Admission");
const RankedColl = db1.collection("T-Shirt Ranked")
const collection = db1.collection("data");



module.exports ={
    data: new SlashCommandBuilder()
    .setName('t-shirt-rank')
    .setDescription('[HR+] Handle T-Shirt rank request.')
    .addMentionableOption(option =>
        option
        .setName('user')
        .setDescription('Provide user.')
        .setRequired(true)
    )
    .addStringOption(option =>
        option
        .setName('new-rank')
        .setDescription('Provide new rank.')
        .addChoices(
            {name: 'Junior Inspector', value: 'Junior Inspector'},
            {name: 'Inspector', value: 'Inspector'},
            {name: 'Senior Inspector', value: 'Senior Inspector'}
        )
        .setRequired(true)
    )
    .addStringOption(option =>
        option
        .setName('old-rank')
        .setDescription('Provide previous rank.')
        .setRequired(true)
    )
    .addAttachmentOption(option =>
        option
        .setName('proof')
        .setDescription('Provide proof.')
        .setRequired(true)
    ),
    async execute(interaction) {
        const Username = interaction.options.getMember('user');
        const NewRank = interaction.options.getString('new-rank');
        const Attachment = interaction.options.getAttachment('proof')
        const OldRank = interaction.options.getString('old-rank');
        let userInstance = await client.users.fetch(Username.id);
        const URL = Attachment.url
        const Need = {
            discordname: Username.user.username
        }

        const HRRole = interaction.member.roles.cache.find(r => r.name === "HR-High Rank")
        if (!HRRole) {
            return interaction.reply({content: "You didn't have permissions to make this.", flags: MessageFlags.Ephemeral})
        }


        const FindUser = await collection.findOne(Need)
        const findAgain = await RankedColl.findOne(Need)

        if (findAgain) {
            return interaction.reply({content: 'User already have ranked or completed document phase for T-Shirt ranking.', flags: MessageFlags.Ephemeral})
        }

        if (FindUser){
            return interaction.reply({content: 'User already have T-Shirt ranking request.', flags: MessageFlags.Ephemeral})
        }

        const DMEmbed = new EmbedBuilder()
        .setTitle(`T-Shirt Ranking Request - ${interaction.user.username}; ${NewRank}`)
        .setColor('Aqua')
        .setTimestamp()
        .setDescription('Hello! Before you get promote you need read documentation.\n\n> Click link in below to read information.\n> After finishing please press Green Button.')

        const SuccessButton = new ButtonBuilder()
        .setCustomId('finished')
        .setLabel('Done')
        .setStyle(ButtonStyle.Success)

        const DocumentButton = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel('Document')
        .setURL('https://docs.google.com/document/d/1_Os1JIwxtFVboXwbaNmNI1UxMgfUlJjj0E8_gArGUV4/edit?usp=sharing')

        const Row = new ActionRowBuilder().addComponents(SuccessButton, DocumentButton)

        const Int = await interaction.reply({content: 'Successfuly sended request.', flags: MessageFlags.Ephemeral})
        const DM =  userInstance.send({embeds: [DMEmbed], components: [Row]})
        const Table = {
            discordname: Username.user.username,
            robloxusername: Username.nickname,
            newrank: NewRank,
            oldrank: OldRank,
            messageID: '',
            channelID: '',
            proofURL: URL
        }
        
        await collection.insertOne(Table)
    }
}
