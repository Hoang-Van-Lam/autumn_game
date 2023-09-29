function goToGame(){
    window.location.href = "/main.html"
}

var body = document.getElementById("introBody");
var autumnAudioBg = document.getElementById("autumnAudioBg");

body.addEventListener("click", ()=>{
    autumnAudioBg.play();
})

var scene = document.getElementById("intro");
var parallaxInstance = new Parallax(scene);
parallaxInstance.friction(0.2, 0.2);

var autumnLantern = document.getElementById("autumnLantern");
var parallaxAutumnLantern = new Parallax(autumnLantern);
parallaxAutumnLantern.friction(1, 1);
