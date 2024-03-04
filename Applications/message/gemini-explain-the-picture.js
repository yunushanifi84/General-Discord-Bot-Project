const {
    Client,
    EmbedBuilder,
    ActivityType,
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    ContextMenuCommandInteraction,
  } = require("discord.js");
  const { geminiApi } = require("../../config.json");
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  
  const genAi = new GoogleGenerativeAI(geminiApi);
  
  module.exports = {
    data: new ContextMenuCommandBuilder()
      .setName("gemini")
      .setType(ApplicationCommandType.Message),
    hasESub: false,
    hasApp: true,
    displayName: "Gemini Photo",
    /**
     * @param {ContextMenuCommandInteraction} interaction
     */
    async execute(interaction) {
      const message = interaction.targetMessage;
      if (!message.attachments.size) {
        await interaction.reply({
          content: "Lütfen açıklamasını istediğiniz bir resim gönderin.",
          ephemeral: true,
        });
        return;
      }
  
      const attachment = message.attachments.first();
      const imageUrl = attachment.url;
  
      await interaction.deferReply();
  
      const model = genAi.getGenerativeModel({ model: "gemini-pro-vision" });
  
      try {
        const result = await model.generateContent(imageUrl);
        const response = await result.response.text();
        const embed = new EmbedBuilder()
          .setTitle("Gemini")
          .setDescription(response)
          .setImage(imageUrl);
        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.log(error);
        const embed = new EmbedBuilder()
          .setTitle("Gemini")
          .setDescription("Bir hata oluştu.")
          .setColor("RED");
        await interaction.editReply({ embeds: [embed] });
      }
    },
  };