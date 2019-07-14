// if ($response.statusCode != 200) {
//   $done(Null);
// }

// var body = $response.body;
// var obj = JSON.parse(body);

if ($response.statusCode != 200) {
  $done(Null);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const foods = ['🍺','🍩','🍭','🦴','🥮','🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍅', '🥑']
const emojis= ['🆘','🈲','⚠️','🔞','📵','🚦','🏖','🖥','📺','🐧','🐬','🦉','🍄','⛳️','🚴','🤑','👽','🤖','🎃', '👺', '👁', '🐶', '🐼','🐌', '👥']

var body = $response.body;
var obj = JSON.parse(body);
var title = '🚦'+ 'Dler 李贺无敌'+'🚦'
//emojis[getRandomInt(emojis.length)] +obj['country']+ '-' +obj['city']+ foods[getRandomInt(foods.length)];
var subtitle =''+ '鸡儿硬邦邦'+'';
var ip = obj['query'];
var description = obj['country'] + '-' + obj['city'] + '\n' + obj['isp'] + '\n' + obj['ipType']+ '\n' + ip;

$done({title, subtitle, ip, description});
