import React from "react";

function ImageObject() {
  return (
    <div className="image_object">
      <div className="image">Image</div>
      <label htmlFor="dropdown">Type:</label>
      <select id="dropdown" name="dropdown">
        <option value="main">MAIN</option>
        <option value="frnt">FRNT</option>
        <option value="back">BACK</option>
        <option value="pt01">PT01</option>
        <option value="pt02">PT02</option>
        <option value="pt03">PT03</option>
        <option value="pt04">PT04</option>
        <option value="pt05">PT05</option>
        <option value="pt06">PT06</option>
      </select>
    </div>
  );
}

export default ImageObject;
