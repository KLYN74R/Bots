/**
 * 
 * @Vlad@ Chernenko -1.-1.-1
 * 
 * 
 * 
 *     ██████╗ ██╗   ██╗███╗   ███╗███╗   ███╗██╗   ██╗██████╗  ██████╗ ████████╗
 *     ██╔══██╗██║   ██║████╗ ████║████╗ ████║╚██╗ ██╔╝██╔══██╗██╔═══██╗╚══██╔══╝
 *     ██║  ██║██║   ██║██╔████╔██║██╔████╔██║ ╚████╔╝ ██████╔╝██║   ██║   ██║   
 *     ██║  ██║██║   ██║██║╚██╔╝██║██║╚██╔╝██║  ╚██╔╝  ██╔══██╗██║   ██║   ██║   
 *     ██████╔╝╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║   ██║   ██████╔╝╚██████╔╝   ██║   
 *     ╚═════╝  ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝   ╚═╝   ╚═════╝  ╚═════╝    ╚═╝   
 *                                                                         
 *
 * 
 * @Build for KLYNTAR symbiotic platform and hostchains
 * 
*/




import {Telegraf,Markup} from 'telegraf'
import fetch from 'node-fetch'
import fs from 'fs'

global.__dirname = await import('path').then(async mod=>
  
  mod.dirname(
    
    (await import('url')).fileURLToPath(import.meta.url)
    
  )

)


//___________________________________________________________________ DEFINE CONFIGURATION ___________________________________________________________________



let PATH_RESOLVE=path=>__dirname+'/'+path

global.CONFIG={}

Object.assign(CONFIG,JSON.parse(fs.readFileSync(PATH_RESOLVE(`config.json`))))




/*


fs.readdirSync(PATH_RESOLVE('configs')).forEach(file=>
    
    Object.assign(CONFIG,JSON.parse(fs.readFileSync(PATH_RESOLVE(`configs/${file}`))))
    
)
*/


//______________________________________________________________________ SET UP THE BOT ______________________________________________________________________



const bot = new Telegraf(CONFIG.TOKEN),
      
      CHAINS=new Map()
      
Object.keys(CONFIG.CHAINS).forEach(alias=>CHAINS.set(alias,Buffer.from(CONFIG.CHAINS[alias].PUB,'base64').toString('hex')))


//______________________________________________________________________ SET LISTENERS _______________________________________________________________________


bot.start(async ctx => {

    ctx.reply(`Welcome ${ctx.message.from.first_name} to your personal KLYNTAR manager. You can control all your infractructure via this bot. To change the scope of control-change it on your nodes. Let's start our journey`)
    
    
    await ctx.replyWithAnimation({source:fs.readFileSync(PATH_RESOLVE('Carnage.gif'))})

    console.log('Chat ',ctx.update.message.chat)

    await ctx.reply('Your control panel is:', Markup
      .keyboard([
        ['🔍 General', '🧬 Symbiote info','🌌 Unobtanium'], // Row1 with 2 buttons
        ['⚙ Settings', '📞 External call','💸 Send tx'], // Row2 with 2 buttons
        //['💸 Send tx', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
      ])
      .oneTime()
      .resize()
    )

})



bot.hears('🔍 General',async ctx=>{
    
    let answer=await fetch(`${CONFIG.NODE.URL}/i`).then(r=>r.json()).catch(e=>`Oops,some error:${e}`)
    
    ctx.reply('So your empire state is:')
    ctx.reply(JSON.stringify(answer,null,2))

})



bot.hears('🧬 Symbiote info',async ctx => {
    
    let names=await fetch(`${CONFIG.NODE.URL}/i`).then(r=>r.json()).then(info=>info.SYMBIOTES.split(',')).catch(e=>`Oops,some error:\n${e}`)
    
    await ctx.reply('Choose symbiote:', Markup.keyboard(names.map(s=>[`Symbiote:${s}`])).resize())
  
})


bot.hears('🌌 Unobtanium', ctx => ctx.reply('Unobtanium'))
bot.hears('⚙ Settings', ctx => ctx.reply('Settings'))
bot.hears('📞 External call', ctx => ctx.reply('External'))



bot.hears('💸 Send tx', ctx =>{

    ctx.reply('Sending tx...')

    setTimeout(()=>ctx.replyWithAnimation({source:fs.readFileSync(PATH_RESOLVE(Math.random()>.5?'Success.gif':'Fail.gif'))}),3000)

})



//Info about choosen symbiote
bot.hears(/^Symbiote:/, async ctx =>{

    let {id:HEIGHT,hash:HASH,stop:STOP}=await fetch(`${CONFIG.NODE.URL}/collapsed/${CHAINS.get(ctx.message.text.split(':')[1])}`).then(r=>r.json()).catch(e=>`Oops,some error:${e}`)

    ctx.reply(JSON.stringify({HEIGHT,HASH,STOP},null,2),Markup.keyboard([

        ['🔍 General', '🧬 Symbiote info','🌌 Unobtanium'], // Row1 with 2 buttons
        ['⚙ Settings', '📞 External call','💸 Send tx'], // Row2 with 2 buttons
        //['💸 Send tx', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
    ])

    .oneTime()
    .resize())
    


})

// bot.help(ctx=>{

//     ctx.reply('/info - get status of your node')

// })


bot.launch().then(()=>console.log('Bot has started'))



// Enable graceful stop/terminaton
process.once('SIGTERM', () => bot.stop('SIGTERM'))
process.once('SIGINT', () => bot.stop('SIGINT'))










/*


                                                     ___                      _  _______                      
                                                    (  _`\                   ( )(_____  )                     
                                                    | | ) |   __     _ _    _| |     /'/'   _     ___     __  
                                                    | | | ) /'__`\ /'_` ) /'_` |   /'/'   /'_`\ /' _ `\ /'__`\
                                                    | |_) |(  ___/( (_| |( (_| | /'/'___ ( (_) )| ( ) |(  ___/
                                                    (____/'`\____)`\__,_)`\__,_)(_______)`\___/'(_) (_)`\____)
                                                                                                              
                                                          


*/








//____________________________________________________________________ EXAMPLES & SNIPPETS ___________________________________________________________________


//Just take the general public node info
let dummy_func=async()=>{

  let general_info=await fetch(`${CONFIG.NODE.URL}/i`).then(r=>r.json()).catch(e=>`Oops,some error`)
    

  await bot.telegram.sendMessage('ID','🛸[DUMMY_BOT]🤖 > So the current state is:')
  await bot.telegram.sendMessage('ID',JSON.stringify(general_info,null,2))

}

//let num=0
//setInterval(()=>bot.telegram.sendMessage(847383561,`New block on your symbiote ${num++}`),15000)


//To private user
//setTimeout(()=>bot.telegram.sendPoll(<USER ID>,'Whould you like to rearrange your Unobtanium for new projects?',['Lalala','NextOne'],{ allows_multiple_answers: true, is_anonymous: false }),3000)


//To group
//setTimeout(()=>bot.telegram.sendMessage(<ID>,`🛸Group access test🛸`),3000)

setTimeout(dummy_func,3000)


setInterval(dummy_func,70000)

//To channel
//setInterval(()=>bot.telegram.sendMessage(<ID>,`✔️Dummy stress test✔️`),3000)
