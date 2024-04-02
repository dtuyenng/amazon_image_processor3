import { useState, ChangeEvent } from "react";
import "./App.css";

function App(): JSX.Element {
  const [files, setFiles] = useState<File[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [fileContents, setFileContents] = useState<string[]>([]);
  const [asin, setAsin] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles = Array.from(event.target.files || []).filter(
      (file) => file.type === "image/jpeg"
    );
    setFiles(selectedFiles);
    setLabels(selectedFiles.map(() => "MAIN")); // Default label is MAIN
    const promises = selectedFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((results) => setFileContents(results))
      .catch((error) => console.error("Error reading files:", error));
  };

  const insertLabelBeforeExtension = (
    filename: string,
    label: string
  ): string => {
    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      return (
        filename.slice(0, lastDotIndex) +
        "." +
        label +
        filename.slice(lastDotIndex)
      );
    } else {
      return filename + "." + label + ".jpeg"; // If there is no extension, just append the label
    }
  };

  const handleLabelChange = (
    event: ChangeEvent<HTMLSelectElement>,
    index: number
  ): void => {
    const updatedLabels = [...labels];
    updatedLabels[index] = event.target.value;
    setLabels(updatedLabels);
  };

  const handleAsinChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setAsin(event.target.value);
  };

  const handleDownload = (): void => {
    if (fileContents.length > 0) {
      fileContents.forEach((content, index) => {
        const label = labels[index];
        const newFilename = insertLabelBeforeExtension(asin, label);

        // Create a blob object from the data URL
        const blob = dataURLtoBlob(content);

        // Create a URL for the blob object
        const blobUrl = URL.createObjectURL(blob);

        // Create a temporary anchor element to trigger download
        const downloadLink = document.createElement("a");
        downloadLink.href = blobUrl;
        downloadLink.download = newFilename;

        // Trigger the download
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Cleanup
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(blobUrl);
      });
    }
  };

  // Function to convert data URL to Blob
  const dataURLtoBlob = (dataURL: string): Blob => {
    const parts = dataURL.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  };

  return (
    <div className="app_wrapper">
      <div className="header">
        Amazon Batch Image Processor V0.2
        <div className="author">Author: Andre Nguyen</div>
      </div>

      <div className="mid_wrapper">
        <span className="steps">1. </span>
        <input
          id="files"
          type="file"
          onChange={handleFileChange}
          accept="image/jpeg"
          multiple
        />

        <h4>
          <span className="steps">2.</span> Selected Images
        </h4>
        <div className="content_wrapper">
          {files.length > 0 && (
            <>
              {files.map((file, index) => (
                <div className="image_container" key={file.name}>
                  <img
                    className="selectedImage"
                    src={fileContents[index]}
                    alt={`Image ${index}`}
                  />
                  <select
                    value={labels[index]}
                    onChange={(event) => handleLabelChange(event, index)}
                  >
                    <option value="MAIN">MAIN</option>
                    <option value="FRNT">FRNT</option>
                    <option value="SIDE">SIDE</option>
                    <option value="BACK">BACK</option>
                    <option value="PT01">PT01</option>
                    <option value="PT02">PT02</option>
                    <option value="PT03">PT03</option>
                    <option value="PT04">PT04</option>
                    <option value="PT05">PT05</option>
                    <option value="PT06">PT06</option>
                  </select>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="footer">
        <div>
          <span className="steps">3. </span>
          <label htmlFor="asin">ASIN:</label>
          <input
            id="asin"
            type="text"
            value={asin}
            onChange={handleAsinChange}
          />
        </div>
        <span className="steps">4.</span>
        {fileContents.length > 0 && (
          <button className="download_button" onClick={handleDownload}>
            Download Images
          </button>
        )}
      </div>
      {fileContents.length > 0 && <div className="preview">Preview: </div>}
    </div>
  );
}

export default App;
