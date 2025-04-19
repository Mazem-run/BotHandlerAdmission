// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits, MessageFlags, EmbedBuilder, Embed,  } = require('discord.js');
const {needPromote, PromoteDemote} = require("./modules/messageModule")
const { token, needPromotechannel, mongoDBPass } = require('/config.json');
const {Training} = require('./modules/messageModule')
const MongoClient = require("mongodb").MongoClient;
const mongodb = new MongoClient(`mongodb+srv://frostybig1:${mongoDBPass}@cluster1.bdq3w2r.mongodb.net/`);
const db = mongodb.db("Admission");
const Trainings = db.collection('trainings')
const express = require('express')
const RankedColl = db.collection("T-Shirt Ranked")
const collection = db.collection("data");
const fs = require("fs")
const path  = require("path")

const app = new express()
app.use(express.json());


app.post('/trainingstatus', async function(req, res){
	const host = req.body.host
	const status = req.body.status
	const passedwithnopassed = req.body.peoples

	const need  = {
		hostusername: host
	}
	const result = await Trainings.findOne(need)
	if (result) {
		
	} else {
		res.json('No data.')
	}
})

mongodb.connect().then(mongoClient=>{
    console.log("Подключение установлено");
    console.log(mongoClient.options.dbName); // получаем имя базы данных
});

// Create a new client instance

global.client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
	client.user.setActivity('admission server');
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.on('interactionCreate', async interaction =>{
	// First we make sure it's the right select menu
	 if(interaction.customId !== "finished") return;
	   if(interaction.customId == 'finished') {
		var need = {
			discordname: interaction.user.username
		};
		await mongodb.connect();
		try {
			const result = await collection.findOne(need)
			if (!result) {
				console.log('Player didnt have data.')
			} else {
				const Replace = {
					discordname: result.discordname,
					robloxusername: result.robloxusername,
					newrank: result.newrank,
					oldrank: result.oldrank,
					messageID: result.messageID,
					channelID: result.channelID,
					proofURL: result.proofURL
				}
				interaction.message.delete()
				const RankEmbed = new EmbedBuilder()
				.setTitle(`Ranking Request | ${interaction.user.username} [${result.robloxusername}] - ${result.newrank}`)
				.setColor('Green')
				.setDescription('Your ranking request in proccess.\n```Do not DM any SHR+ for your ranking request```')
				.setTimestamp()
				.setFooter({ text: `Ranking ID: ${result._id}`})
				.setThumbnail('https://cdn.discordapp.com/icons/1272919460134780939/1bb96d2d5c7324ead84eb5f21482326f.png?size=4096')
				
				await interaction.reply({embeds: [RankEmbed]})
				await needPromote(client, result.robloxusername, result.newrank, result.oldrank, 'T-Shirt owner.')
				await PromoteDemote(client, result.robloxusername, result.newrank, result.oldrank, 'T-Shirt bought.', result.proofURL)
				await RankedColl.insertOne(Replace)
				await RankedColl.findOneAndUpdate(need, {$set: {channelID: interaction.channel.id}})
				await RankedColl.findOneAndUpdate(need, {$set: {messageID: interaction.message.id}})
				await collection.deleteOne(need)
				console.log('Completed.')
			}

		} catch(err){
			console.log(err)
		}
	 }
	// ...
 })

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
app.listen(3000, function() {
	console.log('Server started in 3000 port.')
})