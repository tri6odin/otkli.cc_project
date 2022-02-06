function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};
function handleCredentialResponse(response) {
  let responsePayload = parseJwt(response.credential);
  let id_token = response.credential;
  let authNode = document.querySelector('auth');
  let emailNode = authNode.querySelector('input[type="email"]');
  let passNode = authNode.querySelector('input[type="password"]')
  let authTypeNode = authNode.querySelector('auth>input[type="text"]')
  let pastauth = document.querySelector('auth>input[type="text"]').value

  emailNode.value = responsePayload.email;
  emailChangeTrigger(emailNode);
  passNode.value = id_token;
  passwordChangeTrigger(passNode);
  authTypeNode.value = 'gauth';
  logIn();
  authTypeNode.value = pastauth;
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id: '484299695878-ghv7moe0cevvra7jkf56e4dqmh3fm8ae.apps.googleusercontent.com',
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.getElementById("googleauth"),
    { theme: "outline", size: "medium", shape:"circle",type:"icon"}  // customization attributes
  );
  //google.accounts.id.prompt(); // also display the One Tap dialog
}
