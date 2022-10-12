import React from "react";

export default function VideoSource() {
  return (
    <div>
      <label htmlFor="cars">Choose Camera:</label>
      <select name="cars" id="cars">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </select>
    </div>
  );
}
