class DebugInfo {
  #wrapper;
  infos = Array();
  constructor(wrapper, updateInterval) {
    this.#wrapper = wrapper;
    if (this.#wrapper.getAttribute("used") !== null) {
      console.error("This debug-wrapper already in use");
      return;
    }
    this.#wrapper.setAttribute("used", "");
    this.#wrapper.style.display = "block";
    setInterval(() => this.update(), updateInterval);
  }
  update() {
    this.#wrapper.innerHTML = "";
    this.infos.forEach((info) => {
      this.#wrapper.innerHTML += `${info}<br>`;
    });
  }
}
export default DebugInfo;
