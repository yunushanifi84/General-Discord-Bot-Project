const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    Client,
    EmbedBuilder,
    ActivityType,
  } = require("discord.js");
  const { geminiApi} = require("../../config.json");

  const {GoogleGenerativeAI} = require("@google/generative-ai")
  const genAi=new GoogleGenerativeAI(geminiApi);
  module.exports = {
    data:new SlashCommandBuilder()
        .setName("gemini")
        .setDescription("Geminiye erişim sağlar.")
        .addStringOption((option) =>
        option
            .setName("prompt")
            .setDescription("Komut")
            .setRequired(true)
        
    ),
    hasESub: false,
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction,client) {
        const options = interaction.options;
        const prompt = options.getString("prompt");
        await interaction.deferReply();

        const model= genAi.getGenerativeModel({model:"gemini-pro"});

        try{
            const result= await model.generateContent(prompt);
            console.log(result.response.text());
            const response = await result.response.text();
            const embed = new EmbedBuilder()
                .setTitle("Gemini")
                .setDescription(response)
            await interaction.editReply({embeds:[embed]});
        }catch(error){
            console.log(error);
            const embed = new EmbedBuilder()
                .setTitle("Gemini")
                .setDescription("Bir hata oluştu.")
                .setColor("RED")
            await interaction.editReply({embeds:[embed]});
        }


    }

    
  }