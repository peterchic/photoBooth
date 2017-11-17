const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// const redFilter = document.getElementById('red-effect')
// const rgbFilter = document.getElementById('rgb-split')
// const greenFilter = document.getElementById('green-screen')

let mode;



function getVideo(){
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  }).then(localMediaStream => {
    // console.log((localMediaStream));
    video.src = window.URL.createObjectURL(localMediaStream)
    video.play()
  }).catch(err => {
    console.error("Don't Deny Me!");
  })
}

function paintToCanvas() {
  const width = video.videoWidth
  const height = video.videoHeight
  canvas.width = width
  canvas.height = height

  return setInterval(() => {
    filter = `${mode}`
    ctx.drawImage(video, 0, 0, width, height)
    let pixels = ctx.getImageData(0,0, width, height)

    pixels = filter(pixels)

    // const redFilter = document.getElementById('red-effect').onclick = redEffect(pixels)
    // const rgbFilter = document.getElementById('rgb-split').onclick = rgbSplit(pixels)
    // const greenFilter = document.getElementById('green-screen').onclick = greenScreen(pixels)

    // take the pixels out
    // mess with pixels
    // if(redFilter){
    //   pixels = redEffect(pixels)
    // } else if (rgbFilter){
    //   pixels = rgbSplit(pixels)
    // } else if (greenFilter){
    //   pixels = greenScreen(pixels)
    // }
    // pixels = redEffect(pixels)
    // ctx.globalAlpha = 0.8
    // put them back
    ctx.putImageData(pixels, 0, 0)
  }, 16)
}

function takePhoto() {
  //played the sound
  snap.currentTime = 0
  snap.play()

  //take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg')
  const link = document.createElement('a')
  link.href = data
  link.setAttribute('download','Pete')
  link.textContent = 'Download Image'
  link.innerHTML = `<img src="${data}" alt="Petes Photo" />`
  strip.insertBefore(link, strip.firstChild)
  // console.log(data);
}

function redEffect(pixels){
  // console.log('pressed');
  // console.log(pixels);
  // debugger

  for(let i = 0; i < pixels.data.length; i += 4){
    pixels.data[i + 0] = pixels.data[i + 0] + 50
    pixels.data[i + 1] = pixels.data[i + 1] - 100
    pixels.data[i + 2] = pixels.data[i + 2] * 0.9
  }
  return pixels
}

function rgbSplit(pixels){
  console.log('pressed');
  video.addEventListener('canplay', paintToCanvas)



  for(let i = 0; i < pixels.data.length; i += 4){
    pixels.data[i + 100] = pixels.data[i + 0]
    pixels.data[i - 100] = pixels.data[i + 1]
    pixels.data[i + 100] = pixels.data[i + 2]
  }
  return pixels
  filter = rgbFilter
}

function greenScreen(pixels){
  // console.log('pressed');
  const levels = {}

  document.querySelectorAll('.rgb input').forEach( input => {
    levels[input.name] = input.value
  })

  for(let i = 0; i < pixels.data.length; i += 4){
    red = pixels.data[i + 0]
    green = pixels.data[i + 1]
    blue = pixels.data[i + 2]
    alpha = pixels.data[i + 3]

    if(
      red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax
    ){
      pixels.data[i+3] = 0
    }
  }
  return pixels
}
``


getVideo()

video.addEventListener('canplay', paintToCanvas)
