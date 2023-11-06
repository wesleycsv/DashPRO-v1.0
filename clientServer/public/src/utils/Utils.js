class Utils {
  static formatDate(data) {
    let objectData = new Date(data);
    return `${String(objectData.getDate()).padStart(2, "0")}/${String(
      objectData.getMonth()
    ).padStart(
      2,
      "0"
    )}/${objectData.getFullYear()} ${objectData.getHours()}:${objectData.getMinutes()}`;
  }

  static padStartNumber(values) {
    return String(values).padStart(2, "0");
  }
}
