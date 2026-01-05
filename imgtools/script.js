let currentTool = "removebg"

const fileInput = document.getElementById("file")
const preview = document.getElementById("preview")
const loader = document.getElementById("loader")
const downloadBtn = document.getElementById("downloadBtn")

document.querySelectorAll(".tab").forEach(tab=>{
  tab.onclick=()=>{
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"))
    tab.classList.add("active")
    currentTool = tab.dataset.tool
  }
})

fileInput.onchange=()=>{
  const f=fileInput.files[0]
  if(!f)return
  preview.src=URL.createObjectURL(f)
  preview.style.display="block"
}

document.getElementById("processBtn").onclick=async()=>{
  const f=fileInput.files[0]
  if(!f)return alert("Select image")

  const fd=new FormData()
  fd.append("image",f)

  loader.style.display="block"
  downloadBtn.style.display="none"

  const r=await fetch("/"+currentTool,{method:"POST",body:fd})
  const d=await r.json()

  loader.style.display="none"
  preview.src=d.url
  preview.style.display="block"

  downloadBtn.onclick=()=>{
    location.href="/download?url="+encodeURIComponent(d.url)
  }
  downloadBtn.style.display="block"
}

fetch("/info").then(r=>r.json()).then(d=>{
  document.getElementById("date").textContent="Date: "+new Date(d.time).toLocaleString("en-PH")
  document.getElementById("ip").textContent="IP: "+d.ip
})

navigator.getBattery().then(b=>{
  document.getElementById("battery").textContent="Battery: "+Math.round(b.level*100)+"%"
})

const modal=document.getElementById("termsModal")
if(!document.cookie.includes("termsAccepted")) modal.style.display="flex"

document.getElementById("agreeBtn").onclick=()=>{
  fetch("/accept-terms",{method:"POST"}).then(()=>modal.style.display="none")
}

document.getElementById("themeBtn").onclick=()=>{
  document.body.classList.toggle("light")
}

document.getElementById("heartBtn").onclick=()=>{
  alert("Thank you for supporting ❤️")
}