/***

Thanks to & modified from 
1. https://gist.githubusercontent.com/Hyseen/b06e911a41036ebc36acf04ddebe7b9a/raw/nf_check.js

For Quantumult-X 598+ ONLY!!

[task_local]

event-interaction https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/sswitch-check-nf.js, tag=Netflix 切换, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Netflix_Letter.png, enabled=true

ps. 简单粗暴的 UI-Interaction 版本。无数据持久化、粗暴延迟等待。完美主义建议使用 Helge大佬的boxjs版本 https://t.me/QuanXNews/193

@XIAO_KOP

**/

const BASE_URL = 'https://www.netflix.com/title/'

const FILM_ID = 81215567
const link = { "media-url": "https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/img/southpark/7.png" } 
const policy_name = "Netflix" //填入你的 netflix 策略组名
var policy = $environment.params
const message = {
    action: "get_customized_policy",
    content: policy

};

var output=[]
var OKList=["完整解锁节点 ➟ "]
var ResList=["仅支持自制剧节点 ➟ "]
var NoList=["不支持节点 ➟ "]
var timeoutList=["检测超时节点 ➟ "]

$configuration.sendMessage(message).then(resolve => {
    if (resolve.error) {
        console.log(resolve.error);
        $done()
    }
    if (resolve.ret) {
        //$notify(JSON.stringify(resolve.ret))
        output=JSON.stringify(resolve.ret[message.content])? JSON.stringify(resolve.ret[message.content]["candidates"]).replace(/\"|\[|\]/g,"").replace(/\,/g," ➟ ").split(" ➟ ") : $environment.params
        //$notify(typeof(output),output)
        Check()
        //$done({"title":"策略内容","message":output})
    }
    //$done();|
}, reject => {
    // Normally will never happen.
    $done();
});

function Check() {
    var relay = 2000;
    for ( var i=0;i < output.length;i++) {
        testNF(output[i])
    }
    if (output.length<=5) {
        relay = 2000
    } else if (output.length<10) {
        relay =4000
    } else if (output.length<15) {
        relay =6000
    } else if (output.length<20) {
        relay =8000
    } else {
        relay =10000
    }
    console.log(output.length+":"+relay)
    setTimeout(() => {
        const dict = { [policy] : OKList[2]};
        const mes1 = {
            action: "set_policy_state",
            content: dict
        }; 
        $configuration.sendMessage(mes1).then(resolve => {
            if (resolve.error) {
                console.log(resolve.error);
                content = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + "<br>❌ <b>⟦"+$environment.params+ "⟧ </b>切换失败，未找到完整支持节点" + `</p>`
                $done({"title":"Netflix 切换", "htmlMessage": content})
            }
            if (resolve.ret) {
                console.log("已经切换至完整支持的路线 ➟ "+OKList[2])
                content = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + "<br> <b>⟦"+$environment.params+ "⟧</b> 已切换至完整支持的路线<br> <br>👇<br><br> ⟦"+OKList[2]+ "⟧" + "<br><br>-------------------<br><b>Shawn 大善人自用</b><br>-------------------"+`</p>`
                $done({"title":"Netflix 切换", "htmlMessage": content })
            }
    }, reject => {
            $done();
        });
        
        
    }, relay)
    
}




function testNF(pname ) {
    return new Promise((resolve, reject) => {
        //console.log(pname)
        let opts = { policy : pname }
        let option = {
            url: BASE_URL + FILM_ID,
            opts: opts,
            headers: {
                'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
            },
        }
        $task.fetch(option).then (response => {
            
            if (response.statusCode === 404) {
                NoList.push(pname)
                console.log(pname+": "+"未支持")
                resolve('Not Found')
                return
            }
            
            if (response.statusCode === 403) {
                ResList.push(pname)
                console.log(pname+": "+"仅支持自制剧集")
                resolve('Not Available')
                return
            }
            
            if (response.statusCode === 200) {
                console.log(pname+": "+"完整支持")
                let url = response.headers['X-Originating-URL']
                let region = url.split('/')[3]
                region = region.split('-')[0]
                if (region == 'title') {
                    region = 'us'
                }
                OKList.push(pname)
                resolve(region)
                return
            }
            reject('Error')
        })
    })
}


