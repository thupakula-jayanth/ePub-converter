document.addEventListener("DOMContentLoaded", function() {
    const dropArea = document.getElementById("drag-area");
    const fileInput = document.getElementById("file-input");
    const uploadButton = document.getElementById("upload-button");
    const progressBar = document.getElementById("progress-bar");
    const statusText = document.createElement("p");
    statusText.classList.add("status-text");
    dropArea.appendChild(statusText);

    function showToast(message, color) {
        const toast = document.getElementById("snackbar");
        toast.textContent = message;
        toast.style.backgroundColor = color;
        toast.className = "show";
        setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (!file.name.endsWith(".epub") && !file.name.endsWith(".azw3")) {
                showToast("Invalid file type. Only EPUB and AZW3 are allowed.", "red");
                return;
            }
            uploadFile(file);
        }
    }

    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.classList.add("active");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("active");
    });

    dropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        dropArea.classList.remove("active");
        handleFiles(event.dataTransfer.files);
    });

    fileInput.addEventListener("change", () => {
        handleFiles(fileInput.files);
    });

    uploadButton.addEventListener("click", () => {
        if (fileInput.files.length > 0) {
            handleFiles(fileInput.files);
        } else {
            showToast("Please select a file first.", "orange");
        }
    });

    function uploadFile(file) {
        const formData = new FormData();
        formData.append("file", file);

        statusText.textContent = "Uploading...";
        progressBar.style.width = "10%";

        fetch("http://localhost:5000/convert", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error("Conversion failed");
            progressBar.style.width = "50%";
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "converted.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            progressBar.style.width = "100%";
            statusText.textContent = "Download complete!";
            showToast("Conversion successful!", "green");
        })
        .catch(error => {
            statusText.textContent = "Conversion failed!";
            showToast("Error: " + error.message, "red");
        });
    }
});



