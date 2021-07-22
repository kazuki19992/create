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
                channel => channel.name.toLowerCase() === "各種カテゴリチャンネル"
              )
              if ( parent ) {
                ch.setParent( parent );
              }
              const genre = isVoice === "text" ? "テキスト": "音声"
              msg.channel.send(`${genre}チャンネル #${chName} を『各種カテゴリチャンネル』内に作ったよ！`)
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
  }else if(msg.channel.id === process.env.BOT_MAINTENANCE){
    // メッセージ送信

    // コマンドとメッセージを分ける
    // メッセージはコードブロック内
    let arg = msg.content.split( /\`{3}/ )
    let cmd = arg.shift()
    let announce = arg[0]

    let cmdReg = new RegExp(/^\!channel_msg/g)

    if(cmdReg.test(cmd)){
      // アナウンスへメッセージ送信
      console.log("送信", announce)
      if(announce){
        client.channels.cache.get(process.env.ANNOUNCE).send(announce)
      }else{
        client.channels.cache.get(process.env.BOT_MAINTENANCE).send("空文字もしくは`null`が渡されました")
      }
    }
  }
})

client.login(process.env.TOKEN)