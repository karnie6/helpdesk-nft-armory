import Discord, { MessageEmbed, TextChannel } from "discord.js";


export default async function notifyDiscordSale(
    client: Discord.Client,
    channel: TextChannel,
    test?: boolean
  ) {

    if (!client.isReady()) {
        return;
      }
    
      const description = `HELPDESK TEST MESSAGE`;
    
      const embedMsg = new MessageEmbed({
        color: "#0099ff",
        title: "TEST",
        description,

      });

      
      await channel.send({
        embeds: [embedMsg],
      });
      const logMsg = `Notified discord #${channel.name}: ${description}`;
      console.log(logMsg);

}