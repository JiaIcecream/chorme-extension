document.getElementById('getValue').addEventListener('click', async () => {
  const key = document.getElementById('key').value;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: (key) => localStorage.getItem(key),
      args: [key],
    },
    (results) => {
      const value = results[0].result;
      // 解析一下这个value json ，讲这个json
      let parsedValue;
      let userHash;
      let token;
      try {
        parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue.tokens)) {
          // 遍历tokens数组查找包含userHash和token的对象
          for (const tokenData of parsedValue.tokens) {
            if (tokenData.tokenData && tokenData.tokenData.userHash && tokenData.tokenData.token) {
              userHash = tokenData.tokenData.userHash;
              token = tokenData.tokenData.token;
              break;  // 只需要找到一个包含userHash和token的对象即可
            }
          }
        }
      
      }catch (e) {
        parsedValue = 'Invalid Json';
      }

      // 构建商品添加购物车请求
      let auth = 'XBL3.0' + 'x=' + userHash + ";" + token;

      var myHeaders = new Headers();
      myHeaders.append("Accept", "*/*");
      myHeaders.append("accept-language", "zh-CN,zh;q=0.9");
      myHeaders.append("authorization", auth);
      myHeaders.append("ms-cv", "UlvpuWs2DR06Wm5/6o8PBO.49");
      myHeaders.append("priority", "u=1, i");
      myHeaders.append("sec-ch-ua", "\\\"Chromium\\\";v=\\\"124\\\", \\\"Google Chrome\\\";v=\\\"124\\\", \\\"Not-A.Brand\\\";v=\\\"99\\\"");
      myHeaders.append("sec-ch-ua-mobile", "?0");
      myHeaders.append("sec-ch-ua-platform", "\\\"Windows\\\"");
      myHeaders.append("sec-fetch-dest", "empty");
      myHeaders.append("sec-fetch-mode", "cors");
      myHeaders.append("sec-fetch-site", "cross-site");
      myHeaders.append("x-authorization-muid", "FDC4B594A4124B81BC58191C1FC87B53");
      myHeaders.append("x-ms-vector-id", "F5B8D190199907A8E5EB09A67E89DBD9D2FC7C5EA205B90D73E92F2ABAB546A7");
      myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
      myHeaders.append("content-type", "application/json");

      var raw = JSON.stringify({
        "market": "TW",
        "locale": "zh-TW",
        "riskSessionId": "54e2eb87-a778-4274-b7fd-3ecb6f7017e0",
        "catalogClientType": "storeWeb",
        "clientContext": {
            "client": "XboxCom",
            "deviceFamily": "web"
        },
        "friendlyName": "cart-TW",
        "itemsToAdd": {
            "items": [
                {
                    "productId": "9N4PSS97RDD0",
                    "skuId": "0001",
                    "availabilityId": "9V5KP7V2TTVR",
                    "quantity": 1,
                    "campaignId": "xboxcomct"
                }
            ]
        }
    });

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      document.getElementById('value').innerText = parsedValue !== 'Invalid JSON' 
      ? `auth: ${auth}\raw: ${raw}`
      : 'Invalid JSON';

      fetch("https://cart.production.store-web.dynamics.com/v1.0/cart/loadCart?cartType=consumer&appId=XboxWeb", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
          }
        );
});
