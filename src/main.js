const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x')
const xObject = JSON.parse(x)//把字符串变成对象parse()
const hashMap = xObject || [//如果xObject就用xObject，不存在就用默认的数组
    { logo: 'G', url: 'http://www.google.com/' },
    { logo: 'Y', url: 'https://www.yuque.com/' },
    { logo: 'B', url: 'https://www.bilibili.com' },
    { logo: 'G', url: 'https://github.com/' },
    { logo: 'G', url: 'https://gitee.com/' },
    { logo: 'D', url: 'https://developer.mozilla.org/zh-CN/' },
]

const simplifyUrl = (url) => {
    return url.replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '')//删除/开头的内容
}

const render = () => {
    $siteList.find('li:not(.last)').remove()
    hashMap.forEach((node, index) => {
        const $li = $(` <li>
            <div class="site">
                <div class="logo">${node.logo[0]}</div>
                <div class="link">${simplifyUrl(node.url)}</div>
                <div class='close'>
                  <svg class="icon">
                   <use xlink:href="#icon-close"></use>
                  </svg>
                </div>
            </div>
        </li>`).insertBefore($lastLi)
        $li.on('click', () => {
            window.open(node.url)
        })
        $li.on('click', '.close', (e) => {
            e.stopPropagation()//阻止冒泡
            console.log(hashMap)
            hashMap.splice(index, 1)
            render()//删除后重新渲染
        })
    })
}

render()

$('.addButton')
    .on('click', () => {
        let url = window.prompt('请输入想添加的网址')
        if (url.indexOf('http') !== 0) {
            url = 'https://' + url
        }
        console.log(url)
        // console.log($siteList)
        // const $lastLi = $siteList.find('li.last')
        hashMap.push({
            logo: simplifyUrl(url)[0].toUpperCase(),
            logoType: 'text',
            url: url
        })
        //删除除了最后一个li的其他li
        render()
    })

window.onbeforeunload = () => {
    //把对象变成字符串stringify()
    const string = JSON.stringify(hashMap)
    localStorage.setItem('x', string)
}

//设置按单个字母直接跳转到网页（已经保存下来的网页的，若多个只会跳转第一个.）
$(document).on('keypress', (e) => {
    const { key } = e
    for (let i = 0; i < hashMap.length; i++) {
        if (hashMap[i].logo.toLocaleLowerCase() === key) {
            window.open(hashMap[i].url)
        }
    }
})