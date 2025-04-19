const {EmbedBuilder, ButtonBuilder, embedLength} = require("discord.js")
const {needPromotechannel, promotedemoteChannel, trainingsChannel} = require('/config.json')
const config = require('/config.json')

module.exports = {
   async needPromote(client,username, NewRank, OldRank, Reason) {
    const channel = client.channels.cache.get(needPromotechannel)
	const Embed = new EmbedBuilder()
	.setTitle(`Ranking request`)
	.setColor('Green')
    .setThumbnail('https://cdn.discordapp.com/icons/1272919460134780939/1bb96d2d5c7324ead84eb5f21482326f.png?size=4096')
	.addFields(
		{name: 'Username:', value: username, inline: true},
		{name: 'New Rank:', value: NewRank, inline: true},
		{name: 'Old Rank:', value: OldRank, inline: true},
		{name: 'Reason:', value: Reason, inline: true}
	)
	.setTimestamp()
	return channel.send({content: '<@1186677500651245628> (here will be GM ping)', embeds: [Embed]})

},
  async PromoteDemote(client, username, NewRank, OldRank, Reason, Proof) {
	const channel = client.channels.cache.get(promotedemoteChannel)
	
	const Embed = new EmbedBuilder()
	.setTitle(`${OldRank} - ${NewRank}`)
	.setDescription(`Details:\n- Username: ${username}\n- Reason: ${Reason}\n- Proof: Below. ` )
	.setImage(Proof)
	.setColor('Aqua')
	.setTimestamp()

	return channel.send({embeds: [Embed]})
  },
}