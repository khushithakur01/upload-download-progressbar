const form = document.querySelector("form"),
  fileInput = document.querySelector(".file-input"),
  progressArea = document.querySelector(".progress-area"),
  uploadedArea = document.querySelector(".uploaded-area");

// form click event
form.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = ({ target }) => {
  let file = target.files[0]; // getting first file
  if (file) {
    let fileName = file.name; // getting file name
    if (fileName.length >= 12) {
      // if file name is long, shorten it
      let splitName = fileName.split(".");
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    uploadFile(file, fileName); // calling uploadFile function with file and name
  }
};

// file upload function
function uploadFile(file, name) {
  let xhr = new XMLHttpRequest(); // creating new XMLHttpRequest object
  xhr.open("POST", "php/upload.php"); // sending post request to server

  xhr.upload.addEventListener("progress", ({ loaded, total }) => {
    let fileLoaded = Math.floor((loaded / total) * 100); // getting percentage
    let fileTotal = Math.floor(total / 1000); // converting size to KB
    let fileSize = fileTotal < 1024 ? fileTotal + " KB" : (loaded / (1024 * 1024)).toFixed(2) + " MB";

    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;

    if (loaded === total) {
      progressArea.innerHTML = "";
      let fileURL = "uploads/" + file.name; // Assuming uploaded files are stored in "uploads" folder
      let uploadedHTML = `<li class="row">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${name} • Uploaded</span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                            <a href="${fileURL}" download="${file.name}" class="download-btn">
                              <i class="fas fa-download"></i>
                            </a>
                          </li>`;
      uploadedArea.classList.remove("onprogress");
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
    }
  });

  let data = new FormData();
  data.append("file", file); // Adding file data
  xhr.send(data); // Sending file to server
}
