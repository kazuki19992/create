require('dotenv').config();
const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`${client.user.tag} でログインしています。`)
})

client.on('message', async msg => {
  if(msg.channel.id === process.env.CHANNEL_ID){
    // コマンドとチャンネル名指定で分ける
    let arg = msg.content.split( /\s+/ );
    let cmd = arg.shift();
    let chName = arg[0];
    let isVoice = "text";
    if(arg[1] != undefined && arg[1] === '-v' || arg[1] === '--voice'){
      isVoice = "voice";
    }

    // チャンネルを作成する
    if (cmd === '!channel') {
      console.log(chName)
      console.log('チャンネル名:', chName, ', ボイス:', isVoice)

      if(chName){

        // 同じ名前のチャンネルがないかチェックする
        let channel = msg.guild.channels.cache.find(
          channel => channel.name.toLowerCase() === chName
        )
        if(!channel){

          // チャンネルの作成
          msg.guild.channels.create( chName, {type: isVoice })
            .then( (ch) => {
              console.log('チャンネル作成中…');
              // カテゴリーを登録する
              let parent = msg.guild.channels.cache.find(
                channel => channel.name.toLowerCase() === "作成されたチャンネル"
              )
              if ( parent ) {
                ch.setParent( parent );
              }
              const genre = isVoice === "text" ? "テキスト": "音声"
              msg.channel.send(`${genre}チャンネル #${chName} を『作成されたチャンネル』内に作ったよ！`)
            })
            .catch( (err) => { console.log( err ); } );
        }else{
          msg.channel.send('既に同じ名前のチャンネルがあるよ！')
        }
      }else{
        const usage = `USAGE:\n\`\`\`!channel チャンネル名 (-v or --voice)\`\`\``
        msg.channel.send(usage)
      }
    }
  }
})

client.login(process.env.TOKEN)