async function AJAX(requestBody, type, endpoint) {
  let url = api_url + endpoint + '/'
  const myHeaders = new Headers();

  myHeaders.append('Content-Type', 'application/json;charset=utf-8');
  if (userData) {
    myHeaders.append('Authorization', 'Bearer '+userData.jwt);
  }// else {myHeaders.append('Authorization', 'Bearer '+anon_jwt);}
  if (type == 'GET') {
    console.log(requestBody);
    var response = await fetch(url + "?" + requestBody, {
      method: type,
      headers: myHeaders
    });
  } else {

    console.log(JSON.stringify(JSON.parse(requestBody),null, '\t'));
    var response = await fetch(url, {
      method: type,
      headers: myHeaders,
      body: requestBody
    });
  }
  const reader = response.body.getReader();
  const contentLength = +response.headers.get('Content-Length');
  let receivedLength = 0;
  let chunks = [];
  while (true) {
    const {
      done,
      value
    } = await reader.read();
    if (done) {
      document.getElementById("myBar").style.transition = "none";
      document.getElementById("myBar").style.width = "0%"
      break;
    }
    chunks.push(value);
    receivedLength += value.length;
    receivedprcnt = Math.round((receivedLength / contentLength) * 100) + "%";
    document.getElementById("myBar").style.transition = "var(--transition)";
    document.getElementById("myBar").style.width = receivedprcnt
    //console.log(`Receieved ${receivedprcnt}`)
  }
  let chunksAll = new Uint8Array(receivedLength); // (4.1)
  let position = 0;
  for (let chunk of chunks) {
    chunksAll.set(chunk, position); // (4.2)
    position += chunk.length;
  }
  let array = new TextDecoder("utf-8").decode(chunksAll);
  return [response.status, array.replace(/(<([^>]+)>)/gi, "")];
  // console.log('ответ: ' + array);
}
